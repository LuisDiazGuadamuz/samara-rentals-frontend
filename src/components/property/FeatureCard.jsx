import { getFeatureIcon } from '../../utils/featureIcons'

export default function FeatureCard({ feature }) {
  const Icon = getFeatureIcon(feature)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-samara-stone/50 bg-samara-ivory p-3 transition hover:border-samara-gold hover:bg-white">
      <Icon className="h-5 w-5 flex-shrink-0 text-samara-gold" aria-hidden="true" />
      <span className="text-sm font-medium text-samara-charcoal">{feature}</span>
    </div>
  )
}
