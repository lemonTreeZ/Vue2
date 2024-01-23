const path = require("path")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    //指定项目入口
    entry: {
        main: "./src/main.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title:"html plugin page",
            template: "./src/index.html"
        }),
        new VueLoaderPlugin()
    ],
    output: {
        //输出文件名称
        filename:"[name].build.js",
        path:path.resolve(__dirname,'../dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "style-loader",
                    "css-loader",
                    "stylus-loader",
                    "postcss-loader"
                ]
            },
            {  
                test: /\.styl(us)?$/,
                use: [
                    "vue-style-loader",
                    "style-loader",
                    "css-loader",
                    "stylus-loader"
                ]
            },
            {
                test:/\.vue$/,
                loader:"vue-loader"
            }
        ]
    },
    //解析
    resolve:{
        alias:{
            'vue$':'vue/dist/vue.esm.js'
        },
        //解析 模块后缀默认为ext
        extensions:['.js','.json','.vue']
    }
}