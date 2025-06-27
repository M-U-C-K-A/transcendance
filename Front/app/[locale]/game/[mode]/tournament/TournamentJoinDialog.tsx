"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n-client";
import { Participant } from "./tournamentUtils";

interface TournamentJoinDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onJoin: (username: string) => void;
	isLoading: boolean;
	participants: Participant[];
	onRemoveParticipant: (id: string) => void;
	tournamentSlot: number;
	joinError: string | null;
	joinSuccess: string | null;
}

export function TournamentJoinDialog({
	open,
	onOpenChange,
	onJoin,
	isLoading,
	participants,
	onRemoveParticipant,
	tournamentSlot,
	joinError,
	joinSuccess,
}: TournamentJoinDialogProps) {
	const t = useI18n();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{t("game.tournament.create.join")}</DialogTitle>
					<DialogDescription>
						{t("game.tournament.create.joinDescription")}
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						const name = (fd.get("username") || "").toString().trim();
						if (name) onJoin(name);
						e.currentTarget.reset();
					}}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Input
							id="username"
							name="username"
							placeholder={t("game.tournament.create.username")}
							required
							disabled={isLoading}
						/>
						{joinError && <p className="text-sm text-red-500">{joinError}</p>}
						{joinSuccess && (
							<p className="text-sm text-green-600 dark:text-green-400">
								{joinSuccess}
							</p>
						)}
					</div>
					<Button className="w-full" type="submit" disabled={isLoading}>
						{isLoading ? "Connexion..." : t("game.tournament.create.joinBtn")}
					</Button>
				</form>

				<div className="mt-6">
					<h3 className="mb-4 font-semibold text-lg">
						Participants ({participants.length}/{tournamentSlot})
					</h3>
					<div className="space-y-3 max-h-64 overflow-y-auto">
						{participants.map((participant, index) => (
							<div
								key={participant.id}
								className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
							>
								<div className="flex items-center space-x-3">
									<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
										{index + 1}
									</div>
									<img
										src={participant.avatar}
										alt={participant.username}
										className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
									/>
									<div>
										<p className="font-medium text-sm text-primary">
											{participant.username}
										</p>
										<p className="text-xs text-muted-foreground">
											ELO: {participant.elo} | {participant.win}W/
											{participant.lose}L
										</p>
									</div>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onRemoveParticipant(participant.id)}
									className="text-red-500 hover:text-red-700"
								>
									Retirer
								</Button>
							</div>
						))}
						{participants.length === 0 && (
							<p className="text-center text-muted-foreground py-4">
								Aucun participant pour le moment
							</p>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
