import { Suspense } from 'react'
import { DashboardSkeleton } from '@/components/dashboard/Skeleton'
import DashboardClient from './dashboard-client'
import { ThemeHandler } from '@/components/setting/theme-handler'

type PageProps = {
  params: Promise<{
    locale: string
    jwtToken: string
  }>
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale, jwtToken } = await params

  return (
    <ThemeHandler>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardClient locale={locale} jwtToken={jwtToken} />
      </Suspense>
    </ThemeHandler>
  )
}
