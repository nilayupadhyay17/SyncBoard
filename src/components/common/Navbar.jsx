import React from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice";

import { ModeToggle } from "../theme/mode-toggle";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <navbar className="flex justify-between px-10 h-20  border-b items-center">
      <div>
        <span className="text-3xl font-semibold">MyTrello</span>
      </div>
      <div className="flex gap-3 items-center">
        <ModeToggle />
        <Button variant="outline">{user?.name}</Button>
        <Button
          onClick={async () => {
            await dispatch(logout()).unwrap();
            window.location.reload();
          }}
          className={"cursor-pointer"}
        >
          Logout
        </Button>
      </div>
    </navbar>
  );
}

export default Navbar;
