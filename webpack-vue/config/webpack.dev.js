const {merge} = require("webpack-merge")
const path = require("path")
const common = require('./webpack.common')

module.exports = merge(common,{
    mode:"development",
    devtool:"eval",
    devServer:{
        host: "127.0.0.1",
        port: 8080,
        open: true,
        hot: true
    }
})