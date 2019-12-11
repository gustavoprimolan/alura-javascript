class Bind {

    // constructor(model, view, props) {
    //REST OPERATOR - PARECIDO COM O SPREAD OPERATOR
    constructor(model, view, ...props) {
        let proxy = ProxyFactory.create(model, props, model => view.update(model));
        view.update(model);
        return proxy;
    }
}