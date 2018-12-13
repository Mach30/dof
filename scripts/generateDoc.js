var yaml = require('js-yaml');
var fs   = require('fs');
var Liquid = require('liquidjs');
var engine = Liquid();

var argv = require('minimist')(process.argv.slice(2));

var unifiedModel = '';
var template = '';
var out = '';

// handle arguments
if (argv['h'] || argv['help']) {  // if asked for help, print it and exit
    console.log('Usage: node buildUnifiedModel.js [options] --unifiedModel=<path/to/unified/model.yaml --template=<path/to/template.liquid> --out=<path/to/output/file>');
    console.log('--help, -h             Print the usage message and exit');
    process.exit();
} else { // otherwise process arguments
    if ('unifiedModel' in argv) 
        unifiedModel = argv['unifiedModel'];
    else
        console.log('Must supply unifiedModel path');

    if ('template' in argv)
        template = argv['template'];
    else
        console.log('Must supply template path');
    
    if ('out' in argv)
        out = argv['out'];
    else
        console.log('Must supply out path');

    if (!unifiedModel.trim() || !template.trim() || !out.trim())
        process.exit(1);
}

var architecture = yaml.safeLoad(fs.readFileSync(unifiedModel, 'utf8'));

var templateFile = fs.readFileSync(template, 'utf8');
engine
    .parseAndRender(templateFile, {architecture: architecture})
    .then(function(fulfilled) {
        fs.writeFileSync(out, fulfilled);
    }).catch(function(e) {
        console.log(e);
    });