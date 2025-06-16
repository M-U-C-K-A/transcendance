"use client"

import { Header } from "@/components/dashboard/Header"
import { UserProfile } from "@/components/dashboard/UserProfile"
import { ColleaguesList } from "@/components/dashboard/Colleagues/ColleaguesList"
import { GameTabs } from "@/components/dashboard/GameTabs"
import { ChatSection } from "@/components/dashboard/ChatSection"

export default function DashboardClient({ locale, jwtToken }: { locale: string, jwtToken: string }) {
  localStorage.removeItem("currentGameId");
  localStorage.removeItem("currentGameName");
  return (
    <div className="bg-background min-h-screen">
      <Header locale={locale} />

      <div className="container mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-3">
          <UserProfile />
          <ColleaguesList locale={locale} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-6">
          <GameTabs locale={locale} />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3">
          <ChatSection currentUser={jwtToken} />
        </div>
      </div>
    </div>
  );
}

