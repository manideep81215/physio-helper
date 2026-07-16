import { useEffect, useState } from 'react'
import './InstallPrompt.css'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (isStandalone) setInstalled(true)

    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!isStandalone && !sessionStorage.getItem('install-dismissed')) {
        setVisible(true)
      }
    }
    const onInstalled = () => {
      setInstalled(true)
      setVisible(false)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed || !visible) return null

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  const dismiss = () => {
    sessionStorage.setItem('install-dismissed', '1')
    setVisible(false)
  }

  return (
    <div className="install-banner" role="dialog" aria-label="Install app">
      <span className="install-text">Add this routine to your home screen for quick, offline access.</span>
      <div className="install-actions">
        <button className="install-btn" onClick={handleInstall}>Install</button>
        <button className="install-dismiss" onClick={dismiss} aria-label="Dismiss">✕</button>
      </div>
    </div>
  )
}
