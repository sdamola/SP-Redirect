"use strict";

const build = require("@microsoft/sp-build-web");
const gulp = require("gulp");
const minimist = require("minimist");
const fs = require("fs");
const child_process = require('child_process');
const webpack = require('webpack');

require("dotenv").config();

build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

// required for upgrade to spfx 1.12.1
const getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  const result = getTasks.call(build.rig);
  result.set('serve', result.get('serve-deprecated'));
  return result;
};

build.initialize(gulp);

/**
 * Updates the package-solution version to match package.json.
 * Optionally, appends a build id with `gulp version-sync --buildId {id}`.
 */
gulp.task("version-sync", function () {
  // h/t https://n8d.at/how-to-version-new-sharepoint-framework-projects/

  const pkgConfig = require("./package.json");
  let pkgSolution = require("./config/package-solution.json");

  const args = minimist(process.argv.slice(2));
  const majorId = pkgConfig.version.split(".")[0];
  const minorId = pkgConfig.version.split(".")[1];
  // build number is constructed by Azure DevOps as $(DayOfYear).$(Rev:r) (see azure-pipelines.yml)
  const buildNumber = args.buildNumber ? args.buildNumber : "0.0";
  const newVersionNumber = `${majorId}.${minorId}.${buildNumber}`;
  pkgSolution.solution.version = newVersionNumber;
  // remove if your project does not provision any features
  if (pkgSolution.solution.features) {
    pkgSolution.solution.features = pkgSolution.solution.features.map(
      (feature) => ({
        ...feature,
        version: newVersionNumber,
      })
    );
  }
  fs.writeFileSync(
    "./config/package-solution.json",
    JSON.stringify(pkgSolution, null, 2)
  );
  return Promise.resolve();
});

function buildRedirect(done) {
  child_process.exec("yarn build-redirect", function (err, stdout, stderr) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    done();
  });
}

function serveRedirect(done) {
  buildRedirect(done);
  gulp.watch("src/assets/**/*", function (_done) {
    buildRedirect(_done);
  });
}

gulp.task("serve-redirect", serveRedirect);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {

    generatedConfiguration.plugins.push(new webpack.DefinePlugin({
      __SCRIPT_URL__: JSON.stringify(`${process.env.CDN_BASE_URL}/index.js`)
    }));

    return generatedConfiguration;
  },
});
