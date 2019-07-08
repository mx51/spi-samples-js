const path                          = require('path');
const fs                            = require("fs");
const webpack                       = require('webpack');
const apiMocker                     = require('connect-api-mocker');
const htmlWebpackPlugin             = require('html-webpack-plugin');

const sourcePath    = path.resolve(__dirname,'src');
const outputPath    = path.resolve(__dirname,'dist');
const isProd        = process.argv.indexOf("-p") !== -1;
const pkg           = JSON.parse(fs.readFileSync('./package.json'));
const PORT          = process.env.PORT || 3000;

const config = {

    mode: isProd ? "production" : "development",

    entry: {
        RamenPos: './RamenPos/RamenPos.js',
        KebabPos: './KebabPos/KebabPos.js',
        MotelPos: './MotelPos/MotelPos.js',
        TablePos: './TablePos/TablePos.js'
    },
    
    output: {
        filename: '[name].min.js',
        path: outputPath,
        libraryTarget: 'umd'
    },

    devServer: {
        historyApiFallback: true,
        noInfo: true,
        contentBase: __dirname,
        index: 'TablePos.html',
        compress: true,
        hot: true,
        port: PORT,
        host: '0.0.0.0',
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
        //new htmlWebpackPlugin({template: 'RamenPos/RamenPos.html', filename: 'RamenPos.html', chunks: ['RamenPos']}),
        //new htmlWebpackPlugin({template: 'KebabPos/KebabPos.html', filename: 'KebabPos.html', chunks: ['KebabPos']}),
        //new htmlWebpackPlugin({template: 'MotelPos/MotelPos.html', filename: 'MotelPos.html', chunks: ['MotelPos']}),
        new htmlWebpackPlugin({template: 'TablePos/TablePos.html', filename: 'TablePos.html', chunks: ['TablePos']}),
        //new htmlWebpackPlugin({template: 'index.html', filename: 'index.html', inject: false}),
    ]
};

if(isProd) {
    config.devtool = "source-map";
} else {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.devtool = "inline-source-map";
}

module.exports = config;


