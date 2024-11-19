import LeftSection from "./_components/LeftSection";
import RightSection from "./_components/RightSection";

const Page = () => {
  return (
    <div className="flex h-full gap-4">
      <div className="w-1/3">
        <LeftSection />
      </div>
      <div className="w-2/3">
        <RightSection />
      </div>
    </div>
  );
};

export default Page;
