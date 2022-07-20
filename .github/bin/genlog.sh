#!/usr/bin/env bash
set -e

DIRNAME="$(dirname $0)"

echo "- Writing changelog in ${GITHUB_WORKSPACE}/changelog.txt"

bash $DIRNAME/changelog.sh > "${GITHUB_WORKSPACE}/changelog.txt"

