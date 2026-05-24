// load the list of board

import { DB_ID, LIST_TABLE_ID } from "@/lib/appwrite";
import { tablesDb } from "@/lib/appwrite";
import { Query } from "appwrite";


export async function getLists(boardId) {
  return await tablesDb.listRows({
    databaseId: DB_ID,
    tableId: LIST_TABLE_ID,
    queries: [Query.equal("boardId", [boardId]), Query.orderAsc("$createdAt")],
  });
}

export async function createList(data) {
  return await tablesDb.createRow({
    databaseId: DB_ID,
    tableId: LIST_TABLE_ID,
    rowId: "unique()",
    data,
  });
}

export async function updateList(listId, data) {
  return await tablesDb.updateRow({
    databaseId: DB_ID,
    tableId: LIST_TABLE_ID,
    rowId: listId,
    data,
  });
}

export async function deleteList(listId) {
  return await tablesDb.deleteRow({
    databaseId: DB_ID,
    tableId: LIST_TABLE_ID,
    rowId: listId,
  });
}
