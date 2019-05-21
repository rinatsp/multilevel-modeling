import React from "react";
import { BaseChart } from "./base-chart";
import { Parameter } from "./parameter";

export class ChartsPage extends React.Component {
    constructor() {
        super();
        this.state = {
            inductive: {
                m: 0,
                k: 0,
                charts: {
                    labels: [''],
                    synthesizedData: [],
                    recoveringData: [],
                }
            },
            deductive: {
                m_r: 0,
                m_s: 0,
                m_v: 0,
                n_r: 0,
                n_s: 0,
                charts: {
                    labels: [''],
                    parameterizationData: [],
                    recoveringData: [],
                }
            }
        };
    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }




    synthesizedModelOneLevelInductive() {
        return (this.state.inductive.m + Math.pow(this.state.inductive.m, 2)) / Math.pow(10, 6);
    }

    synthesizedModelMultiLevelInductive() {
        return Math.log10(Math.pow(this.state.inductive.m, this.state.inductive.k)) / Math.pow(10, 6);
    }

    sFact(num)
    {
        var rval=1;
        for (var i = 2; i <= num; i++)
            rval = rval * i;
        return rval;
    }
    recoveringDependenciesOneLevelInductive() {
        return this.sFact(this.state.inductive.m) / Math.pow(10, 6);
    }

    recoveringDependenciesMultiLevelInductive() {
        return this.state.inductive.m * this.state.inductive.k / Math.pow(10, 6);
    }



    //дедуктивный
    recoveringDependenciesOneLevelDeductive() {
        return this.state.deductive.m_r * this.state.deductive.m_s / Math.pow(10, 6);
    }

    recoveringDependenciesMultiLevelDeductive() {
        return ((this.state.deductive.n_r * this.state.deductive.n_s) * ((this.state.deductive.m_r + this.state.deductive.m_s) / (this.state.deductive.n_r + this.state.deductive.n_s))) / Math.pow(10, 6);
    }

    parameterizationDependenciesOneLevelDeductive() {
        return (this.state.deductive.m_v * this.state.deductive.m_v) / Math.pow(10, 6);
    }

    parameterizationDependenciesMultiLevelDeductive() {
        return this.state.deductive.m_v * Math.log10(this.state.deductive.m_v)  / Math.pow(10, 6);
    }

    handleChangeInductiveM(event) {
        const value =  event.target.value;
        this.setState((state) => (
            {
                inductive: {
                    ...state.inductive,
                    m: value
                }
            }));
    }
    handleChangeInductiveK(event) {
        const value =  event.target.value;
        this.setState((state) => ({
            inductive: {
                ...this.state.inductive,
                k: value
            }
        }));
    }

    buildInductiveSynthesizedChart() {
        this.setState((state) => ({
            inductive: {
                ...state.inductive,
                charts: {
                    ...state.inductive.charts,
                    labels: ['Одноуровневая', 'Многоуровневая'],
                    synthesizedData: [this.synthesizedModelOneLevelInductive(), this.synthesizedModelMultiLevelInductive()],
                }
            }
        }));
        this.buildInductiveRecoveringChart();
    }

    buildInductiveRecoveringChart() {
        this.setState((state) => ({
            inductive: {
                ...state.inductive,
                charts: {
                    ...state.inductive.charts,
                    labels: ['Одноуровневая', 'Многоуровневая'],
                    recoveringData: [this.recoveringDependenciesOneLevelInductive(), this.recoveringDependenciesMultiLevelInductive()],
                }
            }
        }));

        console.log(this.state);
    }

    inputInductive() {
        return (
        <div className="flex-container">
            <div className="input-block">
                <label>Число элементов m</label>
                <input className="form-input" type="number" value={this.state.inductive.m} onChange={this.handleChangeInductiveM.bind(this)}/>
            </div>
            <div className="input-block">
                <label>Число уровней k</label>
                <input className="form-input" type="number"  value={this.state.inductive.k} onChange={this.handleChangeInductiveK.bind(this)}/>
            </div>
            <button className="btn" onClick={this.buildInductiveSynthesizedChart.bind(this)}>Построить график</button>
        </div>
        )
    }

    handleChangeDeductiveM_R(event) {
        const value =  event.target.value;
        this.setState((state) => ({
            deductive: {
                ...state.deductive,
                m_r: value
            }
        }));
    }

    handleChangeDeductiveM_V(event) {
        const value =  event.target.value;
        this.setState((state) => ({
            deductive: {
                ...state.deductive,
                m_v: value
            }
        }));
    }

    handleChangeDeductiveM_S(event) {
        const value =  event.target.value;
        this.setState((state) =>({
            deductive: {
                ...state.deductive,
                m_s: value
            }
        }));
    }

    handleChangeDeductiveN_R(event) {
        const value =  event.target.value;
        this.setState((state) => ({
            deductive: {
                ...state.deductive,
                n_r: value
            }
        }));
    }
    handleChangeDeductiveN_S(event) {
        const value =  event.target.value;
        this.setState((state) => ({
            deductive: {
                ...state.deductive,
                n_s: value
            }
        }));
    }

    inputDeductive() {
        return (
            <div className="flex-container">
                <div className="input-block">
                    <label> Число элементов r-ой структуры </label>
                    <input className="form-input" value={this.state.deductive.m_r} onChange={this.handleChangeDeductiveM_R.bind(this)}/>
                </div>
                <div className="input-block">
                    <label> Число элементов s-ой структуры </label>
                    <input className="form-input" value={this.state.deductive.m_s} onChange={this.handleChangeDeductiveM_S.bind(this)}/>
                </div>
                <div className="input-block">
                    <label> Распределение по уровням r-ой структуры </label>
                    <input className="form-input" value={this.state.deductive.n_r} onChange={this.handleChangeDeductiveN_R.bind(this)}/>
                </div>
                <div className="input-block">
                    <label> Распределение по уровням  s-ой структуры </label>
                    <input className="form-input" value={this.state.deductive.n_s} onChange={this.handleChangeDeductiveN_S.bind(this)}/>
                </div>
                <button className="btn" onClick={this.buildDeductiveRecoveringChart.bind(this)}>Построить график</button>
            </div>
        )
    }


    inputParameterizationDeductive() {
       return(<div className="flex-container">
            <div className="input-block">
                <label> Пространство параметров элементов</label>
                <input value={this.state.deductive.m_v} onChange={this.handleChangeDeductiveM_V.bind(this)}/>
            </div>
            <button className="btn" onClick={this.buildParameterizationDeductiveChart.bind(this)}>Построить график</button>
        </div>)
    }

    buildDeductiveRecoveringChart() {
        this.setState((state) => ({
            deductive: {
                ...state.deductive,
                charts: {
                    ...state.deductive.charts,
                    labels: ['Одноуровневая', 'Многоуровневая'],
                    recoveringData: [ this.recoveringDependenciesOneLevelDeductive(), this.recoveringDependenciesMultiLevelDeductive() ],
                }
            }
        }));
        console.log(this.state);
    }

    buildParameterizationDeductiveChart() {
        this.setState((state) => ({
            deductive: {
                ...state.deductive,
                charts: {
                    ...state.deductive.charts,
                    labels: ['Одноуровневая', 'Многоуровневая'],
                    parameterizationData: [ this.parameterizationDependenciesOneLevelDeductive(), this.parameterizationDependenciesMultiLevelDeductive() ],
                }
            }
        }));
        console.log(this.state);
    }

    render() {
        return (
            <div className="charts-container">
                <div>
                    {this.inputInductive()}
                    <div className="chart-container">
                        <BaseChart  headerChart={"Сложность синтезируемой модели"} labels={this.state.inductive.charts.labels} data={this.state.inductive.charts.synthesizedData }/>
                        <BaseChart  headerChart={"Сложность восстановления зависимостей"} labels={this.state.inductive.charts.labels} data={this.state.inductive.charts.recoveringData }/>
                    </div>
                </div>
                <div>
                    {this.inputDeductive()}
                    <BaseChart  headerChart={"Сложность восстановления зависимостей"} labels={this.state.deductive.charts.labels} data={this.state.deductive.charts.recoveringData }/>
                </div>
                <div>
                    {this.inputParameterizationDeductive()}
                    <BaseChart  headerChart={"Сложность параметризации зависимостей"} labels={this.state.deductive.charts.labels} data={this.state.deductive.charts.parameterizationData }/>
                </div>
            </div>
        );
    }
}
