import React, { Component, Fragment } from "react"

import 'ol/ol.css'
import {Map, View} from 'ol'
import Tile from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import OSM from 'ol/source/OSM'

import {service} from './service'
import WMSItem from './WMSItem'


export default class BundleMap extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bundle: props.bundle,
            map_wms_list: [],
        }

        this.handleToggle = this.handleToggle.bind(this)
        this.handleWMSLayersLoaded = this.handleWMSLayersLoaded.bind(this)
    }

    componentDidMount() {

        service.loadWMSLayers(this.state.bundle.id).then(({wms_list}) => {
            this.handleWMSLayersLoaded(wms_list)
        })
    }

    componentDidUpdate(prevProps) {

        if (this.props.bundle.id === prevProps.bundle.id) return

        const {bundle} = this.props
        this.setState({bundle})

        service.loadWMSLayers(bundle.id).then(({wms_list}) => {
            this.handleWMSLayersLoaded(wms_list)
        })

    }

    handleWMSLayersLoaded(wms_list) {

        const map_wms_list = wms_list.map(({name, url, layers}) => {

            return {
                name,
                layers,
                tile: new Tile({
                    source: new TileWMS({
                        projection: 'EPSG:3857',
                        url: url,
                        params: {
                            'LAYERS': layers.map((layer) => layer.code).join(',')
                        }
                    }),
                }),
            }

        })

        this.setState({map_wms_list})

        const layer_osm = new Tile({
            source: new OSM({
                attributions: '',
            })
        })


        const map = new Map({
            target: 'map',
            layers: [
                layer_osm,
                ...map_wms_list.map((wms) => wms.tile),
            ],
            view: new View({
                projection: 'EPSG:3857',
                center: [0, 0],
                zoom: 0
            })
        })

    }

    handleToggle(idx) {
        const layer = this.state.layers[idx]
        layer.setVisible(!layer.getVisible())
    }

    render() {
        return (
            <Fragment>
                <div className="span8">
                    <div id="map" style={{width: '100%', height: '600px'}}></div>
                </div>
                <div className="span2">
                    {this.state.map_wms_list.map((wms, idx) =>
                        <WMSItem wms={wms} key={idx}/>
                    )}
                </div>
            </Fragment>
        )
    }
}
