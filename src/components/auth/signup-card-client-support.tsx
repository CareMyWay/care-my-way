import Image from "next/image";
import OrangeButton from "../buttons/orange-button";
import { useRouter } from "next/navigation";

export function SignUpCardClientSupport() {
  const router = useRouter();

  return (
    <div className="bg-primary-white rounded-lg shadow-drop p-8 w-[360px]">
      <div className="mb-8">
        <Image
          src={"/svgs/client-signup/step1-need-cg.svg"}
          alt="need a care giver"
          className="mx-auto"
          width={150}
          height={150}
        />
      </div>

      <div className="my-4">
        <div>
          <h6 className="text-h6-size mb-4 text-center">I am a Client.</h6>
          <p className="mb-4 text-center">
            I am seeking care from trusted healthcare providers for myself.{" "}
          </p>
          <div className="flex flex-col items-center space-y-4 mt-auto">
            <OrangeButton
              className="text-center self-center min-w-[220px] mb-6"
              variant="action"
              onClick={() => router.push("/sign-up/register?userType=Client")}
            >
              Client
            </OrangeButton>
          </div>
        </div>
        <div className="mt-4">
          <h6 className="text-h6-size mb-4 text-center">
            I am a Support Person.
          </h6>
          <p className="mb-4 text-center">
            I am seeking care from trusted healthcare providers for a loved one
            or a client.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 mt-auto">
          <OrangeButton
            className="text-center self-center min-w-[220px] mb-2"
            variant="action"
            onClick={() => router.push("/sign-up/register?userType=Support")}
          >
            Support Person
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}
