import Flexer from "@/app/_components/Flexer";
import RegisterHeader from "./_components/RegisterHeader";
import RegisterForm from "./_components/RegisterForm";

const Page = () => {
  return (
    <div className="w-full max-w-[520px] rounded-lg bg-white p-4">
      <Flexer gap="4">
        <RegisterHeader />
        <RegisterForm />
      </Flexer>
    </div>
  );
};

export default Page;
