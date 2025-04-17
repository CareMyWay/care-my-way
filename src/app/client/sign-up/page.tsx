import React from "react";
import { TopNavBar } from "@/app/components/top-navbar";
import AccountSummary from "@/app/client/sign-up/components/account-summary";

const page = () => {
  return (
    <div>
      {" "}
      <TopNavBar />
      <AccountSummary />
    </div>
  );
};

export default page;
