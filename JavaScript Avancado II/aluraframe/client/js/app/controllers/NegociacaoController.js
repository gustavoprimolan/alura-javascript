class NegociacaoController {
    
    constructor() {
        
        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        //IMPLENETAÇÃO COM O CONTEXTO
        // this._listaNegociacoes = new ListaNegociacoes(this, function (model) {
        //     this._negociacoesView.update(model);
        // });
        //ARROW FUNCTION NÃO É SÓ UMA MANEIRA SUCINTA PARA ESCREVER UMA FUNÇÃO
        //O ESCOPO DO ARROW FUNCTION É LÉXICO, OU SEJA, ELE NÃO MUDA DE ACORDO COM O CONTEXTO
        //NO MOMENTO QUE EU PASSO O this PARA O ARROW FUNCION É O NegociacaoCOntroller E NÃO DE ListaNegociacoes
        //COMO ESTAVA ACONTECENDO COM A FUNCTION
        // this._listaNegociacoes = new ListaNegociacoes((model) => this._negociacoesView.update(model));

        // this._listaNegociacoes = ProxyFactory.create(new ListaNegociacoes(), ['adiciona', 'esvazia'], model => this._negociacoesView.update(model));
        // this._negociacoesView = new NegociacoesView($('#negociacoesView'));
        // this._listaNegociacoes = new Bind(new ListaNegociacoes(), this._negociacoesView, ['adiciona', 'esvazia']);
        this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia');

        // this._mensagemView = new MensagemView($('#mensagemView'));
        // this._mensagem = new Mensagem();
        // this._mensagem = ProxyFactory.create(new Mensagem(), ['texto'], model => this._mensagemView.update(model));
        // this._mensagem = new Bind(new Mensagem(), this._mensagemView, ['texto']);
        this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');

    }
    
    adiciona(event) {
        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());
        this._mensagem.texto = 'Negociação adicionada com sucesso';
        this._limpaFormulario();
    }

    apaga() {
        this._listaNegociacoes.esvazia();
        this._mensagem.texto = 'Negociações apagadas com sucesso';
    }

    _criaNegociacao() {
        
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value);    
    }
    
    _limpaFormulario() {
     
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();   
    }
}