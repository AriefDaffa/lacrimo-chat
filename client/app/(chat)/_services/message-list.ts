export const messageList = async () => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/rooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};
