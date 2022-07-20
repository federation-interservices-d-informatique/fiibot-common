#!/usr/bin/env bash
set -e

DIRNAME="$(dirname $0)"

echo "- Writing changelog in /home/runner/changelog.txt"

bash $DIRNAME/changelog.sh > "/home/runner/changelog.txt"

