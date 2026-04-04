import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ChatMessageItem } from '../components/shared/AI chat/ChatMessageItem'
import type { ChatMessage } from '../types/chatTypes'

describe('ChatMessageItem', () => {
  const mockUserMsg: ChatMessage = { role: 'user', content: 'Hello AI' }
  const mockAssistantMsg: ChatMessage = { role: 'assistant', content: 'Hello Human' }

  it('renders user message with correct styles and photo', () => {
    const userPhoto = 'https://example.com'
    render(<ChatMessageItem msg={mockUserMsg} userPhoto={userPhoto} />)

    expect(screen.getByText('Hello AI')).toBeInTheDocument()

    const img = screen.getByAltText('User')
    expect(img).toHaveAttribute('src', userPhoto)
    const bubble = screen.getByText('Hello AI').closest('div')
    expect(bubble?.parentElement).toHaveClass('bg-primary')
  })

  it('renders assistant message with Bot icon', () => {
    render(<ChatMessageItem msg={mockAssistantMsg} userPhoto={null} />)

    expect(screen.getByText('Hello Human')).toBeInTheDocument()

    const bubble = screen.getByText('Hello Human').closest('div')
    expect(bubble?.parentElement).toHaveClass('bg-slate-50')
  })

  it('renders markdown: bold text and links', () => {
    const msg: ChatMessage = {
      role: 'assistant',
      content: 'This is **bold** and a [link](https://google.com)',
    }
    render(<ChatMessageItem msg={msg} userPhoto={null} />)

    const boldElement = screen.getByText('bold')
    expect(boldElement.tagName).toBe('STRONG')

    const link = screen.getByRole('link', { name: /link/i })
    expect(link).toHaveAttribute('href', 'https://google.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders code blocks with language label', () => {
    const msg: ChatMessage = {
      role: 'assistant',
      content: '```typescript\nconst x = 1;\n```',
    }
    render(<ChatMessageItem msg={msg} userPhoto={null} />)

    expect(screen.getByText('typescript')).toBeInTheDocument()

    const codeElement = screen.getByText((_content, element) => {
      const hasText = (node: Element | null) => node?.textContent === 'const x = 1;'
      const nodeHasText = hasText(element)
      const childrenDontHaveText = Array.from(element?.children || []).every(
        (child) => !hasText(child as Element),
      )
      return nodeHasText && childrenDontHaveText
    })

    expect(codeElement).toBeInTheDocument()
  })

  it('renders inline code with specific styles', () => {
    const msg: ChatMessage = {
      role: 'assistant',
      content: 'Use `const` keyword',
    }
    render(<ChatMessageItem msg={msg} userPhoto={null} />)

    const inlineCode = screen.getByText('const')
    expect(inlineCode.tagName).toBe('CODE')
    expect(inlineCode).toHaveClass('text-pink-600') // Твой кастомный стиль
  })

  it('switches to fallback icon when user photo fails to load', () => {
    const userPhoto = 'https://broken-link.com'
    render(<ChatMessageItem msg={mockUserMsg} userPhoto={userPhoto} />)

    const img = screen.getByAltText('User')

    fireEvent.error(img)

    expect(img).not.toBeInTheDocument()
  })

  it('renders images with custom styles and handles errors', () => {
    const msg: ChatMessage = {
      role: 'assistant',
      content: '![Alt text](https://image.com)',
    }
    render(<ChatMessageItem msg={msg} userPhoto={null} />)

    const chatImg = screen.getByAltText('Alt text')
    expect(chatImg).toHaveClass('rounded-xl shadow-md')
    fireEvent.error(chatImg)
    expect(chatImg).toHaveStyle({ display: 'none' })
  })
})
