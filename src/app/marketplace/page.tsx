import React from "react";
import Navbar from "@/components/nav-bars/navbar";
import { getCurrentUserServer } from "@/utils/amplify-server-utils";
import MarketplaceFrame from "@/components/marketplace/frame";

const MarketplacePage = async () => {
  const currentUser = await getCurrentUserServer();

  if (!currentUser) {
    return (
      <div>
        <Navbar />
        <section className="h-auto px-4 py-12 md:px-16 bg-primary-white">
          <div className="container mx-auto flex flex-col md:h-auto">
            <div className="h-2/3 flex items-center justify-center">Error loading qMarketplace -1</div>
          </div>
        </section>
      </div>
    );
  }

  const currUserId = currentUser.userId;

  if (!currUserId) {
    return (
      <div>
        <Navbar />
        <section className="h-auto px-4 py-12 md:px-16 bg-primary-white">
          <div className="container mx-auto flex flex-col md:h-auto">
            <div className="h-2/3 flex items-center justify-center">Error loading qMarketplace -2</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="h-auto px-4 py-12 md:px-16 bg-primary-white">
        <div className="container mx-auto flex flex-col md:h-auto">
          <MarketplaceFrame />
        </div>
      </section>
    </div>

  );
};

export default MarketplacePage;
