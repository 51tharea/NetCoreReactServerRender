const path = require("path");
const webpack = require('webpack');
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const CssNanoPlugin = require("cssnano");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");




module.exports = env => {
    const isDevBuild = !(env && env.prod);

    // Configuration in common to both client-side and server-side bundles.
    let sharedConfig = {
        mode: isDevBuild ? "development" : "production",
        optimization: {
            minimize: !isDevBuild,
            usedExports: isDevBuild,
            minimizer: !isDevBuild ? [
                // Production.
                new TerserWebpackPlugin({
                    terserOptions: {
                        output: {
                            comments: false,
                        },
                    },
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessor: CssNanoPlugin,
                    cssProcessorPluginOptions: {
                        preset: ["default", {discardComments: {removeAll: true}}]
                    }
                })
            ] : [
                // Development.
            ]
        },
        stats: {modules: false},
        resolve: {
            extensions: [".js", ".jsx", ".json", ".jpg", ".css"]
        },
        output: {
            filename: "[name].js",
            publicPath: "dist/" // Webpack dev middleware, if enabled, handles requests for this URL prefix.
        },
        module: {
            rules: [
                {
                    test: /\.js(x?)$/,
                    include: /ClientApp/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                        }
                    ]
                },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: ["url-loader"]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    // Match woff2 in addition to patterns like .woff?v=1.1.1.
                    test: /\.(woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file-loader",
                    options: {
                        limit: 50000,
                        name: "./fonts/[name].[ext]"
                    }
                }
            ]
        },
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        ].concat(isDevBuild ? [
            // Development.

            // Add module names to factory functions so they appear in browser profiler.
            new webpack.NamedModulesPlugin(),
            // Watcher doesn't work well if you mistype casing in a path so we use
            // a plugin that prints an error when you attempt to do this.
            // See https://github.com/facebookincubator/create-react-app/issues/240
            new CaseSensitivePathsPlugin(),
            // If you require a missing module and then `npm install` it, you still have
            // to restart the development server for Webpack to discover it. This plugin
            // makes the discovery automatic so you don't have to restart.
            // See https://github.com/facebookincubator/create-react-app/issues/186
            new WatchMissingNodeModulesPlugin(path.resolve(__dirname, '..', 'node_modules'))
        ] : [
            // Production.
        ])
    };

    if (isDevBuild) {
        // Change config for development build.
        sharedConfig = {
            ...sharedConfig,
            performance: {
                hints: false,
            },
            devtool: isDevBuild
                ? '#eval-source-map'
                : 'source-map',

        };
        sharedConfig.resolve.alias = {
            ...sharedConfig.resolve.alias,
            'react-dom': '@hot-loader/react-dom'
        }

    }

    // Configuration for client-side bundle suitable for running in browsers.
    const clientBundleOutputDir = "./wwwroot/dist";
    const clientBundleConfig = merge(sharedConfig, {
        entry: {"bundle": "./ClientApp/boot-client.js"},
        module: {
            rules: [
                {test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : [MiniCssExtractPlugin.loader, 'css-loader']},
                {test: /\.(scss|sass)$/, use: isDevBuild ? ['style-loader', 'css-loader', 'sass-loader'] : [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']}
            ]
        },
        output: {path: path.join(__dirname, clientBundleOutputDir)},
        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
        plugins: [].concat(isDevBuild ? [
            // Development.
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps.
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Production.
            new MiniCssExtractPlugin({
                filename: "site.css"
            })
        ])
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node.
    const serverBundleConfig = merge(sharedConfig, {
        module: {
            rules: [
                {test: /\.(scss|sass)$/, use: "ignore-loader"}
            ]
        },
        resolve: {mainFields: ["main"]},
        entry: {"main-server": "./ClientApp/boot-server.js"},
        plugins: [],
        output: {
            libraryTarget: "commonjs",
            path: path.join(__dirname, "./ClientApp/dist")
        },
        target: "node"
    });

    return [clientBundleConfig, serverBundleConfig];
};