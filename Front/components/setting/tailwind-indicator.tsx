import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function TailwindIndicator() {
	return (
		<Link href={`/dashboard`} className="fixed bottom-1 right-1 z-50 flex items-center gap-2 rounded-full p-3 font-mono font-bold text-sm">
			<Badge variant="secondary" className="block sm:hidden">xs</Badge>
			<Badge variant="secondary" className="hidden sm:block md:hidden">sm</Badge>
			<Badge variant="secondary" className="hidden md:block lg:hidden">md</Badge>
			<Badge variant="secondary" className="hidden lg:block xl:hidden">lg</Badge>
			<Badge variant="secondary" className="hidden xl:block 2xl:hidden">xl</Badge>
			<Badge variant="secondary" className="hidden 2xl:block">2xl</Badge>
		</Link>
	);
}

