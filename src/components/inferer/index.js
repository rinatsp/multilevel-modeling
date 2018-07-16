import React from 'react';

import LevelEditor from './level-editor';
import Processor from './processor';

export default class Inferer extends React.Component {
    constructor() {
        super();
        this.state = {
            target: null,
            items: []
        };

        this.handleInfer = () => {
            const t = this.getTarget();
            if (t) {
                this.setState({
                    target: t,
                    items: this.levelEditorNode.getData()
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
            const inferConditions = this.inferConditionsNode.value;
            if (inferFrom.length > 0 && inferTo) {
                return {
                    from: inferFrom,
                    to: inferTo,
                    conditions: inferConditions
                };
            }
        } catch (e) {
            console.error(`failed to get infer target: `, e);
            return null;
        }
    }
    renderInferBlock() {
        return (
            <div className="infer-block">
                <div className="form-group">
                    <label className="form-label">
                        <span>Имея входные данные:</span>
                    </label>
                    <input type="text" className="form-input infer-block__from" ref={(node) => { this.inferFromNode = node; }} defaultValue="a,b" />
                </div>
                <div className="form-group">
                    <label className="form-label">
                        <span>И начальные условия:</span>
                    </label>
                    <input type="text" className="form-input infer-block__conditions" ref={(node) => { this.inferConditionsNode = node; }} defaultValue="a = 60, b = 11" />
                </div>
                <div className="form-group">
                    <label className="form-label">
                        <span>Возможно получить:</span>
                    </label>
                    <input type="text" className="form-input infer-block__to" ref={(node) => { this.inferToNode = node; }} defaultValue="p" />
                </div>
                <button className="btn btn-primary" onClick={this.handleInfer}>Доказать</button>
            </div>
        );
    }

    render() {
        const { items, target, conditions } = this.state;
        return (
            <div className="main-wrapper container">
                <LevelEditor ref={(node) => { this.levelEditorNode = node; }} />
                <hr />
                <div className="columns">
                    <div className="column">
                        <h3>Вывод</h3>
                        {this.renderInferBlock()}
                        <Processor
                            ref={(node) => { this.processorNode = node; }}
                            items={items}
                            target={target}
                            conditions={conditions}
                        />
                    </div>
                </div>
            </div>
        );
    }
}