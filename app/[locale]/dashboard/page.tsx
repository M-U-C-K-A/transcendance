// app/[locale]/dashboard/page.tsx
import { Suspense } from 'react'
import {DashboardSkeleton} from '@/components/dashboard/Skeleton'
import DashboardClient from './dashboard-client'

export default async function DashboardPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient locale={locale} />
    </Suspense>
  )
}
