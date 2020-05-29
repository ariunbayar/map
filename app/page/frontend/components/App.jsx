import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";

import LoginPage from "./LoginPage"
import ConfigPage from "./ConfigPage"
import HomePage from "./HomePage"


export default class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            n: 5,
        }

        this.handleLogout = this.handleLogout.bind(this)

    }

    handleLogout() {
        console.log('logout')
    }

    render() {
        return (
            <BrowserRouter>
                <nav>
                    <Link to={"/p/"}>Нүүр</Link>
                    &nbsp;|&nbsp;
                    <Link to={"/p/config/"}>Тохиргоо</Link>
                    &nbsp;|&nbsp;
                    <Link to={"/p/login/"}>Нэвтрэх</Link>
                    &nbsp;|&nbsp;
                    <a onClick={this.handleLogout}>Гарах</a>
                </nav>
                <main>
                    <h1>Homepage</h1>
                    <Switch>
                        <Route exact path={"/p/login/"} component={LoginPage}/>
                        <Route exact path={"/p/config/"} component={ConfigPage}/>
                        <Route exact path={"/p/"} component={HomePage}/>
                    </Switch>
                </main>
            </BrowserRouter>
        )
    }
}
