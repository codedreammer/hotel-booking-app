let firedEvents = new Set<string>()

export function trackEvent(name: string, payload?: unknown) {
  if (firedEvents.has(name)) return
  firedEvents.add(name)

  console.log('[Analytics]', name, payload)
}

export const ANALYTICS_EVENTS = {
  OWNER_CTA_CLICKED: 'owner_cta_clicked',
  OWNER_UPGRADE_COMPLETED: 'owner_upgrade_completed'
} as const