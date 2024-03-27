"use client";

import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Test from "@/components/Test";
import React from "react";

const page = () => {
  const pathname = usePathname();
  const printerId = pathname.split("/").pop();
  return <Test printerId={printerId} />;
};

export default page;
