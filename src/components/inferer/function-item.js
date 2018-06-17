import React from 'react';

export default class FunctionItem extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { args, result } = this.props;
        return (
            <span className="function-item">
                F({args.join(',')}) -> {result}
            </span> 
        );
    }
}