import { BOARD_TABLE_ID, DB_ID, tablesDb } from "@/lib/appwrite";
import { Query } from "appwrite";

export const getBoardsList = async (userId) => {
  return await tablesDb.listRows({
    databaseId: DB_ID,
    tableId: BOARD_TABLE_ID,
    queries: [Query.equal("ownerId", [userId]), Query.orderDesc("$createdAt")],
  });
};

export const createBoard = async (data, ownerId) => {
  return await tablesDb.createRow({
    databaseId: DB_ID,
    tableId: BOARD_TABLE_ID,
    rowId: "unique()",
    data: {
      ...data,
      ownerId,
    },
  });
};

//update board

//delete board
