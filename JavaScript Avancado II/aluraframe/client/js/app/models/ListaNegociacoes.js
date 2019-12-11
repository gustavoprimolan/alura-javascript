class ListaNegociacoes {
    
    // constructor(armadilha) {
    constructor() {
        this._negociacoes = [];

        //NÃO É UMA BOA PRÁTICA DEIXAR REGRAS DE INFRAESTRUTURA NOS MEUS MODELOS
        // this._armadilha = armadilha;

    }
    
    adiciona(negociacao) {
        this._negociacoes.push(negociacao);
        // this._armadilha(this);
        //API DE RELFEXÃO DO JAVASCRIPT
        //PRIMEIRO PARAMETRO É O METODO QUE EU QUERO CHAMAR
        //SEGUNDO É O CONTEXTO
        //QUAIS PARAMETROS ATRAVÉS DE UM ARRAY A FUNÇÃO VAI RECEBER
        // Reflect.apply(this._armadilha, this._contexto, []);

    }
    
    get negociacoes() {
        return [].concat(this._negociacoes);
    }

    esvazia() {
        this._negociacoes = [];
        // this._armadilha(this); // NÃO FUNCIONA SEM ARROW FUNCTION
        // Reflect.apply(this._armadilha, this._contexto, []);
    }

}