import React, { useState } from "react";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { registerUesr } from "@/features/auth/authService";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

function SignupPage() {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleInputChange(event) {
    setUserData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    // alert("hi");

    event.preventDefault();
    console.log(userData);

    // validation

    try {
      setLoading(true);
      const response = await registerUesr(userData);
      console.log(response);
      toast.success("user registered successfully.");
    } catch (error) {
      console.log(error);
      setError(error);
      toast.error("error in creating user !");
    } finally {
      setLoading(false);
    }
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
            <CardTitle className="text-3xl font-bold">
              Create your account
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Organize tasks. Boost productivity.
            </p>
          </CardHeader>

          <CardContent className="relative z-10 ">
            {error && <div className="py-4 text-red-400">{error.message}</div>}

            <form method="post" onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  onChange={handleInputChange}
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={userData.name}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={handleInputChange}
                  name="email"
                  value={userData.email}
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
                  value={userData.password}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  onChange={handleInputChange}
                  value={userData.phone}
                  name="phone"
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                />
              </div>

              <Button disabled={loading} type="submit" className="w-full mt-4">
                {loading ? (
                  <>
                    <Spinner /> Creating Account ...
                  </>
                ) : (
                  <> Create Account</>
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <span className="text-primary cursor-pointer hover:underline">
                  <Link to={"/login"}>Login</Link>
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default SignupPage;
