#!/bin/bash

#Populating database with a restore from pgdump file named backup
# file="/docker-entrypoint-initdb.d/dump.pgdata"
file="/docker-entrypoint-initdb.d/dump"
dbname=ptr_api
dbuser=ptr

echo "Restoring DB using $file"

cat "$file" | psql $dbname -U $dbuser

# pg_restore -U $dbuser --dbname=$dbname --no-privileges --no-owner --verbose --single-transaction <"$file" || exit 1
