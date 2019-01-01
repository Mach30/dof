REM build the unified model for DOF
node scripts/buildUnifiedModel.js

REM Process the unified model for DOF (e.g. generate required images for DOF.adoc)
REM TODO

REM generate each of the docs
node scripts/generateDoc.js --unifiedModel=dist/architecture.yaml --template=README.adoc.liquid --out=README.adoc