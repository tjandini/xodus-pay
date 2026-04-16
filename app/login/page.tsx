'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage(error.message)
    } else {
      window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-8">Login to your Xodus Pay account</p>
        {message && <p className="text-red-400 mb-4 text-sm">{message}</p>}
        <div className="flex flex-col gap-4">
          <input type="email" placeholder="Email Address" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-teal-400 hover:underline">Sign Up</a>
        </p>
      </div>
    </main>
  )
}