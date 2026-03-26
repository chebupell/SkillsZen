import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'
import logo from '../../../public/fav.png'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const developers = [
    { name: 'Mikhail Kremenetski', url: 'https://github.com/chebupell' },
    { name: 'Anastasiya Andronava', url: 'https://github.com/anastan588' },
    { name: 'Tatsiana Hladkaya', url: 'https://github.com/t-gladkaya' },
    { name: 'Egor Gerasimchyk', url: 'https://github.com/forestdeerr' },
  ]

  return (
    <footer className="w-full border-t border-primary/5 bg-background/40 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-all active:scale-95 group"
            >
              <div className="p-1 bg-primary/5 rounded-md border border-primary/10">
                <img src={logo} alt="SkillsZen" className="h-4 w-4 object-contain" />
              </div>
              <span className="text-sm font-bold tracking-tight text-primary uppercase">
                Skills<span className="text-muted-foreground font-medium">Zen</span>
              </span>
            </Link>

            <nav className="flex flex-wrap justify-center gap-2">
              {developers.map((dev) => (
                <Link
                  key={dev.url}
                  to={dev.url}
                  target="_blank"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/5 hover:border-primary/20 hover:bg-primary/10 transition-all duration-300"
                >
                  <Github
                    size={12}
                    className="text-muted-foreground/60 group-hover:text-primary transition-colors"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 group-hover:text-foreground">
                    {dev.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-3 border-t border-primary/5 gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
            <p>© {currentYear} RsSchool. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-primary transition-colors cursor-default">React</span>
              <span className="w-0.5 h-0.5 bg-primary/20 rounded-full" />
              <span className="hover:text-primary transition-colors cursor-default">Firebase</span>
              <span className="w-0.5 h-0.5 bg-primary/20 rounded-full" />
              <span className="hover:text-primary transition-colors cursor-default">Tailwind</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
