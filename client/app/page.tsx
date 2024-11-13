import { FiSend } from "react-icons/fi";
import Image from "next/image";

const Page = () => {
  return (
    <div className="flex w-full bg-c-gray">
      <div className="mx-auto h-screen w-full max-w-screen-xl bg-c-gray p-4">
        <div className="flex size-full gap-4">
          <div className="w-1/3 rounded-lg border bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-red-200">
                <Image
                  src={"/images/pp.jpg"}
                  alt=""
                  width={500}
                  height={500}
                  className="size-full object-cover"
                />
              </div>
              <div className="">
                <div className="text-base font-semibold">Fernando</div>
                <div className="text-sm text-c-gray-text">Available</div>
              </div>
            </div>
          </div>
          <div className="flex w-2/3 flex-col rounded-lg border bg-white">
            <div className="">
              <div className="flex items-center gap-4 border-b p-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-red-200">
                  <Image
                    src={"/images/pp.jpg"}
                    alt=""
                    width={500}
                    height={500}
                    className="size-full object-cover"
                  />
                </div>
                <div className="">
                  <div className="text-base font-semibold">Alnando</div>
                  <div className="text-sm text-c-gray-text">Available</div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-scroll px-4">
              <div className="">1</div>
            </div>
            <div className="flex items-center gap-4 border-t p-4">
              <div className="flex-1">
                <input
                  className="size-full rounded-full bg-c-gray px-4 py-3 outline-none"
                  type="text"
                  placeholder="Write a message..."
                />
              </div>
              {/* <div className="">1</div> */}
              <div className="flex cursor-pointer items-center justify-center rounded-full bg-blue-600 p-3 text-white">
                <FiSend className="mt-[1px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
