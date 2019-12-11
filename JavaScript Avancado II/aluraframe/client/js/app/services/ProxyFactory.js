class ProxyFactory {

    static create(objeto, props, acao) {
        return new Proxy(objeto, {

            get(target, prop, receiver) {

                if(props.includes(prop) && ProxyFactory._ehFuncao(target[prop]) ){

                    return function() {
                        console.log("get proxy");
                        Reflect.apply(target[prop], target, arguments);
                        return acao(target);
                    }
                }
                console.log("get proxy");
                return Reflect.get(target, prop, receiver);
            },

            set(target, prop, value, receiver) {
                if(props.includes(prop)) {
                    console.log("set proxy");
                    acao(target);
                }
                console.log("set proxy");
                return Reflect.set(target, prop, value, receiver);
            }

        });

    }

    static _ehFuncao(func) {
        return typeof(func) == typeof(Function);
    }

}