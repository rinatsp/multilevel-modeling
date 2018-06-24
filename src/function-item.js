class FunctionItem {
    constructor(args, result, conditions) {
        this._agrs = args;
        this._result = result;
        this._conditions = conditions;
    }

    get args() {
        return this._agrs;
    }
    get result() {
        return this._result;
    }
    get conditions() {
        return this._conditions;
    }
}