const fs = require('fs');
const path = require('path');

require("dotenv").config();

const solutionVersion = require("../../config/package-solution.json").solution.version;

const outputPath = path.resolve(__dirname, '../../publish');
fs.mkdirSync(outputPath, { recursive: true });
fs.writeFileSync(`${outputPath}/index.js`,
`(function(id) {
    var script = document.createElement('script');
    script.id = id;
    script.src = "${process.env.CDN_BASE_URL}/${solutionVersion}/redirect.js";
    const head = document.getElementsByTagName('head');
    head[0].appendChild(script);
})('bah-intranet-redirect');`
);

