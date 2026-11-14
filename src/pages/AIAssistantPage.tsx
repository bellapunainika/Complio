import React, { useState, useRef, useEffect } from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { 
  Bot, 
  Send, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  User,
  Briefcase,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { getAIResponseForPrompt } from '../data/aiKnowledgeBase';
import { ChatMessage, ComplianceItem, BusinessType, TurnoverRange, ForeignInvestmentStatus } from '../types';

interface OnboardingState {
  step: number;
  businessName?: string;
  locationState?: string;
  businessType?: BusinessType;
  turnoverRange?: TurnoverRange;
  gstRegistered?: boolean;
  employeeCount?: number;
  foreignInvestment?: ForeignInvestmentStatus;
}

export const AIAssistantPage: React.FC = () => {
  const { 
    currentProfile, 
    applyNewOnboardingData, 
    setActiveView,
    setSelectedComplianceDetail 
  } = useCompliance();

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingState>({ step: 1 });
  const [processingStep, setProcessingStep] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting according to Section 8 of user prompt
  const initialGreeting: ChatMessage = {
    id: 'greet-1',
    sender: 'ai',
    text: `Hello! I'm **COMPLIO AI**.

I can help you understand your business obligations, prepare compliance documents, organize your GST information and explain regulatory requirements.

What would you like to work on today?`,
    timestamp: 'Just now',
    options: [
      '🚀 What compliances apply to my business?',
      '📊 Prepare my GST summary',
      '📄 Generate an NDA',
      'Explain GST returns',
      'Show upcoming deadlines'
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, processingStep]);

  const startOnboardingFlow = () => {
    setOnboardingActive(true);
    setOnboardingData({ step: 1 });

    const q1: ChatMessage = {
      id: `onboard-q1-${Date.now()}`,
      sender: 'ai',
      text: `Let's set up your compliance profile! 💼\n\n**Question 1 of 7:** What is the legal name of your business?`,
      timestamp: 'Just now',
      step: 'businessName'
    };
    setMessages(prev => [...prev, q1]);
  };

  const handleOnboardingAnswer = (answer: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: answer,
      timestamp: 'Just now'
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const step = onboardingData.step;

      if (step === 1) {
        const nextData = { ...onboardingData, businessName: answer, step: 2 };
        setOnboardingData(nextData);
        setMessages(prev => [...prev, {
          id: `onboard-q2-${Date.now()}`,
          sender: 'ai',
          text: `Got it: **${answer}**! ✨\n\n**Question 2 of 7:** Which state is your business registered or headquartered in? (State-level rules like Professional Tax and Shops & Establishments depend on this.)`,
          timestamp: 'Just now',
          options: ['Telangana', 'Karnataka', 'Maharashtra', 'Gujarat', 'Tamil Nadu', 'Delhi'],
          step: 'locationState'
        }]);
      } else if (step === 2) {
        const nextData = { ...onboardingData, locationState: answer, step: 3 };
        setOnboardingData(nextData);
        setMessages(prev => [...prev, {
          id: `onboard-q3-${Date.now()}`,
          sender: 'ai',
          text: `Great, registered in **${answer}**.\n\n**Question 3 of 7:** What is your business legal structure?`,
          timestamp: 'Just now',
          options: [
            'Private Limited Company',
            'LLP',
            'Partnership',
            'Sole Proprietorship'
          ],
          step: 'businessType'
        }]);
      } else if (step === 3) {
        const nextData = { ...onboardingData, businessType: answer as BusinessType, step: 4 };
        setOnboardingData(nextData);
        setMessages(prev => [...prev, {
          id: `onboard-q4-${Date.now()}`,
          sender: 'ai',
          text: `Structure noted: **${answer}**.\n\n**Question 4 of 7:** What is your approximate annual turnover range?`,
          timestamp: 'Just now',
          options: [
            'Below ₹20 lakh',
            '₹20–40 lakh',
            '₹40 lakh–₹1 crore',
            '₹1–5 crore',
            'Above ₹5 crore'
          ],
          step: 'turnoverRange'
        }]);
      } else if (step === 4) {
        const nextData = { ...onboardingData, turnoverRange: answer as TurnoverRange, step: 5 };
        setOnboardingData(nextData);
        setMessages(prev => [...prev, {
          id: `onboard-q5-${Date.now()}`,
          sender: 'ai',
          text: `Turnover: **${answer}**.\n\n**Question 5 of 7:** Is your business currently registered under GST?`,
          timestamp: 'Just now',
          options: ['Yes', 'No'],
          step: 'gstRegistered'
        }]);
      } else if (step === 5) {
        const isGst = answer === 'Yes';
        const nextData = { ...onboardingData, gstRegistered: isGst, step: 6 };
        setOnboardingData(nextData);
        setMessages(prev => [...prev, {
          id: `onboard-q6-${Date.now()}`,
          sender: 'ai',
          text: `GST Status: **${answer}**.\n\n**Question 6 of 7:** How many full-time or contract employees do you have on payroll?`,
          timestamp: 'Just now',
          options: ['0', '1–10', '11–20', '21–50', 'Above 50'],
          step: 'employeeCount'
        }]);
      } else if (step === 6) {
        let count = 5;
        if (answer === '0') count = 0;
        else if (answer === '1–10') count = 5;
        else if (answer === '11–20') count = 15;
        else if (answer === '21–50') count = 35;
        else count = 60;

        const nextData = { ...onboardingData, employeeCount: count, step: 7 };
        setOnboardingData(nextData);
        setMessages(prev => [...prev, {
          id: `onboard-q7-${Date.now()}`,
          sender: 'ai',
          text: `Headcount: **${answer}**.\n\n**Question 7 of 7:** Have you received or are you planning to receive foreign investment or international venture capital? (FDI requires RBI FIRMS filings).`,
          timestamp: 'Just now',
          options: ['Yes', 'No', 'Not sure'],
          step: 'foreignInvestment'
        }]);
      } else if (step === 7) {
        const finalOnboarding: OnboardingState = {
          ...onboardingData,
          foreignInvestment: answer as ForeignInvestmentStatus,
          step: 8
        };
        setOnboardingData(finalOnboarding);
        setOnboardingActive(false);

        // Multi-stage animated processing sequence
        setProcessingStep('Understanding your business...');
        setTimeout(() => {
          setProcessingStep('Evaluating applicable compliance categories...');
          setTimeout(() => {
            setProcessingStep('Matching your business against the rules database...');
            setTimeout(() => {
              setProcessingStep('Preparing your personalized checklist...');
              setTimeout(() => {
                setProcessingStep(null);

                const generated = applyNewOnboardingData({
                  businessName: finalOnboarding.businessName || 'My Startup Pvt Ltd',
                  locationState: finalOnboarding.locationState || 'Telangana',
                  businessType: finalOnboarding.businessType || 'Private Limited Company',
                  turnoverRange: finalOnboarding.turnoverRange || '₹40 lakh–₹1 crore',
                  gstRegistered: finalOnboarding.gstRegistered !== undefined ? finalOnboarding.gstRegistered : true,
                  employeeCount: finalOnboarding.employeeCount || 5,
                  foreignInvestment: finalOnboarding.foreignInvestment || 'No',
                });

                const finalMessage: ChatMessage = {
                  id: `ai-complete-${Date.now()}`,
                  sender: 'ai',
                  text: `🎉 **Personalized Compliance Checklist Generated!**

Matched **${generated.length} statutory obligations** for **${finalOnboarding.businessType}** in **${finalOnboarding.locationState}**. 

Items requiring custom ledger examination are clearly labelled **"Needs CA Verification"**.`,
                  timestamp: 'Just now',
                  generatedChecklist: generated,
                  options: [
                    'View in My Compliance',
                    '📊 Prepare my GST summary',
                    '📄 Generate an NDA',
                    'Clear conversation'
                  ]
                };
                setMessages(prev => [...prev, finalMessage]);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }
    }, 400);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    setInputVal('');

    if (onboardingActive && onboardingData.step === 1) {
      handleOnboardingAnswer(text);
      return;
    }

    if (text.toLowerCase().includes('what compliances apply') || text.toLowerCase().includes('discover my compliances')) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, userMsg]);
      startOnboardingFlow();
      return;
    }

    if (text.toLowerCase().includes('prepare my gst summary') || text.toLowerCase().includes('gst summary')) {
      const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text, timestamp: 'Just now' };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `ai-gst-${Date.now()}`,
          sender: 'ai',
          text: `📊 **GST Preparation Ready:** 

I have organized your sales register and credit notes inside the **GST Automation Studio**.
• **18 Total Records Analyzed**
• **Net Tax Liability:** ₹4,12,300 (CGST + SGST + IGST)
• **Duplicate Invoices & Missing Fields Flagged** for review.

Would you like to open the **GST Automation Studio** now to inspect the reconciliation and download the PDF report?`,
          timestamp: 'Just now',
          options: ['Open GST Automation Studio', 'Explain GST returns', 'Generate an NDA']
        }]);
      }, 500);
      return;
    }

    if (text.toLowerCase().includes('generate an nda') || text.toLowerCase().includes('nda')) {
      const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text, timestamp: 'Just now' };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `ai-nda-${Date.now()}`,
          sender: 'ai',
          text: `📄 **Mutual NDA Drafting Ready:**

COMPLIO has an automated agreement studio ready with an editable Mutual Non-Disclosure Agreement template pre-filled with **${currentProfile.businessName}** as the Disclosing Party.

Would you like to open the **Document Studio** to review and download the PDF draft?`,
          timestamp: 'Just now',
          options: ['Open Document Studio', 'Prepare my GST summary', 'What compliances apply to my business?']
        }]);
      }, 500);
      return;
    }

    if (text === 'Open GST Automation Studio') {
      setActiveView('gst-automation');
      return;
    }

    if (text === 'Open Document Studio') {
      setActiveView('document-studio');
      return;
    }

    if (text === 'View in My Compliance') {
      setActiveView('tasks');
      return;
    }

    if (text === 'Show upcoming deadlines') {
      setActiveView('calendar');
      return;
    }

    if (text === 'Clear conversation') {
      setMessages([initialGreeting]);
      setOnboardingActive(false);
      return;
    }

    // Free text question
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responseText = getAIResponseForPrompt(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: 'Just now',
        options: [
          '🚀 What compliances apply to my business?',
          '📊 Prepare my GST summary',
          '📄 Generate an NDA',
          'What is DIR-3 KYC?'
        ]
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col rounded-2xl bg-[#0D0F15] border border-white/10 shadow-2xl overflow-hidden animate-fadeIn">
      
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0B0D12] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9466FF] to-[#6C8FFF] flex items-center justify-center text-white shadow-glow">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B0D12]"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-display">COMPLIO AI</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#9466FF]/20 text-[#B69AFF] font-mono">
                Assistant Online
              </span>
            </div>
            <p className="text-xs text-[#9295A5]">
              Compliance intelligence, GST organization & document automation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!onboardingActive && (
            <button
              onClick={startOnboardingFlow}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Onboarding</span>
            </button>
          )}

          <button
            onClick={() => {
              setMessages([initialGreeting]);
              setOnboardingActive(false);
              setProcessingStep(null);
            }}
            title="Clear Chat Conversation"
            className="p-2 rounded-lg text-[#9295A5] hover:text-white hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Onboarding Progress Banner */}
      {onboardingActive && (
        <div className="px-6 py-3 bg-[#12151D] border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#B69AFF] font-medium">
            <Briefcase className="w-4 h-4 text-[#9466FF]" />
            <span>Interactive Business Onboarding Interview</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#9295A5]">Step {onboardingData.step} of 7</span>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] transition-all duration-300"
                style={{ width: `${(onboardingData.step / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${isAi ? 'items-start' : 'items-start justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-lg bg-[#9466FF]/20 text-[#B69AFF] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-3 max-w-[85%] sm:max-w-2xl ${isAi ? '' : 'text-right'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isAi
                      ? 'bg-[#12151D] text-gray-200 border border-white/10 shadow-sm'
                      : 'bg-gradient-to-r from-[#9466FF] to-[#7B4AE2] text-white shadow-glow'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Generated Checklist Cards */}
                {msg.generatedChecklist && (
                  <div className="space-y-2 mt-4 text-left">
                    <div className="text-xs uppercase font-mono text-[#9295A5] px-1">
                      Matched Compliance Obligations ({msg.generatedChecklist.length}):
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.generatedChecklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedComplianceDetail(item)}
                          className="p-3 rounded-xl bg-[#08090D] border border-white/10 hover:border-[#9466FF]/50 cursor-pointer transition-all space-y-1.5 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#9295A5]">
                              {item.category}
                            </span>
                            <span className={`text-[10px] font-semibold ${
                              item.isVerified ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {item.isVerified ? 'Verified Rule' : 'Needs CA Verification'}
                            </span>
                          </div>
                          
                          <div className="text-xs font-bold text-white group-hover:text-[#B69AFF] transition-colors line-clamp-1">
                            {item.name}
                          </div>

                          <div className="text-[11px] text-[#9295A5] flex items-center justify-between pt-1">
                            <span>{item.responsibleAuthority}</span>
                            <span className="text-white font-medium">{item.frequency}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setActiveView('tasks')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all flex items-center gap-2"
                      >
                        <span>Open Checklist in My Compliance</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActiveView('gst-automation')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-[#B69AFF] bg-[#9466FF]/20 hover:bg-[#9466FF]/30 transition-all flex items-center gap-2"
                      >
                        <span>Prepare GST Return</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggested Chips */}
                {msg.options && msg.options.length > 0 && (
                  <div className={`flex flex-wrap gap-2 pt-1 ${isAi ? 'justify-start' : 'justify-end'}`}>
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (onboardingActive) {
                            handleOnboardingAnswer(opt);
                          } else {
                            handleSendMessage(opt);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#12151D] hover:bg-[#9466FF]/20 text-[#B69AFF] border border-white/10 hover:border-[#9466FF]/40 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Processing Simulation Animation */}
        {processingStep && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#12151D] border border-[#9466FF]/40 max-w-md animate-pulse">
            <div className="w-6 h-6 border-2 border-[#9466FF] border-t-transparent rounded-full animate-spin shrink-0"></div>
            <div className="text-xs text-white font-medium">
              {processingStep}
            </div>
          </div>
        )}

        {isTyping && !processingStep && (
          <div className="flex items-center gap-2 text-xs text-[#9295A5] pl-11">
            <span className="w-2 h-2 rounded-full bg-[#9466FF] animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-[#9466FF] animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-[#9466FF] animate-bounce [animation-delay:0.4s]"></span>
            <span>COMPLIO AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="p-4 border-t border-white/10 bg-[#0B0D12]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              onboardingActive && onboardingData.step === 1
                ? 'Type your business name and press Enter...'
                : 'Ask about GST, ROC filings, NDAs, or click a suggestion above...'
            }
            className="flex-1 px-4 py-3 rounded-xl bg-[#12151D] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#9466FF] text-sm"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() && !(onboardingActive && onboardingData.step === 1)}
            className="p-3 rounded-xl text-white bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-[#9295A5] mt-2 px-1">
          <span>Decision support & document preparation only. Verify with your CA.</span>
          <span>COMPLIO Local Intelligence Layer</span>
        </div>
      </div>

    </div>
  );
};
