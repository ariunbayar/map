import React, { Component } from "react"


export default class WMSForm extends Component {


    constructor(props) {

        super(props)

        this.state = {
            name: '',
            url: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)

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
                        <input type="text" onChange={(e) => this.handleChange('name', e)}/>
                    </dd>

                    <dt> WMS URL: </dt>
                    <dd>
                        <input type="text" onChange={(e) => this.handleChange('url', e)}/>
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

