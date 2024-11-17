import Link from "next/link";
import { TbMessage2Bolt } from "react-icons/tb";

const Page = () => {
  return (
    <div className="w-full rounded-lg bg-white p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-min rounded-lg border-2 border-gray-200 p-2">
            <TbMessage2Bolt size={30} />
          </div>
          <div className="text-4xl font-semibold">Register</div>
          <div className="font-semibold text-c-gray-text">
            Create your account
          </div>
        </div>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="register-username"
                className="text-sm font-semibold"
              >
                Username
              </label>
              <input
                id="register-username"
                type="text"
                placeholder="Enter your username"
                className="rounded-lg border-2 border-gray-200 p-2 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="register-email" className="text-sm font-semibold">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                className="rounded-lg border-2 border-gray-200 p-2 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="rounded-lg border-2 border-gray-200 p-2 outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-500 p-2 font-semibold text-white"
          >
            Submit
          </button>
          <div className="text-center text-sm text-c-gray-text">
            Already have have an account?{" "}
            <Link
              href={"/login"}
              className="cursor-pointer font-semibold text-blue-500 underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
