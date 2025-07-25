    import { useState, useRef, useEffect } from "react";
    import { FaPaperPlane } from "react-icons/fa";

    export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const simulateTypingEffect = async (text, delay = 30) => {
        let index = 0;
        let currentText = "";
        while (index < text.length) {
        currentText += text[index];
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.sender === "bot") {
            const updatedMessage = { ...lastMessage, text: currentText };
            return [...prev.slice(0, -1), updatedMessage];
            } else {
            return [...prev, { sender: "bot", text: currentText }];
            }
        });
        index++;
        await new Promise(resolve => setTimeout(resolve, delay));
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        setIsTyping(true);

        try {
        const res = await fetch("https://lumina-assistance.onrender.com/chat", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: input })
        });

        const data = await res.json();
        await new Promise(resolve => setTimeout(resolve, 500)); 

        // Add empty bot message first
        setMessages(prev => [...prev, { sender: "bot", text: "" }]);

        // Typing effect
        await simulateTypingEffect(data.reply);
        } catch (err) {
        console.log(err);
        setMessages(prev => [...prev, { sender: "bot", text: " :( Something went wrong." }]);
        }

        setIsTyping(false);
    };

    return (
        <div className=" bg-[#121212] text-white h-screen  flex flex-col">
        <div className="p-4  border-amber-800 shadow-lg shadow-amber-600 text-xl font-semibold bg-[#1e1e1e]">
            Lumina
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:px-8 mt-1.5 space-y-4 ">
            {messages.length > 0 ?
            messages.map((msg, idx) => (
                <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                <div
                    className={`max-w-[80%] px-4 py-2 text-left rounded-lg text-sm leading-relaxed shadow-md whitespace-pre-line ${msg.sender === "user"
                        ? "bg-amber-900 text-white"
                        : "bg-[#2a2a2a] text-gray-200"
                    }`}
                >
                    {msg.text}
                </div>
                </div>
            )) :
            <div className="absolute top-[35%] left-[10%] h-[30%] w-[80%]  text-5xl  flex flex-col gap-3 justify-center text-center">
                <p className="text-xl text-amber-600">Hi! I am Lumina, Shibjyoti's Personal AI Assistance</p>
                How can I help you ?
                <p className="text-xl">I will try to answer anything about him</p>
            </div>
            }

            {isTyping && (
            <div className="flex justify-start">
                <div className="bg-[#2a2a2a] text-gray-400 px-4 py-2 rounded-lg text-sm font-mono animate-pulse">
                Typing...
                </div>
            </div>
            )}

            <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="border-t sw:ml-5 ml-5 rounded-[5%] mr-5 sw:mr-5 border-amber-800 bg-[#1e1e1e] p-3">
            <div className="flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-[#2e2e2e] text-white border border-amber-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
                onClick={sendMessage}
                className="p-2 bg-amber-600 hover:bg-amber-700 rounded-md"
            >
                <FaPaperPlane />
            </button>
            </div>
        </div>
        </div>
    );
    }
