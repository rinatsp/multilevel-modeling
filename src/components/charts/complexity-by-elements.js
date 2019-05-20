import React from 'react';
import ByElementsChart from './by-elements';

export default class ComplexityByElements extends React.Component {
    constructor() {
        super();
        this.state = {
            c: 1,
            sets: [
                {
                    k: 1,
                    n: 1
                },
                {
                    k: 2,
                    n: 2
                },
                {
                    k: 2,
                    n: 3
                },
                {
                    k: 3,
                    n: 3
                }
            ]
        };
    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }

    renderControls() {
        return (
            <div>
                nothing here yet
            </div>
        );
    }
    renderCharts() {
        const { sets, c } = this.state;
        return (
            <div>
                <ByElementsChart sets={sets} c={c} />
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderCharts()}
            </div>
        );
    }
}