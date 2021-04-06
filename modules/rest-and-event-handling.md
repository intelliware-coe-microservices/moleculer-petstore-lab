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

## Event Handling
In the real world the processing of an order would have many steps and would likely be done asynchronously.

Convert the implementation of the order creation endpoint to publish a create order event using NATS as a message broker.

Implement a message handler in the store service to validate the order and store the result in memory in the absence of a persistency later.

Verify that the endpoint works by making a call to the get order endpoint.
