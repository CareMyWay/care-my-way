import { SignUpHalfCard_needCG } from "@/components/signup/sign-up-half-card-need-cg";
import { SignUpHalfCard_asCG } from "@/components/signup/sign-up-half-card-as-a-cg";

export default function SignUpStep1({ voidNext }: { voidNext: () => void }) {
  return (
    <div className="min-h-screen py-12 flex flex-col justify-center items-center">
      <div className="mb-6 px-4">
        <h6 className="text-h6-size text-medium text-center">
          What are you looking for? Pick an option.
        </h6>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 px-4 w-full max-w-5xl">
        <div className="flex">
          <SignUpHalfCard_needCG voidNext={voidNext} />
        </div>
        <div className="flex">
          <SignUpHalfCard_asCG voidNext={voidNext} />
        </div>
      </div>
    </div>
  );
}
