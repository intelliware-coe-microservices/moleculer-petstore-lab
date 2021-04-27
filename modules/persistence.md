# Persistence
This module will involve replacing the in memory persistence from the previous module with a real database.

## Setup
Enter the following command from the root of this project. This will start up a docker container running mongo and
also mongo-express which can be used to view the contents of mongo collections.

```
docker-compose up
```

Mongo-express can be accessed at http://localhost:8081. The credentials for mongo and mongo-express are admin/admin.

In mongo-express create a database for the pet service and a collection to store pets.

Create a user in the pet service database via commands similar to the following. Here we are assuming the id of the mongo container
is 371739d2286f and the database name is pet-service.
```
docker ps
docker exec -it 371739d2286f bash
mongo --username admin --password admin
use pet-service
db.createUser({user: "pet-service", pwd: "pet-service", roles: [ { role: "readWrite", db: "pet-service" } ]});
```

Note that by default the api gateway will pick up the DbService actions and export them as endpoints. You'll need to update the whitelist in
api.service.js to only export the endpoints that you created manually.

## DB Adapter
Convert the in-memory implementation of the pet service to use Mongo either via the Mongo DB adapter or
the Mongoose DB adapter. See [https://moleculer.services/docs/0.14/moleculer-db.html](https://moleculer.services/docs/0.14/moleculer-db.html)
for details on how to do this.

The Mongo DB adapter is easier to use from a configuration point of view as a schema is not required but the Mongoose adapter gives you
the flexibility to define a schema for each Mongo collection.
