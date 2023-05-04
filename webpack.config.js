const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isProduction = process.env.NODE_ENV == "production";
const config = {
    entry: "./src/renderer.js",
    output: { path: path.resolve(process.cwd(), "dist") },
    devServer: { open: true, host: "localhost" },
    plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })],
    module: {
        rules: [
            { test: /\.(js|jsx)$/i, loader: "babel-loader" },
            { test: /\.css$/i, use: ["style-loader", "css-loader"] },
            { test: /\.s[ac]ss$/i, use: ["style-loader", "css-loader", "sass-loader"] },
            { test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i, type: "asset" },
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }
    return config;
};
