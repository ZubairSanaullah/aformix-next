import React from "react";
import { CheckCircle2, Cpu, Database, Terminal, Zap } from "lucide-react";
import { BsRobot } from "react-icons/bs";
import type { HeroVariant } from "@/constants/serviceNav";

interface ServiceHeroIllustrationProps {
  variant: HeroVariant;
}

const ServiceHeroIllustration: React.FC<ServiceHeroIllustrationProps> = ({ variant }) => {
  return (
    <div className="hero-right w-full h-full min-h-[400px]">
      {/* Animated Glowing Rings behind Orbit */}
      <div className="glowing-rings-container" aria-hidden="true">
        <div className="glowing-rings-inner">
          <div className="glowing-ring glowing-ring--1" />
        </div>
      </div>

      {/* Orbit Mascot Canvas Wrapper */}
      <div className="mascot-outer-container">
        <div className="mascot-wrapper">
          <video
            src="/vid/orbit2.mp4"
            className="mascot-video-element overflow-hidden object-cover"
            style={{ borderRadius: "30px" }}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            poster="/images/orbit-poster.webp"
          />
        </div>
      </div>

      {/* SVG Connection Nodes & Data Streams */}
      
      {/* <svg className="workflow-connections-svg" viewBox="0 0 500 500" aria-hidden="true">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#27b990" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#684b9e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#27b990" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        <path
          className="workflow-connector-line"
          d="M 90 310 C 120 280, 160 250, 210 240"
          fill="none"
          stroke="url(#lineGrad1)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        
        <path
          className="workflow-connector-line"
          d="M 400 130 C 370 170, 340 200, 290 220"
          fill="none"
          stroke="url(#lineGrad2)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        
        <path
          className="workflow-connector-line"
          d="M 390 380 C 340 370, 300 340, 260 280"
          fill="none"
          stroke="url(#lineGrad1)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
      </svg> */}

      {/* Floating UI Elements / Glassmorphism Cards */}

      {/* FLOATING CARD 1: Development Workflow */}
      <div className="floating-card-ui floating-card-ui--1">
        <div className="floating-card-hdr">
          <Terminal size={14} className="text-primary" />
          <span className="floating-card-title">Processing</span>
          <span className="pulse-indicator" />
        </div>
        <div className="workflow-steps">
          <div className="workflow-step active">
            <CheckCircle2 size={12} className="text-primary" />
            <span>Analyzing Request</span>
          </div>
          <div className="workflow-step-connector" />
          <div className="workflow-step processing">
            <Cpu size={12} className="text-secondary-color text-pulse" />
            <span>Processing Request</span>
          </div>
          <div className="workflow-step-connector" />
          <div className="workflow-step">
            <Database size={12} className="text-muted" />
            <span>Sending Response</span>
          </div>
        </div>
      </div>

      {/* FLOATING CARD 2: Network / Agent Status */}
      <div className="floating-card-ui floating-card-ui--2">
        <div className="agent-status-layout">
          <div className="agent-avatar-ring">
            <BsRobot size={16} className="text-white" />
          </div>
          <div className="agent-status-info">
            <span className="agent-status-label">Orbit Assistant</span>
            <span className="agent-status-message">Optimizing workflow...</span>
          </div>
        </div>
      </div>

      {/* FLOATING CARD 3: Performance Metric */}
      <div className="floating-card-ui floating-card-ui--3">
        <div className="metric-card-layout">
          <span className="metric-label">Efficiency Boost</span>
          <div className="metric-value-row">
            <span className="metric-value">+94%</span>
            <Zap size={14} className="text-primary fill-primary" />
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeroIllustration;
