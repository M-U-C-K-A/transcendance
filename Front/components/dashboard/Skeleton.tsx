import { Skeleton } from "@/components/ui/skeleton";

/**
 * @returns A skeleton component for the dashboard page.
 */
export function DashboardSkeleton() {
	return (
		<div className="bg-background min-h-screen">
			{/* Skeleton Header */}
			<div className="border-b">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<Skeleton className="h-8 w-32 rounded-md" />
					<div className="flex space-x-4">
						<Skeleton className="h-10 w-10 rounded-full" />
						<Skeleton className="h-10 w-24 rounded-md" />
					</div>
				</div>
			</div>

			<div className="container mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Left Sidebar */}
				<div className="lg:col-span-3 space-y-8">
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-16 w-16 rounded-full" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-24" />
							</div>
						</div>
						<Skeleton className="h-10 w-full rounded-md" />
					</div>

					<div className="space-y-4">
						<Skeleton className="h-6 w-1/2" />
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex items-center space-x-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<Skeleton className="h-4 w-24" />
							</div>
						))}
					</div>
				</div>

				{/* Main Content */}
				<div className="lg:col-span-6 space-y-6">
					<div className="flex space-x-4">
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className="h-10 w-24 rounded-md" />
						))}
					</div>
					<div className="grid grid-cols-2 gap-4">
						{[...Array(6)].map((_, i) => (
							<Skeleton key={i} className="h-32 rounded-lg" />
						))}
					</div>
				</div>

				{/* Right Sidebar */}
				<div className="lg:col-span-3 space-y-4">
					<Skeleton className="h-8 w-1/2" />
					<div className="space-y-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
								<Skeleton className={`h-16 w-3/4 rounded-lg ${i % 2 === 0 ? 'rounded-bl-none' : 'rounded-br-none'}`} />
							</div>
						))}
					</div>
					<div className="flex space-x-2">
						<Skeleton className="h-10 flex-1 rounded-md" />
						<Skeleton className="h-10 w-10 rounded-md" />
					</div>
				</div>
			</div>
		</div>
	);
}
