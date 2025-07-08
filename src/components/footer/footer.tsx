import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-darkest-green text-primary-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          {/* Company Info */}
          <div className="lg:col-span-2 lg:pr-8">
            <div className="flex items-center mb-8">
              <Image
                src="/svgs/CMW_Logo.svg"
                alt="Care My Way Logo"
                width={40}
                height={40}
                className="mr-4"
              />
              <h3 className="text-h5-size font-weight-bold text-primary-white">
                Care My Way
              </h3>
            </div>
            <p className="text-body5-size text-light-green mb-8 leading-relaxed">
              Connecting patients with qualified healthcare providers for personalized, compassionate care in the comfort of your home.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-medium-green text-body5-size font-weight-semibold mr-3 mt-0.5">Email:</span>
                <a 
                  href="mailto:support@caremyway.com" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size"
                >
                  support@caremyway.com
                </a>
              </div>
              <div className="flex items-start">
                <span className="text-medium-green text-body5-size font-weight-semibold mr-3 mt-0.5">Phone:</span>
                <a 
                  href="tel:+18002273929" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size"
                >
                  1-800-CARE-WAY (227-3929)
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-h6-size font-weight-semibold text-primary-white mb-8">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/marketplace" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1"
                >
                  Find Providers
                </Link>
              </li>
              <li>
                <Link 
                  href="/sign-up" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-h6-size font-weight-semibold text-primary-white mb-8">
              Our Services
            </h4>
            <ul className="space-y-4">
              <li>
                <span className="text-light-green text-body5-size block py-1">
                  Home Healthcare
                </span>
              </li>
              <li>
                <span className="text-light-green text-body5-size block py-1">
                  Personal Care
                </span>
              </li>
              <li>
                <span className="text-light-green text-body5-size block py-1">
                  Medical Assistance
                </span>
              </li>
              <li>
                <span className="text-light-green text-body5-size block py-1">
                  Companion Care
                </span>
              </li>
              <li>
                <span className="text-light-green text-body5-size block py-1">
                  Specialized Care
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-h6-size font-weight-semibold text-primary-white mb-8">
              Legal & Support
            </h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/accessibility" 
                  className="text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-medium-green mt-16 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-light-green text-body5-size">
              <p>&copy; 2025 Care My Way. All rights reserved.</p>
            </div>
            
            {/* Emergency Notice */}
            <div className="text-center md:text-right">
              <p className="text-primary-orange text-body5-size font-weight-semibold mb-2">
                Emergency? Call 911 immediately
              </p>
              <p className="text-light-green text-sm">
                This service is not for medical emergencies
              </p>
            </div>
          </div>
          
          {/* Additional Disclaimer */}
          <div className="mt-10 pt-8 border-t border-medium-green">
            <p className="text-light-green text-sm text-center leading-relaxed max-w-4xl mx-auto">
              Care My Way connects patients with independent healthcare providers. We do not provide medical services directly. 
              All healthcare providers are independently licensed and responsible for their own services.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}