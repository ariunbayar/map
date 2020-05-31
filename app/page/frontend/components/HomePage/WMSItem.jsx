import React, { Component, Fragment } from "react"

import WMSLayerItems from "./WMSLayerItems"


export default class WMSItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: props.wms.name,
            tile: props.wms.tile,
            layers: props.wms.layers,
            is_visible: true,
        }

        this.toggle = this.toggle.bind(this)

    }

    toggle(e) {
        const is_visible = e.target.checked
        this.setState({is_visible})
        this.state.tile.setVisible(is_visible)
    }

    render() {

        const {tile, name, layers, is_visible} = this.state
        return (
            <Fragment>
                <label>
                    <input
                        type="checkbox"
                        onChange={this.toggle}
                        checked={is_visible}
                    />
                    {name}
                </label>

                <WMSLayerItems
                    layers={layers}
                    tileWMS={tile.getSource()}
                />
            </Fragment>
        )
    }
}
