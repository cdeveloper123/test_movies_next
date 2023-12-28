"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { signup } from "../components/method";
import { toaster, toasterError } from "../components/toaster";

const SignUp = () => {
  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const send_token = cookies.token;

  const onInputChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear the error when the user starts typing
  };

  const isInputEmpty = (inputValue) => {
    return inputValue == null || inputValue.trim() === "";
  };

  const validateFields = () => {
    let isValid = true;

    if (isInputEmpty(signupData.name)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isInputEmpty(signupData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;
    } else if (!emailRegex.test(signupData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    if (isInputEmpty(signupData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }

    return isValid;
  };

  const submitForm = async () => {
    try {
      if (!validateFields()) {
        return;
      }

      const response = await signup(send_token, signupData);

      if (response.data.status.code === 200) {
        toaster(response.data.status.message);

        const accessToken = response.headers.authorization;
        setCookie("token", accessToken);

        router.push("/");
      } else {
        setError(response.data.status.message);
      }
    } catch (error) {
      toasterError(error.response.data?.status?.message);
    }
  };

  useEffect(() => {
    if (cookies.token) {
      router.push("/");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-80">
        <h1 className="text-white text-center text-[64px] font-semibold leading-[80px]">
          Sign up
        </h1>

        <div className="mt-10">
          {/* Name Input */}
          <div>
            <input
              type="text"
              onChange={(e) => onInputChange(e)}
              name="name"
              placeholder="Name"
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                errors.name ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            {errors.name && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <input
              type="text"
              onChange={(e) => onInputChange(e)}
              name="email"
              placeholder="Email"
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 mt-6 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                errors.email ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            {errors.email && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              onChange={(e) => onInputChange(e)}
              name="password"
              placeholder="Password"
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 mt-6 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                errors.password ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            {errors.password && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.password}</p>
            )}
          </div>

          <button
            onClick={() => submitForm()}
            className={`w-[300px] items-center gap-[5px] px-6 py-4 mt-6 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base text-center 
              }`}
            // disabled={!rememberMe}
          >
            Sign up
          </button>

          <p className="text-center mt-4 text-white">
            {`Already have an account? `}
            <span
              className="cursor-pointer text-teal-500 hover:text-teal-600 ml-0.5"
              onClick={() => router.push("/login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
