'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Account created! Please check your email to confirm.')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-400 mb-8">Join Xodus Pay and start bidding</p>
        {message && <p className="text-teal-400 mb-4 text-sm">{message}</p>}
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name" value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input type="email" placeholder="Email Address" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button onClick={handleSignUp} disabled={loading}
            className="w-full py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-teal-400 hover:underline">Login</a>
        </p>
      </div>
    </main>
  )
}