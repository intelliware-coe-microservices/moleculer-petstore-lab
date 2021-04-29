# Deployment and Resilience

This module will focus on deployment and resilience options in Moleculer faramework.
- We will go over running API Gateway and other services in separate nodes - as opposed to running them as a monolith.
- Also will go over **Replica** nodes, how they would be used to increase **performance** and **resiliency**.
- Will go over **Retry** and **Fallback** methods
- Will go over **Circuit Breakers** 
- Will go over **Bulkheads**  

## Prerequisties
You will need the following to start this module:
- Redis server, as a transport mechanism between nodes - if you've done the docker compose already you are good to go.
  
1. `docker pull redis`

2. `docker run -p 6379:6379 --name some-redis -d redis redis-server --appendonly yes`
  
3. `npm install ioredis --save`

## NPM scripts
- `npm run dev`: Start all services and API Gateway in a node - monolith 
- `npm run api`: Start the API Gateway service on a node 
- `npm run pet`: Start Pet service on a node 
- `npm run store`: Start Store service on a node 
- `npm run petstore`: Start Pet and Store services on a node  
  
## Deployment Options
With Moleculer we have the flexability to run our application (services) as a **Monolith** or run them as **Microservices** 

Here you can see [Moleculer Archirecture Options](https://moleculer.services/docs/0.14/clustering.html)

## Step 0 
So far you should have seen the **Monolith** option  - which you would get by doing a `npm run dev`

## Step 1 - run multi node and observe load balancing 
Now we want to run the application in a ditributed ( aka Microservice ) style 
- Make sure you exit the previous instance 
- Change the transport in moleculer.config.js to use REDIS 
  - `transporter: "redis://localhost:6379"`
- Enable tracing in moleculer.config.js under **tracing**
- Alternatively you can add some log statemets in Place Order and Get Pet endpoints so you can easily trace thier behaviour in the console going forward
- Start the application in multi node by running above NPM scripts
  - Open a new terminal and Start API Gateway
  - Open 2 (or more) new terminals and start Store Service 
  - Open 2 (or more) new terminals and start Pet Service 
  - On your terminals you can run `services -d` at any point and see how each node can see the other nodes
  - Now try to Place Order (post order) and watch what happens in various terminal windows 
  - Keep hitting the place order endpoint and see how the load-balancing kicks in, you can change the load balancing options in moleculer.config.js under **registry**
  
## Step 2 - Resiliency, with replica nodes 
  - Now you can simulate when a node crashes by terminating one of each Pet / Store instrances
  - Terminate one instance of Pet and one instance of Store , watch console of remaining nodes as they update and recognize other nodes going offine 
  - Try hitting the Place Order again, you should see system continues to function as expected with remainning nodes.

## Step 3 - Enable retry 
Moleculer provides various mechanisms for Fault tolerance, which we are going to excercise in the next few steps. 
Here is the reference material: [Moleculer Fault Tolerance](https://moleculer.services/docs/0.13/fault-tolerance.html)

- Enable global retry ploicy in moleculer.config.js under **retryPolicy**
- Now we need to simulate a retry situation by making some changes to the Pet service , so that when the Order service call is gets a "retriable"
  - you could add this to the Pet service Get pet to simulate that , or use your own way of simulating a retriable error `return this.Promise.reject(new MoleculerRetryableError("retry!"))`
  
  - Here is [Moleculer Errors](https://moleculer.services/docs/0.12/errors.html#Base-error-classes) for your reference.
  - Now try hitting the Place Order again and you should see the retry activated.
  - Feel free to change global retry options like delay , factor , etc and see the behaviour 

## Step 4 - Override global retry at caller 
Global retry options can be changed at caller level , this would be really handy if a particular service wants to diverge from global policy for any (good) reason.

- You can overwrite the retry options at caller , go ahead and add this to your Place Order 
  - `this.broker.call('pet.getPet', {petId: order.petId}, {timeout: 500,retries: 2})`

## Step 5 - Add fallback method to the caller 
Now you can enhance the retry and also have a fallback method , this could be used when you want to make sure service always comes back with some value in case the callee is not able to respond 

- Add a fallback method on the caller , go ahead and change Place Order 
  - `this.broker.call('pet.getPet', {petId: order.petId}, {timeout: 500,retries: 3, fallbackResponse: getDefaultPet })`
  - something like : `const getDefaultPet = () => {console.log("falling back to get default pet.")}`

## Step 6 - Enable circuit breakers 
The Circuit Breaker can prevent an application from repeatedly trying to execute an operation that’s likely to fail. Allowing it to continue without waiting for the fault to be fixed or wasting CPU cycles while it determines that the fault is long lasting. Full reference here : [Circuit Breaker](https://moleculer.services/docs/0.13/fault-tolerance.html)

- Enable Circuit-breakers by changing moleculer.config.js and under **circuitBreaker**
  - You can also change the **minRequestCount** to a samller nummber  and set the **windowTime** to a shorter window so that you can easily simulate activating the circuit breaker 
- Now try hitting the Place Order few times in a row to exceed the number that would trip the Circuit Breaker in the specified windowTime 
- You shoould see the circuit turns to open and Pet becomes unavilable.
- Circuit breakers will trun back to close when there are successful calls made to the callee, in our case since we hardcoded the failiure in the Pet it won't happen automatically , feel free to make that conditional so that you can similate both sucess and failure cases.
  
## Step 7 - Enable Bulkheads 
Bulkhead feature is implemented in Moleculer framework to control the concurrent request handling of actions.

- Enable bulkheads and set the number of concurrent requests you want to handle by changing moleculer.config.js and under **bulkhead** 
- Hit the Place Order serveral times and observe the bahaviour 





