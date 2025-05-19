import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"
import { useI18n } from "@/i18n-client"

export function UserProfile() {
  const t = useI18n()

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader>
        <CardTitle>{t('dashboard.profile.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD" />
          <AvatarFallback className="text-2xl">JD</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold mb-1">John Doe</h2>
        <p className="text-muted-foreground mb-4">@johndoe</p>
        <div className="grid grid-cols-3 w-full gap-4 text-center mb-4">
          <div>
            <p className="text-2xl font-bold text-primary">24</p>
            <p className="text-xs text-muted-foreground">{t('dashboard.profile.wins')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">12</p>
            <p className="text-xs text-muted-foreground">{t('dashboard.profile.losses')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">3</p>
            <p className="text-xs text-muted-foreground">{t('dashboard.profile.tournaments')}</p>
          </div>
        </div>
        <Badge className="bg-primary/20 text-primary mb-4">{t('dashboard.profile.level')} 8</Badge>
        <ProfileEditDialog
          username="John Doe"
          email="john.doe@example.com"
          bio="Joueur passionné de Pong depuis 2023."
          onSave={(data) => console.log("Profile updated:", data)}
        />
      </CardContent>
    </Card>
  )
} 
