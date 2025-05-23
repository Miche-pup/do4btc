import { useState } from 'react'
import QRCode from 'react-qr-code'

interface LightningPaymentProps {
  ideaId: number
  onClose: () => void
}

export default function LightningPayment({ ideaId, onClose }: LightningPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<{
    chargeId: string
    invoice: string
    amount: number
  } | null>(null)

  const createCharge = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/opennode/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId,
          amount: 1000, // 1000 sats = 10 cents
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create charge')
      }

      const data = await response.json()
      setPaymentData({
        chargeId: data.id,
        invoice: data.lightning_invoice.payreq,
        amount: data.amount,
      })
    } catch (err) {
      setError('Failed to create payment. Please try again.')
      console.error('Error creating charge:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Vote with Lightning ⚡</h2>

        {!paymentData ? (
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Vote for this idea by sending 1000 sats (about 10 cents)
            </p>
            <button
              onClick={createCharge}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Payment'}
            </button>
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <QRCode
                value={paymentData.invoice}
                size={200}
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Scan to pay {paymentData.amount} sats
            </p>
            <p className="text-xs text-gray-500">
              Payment will be confirmed automatically
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 