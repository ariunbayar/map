import React, { Component } from "react"

import {service} from './service'
import BundleForm from './BundleForm'
import Bundle from './Bundle'


export default class BundlePage extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
            id: null,
            name: '',
            price: 0,
            layers: [],
        }

        this.state = {
            bundle_list: [],
            form_options: {},
            is_form_open: false,
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

        service.getAll().then(({bundle_list, form_options}) => {
            this.setState({bundle_list, form_options})
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
                <table>
                    <thead>
                        <tr>
                            <td> Багцын нэр </td>
                            <td> Үнэ </td>
                            <td> WMS сервис </td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.bundle_list.map((values) =>
                            <Bundle
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
                    <BundleForm
                        handleSave={this.handleSave}
                        formOptions={this.state.form_options}
                        values={this.state.form_values}
                    />
                }

            </div>
        )
    }
}
