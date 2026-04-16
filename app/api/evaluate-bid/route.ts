import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { product, bidAmount, highestBid, totalBids } = body

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `You are the AI pricing engine for Xodus Pay, an AI-powered bidding platform for premium fashion retailers.

Evaluate this bid and respond ONLY in JSON format with no extra text:

Product: ${product.name}
Category: ${product.category}
Original Price: £${product.original_price}
Minimum Bid: £${product.minimum_bid}
Current Highest Bid: £${highestBid || product.minimum_bid}
Total Bids So Far: ${totalBids}
Stock Quantity: ${product.stock_quantity}
Buyer's Bid: £${bidAmount}

Respond with this exact JSON:
{
  "decision": "accepted" or "countered" or "rejected",
  "message": "A short friendly message to the buyer (max 20 words)",
  "counter_offer": null or a number (only if countered),
  "savings": how much they save vs original price as a number,
  "confidence": "high" or "medium" or "low"
}`
      }]
    })
  })

  const data = await response.json()
  const text = data.content[0].text
  const parsed = JSON.parse(text)
  return NextResponse.json(parsed)
}