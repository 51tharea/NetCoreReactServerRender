const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const CssNanoPlugin = require("cssnano");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const postcssNormalize = require('postcss-normalize');

module.exports = (env) => {

    const isDevBuild = !(env && env.prod);
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

    const sharedConfig = () => {

        let mode = isDevBuild ? "development" : "production";

        console.log('\x1b[36m%s\x1b[0m', "=== Webpack compilation mode: " + mode + " ===");

        let config = {
            mode,
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
                extensions: ['.js', '.jsx'],
                alias: {
                    // "@Layouts": path.resolve(__dirname, "ClientApp/layouts/"),
                    // "@Ui": path.resolve(__dirname, "ClientApp/Ui"),
                    // "@Components": path.resolve(__dirname, "ClientApp/components/"),
                    // "@Images": path.resolve(__dirname, "ClientApp/images/"),
                    // "@Store": path.resolve(__dirname, "ClientApp/store/"),
                    // "@Utils": path.resolve(__dirname, "ClientApp/utils"),
                    "@Styles": path.resolve(__dirname, 'ClientApp/styles/'),
                    "@Pages": path.resolve(__dirname, 'ClientApp/pages/'),
                    // "@Services": path.resolve(__dirname, 'ClientApp/services/'),
                    "@Models": path.resolve(__dirname, 'ClientApp/models/'),
                    // "@Globals": path.resolve(__dirname, 'ClientApp/Globals')
                }
            },
            output: {
                filename: '[name].js',
                publicPath: 'dist/', // Webpack dev middleware, if enabled, handles requests for this URL prefix.
            },
            module: {
                rules: [
                    {
                        test: /\.jsx?$/,
                        include: /ClientApp/,
                        use: [
                            {
                                loader: 'babel-loader'
                            }
                        ]
                    },
                    {
                        test: /\.(gif|png|jpe?g|svg)$/i,
                        use: ['url-loader']
                    }
                ]
            },
            plugins: [
                // Moment.js is an extremely popular library that bundles large locale files
                // by default due to how Webpack interprets its code. This is a practical
                // solution that requires the user to opt into importing specific locales.
                // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
                // You can remove this if you don't use Moment.js:
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

            config = {
                ...config,

                performance: {
                    hints: false,
                },
                devtool: 'eval-source-map'
            };

            config.resolve.alias = {
                ...config.resolve.alias,
                'react-dom': '@hot-loader/react-dom'
            };
        }

        return config;
    };


    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: {
            'app': './ClientApp/boot-client.js',
        },
        output: {
            path: path.join(__dirname, clientBundleOutputDir),
            filename: 'js/[name]-bundle.js'

        },
        resolveLoader: {
            modules: [
                'node_modules',
                path.join(__dirname, '../node_modules'),
            ]
        },
        module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: /\.css$/,
                            use: isDevBuild ? [
                                'style-loader',
                                'css-loader'

                            ] : [MiniCssExtractPlugin.loader, 'css-loader']
                        },
                        {
                            test: /\.(scss|sass)$/,
                            use: isDevBuild ? [
                                'style-loader',
                                'css-loader',
                                'sass-loader'
                            ] : [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                        }]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                sourceMap: true,
                filename: 'css/[name].css',
                chunkFilename: 'css/[id].css',
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps.
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ],
        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
    });


    const serverBundleConfig = merge(sharedConfig(), {
        module: {
            rules: [
                {test: /\.(scss|sass)$/, use: "ignore-loader"}
            ]
        },
        resolve: {mainFields: ['main']},
        entry: {'main-server': './ClientApp/boot-server.js'},
        plugins: [],
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        target: 'node'
    });

    return [clientBundleConfig, serverBundleConfig];
};