import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, Sparkles, AlertCircle, Compass } from 'lucide-react';

interface VoiceQuerySectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  activeLanguage: string;
  lastResponse?: {
    response_en: string;
    response_hi: string;
    detected_intent: string;
    is_emergency: boolean;
  };
}

export const VoiceQuerySection: React.FC<VoiceQuerySectionProps> = ({
  onSearch,
  isLoading,
  activeLanguage,
  lastResponse,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Default to Indian English / Hindi mix

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access blocked. You can type your query below.');
        } else {
          setSpeechError(`Voice input paused (${event.error}). Please try again or type.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setSpeechError(null);
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.warn('Start recognition error:', err);
        }
      } else {
        setSpeechError('Speech recognition is not supported in this browser. Please type below.');
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSearch(inputText.trim());
  };

  // Text-To-Speech function
  const speakText = (text: string, lang = 'hi-IN') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Demo suggested queries
  const sampleQueries = [
    { label: '“Mujhe nearest women’s cell chahiye”', query: "Mujhe nearest women's cell chahiye" },
    { label: '“Library ke paas medical help?”', query: 'Library ke paas medical help?' },
    { label: '“I feel unsafe near main gate”', query: 'I feel unsafe near main gate' },
    { label: '“Lost college ID card process”', query: 'How to apply for duplicate lost ID card?' },
    { label: '“Anti-ragging complaint kaise karein”', query: 'Anti-ragging complaint process step by step' },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
      
      {/* Decorative ambient glowing ring */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Speak or Type in Hindi, English, or Hinglish</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-emerald-400 font-mono text-[11px]">AI Triage Active</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          How can Sahayata help you on campus right now?
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mb-6 font-normal">
          बोलें या लिखें — इमरजेंसी सहायता, विमेंस सेल, मेडिकल, रैगिंग सुरक्षा, या कॉलेज प्रक्रियाएं।
        </p>

        {/* Big Mic Button & Query Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="relative flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-800/90 rounded-2xl border border-slate-700 focus-within:border-rose-500/70 shadow-inner">
            
            {/* Microphone Trigger */}
            <button
              type="button"
              onClick={toggleListening}
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/40'
                  : 'bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Tap to speak (Hindi / English)'}
            >
              {isListening ? <Mic className="w-6 h-6 animate-bounce" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'सुन रहे हैं... बोलिए (Listening, speak now)...'
                  : 'Type or speak: "Mujhe medical help chahiye" / "Unsafe near gate"...'
              }
              className="w-full bg-transparent px-3 py-2 text-white placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Triaging...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask Assistant</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Speech Error Warning */}
        {speechError && (
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-800/50 mb-3">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Suggested Quick Prompt Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            Try asking:
          </span>
          {sampleQueries.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputText(item.query);
                onSearch(item.query);
              }}
              className="text-xs px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all active:scale-95 whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Live Audio & Bilingual Response Feedback */}
        {lastResponse && (
          <div className="mt-5 p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-left">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                  Detected Intent: {lastResponse.detected_intent}
                </span>
                {lastResponse.is_emergency && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                    Emergency Alert Active
                  </span>
                )}
              </div>
              <button
                onClick={() => speakText(`${lastResponse.response_en}. ${lastResponse.response_hi}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200"
                title="Listen to response (TTS)"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-amber-400 animate-pulse' : ''}`} />
                <span>Read Out</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 mb-1">English Response:</p>
                <p className="text-slate-200 leading-relaxed">{lastResponse.response_en}</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 mb-1">हिंदी उत्तर (Hindi):</p>
                <p className="text-slate-200 leading-relaxed font-sans">{lastResponse.response_hi}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
