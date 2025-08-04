import { Carousel } from "@/components/ui/carousel";
import Image from "next/image";
import GreenButton from "../buttons/green-button";

export function MeetOurProviders() {
  const caregivers_name: string[] = [
    "Nina N",
    "Anto T",
    "Hannah N",
    "Joey F",
    "Jay M",
    "Justin S",
    "Kampus K",
    "Olly Y",
    "Anna L",
    "Craig B",
  ];

  return (
    <section className="py-16 md:px-10 text-center  bg-medium-green ">
      <div className="container mx-auto px-4 flex flex-col ">
        <div className="w-full text-h4-size md:w:2-1/2 mb-10">
          <h3 className="text-primary-white md:text-h3-size mb-2 ">
            Meet Our Healthcare Professionals
          </h3>
          <p className="text-primary-white text-body4-size md:text-body2-size">
            Get to know the compassionate professionals behind Care My Way. Each
            caregiver is verified, experienced, and dedicated to supporting you
            or your loved one with kindness, respect, and personalized care.
          </p>
        </div>

        <div className="w-full md:w:2-1/2">
          <Carousel>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
              <div key={index} className="px-2 mb-16">
                <div className="bg-primary-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative">
                    <div className="relative w-24 h-24 mx-auto my-4 rounded-full overflow-hidden">
                      <Image
                        src={`/images/home/meet-providers/person-placeholder-${index}.${index == 1 ? "png" : "jpg"}`}
                        alt={`Caregiver ${index}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL="..."
                        className="object-cover"
                      />
                    </div>
                    {/* Text overlay on image */}
                    <h4 className="text-h4-size">
                      {caregivers_name[index - 1]}
                    </h4>
                    <h6 className="text-h6-size">
                      Health Care Aide (HCA) <br /> Calgary | Alberta
                    </h6>
                  </div>

                  {/* Button outside image */}
                  <div className="p-4 mb-2 flex justify-center">
                    <GreenButton
                      className="my-2 w-50"
                      href="/provider"
                      variant="route"
                    >
                      View
                    </GreenButton>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
