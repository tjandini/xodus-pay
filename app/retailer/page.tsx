'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function RetailerPortal() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('analytics')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', category: '',
    original_price: '', minimum_bid: '', stock_quantity: '1'
  })

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      const { data: productsData } = await supabase
        .from('products').select('*').order('created_at', { ascending: false })
      setProducts(productsData || [])
      const { data: bidsData } = await supabase
        .from('bids').select('*, auctions(*, products(name, original_price))')
      setBids(bidsData || [])
    }
    getData()
  }, [])

  const handleSubmit = async () => {
    if (!form.name || !form.original_price || !form.minimum_bid) {
      setMessage('Please fill in all required fields')
      return
    }
    setLoading(true)
    setMessage('')
    const { error } = await supabase.from('products').insert({
      retailer_id: '11111111-1111-1111-1111-111111111111',
      name: form.name, description: form.description,
      category: form.category,
      original_price: parseFloat(form.original_price),
      minimum_bid: parseFloat(form.minimum_bid),
      stock_quantity: parseInt(form.stock_quantity),
      status: 'active'
    })
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Product listed successfully!')
      setForm({ name: '', description: '', category: '', original_price: '', minimum_bid: '', stock_quantity: '1' })
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      setProducts(data || [])
    }
    setLoading(false)
  }

  const totalRevenue = bids.filter(b => b.status === 'won').reduce((sum, b) => sum + b.bid_amount, 0)
  const totalBids = bids.length
  const activeProducts = products.filter(p => p.status === 'active').length
  const avgBid = bids.length > 0 ? Math.round(bids.reduce((sum, b) => sum + b.bid_amount, 0) / bids.length) : 0
  const totalOriginalValue = products.reduce((sum, p) => sum + p.original_price, 0)
  const recoveryRate = totalOriginalValue > 0 ? Math.round((avgBid / (totalOriginalValue / products.length)) * 100) : 0

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Xodus<span className="text-teal-400">Pay</span> — Retailer Portal</h1>
        <a href="/dashboard" className="px-4 py-2 text-gray-300 hover:text-white">Dashboard</a>
      </nav>

      {/* Tabs */}
      <div className="flex gap-2 px-8 pt-6">
        {['analytics', 'products', 'list'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-semibold capitalize ${activeTab === tab ? 'bg-teal-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {tab === 'analytics' ? '📊 Analytics' : tab === 'products' ? '👗 Products' : '➕ List Product'}
          </button>
        ))}
      </div>

      <div className="px-8 py-8">

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Store Analytics</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-teal-400">£{totalRevenue}</p>
                <p className="text-gray-500 text-xs mt-2">From won auctions</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400 text-sm mb-1">Total Bids</p>
                <p className="text-3xl font-bold">{totalBids}</p>
                <p className="text-gray-500 text-xs mt-2">Across all products</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400 text-sm mb-1">Active Listings</p>
                <p className="text-3xl font-bold text-green-400">{activeProducts}</p>
                <p className="text-gray-500 text-xs mt-2">Products live now</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6">
                <p className="text-gray-400 text-sm mb-1">Avg Bid Value</p>
                <p className="text-3xl font-bold text-yellow-400">£{avgBid}</p>
                <p className="text-gray-500 text-xs mt-2">Per bid placed</p>
              </div>
            </div>

            {/* Price Recovery */}
            <div className="bg-gray-900 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Price Recovery Rate</h3>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 bg-gray-800 rounded-full h-4">
                  <div className="bg-teal-500 h-4 rounded-full transition-all" style={{ width: recoveryRate + '%' }}></div>
                </div>
                <span className="text-teal-400 font-bold text-xl">{recoveryRate}%</span>
              </div>
              <p className="text-gray-400 text-sm">Average price recovered vs original retail price</p>
            </div>

            {/* Recent Bids */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Recent Bids Activity</h3>
              {bids.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bids yet</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {bids.slice(0, 5).map(bid => (
                    <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-xl">
                      <div>
                        <p className="font-semibold text-sm">{bid.auctions?.products?.name || 'Product'}</p>
                        <p className="text-gray-500 text-xs">{new Date(bid.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-teal-400 font-bold">£{bid.bid_amount}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900 text-yellow-300">{bid.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Listed Products ({products.length})</h2>
            <div className="flex flex-col gap-4">
              {products.map(product => (
                <div key={product.id} className="flex justify-between items-center p-5 bg-gray-900 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-800 rounded-xl overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">👗</div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-gray-400 text-sm">{product.category}</p>
                      <p className="text-gray-500 text-xs">Stock: {product.stock_quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 line-through text-sm">£{product.original_price}</p>
                    <p className="text-teal-400 font-bold">Min £{product.minimum_bid}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List Product Tab */}
        {activeTab === 'list' && (
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-6">List New Product</h2>
            {message && (
              <p className={`mb-4 p-3 rounded-xl text-sm ${message.includes('success') ? 'bg-teal-900 text-teal-300' : 'bg-red-900 text-red-300'}`}>
                {message}
              </p>
            )}
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Product Name *"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
              />
              <textarea placeholder="Description"
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500 h-24"
              />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 rounded-xl text-white outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">Select Category</option>
                <option value="Dresses">Dresses</option>
                <option value="Bags">Bags</option>
                <option value="Coats">Coats</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Original Price £ *"
                  value={form.original_price} onChange={e => setForm({...form, original_price: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input type="number" placeholder="Minimum Bid £ *"
                  value={form.minimum_bid} onChange={e => setForm({...form, minimum_bid: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <input type="number" placeholder="Stock Quantity"
                value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 disabled:opacity-50">
                {loading ? 'Listing...' : 'List Product'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}