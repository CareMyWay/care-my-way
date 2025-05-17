export default function SignUpStep3({ voidNext }: { voidNext?: () => void }) {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-center mt-32">
        <h6>Verify your Account</h6>
        <p className="text-center">
          Enter the six digit code we sent to your email address to verify your{" "}
          <br /> new Care My Way Account
        </p>
        <div className="flex flex-row w-full justify-center gap-6 mt-6">
          <input id="idx1" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx2" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx3" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx4" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx5" type="text" className="std-input px-3.5 w-[40px]" />
          <input id="idx6" type="text" className="std-input px-3.5 w-[40px]" />
        </div>

        <div className="my-12">
          <button
            className=" s-btn orange-button self-center min-w-[220px] mb-4"
            onClick={voidNext}
          >
            CONTINUE
          </button>
        </div>

        <div className="space-y-8">
          <p className="underline self-center ">Resend Code</p>
        </div>
      </div>
    </>
  );
}
