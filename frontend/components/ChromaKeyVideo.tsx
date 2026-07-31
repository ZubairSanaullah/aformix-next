'use client';

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface ChromaKeyVideoProps {
  src: string;
  fallbackSrc: string;
  className?: string;
}

const ChromaKeyVideo: React.FC<ChromaKeyVideoProps> = ({ src, fallbackSrc, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameId = useRef<number | null>(null);
  const lastProcessedTime = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const offscreen = document.createElement("canvas");
    offscreenCanvasRef.current = offscreen;

    let width = 0;
    let height = 0;

    const processFrame = () => {
      if (video.paused || video.ended) {
        animationFrameId.current = requestAnimationFrame(processFrame);
        return;
      }

      // Optimization: Only process if the video has actually advanced a frame
      if (video.currentTime === lastProcessedTime.current) {
        animationFrameId.current = requestAnimationFrame(processFrame);
        return;
      }

      // Trigger restart transition effect when video loops
      if (video.currentTime < lastProcessedTime.current - 0.5) {
        canvas.classList.remove("video-restart-anim");
        // Force reflow
        void canvas.offsetWidth;
        canvas.classList.add("video-restart-anim");
      }

      lastProcessedTime.current = video.currentTime;

      const ctx = canvas.getContext("2d");
      const offscreenCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!ctx || !offscreenCtx) {
        animationFrameId.current = requestAnimationFrame(processFrame);
        return;
      }

      // Optimization: limit the processing resolution to improve performance (max 400px wide)
      const MAX_WIDTH = 400;
      let targetWidth = video.videoWidth;
      let targetHeight = video.videoHeight;

      if (targetWidth > MAX_WIDTH) {
        const scale = MAX_WIDTH / targetWidth;
        targetWidth = Math.floor(targetWidth * scale);
        targetHeight = Math.floor(targetHeight * scale);
      }

      if (width !== targetWidth || height !== targetHeight) {
        width = targetWidth;
        height = targetHeight;
        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          offscreen.width = width;
          offscreen.height = height;
        }
      }

      if (width === 0 || height === 0) {
        animationFrameId.current = requestAnimationFrame(processFrame);
        return;
      }

      // Draw the video frame to the offscreen canvas
      offscreenCtx.drawImage(video, 0, 0, width, height);

      try {
        const frame = offscreenCtx.getImageData(0, 0, width, height);
        const data = frame.data;
        const len = data.length;

        // Threshold parameters to key out the white background
        const threshold = 210;
        const softRange = 45; // Smooth alpha dropoff

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate brightness representing the closeness to white
          const brightness = (r + g + b) / 3;

          if (brightness > threshold) {
            const diff = brightness - threshold;
            const alpha = Math.max(0, 1 - diff / softRange);
            data[i + 3] = Math.round(data[i + 3] * alpha);
          }
        }

        // Output processed pixels to visible canvas
        ctx.putImageData(frame, 0, 0);
      } catch (err) {
        console.error("Error processing video frame", err);
      }

      animationFrameId.current = requestAnimationFrame(processFrame);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      animationFrameId.current = requestAnimationFrame(processFrame);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Play video
    const startPlay = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Autoplay prevented or video failed, falling back to static image", err);
      }
    };
    startPlay();

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [src]);

  if (hasError) {
    return (
      <Image
        src={fallbackSrc}
        alt="Aformix Orbit Mascot"
        className={`${className} object-cover`}
        style={{ borderRadius: "30px" }}
      />
    );
  }

  return (
    <div className={`relative ${className}`} style={{ borderRadius: "30px", overflow: "hidden" }}>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        autoPlay
        crossOrigin="anonymous"
        style={{ display: "none" }}
        onError={() => setHasError(true)}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ opacity: isPlaying ? 1 : 0, transition: "opacity 0.6s ease", borderRadius: "30px" }}
      />
      {!isPlaying && (
        <Image
          src={fallbackSrc}
          alt="Aformix Orbit Mascot Preview"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: "30px" }}
        />
      )}
    </div>
  );
};

export default ChromaKeyVideo;
