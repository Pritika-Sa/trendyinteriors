import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaComments, FaTimes, FaPaperPlane, FaSpinner, FaPaperclip } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! 👋 Welcome to TrendyInterios. How can we help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const quickReplies = [
    'View pricing',
    'Schedule consultation',
    'See portfolio',
    'Contact us'
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!inputValue.trim() && !selectedFile) || loading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue.trim(),
      attachmentName: selectedFile?.name || null,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Get conversation history (last 5 messages) for context
      const conversationHistory = messages
        .slice(-4)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.attachmentName ? `${msg.text || ''}\n[Attached file: ${msg.attachmentName}]`.trim() : msg.text
        }));

      let response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('message', userMessage.text);
        formData.append('conversationHistory', JSON.stringify(conversationHistory));
        formData.append('attachment', selectedFile);

        response = await axios.post('https://trendyinteriors-1.onrender.com/api/chatbot/chat', formData);
      } else {
        response = await axios.post('https://trendyinteriors-1.onrender.com/api/chatbot/chat', {
          message: userMessage.text,
          conversationHistory
        });
      }

      if (response.data.success) {
        const botMessage = {
          id: messages.length + 2,
          text: response.data.message,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(response.data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: error.response?.data?.error || error.response?.data?.message || 'Sorry, I encountered an error. Please try again or contact us directly at +91 99652 99777',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      alert('Please upload a PDF or image file only.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQuickReply = (reply) => {
    setInputValue(reply);
    // Automatically submit after a short delay
    setTimeout(() => {
      const form = document.querySelector('.chatbot-input-form');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
    }, 100);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chatbot"
        title="Chat with us"
      >
        <FaComments />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <FaComments className="chatbot-icon" />
              <div>
                <h3>TrendyInterios Chat</h3>
                <span className="status-indicator">Online</span>
              </div>
            </div>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.attachmentName && (
                    <div className="message-attachment-chip">📎 {msg.attachmentName}</div>
                  )}
                  <p>{msg.text}</p>
                  <small className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </small>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="bot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden-file-input"
              onChange={handleFileSelect}
              disabled={loading}
            />
            <button
              type="button"
              className="image-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              aria-label="Attach PDF or image"
              title="Attach PDF or image"
            >
              <FaPaperclip />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question or attach floor plan..."
              className="chatbot-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={(!inputValue.trim() && !selectedFile) || loading}
              aria-label="Send message"
            >
              {loading ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
            </button>
          </form>
          {selectedFile && (
            <div className="selected-file-row">
              <span className="selected-file-name">📎 {selectedFile.name}</span>
              <button type="button" className="clear-file-btn" onClick={clearSelectedFile} disabled={loading}>
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;
