import React from 'react';
import { Chart, Line } from 'react-chartjs-2';
import _ from 'lodash';

export default class BaseChart extends React.Component {
    constructor() {
        super();
        this.state = {};

        Chart.pluginService.register({
            beforeInit: function(chart) {
                var data = chart.config.data;
                for (var i = 0; i < data.datasets.length; i++) {
                    for (var j = 0; j < data.labels.length; j++) {
                        var fct = data.datasets[i].function,
                            x = data.labels[j],
                            y = fct(x);
                        data.datasets[i].data.push(y);
                    }
                }
            }
        });
    }

    render() {
        const { sets } = this.props;
        return (
            <div className="chart">
                <Line
                    data={{
                        labels: this.getLabels(),
                        datasets: this.getDatasets()
                    }}
                    options={{
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }}
                />
            </div>
        );
    }
}