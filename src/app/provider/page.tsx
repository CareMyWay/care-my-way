import "@/app/globals.css";

import { TopNavBar } from "@/components/navbars/top-navbar";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import BackToMarketplace from "@/components/provider-profile/back-to-marketplace";
import ProfileSummary from "@/components/provider-profile/profile-summary";
import ProfileDetails from "@/components/provider-profile/profile-details";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
=======
import BackToMarketplace from "@/components/providerprofile/backToMarketplace";
import ProfileSummary from "@/components/providerprofile/profileSummary";
import BookButton from "@/components/providerprofile/requestToBook";
import { Book } from "lucide-react";
>>>>>>> 04be5df (Profile Summary commit)
=======
import BackToMarketplace from "@/components/provider-profile/back-to-marketplace";
import ProfileSummary from "@/components/provider-profile/profile-summary";
import ProfileDetails from "@/components/provider-profile/profile-details";
>>>>>>> 6087b50 (provider-details completed)
=======
import BackToMarketplace from "@/components/provider-profile/back-to-marketplace";
import ProfileSummary from "@/components/provider-profile/profile-summary";
import { Book } from "lucide-react";
import ProfileDetails from "@/components/provider-profile/profile-details";
>>>>>>> 64d69c6 (provider-details completed)

export default function Provider() {
  return (
    <div>
      <main>
        {/* Temp location of top navbar */}
        <TopNavBar />
        <div className="flex flex-col lg:flex-row justify-center gap-5 mt-10 mx-4 md:mx-10 md:mr-24 2xl:mx-30 2xl:mr-52">
          <div className="flex flex-col w-full md:flex-1/5 ml-0 md:ml-5 xl:ml-16 mr-0 md:mr-10 lg:sticky md:top-10 self-start">
            <div className="mb-5 md:mb-10">
<<<<<<< HEAD
<<<<<<< HEAD
              <Link href="/provider" className="flex text-h6-size text-dark-green underline-overlap hover:text-medium-green">
                <ArrowLeft size={17} className="mr-1" /> Back to search page
              </Link>
=======
              <BackToMarketplace />
>>>>>>> 6087b50 (provider-details completed)
=======
              <BackToMarketplace />
>>>>>>> 64d69c6 (provider-details completed)
            </div>
            <div className="items-center md:items-end mx-auto mb-5">
              <ProfileSummary />
            </div>
          </div>
          <div className="w-full md:flex-4/5">
            <ProfileDetails />
          </div>
        </div>
      </main>
    </div>
  );
}