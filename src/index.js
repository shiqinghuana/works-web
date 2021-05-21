import React from 'react';
import ReactDOM from 'react-dom';

import 'antd/dist/antd.css';
import reportWebVitals from './reportWebVitals';

import {BrowserRouter} from "react-router-dom";
import {renderRoutes} from "react-router-config";
import routes from "./config/router"




function App(){
    return (
        <React.Fragment>
            {/*store 作为 Provider 的属性*/}
            <BrowserRouter>
                {renderRoutes(routes)}
            </BrowserRouter>

        </React.Fragment>
    )
}

ReactDOM.render(
    < App/>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
