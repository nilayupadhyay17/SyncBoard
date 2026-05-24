import React from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

function AppLayout() {
  return (
    <div>
      <Toaster />
      <Outlet />
    </div>
  );
}

export default AppLayout;
