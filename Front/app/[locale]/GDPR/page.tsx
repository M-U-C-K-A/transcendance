"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/dashboard/Header"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CreatorsCard } from "@/components/gdpr/CreatorsCard"
import { TypographySection } from "@/components/gdpr/TypographySection"
import { useI18n } from "@/i18n-client"

export default function GdprPage() {
  // États pour les modales
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showUserDataModal, setShowUserDataModal] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showGetDataAlert, setShowGetDataAlert] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [isLoading2FA, setIsLoading2FA] = useState(false)
  const t = useI18n()

  useEffect(() => {
    // Charger l'état initial du 2FA
    const fetch2FAStatus = async () => {
      try {
        const response = await fetch("/api/gdpr/twofa", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setTwoFAEnabled(data.result)
        }
      } catch (error) {
        console.error("Failed to fetch 2FA status:", error)
      }
    }

    fetch2FAStatus()
  }, [])

  const userDataSchema = z.object({
    id: z.number(),
    username: z.string().min(1, t('gdpr.validation.usernameRequired')),
    email: z.string().email(t('gdpr.validation.invalidEmail')),
    removeAvatar: z.boolean().optional(),
  })

  // Schémas de validation
  const passwordSchema = z.object({
    password: z.string().min(1, t('gdpr.validation.passwordRequired')),
  })

  // États pour les formulaires
  const [password, setPassword] = useState("")
  const [userData, setUserData] = useState({
    id: 0,
    username: "",
    email: "",
    password: "",
  })
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [getDataLoading, setGetDataLoading] = useState(false)

  // Toggle 2FA
  const handleToggle2FA = async () => {
    setIsLoading2FA(true)
    try {
      const newState = !twoFAEnabled
      const response = await fetch("/api/gdpr/twofa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ enabled: newState }),
      })

      if (response.ok) {
        setTwoFAEnabled(newState)
        toast.success(
          newState
            ? t('gdpr.toasts.twoFAEnabled')
            : t('gdpr.toasts.twoFADisabled')
        )
      } else {
        throw new Error(t('gdpr.errors.twoFAFailed'))
      }
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading2FA(false)
    }
  }

  // Vérification du mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      passwordSchema.parse({ password })

      const response = await fetch("/api/gdpr/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        const data = await response.json()
        const validatedData = userDataSchema.parse(data)
        setUserData(validatedData)
        setShowPasswordModal(false)
        setShowUserDataModal(true)
        toast.success(t('gdpr.toasts.verificationSuccess'))
      } else {
        throw new Error(t('gdpr.errors.incorrectPassword'))
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  // Soumission des modifications
  const handleUserDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validatedData = userDataSchema.parse({
        ...userData,
        removeAvatar,
        password: userData.password || undefined,
      })

      const response = await fetch("/api/gdpr/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(validatedData),
      })

      if (response.ok) {
        toast.success(t('gdpr.toasts.updateSuccess'))
        setShowUserDataModal(false)
        setRemoveAvatar(false)

        const data = await response.json()

        if (data.token) {
          localStorage.setItem("token", data.token)
          window.location.reload()
        }
      } else {
        throw new Error(t('gdpr.errors.updateFailed'))
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  // Suppression du compte
  const handleAccountDeletion = async () => {
    setDeleteLoading(true);

    try {
      const response = await fetch("/api/gdpr/delete", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (response.ok) {
        toast.success(t('gdpr.toasts.deleteSuccess'));

        localStorage.removeItem("token");

        window.location.href = "/en";
      } else {
        throw new Error(t('gdpr.errors.deleteFailed'));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteAlert(false);
    }
  };

  // Récupération des données
  const handleGetData = async () => {
    setGetDataLoading(true);

    try {
      const response = await fetch("/api/gdpr/getdata", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (response.ok) {
        toast.success(t('gdpr.toasts.getDataSuccess'));
      } else {
        throw new Error(t('gdpr.errors.getDataFailed'));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setGetDataLoading(false);
      setShowGetDataAlert(false);
    }
  };

  // Gestion des erreurs
  const handleError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      toast.error(error.errors[0].message)
    } else {
      toast.error(error instanceof Error ? error.message : t('gdpr.errors.genericError'))
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-10 space-y-6">
        {/* Modale de vérification du mot de passe */}
        <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{t('gdpr.modals.password.title')}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t('gdpr.modals.password.description')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t('gdpr.modals.password.label')}</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('gdpr.modals.password.placeholder')}
                  disabled={loading}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={loading}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? t('gdpr.modals.password.verifying') : t('common.confirm')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modale de modification des données */}
        <Dialog open={showUserDataModal} onOpenChange={setShowUserDataModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{t('gdpr.modals.userData.title')}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUserDataSubmit} className="space-y-6">
              {/* Section Avatar */}
              <div className="space-y-4">
                <Label>{t('gdpr.modals.userData.avatarLabel')}</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border">
                    {removeAvatar ? (
                      <AvatarFallback>DEL</AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage
                          src={`/profilepicture/${userData.id}.webp`}
                          alt={t('gdpr.modals.userData.avatarAlt')}
                        />
                        <AvatarFallback>
                          {userData.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="remove-avatar"
                      checked={removeAvatar}
                      onCheckedChange={setRemoveAvatar}
                    />
                    <Label htmlFor="remove-avatar">{t('gdpr.modals.userData.removeAvatar')}</Label>
                  </div>
                </div>
              </div>

              {/* Section Informations */}
              <div className="space-y-4">
                <Label>{t('gdpr.modals.userData.personalInfo')}</Label>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t('gdpr.modals.userData.usernameLabel')}</Label>
                    <Input
                      id="username"
                      value={userData.username}
                      onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('gdpr.modals.userData.emailLabel')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Section Mot de passe */}
              <div className="space-y-4">
                <Label>{t('gdpr.modals.userData.passwordLabel')}</Label>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('gdpr.modals.userData.newPasswordLabel')}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    placeholder={t('gdpr.modals.userData.passwordPlaceholder')}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('gdpr.modals.userData.passwordHint')}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowUserDataModal(false)
                    setRemoveAvatar(false)
                  }}
                  disabled={loading}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? t('gdpr.modals.userData.saving') : t('gdpr.modals.userData.saveChanges')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Alerte de suppression de compte */}
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('gdpr.alerts.delete.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('gdpr.alerts.delete.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteLoading}>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleAccountDeletion}
                className="bg-destructive hover:bg-destructive/90"
                disabled={deleteLoading}
              >
                {deleteLoading ? t('gdpr.alerts.delete.deleting') : t('gdpr.alerts.delete.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Alerte de récupération des données */}
        <AlertDialog open={showGetDataAlert} onOpenChange={setShowGetDataAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('gdpr.alerts.getData.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('gdpr.alerts.getData.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={getDataLoading}>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleGetData}
                disabled={getDataLoading}
              >
                {getDataLoading ? t('gdpr.alerts.getData.sending') : t('gdpr.alerts.getData.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Contenu principal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{t('gdpr.title')}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Section Données personnelles */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{t('gdpr.sections.personalData.title')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t('gdpr.sections.personalData.description')}
                  </p>
                </div>
                <Button onClick={() => setShowPasswordModal(true)}>
                  {t('gdpr.sections.personalData.manageButton')}
                </Button>
              </div>
            </section>

            <Separator />

            {/* Section Sécurité */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{t('gdpr.sections.security.title')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t('gdpr.sections.security.description')}
                  </p>
                </div>
                <Label className="flex items-center space-x-2 cursor-pointer">
                  <Switch
                    id="twofa-toggle"
                    checked={twoFAEnabled}
                    onCheckedChange={handleToggle2FA}
                    disabled={isLoading2FA}
                    aria-label={
                      twoFAEnabled
                        ? t('gdpr.sections.security.twoFAEnabled')
                        : t('gdpr.sections.security.twoFADisabled')
                    }
                  />
                  <span>
                    {twoFAEnabled
                      ? t('gdpr.sections.security.twoFAEnabled')
                      : t('gdpr.sections.security.twoFADisabled')}
                  </span>
                </Label>
              </div>
            </section>

            <Separator />

            {/* Section Export des données */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{t('gdpr.sections.exportData.title')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t('gdpr.sections.exportData.description')}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowGetDataAlert(true)}>
                  {t('gdpr.sections.exportData.requestButton')}
                </Button>
              </div>
            </section>

            <Separator />

            {/* Section Créateurs */}
            <CreatorsCard />

            <Separator />

            {/* Section Actions critiques */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-destructive">{t('gdpr.sections.critical.title')}</h2>

              <div className="rounded-lg border border-destructive/30 p-4 space-y-3">
                <div>
                  <h3 className="font-medium">{t('gdpr.sections.critical.deleteAccount')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('gdpr.sections.critical.deleteWarning')}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteAlert(true)}
                  className="w-full sm:w-auto"
                >
                  {t('gdpr.sections.critical.deleteButton')}
                </Button>
              </div>
            </section>
            <Separator />

            {/* Section Typographie */}
            <TypographySection />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
