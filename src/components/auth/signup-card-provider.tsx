import Image from "next/image";
import OrangeButton from "../buttons/orange-button";
import { useRouter } from "next/navigation";

export function SignUpCardProvider() {
  const router = useRouter();

  return (
    <div className="bg-primary-white rounded-lg shadow-drop p-8 w-[360px]">
      <div className="mb-8 md:mb-24">
        <Image
          src={"/svgs/client-signup/step1-as-cg.svg"}
          alt="Healthcare Provider"
          className="mx-auto"
          width={150}
          height={150}
        />
      </div>

      <div className="justify-center items-center">
        <h6 className="text-h6-size mb-4 text-center">
          I am a Healthcare Provider.
        </h6>
        <p className="mb-4 text-center">
          I want to join a community of healthcare providers and connect
          directly with families in need of care.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4 mt-10">
        <OrangeButton
          className="text-center s-btn orange-button self-center min-w-[220px] mb-4"
          onClick={() => router.push("/sign-up/register?userType=Provider")}
          variant="action"
        >
          Provider
        </OrangeButton>
      </div>
    </div>
  );
}
