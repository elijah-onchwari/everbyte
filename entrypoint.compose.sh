#!/bin/sh
set -ex

# This Entrypoint used inside Docker Compose only

echo $TYPEORM_HOST
echo $TYPEORM_PORT
printenv 
export WAIT_HOSTS=$TYPEORM_HOST:$TYPEORM_PORT

# in Docker Compose we should wait other services start
./wait

exec "$@"