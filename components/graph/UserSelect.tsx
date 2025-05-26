import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

interface User {
	id: number
	username: string
	elo: number
}

interface UserSelectProps {
	onUserSelect: (userId: number) => void
	selectedUserId: number
}

/**
 * A component that allows users to select a user from a list fetched from an API.
 * Displays the selected user's username and ELO, and allows searching through a list of users.
 *
 * @param {Object} props - Component props
 * @param {function} props.onUserSelect - Callback function that is called when a user is selected
 * @param {number} props.selectedUserId - ID of the currently selected user
 */
export function UserSelect({ onUserSelect, selectedUserId }: UserSelectProps) {
	const [open, setOpen] = useState(false)
	const [users, setUsers] = useState<User[]>([])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch('http://localhost:3001/stats/users')
				if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs')
				const data = await response.json()
				setUsers(data)
			} catch (error) {
				console.error('Erreur:', error)
			}
		}

		fetchUsers()
	}, [])

	const selectedUser = users.find(user => user.id === selectedUserId)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[300px] justify-between"
				>
					{selectedUser ? selectedUser.username : "Sélectionner un utilisateur..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0">
				<Command>
					<CommandInput placeholder="Rechercher un utilisateur..." />
					<CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
					<CommandGroup>
						{users.map((user) => (
							<CommandItem
								key={user.id}
								value={user.username}
								onSelect={() => {
									onUserSelect(user.id)
									setOpen(false)
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										selectedUserId === user.id ? "opacity-100" : "opacity-0"
									)}
								/>
								{user.username} (ELO: {user.elo})
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
