"use client";

import { NextResponse } from "next/server";
import { useCookies } from "react-cookie";

export function authMiddleware(handler) {
  return async (req) => {
    // Skip middleware for routes that don't require authentication
    if (req.pathname === "/login" || req.pathname === "/register") {
      return handler(req);
    }

    // Authenticate the token from cookies
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const token = cookies.token;


    if (!token) {
      return NextResponse.redirect("/login");
    }

    // Continue to the protected route
    return handler(req);
  };
}
