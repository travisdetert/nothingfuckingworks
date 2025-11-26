'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [showMenu, setShowMenu] = useState(false)

  if (status === 'loading') {
    return null
  }

  if (session?.user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 md:px-6 py-2 bg-white text-black font-bold uppercase text-sm md:text-base hover:bg-yellow-400 transition-colors"
        >
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span>{session.user.name || session.user.email}</span>
        </button>

        {showMenu && (
          <div className="absolute top-full right-0 mt-1 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 min-w-[200px]">
            <div className="p-2">
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-3 py-2 text-xs hover:bg-yellow-400 font-bold"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href="/auth/signin"
      className="px-4 md:px-6 py-2 bg-white text-black font-bold uppercase text-sm md:text-base hover:bg-yellow-400 transition-colors"
    >
      Sign In
    </Link>
  )
}
