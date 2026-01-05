import Tooltip from '@/components/Tooltip'
import OnboardingChecklist from '@/components/OnboardingChecklist'
import OwnerCTAButton from '@/components/OwnerCTAButton'

export default function TestPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Component Test Page</h1>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Tooltip Test</h2>
        <Tooltip content="This is a test tooltip">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Hover me
          </button>
        </Tooltip>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Owner CTA Button Test</h2>
        <OwnerCTAButton />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Onboarding Checklist Test</h2>
        <OnboardingChecklist />
      </div>
    </div>
  )
}