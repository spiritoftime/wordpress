import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <img
          src="../../../src/assets/logo-transparent.png"
          alt="auto mate logo"
          width="45%"
          className="mx-auto mb-5"
        />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Authentication required
        </h1>
        <p className="text-base leading-7 text-gray-600 ">
          Please log in to access this page
        </p>
        <div className="flex items-center justify-center mt-5 gap-x-6">
          <Button
            className="bg-[#0D05F2] font-semibold text-white hover:bg-[#3D35FF] w-36"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
