import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { loginUser } from "@/features/auth/authService";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/features/auth/authSlice";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, sessionId, error } = useSelector((state) => state.auth);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (sessionId) {
      navigate("/dashboard");
    }
  }, [sessionId]);

  function handleInputChange(event) {
    setLoginData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // setLoading(true);
    // const response = await loginUser(loginData);
    // console.log(response);
    //current user--> global state:

    dispatch(login(loginData));

    toast.success("login success");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-2xl" />

          <CardHeader className="relative z-10 text-center">
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <p className="text-muted-foreground mt-2">
              Login to continue managing your tasks
            </p>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            <div className="py-4 text-red-500">{error?.message}</div>
            <form
              action=""
              method="post"
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={handleInputChange}
                  name="email"
                  value={loginUser.email}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={handleInputChange}
                  name="password"
                  value={loginUser.password}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <Button
                disabled={loading}
                type="submit"
                className="w-full mt-4 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Spinner /> Please wait...
                  </>
                ) : (
                  <>Login</>
                )}
              </Button>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="hover:text-primary cursor-pointer">
                  Forgot password?
                </span>
                <span className="hover:text-primary cursor-pointer">
                  <Link to={"/signup"}>Signup</Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default LoginPage;
