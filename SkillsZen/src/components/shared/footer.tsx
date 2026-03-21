import { Link } from 'react-router-dom'
import logo from '../../../public/fav.png'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <img src={logo} alt="SkillsZen" className="h-7 w-7 object-contain" />
              <span className="text-xl font-bold tracking-tight text-primary">
                Skills<span className="text-muted-foreground font-medium">Zen</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Master your craft with precision. The ultimate platform for skills development and
              zen-like focus.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary">
              Developers
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="https://github.com/chebupell"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Mikhail Kremenetski
              </Link>
              <Link
                to="https://github.com/anastan588"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Anastasiya Andronava
              </Link>
              <Link
                to="https://github.com/t-gladkaya"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Tatsiana Hladkaya
              </Link>
              <Link
                to="https://github.com/forestdeer"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Egor Gerasimchyk
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} RsSchool All rights reserved.</p>
          <div className="flex gap-6">
            <span>Built with React & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
