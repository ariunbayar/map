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

class Service {

    handleResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text)
            if (!response.ok) {
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

    token_obtain(data) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(data),
        }
        return fetch('http://localhost:8101/api/token/obtain/', requestOptions).then(this.handleResponse)
    }

}

const service = new Service()


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
