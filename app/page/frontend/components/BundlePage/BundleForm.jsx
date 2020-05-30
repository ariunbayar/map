import React, { Component, Fragment } from "react"
import {service} from "./service"


export default class BundleForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            id: props.values.id,
            name: props.values.name,
            price: props.values.price,
            layers: props.values.layers,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleLayerToggle = this.handleLayerToggle.bind(this)

    }


    componentDidMount() {
    }

    componentDidUpdate(prevProps) {

        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, price, layers} = this.props.values
            this.setState({id, name, price, layers})
        }

    }


    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }

    handleSave() {
        this.props.handleSave(this.state)
    }

    handleLayerToggle(e) {
        let layers = this.state.layers
        const value = parseInt(e.target.value)

        if (e.target.checked) {
            layers.push(value)
        } else {
            layers = layers.filter((id) => id != value)
        }
        this.setState({layers})
    }


    render() {
        return (
            <div>
                <dl>
                    <dt> Багцын нэр: </dt>
                    <dd>
                        <input type="text" onChange={(e) => this.handleChange('name', e)} value={this.state.name}/>
                    </dd>

                    <dt> Үнэ: </dt>
                    <dd>
                        <input type="number" onChange={(e) => this.handleChange('price', e)} value={this.state.price}/>
                    </dd>

                    {this.props.formOptions.map(({name, layers}, idx) =>
                        <Fragment key={idx}>
                            <dt> {name} </dt>
                            <dd>

                                {layers.map((layer) =>
                                    <div key={layer.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={this.state.layers.indexOf(layer.id) > -1}
                                                onChange={this.handleLayerToggle}
                                                value={layer.id}
                                            />
                                            {layer.name}
                                        </label>
                                    </div>
                                )}

                            </dd>
                        </Fragment>
                    )}

                    <dt></dt>
                    <dd>
                        <button onClick={this.handleSave}>Хадгал</button>
                    </dd>
                </dl>
            </div>
        )
    }
}

