#!/bin/bash
docker buildx build --platform linux/arm/v7 -t ioticproject/node-red --push .