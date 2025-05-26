

import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * A component that renders a button with a tooltip.
 * The button is disabled and displays a sword icon.
 * When hovered, the tooltip shows the text "Lancer une partie".
 *
 * @returns {JSX.Element} The invitation component.
 */
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
