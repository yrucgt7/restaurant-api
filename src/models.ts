import { ArgsType, Field, InputType, Int, ObjectType, registerEnumType } from "type-graphql";

@ObjectType()
export class MenuItem {
    @Field(() => String)
    id!: string;
    
    @Field(() => String)
    description!: string;

    @Field(() => Int)
    price!: number;
}

@ObjectType()
export class Category {
    @Field(() => String)
    id!: string;

    @Field(() => String)
    name!: string;
}

@ObjectType()
export class Menu {
    @Field(() => [Category])
    categories!: Category[];
}

export enum TableState {
    Empty,
    Waiting,
    Attended
}

registerEnumType(TableState, {
    name: "TableState",
    description: "States of a table"
});

@ObjectType()
export class Table {
    @Field(() => Int)
    id!: number;

    @Field(() => TableState)
    state!: TableState;

    request!: string[] | null;
}

@ArgsType()
export class CategoryInput {
    @Field(() => String)
    name!: string;
}

@ArgsType()
export class MenuItemInput {
    @Field(() => String)
    description!: string;

    @Field(() => Int)
    price!: number;

    @Field(() => String)
    categoryId!: string;
}