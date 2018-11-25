import React from 'react';

import LevelEditor from './level-editor';
import Processor from './processor';
import Generator from './generator';

export default class Inferer extends React.Component {
    constructor() {
        super();
        this.state = {
            target: {
                from: "",
                to: "",
                conditions: ""
            },
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

        this.handleGenerate = (data) => {
            this.setState(data, () => {
                this.levelEditorNode.setLevels(data.items);
            });
        };

        this.handleTargetChange = () => {
            this.setState({
                target: this.getTarget()
            });
        };
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    getTarget() {
        try {
            const inferFrom = this.inferFromNode.value;
            const inferTo = this.inferToNode.value.trim();
            const inferConditions = this.inferConditionsNode.value.trim();
            if (inferFrom && inferTo) {
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
        return;
    }
    renderInferBlock() {
        const target = this.state.target || {};
        const { from, to, conditions } = target;
        return (
            <div className="infer-block">
                <div className="form-group">
                    <label className="form-label">
                        <span>Имея входные данные:</span>
                    </label>
                    <input type="text" className="form-input infer-block__from" ref={(node) => { this.inferFromNode = node; }} value={from} onChange={this.handleTargetChange}/>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        <span>И начальные условия:</span>
                    </label>
                    <input type="text" className="form-input infer-block__conditions" ref={(node) => { this.inferConditionsNode = node; }} value={conditions} onChange={this.handleTargetChange}/>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        <span>Возможно получить:</span>
                    </label>
                    <input type="text" className="form-input infer-block__to" ref={(node) => { this.inferToNode = node; }} value={to} onChange={this.handleTargetChange}/>
                </div>
                <button className="btn btn-primary" onClick={this.handleInfer}>Доказать</button>
            </div>
        );
    }

    render() {
        const { items, target, conditions } = this.state;
        return (
            <div className="main-wrapper container">
                <Generator ref={(node) => { this.generatorNode = node; }} handleGenerate={this.handleGenerate} />
                <hr />
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