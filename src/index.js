import ReactDOM from 'react-dom';
import React from 'react';

import AppRouter from "./components/charts/app-router";

require('./css/main.less');

ReactDOM.render(
    <AppRouter />,
    document.querySelector('#root')
);

