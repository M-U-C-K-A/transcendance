/**
 * The site footer, containing a list of links to the company, services, and resources,
 * as well as social media links and a copyright notice.
 */
export function Footer() {
	return (
		<footer className="w-full bg-foreground/5 text-foreground py-12 border-t border-border">
			<div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-xl font-bold text-primary mb-4">dribbble</h3>
						<p className="text-muted-foreground text-sm">
							Creating beautiful digital experiences that help businesses grow and thrive.
						</p>
					</div>

					{[
						{
							title: "Company",
							links: ["About", "Team", "Careers", "Press"],
						},
						{
							title: "Services",
							links: ["Web Development", "UI/UX Design", "Digital Marketing", "Branding"],
						},
						{
							title: "Resources",
							links: ["Blog", "Case Studies", "Portfolio", "FAQ"],
						},
					].map((column, index) => (
						<div key={index}>
							<h3 className="text-lg font-semibold mb-4">{column.title}</h3>
							<ul className="space-y-2">
								{column.links.map((link, linkIndex) => (
									<li key={linkIndex}>
										<a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
											{link}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
					<p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Dribbble. All rights reserved.</p>
					<div className="flex space-x-6 mt-4 md:mt-0">
						{["Twitter", "Instagram", "LinkedIn", "GitHub"].map((social) => (
							<a
								key={social}
								href="#"
								className="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{social}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	)
}
