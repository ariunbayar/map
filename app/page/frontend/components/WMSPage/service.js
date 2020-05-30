import {Capabilities} from "./Capabilities"


export const service = {
    getAll,
    create,
    update,
    remove,
    getLayers,
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text)
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // TODO auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                location.reload(true)
            }
            const error = (data && data.message) || response.statusText
            return Promise.reject(error)
        }

        return data
    })
}

function getAll() {
    const requestOptions = {method: 'GET'}
    return fetch(`/wms/list`, requestOptions).then(handleResponse)
}

function _getPostOptions() {
    return {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    }
}

function create(values) {

    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch('/wms/create/', opts).then(handleResponse)
}


function update(values) {

    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify(values),
    }

    return fetch('/wms/update/', opts).then(handleResponse)
}


function remove(id) {
    const opts = {
        ..._getPostOptions(),
        body: JSON.stringify({id}),
    }

    return fetch('/wms/delete/', opts).then(handleResponse)
}


function getLayers(wms_url) {

    return new Promise((resolve, reject) => {

        const requestOptions = {
            method: 'GET',
        }

        const url = wms_url + '?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities'

        fetch(url, requestOptions)
            .then(rsp => rsp.blob())
            .then(data => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    const layers = (new Capabilities(reader.result)).getLayers()
                    resolve(layers)
                }
                reader.readAsText(data)
            })
            .catch(reject)
    })
}
