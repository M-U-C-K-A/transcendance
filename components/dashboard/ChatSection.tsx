import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageCircle } from "lucide-react"
import { ChatComponent } from "@/components/chat"
import { useI18n } from "@/i18n-client"

export function ChatSection() {
  const t = useI18n()
  const currentUser = "michaelsnow" // Utilisateur fixe pour l'instant

  return (
    <Card className="bg-card border shadow-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" /> {t('dashboard.chat.title')}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="h-[calc(100%-80px)]">
        <ChatComponent 
          placeholder={t('dashboard.chat.placeholder')}
          currentUser={currentUser}
        />
      </CardContent>
    </Card>
  )
}
