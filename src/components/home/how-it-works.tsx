import React from "react";

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-h2-size">How It Works</h2>
        <h4 className="b-6 text-h4-size">For Clients:</h4>
        {/* For Clients */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="border border-gray-300 text-darkest-green rounded-lg p-6 flex flex-col items-center justify-center">
              <h5 className="font-bold mb-2 text-h5-size">STEP 1</h5>
              <h6 className="mb-3 text-h6-size">Browse and Search</h6>
              <ul className="space-y-2 mb-4">
                <li>• Explore profiles of experienced caregivers.</li>
                <li>
                  • Filter by availability, location, services offered, and
                  ratings.
                </li>
                <li>
                  • View caregiver details, including certifications and
                  reviews.
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-300 text-darkest-green rounded-lg p-6 flex flex-col items-center justify-center">
              <h5 className="font-bold mb-2 text-h5-size">STEP 3</h5>
              <h6 className="mb-3  text-h6-size">Book Caregiver</h6>
              <ul className="space-y-2 mb-4">
                <li>• Select a caregiver that fits your needs.</li>
                <li>
                  • Send a booking request with your preferred date, time, and
                  care requirements.
                </li>
                <li>
                  • Communicate directly with the caregiver through our secure
                  chat.
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="border border-gray-300 text-darkest-green rounded-lg p-6 flex flex-col items-center justify-center">
              <h5 className="font-bold mb-2 text-h5-size">STEP 3</h5>
              <h6 className="mb-3 text-h6-size">Receive Quality Care</h6>
              <ul className="space-y-2 mb-4">
                <li>• Confirm your booking and receive personalized care.</li>
                <li>
                  • Easily manage and modify bookings from your dashboard.
                </li>
                <li>• Leave a review to help others find great caregivers.</li>
              </ul>
            </div>
          </div>
          <div className="w-full mt-8">
            <p className="mb-12 text-darkest-green">
              Not sure where to start? <br />
              Take our Health Transition Quiz to find caregivers best suited to
              your needs.
            </p>
            <button className=" m-btn orange-button ">HEALTH QUIZ</button>
          </div>
        </div>

        {/* For Caregivers */}
        <div>
          <h4 className="text-darkest-green mb-6">For Caregivers:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="border border-gray-300 text-darkest-green rounded-lg p-6 flex flex-col items-center justify-center">
              <h5 className="font-bold mb-2">STEP 1</h5>
              <h6 className="mb-3">Browse and Search</h6>
              <ul className="space-y-2 mb-4">
                <li>• Sign up and complete your caregiver profile.</li>
                <li>
                  • Add your qualifications, experience, and availability.
                </li>
                <li>
                  • Get verified and approved to start receiving bookings.
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-300 text-darkest-green rounded-lg p-6 flex flex-col items-center justify-center">
              <h5 className="font-bold mb-2">STEP 2</h5>
              <h6 className="mb-3">Patient Bookings</h6>
              <ul className="text-gray-700 space-y-2 mb-4">
                <li>
                  • Receive booking requests based on your skills and
                  availability.
                </li>
                <li>• Chat securely with clients to understand their needs.</li>
                <li>• Accept bookings and confirm your schedule.</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="border border-gray-300 text-darkest-green rounded-lg p-6 flex flex-col items-center justify-center">
              <h5 className="font-bold mb-2">STEP 3</h5>
              <h6 className="mb-3">Provide Quality Care</h6>
              <ul className="space-y-2 mb-4">
                <li>• Deliver quality care and support.</li>
                <li>• Get paid securely through our platform.</li>
                <li>• Build a strong reputation through client reviews.</li>
              </ul>
            </div>
          </div>
          <div className="w-full mt-8">
            <p className="mb-12 text-darkest-green">
              Join Care My Way today and connect with clients looking for
              trusted caregivers like you. <br />
              Set your schedule, showcase your skills, and start making a
              difference!
            </p>
            <button className=" m-btn orange-button ">JOIN TODAY</button>
          </div>
        </div>
      </div>
    </section>
  );
}
