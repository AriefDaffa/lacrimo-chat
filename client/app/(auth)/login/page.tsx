import Flexer from "@/app/_components/Flexer";
import LoginForm from "./_components/LoginForm";
import LoginHeader from "./_components/LoginHeader";

const Page = () => {
  return (
    <div className="w-full max-w-[520px] rounded-lg bg-white p-4">
      <Flexer gap="4">
        <LoginHeader />
        <LoginForm />
      </Flexer>
    </div>
  );
};

export default Page;
