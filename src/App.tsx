import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ChatPanel from './components/ChatPanel';
import { ChatMessage, SenderType } from './types';
import { getInitialMessages, textToAscii } from './utils';
import { playSendSound, playReceiveSound, resumeAudio } from './audio';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ShieldCheck, 
  Smartphone,
  Sun,
  Moon,
  Info
} from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [revealedHer, setRevealedHer] = useState<Set<string>>(new Set());
  const [revealedHim, setRevealedHim] = useState<Set<string>>(new Set());
  
  // Real-time keypress typing signals
  const [typingHer, setTypingHer] = useState(false);
  const [typingHim, setTypingHim] = useState(false);

  // Sound configuration
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Premium Dark Mode state - controls general layout dashboard and simulated devices
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mobile active screen tracker (for responsive mobile viewports)
  const [mobileActiveTab, setMobileActiveTab] = useState<SenderType>('her');

  // Unified real-time status bar clock
  const [globalTime, setGlobalTime] = useState('12:00 PM');

  // Setup initial mock messages
  useEffect(() => {
    const initial = getInitialMessages();
    setMessages(initial);
    
    // Default initial reveal state to let the user see deciphering instantly
    if (initial.length > 0) {
      setRevealedHer(new Set([initial[0].id, initial[2].id, initial[4].id]));
      setRevealedHim(new Set([initial[1].id, initial[3].id]));
    }
  }, []);

  // Update real-time clock periodically
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setGlobalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sends raw client message mapped directly into secure digit values
  const handleSendMessage = (sender: SenderType, text: string) => {
    resumeAudio(); 
    const formatted = text.trim();
    if (!formatted) return;

    const codeRep = textToAscii(formatted);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      sender,
      originalText: formatted,
      asciiValue: codeRep,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => {
      const nextList = [...prev, newMsg];
      
      // Simulate over-the-air validation ticks
      setTimeout(() => {
        setMessages(current => 
          current.map(m => m.id === newMsg.id ? { ...m, status: 'read' as const } : m)
        );
      }, 700);

      return nextList;
    });

    if (soundEnabled) {
      playSendSound(true);
      setTimeout(() => {
        playReceiveSound(true);
      }, 150);
    }
  };

  // Decode/toggle handler on user interaction
  const handleToggleDecode = (user: SenderType, msgId: string) => {
    resumeAudio();
    if (user === 'her') {
      setRevealedHer(prev => {
        const next = new Set(prev);
        if (next.has(msgId)) next.delete(msgId);
        else next.add(msgId);
        return next;
      });
    } else {
      setRevealedHim(prev => {
        const next = new Set(prev);
        if (next.has(msgId)) next.delete(msgId);
        else next.add(msgId);
        return next;
      });
    }
  };

  // Clear current active streams to demo base state
  const handleReset = () => {
    if (window.confirm("Verify: Reinitialize Project 3543 Secure Console?")) {
      const initial = getInitialMessages();
      setMessages(initial);
      setRevealedHer(new Set([initial[0].id, initial[2].id, initial[4].id]));
      setRevealedHim(new Set([initial[1].id, initial[3].id]));
      setTypingHer(false);
      setTypingHim(false);
    }
  };

  const herUndecodedCount = messages.filter(
    m => m.sender === 'him' && !revealedHer.has(m.id)
  ).length;

  const himUndecodedCount = messages.filter(
    m => m.sender === 'her' && !revealedHim.has(m.id)
  ).length;

  return (
    <div className={`min-h-screen w-full flex flex-col font-sans select-none antialiased transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-[#f4f5f8] text-slate-900 border-t border-gray-250/30'
    }`}>
      
      {/* 1. Header Banner styled as high-polished System Bar */}
      <header className={`border-b px-6 py-3.5 shrink-0 z-50 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-800' 
          : 'bg-white/95 border-gray-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#007aff] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-base font-bold tracking-tight ${
                  isDarkMode ? 'text-white font-sans' : 'text-gray-900 font-sans'
                }`}>
                  Project 3543 Secure Console
                </h1>
                <span className="text-[9px] bg-blue-100 text-[#007aff] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wide">
                  Classified
                </span>
              </div>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Authorized client-peer transmission terminal with high-fidelity iMessage frames.
              </p>
            </div>
          </div>

          {/* Premium Audio, Theme Dark Mode and wiping reset bars */}
          <div className="flex items-center gap-2.5">
            
            {/* Immersive Theme Switcher Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all shadow-sm ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' 
                  : 'bg-white border-gray-250 text-gray-700 hover:bg-gray-50'
              }`}
              title="Switch light/dark appearance"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Light Theme
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  Dark Theme
                </>
              )}
            </button>

            {/* Sound alert chime toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all shadow-sm ${
                soundEnabled 
                  ? 'bg-blue-50 border-blue-200 text-[#007aff] hover:bg-blue-100/60' 
                  : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-400'
                    : 'bg-gray-100 border-gray-200 text-gray-500'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  Chimes On
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  Muted
                </>
              )}
            </button>

            {/* Wipe all stream records to default state */}
            <button
              onClick={handleReset}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border shadow-sm transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-slate-250 hover:bg-slate-750' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Console
            </button>
          </div>

        </div>
      </header>

      {/* 2. Top Informational Banner (Strictly no ASCII language) */}
      <section className={`border-b px-6 py-2 shrink-0 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/40 border-slate-800 text-slate-300' 
          : 'bg-blue-50/50 border-gray-200/50 text-gray-600'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.8 text-[11px] text-center leading-relaxed">
          <Sparkles className="w-3.5 h-3.5 text-[#007aff] shrink-0 inline-block mr-1" />
          <span>
            Secure Terminal: Messages convert directly to numeric packages. Intercept, click, or use dropdown elements inside simulated devices to instantly reveal.
          </span>
        </div>
      </section>

      {/* 3. Outer Frame Wrapper configured with 100% scroll protection */}
      <main className="flex-1 flex flex-col justify-center overflow-hidden max-w-7xl w-full mx-auto p-4 md:p-6 select-none relative">
        
        {/* Mobile View Switching Tabs */}
        <div className={`lg:hidden flex p-1 rounded-2xl border justify-between items-center gap-2 shrink-0 mb-4 shadow-sm transition-colors duration-350 ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-gray-100 border-gray-250/60'
        }`}>
          <button
            onClick={() => setMobileActiveTab('her')}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              mobileActiveTab === 'her'
                ? 'bg-[#007aff] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            👧 Her Device
            {herUndecodedCount > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white font-sans text-[9px] rounded-full flex items-center justify-center font-bold">
                {herUndecodedCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setMobileActiveTab('him')}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              mobileActiveTab === 'him'
                ? 'bg-[#007aff] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            👦 Him Device
            {himUndecodedCount > 0 && (
              <span className="w-4 h-4 bg-red-550 text-white font-sans text-[9px] rounded-full flex items-center justify-center font-bold">
                {himUndecodedCount}
              </span>
            )}
          </button>
        </div>

        {/* Side-by-Side Dual-Iphone Terminal Panel - dynamically wider horizontally up to max-w-7xl */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-14 items-center justify-center">
          
          {/* Her Terminal */}
          <div className={`${mobileActiveTab === 'her' ? 'block' : 'hidden lg:block'} h-full flex flex-col justify-center overflow-hidden`}>
            <div className="hidden lg:flex items-center gap-2 mb-2 px-3 justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                <h2 className={`text-[10px] font-bold uppercase tracking-widest font-sans ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Her iMessage Console
                </h2>
              </div>
              {herUndecodedCount > 0 && (
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.2 rounded-full font-sans tracking-tight font-bold animate-pulse">
                  {herUndecodedCount} payload(s) waiting
                </span>
              )}
            </div>
            
            <ChatPanel
              user="her"
              otherUser="him"
              messages={messages}
              revealedMessages={revealedHer}
              onSendMessage={(text) => handleSendMessage('her', text)}
              onToggleDecode={(msgId) => handleToggleDecode('her', msgId)}
              otherUserIsTyping={typingHim}
              onTypingStatusChange={(isTyping) => setTypingHer(isTyping)}
              soundEnabled={soundEnabled}
              globalTime={globalTime}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Him Terminal */}
          <div className={`${mobileActiveTab === 'him' ? 'block' : 'hidden lg:block'} h-full flex flex-col justify-center overflow-hidden`}>
            <div className="hidden lg:flex items-center gap-2 mb-2 px-3 justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
                <h2 className={`text-[10px] font-bold uppercase tracking-widest font-sans ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Him iMessage Console
                </h2>
              </div>
              {himUndecodedCount > 0 && (
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.2 rounded-full font-sans tracking-tight font-bold animate-pulse">
                  {himUndecodedCount} payload(s) waiting
                </span>
              )}
            </div>

            <ChatPanel
              user="him"
              otherUser="her"
              messages={messages}
              revealedMessages={revealedHim}
              onSendMessage={(text) => handleSendMessage('him', text)}
              onToggleDecode={(msgId) => handleToggleDecode('him', msgId)}
              otherUserIsTyping={typingHer}
              onTypingStatusChange={(isTyping) => setTypingHim(isTyping)}
              soundEnabled={soundEnabled}
              globalTime={globalTime}
              isDarkMode={isDarkMode}
            />
          </div>

        </div>
      </main>

      {/* 4. Tiny macOS Status Bar Footer */}
      <footer className={`border-t py-2 px-6 text-center text-[10.5px] shrink-0 select-none z-10 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-950 border-slate-800 text-slate-500' 
          : 'bg-white border-gray-250/60 text-gray-400'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-sans">
          <span>
            Project 3543 Console — Ultra-Wide simulated iMessage devices with raw key signals.
          </span>
          <div className="flex gap-4 font-mono text-[9px] opacity-85">
            <span>Terminal Clock: {globalTime}</span>
            <span>STATUS: SYNCHRONIZED</span>
          </div>
        </div>
      </footer>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
