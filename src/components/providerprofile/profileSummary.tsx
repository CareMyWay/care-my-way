import React from "react";
import Image from "next/image";

// Need to fetch data from dynamoDB when ready
// const fetchProvider = async () => {
//     const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
//     if (!res.ok) {
//         throw new Error("Failed to fetch data");
//     }
//     const providerData = await res.json();
//     return providerData;
// }

const providerName = "Nina Nguyen"; // get name from data when available
const providerTitle = "Health Care Aid"; // get title from data when available
const providerCity = "Calgary"; // get location from data when available
const workExperience = "5+ years"; // get work experience from data when available
const startingRate = "$20/hour"; // get starting rate from data when available
const responseTime = "5 hours"; // get response time from data when available

const ProfileSummary = () => {
return (
    <div className="flex flex-col items-left w-[370px] p-7">
        <span>
            <Image src='/images/home/meet-providers/person-placeholder-1.png' alt='Profile Image' height={400} width={400} className="mb-5" />
        </span>
        <span className="text-h4-size font-semibold text-darkest-green">{providerName.toUpperCase()}</span>
        <div className="flex">
            <span className="text-body3-size text-darkest-green">{providerTitle}</span>
            <span className="text-body3-size text-darkest-green mx-1"> | </span>
            <span className="text-body3-size text-darkest-green">{providerCity}</span>
        </div>
        <div className="flex flex-col gap-4">
            <div className="flex justify-between w-full mt-5">
                <span className="text-body5-size text-darkest-green my-auto">Working Experience</span>
                <span className="text-body4-size text-darkest-green font-semibold my-auto">{workExperience}</span>
            </div>
            <div className="flex justify-between w-full">
                <span className="text-body5-size text-darkest-green my-auto">Starting Rate</span>
                <span className="text-body4-size text-darkest-green font-semibold my-auto">{startingRate}</span>
            </div>
            <div className="flex justify-between w-full">
                <span className="text-body5-size text-darkest-green my-auto">Response Time</span>
                <span className="text-body4-size text-darkest-green font-semibold my-auto">{responseTime}</span>
            </div>
        </div>    
    </div>
);
}

export default ProfileSummary;