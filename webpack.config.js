module.exports = {
    entry: [
      // "bootstrap-sass-webpack!./bootstrap.webpack.config.js",
      "./js/index.js"
    ],
    output: {
        path: __dirname,
        filename: "build/app.js"
    },
    module: {
        loaders: [
            { test: /\.css$/,   loader: "style!css" },
            { test: /\.styl$/,  loader: "style!css!stylus" },
            { test: /\.js$/,    loader: "jsx", query: { insertPragma: 'React.DOM' } },
            { test: /\.json$/,  loader: "json" },
            { test: /\.woff$/,  loader: "url?limit=10000&minetype=application/font-woff" },
            { test: /\.ttf$/,   loader: "file" },
            { test: /\.eot$/,   loader: "file" },
            { test: /\.svg$/,   loader: "file" }
        ]
    }
};
