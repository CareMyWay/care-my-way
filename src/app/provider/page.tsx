import "@/app/globals.css";

import { TopNavBar } from "@/components/navbars/top-navbar";
import BackToMarketplace from "@/components/providerprofile/backToMarketplace";
import ProfileSummary from "@/components/providerprofile/profileSummary";
import BookButton from "@/components/providerprofile/requestToBook";
import { Book } from "lucide-react";

export default function Provider() {
  return (
    <div>
      <main>
        {/* Temp location of top navbar */}
        <TopNavBar />
        <div className="flex justify-center items-center gap-5 mt-10">
            <div className="flex flex-col flex-30/100 items-end ml-40 mr-10">
                <div className="flex flex-col items-center border-solid border-1 rounded-md border-input-border-gray pb-7 w-[400px]">
                    <ProfileSummary />
                    <span className="mt-5"><BookButton /></span>
                </div>
            </div>
            <div className="flex-70/100">
                <BackToMarketplace />
            </div>
        </div>
      </main>
    </div>
  );
}