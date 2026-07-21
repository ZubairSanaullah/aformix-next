'use client';

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import {
  Maximize,
  Minus,
  Send,
  X,
  ChevronDown,
} from "lucide-react";
import { BsRobot } from "react-icons/bs";
import { FaRobot } from "react-icons/fa6";

type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
  isTyping?: boolean;
};

const createMessageId = (() => {
  let counter = 0;
  return () => `orbit-${++counter}`;
})();

const friendlyGreeting = `Welcome to Aformix 👋
I'm Orbit AI, your AI Assistant. How can I help you today?`;

const MessageBubble: React.FC<{
  message: ChatMessage;
  isLight: boolean;
  onTypingComplete: (id: string) => void;
  onTypingStep?: () => void;
}> = React.memo(({ message, isLight, onTypingComplete, onTypingStep }) => {
  const [displayedText, setDisplayedText] = useState(message.isTyping ? "" : message.content);

  useEffect(() => {
    if (!message.isTyping) {
      setDisplayedText(message.content);
      return;
    }

    const chars = Array.from(message.content);
    let index = 0;
    setDisplayedText("");
    
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + (chars[index] || ""));
      index++;
      if (onTypingStep) onTypingStep();
      if (index >= chars.length) {
        clearInterval(timer);
        onTypingComplete(message.id);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [message.content, message.isTyping, message.id, onTypingComplete, onTypingStep]);

  return (
    <div
      className={`rounded-3xl p-3 md:p-4 mb-3 md:mb-4 max-w-[85%] md:max-w-[90%] text-sm md:text-base ${
        message.role === "assistant"
          ? isLight
            ? "bg-slate-100/90 text-slate-900"
            : "bg-slate-900/80 text-slate-100"
          : isLight
          ? "bg-slate-200 text-slate-900 self-end"
          : "bg-white/10 text-white self-end"
      }`}
    >
      <p className="whitespace-pre-line leading-6">
        {displayedText}
        {message.isTyping && displayedText.length < message.content.length && (
          <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-current animate-pulse" />
        )}
      </p>
    </div>
  );
});

const OrbitAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          const saved = localStorage.getItem(`orbit_chat_${user.email}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed.map((m: ChatMessage) => ({ ...m, isTyping: false }));
            }
          }
        }
      }
    } catch (_) {}
    return [{
      id: "orbit-1",
      role: "assistant",
      content: friendlyGreeting,
      isTyping: true,
    }];
  });
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<"idle" | "typing" | "success" | "error">("idle");
  const { theme } = useTheme();
  const isLight = theme === "light";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = React.useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 30);
    }
  }, []);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          localStorage.setItem(`orbit_chat_${user.email}`, JSON.stringify(messages));
        }
      }
    } catch (_) {}
  }, [messages]);

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.email) {
            const saved = localStorage.getItem(`orbit_chat_${user.email}`);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setMessages(parsed.map((m: ChatMessage) => ({ ...m, isTyping: false })));
                return;
              }
            }
          }
        }
        setMessages([{
          id: "orbit-1",
          role: "assistant",
          content: friendlyGreeting,
          isTyping: true,
        }]);
      } catch (_) {}
    };

    window.addEventListener("authStateChange", handleAuthChange);
    return () => window.removeEventListener("authStateChange", handleAuthChange);
  }, []);

  const handleTypingComplete = React.useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isTyping: false } : m)));
  }, []);

  const orbitTheme = {
    panel: isLight
      ? "border-slate-200/40 bg-white/90 text-slate-900 shadow-[0_32px_90px_rgba(15,23,42,0.18)]"
      : "border-white/10 bg-[rgba(15,23,42,0.94)] text-white shadow-[0_32px_90px_rgba(0,0,0,0.35)]",
    surface: isLight
      ? "border-slate-200/40 bg-slate-100/90 text-slate-900 shadow-slate-200/10"
      : "border-white/10 bg-white/5 text-white shadow-black/10",
    input: isLight
      ? "border-slate-200 bg-white text-slate-900 placeholder:text-slate-500"
      : "border-white/10 bg-slate-950/70 text-white placeholder:text-slate-400",
    buttonSurface: isLight
      ? "bg-slate-900 text-white border-slate-200"
      : "bg-primary text-white border-transparent",
    tabActive: isLight
      ? "bg-slate-900 text-white"
      : "bg-white/10 text-white",
    tabInactive: isLight
      ? "bg-slate-100 text-slate-700"
      : "bg-white/5 text-slate-300",
    panelHeading: isLight
      ? "border-slate-200/30 bg-white/90 text-slate-900"
      : "border-white/10 text-white",
    bubbleButton: isLight
      ? "border-white/50 bg-linear-to-br from-primary to-emerald-400 text-white shadow-[0_20px_50px_rgba(49,185,143,0.35)]"
      : "border-white/15 bg-linear-to-br from-primary to-secondary text-white shadow-[0_30px_60px_rgba(0,0,0,0.45)]",
    fullScreenButton: isLight
      ? "border-white/60 bg-white/95 text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.15)] hover:bg-white hover:scale-105"
      : "border-white/10 bg-slate-900/80 text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:bg-slate-800/90 hover:scale-105 hover:border-white/20",
  };

  const orbitTransition = { type: "spring" as const, stiffness: 280, damping: 24, mass: 0.8 };

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      if (messages.length === 1) {
        setMessages((prev) => [
          ...prev,
          {
            id: `orbit-welcome`,
            role: "assistant",
            content: `Need a website or custom software? I can help you find the right services.`,
            isTyping: true,
          },
        ]);
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [isOpen, messages.length]);

  useEffect(() => {
    const handleOpenOrbitAI = () => {
      setShowWidget(true);
      setIsOpen(true);
      setIsMobileView(window.innerWidth < 768);
      setStatus("idle");
    };

    window.addEventListener("open-orbit-ai", handleOpenOrbitAI);
    return () => window.removeEventListener("open-orbit-ai", handleOpenOrbitAI);
  }, []);

  const latestMessage = messages[messages.length - 1];

  // Force fixed offsets for the floating Orbit controls on all screens
  const FIXED_RIGHT = "120px";
  const FIXED_BOTTOM = "24px";

  const handleOpen = (mobileView = false) => {
    setShowWidget(true);
    setIsOpen(true);
    setIsMobileView(mobileView);
    setStatus("idle");
  };

  const openPanel = () => handleOpen(window.innerWidth < 768);
  const openMobilePanel = () => handleOpen(true);

  const handleMinimize = () => {
    setIsOpen(false);
  };

  const handleClose = () => {
    setShowConfirmClose(true);
  };

  const confirmClose = () => {
    setShowWidget(false);
    setIsOpen(false);
    setIsMobileView(false);
    setShowConfirmClose(false);
  };

  const cancelClose = () => {
    setShowConfirmClose(false);
  };

  // Remove addMessage function as it is not used in the component

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const conversationWindow = [...messages, userMessage].slice(-8);
    setInputValue("");
    setStatus("typing");

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    const apiUrl = baseApiUrl.includes("vercel.app") && !baseApiUrl.includes("/_/backend") 
      ? `${baseApiUrl}/_/backend` 
      : baseApiUrl;

    try {
      const response = await fetch(`${apiUrl}/api/orbit/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.content, conversation: conversationWindow }),
      });

      const text = await response.text();
      let data: { response?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.warn("Orbit AI response was not valid JSON:", parseError);
      }

      const assistantText =
        data.response ||
        text ||
        "I’m processing your request and will respond shortly.";

      setMessages((prev) => [...prev, { id: createMessageId(), role: "assistant", content: assistantText, isTyping: true }]);
      setStatus("success");
    } catch (error) {
      const messageStr =
        error instanceof Error ? error.message : "Orbit AI is temporarily unavailable. Please try again or ask a quick question.";
      setStatus("error");
      setMessages((prev) => [
        ...prev,
        { id: createMessageId(), role: "assistant", content: messageStr, isTyping: true },
      ]);
    }
  };

  const quickReplies = [
    "Show me your web development case studies",
    "I need a new website for my business",
    "What services do you offer?",
  ];

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      <AnimatePresence>
        {showWidget && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={orbitTransition}
            style={isMobileView ? undefined : { right: FIXED_RIGHT }}
            className={`fixed ${isMobileView ? "inset-0" : "top-[140px] md:bottom-24 md:top-auto right-4 md:right-[20%]"} z-[1000] ${isMobileView ? "w-screen h-screen max-h-none rounded-none overflow-hidden" : "w-[calc(100vw-2rem)] md:w-[min(420px,calc(100vw-2rem))] max-h-[calc(100vh-200px)] md:max-h-none rounded-3xl md:rounded-4xl border"} backdrop-blur-2xl overflow-hidden ${orbitTheme.panel}`}
          >
            <div className={`flex items-center justify-between gap-3 md:gap-4 border-b px-3 md:px-5 py-3 md:py-4 ${isLight ? "border-slate-200/40" : "border-white/10"}`}>
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className="flex h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-3xl bg-linear-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20 shrink-0">
                  <BsRobot className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary/90 truncate">Orbit AI</p>
                  <h3 className="text-base md:text-lg font-semibold text-white truncate">Your AI Growth Partner</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                {!isMobileView && (
                  <button
                    type="button"
                    onClick={openMobilePanel}
                    className={`hidden md:inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition cursor-pointer ${isLight
                        ? "text-slate-700 border-slate-200/60 bg-slate-100 hover:bg-slate-200"
                        : "text-slate-200 border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    aria-label="Open Orbit AI in smaller screen mode"
                  >
                    <Maximize size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleMinimize}
                  className={`flex h-9 md:h-10 w-9 md:w-10 items-center justify-center rounded-3xl border transition flex-shrink-0 cursor-pointer ${isLight ? "border-slate-200/40 bg-slate-100 text-slate-900 hover:bg-slate-200" : "border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                  aria-label="Minimize Orbit AI chat"
                >
                  <Minus size={16} className={`cursor-pointer ${isLight ? "text-slate-600 hover:text-slate-800" : "text-slate-400 hover:text-slate-200"}`} />
                </button>
                <button
                  onClick={handleClose}
                  className={`flex h-9 md:h-10 w-9 md:w-10 items-center justify-center rounded-3xl border transition flex-shrink-0 cursor-pointer ${isLight ? "border-slate-200/40 bg-slate-100 text-slate-900 hover:bg-slate-200" : "border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                  aria-label="Close Orbit AI chat"
                >
                  <X
                    size={16}
                    className={`cursor-pointer ${isLight ? "text-rose-500 hover:text-rose-700" : "text-rose-400 hover:text-rose-200"}`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-0 p-3 md:p-5">
              <div className="col-span-12 space-y-3 md:space-y-4">
                  <div className="space-y-3 md:space-y-4">
                    <div className="relative">
                      <div 
                        ref={containerRef}
                        onScroll={handleScroll}
                        className={`max-h-64 md:max-h-105 overflow-y-auto rounded-[24px] md:rounded-[28px] border p-3 md:p-4 shadow-inner ${orbitTheme.surface}`}
                      >
                        {messages.map((message) => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isLight={isLight}
                            onTypingComplete={handleTypingComplete}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                      <AnimatePresence>
                        {showScrollButton && (
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            onClick={scrollToBottom}
                            className={`absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full shadow-lg z-10 cursor-pointer ${isLight ? "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50" : "bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700"}`}
                            aria-label="Scroll to bottom"
                          >
                            <ChevronDown size={20} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid gap-2 md:gap-3">
                      <div className="flex flex-wrap gap-2">
                        {quickReplies.map((reply) => (
                          <button
                            key={reply}
                            type="button"
                            onClick={() => handleQuickReply(reply)}
                            className={`rounded-full border px-3 md:px-4 py-2 text-xs font-semibold transition ${isLight
                                ? "border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200"
                                : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                              }`}
                          >
                            {reply}
                          </button>
                        ))}
                      </div>

                      <div className={`relative flex items-center gap-2 md:gap-3 rounded-[24px] md:rounded-[28px] border px-3 md:px-4 py-3 shadow-lg ${isLight ? "border-slate-200 bg-slate-100 text-slate-900 shadow-slate-200/20" : "border-white/10 bg-slate-950/70 text-white shadow-black/20"}`}>
                        <input
                          value={inputValue}
                          onChange={(event) => setInputValue(event.target.value)}
                          onKeyDown={(event) => event.key === "Enter" && handleSend()}
                          placeholder="Ask Orbit a question..."
                          className={`w-full text-xs md:text-sm outline-none ${orbitTheme.input}`}
                        />
                        <button
                          onClick={handleSend}
                          className={`${orbitTheme.buttonSurface} rounded-full px-3 md:px-4 py-2 text-xs font-semibold transition hover:opacity-95 shrink-0`}
                          aria-label="Send message"
                        >
                          <Send className="w-6 h-6 md:w-4 md:h-4 hover:scale-110 cursor-pointer" />
                        </button>
                      </div>

                      <div className={`flex items-center justify-between text-[0.7rem] md:text-[0.78rem] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        <span className="truncate">{status === "typing" ? "Orbit is thinking..." : "Instant recommendations powered by AI."}</span>
                        <span className="truncate text-right">{latestMessage.role === "assistant" ? "Ready to help." : "Awaiting your message."}</span>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWidget && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={orbitTransition}
            style={{ right: FIXED_RIGHT, bottom: FIXED_BOTTOM }}
            className="fixed bottom-24 md:bottom-8 right-4 md:right-[20%] z-[99] flex flex-col items-center gap-3"
          >
            <motion.div
              className="relative flex flex-col items-center"
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
            >
              <button
                type="button"
                onClick={handleClose}
                className="absolute -top-1 -right-1 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600 focus:outline-none cursor-pointer"
                aria-label="Close Orbit AI widget"
              >
                <X size={14} />
              </button>

              <button
                type="button"
                onClick={openPanel}
                className={`flex h-16 md:h-20 w-16 md:w-20 items-center justify-center rounded-full border transition focus:outline-none overflow-hidden ${orbitTheme.bubbleButton}`}
                aria-label="Open Orbit AI assistant"
              >
                <FaRobot size={40} />
              </button>
            </motion.div>

            <motion.button
              layout
              onClick={openMobilePanel}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition backdrop-blur-md ${orbitTheme.fullScreenButton}`}
              aria-label="Open Orbit AI in smaller screen mode"
            >
              <BsRobot size={14} />
              Enter Full Screen
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmClose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-3xl border shadow-2xl max-w-sm w-full mx-4 ${isLight ? "bg-white border-slate-200" : "bg-slate-900 border-white/10"}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                Close Orbit AI?
              </h3>
              <p className={`text-sm mb-6 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                Are you sure you want to close the Orbit AI widget?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelClose}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition cursor-pointer ${isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-300 hover:bg-white/10"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-full transition shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrbitAI;
