# !/usr/bin/env bash

#### set environment variable for project root ####
project_root=$PWD

#### Create dist/ directory, if none exists ####
if [ ! -r ./dist ]; then
    echo "Creating dist/ directory..."
    mkdir dist/
fi

#### Install m30mlTools/node_modules, if not already installed ####
if [ ! -r ./m30mlTools/node_modules ]; then
    clitool="npm"
    cmdargs="ci"
    cmd="$clitool $cmdargs"
    workdir=$project_root/m30mlTools
    podmancmd="podman run --rm --volume $workdir:/srv -w /srv docker.io/node $cmd"
    condition="$clitool --help | grep 'npm <command>'"

    if ! eval $condition; then
        echo "Installing node_modules via podman..."
        cd $project_root
        eval $(echo $podmancmd)
    else
        echo "Installing node_modules..."
        cd $workdir
        eval $cmd
        cd $project_root
    fi
fi

#### Build unified model as yaml with m30mlTools ####
clitool="node"
cmdargs="m30mlTools/buildUnifiedModel.js"
cmd="$clitool $cmdargs"
workdir=$project_root
podmancmd="podman run --rm --volume $workdir:/srv -w /srv docker.io/node $cmd"
condition="$clitool --version | grep 'v17'"

if ! eval $condition; then
    echo "Building the unified model with m30mlTools via podman..."
    cd $project_root
    eval $(echo $podmancmd)
else
    echo "Building the unified model with m30mlTools..."
    cd $workdir
    eval $cmd
    cd $project_root
fi

#### generate DOF spec as adoc from liquid template with m30mlTools ####
clitool="node"
cmdargs="m30mlTools/generateDoc.js --unifiedModel=dist/architecture.yaml --template=DOF.adoc.liquid --out=dist/DOF.adoc"
cmd="$clitool $cmdargs"
workdir=$project_root
podmancmd="podman run --rm --volume $workdir:/srv -w /srv docker.io/node $cmd"
condition="$clitool --version | grep 'v17'"

if ! eval $condition; then
    echo "Generating DOF spec as adoc from liquid template with m30mlTools via podman..."
    cd $project_root
    eval $(echo $podmancmd)
else
    echo "Generating DOF spec as adoc from liquid template with m30mlTools..."
    cd $workdir
    eval $cmd
    cd $project_root
fi

#### generate DOF spec as html with asciidoctor ####
clitool="asciidoctor"
cmdargs="DOF.adoc -o index.html"
cmd="$clitool $cmdargs"
workdir=$project_root/dist
podmancmd="podman run --rm -v $workdir:/srv -w /srv docker.io/asciidoctor/docker-asciidoctor $cmd"
condition="$clitool --version | grep '2.0.17'"

if ! eval $condition; then
    echo "Generating DOF spec as html via podman..."
    cd $project_root
    eval $(echo $podmancmd)
else
    echo "Generating DOF spec as html..."
    cd $workdir
    eval $cmd
    cd $project_root
fi

