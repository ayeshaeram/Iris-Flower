import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Minimize2,
  Maximize2,
  RefreshCw,
  HelpCircle,
  Flower2
} from 'lucide-react';
import { SPECIES_DETAILS, MODEL_METRICS } from '../data/irisDataset';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const INITIAL_SUGGESTIONS = [
  'Why are petals more critical than sepals?',
  'Explain why Setosa is linearly separable',
  'Which ML model performed best and why?',
  'What flower has sepal 5.0 and petal 1.5 cm?'
];

export const AiChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am your Botanical AI Assistant. Ask me anything about Iris flower morphology, scikit-learn models (KNN, SVM, Decision Tree), or how to classify specimen measurements.",
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Expert knowledge response generator
  const generateAiResponse = (userText: string): string => {
    const q = userText.toLowerCase();

    if (q.includes('petal') && (q.includes('sepal') || q.includes('better') || q.includes('critical') || q.includes('why'))) {
      return "CRITICAL INSIGHT: Petal dimensions (Length & Width) are the primary discriminants because their cluster distributions have virtually zero overlap between Setosa and the other species, and very sharp boundaries between Versicolor and Virginica. In contrast, Sepal dimensions have MEDIUM impact with significant overlapping variance.";
    }

    if (q.includes('setosa') || (q.includes('linear') && q.includes('separable'))) {
      return "Iris setosa is 100% linearly separable from the other two species. Any specimen with Petal Length < 2.45 cm or Petal Width < 0.8 cm is definitively Setosa. Classifiers effortlessly achieve 100% precision and recall on this class.";
    }

    if (q.includes('best') || q.includes('svm') || q.includes('knn') || q.includes('model') || q.includes('compare')) {
      const best = MODEL_METRICS.find(m => m.isBest) || MODEL_METRICS[0];
      return `Our benchmark evaluated 4 models on an 80/20 stratified split:\n• Support Vector Machine (SVM, RBF kernel): 96.67% accuracy (F1: 96.65%)\n• K-Nearest Neighbors (KNN, k=5): 96.67% accuracy\n• Logistic Regression: 96.67% accuracy\n• Decision Tree (Depth=3): 93.33% accuracy\n\nSVM was chosen as champion and saved to 'best_model.joblib' because of its robust margin maximization in non-linear boundary zones.`;
    }

    if (q.includes('versicolor')) {
      return "Iris versicolor is the intermediate species. Its petal length typically ranges between 3.0 and 5.1 cm, with petal width between 1.0 and 1.8 cm. It shares a slight border boundary with Virginica near petal width 1.7 cm.";
    }

    if (q.includes('virginica')) {
      return "Iris virginica has the largest floral morphology: petal length up to 6.9 cm and petal width up to 2.5 cm. High petal width (> 1.8 cm) is a critical indicator of Virginica.";
    }

    if (q.includes('split') || q.includes('80/20') || q.includes('train') || q.includes('test')) {
      return "The 150 Iris specimens are divided into:\n• Training Set: 120 specimens (80%) used to train the classifiers.\n• Test Set: 30 unseen specimens (20%, 10 of each species) used to evaluate true generalization accuracy.";
    }

    if (q.includes('sepal 5') || q.includes('petal 1')) {
      return "With Sepal ~5.0 cm and Petal ~1.5 cm, the specimen is unequivocally Iris setosa with ~99.8% model confidence.";
    }

    return "Based on Fisher's Iris taxonomy, classification is determined by the 4 continuous features: Sepal Length, Sepal Width, Petal Length, and Petal Width. Petal dimensions act as CRITICAL discriminants (high impact), while sepal dimensions serve as MEDIUM-impact supporting features. You can test any values in the Predict tab or upload a spreadsheet in Batch Analytics!";
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAiResponse(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl border border-slate-700/80 transition-all duration-300 btn-pressable cursor-pointer"
        >
          {/* Subtle pulse aura */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full" />

          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>Botanist AI</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300">
                Assistant
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Ask about Iris & ML
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? 'w-80 h-14' : 'w-[360px] sm:w-[410px] h-[520px]'
          }`}
        >
          {/* Chat Header */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Botanist AI Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400">
                  Taxonomic Knowledge & Model Helper
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (when not minimized) */}
          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                      <div
                        className={`text-[9px] mt-1 ${
                          msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2.5 items-center text-slate-500 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions chips */}
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                {INITIAL_SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(s)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask a question about the Iris dataset..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
