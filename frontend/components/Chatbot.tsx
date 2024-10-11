import React, { useState } from 'react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');

  // Function to handle sending messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure input is not empty or just whitespace
    if (!input.trim()) return;

    // Add user message to the chat
    setMessages(prev => [...prev, { text: input, isUser: true }]);

    // Simulating bot response (you can replace this with an actual API call)
    const response = `You said: ${input}`;
    
    // Add bot response to chat
    setMessages(prev => [...prev, { text: response, isUser: false }]);

    // Clear the input after sending
    setInput('');
  };

  return (
    <div 
      className="chatbot" 
      style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 1000, 
        backgroundColor: 'white', 
        padding: '10px', 
        border: '1px solid black', 
        width: '300px', 
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
      }}
    >
      {/* Chat messages section */}
      <div className="chatbot-messages" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.isUser ? 'user' : 'bot'}`} 
            style={{ 
              textAlign: message.isUser ? 'right' : 'left',
              margin: '5px 0', 
              padding: '5px 10px', 
              backgroundColor: message.isUser ? '#daf8cb' : '#f1f1f1', 
              borderRadius: '10px'
            }}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/* Form for user input */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '10px'
          }}
        />
        <button 
          type="submit" 
          style={{
            padding: '10px 15px',
            borderRadius: '5px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
