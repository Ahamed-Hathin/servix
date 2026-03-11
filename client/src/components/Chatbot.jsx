import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import {
    HiOutlineChatBubbleLeftRight,
    HiOutlineXMark,
    HiOutlinePaperAirplane,
    HiOutlineSparkles,
} from "react-icons/hi2";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
        if (!hasGreeted) {
            setMessages([
                {
                    role: "bot",
                    text: "Hi 👋 I'm the Servix Assistant.\nHow can I help you today?",
                    time: new Date(),
                },
            ]);
            setHasGreeted(true);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isTyping) return;

        // Add user message
        const userMsg = { role: "user", text, time: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const { data } = await API.post("/chatbot", { message: text });

            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: data.data.reply,
                    time: new Date(),
                },
            ]);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                "Sorry, I'm having trouble right now. Please try again later.";

            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: errorMsg,
                    time: new Date(),
                    isError: true,
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Quick suggestion pills
    const suggestions = [
        "How to book a service?",
        "What payment methods?",
        "How does pricing work?",
        "Available services?",
    ];

    const handleSuggestion = (text) => {
        setInput(text);
        setTimeout(() => {
            const fakeEvent = { key: "Enter", shiftKey: false, preventDefault: () => { } };
            handleKeyDown(fakeEvent);
        }, 50);
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    id="chatbot-toggle"
                    onClick={handleOpen}
                    className="chatbot-fab"
                    aria-label="Open AI Chat Assistant"
                >
                    <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
                    {/* Pulse ring */}
                    <span className="chatbot-fab-ring" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window" id="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="flex items-center gap-3">
                            <div className="chatbot-avatar">
                                <HiOutlineSparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Servix Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-xs text-white/70">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            aria-label="Close chat"
                        >
                            <HiOutlineXMark className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`chatbot-msg ${msg.role === "user" ? "chatbot-msg-user" : "chatbot-msg-bot"} ${msg.isError ? "chatbot-msg-error" : ""}`}
                            >
                                {msg.role === "bot" && (
                                    <div className="chatbot-msg-avatar-sm">
                                        <HiOutlineSparkles className="w-3.5 h-3.5 text-primary-600" />
                                    </div>
                                )}
                                <div className={`chatbot-bubble ${msg.role === "user" ? "chatbot-bubble-user" : "chatbot-bubble-bot"}`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    <span className={`text-[10px] mt-1.5 block ${msg.role === "user" ? "text-white/60 text-right" : "text-gray-400"}`}>
                                        {formatTime(msg.time)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="chatbot-msg chatbot-msg-bot">
                                <div className="chatbot-msg-avatar-sm">
                                    <HiOutlineSparkles className="w-3.5 h-3.5 text-primary-600" />
                                </div>
                                <div className="chatbot-bubble chatbot-bubble-bot">
                                    <div className="chatbot-typing">
                                        <span /><span /><span />
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1">AI is typing...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions — only show if few messages */}
                    {messages.length <= 1 && !isTyping && (
                        <div className="chatbot-suggestions">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestion(s)}
                                    className="chatbot-suggestion-pill"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="chatbot-input-area">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isTyping}
                            maxLength={500}
                            className="chatbot-input"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="chatbot-send-btn"
                            aria-label="Send message"
                        >
                            <HiOutlinePaperAirplane className="w-4.5 h-4.5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
