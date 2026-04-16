'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        role: 'buyer'
      })
      window.location.href = '/dashboard'
    } else {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Xodus<span className="text-teal-400">Pay</span></h1>
          <p className="text-gray-400">Create your account</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-300 rounded-xl text-sm">{error}</div>
          )}
          <div className="flex flex-col gap-4">
            <input type="text" placeholder="Full Name"
              value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input type="email" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input type="password" placeholder="Password (min 6 characters)"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
              className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button onClick={handleSignup} disabled={loading}
              className="w-full py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-teal-400 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </main>
  )
}