const webpack = require('webpack');
const expect = require('chai').expect;
const Entrypoint = require('webpack/lib/Entrypoint');

function checkForWebpackErrors({err, stats, done}) {
    return err ? (done(err) || false) : (stats.hasErrors() ? (done(new Error(stats.toString())) || false) : true);
}

describe('Webpack Integration Plugin Tests', () => {
    const webpack_config = require('./webpack-config');

    it('test build', (done) => {
        let config = webpack_config({});

        expect(config.plugins[1].options).to.have.keys('filename', 'logTime');

        webpack(config, (err, stats) => {
            if (checkForWebpackErrors({err, stats, done})) {
                let chunks = stats.compilation.chunkGroups.filter((group) => group instanceof Entrypoint);
                let statsFileData = require('./dist/webpack-stats');

                expect(statsFileData).to.be.an('object');
                expect(statsFileData).to.have.keys('status', 'publicPath', 'bundles');
                expect(statsFileData.bundles).to.have.keys(Object.keys(config.entry));

                Object.entries(statsFileData.bundles).forEach(([name, files]) => {
                    const bundleEntries = chunks.filter((c) => c.options.name === name);

                    expect(bundleEntries).to.have.lengthOf(1);
                    expect(bundleEntries[0].chunks.reduce((a, c) => [...a, ...c.files], [])).to.have.lengthOf(files.length);
                });

                done();
            }
        });
    }).timeout(5000);
});
