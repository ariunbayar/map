import React, { Component } from "react"

import {service} from './service'
import WMSForm from './WMSForm'
import WMS from './WMS'


export default class WMSPage extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
            id: null,
            name: '',
            url: '',
        }

        this.state = {
            is_form_open: false,
            wms_list: [],
            form_values: {...this.initial_form_values},
        }

        this.handleSaveSuccess = this.handleSaveSuccess.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleAdd = this.handleAdd.bind(this)

    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {

        service.getAll().then(({wms_list}) => {
            this.setState({wms_list})
        })

    }

    handleSaveSuccess() {
        this.handleListUpdated()
        this.setState({is_form_open: false})
    }

    handleSave(values) {

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

    handleEdit(form_values) {
        this.setState({form_values, is_form_open: true})
    }

    handleAdd() {
        const form_values = this.initial_form_values
        this.setState({form_values, is_form_open: true})
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
                        {this.state.wms_list.map((values) =>
                            <WMS
                                key={values.id}
                                values={values}
                                handleRemove={() => this.handleRemove(values.id)}
                                handleEdit={() => this.handleEdit(values)}
                            />
                        )}
                    </tbody>
                </table>

                <button onClick={this.handleAdd}>Нэмэх</button>

                {this.state.is_form_open &&
                    <WMSForm
                        handleSave={this.handleSave}
                        values={this.state.form_values}
                    />
                }

            </div>
        )
    }
}
