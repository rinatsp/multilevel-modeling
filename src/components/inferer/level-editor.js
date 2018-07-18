import React from 'react';
import _ from 'lodash';
import TreeView, { TreeNodeContent } from './tree-view';
import FunctionEditor from './function-editor';
import uuid from 'uuid/v4';
import { saveAs } from 'file-saver/FileSaver';

const LOCAL_STORAGE_ITEM = "levels";

function getDefaultLevels() {
    const rootId = uuid();
    return [
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