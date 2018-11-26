var yaml = require('js-yaml');
var fs   = require('fs');
var Liquid = require('liquidjs');
var engine = Liquid();

//TODO - fix path
var architecturePath = './architecture/';
var architectureContents = '';

// load architecture data (package.json, ./architecture content)
var architecture = {};
architecture.elements = {};
architecture.package = require('../package.json');
architecture.generationDate = new Date().toLocaleDateString("en-US", {
    "year": "numeric",
    "month": "numeric",
    "day": "numeric"
});

try {
    var architectureContents = fs.readdirSync(architecturePath).sort();
    for (section in architectureContents) {
        architecture[architectureContents[section]] = [];

        var architectureFiles = fs.readdirSync(architecturePath + '/' + architectureContents[section]).sort();
        for (file in architectureFiles) {
            var doc = yaml.safeLoad(fs.readFileSync(architecturePath + '/' + architectureContents[section] + '/' + architectureFiles[file], 'utf8'));

            architecture.elements[architectureContents[section] + '/' + architectureFiles[file]] = doc;
            architecture[architectureContents[section]].push(doc);
        }
    }
} catch (e) {
    console.log(e);
}

//TODO - fix path
fs.writeFileSync('./dist/architecture.yaml', yaml.safeDump(architecture));

//TODO - fix path 
var READMEtemplate = fs.readFileSync('./README.adoc.liquid', 'utf8');
engine
    .parseAndRender(READMEtemplate, {architecture: architecture})
    .then(function(fulfilled) {
        //TODO - fix path
        fs.writeFileSync('./README.adoc', fulfilled);
    }).catch(function(e) {
        console.log(e);
    });