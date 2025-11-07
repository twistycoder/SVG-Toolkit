import React, { useState } from 'react';
import { Zap, X, ArrowRight, Star } from 'lucide-react';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-black border-b border-yellow-400/30 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-2 left-10 animate-float">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
        </div>
        <div className="absolute bottom-2 right-32 animate-float" style={{ animationDelay: '1s' }}>
          <Star className="w-2 h-2 text-yellow-400 fill-current" />
        </div>
        <div className="absolute top-4 right-20 animate-float" style={{ animationDelay: '2s' }}>
          <Star className="w-2 h-2 text-yellow-400 fill-current" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between py-3">
          {/* Left Content - Modern Tech Vibes */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono text-sm bg-white/10 px-2 py-1 rounded border border-yellow-400/30">
                  &gt;_ 
                </span>
                <p className="text-white font-semibold text-sm md:text-base">
                  Wanna build something <span className="text-yellow-400">WILD</span>?
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-gray-300 text-sm font-mono">
                <span className="bg-white/5 px-2 py-1 rounded border border-gray-700">
                  let's_code = true
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button - Cyberpunk Style */}
          <div className="flex items-center space-x-3">
            <a
              href="https://webdipo.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25 border border-yellow-400/50 flex items-center space-x-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
              <span className="relative z-10">INITIATE PROJECT</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>
            
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scanning line effect */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-scan"></div>
    </div>
  );
};

export default PromoBanner;