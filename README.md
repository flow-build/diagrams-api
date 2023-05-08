# diagrams-core

diagrams-core is a BPMN diagrams manager for your project.

![npm version](https://img.shields.io/npm/v/@flowbuild/diagrams-core) ![language](https://img.shields.io/github/languages/top/flow-build/diagrams-core)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=flow-build_diagrams-core&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=flow-build_diagrams-core) [![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release) 

## Installation

Run the following command in your terminal:
```
npm install @flowbuild/diagrams-core
```

## Usage

```js
const { DiagramCore } = require('@flowbuild/diagrams-core');
const diagramCore = new DiagramCore(db);

// note that 'db' has to be a database configuration
```

The service does have a blueprint storage, but it only stores the data relevant to the diagram, a.k.a. nodes and lanes (prepare, environment and parameters are discarded).  

## Environment variables

Add a .env file with the following variables:

- KNEX_ENV (suggested value = docker)
- NODE_ENV (suggested value = docker)
- POSTGRES_USER (default = postgres)
- POSTGRES_PASSWORD (default = postgres)
- POSTGRES_DB (default = diagrams)
- POSTGRES_HOST (default = localhost)
- POSTGRES_PORT (default = 5432)
- LOG_LEVEL (default = info)

## Testing on Docker:

Use the following command in order to setup two containers (database and test servers) 
and run migrations, seeds and tests.

```
docker-compose up
``` 