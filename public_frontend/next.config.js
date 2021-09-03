module.exports = {
    //we use gzip in nginx instead, so we want to offload load from nodejs process
    compress: false,
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300
        }
        return config
    },
    images: {
        domains: ["app.localhost", "localhost"]
    }
}