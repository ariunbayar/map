'use strict'

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



class AuthService {

    constructor() {
        this.base_url = 'http://localhost:8101'
    }

    /*
    handleResponse(response) {

        return response.text().then(text => {

            const data = text && JSON.parse(text)

            if (!response.ok) {

                if (response.status == 403) {
                    this.csrf_obtain().then(({csrf}) => {
                        localStorage.setItem('auth_csrf_token', csrf)
                    })
                }

                if ([401, 403].indexOf(response.status) !== -1) {
                    // TODO auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    location.reload(true)
                }

                const error = (data && data.message) || response.statusText
                return Promise.reject(error)
            }

            return data
        })
    }
    */


    doRequest(req) {

        return fetch(req).then(rsp => {

            return rsp.text().then(text => {

                if (rsp.status == 200) {
                    return text && JSON.parse(text)
                }

                if (rsp.status == 403) {

                    const opts = {
                        method: 'GET',
                        headers: {'X-Requested-With': 'XMLHttpRequest'},
                    }

                    return fetch(this.base_url + '/api/csrf/obtain/', opts).then(rsp_csrf => {
                        console.log('rsp_csrf:', rsp_csrf);
                        return rsp_csrf.json().then(({csrf}) => {
                            console.log('rsp_csrf.json():', csrf);
                            localStorage.setItem('auth_csrf_token', csrf)
                            return csrf
                        })
                    }).then((csrf) => {
                        console.log('resend request');
                        req.headers.set('X-CSRFToken', csrf)
                        return fetch(req)
                    })

                }

                if (rsp.status == 401) {
                    //location.reload(true)
                }

                const error = (data && data.message) || response.statusText
                console.log('error', error);
                return Promise.reject(error)

            })

        })

    }

    token_obtain(data) {

        const req = new Request(
            this.base_url + '/api/token/obtain/',
            {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': localStorage.getItem('auth_csrf_token'),
                },
                body: JSON.stringify(data),
            }
        )

        return this.doRequest(req)

    }

}

const service = new AuthService()


class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleChange(field, event) {
        this.setState({
            [field]: event.target.value,
        })
    }

    handleSubmit() {

        service.token_obtain()
            .then((rsp) => {
                console.log(rsp);
            })
        // TODO submit username, password
        // TODO acquire token
        // TODO save to local storage
    }

    render() {
        return (
            <div>
                <h1>Login page</h1>

                <table>
                    <tbody>
                        <tr>
                            <td>Нэр </td>
                            <td>
                                <input type="text" name="username" onChange={(e) => this.handleChange('username', e)}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Нууц үг </td>
                            <td>
                                <input type="password" name="password" onChange={(e) => this.handleChange('password', e)}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Нэр </td>
                            <td>
                                <button type="button" onClick={this.handleSubmit}>Нэвтрэх</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}


class MapView extends React.Component {

    render() {

        return (
            <div>
                <h1> Map View </h1>

                TODO

            </div>
        )

    }

}


class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 'index',
        }
    }

    render() {
        return (
            <div>
                <ul>
                    <li>
                        <a href="#" onClick={() => this.setState({page: 'mapview'})}>Map View</a>
                    </li>
                    <li>
                        <a href="#" onClick={() => this.setState({page: 'login'})}>Login</a>
                    </li>
                </ul>

                {this.state.page == 'mapview' &&
                    <MapView/>
                }

                {this.state.page == 'login' &&
                    <Login/>
                }

            </div>
        )
    }
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App/> , domContainer)
