// NOTE: the `build` script sets NODE_OPTIONS=--experimental-global-webcrypto
// because Node 18 (EOL) doesn't expose the Web Crypto global that Workbox's
// minifier needs, including in its terser worker thread. Drop the flag once
// the toolchain runs on Node 20+.

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

var webpack = require("webpack");

module.exports = (env, argv) => {
    const isProduction = argv && argv.mode === 'production';

    const plugins = [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
            __PROD__: JSON.stringify(isProduction),
            // Single source of truth for the app version: package.json. Shown
            // in the footer; bumped by release-please on each release.
            __APP_VERSION__: JSON.stringify(require('./package.json').version)
        }),

        // Static PWA files served verbatim under the /fleb/ publicPath.
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/pwa/manifest.webmanifest', to: 'manifest.webmanifest' },
                { from: 'src/pwa/icon.svg', to: 'icon.svg' },
                { from: 'src/pwa/icon-maskable.svg', to: 'icon-maskable.svg' },
                { from: 'src/favicon.ico', to: 'favicon.ico' }
            ]
        })
    ];

    // Only generate a service worker for production builds; a SW under the
    // dev-server would aggressively cache and fight hot reload.
    if (isProduction) {
        plugins.push(new WorkboxPlugin.GenerateSW({
            swDest: 'service-worker.js',
            clientsClaim: true,
            skipWaiting: true,
            // main.js bundles Vue + Leaflet and exceeds the 2 MiB default.
            maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
            // SPA fallback: unknown routes serve the app shell from cache.
            navigateFallback: '/fleb/index.html',
            runtimeCaching: [
                {
                    // OpenStreetMap tiles for the QSO map, cached as encountered.
                    urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\//,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'osm-tiles',
                        expiration: {
                            maxEntries: 500,
                            maxAgeSeconds: 30 * 24 * 60 * 60
                        },
                        cacheableResponse: { statuses: [0, 200] }
                    }
                }
            ]
        }));
    }

    return {
        entry: './src/index.ts',

        // https://github.com/webpack/webpack-dev-server/issues/2792#issuecomment-724169118
        optimization: {
            runtimeChunk: "single"
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    type: 'asset/resource'
                },
                {
                    test: /\.ico/,
                    type: "asset/resource"
                }
            ],
        },

        plugins,

        output: {
            //path: path.resolve(__dirname, 'dist'),
            publicPath: "/fleb/",
            filename: '[name].js',
            assetModuleFilename: 'asset/[name][ext]'
        },

        resolve: {
            extensions: ['.ts', '.js', '.json']
        }
    };
};
