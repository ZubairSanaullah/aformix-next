'use client';

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[99] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect rounded-2xl border border-[var(--color-glass-border)] p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          {/* Close button */}
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            aria-label="Close cookie consent"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="pr-8 md:pr-0">
            <h3 className="text-lg md:text-xl font-bold text-[var(--color-text)] mb-3">
              🍪 We Value Your Privacy
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm md:text-base leading-relaxed mb-6">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking "Accept", you consent to our use of cookies. You can learn more about our cookie usage in our
              <a href="/privacy-policy" className="text-[var(--color-primary)] hover:underline ml-1">Privacy Policy</a>.
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <button
                onClick={handleAccept}
                className="btn-primary flex-1 md:flex-none text-center"
              >
                Accept Cookies
              </button>
              <button
                onClick={handleDecline}
                className="btn-outline flex-1 md:flex-none text-center"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
