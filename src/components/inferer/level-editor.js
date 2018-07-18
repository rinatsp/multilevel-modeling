import React from 'react';
import _ from 'lodash';
import TreeView, { TreeNodeContent } from './tree-view';
import FunctionEditor from './function-editor';
import uuid from 'uuid/v4';
import { saveAs } from 'file-saver/FileSaver';

const LOCAL_STORAGE_ITEM = "levels";

function getDefaultLevels() {
    return [
        {
            "id": "baad85ac-1733-4f25-9609-e335807bbb4c",
            "parent": null,
            "level": 1,
            "number": 1,
            "functions": [
                {
                    "args": [
                        "a1",
                        "b1"
                    ],
                    "result": "c1",
                    "conditions": ""
                },
                {
                    "args": [
                        "c2",
                        "c3"
                    ],
                    "result": "c4",
                    "conditions": ""
                }
            ]
        },
        {
            "id": "5aae1a46-01a0-4e8d-9e20-732d90ae117b",
            "parent": "baad85ac-1733-4f25-9609-e335807bbb4c",
            "level": 2,
            "number": 1,
            "functions": [
                {
                    "args": [
                        "a2",
                        "b2"
                    ],
                    "result": "c2",
                    "conditions": ""
                }
            ]
        },
        {
            "id": "11339e7e-5079-450c-b7ce-21f3fc71d710",
            "parent": "baad85ac-1733-4f25-9609-e335807bbb4c",
            "level": 2,
            "number": 2,
            "functions": [
                {
                    "args": [
                        "a3",
                        "b3"
                    ],
                    "result": "c3",
                    "conditions": ""
                }
            ]
        }
    ];
}

export default class LevelEditor extends React.Component {
    constructor() {
        super();

        const levels = this.initLevels();
        this.state = {
            selectedNode: levels[0].id,
            levels
        };

        this.handleAddChild = (node) => {
            return () => {
                const { levels } = this.state;
                const newLevel = node.level + 1;
                const countOflevelsOnCurrentLevel = levels.filter((n) => {
                    return n.level === newLevel;
                }).length;
                const newNode = {
                    id: uuid(),
                    parent: node.id,
                    level: newLevel,
                    number: countOflevelsOnCurrentLevel + 1,
                    functions: []
                };
                this.setState({
                    levels: [...levels, newNode],
                    selectedNode: newNode.id
                }, () => {
                    this.saveLevels();
                });
            };
        };
        this.handleRemoveChild = (node) => {
            return () => {
                this.setState({
                    levels: this.state.levels.filter((n) => {
                        return n.id !== node.id;
                    }),
                    selectedNode: this.state.selectedNode === node.id ? null : this.state.selectedNode
                }, () => {
                    this.saveLevels();
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
                levels: this.state.levels.map((n) => {
                    if (n.id === this.state.selectedNode) {
                        return _.assign({}, n, {
                            functions: newFunctions
                        });
                    }
                    return n;
                })
            }, () => {
                this.saveLevels();
            });
        };
        this.handleSave = () => {
            const blob = new Blob([JSON.stringify(this.state.levels, null, 4)], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "levels.txt");
        };
    }
    initLevels() {
        try {
            const levels = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEM));
            if (!levels) {
                return getDefaultLevels();
            }
            return levels;
        } catch (e) {
            console.warn(`unable to get data from localstorage; returning default levels`);
            return getDefaultLevels();
        }
    }
    saveLevels() {
        localStorage.setItem(LOCAL_STORAGE_ITEM, JSON.stringify(this.state.levels));
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    getData() {
        return this.state.levels;
    }

    render() {
        const { selectedNode, levels } = this.state;
        const selectedNodeInstance = _.find(levels, (n) => {
            return n.id === selectedNode;
        });
        return (
            <div className="columns">
                <div className="column col-6">
                    <h3>Редактор уровней <a onClick={this.handleSave}>[сохранить данные]</a></h3>
                    <div className="level-editor">
                        <TreeView
                            expanded
                            nodes={levels}
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
                                functions={(selectedNodeInstance && selectedNodeInstance.functions) || []}
                                onFunctionsChange={this.handleFunctionsChange}
                            /> :
                            <p>Выберите элемент в списке слева</p>
                    }
                </div>
            </div>
        );
    }
}