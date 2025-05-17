import Link from "next/link"

export function SignUpCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl px-20">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Sign Up to Receive or Give Care</h1>

      <div className="space-y-8">
        <button className="w-full py-3 bg-[#1d3557] hover:bg-[#2a4a73] text-white font-medium rounded-2xl">
          <Link href="/signup/step2"><span className="font-bold">Join as a Patient</span></Link>
        </button>

        <button className="w-full py-3 bg-[#1d3557] hover:bg-[#2a4a73] text-white font-medium rounded-2xl">
          <Link href="/signup/step2"><span className="font-bold">Join as a Support Person</span></Link>
        </button>

        <button className="w-full py-3 bg-[#1d3557] hover:bg-[#2a4a73] text-white font-medium rounded-2xl">
          <Link href="/signup/step2"><span className="font-bold">Join as a Caregiver</span></Link>
        </button>
      </div>
    </div>
  )
}

