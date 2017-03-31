
module.exports = {
    entry: './src/index.js',
        // 'blurify.min': [
        //     './src/index.js',
        // ],
    output: {
        path: "./dist",
        filename: 'blurify.js',
    },
    module: {
        rules: [{
            test: /\.(js|es6)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }],
    },
    resolve: {
        extensions: ['.js', '.es6', '.scss', '.css'],
    },
};
