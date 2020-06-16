const path = require('path');

// See: https://webpack.js.org/guides/author-libraries/

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        library: 'awsEdgeLocations',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'umd'),
        filename: 'aws-edge-locations.min.js'
    }
};
