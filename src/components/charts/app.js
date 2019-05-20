import React from 'react';

import ByElements from './complexity-by-elements';
import ByFrequency from './complexity-by-frequency';


export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }

    render() {
        return (
            <div className="main-wrapper">
                <ByElements />
                <ByFrequency />
            </div>
        );
    }
}