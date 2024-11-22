export const connectChatSocket = async (id: number) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/v1/message?id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
};
