import PongGame from "@/components/landing/PongGame"
import { Navbar } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#1e1333]">
      <Navbar />

      <section className="w-full flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
        <div className="container max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
              ft_transcendence: Le Pong Ultime
            </h1>
            <p className="text-xl text-pink-300 text-center max-w-2xl">
              Un projet final de l'École 42 qui transforme le légendaire Pong en une expérience multijoueur moderne avec WebSocket, NextJS et React.
            </p>

            <div className="w-full max-w-3xl aspect-video mt-8 mb-12">
              <PongGame />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href="/auth"
                className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors"
              >
                ./login.sh
              </a>
              <a
                href="/auth"
                className="px-8 py-3 bg-transparent hover:bg-pink-500/10 text-pink-500 border border-pink-500 font-medium rounded-md transition-colors"
              >
                make register
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="game-modes" className="w-full py-16 bg-gradient-to-b from-[#1e1333] to-[#2a1a47] text-white">
        <div className="w-full px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">MODES DE JEU</h2>
          <p className="text-pink-300 text-center max-w-2xl mx-auto mb-12">
            Explorez différents niveaux de difficulté comme dans la piscine de 42, mais cette fois-ci avec Pong!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-12">
            {[
              {
                title: "QUICK MATCH",
                description:
                  "Une partie rapide et propre, respectant toutes les règles. Parfait pour s'entraîner avant les grands défis.",
                icon: "⚡",
                color: "from-pink-500 to-purple-600",
              },
              {
                title: "TOURNAMENT MODE",
                description:
                  "Comme un rush à 42 - 24h de tournois intensifs. Grimpez dans le classement et devenez le meilleur joueur du cluster.",
                icon: "🏆",
                color: "from-yellow-400 to-orange-500",
              },
              {
                title: "CUSTOM MODE",
                description:
                  "Votre environnement de test personnel. Modifiez les paramètres, invitez des amis et expérimentez comme dans votre VM.",
                icon: "🎮",
                color: "from-blue-400 to-indigo-600",
              },
            ].map((mode, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-90`}></div>
                <div className="relative p-8 flex flex-col h-full">
                  <div className="text-4xl mb-4">{mode.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{mode.title}</h3>
                  <p className="text-white/80 mb-6">{mode.description}</p>
                  <div className="mt-auto">
                    <button className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors backdrop-blur-sm">
                      ./play.sh
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
