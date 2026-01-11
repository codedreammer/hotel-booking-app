'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ChecklistItem {
  id: string
  title: string
  href: string
  completed: boolean
}

export default function OnboardingChecklist() {
  const [isVisible, setIsVisible] = useState(true)
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 'hotel', title: 'Add your first hotel', href: '/owner/dashboard/hotels/new', completed: false },
    { id: 'rooms', title: 'Add rooms & pricing', href: '/owner/rooms', completed: false },
    { id: 'payment', title: 'Complete payment setup', href: '/owner/dashboard', completed: false },
    { id: 'publish', title: 'Publish your listing', href: '/owner/hotels', completed: false }
  ])

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('onboarding-checklist')
    if (saved) {
      const { isVisible: savedVisible, items: savedItems } = JSON.parse(saved)
      setIsVisible(savedVisible)
      setItems(savedItems)
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('onboarding-checklist', JSON.stringify({ isVisible, items }))
  }, [isVisible, items])

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const completedCount = items.filter(item => item.completed).length
  const isAllCompleted = completedCount === items.length

  if (!isVisible || isAllCompleted) return null

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-900">
            Welcome! Complete your setup
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            {completedCount} of {items.length} steps completed
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-500 hover:text-blue-700"
          aria-label="Dismiss checklist"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <button
              onClick={() => toggleItem(item.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.completed
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 hover:border-blue-500'
                }`}
            >
              {item.completed && '✓'}
            </button>
            <Link
              href={item.href}
              className={`flex-1 text-sm hover:text-blue-600 ${item.completed
                  ? 'text-gray-500 line-through'
                  : 'text-gray-900'
                }`}
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-blue-100 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>
    </div>
  )
}