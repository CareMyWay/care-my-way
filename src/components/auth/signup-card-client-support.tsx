import Image from "next/image";
import OrangeButton from "../buttons/orange-button";
import { useRouter } from "next/navigation";

export function SignUpCardClientSupport() {
  const router = useRouter();

  return (
    <div className="bg-primary-white rounded-xl shadow-drop p-6 sm:p-8 w-full sm:w-[320px] md:w-[360px] flex flex-col">
      <div className="mb-6 md:mb-16">
        <Image
          src={"/svgs/client-signup/step1-need-cg.svg"}
          alt="Client"
          className="mx-auto"
          width={150}
          height={150}
        />
      </div>

      <div className="flex flex-col flex-grow">
        <h6 className="text-lg sm:text-xl font-semibold mb-4 text-center">
          I am a Client or Support Person.
        </h6>
        <p className="mb-6 text-center text-sm sm:text-base">
          I am seeking care from trusted healthcare providers for myself or a
          loved one.
        </p>
        <div className="flex flex-col items-center mt-auto">
          <OrangeButton
            className="min-w-[200px] sm:min-w-[220px]"
            variant="action"
            onClick={() => router.push("/sign-up/register?userType=Client")}
          >
            Client
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}
