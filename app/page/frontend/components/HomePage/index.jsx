import React, { Component } from "react";

import {service} from './service'
import BundleMap from './BundleMap'


export default class HomePage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bundle_list: [],
            bundle: null,
        }
    }

    componentDidMount() {
        service.getBundles().then(({bundle_list}) => {
            this.setState({bundle_list})
        })
    }

    handleSelectBundle(e, bundle) {
        e.preventDefault()
        this.setState({bundle})
    }

    render() {
        return (
            <div>
                <h3>Нүүр</h3>

                <div className="split">

                    <div className="span2">
                        {this.state.bundle_list.map((bundle, idx) =>
                            <p key={idx}>
                                <a href="#" onClick={(e) => this.handleSelectBundle(e, bundle)}>
                                    {bundle.name}
                                    (
                                        {bundle.price}
                                        <span className="small">₮</span>
                                    )
                                </a>
                            </p>
                        )}
                    </div>

                    {this.state.bundle &&
                        <BundleMap bundle={this.state.bundle}/>
                    }

                </div>
            </div>
        )
    }
}
