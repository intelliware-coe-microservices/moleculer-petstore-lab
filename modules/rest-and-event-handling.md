# Rest and Event Handling

## Rest Endpoints
In a microservices architecture some functionality is delivered in a synchronous fashion most commonly via rest endpoints.

Using the greeter.service.js as an example, implement the following rest endpoints in Moleculer using the petstore swagger api
documentation at [https://petstore3.swagger.io/](https://petstore3.swagger.io/).

Some documentation [here](https://moleculer.services/docs/0.14/moleculer-web.html) may help.

You can stub out and hard code pet data in the absence of a persistence layer. Test out the endpoints using your favorite rest
endpoint testing utility.

### Pet Service
- GET /pet/{petId}

### Store Service
- POST /store/order
- GET /store/order/{orderId}

Validate that the pets in the order are available by making a synchronous call from the store service to the pet service.

Add validation of the parameters and payload of the POST using the Fastest Validator library.
See [https://moleculer.services/docs/0.14/validating.html](https://moleculer.services/docs/0.14/validating.html) for details.

Note that for the petId in the getPet endpoint you will need to define it as a string in the validation schema rather than a number.
The same applies to the orderId in the getOrder endpoint.

## Event Handling
In the real world there are events that are propagated to other services asynchronously based on a user action or some background process.

Implement the POST /pet endpoint in the pet service. For simplicity assume that this creates a "Pet Created" event which will update
inventory for that pet with a default value of 10 if the pet's status is available.

Update the pet service to create a broadcast event to notify other services that the pet has been created.
See [https://moleculer.services/docs/0.14/events.html](https://moleculer.services/docs/0.14/events.html) for examples of how to do this.

Store the inventory for each pet in memory. Implement the GET /store/inventory endpoint in the store service to verify the event was
processed correctly. Note the definition of this endpoint doesn't seem to make much sense. Feel free to just return the inventory for
each petId.
