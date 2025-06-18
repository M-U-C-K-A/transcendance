import { useI18n } from "@/i18n-client"
import Link from "next/link"

export default function NotFound() {
  const { t } = useI18n()

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-2xl">{t("notFound")}</p>
        <Link href="/dashboard"  className="mt-4 inline-block text-lg font-medium text-blue-500 hover:underline">
          {t("backHome")}
        </Link>
      </div>
    </div>
  )
}

