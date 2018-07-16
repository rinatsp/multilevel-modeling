import React from 'react';
import _ from 'lodash';
import TreeView, { TreeNodeContent } from './tree-view';
import FunctionEditor from './function-editor';
import uuid from 'uuid/v4';

export default class LevelEditor extends React.Component {
    constructor() {
        super();

        const rootId = uuid();
        this.state = {
            selectedNode: rootId,
            nodes: [
                {
                    id: rootId,
                    parent: null,
                    level: 1,
                    number: 1,
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
                },
                {
                    id: uuid(),
                    parent: rootId,
                    level: 2,
                    number: 1,
                    functions: []
                }
            ]
        };

        this.handleAddChild = (node) => {
            return () => {
                const { nodes } = this.state;
                const newLevel = node.level + 1;
                const countOfNodesOnCurrentLevel = nodes.filter((n) => {
                    return n.level === newLevel;
                }).length;
                const newNode = {
                    id: uuid(),
                    parent: node.id,
                    level: newLevel,
                    number: countOfNodesOnCurrentLevel + 1
                };
                this.setState({
                    nodes: [...nodes, newNode],
                    selectedNode: newNode.id
                });
            };
        };
        this.handleRemoveChild = (node) => {
            return () => {
                this.setState({
                    nodes: this.state.nodes.filter((n) => {
                        return n.id !== node.id;
                    }),
                    selectedNode: this.state.selectedNode === node.id ? null : this.state.selectedNode
                });
            };
        };
        this.handleClick = (node) => {
            return () => {
                this.setState({
                    selectedNode: node.id
                });
            };
        };
        this.handleFunctionsChange = (newFunctions) => {
            this.setState({
                nodes: this.state.nodes.map((n) => {
                    if (n.id === this.state.selectedNode) {
                        return _.assign({}, n, {
                            functions: newFunctions
                        });
                    }
                    return n;
                })
            });
        };
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    getData() {
        return this.state.nodes;
    }

    render() {
        const { selectedNode, nodes } = this.state;
        const selectedNodeInstance = _.find(nodes, (n) => {
            return n.id === selectedNode;
        });
        return (
            <div className="columns">
                <div className="column col-6">
                    <h3>Редактор уровней</h3>
                    <div className="level-editor">
                        <TreeView
                            expanded
                            nodes={nodes}
                            renderNode={(node) => {
                                return (
                                    <TreeNodeContent onClick={this.handleClick(node)} selected={selectedNode === node.id}>
                                        <span className="node-content-name">
                                            {`Уровень ${node.level}, элемент ${node.number}`}
                                            &nbsp;
                                            <a
                                                title="Добавить дочерний элемент"
                                                onClick={this.handleAddChild(node)}
                                            >[+]</a>
                                            {
                                                node.parent !== null &&
                                                    [
                                                        <span key={1}>&nbsp;</span>,
                                                        <a
                                                            key={2}
                                                            title="Удалить элемент"
                                                            onClick={this.handleRemoveChild(node)}
                                                        >[x]</a>
                                                    ]
                                            }
                                        </span>
                                    </TreeNodeContent>
                                );
                            }}
                        />
                    </div>
                </div>
                <div className="column col-6">
                    <h3>Функции изменения состояний</h3>
                    {
                        selectedNode ?
                            <FunctionEditor
                                ref={(node) => { this.functionEditorNode = node; }}
                                functions={selectedNodeInstance.functions}
                                onFunctionsChange={this.handleFunctionsChange}
                            /> :
                            <p>Выберите элемент в списке слева</p>
                    }
                </div>
            </div>
        );
    }
}