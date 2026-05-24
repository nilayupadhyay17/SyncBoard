import { DB_ID, TASK_TABLE_ID, tablesDb } from "@/lib/appwrite";
import { Query } from "appwrite";

export async function getTasks(listId) {
    return await tablesDb.listRows({
        databaseId: DB_ID,
        tableId: TASK_TABLE_ID,
        queries: [Query.equal("listId", [listId]), Query.orderDesc("$createdAt")],
    });
}

export async function createTask(data) {
    return await tablesDb.createRow({
        databaseId: DB_ID,
        tableId: TASK_TABLE_ID,
        rowId: "unique()",
        data,
    });
}

export async function updateTask(taskId, data) {
    return await tablesDb.updateRow({
        databaseId: DB_ID,
        tableId: TASK_TABLE_ID,
        rowId: taskId,
        data,
    });
}

export async function deleteTask(taskId) {
    return await tablesDb.deleteRow({
        databaseId: DB_ID,
        tableId: TASK_TABLE_ID,
        rowId: taskId,
    });
}
