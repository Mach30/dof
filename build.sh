# !/usr/bin/env bash

# build script for generating static site with asciidoctor

if [ ! -r ./public ]; then
    docker run --rm --volume $PWD:/src -w "/src" capsulecorplab/asciidoctor-extended 'asciidoctor dist/DOF.adoc -o public/index.html'
fi
