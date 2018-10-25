import React from 'react';
import _ from 'lodash';
import uuid from 'uuid/v4';

function getItem(level, number, parent = null) {
    return {
        id: uuid(),
        level,
        number,
        parent,
        functions: []
    };
}

function getRootItem() {
    return getItem(1, 1);
}

function generateNewFact(level, item, index) {
    return `a${level}${item}${index}`;
}

function generateConfig(data) {
    console.info(`trying to generate config for data: `, data);

    const rootItem = getRootItem();
    rootItem.functions = [
        {
            "args": ["a"],
            "result": "a1",
            "conditions": ""
        },
        {
            "args": ["a2"],
            "result": "w",
            "conditions": ""
        }
    ];
    const items = [rootItem];
    const startFacts = ["a"];

    function generateBranch(item, highLevelResult = null) {
        if (item.level == data.levelCount) {
            return;
        }
        const random = Math.random();
        _.range(data.childItemCount).forEach((n) => {
            const resultBranch = random > n / data.childItemCount && random < (n + 1) / data.childItemCount;
            console.error(resultBranch, n, data.childItemCount);
            const _item = getItem(item.level + 1, n + 1, item.id);
            const facts = _.range(data.factCount + 1).map((fact) => {
                if (resultBranch && fact == data.factCount) {
                    return highLevelResult;
                }
                return `a${_item.level}${n + 1}${fact + 1}`;
            });
            const factsLeadToResult = (highLevelResult ? facts.filter((f) => {
                return f === highLevelResult || Math.random() > 0.2;
            }) : facts).sort((a) => {
                if (a === highLevelResult) {
                    return 1;
                }
                return 0;
            });
            let newHighLevelResult = null;
            if (Math.random() < data.levelDownProbability && item.level < data.levelCount - 1) {
                console.info(`leveling down`);
                newHighLevelResult = factsLeadToResult[0];
            }
            _item.functions = [];
            console.warn(factsLeadToResult, newHighLevelResult);
            factsLeadToResult.forEach((f, index) => {
                if (index > 0 && f != newHighLevelResult) {
                    _item.functions.push({
                        args: [factsLeadToResult[index - 1]],
                        result: factsLeadToResult[index]
                    });
                }
            });
            items.push(_item);
            if (resultBranch && !newHighLevelResult) {
                startFacts.push(factsLeadToResult[0]);
            }
            generateBranch(_item, newHighLevelResult);
        });
    }

    generateBranch(rootItem, "a2");

    console.info(JSON.stringify(items, null, 4));

    // const items = _.range(data.levelCount).map((levelIndex) => {
    //     let itemNumber = 1;
    //     return _.range(data.childItemCount).map((itemIndex) => {
    //         return getItem(levelIndex + 1, itemNumber++, )
    //     })
    // });

    return {
        items,
        target: {
            from: startFacts.join(","),
            to: "w",
            conditions: ""
        }
    };
}

export default class Generator extends React.Component {
    constructor() {
        super();

        this.handleGenerate = () => {
            const data = this.getData();
            this.props.handleGenerate(generateConfig(data));
        };
    }

    getData() {
        return {
            levelCount: parseInt(this.levelCountNode.value),
            childItemCount: parseInt(this.childItemCountNode.value),
            factCount: parseInt(this.factCountNode.value),
            levelDownProbability: parseFloat(this.levelDownProbabilityNode.value)
        };
    }

    render() {
        return (
            <div>
                <h3>Генератор</h3>
                <div className="generator-form">
                    <div className="form-group">
                        <label className="form-label">
                            <span>Количество уровней:</span>
                        </label>
                        <input type="number" className="form-input" ref={(node) => { this.levelCountNode = node; }} defaultValue="4" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            <span>Количество дочерних элементов к каждому элементу:</span>
                        </label>
                        <input type="number" className="form-input" ref={(node) => { this.childItemCountNode = node; }} defaultValue="1" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            <span>Количество фактов в элементах:</span>
                        </label>
                        <input type="number" className="form-input" ref={(node) => { this.factCountNode = node; }} defaultValue="5" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            <span title="Для каждого нижеследующего уровня вероятность считается как произведение вероятностей на всех предыдущих уровнях">Вероятность спуска на нижний уровень:</span>
                        </label>
                        <input type="number" className="form-input" ref={(node) => { this.levelDownProbabilityNode = node; }} defaultValue="0.8" />
                    </div>
                    <button className="btn btn-primary" onClick={this.handleGenerate}>Сгенерировать</button>
                </div>
            </div>
        );
    }
}