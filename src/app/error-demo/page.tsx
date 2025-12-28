'use client'

import { useState } from 'react'

export default function ErrorDemoPage() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('This is a demo error to show the error boundary in action!')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Error Boundary Demo</h1>
      <p className="text-gray-600 mb-4">Click the button below to trigger an error and see the fallback UI.</p>
      <button
        onClick={() => setShouldError(true)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Trigger Error
      </button>
    </div>
  )
}
