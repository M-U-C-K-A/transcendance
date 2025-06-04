"use client"

import type React from "react"
import { useState } from "react"
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
import { Settings } from "lucide-react"
import { useUsernameFromJWT } from "@/hooks/use-username-from-jwt"
import { useBioFromJWT } from "@/hooks/use-bio-from-jwt"
import { useAvatarFromJWT } from "@/hooks/use-avatar-from-jwt"
import { useJWT } from "@/hooks/use-jwt"
import { useIdFromJWT } from "@/hooks/use-id-from-jwt"

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
	const avatarFromJWT = useAvatarFromJWT()
	const id = useIdFromJWT()

	const [formData, setFormData] = useState<ProfileFormData>({
		username: usernameFromJWT || "",
		bio: bioFromJWT || "",
		profilePhotoUrl: avatarFromJWT || "",
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				const base64String = reader.result as string;
				const base64Data = base64String.split(',')[1];
				setFormData((prev) => ({ ...prev, profilePhotoUrl: base64Data }))
			}
			reader.readAsDataURL(file)
		}
	}

	const handleSave = async () => {
		console.group("[ProfileEditDialog] handleSave")

		const usernameToSend = formData.username?.trim() || usernameFromJWT || ""
		const bioToSend = formData.bio?.trim() || bioFromJWT || ""
		const avatarToSend = formData.profilePhotoUrl || ""

		const result = ProfileSchema.safeParse({
			username: usernameToSend,
			bio: bioToSend,
			profilePhotoUrl: avatarToSend,
		})

		if (!result.success) {
			console.error("❌ Erreurs de validation Zod :", result.error.format())
			alert("Certains champs ne sont pas valides.")
			console.groupEnd()
			return
		}

		try {
			const payload = {
				newUsername: usernameToSend,
				newBio: bioToSend,
				newAvatar: avatarToSend,
			}

			console.log("Sending profile update with payload:", {
				...payload,
				newAvatar: avatarToSend ? "base64_data_present" : "no_avatar",
			})

			const response = await fetch("/api/editprofile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(payload),
			})

			const resJson = await response.json()
			console.log("📥 Réponse JSON :", resJson)

			if (!response.ok) {
				console.error("❌ Erreur HTTP :", response.status)
				throw new Error("Échec de la mise à jour")
			}

			if (resJson.token) {
				localStorage.setItem("token", resJson.token)
				console.log("🔐 Nouveau token stocké.")
			}

			alert("✅ Profil mis à jour avec succès")
		} catch (err) {
			console.error("🚨 Erreur dans handleSave :", err)
			alert("Une erreur est survenue.")
		}

		console.groupEnd()
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
						Modifiez vos informations personnelles ci-dessous. Cliquez sur enregistrer lorsque vous avez terminé.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex justify-center items-center flex-col gap-2">
						<Avatar className="h-20 w-20">
							<AvatarImage
								src={`/profilepicture/${id}.webp`}
								alt={formData.username}
							/>
							<AvatarFallback>{formData.username.charAt(0)}</AvatarFallback>
						</Avatar>
						<Input
							id="picture"
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="w-64"
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
