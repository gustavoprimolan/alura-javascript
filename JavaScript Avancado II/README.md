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
