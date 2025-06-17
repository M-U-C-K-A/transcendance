// components/CreatorsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const creators = [
  {
    initials: "HD",
    image: "https://cdn.intra.42.fr/users/a2a7276c3000e4c1180a0f7c975b3e32/hdelacou.jpg",
    name: "Hugo Delacour",
    role: "Frontend Developer",
    email: "hdelacou@student.42lehavre.fr"
  },
  {
    initials: "RB",
    image: "https://cdn.intra.42.fr/users/71cfca25335ff0dd421f5d6a4377dbd9/rbardet-.jpg",
    name: "Robin Bardet",
    role: "Backend Developer",
    email: "rbardet@student.42lehavre.fr"
  },
  {
    initials: "TR",
    image: "https://cdn.intra.42.fr/users/817d138365bfd981b4037301445eccfd/throbert.jpg",
    name: "Thomas Robert",
    role: "Game & Docker",
    email: "throbert@student.42lehavre.fr"
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
            <Avatar className="mb-3 h-16 w-16 rounded-full bg-muted">
              <AvatarImage
                src={creator.image}
                alt="@shadcn"
                className="object-cover h-full w-full"
              />
              <AvatarFallback>{creator.initials}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium">{creator.name}</h3>
            <p className="text-sm text-muted-foreground">{creator.role}</p>
            <p className="text-xs text-muted-foreground mt-1">{creator.email}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
