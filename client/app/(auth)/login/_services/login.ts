"use client";

import type { ILoginForm } from "../_types/ILoginForm";

export const login = async (props: ILoginForm) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: props.email,
      password: props.password,
    }),
  });
};
