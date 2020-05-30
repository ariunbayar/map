import React, { Component } from "react"


export default class WMS extends Component {

    render() {
        const {id, name, url, public_url, created_at} = this.props.values
        return (
            <tr>
                <td>
                    <a href="#" onClick={this.props.handleEdit}>
                        {name}
                    </a>
                </td>
                <td>
                    {url}
                </td>
                <td>
                    {public_url}
                </td>
                <td>
                    {created_at}
                </td>
                <td>
                    <a href="#" onClick={this.props.handleRemove}>
                        remove
                    </a>
                </td>
            </tr>
        )
    }
}
