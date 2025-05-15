"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TesterAPI() {
  const [endpoint, setEndpoint] = useState("")
  const [method, setMethod] = useState("GET")
  const [body, setBody] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testEndpoint = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        }
      }

      if (method !== "GET" && body) {
        options.body = body
      }

      const res = await fetch(endpoint, options)
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Testeur d&apos;API</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration de la requête</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">URL de l&apos;endpoint</label>
              <Input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>

            <div>
              <label className="block mb-2">Méthode</label>
              <select 
                className="w-full p-2 border rounded"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            {method !== "GET" && (
              <div>
                <label className="block mb-2">Corps de la requête (JSON)</label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="{}"
                />
              </div>
            )}

            <Button 
              onClick={testEndpoint}
              disabled={loading || !endpoint}
            >
              {loading ? "Chargement..." : "Tester l'endpoint"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Réponse</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
