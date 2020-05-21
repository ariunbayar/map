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


class Capabilities {

    constructor(xml_raw) {

        this.xml = (new DOMParser()).parseFromString(xml_raw, "text/xml")

    }

    getLayers() {
        const nodes = this.xml.querySelectorAll('WMS_Capabilities > Capability Layer')
        return [...nodes].map((layer) => {
            return [
                layer.querySelector('Name').innerHTML,
                layer.querySelector('Title').innerHTML,
            ]
        })
    }

    getWMS() {
        const res = this.xml.querySelector(
            'WMS_Capabilities > Capability > Request > GetMap > DCPType > HTTP > Get > OnlineResource'
        )
        return res.getAttribute('xlink:href')
    }

    getBoundingBox(CRS) {

        const bbox = this.xml.querySelector(`WMS_Capabilities > Capability > Layer > Layer > BoundingBox[CRS="${CRS}"]`)

        return ['minx', 'miny', 'maxx', 'maxy']
            .map((attr) => bbox.getAttribute(attr))
            .join(',')
    }

}



const service = {

    loadCapabilities: function(wms, onSuccess, onFail) {

        const data = {
            wms,
            queryargs: [
                ['SERVICE', 'WMS'],
                ['REQUEST', 'GetCapabilities'],
                ['VERSION', '1.3.0'],
            ]
        }

        return new Promise((resolve, reject) => {
            axiosInstance
                .post('WMS/', data, {responseType: 'blob'})
                .then((rsp) => {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        const capabilities = new Capabilities(reader.result)
                        resolve(capabilities)
                    }
                    reader.readAsText(rsp.data)
                })
                .catch(reject)
        })
    },

    loadImage: function(wms, queryargs) {
        const data = {
            wms,
            queryargs: [
                ['SERVICE', 'WMS'],
                ['REQUEST', 'GetMap'],
                ['VERSION', '1.3.0'],
                ...queryargs,
            ]
        }
        return new Promise((resolve, reject) => {
            axiosInstance
                .post('WMS/', data, {responseType: 'blob'})
                .then((rsp) => {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        resolve(reader.result)
                    }
                    reader.readAsDataURL(rsp.data)
                })
                .catch(reject)
        })
    }

}


class Layers extends React.Component {

    constructor(props) {
        super(props)

        const layers = this.props.capabilities.getLayers()

        this.state = {
            layers: layers,
            layers_active: [layers[0][0]],
        }

        this.handleToggleLayer = this.handleToggleLayer.bind(this)
    }

    handleToggleLayer(name) {

        let {layers_active} = this.state

        if (layers_active.indexOf(name) > -1) {
            layers_active = layers_active.filter(v => v !== name)
        } else {
            layers_active = [...layers_active, name]
        }

        this.setState({layers_active})
        this.props.handleToggleLayers(layers_active)
    }

    componentDidMount() {
        this.props.handleToggleLayers(this.state.layers_active)
    }

    render() {
        return (
            <div>
                {this.state.layers.map(([name, title], key) =>
                    <div key={key}>
                        <label>
                            <input
                                type="checkbox"
                                onChange={() => this.handleToggleLayer(name)}
                                checked={this.state.layers_active.indexOf(name) > -1}
                            />
                            {title}
                        </label>
                    </div>
                )}
            </div>
        )
    }

}


class WebMap extends React.Component {

    constructor(props) {
        super(props)

        const {capabilities} = props

        this.state = {
            wms: capabilities.getWMS(),
            //crs: 'EPSG:4326',
            //bbox: capabilities.getBoundingBox('EPSG:4326'),
            //crs: 'CRS:84',
            //bbox: capabilities.getBoundingBox('CRS:84'),
            crs: 'EPSG:3857',
            bbox: '11271098.44281895,5635549.221409475,11897270.578531114,6261721.357121639',
            layers: props.layers,
            image_src: '',
            is_loading: true,
        }
        this.loadLayers = this.loadLayers.bind(this)
        this.handlePan = this.handlePan.bind(this)
    }

    componentDidMount() {
        const {layers, bbox} = this.state
        this.loadLayers(layers, bbox)
    }

    componentDidUpdate(prevProps) {
        const {layers} = this.props
        if (layers !== prevProps.layers) {
            const {bbox} = this.state
            this.loadLayers(layers, bbox)
        }
    }

    loadLayers(layers, bbox) {

        this.setState({
            is_loading: true,
            layers,
            bbox,
        })

        const {wms} = this.state
        const queryargs = [
            ['BBOX', bbox],
            ['CRS', this.state.crs],
            ['LAYERS', layers],
            ['WIDTH', '256'],
            ['HEIGHT', '256'],
            ['STYLES', ''],
            ['FORMAT', 'image/png'],
            ['DPI', '96'],
            ['MAP_RESOLUTION', '96'],
            ['FORMAT_OPTIONS', 'dpi:96'],
            ['TRANSPARENT', 'TRUE'],
        ]

        service.loadImage(wms, queryargs)
            .then((image) => {
                    this.setState({
                        image_src: image,
                        is_loading: false,
                    })
            })
    }

    handlePan(offsetX, offsetY) {
        const {layers} = this.state
        let {bbox} = this.state
        let [minx, miny, maxx, maxy] = bbox.split(',').map((v) => parseFloat(v))

        const deltaX = maxx - minx
        minx += deltaX * offsetX
        maxx += deltaX * offsetX

        const deltaY = maxy - miny
        miny += deltaY * offsetY
        maxy += deltaY * offsetY

        bbox = [minx, miny, maxx, maxy].join(',')

        this.loadLayers(layers, bbox)
    }

    handleZoom(scale) {
        const {layers} = this.state
        let {bbox} = this.state
        let [minx, miny, maxx, maxy] = bbox.split(',').map((v) => parseFloat(v))

        const deltaX = maxx - minx
        const deltaY = maxy - miny

        minx += deltaX * scale
        maxx -= deltaX * scale
        miny += deltaY * scale
        maxy -= deltaY * scale

        bbox = [minx, miny, maxx, maxy].join(',')

        this.loadLayers(layers, bbox)
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <th width="150px">
                            {this.state.is_loading &&
                                <span className="badge badge-secondary">Loading...</span>
                            }
                        </th>
                        <th className="center" width="400px">
                            <button onClick={() => this.handlePan(0, .2)} className="btn btn-secondary">up</button>
                        </th>
                        <th width="150px">
                        </th>
                    </tr>
                    <tr>
                        <th className="center">
                            <button onClick={() => this.handlePan(-.2, 0)} className="btn btn-secondary">left</button>
                        </th>
                        <th className="center">
                            <img src={this.state.image_src}/>
                        </th>
                        <th className="center">
                            <button onClick={() => this.handlePan(.2, 0)}className="btn btn-secondary">right</button>

                        </th>
                    </tr>
                    <tr>
                        <th className="center">
                            <button onClick={() => this.handleZoom(.1)} className="btn btn-secondary">+</button>

                        </th>
                        <th className="center">
                            <button onClick={() => this.handlePan(0, -.2)} className="btn btn-secondary">down</button>

                        </th>
                        <th className="center">
                            <button onClick={() => this.handleZoom(-.1)} className="btn btn-secondary">-</button>
                        </th>
                    </tr>
                </tbody>
            </table>
        )
    }

}


class GIS extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            layers: '',
            capabilities: null,
        }

        this.handleToggleLayers = this.handleToggleLayers.bind(this)
        this.loadCapabilities = this.loadCapabilities.bind(this)

    }

    loadCapabilities(wms) {

        this.setState({
            capabilities: null,
        })

        service.loadCapabilities(wms)
            .then((capabilities) => {
                this.setState({capabilities})
            })

    }

    componentDidUpdate(prevProps) {
        const {wms} = this.props
        if (wms !== prevProps.wms) {
            this.loadCapabilities(wms)
        }
    }

    componentDidMount() {
        this.loadCapabilities(this.props.wms)
    }

    handleToggleLayers(active_layers) {
        const layers = active_layers.join(',')
        this.setState({layers})
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-9">
                        {this.state.capabilities && this.state.layers &&
                            <WebMap
                                capabilities={this.state.capabilities}
                                layers={this.state.layers}
                            />
                        }
                    </div>
                    <div className="col-3">
                        {this.state.capabilities &&
                            <Layers
                                capabilities={this.state.capabilities}
                                handleToggleLayers={this.handleToggleLayers}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    }

}


class App extends React.Component {

    constructor(props) {
        super(props)
        const url = localStorage.getItem('__url')
        this.state = {
            url: url,
            form_url: url,
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(event) {
        event.preventDefault()
        const url = this.state.form_url
        this.setState({url})
        localStorage.setItem('__url', url)
    }

    render() {
        return (
            <div>


                <p>Copy this url:<br/>http://qgis.20k.mn:8080/cgi-bin/qgis_mapserv.fcgi</p>
                <p>Paste & Press enter</p>
                <p>If it doesn't show, <strong>refresh</strong> the page</p>

                <form onSubmit={this.onSubmit}>
                    <input type="text"
                        className="form-control"
                        value={this.state.form_url}
                        placeholder='http://qgis.20k.mn/cgi-bin/qgis_mapserv.fcgi'
                        onChange={(e) => this.setState({form_url: e.target.value})}
                    />
                </form>

                <GIS wms={this.state.url}/>
            </div>
        )
    }
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App/> , domContainer)
