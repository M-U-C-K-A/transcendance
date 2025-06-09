"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Upload, X } from "lucide-react"
import { useUsernameFromJWT } from "@/hooks/use-username-from-jwt"
import { useBioFromJWT } from "@/hooks/use-bio-from-jwt"
import { useJWT } from "@/hooks/use-jwt"
import { useIdFromJWT } from "@/hooks/use-id-from-jwt"
import { toast } from "sonner"
import Image from "next/image"

// Zod schema
const ProfileSchema = z.object({
  username: z.string().min(3).max(30),
  bio: z.string().max(300).optional(),
  profilePhotoUrl: z.string().nullable(),
})

type ProfileFormData = z.infer<typeof ProfileSchema>

export function ProfileEditDialog({ children, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogTrigger>) {
  const jwt = useJWT()
  const usernameFromJWT = useUsernameFromJWT()
  const bioFromJWT = useBioFromJWT()
  const id = useIdFromJWT()

  const [originalUsername, setOriginalUsername] = useState(usernameFromJWT || "")
  const [formData, setFormData] = useState<ProfileFormData>({
    username: usernameFromJWT || "",
    bio: bioFromJWT || "",
    profilePhotoUrl: null, // On ne stocke plus l'URL depuis le JWT
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(`/profilepicture/${id}.webp`)

  useEffect(() => {
    setOriginalUsername(usernameFromJWT || "")
    setFormData({
      username: usernameFromJWT || "",
      bio: bioFromJWT || "",
      profilePhotoUrl: null,
    })
    setAvatarUrl(`/profilepicture/${id}.webp`) // Mise à jour de l'URL avec l'ID utilisateur
  }, [usernameFromJWT, bioFromJWT, id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]

      // Vérification du type MIME
      if (!file.type.startsWith('image/')) {
        toast.error("Type de fichier non supporté", {
          description: "Veuillez sélectionner une image (JPEG, PNG, etc.)",
        })
        return
      }

      // Vérification de la taille
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Fichier trop volumineux", {
          description: "La taille maximale est de 5MB",
        })
        return
      }

      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const base64Data = base64String.split(',')[1]
        setFormData((prev) => ({ ...prev, profilePhotoUrl: base64Data }))
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedFile(null)
      setFormData((prev) => ({ ...prev, profilePhotoUrl: null }))
    }
  }

  const handleSave = async () => {
    const usernameToSend = formData.username.trim() !== originalUsername
      ? formData.username.trim()
      : originalUsername

    const bioToSend = formData.bio?.trim() || ""
    const avatarToSend = formData.profilePhotoUrl || null // Envoie null si pas de nouvelle image

    const result = ProfileSchema.safeParse({
      username: usernameToSend,
      bio: bioToSend,
      profilePhotoUrl: avatarToSend,
    })

    if (!result.success) {
      toast.error("Erreur de validation", {
        description: Object.values(result.error.flatten().fieldErrors)
          .flat()
          .join('\n'),
      })
      return
    }

    try {
      const payload = {
        newUsername: usernameToSend,
        newBio: bioToSend,
        newAvatar: avatarToSend,
      }

      const response = await fetch("/api/editprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Échec de la mise à jour")
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
        setOriginalUsername(usernameToSend)
        window.location.reload()
      }

      if (avatarToSend) {
        setAvatarUrl(`/profilepicture/${id}.webp?t=${Date.now()}`) // Ajout d'un timestamp pour éviter le cache
      }

      toast.success("Profil mis à jour")
    } catch (err) {
      toast.error("Erreur", {
        description: err instanceof Error ? err.message : "Erreur inconnue",
      })
    }
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Settings">
          {children || <Settings className="h-5 w-5" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Éditer le profil</AlertDialogTitle>
          <AlertDialogDescription>
            Modifiez vos informations personnelles ci-dessous.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center items-center flex-col gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={selectedFile ? URL.createObjectURL(selectedFile) : avatarUrl}
                alt={formData.username}
              />
              <AvatarFallback>{formData.username.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="w-full">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileChange(Array.from(e.target.files))
                  }
                }}
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <div className="flex flex-col items-center gap-1 text-center p-4">
                  <div className="flex items-center justify-center rounded-full border p-2.5">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">Glissez-déposez votre photo ici</p>
                  <p className="text-muted-foreground text-xs">
                    Ou cliquez pour sélectionner (max 5MB)
                  </p>
                </div>
              </label>

              {selectedFile && (
                <div className="mt-2 flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <Image
                      width={40}
                      height={40}
                      quality={100}
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="h-10 w-10 object-cover rounded"
                    />
                    <span className="text-sm truncate max-w-[180px]">
                      {selectedFile.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => {
                      setSelectedFile(null)
                      setFormData(prev => ({ ...prev, profilePhotoUrl: null }))
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Nom d&apos;utilisateur
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="col-span-3"
              placeholder={originalUsername}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Parlez-nous de vous..."
              rows={3}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Enregistrer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
