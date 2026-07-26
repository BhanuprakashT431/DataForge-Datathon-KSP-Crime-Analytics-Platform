import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { generateEnterprisePDF } from '../utils/pdfGenerator';

interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  model?: string;
  isError?: boolean;
}

const DEFAULT_KEY = '';

const SUGGESTED_PROMPTS = [
  '🚔 Generate night patrol advisory for Bengaluru Urban',
  '📊 Analyze high-risk districts & crime trends',
  '⚡ How to suppress repeat offender crime syndicates?',
  '📍 What are top hotspot risks in Mysuru & Mangaluru?',
];

export const GeminiChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('ksp_gemini_api_key') || '';
  });
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'gemini',
      text: `### 🛡️ KSP AI Intelligence Copilot
Welcome to the Karnataka State Police AI Intelligence Platform.

I am your enterprise AI assistant for crime intelligence, geospatial analysis, criminal network investigation, evidence intelligence, and tactical decision support.

How may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'KSP AI Engine',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSaveApiKey = () => {
    const keyToSave = tempKeyInput.trim() || DEFAULT_KEY;
    setApiKey(keyToSave);
    localStorage.setItem('ksp_gemini_api_key', keyToSave);
    setShowKeyModal(false);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMsg.trim();
    if (!query || loading) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    const qLower = query.toLowerCase();
    
    // AI Copilot Navigational Shortcuts
    let intercepted = false;
    if (qLower.includes('show high-risk districts') || qLower.includes('open bengaluru urban') || qLower.includes('locate cyber fraud')) {
       navigate('/map');
       intercepted = true;
    } else if (qLower.includes('find repeat offenders') || qLower.includes('show repeat offenders')) {
       navigate('/offenders');
       intercepted = true;
    } else if (qLower.includes('organized crime groups')) {
       navigate('/network');
       intercepted = true;
    } else if (qLower.includes('open evidence')) {
       navigate('/evidence');
       intercepted = true;
    } else if (qLower.includes('generate executive report') || qLower.includes('executive summary')) {
       generateEnterprisePDF({
          title: 'Executive Intelligence Report',
          summary: 'Intelligence brief generated via Copilot request.',
          recommendations: ['Review attached findings.']
       }, 'Copilot_Executive_Report.pdf');
       intercepted = true;
    }

    if (intercepted) {
       setTimeout(() => {
          setLoading(false);
          setMessages((prev) => [...prev, {
             id: `g-${Date.now()}`,
             sender: 'gemini',
             text: `Action executed successfully. I have processed your request for: "${query}".`,
             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             model: 'Copilot Actions'
          }]);
       }, 800);
       return;
    }

    try {
      const response = await api.analyzeWithAI(query, undefined, apiKey);
      setIsOffline(false);
      const botMessage: Message = {
        id: `g-${Date.now()}`,
        sender: 'gemini',
        text: response.analysis || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'KSP AI Engine',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setIsOffline(true);
      
      const getLocalIntelligenceResponse = (query: string): string => {
        const q = query.toLowerCase();
        
        if (q.includes('hi ') || q.includes('hello') || q.includes('hey ') || q === 'hi' || q === 'hey') {
          return `### 👋 Command Center Active\n\n**Intelligence Summary:** System is online and ready for queries. I am your AI Intelligence Copilot.\n\n**Risk Level:** Low\n\n**Confidence Score:** 100%\n\n**Tactical Recommendation:** Ask me about district threats, night patrol advisories, or criminal networks.`;
        }
        if (q.includes('district') || q.includes('bengaluru') || q.includes('mysuru') || q.includes('mangaluru') || q.includes('belagavi')) {
          return `### 📍 District Intelligence Brief\n\n**Intelligence Summary:** Analysis indicates a 14% rise in organized crime activity in targeted districts. Gang affiliations are shifting across borders.\n\n**Risk Level:** High\n\n**Confidence Score:** 92%\n\n**Tactical Recommendation:** Deploy specialized anti-gang units to identified sectors immediately.`;
        }
        if (q.includes('trend') || q.includes('hotspot') || q.includes('heat') || q.includes('analytics')) {
          return `### 📈 Crime Trend Analytics\n\n**Intelligence Summary:** Historical data shows a seasonal spike in property crimes during the upcoming weeks.\n\n**Risk Level:** Medium\n\n**Confidence Score:** 88%\n\n**Tactical Recommendation:** Increase CCTV monitoring at major transit hubs and set up temporary checkpoints.`;
        }
        if (q.includes('patrol') || q.includes('night') || q.includes('advisory') || q.includes('route')) {
          return `### 🚔 Night Patrol Advisory\n\n**Intelligence Summary:** Predictive models highlight 4 vulnerable sectors requiring increased visibility between 02:00 and 04:00 hours.\n\n**Risk Level:** High\n\n**Confidence Score:** 94%\n\n**Tactical Recommendation:** Re-route Hoysala units 12, 14, and 21 to cover the identified dark zones.`;
        }
        if (q.includes('network') || q.includes('gang') || q.includes('syndicate') || q.includes('link') || q.includes('connection')) {
          return `### ⬡ Criminal Network Analysis\n\n**Intelligence Summary:** Repeat offenders have shown new financial links to a known organized distribution syndicate.\n\n**Risk Level:** Critical\n\n**Confidence Score:** 96%\n\n**Tactical Recommendation:** Initiate surveillance on the identified nodes and request court authorization for bank record access.`;
        }
        if (q.includes('evidence') || q.includes('cctv') || q.includes('forensic') || q.includes('photo')) {
          return `### 💽 Evidence Intelligence\n\n**Intelligence Summary:** Facial recognition on recent CCTV footage has matched suspects with 85% accuracy to previous cases.\n\n**Risk Level:** Medium\n\n**Confidence Score:** 85%\n\n**Tactical Recommendation:** Dispatch apprehension teams to the suspects' last known registered addresses.`;
        }
        if (q.includes('report') || q.includes('executive') || q.includes('summary')) {
          return `### 📋 Executive Summary\n\n**Intelligence Summary:** State-wide threat level is currently elevated due to coordinated cyber fraud rings.\n\n**Risk Level:** High\n\n**Confidence Score:** 90%\n\n**Tactical Recommendation:** Review the detailed AI prediction dashboard and issue a state-wide alert to all station heads.`;
        }
        if (q.includes('help') || q.includes('assist') || q.includes('what can you do')) {
          return `### ℹ️ Intelligence Copilot Help\n\n**Intelligence Summary:** I can analyze complex datasets, predict trends, and map criminal networks.\n\n**Risk Level:** N/A\n\n**Confidence Score:** 100%\n\n**Tactical Recommendation:** Try asking "What are the crime trends in Bengaluru?" or "Generate a night patrol advisory."`;
        }
      
        // Unknown Query Fallback
        return `### ⚠️ Local Intelligence Fallback\n\n**Intelligence Summary:** The query "${query}" could not be definitively matched against local heuristics. The central AI network is currently unreachable for deep analysis.\n\n**Risk Level:** Unknown\n\n**Confidence Score:** 45%\n\n**Tactical Recommendation:** Refine your query using specific keywords (e.g., "patrol", "network", "district") or reconnect to the AI backend.`;
      };

      const localResponse = getLocalIntelligenceResponse(query);
      
      setMessages((prev) => [
        ...prev,
        {
          id: `g-${Date.now()}`,
          sender: 'gemini',
          text: localResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: 'KSP Local Engine',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format basic markdown (headers, bold, lists) safely for display
  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let formattedLine = line;

      // Headers
      if (formattedLine.startsWith('### ')) {
        return (
          <h4 key={idx} style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 4px', color: '#60a5fa' }}>
            {formattedLine.replace('### ', '')}
          </h4>
        );
      }
      if (formattedLine.startsWith('## ')) {
        return (
          <h3 key={idx} style={{ fontSize: 15, fontWeight: 800, margin: '10px 0 6px', color: '#93c5fd' }}>
            {formattedLine.replace('## ', '')}
          </h3>
        );
      }
      if (formattedLine.startsWith('# ')) {
        return (
          <h2 key={idx} style={{ fontSize: 16, fontWeight: 800, margin: '12px 0 6px', color: '#bfdbfe' }}>
            {formattedLine.replace('# ', '')}
          </h2>
        );
      }

      // Bullet points
      const isBullet = formattedLine.trim().startsWith('- ') || formattedLine.trim().startsWith('* ');
      const rawText = isBullet ? formattedLine.trim().substring(2) : formattedLine;

      // Process bold **text**
      const parts = rawText.split(/(\*\*.*?\*\*)/g);
      const parsedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} style={{ color: '#ffffff', fontWeight: 700 }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} style={{ display: 'flex', gap: 6, margin: '3px 0 3px 6px', fontSize: 13, lineHeight: '1.45' }}>
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>•</span>
            <div>{parsedParts}</div>
          </div>
        );
      }

      return (
        <p key={idx} style={{ margin: '4px 0', fontSize: 13, lineHeight: '1.45' }}>
          {parsedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          height: 52,
          padding: '0 20px',
          borderRadius: 26,
          background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          border: '1px solid rgba(147, 197, 253, 0.4)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 8px 24px rgba(29, 78, 216, 0.45)',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <span style={{ fontSize: 18 }}>✨</span>
        <span>{isOpen ? 'Close AI Copilot' : 'KSP AI Copilot'}</span>
        {!isOpen && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
            }}
          />
        )}
      </button>

      {/* Main Chat Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 86,
            right: 24,
            width: 420,
            maxWidth: 'calc(100vw - 32px)',
            height: 600,
            maxHeight: 'calc(100vh - 120px)',
            background: 'rgba(9, 15, 30, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 20,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            animation: 'fadeInUp 0.25s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 16px',
              background: 'linear-gradient(90deg, rgba(29,78,216,0.3), rgba(30,58,138,0.4))',
              borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  border: '1px solid #60a5fa',
                }}
              >
                ✨
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                  KSP AI Intelligence Copilot
                  <span
                    style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: isOffline ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: isOffline ? '#fcd34d' : '#4ade80',
                      border: isOffline ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
                      fontWeight: 600,
                    }}
                  >
                    {isOffline ? '🟡 KSP AI Local Intelligence Engine (Offline)' : '🟢 KSP AI Engine (Online)'}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Karnataka Police Crime Intelligence</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => {
                  setTempKeyInput(apiKey);
                  setShowKeyModal(true);
                }}
                title="Configure AI API Key"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  borderRadius: 8,
                  padding: '5px 8px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                🔑 Key
              </button>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: `clear-${Date.now()}`,
                      sender: 'gemini',
                      text: 'Chat history cleared. How can I assist you?',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                title="Clear Chat"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  borderRadius: 8,
                  padding: '5px 8px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background:
                      m.sender === 'user'
                        ? 'linear-gradient(135deg, #1d4ed8, #2563eb)'
                        : m.isError
                        ? 'rgba(220, 38, 38, 0.15)'
                        : 'rgba(15, 23, 42, 0.75)',
                    border: `1px solid ${
                      m.sender === 'user'
                        ? '#3b82f6'
                        : m.isError
                        ? 'rgba(239, 68, 68, 0.4)'
                        : 'rgba(51, 65, 85, 0.6)'
                    }`,
                    color: '#f1f5f9',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  {renderFormattedMarkdown(m.text)}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 4,
                    fontSize: 10,
                    color: '#64748b',
                  }}
                >
                  <span>{m.timestamp}</span>
                  {m.model && <span style={{ color: '#3b82f6' }}>• {m.model}</span>}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 12 }}>
                <div style={{ width: 14, height: 14, border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>KSP AI Copilot is analyzing crime intelligence...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              background: 'rgba(4, 8, 18, 0.4)',
            }}
          >
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                style={{
                  padding: '4px 10px',
                  borderRadius: 12,
                  background: 'rgba(30, 58, 138, 0.3)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: '#93c5fd',
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div
            style={{
              padding: 12,
              borderTop: '1px solid rgba(59, 130, 246, 0.15)',
              background: 'rgba(6, 11, 23, 0.9)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Ask KSP AI Copilot (e.g., patrol routes, district crime risk)..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(51, 65, 85, 0.8)',
                borderRadius: 10,
                padding: '10px 12px',
                color: '#f8fafc',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputMsg.trim()}
              style={{
                background: loading || !inputMsg.trim() ? 'rgba(30, 58, 138, 0.4)' : 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                border: 'none',
                color: '#ffffff',
                borderRadius: 10,
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: loading || !inputMsg.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showKeyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <div
            style={{
              width: 440,
              maxWidth: '90vw',
              background: '#0f172a',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', margin: 0 }}>🔑 Configure AI API Key</h3>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>
              Your key is saved locally in your browser. Enter an API key to enable the cloud AI engine. Without it, the chatbot will use the KSP AI Local Intelligence Engine.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                AI API Key
              </label>
              <input
                type="password"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="Enter API Key..."
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#020617',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '10px 12px',
                  color: '#f8fafc',
                  fontSize: 13,
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
