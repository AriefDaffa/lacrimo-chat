"use server";

import { cookies } from "next/headers";
import type { ILoginForm } from "../_types/ILoginForm";

export const login = async (props: ILoginForm) => {
  const cookie = await cookies();

  const req = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: props.email,
      password: props.password,
    }),
  });

  const resp = await req.json();

  if (req.status < 300) {
    cookie.set("token", resp?.data?.token, {
      httpOnly: true,
      //   expires: 86400,
    });
  }

  return resp;
};
