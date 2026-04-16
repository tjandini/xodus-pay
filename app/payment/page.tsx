'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Payment() {
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [form, setForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
    }
    getUser()
  }, [])

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(3)
    }, 2000)
  }

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Xodus<span className="text-teal-400">Pay</span></h1>
        <a href="/dashboard" className="text-gray-400 hover:text-white">← Back to Dashboard</a>
      </nav>

      <div className="max-w-lg mx-auto px-8 py-12">

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-teal-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-sm ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                {s === 1 ? 'Order' : s === 2 ? 'Payment' : 'Confirmed'}
              </span>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-teal-500' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 - Order Summary */}
        {step === 1 && (
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-2xl">👗</div>
                <div>
                  <p className="font-bold">Premium Leather Bag</p>
                  <p className="text-gray-400 text-sm">Bags • Stock: 1</p>
                </div>
              </div>
              <p className="text-teal-400 font-bold text-xl">£500</p>
            </div>
            <div className="border-t border-gray-800 pt-4 mb-6">
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Winning Bid</span><span>£500</span>
              </div>
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Platform Fee (5%)</span><span>£25</span>
              </div>
              <div className="flex justify-between text-gray-400 mb-4">
                <span>Shipping</span><span>£10</span>
              </div>
              <div className="flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span className="text-teal-400">£535</span>
              </div>
            </div>
            <div className="bg-teal-900 text-teal-300 p-3 rounded-xl text-sm mb-6">
              🎉 You saved £665 off the original £1,200 price!
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400">
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Step 2 - Payment Method */}
        {step === 2 && (
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-2">Payment Method</h2>
            <p className="text-gray-400 mb-6">Choose how you want to pay 🔒</p>

            {/* Payment Options */}
            <div className="flex flex-col gap-3 mb-6">

              {/* Bid with Xodus */}
              <div onClick={() => setPaymentMethod('xodus')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'xodus' ? 'border-teal-500 bg-teal-900' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center font-bold text-black text-sm">XP</div>
                    <div>
                      <p className="font-bold">Bid with Xodus</p>
                      <p className="text-gray-400 text-xs">Use your Xodus Pay wallet</p>
                    </div>
                  </div>
                  {paymentMethod === 'xodus' && <span className="text-teal-400">✓</span>}
                </div>
              </div>

              {/* Klarna */}
              <div onClick={() => setPaymentMethod('klarna')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'klarna' ? 'border-pink-500 bg-pink-900' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center font-bold text-white text-sm">K</div>
                    <div>
                      <p className="font-bold">Pay with Klarna</p>
                      <p className="text-gray-400 text-xs">Buy now, pay later in 3 instalments</p>
                    </div>
                  </div>
                  {paymentMethod === 'klarna' && <span className="text-pink-400">✓</span>}
                </div>
              </div>

              {/* PayPal */}
              <div onClick={() => setPaymentMethod('paypal')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-900' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-white text-sm">PP</div>
                    <div>
                      <p className="font-bold">PayPal</p>
                      <p className="text-gray-400 text-xs">Pay securely with PayPal</p>
                    </div>
                  </div>
                  {paymentMethod === 'paypal' && <span className="text-blue-400">✓</span>}
                </div>
              </div>

              {/* Credit Card */}
              <div onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-teal-500 bg-teal-900' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">💳</div>
                    <div>
                      <p className="font-bold">Credit / Debit Card</p>
                      <p className="text-gray-400 text-xs">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  {paymentMethod === 'card' && <span className="text-teal-400">✓</span>}
                </div>
              </div>
            </div>

            {/* Card form if card selected */}
            {paymentMethod === 'card' && (
              <div className="flex flex-col gap-3 mb-6">
                <input type="text" placeholder="Name on Card"
                  value={form.cardName} onChange={e => setForm({...form, cardName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input type="text" placeholder="Card Number"
                  value={form.cardNumber}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 16)
                    setForm({...form, cardNumber: v.replace(/(.{4})/g, '$1 ').trim()})
                  }}
                  className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY"
                    value={form.expiry}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setForm({...form, expiry: v.length > 2 ? v.slice(0,2) + '/' + v.slice(2) : v})
                    }}
                    className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input type="text" placeholder="CVV"
                    value={form.cvv} onChange={e => setForm({...form, cvv: e.target.value.slice(0,3)})}
                    className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Klarna info */}
            {paymentMethod === 'klarna' && (
              <div className="bg-pink-900 border border-pink-700 rounded-xl p-4 mb-6">
                <p className="text-pink-300 text-sm font-bold mb-1">Pay in 3 with Klarna</p>
                <p className="text-pink-400 text-xs">3 x £178.33 — 0% interest</p>
                <p className="text-pink-400 text-xs mt-1">First payment today, then every 30 days</p>
              </div>
            )}

            {/* PayPal info */}
            {paymentMethod === 'paypal' && (
              <div className="bg-blue-900 border border-blue-700 rounded-xl p-4 mb-6">
                <p className="text-blue-300 text-sm font-bold mb-1">You will be redirected to PayPal</p>
                <p className="text-blue-400 text-xs">Complete your payment securely on PayPal</p>
              </div>
            )}

            <div className="flex justify-between items-center mb-4 p-4 bg-gray-800 rounded-xl">
              <span className="text-gray-400">Total to pay</span>
              <span className="text-teal-400 font-bold text-xl">£535</span>
            </div>

            <button onClick={handlePay} disabled={!paymentMethod || loading}
              className="w-full py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 disabled:opacity-50">
              {loading ? 'Processing...' : `Pay £535 with ${
                paymentMethod === 'xodus' ? 'Xodus Pay' :
                paymentMethod === 'klarna' ? 'Klarna' :
                paymentMethod === 'paypal' ? 'PayPal' :
                paymentMethod === 'card' ? 'Card' : '...'
              } 🔒`}
            </button>

            <button onClick={() => setStep(1)} className="w-full py-3 mt-3 text-gray-400 hover:text-white">
              ← Back to Order Summary
            </button>
          </div>
        )}

        {/* Step 3 - Confirmation */}
        {step === 3 && (
          <div className="bg-gray-900 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Payment Confirmed!</h2>
            <p className="text-gray-400 mb-8">Your order has been placed successfully</p>
            <div className="bg-gray-800 rounded-xl p-6 mb-8 text-left">
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Order ID</span>
                <span className="font-mono text-teal-400">#XP-{Math.floor(Math.random() * 90000) + 10000}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Item</span>
                <span>Premium Leather Bag</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Payment</span>
                <span className="capitalize">{paymentMethod === 'xodus' ? 'Xodus Pay' : paymentMethod === 'klarna' ? 'Klarna' : paymentMethod === 'paypal' ? 'PayPal' : 'Card'}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Amount Paid</span>
                <span className="text-teal-400 font-bold">£535</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">You Saved</span>
                <span className="text-green-400 font-bold">£665</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-8">📦 Your item will be shipped within 3-5 business days</p>
            <div className="flex gap-4">
              <a href="/dashboard" className="flex-1 py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 text-center">
                Back to Dashboard
              </a>
              <a href="/products" className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 text-center">
                Keep Bidding
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}