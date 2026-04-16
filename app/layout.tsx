'use client'
import { useState } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hi! I am the Xodus Pay AI assistant. Ask me anything about bidding, products or how the platform works!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again!' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 z-50 flex flex-col" style={{ height: '420px' }}>
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold text-sm">AI</div>
              <div>
                <p className="font-bold text-white text-sm">Xodus AI Assistant</p>
                <p className="text-green-400 text-xs">Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                  msg.role === 'user' ? 'bg-teal-500 text-black' : 'bg-gray-800 text-white'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 px-3 py-2 rounded-xl text-sm text-gray-400">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-3 py-2 bg-gray-800 rounded-xl text-white text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button onClick={sendMessage} disabled={loading}
              className="px-3 py-2 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 disabled:opacity-50 text-sm">
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Chat Bubble */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-teal-400 z-50 text-2xl">
        {open ? '✕' : '🤖'}
      </button>
    </>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <AIChat />
      </body>
    </html>
  )
}