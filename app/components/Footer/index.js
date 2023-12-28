"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const router = useRouter();

  return (
    <footer className="w-full fixed bottom-0 z-0">
      <Image
        src="/footer_layer.svg"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        alt="footer image"
      />
    </footer>
  );
}
