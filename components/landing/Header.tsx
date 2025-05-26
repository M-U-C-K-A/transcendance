"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

/**
 * Responsive navigation bar for the landing page.
 * Includes links to top-level pages and a toggle button for the mobile menu.
 *
 * @param {boolean} [isMenuOpen=false] - Mobile menu state.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsMenuOpen - State updater.
 * @returns JSX element for the navigation bar.
 */
export function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className="w-full bg-background text-foreground border-b border-border">
			<div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<Link href="/" className="flex items-center">
						<span className="text-2xl font-bold text-primary">ft_transcendance</span>
					</Link>

					<nav className="hidden md:flex items-center space-x-8">
						{["Home", "Services", "Portfolio", "About", "Contact"].map((item) => (
							<Link
								key={item}
								href={`#${item.toLowerCase()}`}
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								{item}
							</Link>
						))}
						<Link
							href="/auth"
							className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors"
						>
							Get Started
						</Link>
					</nav>

					<button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className="md:hidden bg-background border-t border-border">
					<div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
						<nav className="flex flex-col space-y-4">
							{["Home", "Services", "Portfolio", "About", "Contact"].map((item) => (
								<Link
									key={item}
									href={`#${item.toLowerCase()}`}
									className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
									onClick={() => setIsMenuOpen(false)}
								>
									{item}
								</Link>
							))}
							<Link
								href="/auth"
								className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors inline-block"
								onClick={() => setIsMenuOpen(false)}
							>
								Get Started
							</Link>
						</nav>
					</div>
				</div>
			)}
		</header>
	)
}
