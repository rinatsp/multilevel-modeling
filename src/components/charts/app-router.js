import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React from 'react';
import { ChartsPage } from "../simulation-result-charts/charts-page";
import App from '../inferer/';

function AppRouter() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Синтез</Link>
                        </li>
                        <li>
                            <Link to="/charts/">Графики</Link>
                        </li>
                    </ul>
                </nav>

                <Route path="/" exact component={App} />
                <Route path="/charts" component={ChartsPage} />
            </div>
        </Router>
    );
}

export default AppRouter;