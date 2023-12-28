"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { login } from "../components/method";
import { toaster, toasterError } from "../components/toaster";

const Login = () => {
  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const send_token = cookies.token;

  const onInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear the error when the user starts typing
  };

  const isInputEmpty = (inputValue) => {
    return inputValue == null || inputValue.trim() === "";
  };

  const validateFields = () => {
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isInputEmpty(loginData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;
    } else if (!emailRegex.test(loginData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    if (isInputEmpty(loginData.password)) {
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

      const response = await login(send_token, loginData);

      if (response.data.status.code === 200) {
        toaster(response.data.status.message);

        const accessToken = response.headers.authorization;
        setCookie("token", accessToken);

        router.push("/");
      } else {
        setErrors({ ...errors, password: response.data.status.message });
      }
    } catch (error) {
      toasterError(error.response.data);
      console.error("Error:", error.message);
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
          Sign in
        </h1>

        <div className="mt-10">
          {/* Email Input */}
          <div>
            <input
              type="text"
              onChange={(e) => onInputChange(e)}
              name="email"
              placeholder="Email"
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
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
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 rounded-[10px] bg-[#224957] placeholder:text-white text-white mt-6 ${
                errors.password ? "border border-[#EB5757] caret-[#EB5757]" : "" // Apply red border if there is an error
              }`}
              autoComplete="on"
            />
            {errors.password && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-center items-center mb-6 mt-6">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-5 h-5 mr-2 flex-shrink-0 border round accent-[#224957] border-white rounded-[5px] checked:bg-[#000] checked:border-transparent cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-white text-base font-normal"
            >
              Remember me
            </label>
          </div>

          <button
            onClick={() => submitForm()}
            className={`w-[300px] items-center gap-[5px] px-6 py-4 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base text-center`}
          >
            Log in
          </button>

          <p className="text-center mt-4 text-white">
            {`Don't have an account? `}
            <span
              className="cursor-pointer text-teal-500 hover:text-teal-600 ml-0.5"
              onClick={() => router.push("/register")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
