#!/bin/sh

# build the unified model for DOF
node scripts/buildUnifiedModel.js

# Process the unified model for DOF (e.g. generate required images for DOF.adoc)
# TODO

# generate each of the docs
node scripts/generateDoc.js --unifiedModel=dist/architecture.yaml --template=README.adoc.liquid --out=README.adoc