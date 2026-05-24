import { Client, Account, Databases, Storage, TablesDB } from "appwrite";

export const client = new Client();
client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT);
client.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// table ke data ko access karen ke lie
export const tablesDb = new TablesDB(client);
export { ID } from "appwrite";
export const DB_ID = import.meta.env.VITE_DATABASE_ID;
export const BOARD_TABLE_ID = import.meta.env.VITE_BOARD_TABLE_ID;
export const LIST_TABLE_ID = import.meta.env.VITE_LIST_TABLE_ID;
export const TASK_TABLE_ID = import.meta.env.VITE_TASK_TABLE_ID;
