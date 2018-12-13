var yaml = require('js-yaml');
var fs   = require('fs');

var argv = require('minimist')(process.argv.slice(2));

// declare configurable variables with default values
var projectPath = process.cwd();
var architectureDirectoryName = 'architecture';
var outputDirName = 'dist';
var unifiedModel = 'architecture.yaml'


// handle arguments
if (argv['h'] || argv['help']) {  // if asked for help, print it and exit
    console.log('Usage: node buildUnifiedModel.js [options]');
    console.log('--help, -h             Print the usage message and exit');
    console.log('--projectPath=<Path/To/Project/>                     (default=CWD)');
    console.log('--archDirName=<directory_with_architecture_models>   (default=architecture)');
    console.log('--outputDirName=<directory_to_write_output_files>    (default=dist');
    console.log('--unifiedModel=<filename_of_unified_model>           (default=architecture.yaml');
    process.exit();
} else { // otherwise process arguments
    if ('projectPath' in argv) 
        projectPath = argv['projectPath'];

    if ('archDirName' in argv)
        architectureDirectoryName = argv['archDirName'];
    
    if ('outputDirName' in argv)
        outputDirName = argv['outputDirName'];
    
    if ('unifiedModel' in argv)
    unifiedModel = argv['unifiedModel'];
}

var architecturePath = projectPath + '/' + architectureDirectoryName;
var architectureContents = '';

// load architecture data (package.json, ./architecture content)
var architecture = {};
architecture.elements = {};
architecture.package = JSON.parse(fs.readFileSync(projectPath + '/package.json', 'utf8'));
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

var unifiedModelFileName = projectPath + '/' + outputDirName + '/' + unifiedModel;
fs.writeFileSync(unifiedModelFileName, yaml.safeDump(architecture));

console.log('Unified Model ' + unifiedModelFileName + ' built');