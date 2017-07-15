const 
    path = require('path')
;

module.exports = {
    entry : "./index.js",
    output : {
        filename : "bundle.js",
        path : path.join(__dirname, "dist")
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        hot : true
    },
    module : {
        rules : [
            {
                test : /\.js/,
                include : [path.resolve(__dirname, "src")],
                loader : "babel-loader"
            }
        ]
    },
    target : "web"
}