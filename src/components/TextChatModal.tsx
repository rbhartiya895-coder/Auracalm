import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Sparkles, Heart, Bot, User, Wind } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  suggestion?: string;
  actionType?: 'sigh' | 'breathing' | 'anchoring';
}

interface TextChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTool: (tool: 'sigh' | 'breathing' | 'anchoring') => void;
}

export const TextChatModal: React.FC<TextChatModalProps> = ({ isOpen, onClose, onTriggerTool }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hello. I am here with you in this private sanctuary. Whatever feelings, heaviness, or racing thoughts you are carrying today, take all the time you need to write them down.',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: userText,
      time: 'Now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Empathetic clinical response generator
    setTimeout(() => {
      let replyText = '';
      let action: 'sigh' | 'breathing' | 'anchoring' | undefined;
      let suggestion = '';

      const lower = userText.toLowerCase();

      if (lower.includes('panic') || lower.includes('can\'t breathe') || lower.includes('heart') || lower.includes('scared')) {
        replyText =
          'I hear how intense that feels right now. Please place your feet firmly on the floor and feel gravity holding you. You are in a real room, you are physically safe, and this panic wave will peak and subside in a few minutes. Let\'s do a quick Physiological Sigh right now to downregulate your heart.';
        action = 'sigh';
        suggestion = 'Start Physiological Sigh';
      } else if (lower.includes('anxious') || lower.includes('overwhelm') || lower.includes('stress') || lower.includes('work') || lower.includes('racing')) {
        replyText =
          'It makes complete sense that you feel overwhelmed. Your mind is trying to solve everything at once, but your body only needs to live in this exact second. Take a soft breath. Would you like to do a quick 4-2-6 breathing cycle to calm your nervous system?';
        action = 'breathing';
        suggestion = 'Open 4-2-6 Breath Pacer';
      } else if (lower.includes('disconnected') || lower.includes('numb') || lower.includes('derealization') || lower.includes('spinning')) {
        replyText =
          'When we dissociate or feel disconnected, the mind is trying to shield us from stress. Let us gently anchor back into your 5 physical senses. Can you look around and spot 5 distinct colors right now?';
        action = 'anchoring';
        suggestion = 'Open 5-4-3-2-1 Anchoring';
      } else if (lower.includes('sleep') || lower.includes('tired') || lower.includes('night') || lower.includes('insomnia')) {
        replyText =
          'Restlessness at night is deeply exhausting. Give yourself permission to stop trying to force sleep. Just resting your muscles with your eyes closed is already restoring your brain and body. I recommend our 4-7-8 Deep Sleep guided meditation.';
        suggestion = 'Try 4-7-8 Sleep Practice';
      } else {
        replyText =
          `Thank you for sharing that with me. Acknowledging "${userText}" without judging yourself is a profound act of self-care. Notice your shoulders right now—can you let them drop half an inch? You have space here. What does your body need most in this moment: quiet, breath, or grounding?`;
        action = 'breathing';
        suggestion = 'Try Gentle Paced Breathing';
      }

      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: replyText,
        time: 'Just now',
        actionType: action,
        suggestion: suggestion
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
      soundService.playChime(528, 1);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Text Chat Sanctuary</h2>
              <p className="text-xs text-slate-500">Private, empathetic, non-judgmental space</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#fcfdfc]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0d6954] text-white rounded-br-xs shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                }`}
              >
                <p>{m.text}</p>
                {m.actionType && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onTriggerTool(m.actionType!);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{m.suggestion || 'Open Tool'}</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 px-1 mt-1 font-mono">{m.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white border border-slate-200 px-3 py-2 rounded-2xl w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1">Sanctuary is holding space...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type what is on your mind... Take your time."
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-800 placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-[#0d6954] hover:bg-[#09473a] text-white rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
