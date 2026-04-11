import { useState, useEffect } from "react";
import { useSoundEffectsWithSettings } from "../utils/useSoundEffects";

/**
 * Example 1: Chat Message Component with Sound Effects
 */
export function ChatMessage({ message, currentUserId, soundsEnabled }) {
    const { playMessageReceive } = useSoundEffectsWithSettings(soundsEnabled);

    // Jab naya message receive ho toh sound play karo
    useEffect(() => {
        if (message.senderId !== currentUserId && soundsEnabled) {
            playMessageReceive();
        }
    }, [message.id]); // Message ke id pe depend karenge

    return (
        <div className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"} mb-2`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${
                message.senderId === currentUserId
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-900"
            }`}>
                {message.text}
            </div>
        </div>
    );
}

/**
 * Example 2: Chat Container with Send Message
 */
export function ChatContainer({ messages, currentUserId, soundsEnabled }) {
    const [inputMessage, setInputMessage] = useState("");
    const { playMessageSend, playMessageReceive } = useSoundEffectsWithSettings(soundsEnabled);

    // Send message function
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        try {
            // Play send sound
            if (soundsEnabled) {
                playMessageSend();
            }

            // Send message to backend
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: inputMessage,
                    senderId: currentUserId,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                setInputMessage("");
                // Message successfully sent
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map(msg => (
                    <ChatMessage 
                        key={msg.id}
                        message={msg}
                        currentUserId={currentUserId}
                        soundsEnabled={soundsEnabled}
                    />
                ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Example 3: Using in a full Chat App with WebSocket
 */
export function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [currentUserId] = useState("user-123");
    const [soundsEnabled, setSoundsEnabled] = useState(true);
    const { playMessageReceive, playMessageSend } = useSoundEffectsWithSettings(soundsEnabled);

    useEffect(() => {
        // WebSocket connection
        const ws = new WebSocket("ws://your-server/chat");

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            
            // Agar incoming message hai
            if (newMessage.senderId !== currentUserId) {
                // Sound play karo
                if (soundsEnabled) {
                    playMessageReceive();
                }
            }

            setMessages(prev => [...prev, newMessage]);
        };

        return () => ws.close();
    }, [soundsEnabled, currentUserId, playMessageReceive]);

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        // Sound play karo jab send karo
        if (soundsEnabled) {
            playMessageSend();
        }

        // Send message
        const message = {
            id: Date.now().toString(),
            text,
            senderId: currentUserId,
            timestamp: new Date().toISOString()
        };

        // API call
        try {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(message)
            });

            setMessages(prev => [...prev, message]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Header with Sound Toggle */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Chat</h1>
                <button
                    onClick={() => setSoundsEnabled(!soundsEnabled)}
                    className={`px-4 py-2 rounded-lg transition ${
                        soundsEnabled
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {soundsEnabled ? "🔊 Sounds On" : "🔇 Sounds Off"}
                </button>
            </div>

            {/* Chat Messages */}
            <ChatContainer 
                messages={messages}
                currentUserId={currentUserId}
                soundsEnabled={soundsEnabled}
            />
        </div>
    );
}

export default ChatApp;
