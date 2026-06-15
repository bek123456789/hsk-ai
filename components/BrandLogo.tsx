"use client";

import Image from "next/image";
import { useState } from "react";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  showText?: boolean;
  className?: string;
};

const iconSizes = {
  sm: "h-9 w-9 rounded-xl",
  md: "h-11 w-11 rounded-2xl",
  lg: "h-16 w-16 rounded-[1.35rem]"
};

const textSizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl"
};

const wordmarkSizes = {
  sm: "h-9 w-[142px]",
  md: "h-12 w-[190px]",
  lg: "h-20 w-[316px]"
};

function FallbackBrand({ size, showText }: { size: NonNullable<BrandLogoProps["size"]>; showText: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-[#FF9B35] to-[#FF6B1A] font-black text-white shadow-card ${iconSizes[size]}`}>
        汉
      </span>
      {showText ? <span className={`font-black tracking-normal text-[#241A14] ${textSizes[size]}`}>HanziFlow <span className="text-[#FF6B1A]">AI</span></span> : null}
    </span>
  );
}

export function BrandLogo({ size = "md", variant = "full", showText = true, className = "" }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className={className}><FallbackBrand size={size} showText={showText} /></span>;
  }

  if (variant === "full" && showText) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <Image
          src="/brand/hanziflow-wordmark.png"
          alt="HanziFlow AI logotipi"
          width={480}
          height={136}
          priority={size === "lg"}
          onError={() => setFailed(true)}
          className={`object-contain object-left ${wordmarkSizes[size]}`}
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/brand/hanziflow-icon.png"
        alt="HanziFlow AI belgisi"
        width={512}
        height={512}
        onError={() => setFailed(true)}
        className={`shrink-0 shadow-card ${iconSizes[size]}`}
      />
      {showText ? <span className={`font-black tracking-normal text-[#241A14] ${textSizes[size]}`}>HanziFlow <span className="text-[#FF6B1A]">AI</span></span> : null}
    </span>
  );
}
