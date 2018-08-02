import React from 'react';
import _ from 'lodash';
import TreeView, { TreeNodeContent } from './tree-view';
import FunctionEditor from './function-editor';
import uuid from 'uuid/v4';
import { saveAs } from 'file-saver/FileSaver';

const LOCAL_STORAGE_ITEM = "levels";

function getUrlParam(name) {
    return decodeURIComponent(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,""])[1]
    );
};


function getDefaultLevels() {
    return ﻿[
        {
            "id": "baad85ac-1733-4f25-9609-e335807bbb4c",
            "parent": null,
            "level": 1,
            "number": 1,
            "functions": [
                {
                    "args": [
                        "c0"
                    ],
                    "result": "c1",
                    "conditions": ""
                },
                {
                    "args": [
                        "c1"
                    ],
                    "result": "c2",
                    "conditions": ""
                },
                {
                    "args": [
                        "c2"
                    ],
                    "result": "c3",
                    "conditions": "p1==1 && p2==1 && p3==1 && p4==1"
                },
                {
                    "args": [
                        "c2"
                    ],
                    "result": "c4",
                    "conditions": "p1==1 && p2==1 && p3==1 && p4==0"
                },
                {
                    "args": [
                        "c3",
                        "c5"
                    ],
                    "result": "c6",
                    "conditions": ""
                }
            ]
        },
        {
            "id": "382337c0-803f-48e4-bbb1-b0466505c323",
            "parent": "baad85ac-1733-4f25-9609-e335807bbb4c",
            "level": 2,
            "number": 1,
            "functions": [
                {
                    "args": [
                        "c10"
                    ],
                    "result": "c11",
                    "conditions": "p11==1 && p12==1 && p13==1 && p14==1"
                },
                {
                    "args": [
                        "c11"
                    ],
                    "result": "c12",
                    "conditions": ""
                },
                {
                    "args": [
                        "c13"
                    ],
                    "result": "c14",
                    "conditions": ""
                },
                {
                    "args": [
                        "c14"
                    ],
                    "result": "c5",
                    "conditions": ""
                }
            ]
        },
        {
            "id": "f2e39b89-bb0a-4820-8c9a-406dc453734c",
            "parent": "382337c0-803f-48e4-bbb1-b0466505c323",
            "level": 3,
            "number": 1,
            "functions": [
                {
                    "args": [
                        "c20"
                    ],
                    "result": "c21",
                    "conditions": "p141==1 && p142==1 && p143==1 && p144==1"
                },
                {
                    "args": [
                        "c21"
                    ],
                    "result": "c22",
                    "conditions": ""
                },
                {
                    "args": [
                        "c22"
                    ],
                    "result": "c13",
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
            if (!levels || getUrlParam("disableCache") === "true") {
                return getDefaultLevels();
            }
            return levels;
        } catch (e) {
            console.warn(`unable to get data from localstorage; returning default levels`);
            return getDefaultLevels();
        }
    }
    saveLevels() {
        debugger;
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