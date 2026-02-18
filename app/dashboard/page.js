"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPro, setIsPro] = useState(false)
const upgraded = searchParams.get("upgraded") === "true"

useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login")
  }
}, [status, router])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome, {session?.user?.name}!</p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {upgraded ? (
            <>
              <h2 className="text-xl font-bold mb-2 text-green-600">Pro Plan ✓</h2>
              <p className="text-gray-600">You have full access to all features. Welcome to Pro!</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">Free Plan</h2>
              <p className="text-gray-600 mb-4">You&apos;re on the free plan. Upgrade to Pro to unlock everything.</p>
              <button
                onClick={async () => {
                  const res = await fetch("/api/checkout", { method: "POST" })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upgrade to Pro
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}