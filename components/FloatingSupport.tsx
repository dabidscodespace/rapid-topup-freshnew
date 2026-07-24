'use client';

import { useState } from 'react';
import { MessageCircle, X, Heart, Sparkles } from 'lucide-react';

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);

  // 🌟 REPLACE THIS with your actual Facebook Messenger link
  const supportUrl = "https://m.me/yourpageusername"; 

  const handleOpenChat = () => {
    window.open(supportUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* 🌟 FRIENDLY CHAT WIDGET */}
      {isOpen && (
        <div className="w-80 border-4 border-[#ff00de] bg-[#1a0b2e] shadow-hard-pink relative overflow-hidden">
          {/* CRT Scanlines */}
          <div className="absolute inset-0 crt-overlay opacity-10 pointer-events-none" />
          
          {/* Header with friendly greeting */}
          <div className="flex items-center justify-between border-b-4 border-[#fcee0a] bg-gradient-to-r from-[#ff00de]/20 to-[#fcee0a]/20 p-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-[#fcee0a] animate-pulse" />
              </div>
              <div>
                <h3 className="font-pixel text-xs text-[#fcee0a] tracking-wider">
                  Hey Player! 👋
                </h3>
                <p className="font-sans text-[10px] text-[#00f0ff]">We're here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="border-2 border-[#ff00de] bg-[#1a0b2e] p-1.5 text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-all btn-press"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 relative z-10">
            {/* Friendly Message */}
            <div className="mb-5 bg-[#0a0118] border-2 border-[#00f0ff]/30 p-4 rounded-none">
              <p className="font-sans text-sm text-white leading-relaxed mb-2">
                Having trouble with your top-up? 
              </p>
              <p className="font-sans text-sm text-[#00f0ff] leading-relaxed">
                Don't worry! Our friendly support team is ready to help you out. Just click below to chat with us on Messenger!
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <div className="border-2 border-[#fcee0a] bg-[#0a0118] p-2 text-center">
                <p className="font-pixel text-[10px] text-[#fcee0a]"> FAST</p>
                <p className="font-sans text-[9px] text-gray-400">Quick replies</p>
              </div>
              <div className="border-2 border-[#00f0ff] bg-[#0a0118] p-2 text-center">
                <p className="font-pixel text-[10px] text-[#00f0ff]">💝 FRIENDLY</p>
                <p className="font-sans text-[9px] text-gray-400">Real humans</p>
              </div>
            </div>

            {/* Launch Messenger Button */}
            <button
              onClick={handleOpenChat}
              className="w-full flex items-center justify-center gap-2 border-4 border-[#fcee0a] bg-[#ff00de] py-3 font-sans font-bold text-sm text-white shadow-hard-pink btn-press hover:bg-[#fcee0a] hover:text-black hover:border-black transition-all uppercase"
            >
              <MessageCircle className="h-4 w-4" />
              Chat with us!
              <Heart className="h-4 w-4" />
            </button>
            
            <p className="text-center font-sans text-[10px] text-gray-400 mt-3">
              Usually replies within minutes 💬
            </p>
          </div>
        </div>
      )}

      {/*  FRIENDLY FLOATING BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 border-4 border-[#ff00de] bg-[#1a0b2e] px-4 py-3 shadow-hard-pink btn-press transition-all duration-100 hover:bg-[#ff00de] hover:border-[#fcee0a] hover:shadow-hard-yellow"
          aria-label="Open Support Chat"
        >
          {/* Neon Glow Effect */}
          <div className="absolute -inset-1 bg-[#ff00de] opacity-20 blur-md group-hover:opacity-40 animate-pulse transition-opacity pointer-events-none" />
          
          {/* Icon */}
          <MessageCircle className="relative h-6 w-6 text-[#ff00de] group-hover:text-[#1a0b2e] transition-colors" strokeWidth={2.5} />
          
          {/* Friendly Text */}
          <span className="relative hidden sm:block font-pixel text-[10px] text-[#ff00de] group-hover:text-[#1a0b2e] tracking-widest">
            CHAT WITH US!
          </span>

          {/* Blinking "Online" Dot */}
          <span className="relative absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-[#00f0ff] opacity-75" />
            <span className="relative inline-flex rounded-none h-3.5 w-3.5 bg-[#00f0ff] border-2 border-[#1a0b2e]" />
          </span>
        </button>
      )}
    </div>
  );
}