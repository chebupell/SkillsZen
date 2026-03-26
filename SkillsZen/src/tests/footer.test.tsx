import '@testing-library/jest-dom/vitest'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from '../components/shared/footer'

describe('Footer', () => {
  const renderFooter = () =>
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    )

  it('renders branding elements correctly', () => {
    renderFooter()

    const logoImg = screen.getByAltText('SkillsZen')
    expect(logoImg).toBeInTheDocument()
    
    expect(screen.getByText(/Skills/i)).toBeInTheDocument()
    expect(screen.getByText(/Zen/i)).toBeInTheDocument()
  })

  it('contains correct developer links with target="_blank"', () => {
    renderFooter()
    const developers = [
      { name: 'Mikhail Kremenetski', url: 'https://github.com/chebupell' },
      { name: 'Anastasiya Andronava', url: 'https://github.com/anastan588' },
      { name: 'Tatsiana Hladkaya', url: 'https://github.com/t-gladkaya' },
      { name: 'Egor Gerasimchyk', url: 'https://github.com/forestdeerr' },
    ]

    developers.forEach((dev) => {
      const link = screen.getByRole('link', { name: new RegExp(dev.name, 'i') })
      expect(link).toHaveAttribute('href', dev.url)
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('displays the current year and copyright information', () => {
    renderFooter()
    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(currentYear, 'i'))).toBeInTheDocument()
    expect(screen.getByText(/RsSchool. All rights reserved/i)).toBeInTheDocument()
  })

  it('renders technical stack info', () => {
    renderFooter()
    expect(screen.getByText(/React/i)).toBeInTheDocument()
    expect(screen.getByText(/Firebase/i)).toBeInTheDocument()
    expect(screen.getByText(/Tailwind/i)).toBeInTheDocument()
  })

  it('main logo link points to home page', () => {
    renderFooter()
    const homeLink = screen.getByAltText('SkillsZen').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})

