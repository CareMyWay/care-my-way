import { Carousel } from "@/components/carousel";
import Image from "next/image";

export function MeetOurProviders() {
  const caregivers_name: string[] = [
    "Nina N",
    "Anto Tarazevich",
    "Hannah Nelson",
    "Jo Fakhouri",
    "J McKnight",
    "Justin Shaifer",
    "Kampus",
    "Olly",
    "Anna L",
    "Craig",
  ];

  return (
    <section className="py-16 bg-medium-green">
      <div className="container mx-auto px-4">
        <h3 className="text-primary-white">Meet Our Caregivers</h3>

        <Carousel>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
            <div key={index} className="px-2 mb-16">
              <div className="bg-light-green rounded-lg overflow-hidden shadow-md">
                <div className="relative h-64">
                  <Image
                    src={`/images/home/person-placeholder-${index}.${index == 1 ? "png" : "jpg"}`}
                    alt={`Caregiver ${index}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col">
                  <h4 className="text-primary-white mb-1">
                    {caregivers_name[index - 1]}
                  </h4>
                  <h6 className="text-primary-white">
                    Health Care Aide (HCA) <br /> Calgary | Alberta
                  </h6>
                  <button className=" s-btn orange-button self-center">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
