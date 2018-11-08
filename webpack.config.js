const path                          = require('path');
const fs                            = require("fs");
const webpack                       = require('webpack');
const apiMocker                     = require('connect-api-mocker');
const htmlWebpackPlugin             = require('html-webpack-plugin');

const sourcePath    = path.resolve(__dirname,'src');
const outputPath    = path.resolve(__dirname,'dist');
const isProd        = process.argv.indexOf("-p") !== -1;
const pkg           = JSON.parse(fs.readFileSync('./package.json'));

const config = {

    mode: isProd ? "production" : "development",

    entry: {
        RamenPos: sourcePath + '/RamenPos.js',
        KebabPos: sourcePath + '/KebabPos.js',
        MotelPos: sourcePath + '/MotelPos.js',
        TablePos: sourcePath + '/TablePos.js'
    },
    
    output: {
        filename: '[name].min.js',
        path: outputPath,
        libraryTarget: 'umd'
    },

    devServer: {
        historyApiFallback: true,
        noInfo: true,
        contentBase: sourcePath,
        compress: true,
        hot: true,
        port: 3000,
        host: 'localhost',
        https: false,
        disableHostCheck: true,
        before: function(app) {
            app.use('/api', apiMocker('/mocks/api'));
        }
    },

    resolve: {
        extensions: ['.js']
    },

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
        new htmlWebpackPlugin({template: sourcePath + '/index.html', inject: false}),
        new htmlWebpackPlugin({template: sourcePath + '/RamenPos.html', filename: outputPath + '/RamenPos.html', chunks: ['RamenPos']}),
        new htmlWebpackPlugin({template: sourcePath + '/KebabPos.html', filename: outputPath + '/KebabPos.html', chunks: ['KebabPos']}),
        new htmlWebpackPlugin({template: sourcePath + '/MotelPos.html', filename: outputPath + '/MotelPos.html', chunks: ['MotelPos']}),
        new htmlWebpackPlugin({template: sourcePath + '/TablePos.html', filename: outputPath + '/TablePos.html', chunks: ['TablePos']})
    ]
};

if(isProd) {
    config.devtool = "source-map";
} else {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.devtool = "inline-source-map";
}

module.exports = config;


