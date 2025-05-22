"use client"

import type React from "react"

import { useState } from "react"
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
import { User } from "lucide-react"

type ProfileEditDialogProps = {
  username: string
  bio?: string
  profilePhotoUrl?: string
  onSave?: (data: { username: string; bio: string; profilePhotoUrl: string }) => void
  children?: React.ReactNode
}

export function ProfileEditDialog({ username, bio = "", profilePhotoUrl = "", onSave, children }: ProfileEditDialogProps) {
  const [formData, setFormData] = useState({
    username,
    bio,
    profilePhotoUrl,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onSave?.(formData)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full">
            <User className="mr-2 h-4 w-4" /> Éditer le profil
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Éditer le profil</AlertDialogTitle>
          <AlertDialogDescription>
            Modifiez vos informations personnelles ci-dessous. Cliquez sur enregistrer lorsque vous avez terminé.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.profilePhotoUrl} alt="Profile Photo" />
              <AvatarFallback>{username.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profilePhotoUrl" className="text-right">
              Photo de Profil URL
            </Label>
            <Input
              id="profilePhotoUrl"
              name="profilePhotoUrl"
              value={formData.profilePhotoUrl}
              onChange={handleChange}
              className="col-span-3"
              placeholder="URL de la photo de profil"
            />
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

