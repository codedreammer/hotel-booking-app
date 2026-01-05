'use client'

import Link from 'next/link'
import Tooltip from './Tooltip'
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'

export default function OwnerCTAButton() {
  const handleClick = () => {
    trackEvent(ANALYTICS_EVENTS.OWNER_CTA_CLICKED, {
      source: 'header',
      timestamp: new Date().toISOString()
    })
  }

  return (
    <Tooltip content="Earn by hosting — add your hotel and start receiving bookings.">
      <Link 
        href="/become-owner"
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
      >
        List your property
      </Link>
    </Tooltip>
  )
}