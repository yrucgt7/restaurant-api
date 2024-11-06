import { TableState } from "./models";
import { pubSub, tables, prisma } from "./datasource";

function getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function getRandomElements<T>(array: T[]): T[] {
    if(array.length === 0) return [];

    const randomNumber = Math.floor(Math.random() * 10);
    const elements: T[] = [];

    for (let i = 0; i <= randomNumber; i++) elements.push(getRandomElement(array));

    return elements;
}

export async function tableThread(tableState: TableState, newTableState: TableState) {
    const randomTables = getRandomElements(tables.filter(table => table.state === tableState));

    if(!randomTables || randomTables?.length === 0) return;

    for(const table of randomTables) {
        table.state = newTableState;
        table.request = newTableState === TableState.Waiting ? getRandomElements(await prisma.menuItem.findMany()).map(item => item.id) : null;
    }
    
    pubSub.publishRaw("NEW_TABLE_STATE", randomTables);
}