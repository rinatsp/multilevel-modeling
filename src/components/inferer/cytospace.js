import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import cydagre from 'cytoscape-dagre';

cydagre(cytoscape);

let cyStyle = {
    minHeight: '800px',
    maxHeight: '900px',
    width: '100%',
};

let conf = {
    boxSelectionEnabled: false,
    autounselectify: true,
    zoomingEnabled: true,
    style: [
        {
            selector: 'node',
            css: {
                'content': 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center'
            }
        },
        {
            selector: '.finish',
            css: {
                'background-color': 'red'
            }
        },
        {
            selector: 'edge.start',
            css: {
                'line-color': 'blue',
                'target-arrow-color': 'blue',
                'curve-style': 'bezier',
                'edge-distances': 'node-position',
            }
        },
        {
            selector: ':parent',
            css: {
                'text-valign': 'top',
                'text-halign': 'center',
            }
        },
        {
            selector: 'edge',
            css: {
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle'
            }
        }
    ],
    zoom: 1,
    minZoom: 1,
    maxZoom: 50,
    layout: {
        name: 'preset',
        padding: 5
    }
};

class Cytoscape extends Component {
    constructor(props) {
        super(props);
        this.state = { cy: {} };
    }

    componentDidMount() {
        conf.container = this.cyRef;
        conf.elements = this.props.elements;
        const cy = cytoscape(conf);

        this.state = { cy };
        cy.json();
        console.log(cy);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.cy) {
            this.state.cy.destroy();
        }
        conf.container = this.cyRef;
        conf.elements = nextProps.elements;
        const cy = cytoscape(conf);
        this.state = { cy };
    }

    componentWillUnmount() {
        if (this.state.cy) {
            this.state.cy.destroy();
        }
    }

    render() {
        return <div style={cyStyle} ref={(cyRef) => {
            this.cyRef = cyRef;}}>
        </div>
    }
}

export default Cytoscape;
