import React from 'react';
import BaseChart from './base-chart';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default class ByElements extends BaseChart {
    constructor() {
        super();
    }

    getDatasets() {
        const { sets, c } = this.props;
        return sets.map(({ k, n }, index) => {
            return {
                label: `k = ${k}, n = ${n}`,
                "function": function(x) {
                    let val = 0;
                    for (let i = 1; i <= k; i++) {
                        val += (x * x) / (n * n);
                    }
                    return val * c;
                },
                borderColor: getRandomColor(),
                data: [],
                fill: false
            }
        });
    }
    getLabels() {
        return _.range(20, 90);
    }
}