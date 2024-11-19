export const currentUser = async () => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/user/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};
