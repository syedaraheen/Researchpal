import './globals.css'
import type { ReactNode } from 'react'
import Topbar from '@/components/Topbar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slatebg text-offwhite min-h-screen">
        <Topbar />
        {children}
      </body>
    </html>
  )
}

