import React from 'react';
import ByFrequencyChart from './by-frequency';

export default class ComplexityByElements extends React.Component {
    constructor() {
        super();
        this.state = {
            a: 2,
            b: 2,
            sets: [
                {
                    ground: 1 / 2
                },
                {
                    ground: 1 / 3
                },
                {
                    ground: 1 / 4
                },
                {
                    ground: 3 / 4
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
        const { sets, a, b } = this.state;
        return (
            <div>
                <ByFrequencyChart sets={sets} a={a} b={b} />
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