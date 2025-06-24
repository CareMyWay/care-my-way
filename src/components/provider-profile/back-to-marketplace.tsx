import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

const BackToMarketplace = () => {
  return (
    <Link
      href="/provider"
      className="flex text-h6-size text-dark-green underline-overlap hover:text-medium-green"
    >
      <ArrowLeft size={17} className="mr-1" /> Back to search page
    </Link>
  );
};

export default BackToMarketplace;
