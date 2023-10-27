const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: './src/js/index.js',
    devtool: 'eval-source-map',

    devServer: {
        client: {

            // Показывает ошибки при компиляции в самом браузере
            overlay: {

                // Ошибки
                errors: true,

                // Предупреждения
                warnings: false,
            },

            // Показывает прогесс компиляции
            progress: true
        },

        // Здесь указывается вся статика, которая будет на нашем сервере
        static: {
            directory: path.join(__dirname, 'dist'),
        },

        // Сжимать ли бандл при компиляции📦
        compress: true,

        // Порт на котором будет наш сервер
        port: 9000,
    },
    // watch: true,

    // // Настройки для watch
    // watchOptions: {

    //     // Директории, которые watch будет игнорировать
    //     ignored: [/node_modules/]
    // },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.scss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", 'sass-loader'],
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
        ]
    },

    plugins: [new MiniCssExtractPlugin({
        filename: "styles.css",
    })],
};