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

const axiosInstance = axios.create()


axiosInstance.interceptors.request.use(
    config => {
        config.headers['X-CSRFToken'] = getCookie('csrftoken')
        return config
    },
    error => Promise.reject(error),
)


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
        console.log('submit', this.state)
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
                                <input type="button" onClick={this.handleSubmit}/>
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
