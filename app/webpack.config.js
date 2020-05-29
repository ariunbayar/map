const path = require('path')


module.exports = {
    mode: "development",
    entry: {
        'page': [
            'babel-polyfill',
            path.resolve(__dirname, 'page/frontend/index.js'),
        ],
    },
    output: {
        // options related to how webpack emits results

        // where compiled files go
        path: path.resolve(__dirname, "static/js/"),

        // http://127.0.0.1/<publicPath>/ - where files are served from
        publicPath: "/static/js/",
        filename: '[name]/main.js',  // the same one we import in index.html
    },
    module: {
        // configuration regarding modules
        rules: [
            {
                // regex test for js and jsx files
                test: /\.(js|jsx)?$/,
                // don't look in the node_modules/ folder
                exclude: /node_modules/,
                // for matching files, use the babel-loader
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"]
                    }
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            }
        ],
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'page/frontend/'),
        }
    }
}
