import type { FC } from "react";
import type { IMessage } from "../../_types/IMessage";
import type { IUser } from "../../_types/IUser";
import BlueBubble from "@/app/_components/ChatBubble/BlueBubble";
import GrayBubble from "@/app/_components/ChatBubble/GrayBubble";

interface ChatProps {
  profile: IUser | null;
  oldMsg: IMessage[];
  currentMsg: IMessage[];
}

const Chat: FC<ChatProps> = ({ profile, oldMsg, currentMsg }) => {
  return (
    <div className="flex-1 overflow-auto px-4">
      <div className="flex flex-col gap-2 pb-2">
        {oldMsg.map((item, id) =>
          item.senderID !== Number(profile?.id) ? (
            <GrayBubble key={`${item.message}-${id}`} message={item.message} />
          ) : (
            <BlueBubble key={`${item.message}-${id}`} message={item.message} />
          ),
        )}
        {currentMsg
          .filter((item) => item.senderID)
          .map((item, id) =>
            item.senderID !== Number(profile?.id) ? (
              <GrayBubble
                key={`${item.message}-${id}`}
                message={item.message}
              />
            ) : (
              <BlueBubble
                key={`${item.message}-${id}`}
                message={item.message}
              />
            ),
          )}
      </div>
    </div>
  );
};

export default Chat;
