// app/[locale]/dashboard/page.tsx
import { Suspense } from 'react'
import {DashboardSkeleton} from '@/components/dashboard/Skeleton'
import DashboardClient from './dashboard-client'
import { ThemeHandler } from '@/components/theme-handler'

export default function DashboardPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ThemeHandler />
      <DashboardClient locale={locale} />
    </Suspense>
  )
}
