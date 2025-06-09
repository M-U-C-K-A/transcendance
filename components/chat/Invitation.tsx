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
				<TooltipTrigger asChild>
					<span className="border opacity-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 cursor-not-allowed">
						<Swords />
					</span>
				</TooltipTrigger>
				<TooltipContent>
					Lancer une partie
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
