import React, { Component } from "react";

import 'ol/ol.css'
import {Map, View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import OSM from 'ol/source/OSM'


export default class HomePage extends Component {

    constructor(props) {
        super(props)

        const tile_layer_wms = new TileLayer({
                    source: new TileWMS({
                        projection: 'EPSG:3857',
                        url: 'http://qgis.20k.mn:8080/cgi-bin/qgis_mapserv.fcgi',
                        params: {
                            'LAYERS': 'airports,places,countries'
                        }
                    }),
                })

        const tile_layer_osm = new TileLayer({
                    source: new OSM({
                        attributions: '',
                    })
                })

        this.state = {
            layers: [
                tile_layer_osm,
                tile_layer_wms,
            ],
        }

        this.handleToggle = this.handleToggle.bind(this)
    }

    componentDidMount() {

        const map = new Map({
            target: 'map',
            layers: this.state.layers,
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
            <div>
                <p>Homepage7</p>

                <input type="button" value="toggle 0" onClick={() => this.handleToggle(0)}/>
                <input type="button" value="toggle 1" onClick={() => this.handleToggle(1)}/>
                <div id="map" style={{width: '100%', height: '600px'}}></div>
            </div>
        )
    }
}
