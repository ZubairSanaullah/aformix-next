'use client';

import React from "react";
import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const WhatsAppBtn: React.FC = () => {
  return (
    <>
      <a
        href="https://wa.me/+923019170936"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("whatsapp_click", {
            location: "floating_button",
            destination: "whatsapp",
          })
        }
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 px-4 py-2 bg-white text-primary text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          Chat with us!
        </span>
      </a>
      {/* <Divider /> */}
    </>
  );
};

export default WhatsAppBtn;
