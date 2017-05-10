#!/usr/bin/env bash

# exit immediately on non-zero commands
set -e

# debugging
# set -x

CURRENT_DIR="$(dirname "${BASH_SOURCE[0]}")" # tests/integration/run.sh
ROOT="$( cd $CURRENT_DIR && pwd)" # Absolute path to the directory that contains this script

pushd $ROOT
python3 -m unittest discover -v -s ..
popd