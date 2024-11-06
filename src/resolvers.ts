import { Arg, Args, FieldResolver, Mutation, NonEmptyArray, Query, Resolver, Root, Subscription } from "type-graphql";
import { Category, CategoryInput, Menu, MenuItem, MenuItemInput, Table } from "./models";
import { prisma, tables } from "./datasource";


@Resolver()
class RestaurantResolver {
    @Query(() => Menu)
    async menu(): Promise<Menu> {
        const categories = await prisma.category.findMany();
        return {
            categories
        };
    }
}

@Resolver(Category)
class CategoryResolver {
    @FieldResolver(() => [MenuItem])
    async items(@Root() category: Category) {
        return await prisma.menuItem.findMany({ where: { categoryId: category.id } });
    }

    @Mutation(() => Category)
    async createCategory(@Args(() => CategoryInput) input: CategoryInput) {
        try {
            return await prisma.category.create({ data: input });
        } catch (error) {
            console.log("ERROR", error);
            return null;
        }
    }

    @Mutation(() => Category)
    async updateCategory(@Arg("id", () => String) id: string, @Args(() => CategoryInput) input: CategoryInput) {
        try {
            return await prisma.category.update({ where: { id }, data: input });
        } catch (error) {
            console.log("ERROR", error);
            return null;
        }
    }

    @Mutation(() => Category)
    async deleteCategory(@Arg("id", () => String) id: string) {
        try {
            return await prisma.category.delete({ where: { id } });
        } catch (error) {
            console.log("ERROR", error);
            return null;
        }
    }
}

@Resolver(MenuItem)
class MenuItemResolver {
    @Mutation(() => MenuItem)
    async createMenuItem(@Args(() => MenuItemInput) input: MenuItemInput) {
        try {
            return await prisma.menuItem.create({ data: input });
        } catch (error) {
            console.log("ERROR", error);
            return null;
        }
    }

    @Mutation(() => MenuItem)
    async updateMenuItem(@Arg("id", () => String) id: string, @Args(() => MenuItemInput) input: MenuItemInput) {
        try {
            return await prisma.menuItem.update({ where: { id }, data: input });
        } catch (error) {
            console.log("ERROR", error);
            return null;
        }
    }

    @Mutation(() => MenuItem)
    async deleteMenuItem(@Arg("id", () => String) id: string) {
        try {
            return await prisma.menuItem.delete({ where: { id } });
        } catch (error) {
            console.log("ERROR", error);
            return null;
        }
    }
}

@Resolver(Table)
class TableResolver {
    @Query(() => [Table])
    tables(): Table[] {
        return tables;
    }

    @FieldResolver(() => [MenuItem], { nullable: true })
    async request(@Root() table: Table) {
        if (!table.request) return null;

        return await prisma.menuItem.findMany({ where: { id: { in: table.request } } });
    }

    @Subscription(() => [Table], { topics: "NEW_TABLE_STATE", })
    newTableState(@Root() tables: Table[]) {
        return tables;
    }
}

export default [RestaurantResolver, TableResolver, CategoryResolver, MenuItemResolver] as NonEmptyArray<Function>;