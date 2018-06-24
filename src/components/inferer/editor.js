import React from 'react';
import FunctionItem from './function-item';

export default class Editor extends React.Component {
    constructor() {
        super();
        this.state = {
            functions: [
                {
                    args: ["a", "b"],
                    result: "c",
                    conditions: "a > 5"
                },
                {
                    args: ["b", "c"],
                    result: "d",
                    conditions: "b > 10 && b < 15"
                },
                {
                    args: ["a", "d"],
                    result: "e"
                },
                {
                    args: ["a", "e"],
                    result: "f",
                    conditions: "a > b"
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
            f.conditions = this.addConditionsNode.value;
        } catch(e) {
            console.error(`failed to get new function: error is `, e);
        }
        if (f.args.length > 0 && f.result) {
            this.addArgumentsNode.value = "";
            this.addResultNode.value = "";
            this.addConditionsNode.value = "";
            return f;
        }
        return null;
    }
    getData() {
        return this.state.functions;
    }
    renderAdd() {
        return (
            <div className="editor__add" style={{ marginBottom: "15px" }}>
                <h5>Добавить функцию</h5>
                <p>
                    F(
                        <input className="form-input tooltip"
                            data-tooltip="Введите аргументы функции через запятую"
                            ref={(node) => { this.addArgumentsNode = node; }}
                            type="text"
                            placeholder="Введите аргументы функции через запятую"
                        />
                    ) -> <input className="form-input"
                            type="text"
                            ref={(node) => { this.addResultNode = node; }}
                            placeholder="Введите результирующее значение"
                        />&nbsp;
                </p>
                <p>
                    <span>при условии&nbsp;</span>
                    <input className="form-input"
                        ref={(node) => { this.addConditionsNode = node; }}
                        type="text"
                        placeholder="Введите условия в форме логического выражения"
                        style={{
                            width: "370px"
                        }}
                    />
                </p>
                <button className="btn btn-primary" onClick={this.handleAdd}>Добавить</button>
            </div>
        );
    }
    renderFunctions(functions) {
        return (
            <div>
                <h5>Список функций</h5>
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
            </div>
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