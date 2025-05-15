'use client'

import { useI18n } from '@/i18n-client'  // ✅ centralisé via i18n.config.ts

export default function DashboardClient({ locale }: { locale: string }) {
  const t = useI18n()

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  )
}
