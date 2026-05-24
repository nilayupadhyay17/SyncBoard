import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { fetchCurrentUser } from "@/features/auth/authSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router";

function DashboardLayout() {
  const dispatch = useDispatch();

  const { user, sessionId, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading)
    return (
      <>
        <div className="flex gap-2 flex-col h-screen justify-center items-center">
          <Spinner></Spinner>
          <h1>Loading...</h1>
        </div>
      </>
    );

  return user ? (
    <Outlet />
  ) : (
    <>
      <>
        <div className="flex gap-2 flex-col h-screen justify-center items-center">
          <h1 className="font-bold">You are not loggedIn </h1>
          <Link to={"/login"}>
            <Button>Login Now </Button>
          </Link>
        </div>
      </>
    </>
  );
}

export default DashboardLayout;
