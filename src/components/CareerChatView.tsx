import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Lightbulb,
  ExternalLink,
  RefreshCw,
  Award
} from 'lucide-react';
import { StudentProfile, Opportunity } from '../types';

interface CareerChatViewProps {
  profile: StudentProfile;
  opportunities: Opportunity[];
  onSelectOpp: (opp: Opportunity) => void;
  language: 'hinglish' | 'english';
}

interface MessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedChips?: string[];
  relevantOpportunityIds?: string[];
}

export const CareerChatView: React.FC<CareerChatViewProps> = ({
  profile,
  opportunities,
  onSelectOpp,
  language,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Namaste ${profile.name}! Main hoon aapka **Sahayak Bhaiya** 🚀\n\n` +
        `Tier-2 aur tier-3 engineering colleges ki realities main achhe se jaanta hoon—lab files likhne ka stress, 75% attendance ka pressure, aur campus me top companies ka na aana.\n\n` +
        `Aap mujhse be-jhijhak pooch sakte hain:\n` +
        `• 1st/2nd year me kaunse scholarships aur programs me apply karein?\n` +
        `• Non-CS branch (${profile.branch}) se tech placement ki taiyari kaise karein?\n` +
        `• Free resources (Striver, Babbar, Chai aur Code) se zero se start kaise karein?\n\n` +
        `Bataiye, aaj kis cheez me help chahiye?`,
      timestamp: 'Just now',
      suggestedChips: [
        '1st/2nd year best opportunities',
        'DSA roadmap for campus placements',
        'Non-CS branch se tech me switch',
        'Scholarships for tier-2/3 students'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: MessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          userId: profile.id,
        }),
      });

      const data = await response.json();

      const aiMessage: MessageItem = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response || 'Kuch technical error aaya, kripya dobara try karein.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedChips: data.suggestedChips || [],
        relevantOpportunityIds: data.relevantOpportunityIds || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat API Error:', err);
      // Local fallback
      const aiMessage: MessageItem = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Bhai, aapka sawaal bohot genuine hai! Tier-2/3 students ke liye consistently 2 ghante roz DSA practice karna aur 1 live web project build karna hi game-changer hota hai. Opportunity feed me check karein, aapke branch ke mutabiq scholarships aur hackathons listed hain!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedChips: ['DSA Roadmap dekhein', 'Opportunities Feed kholo'],
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Mentor Header */}
      <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-sm">
              सहायक
            </div>
            <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 absolute -bottom-0.5 -right-0.5"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Sahayak Bhaiya (AI Career Mentor)</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in Tier-2/3 realities • Hinglish & English
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block text-xs text-slate-400">
          Targeting: <strong className="text-amber-300">{profile.branch}</strong> ({profile.year})
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const relevantOpps = (msg.relevantOpportunityIds || [])
            .map((id) => opportunities.find((o) => o.id === id))
            .filter(Boolean) as Opportunity[];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed shadow-xs ${
                  isAi
                    ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                    : 'bg-indigo-600 text-white rounded-tr-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Relevant Opportunities Mini-Cards embedded inside AI response */}
                {relevantOpps.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Recommended Opportunities for You:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {relevantOpps.map((opp) => (
                        <div
                          key={opp.id}
                          onClick={() => onSelectOpp(opp)}
                          className="p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100/70 transition cursor-pointer text-left"
                        >
                          <div className="text-xs font-bold text-indigo-950 truncate">
                            {opp.title}
                          </div>
                          <div className="text-[11px] text-slate-600 truncate">
                            {opp.organization} • {opp.stipend_or_amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 text-right ${
                    isAi ? 'text-slate-400' : 'text-indigo-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Suggested Follow-up Chips */}
              {isAi && msg.suggestedChips && msg.suggestedChips.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[85%]">
                  {msg.suggestedChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="px-3 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-medium rounded-full shadow-2xs transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{chip}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200/90 text-xs text-slate-500 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Sahayak Bhaiya soch rahe hain...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'hinglish'
                ? "Bhaiya se kuch bhi poochein (e.g. '1st year EEE internship ideas', 'DSA kaise shuru karein?')"
                : "Ask mentor anything (e.g. 'How to start DSA?', 'Internship ideas for non-CS')"
            }
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
