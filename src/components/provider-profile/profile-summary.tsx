import React from "react";
import Image from "next/image";
import BookButton from "./request-to-book";

// Need to fetch data from dynamoDB when ready
const fetchProvider = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const providerData = await res.json();
    return providerData;
}

const providerName = "Nina Nguyen"; // get name from data when available
const providerTitle = "Health Care Aid"; // get title from data when available
const providerCity = "Calgary"; // get location from data when available
const workExperience = "5+ years"; // get work experience from data when available
const startingRate = "$20/hour"; // get starting rate from data when available
const responseTime = "5 hours"; // get response time from data when available

const ProfileSummary = () => {
return (
    <div className="flex flex-col items-center border-solid border-1 rounded-md border-input-border-gray pb-7 w-full md:w-[320px] xl:w-[400px]">
        <div className="flex flex-col items-left w-[360px] p-7">
            <div className="md:w-[220] xl:w-[320px] md:h-[220px] xl:h-[320px] mx-auto">
                <Image src='/images/home/meet-providers/person-placeholder-1.png' alt='Profile Image' height={400} width={400} className="w-full h-full object-cover" />
            </div>
            <span className="text-h5-size xl:text-h4-size font-semibold text-darkest-green mt-5 md:mt-10 md:px-7 xl:px-0">{providerName.toUpperCase()}</span>
            <div className="flex md:px-7 xl:px-0">
                <span className="text-body5-size xl:text-body3-size text-darkest-green">{providerTitle}</span>
                <span className="text-body5-size xl:text-body3-size text-darkest-green mx-1"> | </span>
                <span className="text-body5-size xl:text-body3-size text-darkest-green">{providerCity}</span>
            </div>
            <div className="flex flex-col gap-4 md:px-7 xl:px-0">
                <div className="flex justify-between w-full mt-5">
                    <span className="text-[12px] xl:text-body5-size text-darkest-green my-auto">Working Experience</span>
                    <span className="text-[14px] xl:text-body4-size text-darkest-green font-semibold my-auto">{workExperience}</span>
                </div>
                <div className="flex justify-between w-full">
                    <span className="text-[12px] xl:text-body5-size text-darkest-green my-auto">Starting Rate</span>
                    <span className="text-[14px] xl:text-body4-size text-darkest-green font-semibold my-auto">{startingRate}</span>
                </div>
                <div className="flex justify-between w-full">
                    <span className="text-[12px] xl:text-body5-size text-darkest-green my-auto">Response Time</span>
                    <span className="text-[14px] xl:text-body4-size text-darkest-green font-semibold my-auto">{responseTime}</span>
                </div>
            </div>    
        </div>
        <span className="mt-5"><BookButton /></span>
    </div>
);
}

export default ProfileSummary;