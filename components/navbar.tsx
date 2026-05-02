'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/auth/user-menu'
import { BookOpen } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname?.startsWith('/auth')

  if (isAuthPage) {
    return null
  }

  return (
    <nav className="border-b bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push('/workspaces')}
          className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span>Keen</span>
        </button>

        <div className="flex items-center gap-4">
          {pathname !== '/workspaces' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/workspaces')}
            >
              Back to Workspaces
            </Button>
          )}
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}
