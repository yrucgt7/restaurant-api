import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import {  } from "apollo-server";
import express from "express";
import http from "http";
import resolvers from "./resolvers";
import {WebSocketServer} from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { execute, subscribe } from "graphql";
import { tableThread } from "./tables";
import { TableState } from "./models";
import { pubSub } from "./datasource";

async function startServer() {
  const schema = await buildSchema({
    resolvers,
    pubSub: pubSub
  });

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
  });

  await server.start();
  server.applyMiddleware({ app });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer({ schema, execute, subscribe }, wsServer);

  httpServer.listen(4000, () => {
    console.log(`Server is running on http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();

if(process.env.CLIENT_TIMER && +process.env.CLIENT_TIMER > 0) setInterval(() => tableThread(TableState.Empty, TableState.Waiting), +process.env.CLIENT_TIMER);
if(process.env.WAITER_TIMER && +process.env.WAITER_TIMER > 0) setInterval(() => tableThread(TableState.Waiting, TableState.Attended), +process.env.WAITER_TIMER);
if(process.env.EATING_TIMER && +process.env.EATING_TIMER > 0) setInterval(() => tableThread(TableState.Attended, TableState.Empty), +process.env.EATING_TIMER);
