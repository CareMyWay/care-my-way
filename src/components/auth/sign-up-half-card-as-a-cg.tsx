import Image from "next/image";
import OrangeButton from "../buttons/orange-button";

export function SignUpHalfCard_asCG({ voidNext }: { voidNext: () => void }) {
  return (
    <div className="bg-primary-white rounded-lg shadow-drop p-8 w-[360px]">
      <div className="mb-4">
        <Image
          src={"/svgs/client-signup/step1-as-cg.svg"}
          alt="as a care giver"
          className="mx-auto"
          width={150}
          height={150}
        />
      </div>

      <div className="my-10">
        <h6 className="text-h6-size mb-4 text-center">
          I am a Healthcare Provider providing care.
        </h6>
        <p className="mb-4 text-center">
          Join our community of healthcare providers and connect directly with
          families in need of care.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4 md:mt-16">
        <OrangeButton
          className="text-center s-btn orange-button self-center min-w-[220px] mb-4"
          label="Provider"
          href="#"
          onClick={voidNext}
          type="button"
          variant="action"
        />
      </div>
    </div>
  );
}
