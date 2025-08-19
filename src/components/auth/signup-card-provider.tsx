import Image from "next/image";
import OrangeButton from "../buttons/orange-button";
import { useRouter } from "next/navigation";

export function SignUpCardProvider() {
  const router = useRouter();

  return (
    <div className="bg-primary-white rounded-xl shadow-drop p-6 sm:p-8 w-full sm:w-[320px] md:w-[360px] flex flex-col">
      <div className="mb-6 md:mb-16">
        <Image
          src={"/svgs/client-signup/step1-as-cg.svg"}
          alt="Healthcare Provider"
          className="mx-auto"
          width={150}
          height={150}
        />
      </div>

      <div className="flex flex-col flex-grow">
        <h6 className="text-lg sm:text-xl font-semibold mb-4 text-center">
          I am a Healthcare Provider.
        </h6>
        <p className="mb-6 text-center text-sm sm:text-base">
          I want to join a community of healthcare providers and connect
          directly with families in need of care.
        </p>
        <div className="flex flex-col items-center mt-auto">
          <OrangeButton
            className="min-w-[200px] sm:min-w-[220px]"
            onClick={() => router.push("/sign-up/register?userType=Provider")}
            variant="action"
          >
            Provider
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}
