"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Chatbot } from "@/lib/types";
import { logEvent } from "@/lib/analytics";
import { ChatLauncher } from "./ChatLauncher";
import { ChatPanel } from "./ChatPanel";

type ChatControls = {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatControls | null>(null);

export function useChat(): ChatControls {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within <ChatProvider>");
  return ctx;
}

export function ChatProvider({
  chatbot,
  children,
}: {
  chatbot: Chatbot;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openChat = useCallback(() => {
    setOpen((wasOpen) => {
      if (!wasOpen) logEvent("chat_opened");
      return true;
    });
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);

  const value = useMemo<ChatControls>(
    () => ({ open, openChat, closeChat }),
    [open, openChat, closeChat],
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
      {!open && <ChatLauncher onOpen={openChat} />}
      {open && <ChatPanel chatbot={chatbot} onClose={closeChat} />}
    </ChatContext.Provider>
  );
}
