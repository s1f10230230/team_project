"use client";
import React from "react";


export function HeroSection() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#e6f0e6_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#1a201a_100%)]"></div>
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center text-foreground">
          空き家で始める <br /> 
          <span className="text-primary">新しい暮らし</span>
        </h1>
        <p className="mt-4 font-normal text-base text-muted-foreground max-w-lg text-center mx-auto">
          AIマッチングで、あなたにぴったりの移住先を見つけます。
          ライフスタイルに合わせた最適な物件と地域をご提案します。
        </p>
      </div>
    </div>
  );
}
