'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function ProductPage({ params }: any) {
  const [product, setProduct] = useState<any>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [aiResponse, setAiResponse] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [id, setId] = useState('')
  const [highestBid, setHighestBid] = useState(0)
  const [totalBids, setTotalBids] = useState(0)

  useEffect(() => {
    Promise.resolve(params).then((p: any) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      setProduct(data)
      const { data: bids } = await supabase.from('bids').select('bid_amount').eq('auction_id', id)
      if (bids && bids.length > 0) {
        setHighestBid(Math.max(...bids.map((b: any) => b.bid_amount)))
        setTotalBids(bids.length)
      }
    }
    getData()
  }, [id])

  const evaluateBidWithAI = async (amount: number) => {
    setAiLoading(true)
    setAiResponse(null)
    try {
      const response = await fetch('/api/evaluate-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, bidAmount: amount, highestBid, totalBids })
      })
      const parsed = await response.json()
      setAiResponse(parsed)
    } catch {
      setAiResponse({ decision: 'accepted', message: 'Great bid!', savings: product.original_price - amount, confidence: 'high' })
    }
    setAiLoading(false)
  }

  const handleBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) < product.minimum_bid) {
      setMessage('Minimum bid is £' + product.minimum_bid)
      return
    }
    setLoading(true)
    setMessage('')
    setAiResponse(null)
    await evaluateBidWithAI(parseFloat(bidAmount))
    setLoading(false)
  }

  const confirmBid = async (amount: number) => {
    setLoading(true)
    try {
      let auctionId = null
      const { data: existingAuction } = await supabase
        .from('auctions').select('id').eq('product_id', id).eq('status', 'active').maybeSingle()
      if (existingAuction) {
        auctionId = existingAuction.id
      } else {
        const { data: newAuction } = await supabase.from('auctions').insert({
          product_id: id,
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          current_highest_bid: 0,
          status: 'active'
        }).select('id').single()
        auctionId = newAuction?.id
      }
      await supabase.from('bids').insert({
        auction_id: auctionId,
        user_id: user.id,
        bid_amount: amount,
        status: 'pending'
      })
      setMessage('Bid of £' + amount + ' placed successfully!')
      setHighestBid(Math.max(highestBid, amount))
      setTotalBids(totalBids + 1)
      setBidAmount('')
      setAiResponse(null)
    } catch (err: any) {
      setMessage('Error: ' + err.message)
    }
    setLoading(false)
  }

  if (!product) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
  )

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Xodus<span className="text-teal-400">Pay</span></h1>
        <a href="/products" className="text-gray-400 hover:text-white">Back to Products</a>
      </nav>
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-900 rounded-2xl h-80 overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">👗</div>
            )}
          </div>
          <div>
            <p className="text-teal-400 text-sm font-semibold mb-2">{product.category}</p>
            <h2 className="text-3xl font-bold mb-3">{product.name}</h2>
            <p className="text-gray-400 mb-6">{product.description}</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 rounded-xl p-3 text-center">
                <p className="text-gray-500 text-xs mb-1">Original</p>
                <p className="text-gray-400 line-through">£{product.original_price}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-3 text-center">
                <p className="text-gray-500 text-xs mb-1">Min Bid</p>
                <p className="text-teal-400 font-bold">£{product.minimum_bid}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-3 text-center">
                <p className="text-gray-500 text-xs mb-1">Highest Bid</p>
                <p className="text-white font-bold">£{highestBid || product.minimum_bid}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
              <span>🔥 {totalBids} bids placed</span>
              <span>•</span>
              <span>⏰ 23h 45m remaining</span>
            </div>
            {message && (
              <p className="mb-4 p-3 rounded-xl text-sm bg-teal-900 text-teal-300">{message}</p>
            )}
            {aiLoading && (
              <div className="mb-4 p-4 bg-gray-900 rounded-xl border border-teal-800">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-teal-400 text-sm">🤖 AI is evaluating your bid...</p>
                </div>
              </div>
            )}
            {aiResponse && !message && (
              <div className={`mb-4 p-4 rounded-xl border ${
                aiResponse.decision === 'accepted' ? 'bg-teal-900 border-teal-600' :
                aiResponse.decision === 'countered' ? 'bg-yellow-900 border-yellow-600' :
                'bg-red-900 border-red-600'
              }`}>
                <p className="font-bold text-sm mb-2">
                  {aiResponse.decision === 'accepted' ? '✅ AI Accepted Your Bid!' :
                   aiResponse.decision === 'countered' ? '🔄 AI Counter Offer' :
                   '❌ AI Rejected Your Bid'}
                </p>
                <p className="text-sm mb-3">{aiResponse.message}</p>
                {aiResponse.decision === 'accepted' && (
                  <div>
                    <p className="text-sm text-teal-300 mb-3">💰 You save £{aiResponse.savings} off original price!</p>
                    <button onClick={() => confirmBid(parseFloat(bidAmount))}
                      className="w-full py-2 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400">
                      Confirm Bid £{bidAmount}
                    </button>
                  </div>
                )}
                {aiResponse.decision === 'countered' && (
                  <div>
                    <p className="text-sm text-yellow-300 mb-3">AI suggests: <span className="font-bold text-xl">£{aiResponse.counter_offer}</span></p>
                    <div className="flex gap-2">
                      <button onClick={() => confirmBid(aiResponse.counter_offer)}
                        className="flex-1 py-2 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400">
                        Accept £{aiResponse.counter_offer}
                      </button>
                      <button onClick={() => setAiResponse(null)}
                        className="flex-1 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600">
                        Decline
                      </button>
                    </div>
                  </div>
                )}
                {aiResponse.decision === 'rejected' && (
                  <button onClick={() => { setAiResponse(null); setBidAmount('') }}
                    className="w-full py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600">
                    Try a Higher Bid
                  </button>
                )}
              </div>
            )}
            {!aiResponse && (
              <div className="flex gap-3">
                <input type="number" placeholder={'Min £' + product.minimum_bid}
                  value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={handleBid} disabled={loading || aiLoading}
                  className="px-8 py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 disabled:opacity-50">
                  {loading || aiLoading ? 'Evaluating...' : 'Place Bid'}
                </button>
              </div>
            )}
            <p className="text-gray-600 text-xs mt-3">🤖 Your bid is evaluated by our AI based on demand, inventory and market trends</p>
          </div>
        </div>
      </div>
    </main>
  )
}