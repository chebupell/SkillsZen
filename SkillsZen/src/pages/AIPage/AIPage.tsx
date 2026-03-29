import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Sparkles, Loader2, Eraser, Bot } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../services/AuthContext'
import { getGroqChatCompletion } from '../../services/groq'

import { ChatMessageItem } from '../../components/shared/ChatMessageItem'
import { ChatInput } from '../../components/shared/ChatInput'
import type { ChatMessage } from '../../types/chatTypes'
import { ConfirmationChatModal } from '../../components/shared/ConfirmationChatModal'

const AIChat: React.FC = () => {
  const { user, updateChat, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => user?.chatHistory || [])
  const [isTyping, setIsTyping] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  if (user?.chatHistory && messages.length === 0 && user.chatHistory.length > 0) {
    setMessages(user.chatHistory)
  }

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    chatEndRef.current?.scrollIntoView({ behavior })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, streamingText, scrollToBottom])

  const typeEffect = async (text: string, currentHistory: ChatMessage[]) => {
    setStreamingText('')
    const words = text.split(' ')
    let currentText = ''

    for (const word of words) {
      currentText += word + ' '
      setStreamingText(currentText)
      await new Promise((r) => setTimeout(r, 60 + Math.random() * 30))
    }

    const finalMessages: ChatMessage[] = [...currentHistory, { role: 'assistant', content: text }]
    await updateChat(finalMessages)
    setMessages(finalMessages)
    setStreamingText('')
  }

  const handleSend = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isTyping || streamingText || isAuthLoading) return

    const userMessage: ChatMessage = { role: 'user', content: trimmedInput }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)

    try {
      const response = await getGroqChatCompletion(updatedMessages)
      const aiText = response.choices?.[0]?.message?.content || 'I could not generate a response.'

      setIsTyping(false)
      await typeEffect(aiText, updatedMessages)
    } catch (error) {
      setIsTyping(false)
      const errorMessage = error instanceof Error ? error.message : 'Connection error'
      toast.error(errorMessage)
      setInput(trimmedInput)
    }
  }

  const handleClearConfirm = async () => {
    try {
      await updateChat([])
      setMessages([])
      setStreamingText('')
      toast.success('Chat history cleared')
    } catch {
      toast.error('Failed to clear history')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 px-4 py-8">
      {/* Navigation */}
      <header className="max-w-4xl mx-auto w-full mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="group inline-flex items-center gap-3 text-primary/70 hover:text-primary transition-all text-xs font-bold uppercase tracking-widest active:scale-95 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-slate-800 leading-none">
              {user?.name || 'Guest'}
            </p>
            <p className="text-[8px] text-green-500 uppercase tracking-widest mt-0.5 font-bold">
              ● Online
            </p>
          </div>
          {user?.photo ? (
            <img
              src={user.photo}
              className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm"
              alt="Avatar"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
              <Bot size={14} />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full flex-1 flex flex-col min-h-0 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden relative">
        {isAuthLoading && messages.length === 0 && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-primary" size={32} />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Syncing...
              </span>
            </div>
          </div>
        )}

        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-slate-800 font-bold text-lg leading-tight">AI Assistant</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-slate-300 hover:text-red-500 p-2 rounded-xl transition-all hover:bg-red-50"
                title="Clear Chat"
              >
                <Eraser size={20} />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gradient-to-b from-transparent to-slate-50/30">
          {messages.length === 0 && !streamingText && !isAuthLoading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
              <Bot size={64} strokeWidth={1} className="mb-4" />
              <p className="text-xs uppercase tracking-widest font-bold text-center leading-relaxed">
                Welcome, {user?.name?.split(' ')[0]}!<br />
                Ask me anything about code or tasks.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <ChatMessageItem key={`${idx}-${msg.role}`} msg={msg} userPhoto={user?.photo} />
          ))}

          {streamingText && (
            <ChatMessageItem msg={{ role: 'assistant', content: streamingText }} userPhoto={null} />
          )}

          {isTyping && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              <div className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-primary border border-slate-200 shadow-sm">
                <Loader2 size={18} className="animate-spin" />
              </div>
              <div className="bg-white border border-slate-100 px-5 py-4 rounded-[1.5rem] rounded-tl-none flex gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-2" />
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          disabled={isTyping || !!streamingText || isAuthLoading}
        />
      </main>

      <ConfirmationChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleClearConfirm}
        title="Clear History?"
        message="This will permanently delete all messages from this conversation on all your devices."
      />
    </div>
  )
}

export default AIChat
