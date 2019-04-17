
const path = require('path');

const uglify = require('uglifyjs-webpack-plugin'); //压缩JS代码,webpack自带的插件
const htmlPlugin = require('html-webpack-plugin'); //压缩HTML代码，
const extractTextPlugin = require("extract-text-webpack-plugin");  //分离CSS代码


var website ={
    publicPath:"http://192.168.100.103:1717"
}

module.exports = {
    //入口文件的配置项
    entry: {
        entry:'./src/entry.js',
        entry2:'./src/entry2.js'
    },
    //出口文件的配置项
    output: {
        //打包的路径
        path: path.resolve(__dirname,'dist'),
        //打包生成的文件名
        filename: "[name].js",
        publicPath: website.publicPath
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module: {
        rules: [
            {
                test:/.(css|less|scss)$/,
                use:extractTextPlugin.extract({
                    use:['css-loader','less-loader','sass-loader','postcss-loader'],
                    fallback: 'style-loader'
                })
            },

            {
                test:/.(png|jpg|gif)/,  //匹配图片文件后缀名称
                use:[
                    {
                        loader: "url-loader",
                        options:{
                            limit:500000,  //是把小于500000B的文件打成Base64的格式，写入JS。
                            outputPath:'images/'
                        }
                    }
                ]
            },
            {
                test:/\.(htm|html)$/,
                use:[
                    {
                        loader: "html-withimg-loader"
                    }
                ]
            }
        ]
    },
    //插件，用于生产模版和各项功能
    plugins: [
        new uglify(),
        new htmlPlugin({
            //是对html文件进行压缩
            minify:{
                removeAttributeQuotes:true //去掉属性的双引号
            },
            hash:true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
            template:'./src/index.html', //是要打包的html模版路径和文件名称。
            chunks:['entry'] //默认找entry下面所有的入口文件
        }),
        new extractTextPlugin("/css/index.css")
    ],
    //配置webpack开发服务功能
    devServer: {
        //项目启动文件,设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        inline: true, //实时刷新
        //服务器的IP，一般的是本地IP
        host:'0.0.0.0',
        //服务端压缩是否开启
        compress:true,
        //端口号
        port:1717
    }
}




