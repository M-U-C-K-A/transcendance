import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Users } from "lucide-react"
import { useI18n } from "@/i18n-client"

export function ColleaguesList() {
  const t = useI18n()

  return (
    <Card className="bg-card border shadow-sm mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" /> {t('dashboard.colleagues.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {["Alice", "Bob", "Charlie", "David", "Eva"].map((friend, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${friend}`} alt={friend} />
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{friend}</p>
                  <p className="text-xs text-muted-foreground">
                    {index % 2 === 0 ? t('dashboard.colleagues.online') : t('dashboard.colleagues.offline')}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          {t('dashboard.colleagues.add')}
        </Button>
      </CardFooter>
    </Card>
  )
} 
