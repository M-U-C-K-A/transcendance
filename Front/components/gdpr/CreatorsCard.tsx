// components/CreatorsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import Link from "next/link"

const creators = [
  {
    initials: "HD",
    image: "/other/hdelacou.jpg",
    name: "Hugo Delacour",
    role: "Frontend Developer",
    email: "hdelacou@student.42lehavre.fr",
    github: "https://github.com/hdelacou"
  },
  {
    initials: "RB",
    image: "/other/rbardet-.jpg",
    name: "Robin Bardet-Tomczak",
    role: "Backend Developer",
    email: "rbarde-t@student.42lehavre.fr",
    github: "https://github.com/rbardet-t"
  },
  {
    initials: "TR",
    image: "/other/throbert.jpg",
    name: "Thomas Robert",
    role: "Game & Docker",
    email: "throbert@student.42lehavre.fr",
    github: "https://github.com/throbert"
  }
];

export function CreatorsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Équipe de développement</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {creators.map((creator) => (
          <div
            key={creator.initials}
            className="flex flex-col items-center text-center p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <Link href={creator.github} target="_blank" rel="noopener noreferrer">
              <Avatar className="mb-3 h-16 w-16 rounded-full bg-muted">
                <AvatarImage
                  src={creator.image}
                  alt={creator.name}
                  className="object-cover h-full w-full"
                />
                <AvatarFallback>{creator.initials}</AvatarFallback>
              </Avatar>
            </Link>
            <h3 className="font-medium">{creator.name}</h3>
            <p className="text-sm text-muted-foreground">{creator.role}</p>
            <p className="text-xs text-muted-foreground mt-1">{creator.email}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
