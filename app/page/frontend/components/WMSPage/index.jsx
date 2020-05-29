import React, { Component } from "react"

import {service} from './service'
import WMSForm from './WMSForm'


export default class WMSPage extends Component {


    constructor(props) {

        super(props)

        this.state = {
            is_form_open: false,
            wms_list: [],
        }

        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)
        this.handleFormSave = this.handleFormSave.bind(this)
        this.handleListUpdated = this.handleListUpdated.bind(this)

    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {

        service.getAll().then(({wms_list}) => {
            console.log(wms_list);
            this.setState({wms_list})
        })

    }

    handleSaveSuccess() {
        this.handleListUpdated()
        this.setState({is_form_open: false})
    }

    handleFormSave(values) {

        if (values.id) {

            service.update(values).then(({success, item}) => {
                if (success) this.handleSaveSuccess()
            })

        } else {

            service.create(values).then(({success, item}) => {
                if (success) this.handleSaveSuccess()
            })

        }

    }

    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success) this.handleSaveSuccess()
        })
    }

    render() {
        return (
            <div>
                <p>Login page</p>

                <table>
                    <thead>
                        <tr>
                            <td> Нэр </td>
                            <td> Url </td>
                            <td></td>
                            <td> Огноо</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.wms_list.map(({id, name, url, created_at}) =>
                            <tr key={id}>
                                <td><a onClick={() => 1}>{name}</a></td>
                                <td>{url}</td>
                                <td></td>
                                <td>{created_at}</td>
                                <td><a href="#" onClick={() => this.handleRemove(id)}>x</a></td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button onClick={() => this.setState({is_form_open: true})}>Нэмэх</button>

                {this.state.is_form_open &&
                    <WMSForm handleSave={this.handleFormSave}/>
                }

            </div>
        )
    }
}
