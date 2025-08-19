import Link from "next/link";
import Image from "next/image";

const linkClasses =
  "text-light-green hover:text-primary-white transition-colors underline-overlap text-body5-size block py-1";

const sections = [
  {
    title: "Quick Links",
    items: [
      { label: "Home", href: "/" },
      { label: "Find Providers", href: "/marketplace" },
      { label: "Sign Up", href: "/sign-up/user" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Our Services",
    items: [
      { label: "Home Healthcare" },
      { label: "Personal Care" },
      { label: "Medical Assistance" },
      { label: "Companion Care" },
      { label: "Specialized Care" },
    ],
  },
  //   {
  //     // title: "Legal & Support",
  //     title: "Support",
  //     items: [
  //       { label: "Privacy Policy", href: "/privacy-policy" },
  //       { label: "Terms of Service", href: "/terms-of-service" },
  //       { label: "Help Center", href: "/support" },
  //       { label: "Contact Us", href: "/contact" },
  //       { label: "Accessibility", href: "/accessibility" },
  //     ],
  //   },
];

type FooterSectionItem = {
  label: string;
  href?: string;
};

function FooterSection({
  title,
  items,
}: {
  title: string;
  items: FooterSectionItem[];
}) {
  return (
    <div>
      <h4 className="text-h6-size font-weight-semibold text-primary-white mb-8">
        {title}
      </h4>
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.href ? (
              <Link href={item.href} className={linkClasses}>
                {item.label}
              </Link>
            ) : (
              <span className="text-light-green text-body5-size block py-1">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomeFooter() {
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
              <h3 className="text-h5-size font-weight-bold">Care My Way</h3>
            </div>
            <p className="text-body5-size text-light-green mb-8 leading-relaxed">
              Connecting patients with qualified healthcare providers for
              personalized, compassionate care in the comfort of your home.
            </p>
            <div className="space-y-4">
              {[
                {
                  label: "Email:",
                  value: "caremyway.yyc@gmail.com",
                  href: "mailto:caremyway.yyc@gmail.com",
                },
                // {
                //   label: "Phone:",
                //   value: "1-800-CARE-WAY (227-3929)",
                //   href: "tel:+18002273929",
                // },
              ].map(({ label, value, href }, idx) => (
                <div className="flex items-start" key={idx}>
                  <span className="text-medium-green text-body5-size font-weight-semibold mr-3 mt-0.5">
                    {label}
                  </span>
                  <a href={href} className={linkClasses}>
                    {value}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section, idx) => (
            <FooterSection key={idx} {...section} />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-medium-green mt-16 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-light-green text-body5-size">
              &copy; 2025 Care My Way. All rights reserved.
            </p>

            <div className="text-center md:text-right">
              <p className="text-primary-orange text-body5-size font-weight-semibold mb-2">
                Emergency? Call 911 immediately
              </p>
              <p className="text-light-green text-sm">
                This service is not for medical emergencies
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-medium-green">
            <p className="text-light-green text-sm text-center leading-relaxed max-w-4xl mx-auto">
              Care My Way connects patients with independent healthcare
              providers. We do not provide medical services directly. All
              healthcare providers are independently licensed and responsible
              for their own services.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
