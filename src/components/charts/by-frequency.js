import React from 'react';
import BaseChart from './base-chart';

function getBaseLog(x, y) {
  return Math.log(x) / Math.log(y);
}

export default class ByFrequency extends BaseChart {
    constructor() {
        super();
    }

    getDatasets() {
        const { sets, a, b } = this.props;
        return sets.map(({ ground }, index) => {
            return {
                label: `ground = ${ground}`,
                "function": function(x) {
                    const val =  a * getBaseLog(x, ground) + b;
                    return val;
                },
                borderColor: "blue",
                data: [],
                fill: false
            }
        });
    }
    getLabels() {
        return _.range(3, 31)
    }
}