import React, { useState } from "react";

export function ChatPage() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to the chat!", sender: "system", timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleRecieveMessage = (message) => {
        const newMessage = {
            id: messages.length + 1,
            text: message,
            sender: "bot",
            timestamp: new Date()
        };
        setMessages([...messages, newMessage]);
    }

    // keep checking for new messages from the bot

    // This is a placeholder for the bot's response logic
    const simulateBotResponse = () => {
        setTimeout(() => {
            handleRecieveMessage("This is a simulated response from the bot.");
        }, 1000); // Simulate a delay for the bot's response
    };
    

    const handleSendMessage = () => {
        if (inputValue.trim() !== "") {
            const newMessage = {
                id: messages.length + 1,
                text: inputValue,
                sender: "user",
                timestamp: new Date()
            };
            setMessages([...messages, newMessage]);
            setInputValue("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-page">
            <header className="chat-header">
                <h1>Chat Room</h1>
            </header>
            
            <div className="chat-container">
                <div className="message-stream">
                    {messages.map((message) => (
                        <div key={message.id} className={`message ${message.sender}`}>
                            <div className="message-content">
                                <span className="message-text">{message.text}</span>
                                <span className="message-time">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="message-input-container">
                    <input
                        type="text"
                        className="message-input"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button 
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={inputValue.trim() === ""}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}