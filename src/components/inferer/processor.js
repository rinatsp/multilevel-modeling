import React from 'react';
import FunctionItem from './function-item';

function printFunction(f) {
    return JSON.stringify(f);
}

function applyFunction(f, input, conditions) {
    // return f.result === output && f.args.filter((a) => {
    //     return input.indexOf(a) > -1
    // }).length === f.args.length;

    let isConditioned = true;
    if (f.conditions) {
        const resultConditionToEval = `(function() { var ${conditions} ; return ${f.conditions} })()`;
        isConditioned = eval(resultConditionToEval);

        console.info(`evaled ${resultConditionToEval} to ${isConditioned}`);
    }

    if (
        isConditioned &&
        f.args.filter((a) => {
            return input.indexOf(a) > -1
        }).length === f.args.length
    ) {
        return f.result;
    }
    return null;
}

function process(functions, target) {
    console.info(`trying to infer that ${target.to} is inferable from given start data ${target.from}, conditions ${target.conditions} and functions ${functions.map(printFunction)}`);

    function begin(initialFunction, functions) {
        console.info(`trying with initial function ${printFunction(initialFunction)}, functions ${functions.map(printFunction)}`);

        const localPath = [initialFunction];
        const localData = [...target.from];

        function iterate(functions) {
            console.info(`iterating through functions ${functions.map(printFunction)}; localData is ${JSON.stringify(localData)}`);
            let hasNewData = false;
            let stop = false;
            functions.forEach((f) => {
                if (stop) {
                    return;
                }
                const res = applyFunction(f, localData, target.conditions);
                if (res && localData.indexOf(res) === -1) {
                    console.info(`function ${printFunction(f)} added new data (${res}); should reapply all functions`);
                    localPath.push(f);
                    localData.push(res);
                    if (res == target.to) {
                        console.info(`done; found ${target.to}; returning`);
                        stop = true;
                    }
                    hasNewData = true;
                }
            });
            if (hasNewData && !stop) {
                iterate(functions);
            }
        }

        const initialRes = applyFunction(initialFunction, localData, target.conditions);
        if (initialRes && localData.indexOf(initialRes) === -1) {
            localData.push(initialRes);
            if (initialRes == target.to) {
                console.info(`done; found ${target.to}; returning`);
            } else {
                iterate(functions);
            }
        }

        if (localData.indexOf(target.to) > -1) {
            console.info(`ok, found target output; returning path`);
            return localPath;
        }
        console.info(`not found target output in result data for initial function ${printFunction(initialFunction)}`);
        return null;
    }

    const resultPaths = functions.map((f, index) => {
        return begin(f, functions.filter((_, i) => {
            return i !== index;
        }));
    }).filter(p => p);

    console.info(`result paths are: `, resultPaths);

    return resultPaths;
}

function backwardResult(steps, target) {
    const backwardSteps = [];
    const notFoundInitialData = [...target.from];

    let initialBackwardStep;
    steps.forEach((s) => {
        if (s.result == target.to) {
            initialBackwardStep = s;
        }
    });

    console.info(`initial backward step is `, initialBackwardStep);

    backwardSteps.push(initialBackwardStep);
    const backwardData = [target.to, ...initialBackwardStep.args];

    function checkBackwardData() {
        return target.from.filter((f) => {
            return backwardData.indexOf(f) > -1;
        }).length === target.from.length;
    }

    function iterate() {
        

    }

    return backwardSteps.reverse();
}

export default class Processor extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        this.process();
    }
    componentWillUnmount() {

    }
    process() {
        const { functions, target } = this.props;
        if (target && functions) {
            const result = process(functions, target);
            this.setState({
                result
            });
        }
    }
    printResult(result) {
        return result.map((r) => {
            const br = backwardResult(r, this.props.target);
            return (
                <div>
                    <p>Прямой ход:</p>
                    <ol>
                        {r.map((f, index) => {
                            return (
                                <li key={index}>
                                    <FunctionItem {...f} />
                                </li>
                            );
                        })}
                    </ol>
{/*                    <p>Обратный ход:</p>
                    <ol>
                        {backwardResult.map((f) => {
                            return (
                                <li>
                                    <FunctionItem {...f} />
                                </li>
                            );
                        })}
                    </ol>*/}
                </div>
            );
        });
    }

    render() {
        const { target, functions } = this.props;
        if (!target || !functions) {
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