import type { IRegisterForm } from "../_types/IRegisterForm";

export const register = async (props: IRegisterForm) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: props.email,
      password: props.password,
      username: props.username,
    }),
  });
};
