# Deployment and Resilience

This module will focus on deployment and resilience options in Moleculer faramework.
- We will go over running API Gateway and other services in separate nodes - as opposed to running them as a monolith.
- Also will go over **Replica** nodes, how they would be used to increase **performance** and **resiliency**.
- Will go over **Circuit breaker** and **Fallback** methods
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
- Add some log statemets in Place Order and Get Pet endpoints so you can easily trace thier behaviour in the console going forward
- Start the application in multi node by running above NPM scripts
  - Open a new terminal and Start API Gateway
  - Open 2 (or more) new terminals and start Store Service 
  - Open 2 (or more) new terminals and start Pet Service 
  - On your terminals you can run `services -d` at any point and see how each node can see the other nodes
  - Now try to place an order (post order) and watch what happens in various terminal windows 
  - Keep hitting the place order endpoint and see how the load-balancing kicks in, you can change the load balancing options in moleculer.config.js under registry
  
## Step 2 - Resiliency, with replica nodes 
  - Now you can simulate when a node crashes by terminating one of Pet / Store instrance
  - Terminate one instance of Pet and one instance of Store , watch console of remaining nodes as they update and recognize other nodes going offine 
  - Try hitting the Place Order again, you should see system continues to function as expected with remainning nodes.

