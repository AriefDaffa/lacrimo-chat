"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { isEmpty } from "lodash";

import Button from "@/app/_components/Button";
import Flexer from "@/app/_components/Flexer";
import Input from "@/app/_components/Input";
import Label from "@/app/_components/Label";
import ErrorAlert from "@/app/_components/alert/ErrorAlert";
import SuccessAlert from "@/app/_components/alert/SuccessAlert";
import useRegister from "../_hooks/useRegister";
import type { IRegisterForm } from "../_types/IRegisterForm";

const RegisterForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IRegisterForm>();
  const { registerFunc, errMsg, isLoading, isSuccess } = useRegister();

  const onSubmit: SubmitHandler<IRegisterForm> = (data) => {
    registerFunc(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flexer className="gap-4">
        <Flexer gap="2">
          <Flexer className="gap-1">
            <Label text="Username" />
            <Input
              {...register("username", {
                required: {
                  value: true,
                  message: "Username required",
                },
              })}
              errMsg={errors.username?.message || ""}
              type="text"
              placeholder="Enter your username"
            />
          </Flexer>
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
          <Flexer gap="1">
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
        {isSuccess && <SuccessAlert>Account created!</SuccessAlert>}
        <Button
          disabled={isLoading || !isEmpty(errors)}
          type="submit"
          text={isLoading ? "Loading..." : "Submit"}
        />
        <div className="text-center text-sm text-c-gray-text">
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="cursor-pointer font-semibold text-blue-500 underline"
          >
            Login
          </Link>
        </div>
      </Flexer>
    </form>
  );
};

export default RegisterForm;
