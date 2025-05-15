// locales/client.ts
"use client"
import { createI18nClient } from 'next-international/client'

export const { useI18n, useScopedI18n, useCurrentLocale, useChangeLocale, I18nProviderClient } = createI18nClient({
  en: () => import('./en'),
  fr: () => import('./fr')
})
