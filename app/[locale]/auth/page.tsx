import AuthClient from "./auth-client"

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: { locale: string }
  searchParams: { register?: string }
}) {
  const { locale } = await Promise.resolve(params)
  const isRegister = searchParams.register === "true"

  return <AuthClient isRegister={isRegister} lang={locale} />
}
