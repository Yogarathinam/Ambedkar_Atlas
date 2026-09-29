import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles, Copy, Check, RotateCcw, ExternalLink, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';
import { ResearchQA } from '../../types';
import { SUGGESTED_PROMPTS } from '../../data/researchQA';
import { archiveService } from '../../services/archiveService';
import { useToast } from '../../context/ToastContext';

interface Message {
  sender: 'user' | 'assistant';
  text?: string;
  data?: ResearchQA;
  timestamp: string;
}

export const ChatConsole: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [simulatedError, setSimulatedError] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAsk = async (question: string) => {
    if (!question.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);
    setSimulatedError(false);

    // Multi-step realistic RAG retrieval progression
    setLoadingStep('Searching primary archival index & BAWS volumes...');
    setTimeout(() => {
      setLoadingStep('Cross-referencing verified historical speeches & treatises...');
    }, 300);

    try {
      const response = await archiveService.askResearchAssistant(question);
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          data: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setLoading(false);
      setSimulatedError(true);
    }
  };

  const handleCopyAnswer = (data: ResearchQA) => {
    const fullText = `${data.summary}\n\n${data.paragraphs.join('\n\n')}\n\nSources:\n` +
      data.citations.map((c) => `${c.marker} ${c.title} (${c.year}) - ${c.source}`).join('\n');
    navigator.clipboard.writeText(fullText);
    showToast('Research answer & citations copied to clipboard', 'success');
  };

  const handleClearConversation = () => {
    setMessages([]);
    showToast('Conversation cleared', 'info');
  };

  return (
    <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[640px]">
      
      {/* Console Header */}
      <div className="bg-[#F5EBDD] p-4 sm:p-5 border-b border-[#DED3C2] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#29251F] text-[#FBF8F2] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#B96535]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#29251F] flex items-center gap-2">
              <span>Ambedkar Archival Research Console</span>
              <span className="text-[10px] bg-[#B96535]/15 text-[#B96535] px-2 py-0.5 rounded-full font-sans uppercase font-bold tracking-wider">
                Simulated RAG
              </span>
            </h3>
            <p className="text-xs text-[#827567]">
              Citation-backed historical inquiries grounded in authenticated primary documents
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#827567] hover:text-[#29251F] hover:bg-[#E7D5B9] rounded-lg transition-colors border border-[#DED3C2]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        
        {/* Welcome State when empty */}
        {messages.length === 0 && (
          <div className="py-8 max-w-2xl mx-auto space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E7D5B9]/60 mx-auto flex items-center justify-center text-[#713F2B]">
              <Sparkles className="w-8 h-8 text-[#B96535]" />
            </div>
            
            <div>
              <h4 className="font-serif text-2xl font-bold text-[#29251F] mb-2">
                Ask the Archival Heritage Assistant
              </h4>
              <p className="text-sm text-[#51483F] leading-relaxed">
                Query Dr. Ambedkar’s seminal texts, Constituent Assembly interventions, economic treatises, and social movements. Every answer provides inline markers linking to original catalog documents.
              </p>
            </div>

            {/* Suggested Prompts Grid */}
            <div className="pt-2 text-left">
              <span className="text-xs font-semibold text-[#827567] uppercase tracking-wider block mb-3 text-center">
                Recommended Research Queries:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleAsk(prompt)}
                    className="p-3 bg-[#F5EBDD]/70 hover:bg-[#E7D5B9] border border-[#DED3C2] hover:border-[#B96535] rounded-xl text-left text-xs font-medium text-[#29251F] transition-all flex items-start justify-between gap-2 group"
                  >
                    <span>{prompt}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#B96535] shrink-0 opacity-60 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7D5B9]/40 border border-[#DED3C2] text-xs text-[#827567]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B96535]" />
              <span>Simulated prototype engine referencing curated archival primary sources</span>
            </div>
          </div>
        )}

        {/* Render Conversation Messages */}
        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-4">
            {msg.sender === 'user' ? (
              <div className="flex items-start justify-end gap-3">
                <div className="bg-[#29251F] text-[#FBF8F2] px-5 py-3 rounded-2xl rounded-tr-xs max-w-xl text-sm font-medium shadow-xs">
                  {msg.text}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E7D5B9] text-[#29251F] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B96535] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                
                <div className="bg-[#F5EBDD]/80 border border-[#DED3C2] rounded-2xl rounded-tl-xs p-5 sm:p-6 max-w-2xl w-full shadow-xs space-y-4">
                  {msg.data && (
                    <>
                      {/* Summary callout */}
                      <div className="bg-[#FBF8F2] p-4 rounded-xl border border-[#DED3C2] border-l-4 border-l-[#B96535] text-sm text-[#29251F] font-serif font-medium leading-relaxed">
                        {msg.data.summary}
                      </div>

                      {/* Structured Paragraphs with Inline Citations */}
                      <div className="space-y-3 text-sm text-[#51483F] leading-relaxed">
                        {msg.data.paragraphs.map((para, pIdx) => (
                          <p key={pIdx}>
                            {para}
                          </p>
                        ))}
                      </div>

                      {/* Source Citation Cards */}
                      <div className="pt-3 border-t border-[#DED3C2]">
                        <span className="text-xs font-semibold text-[#713F2B] uppercase tracking-wider block mb-2">
                          Archival Citations & Sources:
                        </span>
                        <div className="space-y-2">
                          {msg.data.citations.map((cite, cIdx) => (
                            <div
                              key={cIdx}
                              onClick={() => navigate(`/archive/${cite.recordId}`)}
                              className="p-3 bg-[#FBF8F2] hover:bg-[#FFF] border border-[#DED3C2] hover:border-[#B96535] rounded-lg transition-all cursor-pointer flex items-center justify-between gap-3 group"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#B96535]">
                                    {cite.marker}
                                  </span>
                                  <span className="font-serif font-bold text-sm text-[#29251F] group-hover:text-[#B96535] transition-colors">
                                    {cite.title} ({cite.year})
                                  </span>
                                </div>
                                <p className="text-xs text-[#827567] italic truncate max-w-md">
                                  "{cite.quoteSnippet}"
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-[#827567] group-hover:text-[#B96535] shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <button
                          onClick={() => handleCopyAnswer(msg.data!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FBF8F2] hover:bg-[#E7D5B9] text-[#51483F] hover:text-[#29251F] border border-[#DED3C2] transition-colors font-medium"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Answer & Bibliography</span>
                        </button>
                        <span className="text-[#827567]">{msg.timestamp}</span>
                      </div>

                      {/* Follow-up suggestions */}
                      {msg.data.suggestedFollowUps.length > 0 && (
                        <div className="pt-3 border-t border-[#DED3C2]">
                          <span className="text-xs text-[#827567] font-medium block mb-2">
                            Suggested Follow-up Inquiries:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.data.suggestedFollowUps.map((followUp, fIdx) => (
                              <button
                                key={fIdx}
                                onClick={() => handleAsk(followUp)}
                                className="px-2.5 py-1 text-xs rounded-full bg-[#FBF8F2] hover:bg-[#E7D5B9] border border-[#DED3C2] text-[#29251F] transition-colors text-left"
                              >
                                {followUp}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-[#B96535] text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-[#F5EBDD] border border-[#DED3C2] rounded-2xl p-4 text-xs sm:text-sm text-[#713F2B] font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B96535] animate-ping" />
              <span>{loadingStep}</span>
            </div>
          </div>
        )}

        {/* Error Simulation */}
        {simulatedError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Simulated network timeout during archival query synthesis.</span>
            </div>
            <button
              onClick={() => handleAsk(messages[messages.length - 1]?.text || 'Annihilation of Caste')}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded font-semibold text-red-900"
            >
              Retry Query
            </button>
          </div>
        )}

      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-[#F5EBDD] border-t border-[#DED3C2]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a historical question (e.g., 'What was the Poona Pact?')"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[#FFF] border border-[#DED3C2] rounded-xl text-sm text-[#29251F] placeholder-[#827567] focus:outline-none focus:ring-2 focus:ring-[#B96535] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="px-5 py-3 bg-[#B96535] hover:bg-[#713F2B] disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 text-center text-[11px] text-[#827567]">
          All answers are generated from local structured research records and link directly to primary catalog entries.
        </div>
      </div>

    </div>
  );
};
