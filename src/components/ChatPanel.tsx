import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Wifi, 
  Battery, 
  Signal, 
  Eye, 
  EyeOff, 
  Key, 
  Undo2, 
  Copy,
  ChevronLeft,
  ChevronRight,
  Info,
  Mic,
  Camera,
  Image,
  MoreHorizontal
} from 'lucide-react';
import { ChatMessage, SenderType } from '../types';
import { textToAscii, formatTime } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface ChatPanelProps {
  user: SenderType;
  otherUser: SenderType;
  messages: ChatMessage[];
  revealedMessages: Set<string>;
  onSendMessage: (text: string) => void;
  onToggleDecode: (msgId: string) => void;
  otherUserIsTyping: boolean;
  onTypingStatusChange: (isTyping: boolean) => void;
  soundEnabled: boolean;
  globalTime: string;
  isDarkMode: boolean;
}

export default function ChatPanel({
  user,
  otherUser,
  messages,
  revealedMessages,
  onSendMessage,
  onToggleDecode,
  otherUserIsTyping,
  onTypingStatusChange,
  soundEnabled,
  globalTime,
  isDarkMode
}: ChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const [activeDropdownMsgId, setActiveDropdownMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [showCabinetNotice, setShowCabinetNotice] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user === 'her' ? 'Her' : 'Him';
  const otherName = otherUser === 'her' ? 'Her' : 'Him';

  // Live over-the-air raw numerical translation preview
  const liveCodePreview = inputText ? textToAscii(inputText) : '';

  // Safe and precise scroll adjustment upon new messages or typing changes without shifting general browser view
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, otherUserIsTyping]);

  // Handle outside clicks to collapse action boxes
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownMsgId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
    onTypingStatusChange(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    onTypingStatusChange(val.length > 0);
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
    setActiveDropdownMsgId(null);
  };

  // Avatar colors aligned with premium iOS style and depth
  const initials = otherName[0];
  const otherAvatarColor = otherUser === 'her'
    ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-sm'
    : 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-sm';

  return (
    <div 
      id={`device-frame-${user}`}
      className={`flex flex-col w-full max-w-[390px] sm:max-w-[430px] mx-auto rounded-[54px] shadow-2xl border-[12px] transition-colors duration-350 overflow-hidden relative select-none h-[750px] max-h-[82vh] font-sans ${
        isDarkMode 
          ? 'bg-[#000000] border-[#2c2c2e]' 
          : 'bg-[#ffffff] border-[#1e1e1e]'
      }`}
    >
      {/* 1. iOS Top Bezel & Dynamic Island Status bar */}
      <div className={`px-6 pt-3 pb-1 flex justify-between items-center text-[11px] font-semibold shrink-0 z-40 relative transition-colors duration-300 ${
        isDarkMode ? 'bg-[#000000] text-white' : 'bg-[#ffffff] text-black'
      }`}>
        <span>{globalTime}</span>
        
        {/* Apple Dynamic Island Bezel Frame */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-[#0e0e11] rounded-full border border-gray-950 ml-auto mr-3"></div>
        </div>

        <div className="flex items-center gap-1.5">
          <Signal className={`w-3 h-3 fill-current ${isDarkMode ? 'text-white' : 'text-black'}`} />
          <span className={`text-[9px] hidden sm:inline font-sans tracking-tight opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>5G</span>
          <Wifi className={`w-3 h-3 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          <div className="flex items-center gap-0.5">
            <Battery className={`w-4.5 h-3.5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          </div>
        </div>
      </div>

      {/* 2. Official Apple iMessage Header Section */}
      <div className={`px-4 py-2 flex flex-col items-center shrink-0 z-30 border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#1c1c1e]/95 border-neutral-800 text-white' 
          : 'bg-[#fafafc]/95 border-gray-200 text-black'
      }`}>
        
        {/* Navigation Action Alignment */}
        <div className="w-full flex justify-between items-center mb-1">
          <button className="flex items-center gap-0.5 text-[#0a84ff] hover:opacity-75 transition-opacity text-sm font-normal">
            <ChevronLeft className="w-5 h-5 -ml-1 text-[#0a84ff]" />
            <span className="text-[13px]">Messages</span>
          </button>

          {/* Center iMessage Contact Badge */}
          <div className="flex flex-col items-center">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-lg tracking-wider ${otherAvatarColor} select-none`}>
              {initials}
            </div>
            
            <span className={`text-[11px] font-normal mt-1 flex items-center gap-0.5 ${
              isDarkMode ? 'text-gray-250' : 'text-gray-800'
            }`}>
              {otherName} 
              <ChevronRight className="w-2.5 h-2.5 text-gray-400" />
            </span>
          </div>

          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1" aria-label="Info Detail">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-neutral-800 text-[#007aff]' : 'bg-gray-100 text-[#007aff]'
            }`}>
              <Info className="w-4 h-4 text-[#0a84ff]" />
            </div>
          </button>
        </div>

        {/* Real-time typing or message system state badge */}
        <div className="text-[10px] text-gray-400 font-normal transition-all duration-300 min-h-[12px] pb-1">
          {otherUserIsTyping ? (
            <span className="text-[#0a84ff] font-medium animate-pulse">Typing...</span>
          ) : (
            <span>iMessage</span>
          )}
        </div>
      </div>

      {/* 3. iMessage Active Handle Identification Strip */}
      <div className={`px-4 py-1.5 flex justify-between items-center text-[10px] font-medium shrink-0 border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#121214] border-neutral-800/80 text-gray-400' 
          : 'bg-slate-50 border-slate-100 text-gray-500'
      }`}>
        <span>
          Simulated View: <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>{userName}</strong>
        </span>
        <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded ${
          isDarkMode ? 'bg-neutral-800 text-gray-300' : 'bg-slate-200/50 text-slate-600'
        }`}>
          CHANNEL-3543
        </span>
      </div>

      {/* 4. Chat Messages Scroll Area */}
      <div 
        ref={chatContainerRef}
        id={`chat-messages-3543-${user}`}
        className={`flex-1 overflow-y-auto px-4 py-4 space-y-3 relative select-none transition-colors duration-300 ${
          isDarkMode ? 'bg-[#000000]' : 'bg-[#ffffff]'
        }`}
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Confidential notice banner */}
        {showCabinetNotice && (
          <div className="flex justify-center my-1 animate-fade-in">
            <div className={`border rounded-2.5xl px-3.5 py-2.5 max-w-[92%] text-center shadow-none relative leading-relaxed text-[10.5px] ${
              isDarkMode 
                ? 'bg-[#1c1c1e] border-neutral-800 text-gray-400' 
                : 'bg-[#f2f2f7] border-gray-250/60 text-gray-600'
            }`}>
              <span className={`font-bold block mb-0.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>Secure Channel: Project 3543</span>
              Transmission is encrypted instantly into raw numerical values. Tap any active bubble to decrypt on-demand or use options.
              <button 
                onClick={() => setShowCabinetNotice(false)}
                className="absolute top-1.5 right-1.5 text-gray-400 hover:text-gray-700 text-sm font-bold w-4 h-4 flex items-center justify-center rounded-full"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender === user;
            const isRevealed = revealedMessages.has(msg.id);
            const displayText = isRevealed ? msg.originalText : msg.asciiValue;
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-1`}
              >
                <div className="max-w-[76%] relative group">
                  {/* iMessage Bubble: outbound uses beautiful royal blue, inbound adapts to light/dark mode */}
                  <div 
                    onClick={() => onToggleDecode(msg.id)}
                    className={`rounded-[20px] px-3.5 py-2 text-xs relative select-text cursor-pointer transition-all ${
                      isMe 
                        ? 'bg-[#007aff] text-white rounded-br-[4px]' 
                        : isDarkMode
                          ? 'bg-[#262629] text-white rounded-bl-[4px]'
                          : 'bg-[#e9e9eb] text-black rounded-bl-[4px]'
                    }`}
                  >
                    <div 
                      className={`break-all pr-1 font-sans ${
                        isRevealed 
                          ? 'font-normal border-l-2 pl-2 border-slate-400/40 my-0.5' 
                          : 'font-mono tracking-wider font-bold text-[11px] block'
                      }`}
                      title={isRevealed ? "Tap to re-lock to numerical signals" : "Tap to decode to English text"}
                    >
                      {displayText}
                    </div>

                    {/* Popover settings trigger dot */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownMsgId(activeDropdownMsgId === msg.id ? null : msg.id);
                      }}
                      className={`absolute top-1/2 -translate-y-1/2 right-[-26px] p-1.5 rounded-full hover:opacity-80 transition-opacity z-20 ${
                        isDarkMode ? 'bg-neutral-900 text-gray-400' : 'bg-gray-100 text-gray-500'
                      } opacity-0 group-hover:opacity-100 focus-within:opacity-100`}
                      aria-label="Message action menu"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status metadata label wrapper */}
                  <div className="text-[9px] text-gray-400 mt-0.5 flex items-center justify-between px-1">
                    <span className="font-mono text-[8.5px] opacity-85">
                      {formatTime(msg.timestamp)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {isMe && msg.status === 'read' && (
                        <span className="text-[#0a84ff] text-[8.5px] font-semibold tracking-tight uppercase">Delivered</span>
                      )}
                      
                      {isRevealed ? (
                        <span className="text-gray-400 flex items-center gap-0.5 font-sans opacity-95">
                          Deciphered <Eye className="w-2.5 h-2.5 inline text-[#0a84ff]" />
                        </span>
                      ) : (
                        <span className="text-gray-400 flex items-center gap-0.5 font-sans opacity-60">
                          Secure <EyeOff className="w-2.5 h-2.5 inline" />
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Absolute iOS Popover option dropdown box */}
                  {activeDropdownMsgId === msg.id && (
                    <div 
                      ref={dropdownRef}
                      className={`absolute right-0 top-8 rounded-2xl shadow-2xl py-1.5 z-50 w-44 text-left font-sans text-[11.5px] border ${
                        isDarkMode 
                          ? 'bg-[#1c1c1e] border-neutral-800 text-white shadow-black/80' 
                          : 'bg-white border-gray-200 text-gray-850 shadow-black/10'
                      }`}
                    >
                      <button 
                        onClick={() => {
                          onToggleDecode(msg.id);
                          setActiveDropdownMsgId(null);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2 font-medium border-b text-[#0178f6] ${
                          isDarkMode ? 'hover:bg-neutral-850 border-neutral-800' : 'hover:bg-gray-50 border-gray-100'
                        }`}
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            Hide Message
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            View Message
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => copyToClipboard(msg.asciiValue, msg.id)}
                        className={`w-full text-left px-3 py-1.8 flex items-center gap-2 ${
                          isDarkMode ? 'hover:bg-neutral-850 text-gray-350' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        Copy Digit Stream
                      </button>
                      <button 
                        onClick={() => copyToClipboard(msg.originalText, msg.id)}
                        className={`w-full text-left px-3 py-1.8 flex items-center gap-2 ${
                          isDarkMode ? 'hover:bg-neutral-850 text-gray-350' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <Undo2 className="w-3.5 h-3.5 text-gray-400" />
                        Copy Raw English
                      </button>
                    </div>
                  )}

                  {/* Minimal Copy Confirmation tag */}
                  {copiedMsgId === msg.id && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full bg-black/80 text-white text-[8px] rounded-full px-2 py-0.5 mb-1 text-center font-sans tracking-tight z-50 whitespace-nowrap">
                      Copied
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator Bubble (Bouncing dots - exactly matching iMessage style) */}
          {otherUserIsTyping && (
            <motion.div
              key="typing-indicator-node"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="flex w-full justify-start mb-2"
            >
              <div className="flex flex-col max-w-[70%]">
                <div 
                  className={`rounded-[20px] px-4 py-3 select-none rounded-bl-[4px] shadow-sm flex items-center gap-1.5 ${
                    isDarkMode ? 'bg-[#262629]' : 'bg-[#e9e9eb]'
                  }`}
                >
                  {/* Bouncing Dots with progressive delay sequences */}
                  <div 
                    className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-neutral-400' : 'bg-gray-500'}`} 
                    style={{ animationDelay: '0ms', animationDuration: '0.8s' }}
                  ></div>
                  <div 
                    className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-neutral-400' : 'bg-gray-500'}`} 
                    style={{ animationDelay: '150ms', animationDuration: '0.8s' }}
                  ></div>
                  <div 
                    className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-neutral-400' : 'bg-gray-500'}`} 
                    style={{ animationDelay: '300ms', animationDuration: '0.8s' }}
                  ></div>
                </div>
                <span className="text-[8px] text-gray-400 mt-0.5 ml-1.5 font-sans font-medium">
                  {otherName} is active...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Live Digit Stream Transmit Preview (Pure confidentiality alignment) */}
      <div className={`px-4 py-2 flex flex-col justify-center gap-1 shrink-0 font-sans z-10 border-t transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#121214] border-neutral-800/80 text-gray-300' 
          : 'bg-[#f1f1f4] border-gray-200/80 text-gray-500'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
            <Key className="w-3 h-3 text-[#0178f6]" />
            Transmitting live feed:
          </span>
          {inputText && (
            <span className="text-[8px] bg-blue-100 text-[#007aff] px-1.5 py-0.2 rounded-full font-sans font-semibold animate-pulse uppercase tracking-tight">
              Active Connection
            </span>
          )}
        </div>
        <div className={`text-[10px] font-mono truncate rounded-xl px-2.5 py-1 min-h-[22px] tracking-widest transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-[#1c1c1e] border border-neutral-800 text-slate-300' 
            : 'bg-white/70 border border-gray-200/60 text-gray-700'
        }`}>
          {liveCodePreview ? (
            <span className="text-[#0a84ff] font-bold">{liveCodePreview}</span>
          ) : (
            <span className="text-gray-400 italic font-sans text-[10px]">Ready to transmit code blocks...</span>
          )}
        </div>
      </div>

      {/* 6. Apple iMessage Input Control Capsule (Styled exactly like iOS) */}
      <form 
        onSubmit={handleSend}
        className={`px-3 py-2.5 flex items-center gap-2.5 border-t shrink-0 z-10 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-[#1c1c1e] border-neutral-850' 
            : 'bg-[#fdfdfd] border-gray-100'
        }`}
      >
        {/* Left App iMessage attachment glyphs */}
        <div className="flex items-center gap-2 shrink-0">
          <Camera className="w-5.5 h-5.5 hover:opacity-70 cursor-pointer text-[#a2a2a6]" />
          <Image className="w-5.5 h-5.5 hover:opacity-70 cursor-pointer text-[#a2a2a6]" />
        </div>

        {/* Input Pill Container */}
        <div className={`flex items-center grow rounded-[20px] px-3 py-1 font-sans border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-black border-neutral-800 hover:border-neutral-750 text-white' 
            : 'bg-transparent border-gray-200 hover:border-gray-200 text-black'
        }`}>
          <input 
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="iMessage"
            className="grow focus:outline-none text-[13px] bg-transparent min-w-[50px] py-1 placeholder-gray-400"
          />
          
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() 
                ? 'bg-[#007aff] text-white active:scale-95 shadow-sm hover:opacity-90' 
                : 'bg-transparent text-gray-300'
            }`}
          >
            <Send className="w-3.5 h-3.5 ml-0.5 text-white" />
          </button>
        </div>

        <Mic className="w-5.5 h-5.5 text-[#a2a2a6] shrink-0 hover:text-gray-500 cursor-pointer" />
      </form>

      {/* 7. iOS Home Indicator Bar */}
      <div className={`pb-1.5 flex justify-center shrink-0 z-10 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1c1c1e]' : 'bg-[#fdfdfd]'
      }`}>
        <div className={`w-32 h-1 rounded-full ${isDarkMode ? 'bg-white/40' : 'bg-black'}`}></div>
      </div>
    </div>
  );
}
