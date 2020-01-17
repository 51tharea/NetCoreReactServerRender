const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const CssNanoPlugin = require("cssnano");
const safePostCssParser = require('postcss-safe-parser');
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
                            parse: {
                                ecma: 8,
                            },
                            compress: {
                                ecma: 5,
                                warnings: false,
                                comparisons: false,
                                inline: 2,
                            },
                            keep_classnames: !isDevBuild,
                            keep_fnames: !isDevBuild,
                            mangle: {
                                safari10: true,
                            },
                            output: {
                                ecma: 5,
                                ascii_only: true,
                                comments: false,
                            },
                        },
                        sourceMap: false
                    }),
                    new OptimizeCSSAssetsPlugin({
                        cssProcessorOptions: {
                            parser: safePostCssParser,
                            map: shouldUseSourceMap
                                ? {
                                    inline: false,
                                    annotation: true,
                                }
                                : false,
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

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: isDevBuild ? ['style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    require('postcss-preset-env')({
                                        autoprefixer: {
                                            flexbox: 'no-2009',
                                        },
                                        stage: 3,
                                    }),
                                    postcssNormalize(),
                                ],
                                sourceMap: !isDevBuild
                            }
                        }] : [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    require('postcss-preset-env')({
                                        autoprefixer: {
                                            flexbox: 'no-2009',
                                        },
                                        stage: 3,
                                    }),
                                    postcssNormalize(),
                                ],
                                sourceMap: !isDevBuild
                            }
                        }],
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                sourceMap: true,
                filename: 'css/[name].css',
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps.
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ],

    });


    const serverBundleConfig = merge(sharedConfig(), {
        module: {
            rules: [
                {
                    test: /\.(css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            }
                        },
                    ]
                },
                {test: /\.(scss|sass)$/, use: "ignore-loader"}
            ]
        },
        resolve: {mainFields: ['main']},
        entry: {'main-server': './ClientApp/boot-server.js'},
        plugins: [
            new MiniCssExtractPlugin({
                sourceMap: true,
                filename: 'css/[name].css',
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps.
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ],
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist'),
            filename: 'js/[name].js'
        },
        target: 'node'
    });

    return [clientBundleConfig, serverBundleConfig];
};