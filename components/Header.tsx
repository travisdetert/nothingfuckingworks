'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthButton from './AuthButton'

interface HeaderProps {
  showCategories?: boolean
}

export default function Header({ showCategories = false }: HeaderProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/offenders', label: 'Offenders' },
    { href: '/submit', label: 'Submit' },
  ]

  return (
    <>
      {/* Header */}
      <header className="border-b-8 border-black bg-white">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <h1 className="text-3xl md:text-5xl font-black uppercase text-center hover:underline cursor-pointer">
              Nothing Fucking Works
            </h1>
          </Link>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-black text-white border-b-4 border-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 md:px-6 py-2 font-bold uppercase transition-colors text-sm md:text-base ${
                  isActive(link.href)
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white text-black hover:bg-yellow-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <AuthButton />
          </div>
        </div>
      </nav>
    </>
  )
}
