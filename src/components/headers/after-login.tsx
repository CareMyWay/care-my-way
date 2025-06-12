import React from "react";
import Image from "next/image"
import Link from "next/link"

const HeaderAfterLogin = () => {
  return (
    <>
      {/* Navigation Bar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Link href="/" className="flex items-center">
                <div className="relative h-10 w-10 mr-2">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Care My Way Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <span className="text-teal-800 text-xl font-semibold">Care My Way</span>
              </Link>

              <nav className="hidden md:flex space-x-8">
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Dashboard
                </Link>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Health Care Quiz
                </Link>
                <Link href="/client/marketplace" className="text-teal-600 font-medium">
                  Find a Caregiver
                </Link>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Schedule
                </Link>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Messages
                </Link>
                <Link href="#" className="text-gray-600 hover:text-teal-600">
                  Settings
                </Link>
              </nav>
            </div>

            <button className="bg-teal-800 text-white px-6 py-2 rounded-full hover:bg-teal-900 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderAfterLogin;
