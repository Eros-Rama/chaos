const path = require('path')

module.exports = {
    mode: "development",
    entry: './src/index.ts',
    output: {
        filename: 'game.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    module: {
        rules: [
            { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }
        ]
    }
};
