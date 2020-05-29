import React, {Component} from 'react'

//import {service} from '../service'
//import ConfigItem from './ConfigItem.jsx'
//import ConfigForm from './ConfigForm.jsx'


export default class ConfigPage extends Component {

    /*
    constructor(props) {
        super(props)

        this.state = {
            configs: [],
            config_edit: {},
            is_form_open: false,
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.handleNew = this.handleNew.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleFormClose = this.handleFormClose.bind(this)
        this.handleFormSuccess = this.handleFormSuccess.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
    }

    componentDidMount() {
        service.getAll().then((data) => {
            const {configs} = data
            this.setState({configs})
        })
    }

    handleRemove(id) {
        service.remove(id).then(() => {
            const configs = this.state.configs.filter((config) => {
                return config.id != id
            })
            this.setState({configs})
        })
    }

    handleNew(event) {
        event.preventDefault()
        this.setState({
            config_edit: {},
            is_form_open: true,
        })
    }

    handleEdit(config) {
        this.setState({
            config_edit: config,
            is_form_open: true,
        })
    }

    handleFormClose(event) {
        this.setState({is_form_open: false})
    }


    handleUpdate(config) {
        service.update(config).then(({config}) => {
            const configs = this.state.configs.map((conf) => {
                return conf.id == config.id ? config : conf
            })
            this.setState({
                configs,
                is_form_open: false
            })
        })
    }

    handleCreate(config) {
        service.create(config).then(({config}) => {
            const configs = [
                ...this.state.configs,
                config,
            ]
            this.setState({
                configs,
                is_form_open: false
            })
        })
    }

    handleFormSuccess(config) {
        if (config.id) {
            this.handleUpdate(config)
        } else {
            this.handleCreate(config)
        }
    }

    render() {
        return (
            <div>
                <table className="var-width">
                    <thead>
                        <tr>
                            <th> Нэр </th>
                            <th> Утга </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.configs.map((config) =>
                            <ConfigItem
                                key={config.id}
                                config={config}
                                handleRemove={() => this.handleRemove(config.id)}
                                handleEdit={() => this.handleEdit(config)}
                            />
                        )}
                        <tr>
                            <td>
                                <a className="highlight margin-fix" onClick={this.handleNew} href="#">
                                    <i className="fas fa-plus-circle fa-xs"></i> шинэ
                                </a>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div className={'popup-viewer' + (!this.state.is_form_open ? ' hidden' : '')}>
                    <div className="popup-box">
                        <div className="popup-title">
                            <h2>Тохиргоо нэмэх</h2>
                        </div>
                        <div className="popup-content">
                            {this.state.is_form_open &&
                                <ConfigForm
                                    item={this.state.config_edit}
                                    onCancel={this.handleFormClose}
                                    onSuccess={this.handleFormSuccess}
                                />
                            }
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    */

    render() {
        return (
            <div>Yo!</div>
        )
    }
}
