import { Component } from 'react';
import React from "react";
import Cytoscape from "./cytospace";

class Tree extends Component {
    constructor(props) {
        super(props);
        this.elements = {
            nodes: [],
            edges: [],
        };
        this.setElements();
    }

    componentWillReceiveProps(nextProps) {
        this.elements = {
            nodes: [],
            edges: [],
            grabbable: false
        };
        this.props = nextProps;
        this.setElements();
    }

    setElements() {
        this.props.items.forEach(item => {
            const prevItemOnLevel = this.props.items.find(findItem => (item.level === findItem.level) && (item.number - 1 === findItem.number));
            this.elements.nodes.push({
                data: { id: item.id, label: item.level.toString(), level: item.level },
                position: { x: (item.number < 1 ? 0 : item.number) * (prevItemOnLevel ? prevItemOnLevel.functions.length * 205 : 0), y: item.level * 200 },
                grabbable: false
            });
            const last = this.elements.nodes[this.elements.nodes.length - 1];
            if (item.functions) {
                item.functions.map((funcItem, index) => {
                    if (funcItem.result === this.props.target.to) {
                        this.elements.nodes.push({
                            data: {
                                id: funcItem.result,
                                label: `${funcItem.result}`,
                                parent: item.id
                            },
                            position: { x: last.position.x + index * 200 + 200, y: item.level * 200 },
                            grabbable: false,
                            classes: 'finish'
                        });
                    }
                    this.elements.nodes.push({
                        data: {
                            id: funcItem.args.toString(),
                            label: `${funcItem.args}`,
                            parent: item.id
                        },
                        position: { x: last.position.x + index * 200, y: item.level * 200 },
                        grabbable: false
                    });
                });
            }
        });
        this.props.resultPath.map((item, index) => {
            if (this.props.resultPath.length - 1 !== index) {
                this.elements.edges.push({
                    data: {
                        source: item.args.toString(),
                        target: item.result.toString()
                    }
                });
            } else {
                this.elements.edges.push({
                    data: {
                        source: item.args.toString(),
                        target: item.result.toString()
                    }
                });
            }
        });
        this.props.target.from && this.props.target.from.forEach((item, index) => {
            this.props.target.from[index + 1] ? this.elements.edges.push({
                data: {
                    source: item.toString(),
                    target: this.props.target.from[index + 1].toString(),
                    type: 'bezier'
                },
                classes: 'start'
            }) : null;
        });
    }

    render() {
       console.info(JSON.stringify(this.elements, null, 4));
       return <Cytoscape elements={this.elements} />
    }
}


export default Tree;
