"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { isEmpty } from "lodash";

import Button from "@/app/_components/Button";
import Flexer from "@/app/_components/Flexer";
import Input from "@/app/_components/Input";
import Label from "@/app/_components/Label";
import ErrorAlert from "@/app/_components/alert/ErrorAlert";
import useLogin from "../_hooks/useLogin";
import type { ILoginForm } from "../_types/ILoginForm";

const LoginForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>();
  const { loginFunc, errMsg, isLoading } = useLogin();

  const onSubmit: SubmitHandler<ILoginForm> = (data) => {
    loginFunc(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flexer gap="4">
        <Flexer gap="2">
          <Flexer className="gap-1">
            <Label text="Email" />
            <Input
              {...register("email", {
                required: {
                  value: true,
                  message: "Email required",
                },
              })}
              errMsg={errors.email?.message || ""}
              type="email"
              placeholder="Enter your email"
            />
          </Flexer>
          <Flexer className="gap-1">
            <Label text="Password" />
            <Input
              {...register("password", {
                required: {
                  value: true,
                  message: "Password required",
                },
                minLength: {
                  value: 8,
                  message: "Minimum 8 character",
                },
              })}
              errMsg={errors.password?.message || ""}
              type="password"
              placeholder="Enter your password"
            />
          </Flexer>
        </Flexer>
        {errMsg !== "" && <ErrorAlert>{errMsg}</ErrorAlert>}
        <Button
          disabled={isLoading || !isEmpty(errors)}
          type="submit"
          text={isLoading ? "Loading..." : "Submit"}
        />
        <div className="text-center text-sm text-c-gray-text">
          Doesn&apos;t have an account?{" "}
          <Link
            href={"/register"}
            className="cursor-pointer font-semibold text-blue-500 underline"
          >
            Register
          </Link>
        </div>
      </Flexer>
    </form>
  );
};

export default LoginForm;
