import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import { BOARD_TABLE_ID, DB_ID, tablesDb } from "./lib/appwrite";
function App() {
  useEffect(() => {
    async function loadData() {
      const result = await tablesDb.listRows({
        databaseId: DB_ID,
        tableId: BOARD_TABLE_ID,
      });

      console.log(result);
    }

    loadData();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-4xl">My Trello</h1>
      <Button>Click Me</Button>
    </div>
  );
}

export default App;
