import '@testing-library/jest-dom/vitest'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from './footer'

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
    expect(logoImg).toHaveAttribute('src', expect.stringContaining('fav.png'))

    const brandLink = screen.getByRole('link', { name: /skillszen/i })
    expect(brandLink).toBeInTheDocument()
    expect(brandLink).toHaveAttribute('href', '/')

    expect(screen.getByText(/master your craft/i)).toBeInTheDocument()
  })

  it('contains correct developer links with target="_blank"', () => {
    renderFooter()

    const developers = [
      { name: 'Mikhail Kremenetski', url: 'https://github.com/chebupell' },
      { name: 'Anastasiya Andronava', url: 'https://github.com/anastan588' },
      { name: 'Tatsiana Hladkaya', url: 'https://github.com/t-gladkaya' },
      { name: 'Egor Gerasimchyk', url: 'https://github.com/forestdeer' },
    ]

    developers.forEach((dev) => {
      const link = screen.getByRole('link', { name: dev.name })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', dev.url)
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('displays the current year and copyright information', () => {
    renderFooter()

    const currentYear = new Date().getFullYear().toString()

    expect(screen.getByText(new RegExp(currentYear, 'i'))).toBeInTheDocument()
    expect(screen.getByText(/rsschool all rights reserved/i)).toBeInTheDocument()
  })

  it('renders technical stack info', () => {
    renderFooter()
    expect(screen.getByText(/built with react & firebase/i)).toBeInTheDocument()
  })

  it('main logo link points to home page', () => {
    renderFooter()
    const homeLink = screen.getByRole('link', { name: /skillszen/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
