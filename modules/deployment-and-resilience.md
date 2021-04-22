# Deployment and Resilience

This module will focus on deployment and resilience options in Moleculer faramework.
- We will go over running API Gateway and other services in separate nodes - as opposed to running them as a monolith.
- Also will go over **Replica** nodes, how they would be used to increase **performance** and **resiliency**.
- Will go over **Circuit breaker** and **Fallback** methods
- Will go over **Bulkheads**  

## Prerequisties
You will need the following to start this module:
- Redis server, as a transport mechanism between nodes
  
1. `docker pull redis`

2. `docker run -p 6379:6379 --name some-redis -d redis redis-server --appendonly yes`
  
3. `npm install ioredis --save`

## NPM scripts
- `npm run api`: Start the API Gateway service on a node 
- `npm run pet`: Start Pet service on a node 
- `npm run store`: Start Store service on a node 
- `npm run petstore`: Start Pet and Store services on a node  
  