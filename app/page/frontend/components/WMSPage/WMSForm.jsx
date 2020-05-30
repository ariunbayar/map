import React, { Component } from "react"
import {service} from "./service"


export default class WMSForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            id: props.values.id,
            name: props.values.name,
            url: props.values.url,
            public_url: props.values.public_url,
            layer_choices: [],
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.loadLayers = this.loadLayers.bind(this)

    }


    componentDidMount() {
        this.state.id && this.loadLayers(this.state.public_url)
    }

    componentDidUpdate(prevProps) {

        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, url, public_url} = this.props.values
            console.log(public_url);
            this.setState({id, name, url, public_url, layer_choices: []})

            this.state.id && this.loadLayers(public_url)
        }

    }

    loadLayers(public_url) {

        service.getLayers(public_url).then((layer_choices) => {
            this.setState({layer_choices})
        })
    }

    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }

    handleSave() {
        this.props.handleSave(this.state)
    }

    render() {
        return (
            <div>
                <dl>
                    <dt> Нэр: </dt>
                    <dd>
                        <input type="text" onChange={(e) => this.handleChange('name', e)} value={this.state.name}/>
                    </dd>

                    <dt> WMS URL: </dt>
                    <dd>
                        <input type="text" onChange={(e) => this.handleChange('url', e)} value={this.state.url}/>
                    </dd>

                    <dt> Endpoint </dt>
                    <dd>
                        {this.state.id && this.state.public_url}
                        {!this.state.id && 'Хадгалсаны дараагаар Endpoint URL үүснэ!'}
                    </dd>

                    <dt> Давхаргууд </dt>
                    <dd>
                        {this.state.id && this.state.layer_choices.map((layer, idx) =>
                            <div key={idx}>
                                <label>
                                    <input type="checkbox" value={layer.name}/>
                                    {layer.name} ({layer.code})
                                </label>
                            </div>
                        )}
                        {!this.state.id && 'Хадгалсаны дараагаар давхаргуудыг үзэх боломжтой болно'}
                    </dd>

                    <dt></dt>
                    <dd>
                        <button onClick={this.handleSave}>Хадгал</button>
                    </dd>
                </dl>
            </div>
        )
    }
}

