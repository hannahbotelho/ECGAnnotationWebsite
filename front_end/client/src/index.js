import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Router} from 'react-router';
//import hashHistory from 'react-router-dom'
//import history from 'react-router-dom'
import routes from './routes';

import { BrowserRouter, Link, Route } from 'react-router-dom';

import Login from './components/Login/LoginSecond';
import MainContainer from './components/MainContainer/MainContainer';
import MainContainerAdmin from './components/MainContainer/MainContainerAdmin';
import MainContainerAnnChecker from './components/MainContainer/MainContainerAnnChecker';
import MainContainerReadOnly from "./components/MainContainer/MainContainerReadOnly";

ReactDOM.render(

    <BrowserRouter basename={'ECGAnnotation'}>
        <div>
            <Route exact path="/" component={Login}/>
            <Route path="/mainContainer" component={MainContainer} />
            <Route path="/mainContainerAdmin" component={MainContainerAdmin} />
            <Route path="/mainContainerAnnChecker" component={MainContainerAnnChecker} />
            <Route path="/mainContainerReadOnly" component={MainContainerReadOnly} />
        </div>
    </BrowserRouter>
    ,
    document.getElementById('root')

);

