'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      const { data: bidsData } = await supabase
        .from('bids')
        .select('*, auctions(*, products(name, original_price, category))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setBids(bidsData || [])
      setLoading(false)
    }
    getData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>

  const activeBids = bids.filter(b => b.status === 'pending')
  const wonBids = bids.filter(b => b.status === 'won')

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Xodus<span className="text-teal-400">Pay</span></h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Hi {user.user_metadata?.full_name || user.email}</span>
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700">Logout</button>
        </div>
      </nav>
      <div className="px-8 py-12">
        <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
        <p className="text-gray-400 mb-10">Here is your Xodus Pay activity</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-gray-900 rounded-2xl">
            <p className="text-gray-400 mb-2">Active Bids</p>
            <p className="text-4xl font-bold">{activeBids.length}</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl">
            <p className="text-gray-400 mb-2">Won Auctions</p>
            <p className="text-4xl font-bold">{wonBids.length}</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl">
            <p className="text-gray-400 mb-2">Total Bids</p>
            <p className="text-4xl font-bold text-teal-400">{bids.length}</p>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <a href="/products" className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-2xl hover:bg-gray-800">
            <span className="text-4xl mb-3">🔥</span>
            <p className="font-bold text-center">Live Auctions</p>
            <p className="text-gray-500 text-xs text-center mt-1">Browse and bid on items</p>
          </a>
          <a href="/payment" className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-2xl hover:bg-gray-800">
            <span className="text-4xl mb-3">💳</span>
            <p className="font-bold text-center">Make Payment</p>
            <p className="text-gray-500 text-xs text-center mt-1">Pay via Klarna, PayPal</p>
          </a>
          <a href="/retailer" className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-2xl hover:bg-gray-800">
            <span className="text-4xl mb-3">📊</span>
            <p className="font-bold text-center">Retailer Portal</p>
            <p className="text-gray-500 text-xs text-center mt-1">Analytics and listings</p>
          </a>
          <a href="/retailer" className="flex flex-col items-center justify-center p-6 bg-teal-900 border border-teal-700 rounded-2xl hover:bg-teal-800">
            <span className="text-4xl mb-3">➕</span>
            <p className="font-bold text-center">List Product</p>
            <p className="text-gray-400 text-xs text-center mt-1">Add new items to auction</p>
          </a>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Your Recent Bids</h3>
            <a href="/products" className="text-teal-400 text-sm hover:underline">Browse more</a>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : bids.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-4">🛍️</p>
              <p>No bids yet.</p>
              <a href="/products" className="mt-4 inline-block px-6 py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400">Start Bidding Now</a>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bids.map(bid => (
                <div key={bid.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-bold">{bid.auctions?.products?.name || 'Product'}</p>
                    <p className="text-gray-400 text-sm">{bid.auctions?.products?.category}</p>
                    <p className="text-gray-500 text-xs mt-1">{new Date(bid.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-teal-400 font-bold text-xl">£{bid.bid_amount}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-300">{bid.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
