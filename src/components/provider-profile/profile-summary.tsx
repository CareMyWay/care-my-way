import React from "react";
import Image from "next/image";
import OrangeButton from "../buttons/orange-button";

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
const providerMeta = [
  { value: providerTitle },
  { value: " | ", className: "mx-1" },
  { value: providerCity },
];
const infoRows = [
  { label: "Working Experience", value: workExperience },
  { label: "Starting Rate", value: startingRate },
  { label: "Response Time", value: responseTime },
];

const ProfileSummary = () => {
return (
    <div className="flex flex-col items-center border-solid border-1 rounded-md border-input-border-gray pb-7 w-full md:w-[320px] xl:w-[400px]">
        <div className="flex flex-col items-left w-[360px] p-7">
            <div className="md:w-[220] xl:w-[320px] md:h-[220px] xl:h-[320px] mx-auto">
                <Image src='/images/home/meet-providers/person-placeholder-1.png' alt='Profile Image' height={400} width={400} className="w-full h-full object-cover" />
            </div>
            <span className="text-h5-size xl:text-h4-size font-semibold text-darkest-green mt-5 md:mt-10 md:px-7 xl:px-0">{providerName.toUpperCase()}</span>
            <div className="flex md:px-7 xl:px-0">
            {providerMeta.map((item, idx) => (
                <span
                key={idx}
                className={`text-body5-size xl:text-body3-size text-darkest-green ${item.className || ""}`}
                >
                {item.value}
                </span>
            ))}
            </div>
            <div className="flex flex-col gap-4 md:px-7 xl:px-0">
            {infoRows.map((row, idx) => (
                <div
                key={row.label}
                className={`flex justify-between w-full${idx === 0 ? " mt-5" : ""}`}
                >
                <span className="text-[12px] xl:text-body5-size text-darkest-green my-auto">
                    {row.label}
                </span>
                <span className="text-[14px] xl:text-body4-size text-darkest-green font-semibold my-auto">
                    {row.value}
                </span>
                </div>
            ))}
            </div>   
        </div>
        <div className="mt-5">
            <OrangeButton variant="route" href="/provider" className="w-full"> {/*href is a placeholder link, replace with booking link */}
                REQUEST TO BOOK
            </OrangeButton>
        </div>
    </div>
);
}

export default ProfileSummary;