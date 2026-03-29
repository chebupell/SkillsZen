import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Bot, User } from 'lucide-react'
import type { ChatMessage } from '../../types/chatTypes'
import type { Components } from 'react-markdown'

interface ChatMessageItemProps {
  msg: ChatMessage
  userPhoto: string | null | undefined
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ msg, userPhoto }) => {
  const isUser = msg.role === 'user'
  const [avatarError, setAvatarError] = useState(false)

  const MarkdownComponents: Components = {
    // В новых версиях react-markdown пропс 'inline' отсутствует.
    // Мы определяем блочный код по наличию className (например, 'language-js').
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      return language ? (
        <div className="relative my-4 rounded-lg overflow-hidden shadow-md">
          <div className="bg-[#1e1e1e] px-4 py-1.5 text-[10px] text-slate-400 uppercase font-bold border-b border-white/5 flex justify-between items-center">
            <span>{language}</span>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus as { [key: string]: React.CSSProperties }}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1.25rem',
              fontSize: '13px',
              lineHeight: '1.5',
              background: '#1e1e1e',
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className="bg-slate-200/50 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    },
    img({ ...props }) {
      return (
        <img
          {...props}
          className="rounded-xl border border-slate-200 my-2 max-w-full h-auto shadow-md block"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
          alt={props.alt || 'Chat image'}
        />
      )
    },
    a({ ...props }) {
      return (
        <a
          {...props}
          className="underline font-bold decoration-primary/30 hover:text-primary transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        />
      )
    },
  }

  return (
    <div
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in duration-300`}
    >
      <div className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden border border-slate-200 bg-white">
        {isUser ? (
          userPhoto && !avatarError ? (
            <img
              src={userPhoto}
              className="w-full h-full object-cover"
              alt="User"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <User size={20} className="text-slate-400" />
          )
        ) : (
          <Bot size={20} className="text-primary" />
        )}
      </div>

      <div
        className={`max-w-[85%] p-5 rounded-[1.8rem] text-[15px] shadow-sm ${
          isUser
            ? 'bg-primary text-white rounded-tr-none'
            : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'
        }`}
      >
        <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'prose-slate'}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
            {msg.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
