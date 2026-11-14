import React from 'react';
import { useCompliance } from '../context/ComplianceContext';
import { Navbar } from '../components/Navbar';
import { 
  Sparkles, 
  ArrowRight, 
  Shield, 
  CheckCircle2, 
  Calendar, 
  AlertTriangle, 
  Bot, 
  FileText, 
  Clock, 
  FileSpreadsheet,
  Receipt,
  Layers, 
  FolderArchive,
  Zap,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView } = useCompliance();

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F4F3FA] selection:bg-[#9466FF]/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9466FF]/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-subtle" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#6C8FFF]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#9466FF]/15 to-[#6C8FFF]/15 border border-[#9466FF]/30 text-xs font-semibold text-[#B69AFF]">
                <Sparkles className="w-3.5 h-3.5 text-[#9466FF]" />
                <span className="tracking-wide uppercase font-mono text-[11px]">AI-POWERED BUSINESS COMPLIANCE & AUTOMATION</span>
              </div>

              {/* Exact Requested Heading */}
              <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.12]">
                Your business deserves more than <br />
                <span className="bg-gradient-to-r from-[#B69AFF] via-[#9466FF] to-[#6C8FFF] bg-clip-text text-transparent">
                  just another checklist.
                </span>
              </h1>

              {/* Exact Requested Subheading */}
              <p className="text-lg sm:text-xl text-[#9295A5] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Understand compliance, automate business documents and stay ahead of every deadline with your intelligent business assistant.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActiveView('login')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-95 shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveView('dashboard')}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-semibold text-[#F4F3FA] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-[#9466FF]" />
                  <span>Explore Demo</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#9295A5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>GST Automated Preparation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9466FF]" />
                  <span>Statutory Rules Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6C8FFF]" />
                  <span>Client-Side Security</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Floating Dashboard Illustration with 4 Floating Document Previews */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Glowing Frame */}
                <div className="relative rounded-2xl p-1 bg-gradient-to-b from-[#9466FF]/40 via-white/10 to-transparent shadow-2xl backdrop-blur-xl">
                  <div className="rounded-xl bg-[#0D0F15] p-6 border border-white/10 space-y-4">
                    
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#9466FF]/20 flex items-center justify-center text-[#B69AFF]">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">NovaTech Solutions Private Limited</div>
                          <div className="text-[10px] text-[#9295A5]">Hyderabad, Telangana • GST Registered</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                        82% Healthy
                      </span>
                    </div>

                    {/* 4 Floating Document Previews (Requested by Section 5) */}
                    <div className="space-y-2.5">
                      
                      {/* Document Preview 1: GST Summary */}
                      <div 
                        onClick={() => setActiveView('gst-automation')}
                        className="p-3 rounded-xl bg-[#12151D] border border-white/10 hover:border-[#9466FF]/50 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-[#9466FF]/15 text-[#B69AFF]">
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-[#B69AFF]">
                              GST Summary Reconciliation
                            </div>
                            <div className="text-[10px] text-[#9295A5]">18 Sales Records • Net Tax: ₹4,12,300</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                          Reconciled
                        </span>
                      </div>

                      {/* Document Preview 2: Tax Invoice */}
                      <div 
                        onClick={() => setActiveView('document-studio')}
                        className="p-3 rounded-xl bg-[#12151D] border border-white/10 hover:border-[#6C8FFF]/50 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-[#6C8FFF]/15 text-[#6C8FFF]">
                            <Receipt className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-[#6C8FFF]">
                              Tax Invoice #INV-2026-088
                            </div>
                            <div className="text-[10px] text-[#9295A5]">Inter-State IGST • Grand Total: ₹1,41,600</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#6C8FFF]/10 text-[#6C8FFF] font-mono">
                          PDF Ready
                        </span>
                      </div>

                      {/* Document Preview 3: Agreement */}
                      <div 
                        onClick={() => setActiveView('document-studio')}
                        className="p-3 rounded-xl bg-[#12151D] border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-emerald-400">
                              Mutual NDA Agreement Draft
                            </div>
                            <div className="text-[10px] text-[#9295A5]">2-Year Duration • Telangana Jurisdiction</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 font-mono">
                          Draft Form
                        </span>
                      </div>

                      {/* Document Preview 4: Compliance Calendar */}
                      <div 
                        onClick={() => setActiveView('calendar')}
                        className="p-3 rounded-xl bg-[#12151D] border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-amber-400">
                              Smart Compliance Calendar
                            </div>
                            <div className="text-[10px] text-[#9295A5]">GSTR-3B due Nov 20 • Form AOC-4 pending</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
                          4 Deadlines
                        </span>
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: THE PROBLEM */}
      <section id="problem" className="py-20 bg-[#0D0F15]/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9466FF] font-mono">
              The Reality for Indian Founders
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Why business compliance and paperwork break down
            </h2>
            <p className="text-base text-[#9295A5]">
              Starting up requires velocity, but regulatory friction slows founders to a crawl.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                icon: Layers,
                title: 'Complicated Requirements',
                desc: 'Unclear distinction between central, state and municipal compliance rules.'
              },
              {
                icon: FileSpreadsheet,
                title: 'Manual Invoice Chaos',
                desc: 'Reconciling spreadsheets, matching recipient GSTINs and calculating net taxes by hand.'
              },
              {
                icon: AlertTriangle,
                title: 'Confusing Tax Filing',
                desc: 'GSTR-1, GSTR-3B, TDS Form 26Q and advance tax calculations with zero unified tracking.'
              },
              {
                icon: Clock,
                title: 'Missed Deadlines',
                desc: 'Daily compounding penalties (up to ₹100/day for MCA defaults) and DIN deactivations.'
              },
              {
                icon: FileText,
                title: 'Time-Consuming Drafting',
                desc: 'Paying expensive retainers for basic NDAs, contractor agreements and commercial quotes.'
              }
            ].map((prob, i) => {
              const Icon = prob.icon;
              return (
                <div 
                  key={i}
                  className="p-6 rounded-2xl bg-[#12151D] border border-white/5 hover:border-[#9466FF]/30 transition-all space-y-3 group hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#9466FF]/15 text-[#9295A5] group-hover:text-[#B69AFF] flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-base leading-snug">{prob.title}</h3>
                  <p className="text-xs text-[#9295A5] leading-relaxed">{prob.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: WHAT COMPLIO DOES (4 Premium Feature Cards) */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C8FFF] font-mono">
              Four Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              What COMPLIO does for modern founders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Bot,
                title: 'AI Compliance Intelligence',
                desc: 'Conversational assistant that interviews you, discovers applicable filings, and demystifies legal jargon without hallucination.'
              },
              {
                icon: FileSpreadsheet,
                title: 'GST Document Automation',
                desc: 'Upload sales register spreadsheets, validate recipient GSTINs, detect duplicate invoices, and compute net tax liability.'
              },
              {
                icon: Layers,
                title: 'Business Document Studio',
                desc: 'Generate Section 31 tax invoices and 6 standard commercial agreement drafts (NDAs, MSAs, contractor terms) instantly.'
              },
              {
                icon: Calendar,
                title: 'Smart Deadline Tracking',
                desc: 'Interactive monthly calendar, automated 7-day reminder simulations, and centralized document vault storage.'
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-[#12151D] border border-white/10 hover:border-[#9466FF]/40 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9466FF]/20 to-[#6C8FFF]/20 text-[#B69AFF] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-[#9295A5] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT WORKS (4 Steps) */}
      <section id="how-it-works" className="py-20 bg-[#0D0F15]/80 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9466FF] font-mono">
              Simple 4-Step Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              How COMPLIO automates compliance and paperwork
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Tell us about your business',
                desc: 'Quick 2-minute conversation about your entity structure, state, revenue scale and headcount.'
              },
              {
                num: '02',
                title: 'Discover your compliance obligations',
                desc: 'Deterministic rules database matches statutory triggers and flags items needing CA verification.'
              },
              {
                num: '03',
                title: 'Prepare documents automatically',
                desc: 'Extract spreadsheet records, compute net GST liabilities, and generate invoices and agreements.'
              },
              {
                num: '04',
                title: 'Track deadlines and stay compliant',
                desc: 'Interactive calendar and automated reminder simulation ensure zero unexpected statutory late fees.'
              }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#12151D] border border-white/10 hover:border-[#9466FF]/40 transition-all space-y-4"
              >
                <div className="text-3xl font-extrabold text-[#9466FF]/30 font-mono">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-xs text-[#9295A5] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: FINAL CTA */}
      <section className="py-24 relative bg-gradient-to-b from-[#08090D] via-[#12151D] to-[#08090D] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9466FF] to-[#6C8FFF] flex items-center justify-center mx-auto shadow-glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Spend less time managing paperwork. <br />
            Spend more time building your business.
          </h2>

          <p className="text-base text-[#9295A5] max-w-xl mx-auto">
            Take the 2-minute business assessment, discover applicable filing requirements, and automate your GST registers.
          </p>

          <button
            onClick={() => setActiveView('login')}
            className="px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#9466FF] to-[#6C8FFF] hover:opacity-95 shadow-glow hover:shadow-glow-lg transition-all inline-flex items-center gap-2"
          >
            <span>Start with COMPLIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#0B0D12] text-xs text-[#9295A5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#9466FF]" />
              <span className="font-bold text-white text-base tracking-tight">COMPLIO</span>
              <span className="text-[#9295A5]">| Business Compliance & Document Automation</span>
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => setActiveView('about')} className="hover:text-white transition-colors">About</button>
              <button onClick={() => setActiveView('gst-automation')} className="hover:text-white transition-colors">GST Studio</button>
              <button onClick={() => setActiveView('document-studio')} className="hover:text-white transition-colors">Documents</button>
              <button onClick={() => setActiveView('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] leading-relaxed text-gray-400">
            <strong className="text-white">Legal Disclaimer:</strong> COMPLIO is a decision-support and document-preparation tool. It does not replace professional CA, tax or legal advice. All regulatory requirements, penalties and due dates must be verified with official authorities and a qualified professional.
          </div>

          <div className="text-center text-[11px] text-[#9295A5]/60">
            © {new Date().getFullYear()} COMPLIO Technologies. Local Buildathon Demonstration Edition.
          </div>
        </div>
      </footer>
    </div>
  );
};
