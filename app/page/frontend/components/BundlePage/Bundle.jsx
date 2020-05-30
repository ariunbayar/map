import React, { Component } from "react"


export default class Bundle extends Component {

    render() {
        const {id, name, price, is_removeable, wms_list} = this.props.values
        return (
            <tr>

                <td>
                    <a href="#" onClick={this.props.handleEdit}>
                        {name}
                    </a>
                </td>

                <td>
                    {price}
                </td>

                <td>
                    <ul>
                        {wms_list.map((wms_name, idx) =>
                            <li key={idx}>{wms_name}</li>
                        )}
                    </ul>
                </td>

                <td>
                    {is_removeable &&
                        <a href="#" onClick={this.props.handleRemove}>
                            remove
                        </a>
                    }
                </td>
            </tr>
        )
    }
}
