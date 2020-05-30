import React, { Component } from "react"


export default class WMSForm extends Component {


    constructor(props) {

        super(props)

        this.state = {
            id: props.values.id,
            name: props.values.name,
            url: props.values.url,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)

    }

    componentDidUpdate(prevProps) {

        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, url} = this.props.values
            this.setState({id, name, url})
        }

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

                    <dt></dt>
                    <dd>
                        <button onClick={this.handleSave}>Хадгал</button>
                    </dd>
                </dl>
            </div>
        )
    }
}

