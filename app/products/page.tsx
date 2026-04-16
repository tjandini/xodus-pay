'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [urgent, setUrgent] = useState(false)

  useEffect(() => {
    const calculate = () => {
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()
      const diff = end - now
      if (diff <= 0) { setTimeLeft('Ended'); return }
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      setUrgent(h < 1)
      setTimeLeft(`${h}h ${m}m ${s}s`)
    }
    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  return (
    <span className={`text-xs font-mono font-bold ${urgent ? 'text-red-400 animate-pulse' : 'text-teal-400'}`}>
      ⏰ {timeLeft}
    </span>
  )
}

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [auctions, setAuctions] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProducts = async () => {
      const { data } = await supabase
        .from('products').select('*').eq('status', 'active')
      setProducts(data || [])

      const { data: auctionsData } = await supabase
        .from('auctions').select('*').eq('status', 'active')
      const auctionMap: any = {}
      auctionsData?.forEach((a: any) => { auctionMap[a.product_id] = a })
      setAuctions(auctionMap)
      setLoading(false)
    }
    getProducts()
  }, [])

  const getDefaultEndTime = () => {
    return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Xodus<span className="text-teal-400">Pay</span></h1>
        <div className="flex gap-4">
          <a href="/dashboard" className="px-4 py-2 text-gray-300 hover:text-white">Dashboard</a>
          <a href="/products" className="px-4 py-2 text-teal-400 font-semibold">Products</a>
        </div>
      </nav>
      <div className="px-8 py-12">
        <h2 className="text-3xl font-bold mb-2">Live Auctions 🔥</h2>
        <p className="text-gray-400 mb-8">Bid on exclusive premium fashion items</p>
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">👗</p>
            <p className="text-xl text-gray-400">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gray-800 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">👗</div>
                    )}
                  </div>
                  {/* Live badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                    LIVE
                  </div>
                  {/* Timer badge */}
                  <div className="absolute top-3 right-3 bg-black bg-opacity-70 px-2 py-1 rounded-full">
                    <CountdownTimer endTime={auctions[product.id]?.end_time || getDefaultEndTime()} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-500 text-xs">Original Price</p>
                      <p className="text-gray-400 line-through">£{product.original_price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs">Minimum Bid</p>
                      <p className="text-teal-400 font-bold text-xl">£{product.minimum_bid}</p>
                    </div>
                  </div>
                  <a href={`/products/${product.id}`}
                    className="block w-full py-3 bg-teal-500 text-black font-bold rounded-xl text-center hover:bg-teal-400">
                    Place Bid
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}