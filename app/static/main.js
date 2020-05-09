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
);


class ListRecursive extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: props.name,
            data: props.data,
            collapsed: props.level == 3,
            level: props.level,
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState({ collapsed: !this.state.collapsed })
    }

    render() {

        const items = []

        if (typeof(this.state.data) === 'string') {

            return (
                <div>
                    <span className="badge badge-secondary">{ this.state.name }</span>
                    :
                    <code>{ '' + this.state.data }</code>
                </div>
            )
            return '' + this.state.data

        } else if (Array.isArray(this.state.data)) {

            this.state.data.forEach((value, index)=> {
                items.push(
                    <li key={ index }>
                        <ListRecursive name={ index } data={ value } level={ this.state.level + 1 } />
                    </li>
                )
            })

        } else if (typeof(this.state.data) === 'object') {

            let index = 0
            for (let [field, value] of Object.entries(this.state.data)) {
                items.push(
                    <li key={ index++ }>
                        <ListRecursive name={ field} data={ value } level={ this.state.level + 1 } />
                    </li>
                )
            }

        }

        return (

            <div>
                <span className="badge badge-secondary" onClick={ this.handleClick }>
                    { this.state.name }
                </span>
                {this.state.collapsed
                    ? <span className="badge badge-warning">»</span>
                    : <ul className="list-recursive"> { items } </ul>
                }
            </div>
        )


    }

}


class CapabilitiesLoader extends React.Component {

    constructor(props) {
        super(props)
        this.state = { data: null }
    }

    async loadData() {
        const rsp = await axios.get('/qgis/get-capabilities/json/')
        console.log(rsp.data);
        this.setState({ data: rsp.data })
    }

    render() {

        if (this.state.data) {

            return <ListRecursive data={ this.state.data } level={ 0 } />

        } else {

            return (
                <div> loading .. </div>
            )

        }

    }
}


class URLListItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            url: props.url,
        }
    }

    render() {
        return (
            <tr>
                <td>
                    <button type="button" className="btn btn-primary btn-sm" onClick={ this.props.handleRemove }>remove</button>
                </td>
                <td> { this.state.url } </td>
            </tr>
        )
    }
}


class URLList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            urls: props.urls
        }
        this.loadURLs.bind(this)()
        this.handleRemove = this.handleRemove.bind(this);
    }

    async loadURLs() {
        const rsp = await axiosInstance.get('qgis/urls/')
        this.setState({urls: rsp.data.urls})
    }

    async handleRemove(url) {
        try {
            const rsp = await axiosInstance.post('qgis/urls/delete/', { url })
            this.setState({ urls: rsp.data.urls })
        } catch (error) {
            throw error
        }
    }

    render() {
        const urls = this.state.urls

        return (
            <table className="table table-sm">
                <tbody>
                    { urls.map(([index, url]) =>
                        <URLListItem
                            url={ url ? url : '' }
                            key={ index }
                            handleRemove={ () => this.handleRemove(url) }
                        />
                    )}
                </tbody>
            </table>
        )
    }

}


class URLForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            url: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({ url: event.target.value })
    }

    async handleSubmit(event) {
        event.preventDefault()

        try {
            const {data: {WMS_Capabilities}} = await axiosInstance.post(
                'qgis/get-capabilities/json/',
                {url: this.state.url},
            )
            const {data: {urls}} = await axiosInstance.post('qgis/urls/', {url: this.state.url})
            console.log(WMS_Capabilities);
            this.props.urlUpdated(urls)
        } catch (error) {
            throw error
        }
        this.setState({url: ''})
    }

    render() {
        return (
            <form onSubmit={ this.handleSubmit } action="">
                <input type="text" className="form-control"
                    value={ this.state.url }
                    onChange={ this.handleChange }
                />
            </form>
        )
    }

}


class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            urls: [],
        }
        this.urlUpdated = this.urlUpdated.bind(this)
    }

    urlUpdated(urls) {
        this.setState({ urls })
    }

    render() {
        return (
            <div>
                <URLList urls={ this.state.urls } key={ this.state.urls.length }/>
                <URLForm urlUpdated={ this.urlUpdated }/>
                <CapabilitiesLoader/>
            </div>
        )
    }
}


const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App/> , domContainer)
