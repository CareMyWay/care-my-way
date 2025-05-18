import { SignUpHalfCard_needCG } from "@/components/auth/sign-up-half-card-need-cg";
import { SignUpHalfCard_asCG } from "@/components/auth/sign-up-half-card-as-a-cg";

import type React from "react";

export default function SignUpSelectLanguage({
  voidNext,
}: {
  voidNext?: () => void;
}) {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-center mt-32">
        <h6>Select your Language Preferences</h6>
        <div className="flex flex-col justify-center w-[458px] gap-6">
          <label htmlFor="Language" className="block text-darkest-green">
            Language
          </label>
          <select className="std-input">
            <option>Language opt 1</option>
            <option>Language opt 2</option>
            <option>Language opt 3</option>
            <option>Language opt 4</option>
            <option>Language opt 5</option>
            <option>Language opt 6</option>
          </select>
        </div>

        <div className="my-12">
          <button
            className=" s-btn orange-button self-center min-w-[220px] mb-4"
            onClick={voidNext}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </>
  );
}
