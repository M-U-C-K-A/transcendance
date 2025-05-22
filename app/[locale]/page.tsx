import PongGame from "@/components/landing/PongGame"
import { Navbar } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      <Navbar />

      <section className="w-full flex-1 flex flex-col items-center justify-center py-12 md:py-24 bg-background">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground text-center z-10">
              Creative solutions for modern challenges
            </h1>
            <img src="/home.png" alt="logo" className="w-260 h-260 absolute top-25 left-20 z-0 invisible md:visible" />
            <p className="text-xl text-muted-foreground text-center max-w-2xl z-10">
              We build beautiful digital experiences that help businesses grow and thrive in the digital landscape.
            </p>

            <div className="w-full max-w-3xl aspect-video mt-8 mb-12 z-10 bg-transparent/50 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm">
              <PongGame />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 z-10">
              <Link
                href="#contact"
                aria-label="Get in touch"
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md transition-colors"
              >
                Get in touch
              </Link>
              <Link
                href="#portfolio"
                aria-label="View our work"
                className="px-8 py-3 bg-transparent hover:bg-primary/10 text-primary border border-primary font-medium rounded-md transition-colors backdrop-blur-sm"
              >
                View our work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="game-modes" className="w-full py-16 bg-muted/10">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">MODES DE JEU</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Affrontez vos amis ou des joueurs du monde entier dans différents modes de jeu
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "QUICKMATCH",
                description:
                  "Trouvez un adversaire instantanément et commencez à jouer en quelques secondes. Parfait pour une partie rapide.",
                icon: "⚡",
                link: "/game/quickmatch",
              },
              {
                title: "TOURNOIS",
                description:
                  "Participez à des tournois quotidiens et hebdomadaires avec des prix à gagner. Grimpez dans le classement mondial.",
                icon: "🏆",
                link: "/game/tournaments",
              },
              {
                title: "CUSTOM",
                description:
                  "Créez votre propre partie avec vos règles. Modifiez la vitesse, la taille des raquettes et invitez vos amis.",
                icon: "🎮",
                link: "/game/custom",
              },
            ].map((mode, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 group bg-foreground/10 p-8"
              >
                <div className="flex flex-col h-full">
                  <div className="text-4xl mb-4">{mode.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-card-foreground">{mode.title}</h3>
                  <p className="text-muted-foreground mb-6">{mode.description}</p>
                  <div className="mt-auto">
                    <Link
                      href={mode.link}
                      aria-label="Jouer maintenant"
                      className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                    >
                      Jouer maintenant
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-16 bg-background">
        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">FONCTIONNALITÉS</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Une expérience de jeu complète avec tout ce dont vous avez besoin
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Matchmaking intelligent",
                description:
                  "Notre système vous met en relation avec des joueurs de niveau similaire pour des parties équilibrées et compétitives.",
                icon: "🧠",
              },
              {
                title: "Classements mondiaux",
                description:
                  "Suivez votre progression et comparez vos performances avec des joueurs du monde entier sur nos leaderboards en temps réel.",
                icon: "🌍",
              },
              {
                title: "Personnalisation avancée",
                description:
                  "Débloquez des raquettes, des balles et des effets visuels uniques pour personnaliser votre expérience de jeu.",
                icon: "🎨",
              },
              {
                title: "Mode spectateur",
                description:
                  "Regardez les meilleurs joueurs s'affronter en direct et apprenez de nouvelles techniques pour améliorer votre jeu.",
                icon: "👁️",
              },
            ].map((feature, index) => (
              <div key={index} className="flex gap-6 p-6 rounded-xl bg-foreground/10 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-3xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 p-2 bg-foreground/10 rounded-full">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <p className="pr-4 text-muted-foreground">
                <span className="font-bold">2,547</span> joueurs en ligne maintenant
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="w-full py-20 bg-card text-card-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=800&width=1600')] bg-no-repeat bg-cover"></div>
        </div>

        <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">PRÊT À JOUER ?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Rejoignez des milliers de joueurs et commencez à jouer dès maintenant. Aucun téléchargement requis !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                aria-label="Jouer gratuitement"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md transition-all text-lg"
              >
                Jouer gratuitement
              </Link>
              <Link
                href="#learn"
                aria-label="En savoir plus"
                className="px-8 py-4 bg-transparent hover:bg-primary/10 text-card-foreground border border-border font-medium rounded-md transition-colors text-lg"
              >
                En savoir plus
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card"></div>
                  ))}
                </div>
                <p className="text-muted-foreground">+10K joueurs</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground">4.9/5 étoiles</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <p className="text-muted-foreground">100% sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
