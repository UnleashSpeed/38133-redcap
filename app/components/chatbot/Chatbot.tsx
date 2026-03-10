"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Lightbulb,
  BookOpen,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuickPrompt {
  id: string;
  text: string;
  icon: React.ElementType;
}

const quickPrompts: QuickPrompt[] = [
  { id: "1", text: "What is RedCap RLM?", icon: BookOpen },
  { id: "2", text: "Explain P-Factor calculation", icon: Zap },
  { id: "3", text: "1Rx vs 2Rx comparison", icon: Lightbulb },
  { id: "4", text: "When to use measurement gaps?", icon: BookOpen },
];

// Simulated AI responses based on keywords
const getAIResponse = (userMessage: string): { content: string; suggestions: string[] } => {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes("rlm") || lowerMsg.includes("radio link")) {
    return {
      content: `Radio Link Monitoring (RLM) in RedCap is used to detect out-of-sync and in-sync conditions. 

**Key Points:**
- Monitors downlink radio link quality
- Uses reference signals (SSB, CSI-RS)
- Triggers when Qout (out-of-sync) or Qin (in-sync) thresholds are crossed
- Different evaluation periods for 1Rx (400ms) vs 2Rx (200ms)

The RLM process helps determine when the UE should declare radio link failure and initiate recovery procedures.`,
      suggestions: [
        "What are Qout and Qin thresholds?",
        "How does DRX affect RLM?",
        "RLM during measurement gaps",
      ],
    };
  }

  if (lowerMsg.includes("p-factor") || lowerMsg.includes("pfactor")) {
    return {
      content: `The **P-Factor** is used to scale evaluation periods during measurement gaps.

**Formula:**
\`P = 1 / (1 - TSSB / MGRP)\`

Where:
- **TSSB**: Time between SSB transmissions (10-160ms)
- **MGRP**: Measurement Gap Repetition Period (20-160ms)

**Example:**
If TSSB = 40ms and MGRP = 80ms:
\`P = 1 / (1 - 40/80) = 1 / 0.5 = 2\`

This means the evaluation period is doubled during gaps.`,
      suggestions: [
        "Calculate P-Factor for my config",
        "How does P-Factor affect TEvaluate?",
        "P-Factor limitations",
      ],
    };
  }

  if (lowerMsg.includes("1rx") || lowerMsg.includes("2rx") || lowerMsg.includes("receive")) {
    return {
      content: `**1Rx vs 2Rx Comparison:**

| Metric | 1Rx | 2Rx |
|--------|-----|-----|
| Out-of-Sync Period | 400ms | 200ms |
| PDCCH CCE (Out) | 16 | 8 |
| PRB Allocation | 48 | 24 |
| Diversity Gain | 0 dB | ~3 dB |
| Power Consumption | Lower | Higher |

**When to use 1Rx:**
- Power-constrained IoT devices
- Cost-sensitive applications
- Good coverage areas

**When to use 2Rx:**
- Cell edge coverage
- High capacity needs
- Reliability-critical applications`,
      suggestions: [
        "Power consumption comparison",
        "Coverage impact of 2Rx",
        "Cost difference analysis",
      ],
    };
  }

  if (lowerMsg.includes("tevaluate") || lowerMsg.includes("evaluation period")) {
    return {
      content: `**TEvaluate** is the evaluation period for 2Rx out-of-sync detection.

**Formula:**
\`TEvaluate = Max(200, Ceil(10 × P) × TSSB)\`

**Key Points:**
- Minimum value is **200ms**
- Depends on P-Factor and TSSB
- Only applies to 2Rx configuration
- Ensures reliable out-of-sync detection

**Example:**
With P = 2 and TSSB = 20ms:
\`TEvaluate = Max(200, Ceil(20) × 20) = Max(200, 400) = 400ms\``,      suggestions: [
        "TEvaluate vs 1Rx evaluation",
        "Impact of DRX on TEvaluate",
        "Calculate TEvaluate for me",
      ],
    };
  }

  if (lowerMsg.includes("gap") || lowerMsg.includes("measurement gap")) {
    return {
      content: `**Measurement Gaps** are periods when the UE temporarily stops serving cell communication to measure other frequencies.

**Types:**
- **Per-UE gaps**: Affect all carriers
- **Per-FR gaps**: Affect one frequency range

**Key Parameters:**
- **MGRP**: Gap repetition period
- **MGL**: Gap length
- **MGO**: Gap offset

**Impact on RLM:**
- Evaluation periods are scaled by P-Factor
- CSSF scales CSI measurements
- May miss SSBs during gaps

The gap configuration must balance measurement needs with service continuity.`,
      suggestions: [
        "Gap configuration examples",
        "CSSF calculation",
        "Impact on throughput",
      ],
    };
  }

  if (lowerMsg.includes("cssf") || lowerMsg.includes("csi")) {
    return {
      content: `**CSSF (CSI Scaling Factor)** scales Channel State Information measurements during gaps.

**Formula:**
\`CSSF_within_gap = 1 / (1 - Mtot × Ri)\`

Where:
- **Mtot**: Total measurement gap ratio
- **Ri**: CSI-RS periodicity ratio

**Purpose:**
- Compensates for missed CSI-RS during gaps
- Ensures accurate channel quality reporting
- Maintains link adaptation performance

Higher CSSF values indicate more aggressive scaling is needed due to frequent gaps.`,
      suggestions: [
        "Calculate CSSF for my config",
        "CSSF vs P-Factor differences",
        "Impact on MCS selection",
      ],
    };
  }

  if (lowerMsg.includes("nserv") || lowerMsg.includes("serving cell")) {
    return {
      content: `**Nserv_RedCap** is the serving cell evaluation period for RedCap devices.

**Factors affecting Nserv:**
- DRX cycle length
- eDRX configuration (if enabled)
- Paging Time Window (PTW)
- Number of Rx antennas (1Rx/2Rx)

**General behavior:**
- Longer DRX → Longer Nserv
- 1Rx typically has longer Nserv than 2Rx
- eDRX can significantly extend evaluation periods

The exact formula depends on the specific 3GPP release and implementation.`,
      suggestions: [
        "Nserv calculation example",
        "eDRX impact on Nserv",
        "DRX cycle selection",
      ],
    };
  }

  if (lowerMsg.includes("redcap") || lowerMsg.includes("reduced capability")) {
    return {
      content: `**RedCap (Reduced Capability)** is a 5G NR device category designed for mid-range IoT applications.

**Key Characteristics:**
- Reduced bandwidth (max 20MHz)
- Lower peak data rates
- Optional features (CA, DC, etc.)
- Support for 1Rx or 2Rx configurations
- Lower power consumption than standard 5G

**Use Cases:**
- Industrial sensors
- Wearables
- Smart meters
- Surveillance cameras

RedCap bridges the gap between LPWA (NB-IoT) and enhanced mobile broadband.`,
      suggestions: [
        "RedCap vs LTE-M comparison",
        "RedCap bandwidth options",
        "RedCap power saving features",
      ],
    };
  }

  // Default response
  return {
    content: `I can help you with RedCap RRM topics! Here are some things I can explain:

• **Radio Link Monitoring (RLM)** - Out-of-sync/in-sync detection
• **P-Factor** - Gap scaling calculation
• **1Rx vs 2Rx** - Receive antenna configurations
• **TEvaluate** - Evaluation period for 2Rx
• **Measurement Gaps** - Gap configuration and impact
• **CSSF** - CSI scaling factor
• **Nserv_RedCap** - Serving cell evaluation

Try asking about any of these topics, or use the quick prompts below!`,
    suggestions: [
      "What is RedCap RLM?",
      "Explain P-Factor calculation",
      "1Rx vs 2Rx comparison",
    ],
  };
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your RedCap RRM assistant. Ask me anything about Radio Link Monitoring, P-Factor, 1Rx/2Rx configurations, or other RedCap topics!",
      timestamp: new Date(),
      suggestions: quickPrompts.map((p) => p.text),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => handleSend(), 100);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\`(.*?)\`/g, "<code class=\"bg-slate-100 px-1 py-0.5 rounded text-sm font-mono\">$1</code>")
      .replace(/\n/g, "<br />");
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow ${
          isOpen ? "hidden" : ""
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Ask RedCap Anything</h3>
                    <p className="text-xs text-white/70">AI-powered RRM assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-blue-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block max-w-[85%] p-3 rounded-2xl text-left ${
                        message.role === "user"
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-white border border-slate-200 rounded-bl-md shadow-sm"
                      }`}
                    >
                      <div
                        className={`text-sm ${
                          message.role === "user" ? "text-white" : "text-slate-700"
                        }`}
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />

                      {/* Copy button for assistant messages */}
                      {message.role === "assistant" && (
                        <button
                          onClick={() => handleCopy(message.content, message.id)}
                          className="mt-2 p-1 hover:bg-slate-100 rounded transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickPrompt(suggestion)}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md p-3 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Quick prompts:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => {
                    const Icon = prompt.icon;
                    return (
                      <button
                        key={prompt.id}
                        onClick={() => handleQuickPrompt(prompt.text)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                      >
                        <Icon className="w-3 h-3" />
                        {prompt.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about RedCap RLM..."
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;
