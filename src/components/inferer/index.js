import React from 'react';

import Editor from './editor';
import Processor from './processor';

export default class Inferer extends React.Component {
    constructor() {
        super();
        this.state = {
            target: null,
            functions: []
        };

        this.handleInfer = () => {
            const t = this.getTarget();
            if (t) {
                this.setState({
                    target: t,
                    functions: this.editorNode.getData()
                }, () => {
                    this.processorNode.process();
                });
            }
        };
    }
    componentDidMount() {

    }
    componentWillUnmount() {
    
    }
    getTarget() {
        try {
            const inferFrom = this.inferFromNode.value.split(',');
            const inferTo = this.inferToNode.value;
            if (inferFrom.length > 0 && inferTo) {
                return {
                    from: inferFrom,
                    to: inferTo
                };
            }
        } catch(e) {
            console.error(`failed to get infer target: `, e);
            return null;
        }
    }
    renderInferBlock() {
        return (
            <div className="infer-block">
                <button className="btn btn-primary" onClick={this.handleInfer}>Доказать, что</button>
                <input type="text" className="form-input infer-block__from" ref={(node) => { this.inferFromNode = node; }} defaultValue="a,b"/> ->
                <input type="text" className="form-input infer-block__to" ref={(node) => { this.inferToNode = node; }} defaultValue="p"/>
            </div>
        );
    }

    render() {
        const { functions, target } = this.state;
        return (
            <div className="main-wrapper">
                <h3>Функции изменения состояний</h3>
                <Editor ref={(node) => { this.editorNode = node; }}/>
                {this.renderInferBlock()}
                <Processor ref={(node) => { this.processorNode = node; }} functions={functions} target={target} />
            </div> 
        );
    }
}