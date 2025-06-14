"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/dashboard/Header"
import { Button } from "@/components/ui/button"
import { useState } from "react"
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

// Schémas de validation
const passwordSchema = z.object({
	password: z.string().min(1, "Le mot de passe est requis"),
})

const userDataSchema = z.object({
	id: z.number(),
	username: z.string().min(1, "Le nom d'utilisateur est requis"),
	email: z.string().email("Email invalide"),
	password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").optional(),
	removeAvatar: z.boolean().optional(),
})

export default function GdprPage() {
	// États pour les modales
	const [showPasswordModal, setShowPasswordModal] = useState(false)
	const [showUserDataModal, setShowUserDataModal] = useState(false)
	const [showDeleteAlert, setShowDeleteAlert] = useState(false)

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
				toast.success("Vérification réussie")
			} else {
				throw new Error("Mot de passe incorrect")
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
				toast.success("Vos informations ont été mises à jour")
				setShowUserDataModal(false)
				setRemoveAvatar(false)

				const data = await response.json()

				if (data.token) {
					localStorage.setItem("token", data.token)
					window.location.reload()
				}
			} else {
				throw new Error("Échec de la mise à jour")
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
				toast.success("Votre compte a été supprimé avec succès");

				localStorage.removeItem("token");

				window.location.href = "/en";
			} else {
				throw new Error("Échec de la suppression du compte");
			}
		} catch (error) {
			handleError(error);
		} finally {
			setDeleteLoading(false);
			setShowDeleteAlert(false);
		}
	};

	// Gestion des erreurs
	const handleError = (error: unknown) => {
		if (error instanceof z.ZodError) {
			toast.error(error.errors[0].message)
		} else {
			toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
		}
	}

	return (
		<>

		<Header />
		<div className="max-w-3xl mx-auto py-10 space-y-6">
			{/* Modale de vérification du mot de passe */}
			<Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-lg font-semibold">Confirmation de sécurité</DialogTitle>
						<DialogDescription className="text-sm text-muted-foreground">
							Pour accéder à vos données personnelles, veuillez confirmer votre identité.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handlePasswordSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="current-password">Mot de passe actuel</Label>
							<Input
								id="current-password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Entrez votre mot de passe"
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
								Annuler
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? "Vérification..." : "Confirmer"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Modale de modification des données */}
			<Dialog open={showUserDataModal} onOpenChange={setShowUserDataModal}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle className="text-lg font-semibold">Gestion de vos données</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleUserDataSubmit} className="space-y-6">
						{/* Section Avatar */}
						<div className="space-y-4">
							<Label>Photo de profil</Label>
							<div className="flex items-center gap-4">
								<Avatar className="h-16 w-16 border">
									{removeAvatar ? (
										<AvatarFallback>DEL</AvatarFallback>
									) : (
										<>
											<AvatarImage
												src={`/profilepicture/${userData.id}.webp`}
												alt="Votre avatar"
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
									<Label htmlFor="remove-avatar">Supprimer l'avatar</Label>
								</div>
							</div>
						</div>

						{/* Section Informations */}
						<div className="space-y-4">
							<Label>Informations personnelles</Label>

							<div className="grid gap-4">
								<div className="space-y-2">
									<Label htmlFor="username">Nom d'utilisateur</Label>
									<Input
										id="username"
										value={userData.username}
										onChange={(e) => setUserData({...userData, username: e.target.value})}
										disabled={loading}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Adresse email</Label>
									<Input
										id="email"
										type="email"
										value={userData.email}
										onChange={(e) => setUserData({...userData, email: e.target.value})}
										disabled={loading}
									/>
								</div>
							</div>
						</div>

						{/* Section Mot de passe */}
						<div className="space-y-4">
							<Label>Changer le mot de passe</Label>
							<div className="space-y-2">
								<Label htmlFor="new-password">Nouveau mot de passe (optionnel)</Label>
								<Input
									id="new-password"
									type="password"
									value={userData.password}
									onChange={(e) => setUserData({...userData, password: e.target.value})}
									placeholder="Laissez vide pour ne pas modifier"
									disabled={loading}
								/>
								<p className="text-xs text-muted-foreground">
									Minimum 8 caractères
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
								Annuler
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? "Enregistrement..." : "Enregistrer les modifications"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Alerte de suppression de compte */}
			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
						<AlertDialogDescription>
							Cette action supprimera définitivement votre compte et toutes vos données.
							Vous ne pourrez pas annuler cette opération.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleteLoading}>Annuler</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleAccountDeletion}
							className="bg-destructive hover:bg-destructive/90"
							disabled={deleteLoading}
						>
							{deleteLoading ? "Suppression..." : "Supprimer mon compte"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Contenu principal */}
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Gestion de vos données personnelles</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Section Données personnelles */}
					<section className="space-y-4">
						<div className="flex justify-between items-center">
							<div>
								<h2 className="text-lg font-semibold">Vos données personnelles</h2>
								<p className="text-sm text-muted-foreground">
									Consultez et modifiez les informations associées à votre compte
								</p>
							</div>
							<Button onClick={() => setShowPasswordModal(true)}>
								Gérer mes données
							</Button>
						</div>
					</section>

					<Separator />

					{/* Section Créateurs */}
					<CreatorsCard />


					<Separator />

					{/* Section Actions critiques */}
					<section className="space-y-4">
						<h2 className="text-lg font-semibold text-destructive">Actions critiques</h2>

						<div className="rounded-lg border border-destructive/30 p-4 space-y-3">
							<div>
								<h3 className="font-medium">Suppression du compte</h3>
								<p className="text-sm text-muted-foreground">
									Cette action est irréversible. Toutes vos données seront définitivement supprimées.
								</p>
							</div>

							<Button
								variant="destructive"
								onClick={() => setShowDeleteAlert(true)}
								className="w-full sm:w-auto"
							>
								Supprimer mon compte
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
