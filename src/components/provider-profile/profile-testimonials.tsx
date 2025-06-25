import React from "react";
import Image from "next/image";

const ProfileTestimonials = () => {
    const testimonials = [
        {
            name: "Darius Coleman",
            date: "2023-10-01",
            content: "“Nina has become like family to us. Her care, patience, and gentle approach made my mom feel safe and loved every single day.”",
            image: "/images/home/meet-providers/person-placeholder-6.jpg",
        },
        {
            name: "Jane Smith",
            date: "2023-09-15",
            content: "“Nina is amazing. Thoughtul, reliable, and truly passionate about what she does. Couldn't have asked for better support.”",
            image: "/images/home/meet-providers/person-placeholder-3.jpg",
        },
    ];

    return (
        <div className="flex flex-col gap-2 my-10">
            <div className="text-h5-size text-dark-green font-semibold mb-2">Testimonials</div>
            <div className="flex flex-col gap-6">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className=" text-darkest-green p-4 border-solid border-1 rounded-md border-input-border-gray">
                        <div className="flex flex-row gap-4">
                            <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] flex-shrink-0">
                                <Image src={testimonial.image} alt='Darius Testimonial' height={50} width={50} className="mb-5 rounded-full object-cover" style={{aspectRatio: "1/1"}} />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-body4-size font-semibold">{testimonial.name}</div>
                                <p className="text-[16px] md:text-body4-size mt-2">{testimonial.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileTestimonials;