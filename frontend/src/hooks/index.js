// src/hooks/useScrollReveal.js
import { useEffect } from 'react'

/**
 * Hook pour animer les éléments au scroll
 * Usage: useScrollReveal() — applique automatiquement aux éléments .reveal, .reveal-left, .reveal-right
 */
export function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    targets.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  })
}

// src/hooks/useSpeech.js — Web Speech API
export function useSpeech() {
  const speak = (text, { lang = 'fr-FR', rate = 0.95, pitch = 1.05 } = {}) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang  = lang
    utterance.rate  = rate
    utterance.pitch = pitch
    // Tente de choisir une voix française
    const voices = window.speechSynthesis.getVoices()
    const frVoice = voices.find(v => v.lang.startsWith('fr'))
    if (frVoice) utterance.voice = frVoice
    window.speechSynthesis.speak(utterance)
    return utterance
  }

  const stop = () => { if (window.speechSynthesis) window.speechSynthesis.cancel() }

  const isSpeaking = () => window.speechSynthesis?.speaking || false

  return { speak, stop, isSpeaking }
}
