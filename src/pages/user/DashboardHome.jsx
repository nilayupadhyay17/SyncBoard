import React, { useState } from "react";
import Navbar from "@/components/common/Navbar";
import BoardList from "@/components/board/BoardList";
import BoardModel from "@/components/board/BoardModel";
import List from "@/components/list/List";

// const Chart = React.lazy(() => import("react-chartjs-2"));
// <Suspense fallback={<div>Loading Chart...</div>}>
//   <Chart data={data} />
// </Suspense>

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

function DashboardHome() {
  const [modelOpen, setModelOpen] = useState(false);

  return (
    <>
      <BoardModel isOpen={modelOpen} setIsOpen={setModelOpen} />
      <div className="h-screen flex flex-col bg-background">
        {/* Navbar */}
        <Navbar />

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar (Desktop) */}
          <aside className="w-64 border-r bg-background hidden md:block">
            <BoardList setModelOpen={setModelOpen} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto relative">
            {/* Mobile Sidebar Trigger */}
            <div className="md:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <BoardList setModelOpen={setModelOpen} />
                </SheetContent>
              </Sheet>
            </div>

            <div className="text-muted-foreground text-sm h-full">
              <List />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default DashboardHome;
