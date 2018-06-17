import React from 'react';
import FunctionItem from './function-item';

export default class Editor extends React.Component {
    constructor() {
        super();
        this.state = {
            functions: [
                {
                    args: ["a", "b"],
                    result: "c"
                },
                {
                    args: ["b", "c"],
                    result: "d"
                },
                {
                    args: ["a", "d"],
                    result: "e"
                },
                {
                    args: ["a", "e"],
                    result: "f"
                },
                {
                    args: ["b", "f"],
                    result: "g"
                },
                {
                    args: ["c", "g"],
                    result: "h"
                },
                {
                    args: ["a", "g"],
                    result: "b"
                },
                {
                    args: ["g", "h"],
                    result: "p"
                }
            ]
        };

        this.handleAdd = () => {
            const newFunction = this.getNewFunction();
            if (newFunction) {
                this.setState({
                    functions: [...this.state.functions, newFunction]
                });
            }
        };
        this.handleRemove = (index) => {
            return () => {
                this.setState({
                    functions: this.state.functions.filter((f, i) => {
                        return i !== index;
                    })
                });
            };
        };
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    getNewFunction() {
        let f = {
            args: [],
            result: null
        };
        try {
            f.args = this.addArgumentsNode.value.split(",").filter(str => str.length > 0);
            f.result = this.addResultNode.value;
        } catch(e) {
            console.error(`failed to get new function: error is `, e);
        }
        if (f.args.length > 0 && f.result) {
            this.addArgumentsNode.value = "";
            this.addResultNode.value = "";
            return f;
        }
        return null;
    }
    getData() {
        return this.state.functions;
    }
    renderAdd() {
        return (
            <div className="editor__add">
                F(
                    <input className="form-input" 
                        ref={(node) => { this.addArgumentsNode = node; }}
                        type="text"
                        placeholder="Введите аргументы функции через запятую"
                    />
                ) -> <input className="form-input" type="text" ref={(node) => { this.addResultNode = node; }}/>&nbsp;
                <button className="btn btn-primary" onClick={this.handleAdd}>Добавить</button>
            </div>
        );
    }
    renderFunctions(functions) {
        return (
            <ol className="editor__functions">
                {
                    functions.map((f, index) => {
                        return (
                            <li key={index}>
                                <FunctionItem {...f} /> &nbsp;
                                <a onClick={this.handleRemove(index)}>[yдалить]</a>
                            </li>
                        );
                    })
                }
            </ol>
        );
    }

    render() {
        const { functions } = this.state;
        return (
            <div className="editor">
                {this.renderAdd()}
                {this.renderFunctions(functions)}
            </div> 
        );
    }
}