import React, {Component} from 'react';
import {Login, Dashboard} from './components'
import './App.css';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datetime/css/react-datetime.css'
import {BrowserRouter, Route} from 'react-router-dom'


class App extends Component {
    constructor() {
        super();
        this.onLogin = this.onLogin.bind(this);


    }

    onLogin(data) {
        this.account = data;
    }

    notify = (message) => {
        toast[message.type](message.text)
    };


    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path='/'
                           render={(props) => <Login {...props} onLogin={this.onLogin} notify={this.notify}/>}/>
                    <Route path='/dashboard'
                           render={(props) => <Dashboard {...props} account={this.account} notify={this.notify}/>}/>

                    <ToastContainer/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
