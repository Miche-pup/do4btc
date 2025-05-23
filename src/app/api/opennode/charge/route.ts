import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { ideaId, amount } = await request.json()

    if (!ideaId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.opennode.com/v1/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.OPENNODE_API_KEY!,
      },
      body: JSON.stringify({
        amount,
        description: `Vote for idea #${ideaId}`,
        currency: 'sats',
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/opennode-webhook`,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}?success=true`,
        charge_id: `idea-${ideaId}`,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create OpenNode charge')
    }

    const data = await response.json()
    return NextResponse.json(data.data)
  } catch (error) {
    console.error('Error creating charge:', error)
    return NextResponse.json(
      { error: 'Failed to create charge' },
      { status: 500 }
    )
  }
} 