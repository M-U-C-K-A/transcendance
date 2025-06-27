"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n-client";

const gameCreationSchema = z.object({
	name: z.string().min(3, "Le nom doit faire au moins 3 caractères").max(30),
	playerCount: z
		.number()
		.min(2)
		.max(8)
		.refine((val) => val % 2 === 0, {
			message: "Le nombre de joueurs doit être un multiple de 2",
		}),
});

interface TournamentCreationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreate: (data: any) => void;
	isLoading: boolean;
}

export function TournamentCreationDialog({
	open,
	onOpenChange,
	onCreate,
	isLoading,
}: TournamentCreationDialogProps) {
	const form = useForm({
		resolver: zodResolver(gameCreationSchema),
		defaultValues: {
			name: "",
			playerCount: 4,
		},
	});
	const t = useI18n();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("game.tournament.create.title")}</DialogTitle>
					<DialogDescription>
						{t("game.tournament.create.description")}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit(onCreate)}
					className="space-y-6"
				>
					<div className="space-y-3">
						<Label htmlFor="gameName">
							{t("game.tournament.create.name")}
						</Label>
						<Input
							id="gameName"
							placeholder={t("game.tournament.create.placeholder")}
							{...form.register("name")}
							disabled={isLoading}
						/>
						{form.formState.errors.name && (
							<p className="text-sm text-red-500">
								{form.formState.errors.name.message}
							</p>
						)}
					</div>
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<Label>{t("game.tournament.create.playerCount")}</Label>
							<span className="font-bold text-lg">
								{form.watch("playerCount")}
							</span>
						</div>
						<Slider
							defaultValue={[4]}
							min={4}
							max={8}
							step={4}
							onValueChange={(v) => form.setValue("playerCount", v[0])}
							value={[form.watch("playerCount")]}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-muted-foreground px-2">
							<span>4</span>
							<span>8</span>
						</div>
					</div>
					<Button
						type="submit"
						className="w-full py-6 text-lg"
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="animate-pulse">
								{t("game.tournament.create.loading")}
							</span>
						) : (
							t("game.tournament.create.create")
						)}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
