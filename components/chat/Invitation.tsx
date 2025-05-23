

import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function Invitation() {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Button disabled>
						<Swords />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					Lancer une partie
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
