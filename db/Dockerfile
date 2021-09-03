FROM postgres:13

WORKDIR /usr/src/app

#Script is automatically run by PSQL, which initiates database, or installs updates
COPY ./demo_entrypoint/ /docker-entrypoint-initdb.d/