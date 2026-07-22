import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';

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
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('ksp_gemini_api_key') || '';
  });
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'gemini',
      text: `### 🛡️ KSP Gemini AI Intelligence Copilot
Welcome to Karnataka State Police AI Intelligence. I am powered by **Google Gemini**.

How can I assist your command center today? Ask about district threat levels, tactical patrol routes, or criminal network analysis.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'gemini-2.0-flash',
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

    try {
      const response = await api.analyzeWithAI(query, undefined, apiKey);
      const botMessage: Message = {
        id: `g-${Date.now()}`,
        sender: 'gemini',
        text: response.analysis || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: response.model || 'gemini-flash',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'gemini',
          text: `⚠️ **API Error**: Could not connect to Gemini service. ${err?.message || ''}\n\nPlease check your internet connection or update your API Key.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
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
        <span>{isOpen ? 'Close AI Copilot' : 'KSP Gemini AI'}</span>
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
                  KSP Gemini AI Copilot
                  <span
                    style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#4ade80',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      fontWeight: 600,
                    }}
                  >
                    Active
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
                title="Configure Gemini API Key"
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
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Gemini is analyzing crime intelligence...</span>
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
              placeholder="Ask Gemini AI (e.g., patrol routes, district crime risk)..."
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
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', margin: 0 }}>🔑 Configure Gemini API Key</h3>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>
              Your key is saved locally in your browser. The default active key is already loaded for KSP Crime Analytics.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: 6 }}>
                Google Gemini API Key
              </label>
              <input
                type="text"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="AQ.Ab8RN6IVFfDYX..."
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
