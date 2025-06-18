#!/bin/bash
set -e

cd frontend
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
