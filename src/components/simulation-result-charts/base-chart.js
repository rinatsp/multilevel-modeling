import React from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
    labels: [],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: []
        }
    ]
};

export class BaseChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                labels: [''],
                datasets: [
                    {
                        label: [''],
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: []
                    }
                ]
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState((state) => ({
            data: {
                ...state.data,
                labels: nextProps.labels,
                datasets: [{
                    ...state.data.datasets[0],
                    data: nextProps.data
                }]
            }
        }));
        this.props = nextProps;
    }

    render() {
        return (
            <div className="chart">
                <h2>{this.props.headerChart}</h2>
                <Bar
                    data={this.state.data}
                    maxWidth={400}
                    maxHeight={400}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
            </div>
        );
    }
}
