"use client"

import { useState } from "react"
import { useJWT } from "@/hooks/use-jwt"
import { useI18n } from "@/i18n-client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function AddColleagueDialog() {
  const jwt = useJWT()
  const t = useI18n()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Créez le schéma Zod à l'intérieur du composant pour avoir accès à t()
  const formSchema = z.object({
    username: z.string()
      .min(3, t("dashboard.colleagues.addDialog.errors.tooShort"))
      .max(20, t("dashboard.colleagues.addDialog.errors.tooLong"))
      .regex(/^[a-zA-Z0-9_]+$/, t("dashboard.colleagues.addDialog.errors.invalidChars")),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          username: values.username,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      toast.success(t("dashboard.colleagues.addDialog.success.title"), {
        description: t("dashboard.colleagues.addDialog.success.description", {
          username: values.username,
        }),
      })
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error(t("dashboard.colleagues.addDialog.error.title"), {
        description: error instanceof Error
          ? error.message
          : t("dashboard.colleagues.addDialog.error.description"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          {t("dashboard.colleagues.add")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dashboard.colleagues.addDialog.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("dashboard.colleagues.addDialog.usernameLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("dashboard.colleagues.addDialog.usernamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading
                ? t("dashboard.colleagues.addDialog.submitting")
                : t("dashboard.colleagues.addDialog.submit")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
