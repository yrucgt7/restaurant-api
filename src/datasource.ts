import { PrismaClient } from "@prisma/client";
import { PubSub, PubSubEngine } from "graphql-subscriptions";
import { PubSub as PubSubInterface } from "type-graphql";
import { Table, TableState } from "./models";

class CustomAsyncIterable<T> implements AsyncIterable<T> {
    constructor(private iterator: AsyncIterator<T>) {
        this.iterator = iterator;
    }

    [Symbol.asyncIterator](): AsyncIterator<T, any, any> {
        return this.iterator;
    }
}

class CustomPubSub implements PubSubInterface {
    private pubSub: PubSub;

    constructor() {
        this.pubSub = new PubSub();
    }

    publish(routingKey: string, ...args: unknown[]): void {
        this.pubSub.publish(routingKey, args);
    }

    publishRaw(routingKey: string, payload: any): void {
        this.pubSub.publish(routingKey, payload);
    }

    subscribe(routingKey: string, dynamicId?: unknown): AsyncIterable<unknown> {
        return new CustomAsyncIterable(this.pubSub.asyncIterator(routingKey));
    }
}

export const prisma = new PrismaClient();
export const tables: Table[] = Array.from({ length: 20 }, (_, index) => ({ id: index + 1, state: TableState.Empty, request: null }));
export const pubSub = new CustomPubSub();
