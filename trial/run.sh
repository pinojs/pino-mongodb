#!/bin/bash

echo Up...
docker-compose up -d

sleep 3

url="mongodb://one:two@localhost:27017"
container="mongo-serve"

# trial
echo '{"txt": "should work with valid json"}' | ./pino-mongodb.js -u $url &
echo '{"time": "1990-09-16T09:00:00.009Z"}' | ./pino-mongodb.js -u $url &
echo 'should work with invalid json' | ./pino-mongodb.js -u $url &

sleep 3

docker exec -it $container mongo admin -u one -p two --eval "db.getCollection(\"logs\").find()"

node trial/assert.js $url && echo OK || echo Fail

echo Down...
docker-compose down
