import React from 'react';
import FunctionItem from './function-item';
import _ from 'lodash';

function printFunction(f) {
    return JSON.stringify(f);
}

function isConditioned(f, conditions) {
    let result = true;
    if (f.conditions) {
        const resultConditionToEval = `(function() { var ${conditions} ; return ${f.conditions} })()`;
        result = eval(resultConditionToEval);
    }
    return result;
}

// get the result infer path
// @param items - all items on all levels
// @param finalTarget - given input, output and conditions
function processMultilevel(items, finalTarget) {

    function getChildItems(item) {
        return items.filter((i) => {
            return i.parent === item.id;
        });
    }

    // get one of child items, that's functions allow us to rich the result
    function getItemLeadsTo(parentItem, result) {
        console.debug(`looking for any item that would allow to rich result ${result}`);
        return _.find(getChildItems(parentItem), (i) => {
            const { functions } = i;
            return _.find(functions, (f) => {
                return isConditioned(f, finalTarget.conditions) && f.result == result;
            });
        });
    }

    // get path on given item functions to the target result
    // @recursive
    function process(item, target) {
        const { functions } = item;
        console.info(`trying to infer that ${target} is inferable from given start data ${finalTarget.from}, conditions ${finalTarget.conditions} and functions ${functions.map(printFunction)}`);

        // get one of functions of the item, that allow us to rich the result
        function getFunctionsLeadsTo(result) {
            console.debug(`looking for any function that would allow to rich result ${result}`);
            // find in all item's functions one, who are conditioned and which result is equal to given
            return functions.filter((f) => {
                return isConditioned(f, finalTarget.conditions) && f.result == result;
            });
        }

        // @recursive
        function findPath(result) {
            console.debug(`finding path to ${result}`);
            let localSteps = [];

            // if result is presented in given data, then path length is 0
            if (finalTarget.from.indexOf(result) > -1) {
                console.info(`result is found in initial data; returning empty list of steps`);
                return localSteps;
            }

            const lastFunctions = getFunctionsLeadsTo(result);
            if (lastFunctions && lastFunctions.length > 0) {
                for (let i = 0; i < lastFunctions.length; i++) {
                    const lastFunction = lastFunctions[i];
                    console.debug(`found last function for ${result}; checking all it's arguments`);
                    // for each argument of found function, check that we can find path to it
                    try {
                        const prevSteps = _.flatten(lastFunction.args.map(findPath));
                        // concat the result path
                        localSteps = [...prevSteps, lastFunction];
                        break;
                    } catch (e) {
                        console.info(`failed to infer all path to function `, lastFunction, `; iterating next`);
                    }
                }
                if (localSteps.length === 0) {
                    throw new Error("none of last functions", lastFunctions, " are feasible");
                }
            } else {
                const chidlItems = getChildItems(item);
                let isFound = false;
                console.debug(`not found last function; checking all childs`);
                for (let i = 0; i < chidlItems.length; i++) {
                    console.debug(`trying to check item ${chidlItems[i]}`);
                    const prevSteps = process(chidlItems[i], result);
                    if (prevSteps) {
                        console.debug(`found child path: `, prevSteps);
                        localSteps = prevSteps;
                        isFound = true;
                        break;
                    }
                }
                if (!isFound) {
                    throw new Error(`not found any function or item that leads to ${result}`);
                }
            }

            return localSteps;
        }

        try {
            const path = findPath(target);
            const resultPath = [];
            console.info(`done processing; now filter duplicated functions`);
            path.forEach((f) => {
                if (resultPath.indexOf(f) === -1) {
                    resultPath.push(f);
                } else {
                    console.debug(`function ${printFunction(f)} is already presented`);
                }
            });
            return resultPath;
        } catch (e) {
            console.warn(`looks like target ${target} is not feasible; returning null`);
            return null;
        }
    }

    // find root item
    const rootItem = _.find(items, (i) => {
        return !i.parent;
    });

    if (!rootItem) {
        console.warn(`no root item found; unable to process`);
        return null;
    }

    // process root item and target result
    return process(rootItem, finalTarget.to);
}

export default class Processor extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        // this.processMu();
    }
    componentWillUnmount() {

    }
    process() {
        const { items, target } = this.props;
        target.from = target.from.split(',').map(s => s.trim());
        if (target && items) {
            const result = processMultilevel(items, target);
            this.setState({
                result
            });
        }
    }
    printResult(result) {
        return (
            <div>
                <p>Прямой ход:</p>
                <ol>
                    {result.map((f, index) => {
                        return (
                            <li key={index}>
                                <FunctionItem {...f} />
                            </li>
                        );
                    })}
                </ol>
            </div>
        );
    }

    render() {
        const { target, items } = this.props;
        if (!target || !items) {
            return null;
        }
        const { result } = this.state;
        return (
            <div className="processor">
                {
                    (result && result.length > 0) ?
                        <div>
                            {this.printResult(result)}
                        </div> :
                        "Вывод невозможен"
                }
            </div>
        );
    }
}