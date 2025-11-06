// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { Eye, EyeOff } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useActionState } from "react";
// import { useFormStatus } from "react-dom";
// import OrangeButton from "@/components/buttons/orange-button";
// import { handleSignIn, handleCustomChallenge } from "@/actions/cognitoActions";
// import CMWStackedHeader from "../headers/cmw-stacked-header";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// export default function LoginForm() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [state, dispatch] = useActionState(handleSignIn, undefined);
//   const { executeRecaptcha } = useGoogleReCaptcha();

//   useEffect(() => {
//     // Redirect if state is a string URL
//     if (typeof state === "string" && state.startsWith("/")) {
//       router.push(state);
//     }

//     // Handle CUSTOM_CHALLENGE
//     if (
//       state &&
//       typeof state === "object" &&
//       state.step === "CUSTOM_CHALLENGE" &&
//       executeRecaptcha
//     ) {
//       (async () => {
//         const token = await executeRecaptcha("login");
//         const result = await handleCustomChallenge(token, state.user);
//         if (typeof result === "string" && result.startsWith("/")) {
//           router.push(result);
//         }
//       })();
//     }
//   }, [state, router, executeRecaptcha]);

//   return (
//     <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 my-10">
//       <form
//         action={dispatch}
//         className="w-full max-w-xl space-y-6 md:bg-white rounded-2xl md:px-6 md:py-12 md:shadow-2xl "
//       >
//         <CMWStackedHeader title="Login to Care My Way" />

//         <p className="text-center text-base sm:text-lg text-darkest-green">
//           Please login to your account to continue.
//         </p>

//         <div className="space-y-5">
//           {/* Email */}
//           <div className="space-y-2">
//             <label
//               htmlFor="email"
//               className="text-darkest-green mb-3 mt-5 std-form-label"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="text"
//               placeholder="Email"
//               className="std-form-input w-full"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="space-y-2">
//             <label
//               htmlFor="password"
//               className="text-darkest-green mb-3 mt-5 std-form-label"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 className="std-form-input w-full pr-10"
//                 minLength={8}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 tabIndex={-1}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Error */}
//           {state && !state.startsWith("/") && (
//             <p
//               className="text-sm text-red-700"
//               aria-live="polite"
//               aria-atomic="true"
//             >
//               {state}
//             </p>
//           )}

//           {/* Forgot password */}
//           <div className="text-right">
//             <Link
//               href="/forgot-password"
//               className="text-sm text-darkest-green hover:underline"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           {/* Login button */}
//           <LoginButton />
//         </div>

//         {/* Divider */}
//         <div className="text-center">
//           <p className="text-gray-500 text-sm">— OR —</p>
//         </div>

//         {/* Google Login */}
//         <div className="flex justify-center">
//           <button className="transparent-button w-full sm:w-auto rounded-full flex flex-row items-center justify-center font-bold px-6 py-3 gap-2 border border-gray-400">
//             <Image
//               src="/svgs/icon-google.svg"
//               alt="Sign in with Google Button"
//               width={20}
//               height={20}
//             />
//             Sign in with Google
//           </button>
//         </div>

//         {/* Sign up link */}
//         <div className="text-center">
//           <p className="text-sm sm:text-base">
//             Don&apos;t have an account?{" "}
//             <Link href="/sign-up/user" className="underline">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </form>
//     </main>
//   );
// }

// function LoginButton() {
//   const { pending } = useFormStatus();

//   return (
//     <OrangeButton
//       variant="action"
//       type="submit"
//       className="mt-4 w-full"
//       aria-disabled={pending}
//     >
//       {pending ? "Logging in..." : "Login"}
//     </OrangeButton>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import OrangeButton from "@/components/buttons/orange-button";
import { handleSignIn, handleCustomChallenge } from "@/actions/cognitoActions";
import CMWStackedHeader from "../headers/cmw-stacked-header";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch] = useActionState(handleSignIn, undefined);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isProcessingChallenge, setIsProcessingChallenge] = useState(false);

  useEffect(() => {
    if (!state) return;

    // Redirect if state is a string URL
    if (typeof state === "string" && state.startsWith("/")) {
      router.push(state);
    }

    // Handle CUSTOM_CHALLENGE
    if (
      typeof state === "object" &&
      state.step === "CUSTOM_CHALLENGE" &&
      executeRecaptcha &&
      !isProcessingChallenge
    ) {
      (async () => {
        try {
          setIsProcessingChallenge(true);
          const token = await executeRecaptcha("login");
          const result = await handleCustomChallenge(token, state.user);
          if (typeof result === "string" && result.startsWith("/")) {
            router.push(result);
          }
        } catch (err) {
          console.error("Error processing custom challenge:", err);
        } finally {
          setIsProcessingChallenge(false);
        }
      })();
    }
  }, [state, router, executeRecaptcha, isProcessingChallenge]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 my-10">
      <form
        action={dispatch}
        className="w-full max-w-xl space-y-6 md:bg-white rounded-2xl md:px-6 md:py-12 md:shadow-2xl"
      >
        <CMWStackedHeader title="Login to Care My Way" />

        <p className="text-center text-base sm:text-lg text-darkest-green">
          Please login to your account to continue.
        </p>

        <div className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-darkest-green mb-3 mt-5 std-form-label"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="Email"
              className="std-form-input w-full"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-darkest-green mb-3 mt-5 std-form-label"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="std-form-input w-full pr-10"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {state && typeof state === "string" && !state.startsWith("/") && (
            <p
              className="text-sm text-red-700"
              aria-live="polite"
              aria-atomic="true"
            >
              {state}
            </p>
          )}

          {/* Forgot password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-darkest-green hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login button */}
          <LoginButton pending={isProcessingChallenge} />
        </div>

        {/* Divider */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">— OR —</p>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <button className="transparent-button w-full sm:w-auto rounded-full flex flex-row items-center justify-center font-bold px-6 py-3 gap-2 border border-gray-400">
            <Image
              src="/svgs/icon-google.svg"
              alt="Sign in with Google Button"
              width={20}
              height={20}
            />
            Sign in with Google
          </button>
        </div>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm sm:text-base">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up/user" className="underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}

function LoginButton({ pending }: { pending?: boolean }) {
  const { pending: formPending } = useFormStatus();

  return (
    <OrangeButton
      variant="action"
      type="submit"
      className="mt-4 w-full"
      aria-disabled={pending || formPending}
    >
      {pending || formPending ? "Logging in..." : "Login"}
    </OrangeButton>
  );
}
