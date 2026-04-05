import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Eraser, Bot } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../services/AuthContext'
import { getGroqChatCompletion } from '../../services/groq'

import { ChatMessageItem } from '../../components/shared/AI chat/ChatMessageItem'
import type { ChatMessage } from '../../types/chatTypes'
import { ConfirmationChatModal } from '../../components/shared/AI chat/ConfirmationChatModal'
import { ChatHeader } from '../../components/shared/AI chat/ChatHeader'
import { SyncOverlay } from '../../components/shared/AI chat/SyncOverLay'
import { TypingIndicator } from '../../components/shared/AI chat/TypingIndicator'
import { ChatInput } from '../../components/shared/AI chat/ChatInput'

const AIChat: React.FC = () => {
  const { user, updateChat, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
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

  const typeEffect = async (text: string, historyBeforeAI: ChatMessage[]) => {
    setStreamingText('')
    const words = text.split(' ')
    let currentText = ''

    for (const word of words) {
      currentText += (currentText ? ' ' : '') + word
      setStreamingText(currentText)
      await new Promise((r) => setTimeout(r, 40 + Math.random() * 30))
    }

    const finalMessages: ChatMessage[] = [...historyBeforeAI, { role: 'assistant', content: text }]
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
      const aiText = response!.choices?.[0]?.message?.content || 'I could not generate a response.'

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
      setIsModalOpen(false)
      toast.success('Chat history cleared')
    } catch {
      toast.error('Failed to clear history')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 w-full bg-slate-50/50 p-4 md:px-8 pt-4 md:pt-8 overflow-hidden">
      <ChatHeader user={user} onBack={() => navigate('/')} />
      <main className="flex-1 flex flex-col min-h-0 max-w-5xl mx-auto w-full bg-white md:rounded-[2.5rem] border-x border-t border-slate-200 shadow-2xl overflow-hidden relative">
        {isAuthLoading && messages.length === 0 && <SyncOverlay />}
        <div className="shrink-0 p-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-slate-800 font-bold text-base leading-none">AI Assistant</h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1.5">
                {isTyping ? 'Thinking...' : 'Online'}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="Clear history"
              className="text-slate-300 hover:text-red-500 p-2 rounded-xl transition-all hover:bg-red-50"
            >
              <Eraser size={18} />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide bg-gradient-to-b from-transparent to-slate-50/30">
          {messages.length === 0 && !streamingText && !isAuthLoading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300/60">
              <Bot size={56} strokeWidth={1} className="mb-4" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-center leading-relaxed">
                Welcome, {user?.name?.split(' ')[0] || 'Guest'}!<br />
                <span className="text-slate-400">Ask me anything about code.</span>
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <ChatMessageItem
              key={`${idx}-${msg.role}`}
              msg={msg}
              userPhoto={msg.role === 'user' ? user?.photo : null}
            />
          ))}
          {(streamingText || isTyping) && (
            <div className="space-y-4">
              {streamingText && (
                <ChatMessageItem
                  msg={{ role: 'assistant', content: streamingText }}
                  userPhoto={null}
                />
              )}
              {isTyping && !streamingText && <TypingIndicator />}
            </div>
          )}

          <div ref={chatEndRef} className="h-2 shrink-0" />
        </div>
        <div className="shrink-0 bg-white border-t border-slate-100 p-3 md:p-6 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            disabled={isTyping || !!streamingText || isAuthLoading}
          />
        </div>
      </main>

      <ConfirmationChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleClearConfirm}
        title="Clear History?"
        message="This will permanently delete all messages from this session."
      />
    </div>
  )
}

export default AIChat
