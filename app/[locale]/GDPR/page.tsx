"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Schéma Zod pour la vérification du mot de passe
const passwordSchema = z.object({
  password: z.string().min(1, "Le mot de passe est requis"),
});

// Schéma Zod pour les données utilisateur
const userDataSchema = z.object({
  id: z.string(),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export default function GdprPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUserDataModal, setShowUserDataModal] = useState(false);
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation avec Zod
      passwordSchema.parse({ password });

      const response = await fetch("/api/gdpr/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        // Validation des données reçues avec Zod
        const validatedData = userDataSchema.parse(data);
        setUserData(validatedData);
        setShowPasswordModal(false);
        setShowUserDataModal(true);
        toast.success("Vérification réussie");
      } else {
        throw new Error("Mot de passe incorrect");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation avec Zod
      const validatedData = userDataSchema.parse(userData);

      const response = await fetch("/api/gdpr/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        toast.success("Vos informations ont été mises à jour");
        setShowUserDataModal(false);
      } else {
        throw new Error("Échec de la mise à jour");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Popup de vérification du mot de passe */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vérification requise</DialogTitle>
            <DialogDescription>
              Veuillez entrer votre mot de passe pour accéder à vos informations.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3"
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Vérification..." : "Confirmer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Popup de modification des informations */}
      <Dialog open={showUserDataModal} onOpenChange={setShowUserDataModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier vos informations</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUserDataSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Nom d'utilisateur
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({...userData, username: e.target.value})}
                  className="col-span-3"
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="col-span-3"
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right">
                  Nouveau mot de passe
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({...userData, password: e.target.value})}
                  className="col-span-3"
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowUserDataModal(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Envoi..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Politique de Confidentialité (GDPR)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Vos données personnelles</h1>
            <Button onClick={() => setShowPasswordModal(true)}>
              Modifier ses informations
            </Button>
          </div>

          <Skeleton className="h-[125px] w-full rounded-xl" />

          <p>
            Cette page décrit les dispositions prises par l&apos;application Transcendance pour se conformer au Règlement Général sur la Protection des Données (GDPR).
          </p>
          <Separator className="my-4" />
          <h2>Responsables de traitement</h2>
          <ul>
            <li><strong>Hugo Delacour</strong> - hugo.delacour@email.com</li>
            <li><strong>Jean Dupont</strong> - jean.dupont@email.com</li>
            <li><strong>Marie Martin</strong> - marie.martin@email.com</li>
          </ul>
          <Separator className="my-4" />
          <h2>Données collectées</h2>
          <ul>
            <li>Identifiants de connexion</li>
            <li>Adresse email</li>
            <li>Statistiques d&apos;utilisation</li>
          </ul>
          <h2>Finalités du traitement</h2>
          <ul>
            <li>Gestion des comptes utilisateurs</li>
            <li>Amélioration de l&apos;expérience utilisateur</li>
            <li>Sécurité et prévention de la fraude</li>
          </ul>
          <h2>Vos droits</h2>
          <ul>
            <li>Droit d&apos;accès, de rectification et de suppression de vos données</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&apos;opposition et de limitation du traitement</li>
          </ul>
          <h2>Contact</h2>
          <p>
            Pour toute question ou demande concernant vos données personnelles, veuillez contacter l&apos;un des responsables de traitement listés ci-dessus.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
