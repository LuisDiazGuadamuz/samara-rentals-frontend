import { useEffect, useState } from 'react'

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setShowInstall(true)
    }

    const handleAppInstalled = () => {
      setShowInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setShowInstall(false)
    setDeferredPrompt(null)

    if (outcome === 'accepted') {
      console.log('PWA instalada por el usuario')
    }
  }

  if (!showInstall) {
    return null
  }

  return (
    <button
      type="button"
      className="rounded-full border border-samara-charcoal bg-white px-3 py-2 text-sm font-semibold text-samara-charcoal transition-colors hover:bg-samara-stone/80"
      onClick={handleInstallClick}
      aria-label="Instalar Samara Rentals"
    >
      Instalar App
    </button>
  )
}

export default InstallPWA
