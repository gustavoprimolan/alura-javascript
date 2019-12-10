<h1>Aula 01 - Como saber quando o modelo mudou?</h1>


* Nossa aplicação já funciona e totaliza o volume no fim da tabela. Mas ainda falta implementar uma regra de negócio no modelo: vamos adicionar a funcionalidade que nos permite esvaziar uma lista.

* Atualmente, o arquivo ListaNegociacoes.js está assim:

```js
class ListaNegociacoes {

    constructor() {

        this._negociacoes = [];
    }

    adiciona(negociacoes) {

        this._negociacoes.push(negociacao);
    }

    get negociacoes() {

        return [].concat(this._negociacoes);
    }
}
```

* Adicionaremos o método esvazia() abaixo da linha do return():

```js
esvazia()   {

    this._negociacoes = [];
}
```

* O array de negociações receberá uma nova lista e com isso, apagará todos os itens da anterior. Ao clicarmos no botão "Apagar" do formulário, queremos que as informações sejam apagadas da lista de negociações. Para isto, sabemos que quem atua no modelo é a controller mediante às ações do usuário. Em seguida, no arquivo NegociacaoController.js, adicionaremos o método apaga():

```js
apaga() {

    this._listaNegociacoes.esvazia();
    this._negociacoesView.update(this._listaNegociacoes);

    this._mensagem.texto = 'Negociações apagadas com sucesso';
    this._mensagemView.update(this._mensagem);
}
```

* O método solicitará o modelo _listaNegociacoes.esvazia(). Observe que adicionamos o update(). Quando atualizarmos a View, esta será recarregada automaticamente e a tabela ficará limpa.

* Temos que associar a página a partir do evento de clique, e chamar o apaga(). Para isto, no index.html, adicionaremos o onclick() dentro da tag 

```html
<button> de "Apagar":

<div class="text-center">
        <button class="btn btn-primary text-center" type="button">
            Importar Negociações
        </button>
        <button onclick="negociacaoController.apaga()" class="btn btn-primary text-center" type="button">
            Apagar
        </button>
    </div>
```

* Se recarregarmos a página no navegador, nenhum problema será apontado no console e conseguiremos cadastrar uma negociação normalmente. Quando clicarmos em "Apagar", a tabela ficará vazia. A View foi atualizada com os dados do modelo da lista de negociações atualizada e a mensagem foi exibida.

* lista apagada

* Sempre que atualizarmos o modelo, é possível esquecer de chamar o modelo da View? Sim. Nós temos duas Views: MensagemView e NegociacoesView. É preciso atualizar o modelo nas duas e, depois, chamar o update(). Mas um sistema maior pode conter um número muito superior de Views e corremos o risco de esquecer de adicionar o método. Esta é uma grande responsabilidade para o desenvolvedor.

* Será que existe alguma maneira de automatizarmos a atualização da View? Vamos alterar a lista de negociações nos métodos adiciona() e apaga(), quando criarmos a instância de negociações no constructor(). Tentaremos encontrar um solução para que a View seja atualizada automaticamente assim que o modelo for alterado.

<h2>E se atualizarmos a view quando o modelo for alterado?</h2>

* Nós queremos alterar o modelo e chamar a atualização da view automaticamente quando ela for recarregada. Para resolver a questão, imagine que somos caçadores. Nós vamos colocar uma armadilha que será disparada quando alguém pisar no código do ListaNegociacoes.js.

* Em qual dos métodos seria melhor colocarmos a armadilha, considerando que o nosso objetivo é disparar a atualização da View? A melhor resposta é nos métodos adiciona() e esvazia() porque são elas que modificam as propriedades da View. Ao invocarmos o método adiciona() simultaneamente chamaremos uma armadilha que atualizará a View.

* Em seguida, adicionaremos a armadilha como parâmetro de constructor(), também vamos incluir uma propriedade chamada _armadilha.

```js
class ListaNegociacoes {

    constructor(armadilha) {

        this._negociacoes = [];
        this._armadilha = armadilha;
    }
//...
```

* A armadilha é uma função, que guardaremos no constructor() para chamá-la posteriormente - ou seja, quando chamarmos o adiciona() e esvazia().

* Em NegociacaoController, vamos adicionar o function() dentro de new ListaNegociacao. Após passarmos uma função anônima como parâmetro, ela vai executar a seguinte linha de código:

* this._negociacoesView.update(this._listaNegociacoes);
* O trecho do código ficará assim:

```js
class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._listaNegociacoes = new ListaNegociacoes(function() {

            this._negociacoesView.update(this._listaNegociacoes);
        });
       //...
```

* Fique tranquilo sobre o NegociacoesView ser declarado depois. O trecho acima só será executado quando os métodos adiciona() e esvazia() forem chamados.

* Vamos manter o negociacoesView.update() mais abaixo, para que seja feita a primeira renderização da lista. Porém, vamos apagar a mesma linha do adiciona() e apaga().

```js
 adiciona(event) {

    event.preventDefault();

    this._listaNegociacoes.adiciona(this._criaNegociacao());
    this._mensagem.texto = 'Negociação adicionada com sucesso';
    this._mensagemView.update(this._mensagem);

    this._limpaFormulario();
}

// código posterior omitido

apaga() {

    this._listaNegociacoes.esvazia();
    // Linha abaixo comentada, não precisamos mais dela
    // this._negociacoesView.update(this._listaNegociacoes);

    this._mensagem.texto = "Negociações removidas com sucesso";
    this._mensagemView.update(this._mensagem);
}
```

* Depois, faremos alterações no ListaNegociacoes.js:

```js
adiciona(negociacao) {

    this._negociacoes.push(negociacao);
    this.armadilha(this);

}
```

* No this.armadilha() passamos o model como parâmetro, que será acessado com o this. No NegociacaoController.js, adicionaremos o model em _listaNegociacoes e também no update().

```js
class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._listaNegociacoes = new ListaNegociacoes(function(model) {

            this._negociacoesView.update(model);
        });
```

* Criamos o _listaNegociacoes, passei a função que será chamada quando usarmos o adiciona() e o esvazia(), os dois métodos passaram o modelo como parâmetro. Depois, voltaremos para o ListaNegociacoes.js, e adicionaremos o this.armadilha(this) no método esvazia():

```js
esvazia() {

    this._negociacoes = [];
    this.armadilha(this);
}
```

* Vamos recarregar a página e testar se nossa armadilha funcionará. Mas ela não vai... No Console, veremos uma mensagem de erro:

* uncaught type error: this.armadilha is not a fucntion

* Ele nos diz que o this.armadilha não é uma função dentro de ListaNegociacoes.

* Teremos que fazer alguns ajustes, primeiramente, adicionaremos o prefixo _ ao armadilha:

```js
class ListaNegociacoes {

    constructor(armadilha) {
        this._negociacoes = [];
        this._armadilha = armadilha;
    }

    adiciona(negociacao) {
        this._negociacoes.push(negociacao);
        this._armadilha(this);
    }

    get negociacoes() {
        return [].concat(this._negociacoes);
    }

    esvazia() {
        this._negociacoes = [];
        this._armadilha(this);
    }
}
```

* Depois, temos que resolver um problema no constructor de NegociacaoController().

```js
this._listaNegociacoes = new ListaNegociacoes(function(model) {
           this._negociacoesView.update(model);
```

* Quando o _armadilha é executado, o this._negociacoesView não existe. Isto ocorre, porque a função é executada em um contexto dinâmico de ListaNegociacoes(). O this dentro de uma função, para ser avaliado, depende do contexto no qual ela foi executada - no caso, o contexto será de ListaNegociacoes. Então, this é a _listaNegociacoes, porém, esta não tem _negociacoesView. Para resolver, precisamos que o this seja NegociacaoController, porque toda função JavaScript tem o escopo this dinâmico, que varia de acordo com o contexto. Vamos fazer um teste, adicionando o console.log() em _listaNegociacoes:

```js
this._listaNegociacoes = new ListaNegociacoes(function(model) {
          console.log(this);
          this._negociacoesView.update(model);
```

* Testaremos preencher o formulário, no Console, veremos outra mensagem de erro:

* ListaNegociacoes, uncaught type error: cannot read property 'update' of undefined

* Ele mostra que this é o ListaNegociacoes. É assim, porque a função está sendo executada no contexto de _listaNegociacoes. Tem como fazer com o contexto de this seja o NegociacaoController? É o que veremos mais adiante.


<h2>API Reflection e as facetas de this</h2>


* Temos uma função com o escopo dinâmico:

```js
class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new ListaNegociacoes(function(model) {
            this._negociacoesView.update(model);
        });
//...
```

* O this irá variar de acordo com o contexto da execução. Como a função será chamada dentro da classe ListaNegociacoes, ele será usado como contexto do this da função.

```js
this._listaNegociacoes = new ListaNegociacoes(function(model) {
    this._negociacoesView.update(model);
});
```

* Mas para que o código funcione, queremos que o this tenha como contexto o NegociacaoController. Da mesma maneira que o this é dinâmico, nós programaticamente podemos modificá-lo. Como faremos isso? Primeiramente, no construtor de _listaNegociacoes, adicionaremos o primeiro parâmetro: this - referente ao NegociacaoController.

```js
class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new ListaNegociacoes(this, function(model) {
            this._negociacoesView.update(model);
        });
```

* Este que será recebido depois em ListaNegociacoes.js, como contexto:

```js
class ListaNegociacoes {

  constructor(contexto, armadilha) {

        this._negociacoes = [];
        this._armadilha = armadilha;
        this._contexto = contexto;
  }
//...
```

* Observe que criamos o atributo _contexto.

* Agora o construtor do model recebe o contexto, no qual queremos que ele execute uma função. Mas para que o this seja realmente o NegociacaoController, teremos que mudar a maneira de chamar a função utilizada. Pediremos uma ajuda para a API de Reflexão do JavaScript, adicionando em ListaNegociacoes.js o Reflect.apply. Com isto, chamaremos o método estático da classe:

```js
adiciona(negociacao) {
    this._negociacoes.push(negociacao);
    //this._armadilha(this);
    Reflect.apply(this._armadilha, this._contexto, [this]);
}

get negociacoes() {
    return [].concat(this._negociacoes);
}

esvazia() {
    this._negociacoes = [];
    //this._armadilha(this);
    Reflect.apply(this._armadilha, this._contexto, [this]);
}
```

* Observe que fizemos algumas alterações nos métodos adiciona() e esvazia(). O Reflect.apply recebeu o this._armadilha como primeiro parâmetro e o segundo é this._contexto. O terceiro parâmetro é o [this], que será a própria ListaNegociacoes. Depois, adicionamos o Reflect.apply() também no esvazia().

* Se executarmos o código, o formulário continua funcionando normalmente.

* formulario funcionado

* Nós conseguimos redefinir o contexto em que queremos executar a função de _listaNegociacoes, utilizando o Reflect.apply(). O método apply() recebeu a função executada, depois o contexto e os parâmetros que serão passados para a função. Fizemos isto com o adiciona() e o esvazia().

```js
adiciona(negociacao) {
    this._negociacoes.push(negociacao);
    //this._armadilha(this);
    Reflect.apply(this._armadilha, this._contexto, [this]);
}
```

* A função espera receber um modelo no NegociacaoController, dentro do constructor:

```js
this._listaNegociacoes = new ListaNegociacoes(this, function(model) {
    this._negociacoesView.update(model);
});
```

* No método adiciona(), passaremos o [this] que será o ListaNegociacoes. O nosso código está funcionando corretamente, mas será que existe outra maneira de conseguirmos o mesmo efeito, sem ter que passar o contexto para o model? Veremos mais adiante.

<h2>Arrow function e seu escopo léxico</h2>

* Nós queremos que function() execute, mas que this seja o NegociacaoController sem precisarmos passar um contexto:

```js
class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new ListaNegociacoes(this, function(model) {
            this._negociacoesView.update(model);
        });
//...

```

* Começaremos removendo o this da função:

```js
this._listaNegociacoes = new ListaNegociacoes(function(model) {
    this._negociacoesView.update(model);
});
```

* Vamos retirar também o contexto de ListaNegociacoes:

```js
class ListaNegociacoes {

  constructor(armadilha) {

        this._negociacoes = [];
        this._armadilha = armadilha;
  }
  adiciona(negociacao) {
      this._negociacoes.push(negociacao);
      this._armadilha(this);
  }

  get negociacoes() {
      return [].concat(this._negociacoes);
  }

  esvazia() {
      this._negociacoes = [];
      this._armadilha(this);
  }

//...
```

* Retiramos o Reflect.apply() e deixamos o código como estava anteriormente. Agora será preciso encontrar um forma para que quando o _armadilha(this) seja executado o contexto seja NegociacaoController.

* Primeiramente, faremos um pequeno ajuste no NegociacaoController, ao adicionarmos uma arrow function, usando =>:

```js
class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new ListaNegociacoes(model =>
            this._negociacoesView.update(model));
    }
}
```

* Porém, se executarmos o código, seremos surpreendidos com o formulário funcionando corretamente. Como isso é possível? Isto ocorre porque a arrow function não é apenas uma maneira sucinta de escrever uma função, ela também tem um característica peculiar: o escopo de this é léxico, em vez de ser dinâmico como a outra função. Isto significa que o this não mudará de acordo com o contexto. Da maneira como estruturamos o código, o this será NegociacaoController - esta condição será mantida independente do local em que chamemos a arrow function, porque ela está amarrada a um escopo imutável.

* Então, o this de uma arrow function é léxico, enquanto o this de uma função padrão é dinâmico. Com esse ajuste, conseguimos deixar o nosso código mais sucinto.


<h1>Aula 02 - Existe modelo mentiroso? O padrão de projeto Proxy!</h1>

<h2> Modelo e reutilização em projetos</h2>

* Para liberarmos o desenvolvedor da responsabilidade de atualizar programaticamente a View sempre que o modelo fosse atualizado, nós colocamos "armadilhas": funções que eram chamadas quando métodos específicos eram executados. Desta forma, chamávamos automaticamente a atualização da View. Nós declaramos o modelo no inicio, definimos as ações que deveriam acontecer quando ocorria a modificação, e assim liberamos o desenvolvedor da responsabilidade.

* No entanto, esta solução deixa a desejar porque coloca código de infraestrutura - ou seja, de atualização da View - no modelo. Geralmente, a parte mais reutilizada de um sistema é o modelo. Então, ao acessarmos um modelo de negociação e encontrarmos um atributo chamado _armadilha, por exemplo:

```js
class ListaNegociacoes {

    constructor(armadilha) {

        this._negociacoes = [];
        this._armadilha = armadilha;
    }
//...
```

* O que _armadilha tem a ver com a lista de negociação? Ela foi usada apenas para aplicar o artifício que chama a View automaticamente. E se tivéssemos outros métodos que quiséssemos monitorar e executar uma armadilha? Teríamos que alterar a classe do modelo. Então, o modelo é a parte mais reutilizável. Se agora não quisermos mais utilizar um sistema baseado em MVC, podemos optar em usar o AngularJS ou outro framework.


* Mas se começamos a incluir diversos itens de infraestrutura, de recursos para que ela gere benefícios - como a atualização de View - começamos a não reutilizar continuamente o modelo. Encontraremos uma forma de manter o modelo intacto, sem utilizarmos armadilhas e ainda assim, conseguir executar um código arbitrário quando algum método for chamado. A seguir, encontraremos uma solução para a questão.

<h2>O padrão de projeto Proxy</h2>

* Veremos qual é a solução que nos permite manter o modelo... Começaremos retirando o _armadilha de ListaNegociacoes:

```js
class ListaNegociacoes {

  constructor() {

        this._negociacoes = [];
  }
  adiciona(negociacao) {
      this._negociacoes.push(negociacao);
  }

  get negociacoes() {
      return [].concat(this._negociacoes);
  }

  esvazia() {
      this._negociacoes = [];
  }
}
```

* Como removemos o _armadilha, o construtor de NegociacaoController deixará de funcionar e descobriremos uma forma de resolver problema da View. Temos ainda outro problema com a solução que usa o _armadilha: se quisermos monitorar os models Mensagem e Negociacoes, teremos que abrir a classe para alterar e colocar a armadilha - mas, não faremos isto.

* Existe um famoso padrão de projeto chamado Proxy, que de forma resumida, é "um cara mentiroso". Vimos que não é bom inserirmos armadilhas na classe, porque estaremos perdendo a reutilização do modelo e teremos que repetir em todos os modelos do sistema. No entanto, o Proxy é idêntico ao objeto que queremos trabalhar, e teremos bastante dificuldade de diferenciá-los. Nós acessamos o Proxy como se ele fosse o objeto real, este último ficará escondido dentro do outro. Nós substituímos o objeto real, que só poderá ser acessado por meio do Proxy - que pode ou não ser executado em um código arbitrário se assim definirmos.

* Observe que ListaNegociacoes tem o métodos adiciona() e negociacoes(), que também estarão presentes no Proxy.

```js
class ListaNegociacoes {

  constructor(armadilha) {

        this._negociacoes = [];
        this._armadilha = armadilha;
  }
  adiciona(negociacao) {
      this._negociacoes.push(negociacao);
      this._armadilha(this);
  }

  get negociacoes() {
      return [].concat(this._negociacoes);
  }

  esvazia() {
      this._negociacoes = [];
      this._armadilha(this);
  }
```

* A diferença está em que quando chamarmos o adiciona(), o Proxy delegará a chamada do método para o objeto encapsulado por ele. Mas ainda não temos benefícios com esta mudança. A vantagem está que colocaremos as armadilhas entre a chamada do Proxy e o objeto real. Toda vez que acessamos o Proxy, executaremos um código antes de chamarmos um método ou propriedade correspondente ao objeto real.

* A boa notícia é que não precisamos implementar esse padrão de projeto.

* A partir da versão 2015 do ECMAScript, a própria linguagem já possui um recurso de Proxy. Então, implementaremos o padrão de projeto Proxy usando o ES6.

<h2>Aprendendo a trabalhar com o Proxy</h2>

* Vamos aprender a trabalhar com o Proxy. Começaremos comentando o código de NegociacaoController, porque ele não está válido devido a remoção da armadilha passada para o construtor.

```js
class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        /*
        this._listaNegociacoes = 
            new ListaNegociacoes(model => this._negociacoesView.update(model));
            */
//...
```

* Depois, abriremos o Console no navegador. Veremos uma mensagem de erro, porque a negociação está com problema. Começaremos criando um negociacao:

```js
let negociacao = new Negociacao(new Date(), 1, 100);
undefined
let negociacaoProxy = new Proxy(negociacao, {});
```

* Criaremos um Proxy de negociacao. O segundo parâmetro é um objeto no formato literal {}, em que iremos configurar nossas armadilhas. Em seguida, digitaremos a seguinte linha:

```js
negocicacaoProxy.valor
100
```

* Ao acessarmos valor, o retorno será 100. Conseguimos ter acesso a quantidade e volume:

```js
negocicacaoProxy.valor
100
negociacaoProxy.quantidade
1
negocicacaoProxy.volume
100
```

* O Proxy terá exatamente o mesmo comportamento do objeto.

* Proxy no console

* No entanto, não queremos que ninguém tenha acesso ao objeto real (negociacao), caso contrário, ninguém cairá nas armadilhas. Para isto, executaremos a seguinte linha no Console:

```js
let negociacao = new Proxy(new Negociacao(new Date(), 1, 100), {});
```

* Neste caso, negociacao é o Proxy:

* negociacao é o Proxy

* Agora, a única maneira de lidar com a instância de negociação criada é por intermédio do Proxy. Precisamos aprender como passamos o handlers ({}) para colocarmos nossas armadilhas. Adicionaremos outra tag <script> no index.html e depois, colocaremos o código que executamos no Console.

```html
<script>

    let negociacao = new Proxy(new Negociacao(new Date(), 2, 100), {

      });

</script>
```

* Mais adiante, definiremos o handler.

<h2>Construindo armadilhas de leitura</h2>

* Nós já criamos uma Proxy. Em seguida, adicionaremos o console.log:

```html
<script>
    let negociacao = new Proxy(new Negociacao(new Date(), 1, 100), {});

    console.log(negociacao.quantidade);
    console.log(negociacao.valor);

</script>
```

* Se executarmos o código, veremos os valores 1 e 100 impressos no Console.

* valores no console

* No entanto, queremos executar um código antes de exibirmos o valor de quantidade, queremos que seja visualizado um texto informando que a quantidade foi acessada. Faremos com que o texto também seja exibido antes da propriedade valor. A seguir, adicionaremos uma função que receberá três parâmetros: target, prop e receive.

```html
<script>
    let negociacao = new Proxy(new Negociacao(new Date(), 2, 100), {

        get: function(target, prop, receiver) {

              console.log(`a propriedade "${prop}" foi interceptada`);
        }
    });

    console.log(negociacao.quantidade);
    console.log(negociacao.valor);

  </script>
```

* O getserá chamado sempre que tentarmos ler uma das propriedades do objeto. Ao ser chamado, ele tem o target (uma referência ao objeto original que está encapsulado pelo Proxy), a propriedade (prop) que está sendo acessada, e uma referência (receiver) para o Proxy. Agora, antes de ser exibidos os valores das propriedades, os textos devem ser exibidos.

* No navegador, vamos obter o resultado esperado:

* a propriedade foi interceptada

* Porém, os valores das propriedades resultaram em undefined. Isto ocorreu, porque quando executamos uma armadilha (trap, traduzido para o inglês), é necessário informar qual será o valor retornado após a interceptação da propriedade de leitura. Adicionaremos o return:

```html
   <script>

       let negociacao = new Proxy(new Negociacao(new Date(), 1, 100), {

           get: function(target, prop, receiver) {

                 console.log(`a propriedade "${prop}" foi interceptada`);
                 return 'Flávio';
           }
       });
       console.log(negociacao.quantidade);
       console.log(negociacao.valor);
 </script>
```

* Veja o que será exibido no Console:

* return Flavio

* Quando acessamos negociacao.valor, ele retorna Flávio. Mas não é o que queremos... Queremos o valor verdadeiramente guardado. Para isto, vamos pedir auxilio para a API de Reflect.get() e os três parâmetros. Nós queremos executar uma operação de leitura.

```html
get: function(target, prop, receiver) {

     console.log(`a propriedade "${prop}" foi interceptada`);
     return Reflect.get(target, prop, receiver);
}
```

* No navegador, ele imprimirá o texto e os valores das propriedades.

* mensagens no console

* Mas por que a mensagem foi impressa duas vezes, com um pequena diferença. Isto ocorre, porque no arquivo Negociacao.js, ele irá interceptar para quantidade e _quantidade.

```html
get quantidade() {

    return this._quantidade;
}

get valor() {
  return this._valor;
}
```

* O mesmo acontecerá com valor e _valor. Então nosso código funciona.

* Nós vimos como executar um código, antes da leitura das propriedades do objeto. Mas para resolvermos o problema da atualização automática da View - lembrando que não queremos atualizá-la enquanto estivermos lendo um dado. Mas este não é o nosso foco. O objetivo é encontrar uma forma de executar o código quando uma propriedade é modificada. Veremos mais adiante.

<h2>Construindo armadilhas de escrita</h2>

* Não estamos interessados em executar um código quando ocorrer a leitura, e sim, quando acontecer a modificação de alguma propriedade. Em seguida, faremos pequenas alterações no arquivo index.html. Atualmente, o get está assim:

```html
<script>

    let negociacao = new Proxy(new Negociacao(new Date(), 1, 100), {
    get: function(target, prop, receiver) {

         console.log(`a propriedade "${prop}" foi interceptada`);
         return Reflect.get(target, prop, receiver);
    }
    });
    negociacao.quantidade = 10;
    negociacao.valor = 100;
</script>
```

* Mas esse código ainda não funcionará, porque quantidade e valor em Negociacao.js são getters. Por isso, não podemos fazer uma atribuição, considerando que são apenas leitura e não podem ser alterados. De volta ao index.html, faremos uma "licença poética" e acessaremos diretamente as propriedades privates.

```js
negociacao._quantidade = 10;
negociacao._valor = 100;
```

* Vamos desrespeitar a convenção da nossa propriedade, mas com isso, poderemos disparar a nossa armadilha.

* A primeira coisa que devemos fazer para executar uma armadilha quando estou atribuindo, é alterarmos de get para set. Também adicionaremos outro parâmetro: value.

```html
<script>

    let negociacao = new Proxy(new Negociacao(new Date(), 1, 100), {
    set: function(target, prop, value, receiver) {

         console.log(`a propriedade "${prop}" foi interceptada`);
         return Reflect.set(target, prop, value, receiver);
    });
    negociacao._quantidade = 10;
    negociacao._valor = 100;
</script>
```

* Quando atribuímos 10 para _quantidade, a função no set será chamada e retornará os quatro parâmetros. No console.log() queremos exibir o valor atual e o que será exibido depois.

```html
<script>

    let negociacao = new Proxy(new Negociacao(new Date(), 1, 100), {
    set: function(target, prop, value, receiver) {

         console.log(`novo valor: ${value}`);
         return Reflect.set(target, prop, value, receiver);
}
    });
    negociacao._quantidade = 10;
    negociacao._valor = 100;
</script>
```

* Com o value no console.log exibiremos o valor que queremos atribuir.

* novo valor

* A armadilha foi executada e os valores exibidos estão corretos. Mas também queremos mostrar o valor antigo, para isto, só teremos acesso ao target que é o objeto Negociacao. Vamos tentar usar o seguinte código no console.log:

```js
console.log(`${target.quantidade} novo valor: ${value}`);
return Reflect.set(target, prop, value, receiver);
```

* No Console. veremos os seguintes valores:

* target no Console

* Para quantidade, o valor antigo ficou igual a 1, e o mesmo para o valor. A explicação é que a linha do console.log está sendo executada também quando tentamos descobrir o negociacao._valor. Então, o valor de quantidade deve ser igual ao valor de prop. Mas como conseguiremos fazer a property dinâmica? Não temos a opção de usar ${target.prop}, mas podemos usar um recurso do JS, podemos passar ${target[prop]}. O trecho do código ficará assim:

```html
<script>

  let negociacao = new Proxy(new Negociacao(new Date(), 1, 100), {
    set: function(target, prop, value, receiver) {

         console.log(`${target[prop]} novo valor: ${value}`);
         return Reflect.set(target, prop, value, receiver);
}
    });
    negociacao._quantidade = 10;
    negociacao._valor = 100;
</script>
```

* O prop junto com o target será o _quantidade e conseguirá ler o valor. Em seguida, adicionaremos valor anterior: à linha.

```html
<script>

  let negociacao = new Proxy(new Negociacao(new Date(), 2, 100), {
    set: function(target, prop, value, receiver) {

         console.log(`valor anterior: ${target[prop]} novo valor: ${value}`);
         return Reflect.set(target, prop, value, receiver);
}
    });
    negociacao._quantidade = 10;
    negociacao._valor = 200;
</script>
```

* No Console, veremos os seguintes valores:

* valor anterior no Console

* Com isso, resolvemos o problema da execução de um código que só atualizará a View quando _quantidade e _valor forem alterados.

<h2>Método que não altera propriedade</h2>

* Agora que ensaiamos com o negociacao, vamos nos focar em criar a Proxy no modelo do ListaNegociacoes. No index.html, vamos substituir no código negociacao por ListaNegociacoes. Mudaremos também o console.log pelo lista.adiciona().

```html
<script>

  let lista = new Proxy(new ListaNegociacoes(), {
    set: function(target, prop, value, receiver) {

         console.log(`valor anterior: ${target[prop]} novo valor: ${value}`);
         return Reflect.set(target, prop, value, receiver);
    }
  });
  lista.adiciona(new Negociacao(new Date(), 1, 100));
</script>
```

* Se tentarmos executar o código como está, nada acontecerá. Nós já entendemos que devemos usar o get quando estamos olhando uma propriedade e o set quando queremos modificar uma propriedade. No entanto, a armadilha não foi disparada no lista.adiciona(). Sabe por que isto aconteceu? O adiciona() é um método, que no arquivo ListaNegociacoes.js, pede internamente para negociacoes fazer o push().

```js
adiciona(negociacao) {

    this._negociacoes.push(negociacao);

}
```

* Porém, nós não atribuímos valores para uma propriedade, sendo assim, o set não será chamado. Teremos que encontrar uma solução, porque tanto o método adiciona() como o esvazia() terá este tipo de problema - ainda que o segundo, atribua um valor para negociacoes. Vamos fazer um teste, adicionando o esvazia(), no index.html:

```html
<script>

  let lista = new Proxy(new ListaNegociacoes(), {
    set: function(target, prop, value, receiver) {

         console.log(`valor anterior: ${target[prop]} novo valor: ${value}`);
         return Reflect.set(target, prop, value, receiver);
    }
  });
  lista.adiciona(new Negociacao(new Date(), 1, 100));
  lista.esvazia();
</script>
```

* esvazia no Console

* O esvazia() executou o código, porque o valor anterior: era um objeto e o novo valor: ficou vazio. Nós queremos que o interceptador dispare com o lista.adiciona. No entanto, por padrão, não conseguiremos fazer isto usando o Proxy do ES6.

* Mas não vamos ignorar o que vimos até aqui.

<h2>Uma solução para método que não altera propriedade</h2>

* Nós não vamos nos abdicar de utilizar o Proxy. Mas a primeira tentativa de solucionar o assunto será com uma "gambiarra". Em ListaNegociacoes, vamos forçar uma atribuição em this._negociacoes.

```js
class ListaNegociacoes {

    constructor() {
        this._negociacoes = [];
    }

    adiciona(negociacao) {

        this._negociacoes = [].concat(this._negociacoes, negociacao);
        // this._negociacoes.push(negociacao);
    }
```

* Com o concat(), podemos passar tanto o array quanto o elemento, além de outros parâmetros - e todos serão concatenados. Como forçamos uma atribuição, quando recarregamos a página, veremos no Console:

```js
_negociacoes => valor anterior: , novo valor: [object Object]
_negociacoes => valor anterior: está saindo em branco, porque o valor anterior é um array vazio. O novo valor tem o object porque se trata do novo array.
```

* É possível resolver com esta gambiarra, mas não será esta a solução que utilizaremos. Imagine que fazemos um loop de 100 negociações, se nosso código ficar assim, a cada negociação adicionada, teremos que criar um nova lista e reatribuir para ListaNegociacoes. Teríamos problema com a performance. Apesar de termos feito o mesmo no get:

```js
get negociacoes() {

    return [].concat(this._negociacoes);
}
```

* Mas neste caso, quem pede a lista de negociação não fará solicitação infinitas vezes seguidas. É possível varrer a lista diversas vezes, sem chamar get sempre. O mesmo não ocorre com adiciona(). Se queremos fazer uma operação em lote, usaremos o adiciona(). Precisamos descobrir uma outra estratégia - mais de "cangaceiro" do que de "ninja". Ao identificarmos o adiciona() como um método no index.html, queremos executar a armadilha.

```html
<script>

  let lista = new Proxy(new ListaNegociacoes(), {
    set: function(target, prop, value, receiver) {

         console.log(`valor anterior: ${target[prop]} novo valor: ${value}`);
         return Reflect.set(target, prop, value, receiver);
    }});
    lista.adiciona(new Negociacao(new Negociacao(new Date(), 1, 100));
</script>
```

* Não há uma maneira de interceptarmos o método com o Proxy. Quando chamamos um método no JavaScript, por exemplo o adiciona(), ele fará um get na função e depois, executará o Reflect.apply. Então, será passado o valor para a função dentro do parênteses. Mas o set não está incluso no método.

* A seguir, resolveremos o assunto.

<h2>Construindo armadilhas para métodos</h2>

* Vamos procurar a solução "cangaceira" para resolvermos o nosso problema. Lembra que anteriormente falamos que quando chamamos uma função, o JavaScript fará um getter e após a leitura, será enviada um apply. Teremos que substituir o set para o get:

```html
<script>

  let lista = new Proxy(new ListaNegociacoes(), {
    get: function(target, prop, receiver) {

    }
  });
    lista.adiciona(new Negociacao(new Date(), 1, 100));
</script>
```

* Observe que o get não receberá o value. A questão é: quando o getter for executado, queremos perguntar se ele está na lista de métodos que queremos interceptar. Para isto, adicionaremos um if para o get.

```js
get: function(target, prop, receiver) {
    if(['adiciona', 'esvazia'].includes(prop) && typeof(target[prop]) == typeof(Function)) {

    }
}
```

* Criaremos uma condição que testará se o método incluído é o adiciona() ou o esvazia(), que tem ou não props (uma novidade do ES6 é podermos fazer este tipo de pergunta para o array) e se é uma função. Para testarmos esta última parte, usamos o typeof[], que recebeu a propriedade do target. Se isso é uma função ou método, o typeof será o parâmetro. Vamos verificar se isso é o typeof de Function.

* Se viermos no Console e digitarmos Function, veremos que existe uma função chamada function em JavaScript:

```js
Function
function Function() { [native code] }
```

* Se a propriedade corresponde a adiciona() ou esvazia() e é uma função, faremos algo a respeito. Caso contrário, faremos a leitura de um get padrão.

```html
<script>

  let lista = new Proxy(new ListaNegociacoes(), {
    get: function(target, prop, receiver) {
        if(['adiciona', 'esvazia'].includes(prop) && typeof(target[prop]) == typeof(Function)) {

        }
        return Reflect.get(target, prop, receiver);
    }
    });
      lista.adiciona(new Negociacao(new Date(), 1, 100));
 </script>
```

* Se está ou não na nossa lista, teremos o retorno do valor, considerando que estamos fazendo um get. Adicionaremos o lista._negociacoes:

```js
lista.adiciona(new Negociacao(new Date(), 1, 100))
lista._negociacoes;
```

* Com isso, já faremos um get. E o que iremos devolver? Se a propriedade está na lista (de adiciona() ou esvazia()) e é uma função, em vez de retornarmos um valor direto, retornaremos uma função.

* Tem que ser function para ter o this dinâmico. Não pode ser arrow function que possui escopo léxico.

* A função não pode ser arrow function, porque ela deve ter um contexto dinâmico, e dentro, substituiremos o método por outro que tem a armadilha - porém, a substituição será feita no Proxy. No entanto, este não nos permite colocar uma armadilha para método, encontraremos um forma de que ao cairmos no método substituiremos por outro do Proxy. Falamos do return.

```html
<script>

  let lista = new Proxy(new ListaNegociacoes(), {

    get: function(target, prop, receiver) {
        if(['adiciona', 'esvazia'].includes(prop) && typeof(target[prop]) == typeof(Function)) {
        return function() {
console.log(`a propriedade "${prop}" foi interceptada`);
            }
        }
        return Reflect.get(target, prop, receiver);
    });
      lista.adiciona(new Negociacao(new Date(), 1, 100));
    lista._negociacoes
</script>
```

* Agora, teremos que fazer o método receber os parâmetros que ele está recebendo aqui. Como estamos substituindo e retornando a função, substituiremos o adiciona(), quando este método for chamado estaremos chamando na verdade, o console.log. No entanto, precisamos fazer com que o adiciona() receba o parâmetro original dele:

```js
lista.adiciona(new Negociacao(new Date(), 1, 100));
```

* Como a função no if, substituirá o método adiciona(), existe um objeto implícito chamado arguments que dá acesso a todos os parâmetros passados para a função. A seguir, usaremos o Reflect.apply(), e chamaremos uma função.

```js
if(['adiciona', 'esvazia'].includes(prop) && typeof(target[prop]) == typeof(Function)) {
   return function() {

        console.log(`a propriedade "${prop}" foi interceptada`);
        Reflect.apply(target[prop], target, arguments);
 }
```

* Vamos entender o que foi feito até aqui... Ao fazemos métodos e funções o Proxy sempre entende que é um get, quando fazemos o lista.adiciona(). No get, perguntaremos "você está na lista de itens que quero interceptar? E você é uma função?" Caso a resposta seja positiva, iremos substituir o adiciona()ou o esvazia() no Proxy. A substituição será feita por uma nova função. Então, ao ser chamada, a função imprimirá o conteúdo do console.log, porque a função lembrará do contexto de execução e quem é prop. Com o Reflect.apply(), faremos a função receber os parâmetros dela. O arguments é uma variável implícita que dá acesso a todos os parâmetros da função quando esta é chamada. Foi uma maneira de via get ter acesso aos parâmetros da função.


* Ao recarregarmos a página no navegador, veremos a confirmação de que foi interceptado adiciona.

* interceptado adiciona

* O mesmo ocorrerá se chamarmos o lista.esvazia():

```js
lista.adiciona(new Negociacao(new Date(), 1, 100));
lista.esvazia();
```

* No Console, veremos o interceptado esvazia.

* interceptado esvazia

* Desta forma, encontramos uma maneira de escolher qual método queremos interceptar e executar o código. Antes de continuarmos, faremos um pequeno ajuste no get:

```js
get(target, prop, receiver) {
    if(['adiciona', 'esvazia'].includes(prop) && typeof(target[prop]) == typeof(Function)) {

        return function() {

          console.log(`a propriedade "${prop}" foi interceptada`);
          Reflect.apply(target[prop], target, arguments);
        }

    }
    return Reflect.get(target, prop, receiver);

  }
```

* Agora, precisamos substituir o trecho de código no Controller. Vamos aplicar efetivamente no nosso sistema.


<h2>Aplicando a solução no NegociacaoController</h2>

* Você pode estar pensando "será que existe uma maneira mais fácil de fazer o que queremos?". A resposta é sim. Conheceremos a forma mais simples, depois. Primeiramente, vamos levar a estratégia criada no index.html, para o NegociacoesController.

* Abaixo dos inputs do constructor(), adicionaremos o seguinte trecho do código:

```js
this._listaNegociacoes = new Proxy(new ListaNegociacoes(), {

    get(target, prop, receiver) {

        if(['adiciona', 'esvazia'].includes(prop) && typeof(target[prop]) == typeof(Function)) {

            return function(){

              console.log(`método '${prop}' interceptado`);

             Reflect.apply(target[prop], target, arguments);

              this._negociacoesView.update(target);

            }
     }

     return Reflect.get(target, prop, receiver);
  }
});
```

* Passamos o model como parâmetro do update(), ao adicionarmos o target. No entanto, o nosso código terá problema porque o this não será o controller, nem se usássemos uma arrow function. Por isso, vamos inserir uma variável chamada self. que receberá this.

```js
let self = this;

this._listaNegociacoes = new Proxy(new ListaNegociacoes(), {

    get(target, prop, receiver) {

        if(['adiciona', 'esvazia'].includes(prop) && typeof(target[prop]) == typeof(Function)) {

            return function(){

              console.log(`método '${prop}' interceptado`);

             Reflect.apply(target[prop], target, arguments);

              self._negociacoesView.update(target);

            }
     }

     return Reflect.get(target, prop, receiver);
  }
});
```

* Faremos um teste a seguir, mas faltou um detalhe: só podemos chamar a atualização da View, depois de aplicar o valor depois do target. Vamos testar no navegador, e veremos que o método foi interceptado.

* inteceptando o adiciona

* Então, o código está funcionando. Nós tivemos que aprender a lidar com as particularidades do Proxy, e assim, não "sujamos" o nosso modelo. Mais adiante veremos como esconder a complexidade de criação do Proxy. O nosso código ficou muito verboso. Inclusive, não vamos inserir um Proxy para MensagemView, mas seria um erro repetir todo este código novamente.

* Por enquanto, só brincaremos com o listaNegociacoes. A seguir, vamos aplicar um outro padrão de projeto que nos ajudará bastante na criação de um Proxy. Mas a forma de se trabalhar internamente já foi apresentada.

<h2>E se alguém criasse nossos proxies? O Padrão de Projeto Factory</h2>
