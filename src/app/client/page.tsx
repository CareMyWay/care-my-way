import React from "react";
import AccountSummary from "./components/account-summary";
import { TopNavBar } from "../components/top-navbar";

const page = () => {
  return (
    <div>
      <TopNavBar />
      <AccountSummary />
    </div>
  );
};

export default page;
