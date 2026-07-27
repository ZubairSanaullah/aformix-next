"use client";

import useReveal from "@/hooks/useReveal";
import { useLayoutEffect } from "react";

export default function RevealInitializer() {
  // Mark the document as JS-enabled before reveal logic runs so reveal
  // CSS is only applied when the client is active. Use layout effect
  // to ensure this runs before paint/hydration where possible.
  useLayoutEffect(() => {
    document.documentElement.classList.add("js");
    return () => document.documentElement.classList.remove("js");
  }, []);

  useReveal();

  return null;
}