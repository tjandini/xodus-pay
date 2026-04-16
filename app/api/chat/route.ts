import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { message } = await request.json()
  const msg = message.toLowerCase()

  let reply = ''

  if (msg.includes('how') && msg.includes('work')) {
    reply = 'Xodus Pay lets you place real-time bids on premium fashion items. Our AI evaluates each bid based on inventory, demand and market trends to give you the best price!'
  } else if (msg.includes('bid')) {
    reply = 'To place a bid, browse our Live Auctions page, select an item, enter your bid amount and our AI will evaluate it instantly. Minimum bids start from £200!'
  } else if (msg.includes('pay') || msg.includes('payment')) {
    reply = 'We support multiple payment methods including Bid with Xodus, Klarna (buy now pay later), PayPal, and Credit/Debit cards. All payments are secured with 256-bit encryption!'
  } else if (msg.includes('klarna')) {
    reply = 'With Klarna you can split your payment into 3 interest-free instalments. Perfect for premium fashion at an affordable pace!'
  } else if (msg.includes('retailer') || msg.includes('sell')) {
    reply = 'Retailers can list their slow-moving stock on our platform via the Retailer Portal. Our AI handles dynamic pricing to maximise recovery without damaging brand value!'
  } else if (msg.includes('ai') || msg.includes('artificial')) {
    reply = 'Our AI evaluates bids in real-time using inventory levels, historical sales data, market demand and consumer behaviour to ensure fair pricing for both buyers and retailers!'
  } else if (msg.includes('save') || msg.includes('discount')) {
    reply = 'Buyers typically save 40-70% off original retail prices on Xodus Pay! Our AI ensures you get the best deal while retailers recover maximum value from their stock.'
  } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    reply = 'Hello! Welcome to Xodus Pay! I can help you with bidding, payments, or anything about our platform. What would you like to know?'
  } else if (msg.includes('shipping') || msg.includes('deliver')) {
    reply = 'Items are shipped within 3-5 business days after payment confirmation. We partner with premium couriers to ensure your items arrive safely!'
  } else if (msg.includes('refund') || msg.includes('return')) {
    reply = 'We have a 14-day return policy for all items. Contact our support team and we will arrange a hassle-free return and refund!'
  } else {
    reply = 'Great question! Xodus Pay is an AI-powered bidding platform for premium fashion. You can bid on exclusive items, save up to 70% off retail prices, and pay via Klarna, PayPal or card. Can I help you with anything specific?'
  }

  return NextResponse.json({ reply })
}
