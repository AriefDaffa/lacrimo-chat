export const searchUser = async (keyword: string) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/v1/user/search?q=${keyword}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
};
