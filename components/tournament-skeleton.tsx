"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TournamentSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-9 w-36" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="players">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="players" disabled>
                      Joueurs
                    </TabsTrigger>
                    <TabsTrigger value="settings" disabled>
                      Paramètres
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="players" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>

                    <div className="flex gap-4 mt-4">
                      <div className="flex-grow">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>

                    <Skeleton className="h-10 w-36 mt-4 ml-auto" />

                    <div className="h-[1px] bg-border my-4" />

                    <div className="h-[300px] rounded-md border p-4">
                      <div className="space-y-4">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
                              <Skeleton className="h-5 w-32" />
                              <div className="flex items-center space-x-2">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-4">
                  <div className="space-y-4 py-4">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                          <div
                            className={`flex items-start space-x-2 max-w-[80%] ${i % 2 === 0 ? "flex-row" : "flex-row-reverse space-x-reverse"}`}
                          >
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div>
                              <Skeleton className={`h-20 w-48 rounded-lg ${i % 2 === 0 ? "bg-muted" : "bg-primary"}`} />
                              <Skeleton className="h-3 w-16 mt-1" />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
              <div className="p-4 mt-auto">
                <div className="flex w-full items-center space-x-2">
                  <Skeleton className="h-10 flex-grow" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
