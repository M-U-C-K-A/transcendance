export default {
  "page_not_found": "Page Not Found",
  "page_not_found_description": "The page you are looking for does not exist.",
  "back_to_home": "Back to Home",
  "common": {
    "appName": "PongMaster",
    "login": "Login",
    "register": "Register",
    "freeRegister": "Register for free",
    "statistics": "Statistics",
    "dashboard": "Dashboard",
    "back": "Back",
    "cancel": "Cancel",
    "removing": "Removing",
    "remove": "Remove",
    "copyright": "© 2025 PongMaster Enterprise. All rights reserved."
  },
  "landing": {
    "hero": {
      "title": "PongMaster Enterprise",
      "subtitle": "The professional Pong platform for businesses and competitive players.",
      "cta": "Start playing"
    },
    "features": {
      "title": "Features",
      "gameModes": {
        "title": "Game Modes",
        "description": "Classic, custom or tournament. Choose your way to play and challenge your opponents."
      },
      "chat": {
        "title": "Real-time Chat",
        "description": "Chat with other players, organize matches and share your strategies in our general chat."
      },
      "elo": {
        "title": "ELO Tracking",
        "description": "Track your progress with our ELO ranking system and compare your performance."
      }
    },
    "cta": {
      "title": "Ready to play?",
      "subtitle": "Join our community of professional players and start improving now."
    }
  },
  "auth": {
    "login": {
      "title": "Login",
      "description": "Sign in to access your PongMaster account",
      "email": "Email",
      "password": "Password",
      "forgotPassword": "Forgot password?",
      "continueWithGoogle": "Continue with Google",
      "submit": "Sign in"
    },
    "register": {
      "title": "Register",
      "description": "Create an account to start playing PongMaster",
      "username": "Username",
      "email": "Email",
      "password": "Password",
      "continueWithGoogle": "Sign up with Google",
      "submit": "Create account"
    }
  },
  "dashboard": {
    "title": "dashboard",
    "welcome": "Welcome",
    "profile": {
      "title": "Profile",
      "edit": "Edit profile",
      "wins": "Wins",
      "losses": "Losses",
      "tournaments": "Tournaments",
      "level": "Level"
    },
    "colleagues": {
      "title": "Colleagues",
      "online": "Online",
      "offline": "Offline",
      "add": "Add colleague",
      "notLoggedIn": "Your not logged",
      "viewProfile": "View Profile",
      "noFriends": "You have no friends",
      "remove": "Remove friend",
      "removeFriendTitle": "Remove friend",
      "removeFriendConfirmation": "Do you really wanna remove this friend ",
      "pendingInvitations": "Pending friends invitation",
      "addDialog": {
        "title": "Add colleague",
        "usernameLabel": "Username",
        "usernamePlaceholder": "Enter the username of the person you want to add as a colleague",
        "submit": "Add",
        "submitting": "Adding...",
        "errors": {
          "tooShort": "Your username should be at least 3 characters long.",
          "tooLong": "Your username should be at most 20 characters long.",
          "invalidChars": "Your username should only contain letters, numbers or underscores."
        },
        "success": {
          "title": "Colleague added",
          "description": "You have successfully added {username} as a colleague"
        },
        "error": {
          "title": "Error adding colleague",
          "description": "An error occurred while adding the colleague."
        }
      }
    },
    "game": {
      "quickMatch": "Quick Match",
      "customGame": "Custom Game",
      "tournament": "Tournament",
      "quickMatchDesc": "Play a classic game of Pong against a random opponent",
      "customGameDesc": "Create a game with your own rules or join an existing game",
      "tournamentDesc": "Participate in tournaments and win rewards",
      "readyToPlay": "Ready to play?",
      "startDesc": "Click the button below to start",
      "start": "Start quick match",
      "create": "Create",
      "join": "Join",
      "availableGames": "Available games",
      "players": "players",
      "createTournament": "Create tournament",
      "createTournamentDesc": "Organize your own tournament and invite participants",
      "activeTournaments": "Active tournaments",
      "activeTournamentsDesc": "Join an ongoing tournament and compete against other players",
      "view": "View",
      "upcomingTournaments": "Upcoming tournaments",
      "register": "Register"
    },
    "chat": {
      "title": "General Chat",
      "placeholder": "Write a message..."
    }
  },
  "game": {
    "back": "Back to dashboard",
    "info": {
      "title": "Information",
      "gameMode": "Game mode",
      "rules": "Rules",
      "firstToFive": "First to 5 points",
      "players": "Players",
      "player1": "Player 1",
      "player2": "Player 2"
    },
    "controls": {
      "player1": "Player 1 Controls:",
      "player1Keys": "W (up) / S (down)",
      "player2": "Player 2 Controls:",
      "player2Keys": "↑ (up) / ↓ (down)",
      "playAgain": "Play again"
    },
    "chat": {
      "title": "Game chat"
    },
    "winner": "has won!",
    "finalScore": "Final score:"
  },
  "stats": {
    "title": "Statistics and ELO Ranking",
    "period": "Period",
    "lastMonth": "Last month",
    "lastQuarter": "Last quarter",
    "lastYear": "Last year",
    "all": "All",
    "profile": {
      "title": "Profile",
      "wins": "Wins",
      "losses": "Losses",
      "tournaments": "Tournaments",
      "elo": "ELO",
      "rank": "Rank"
    },
    "statistics": {
      "title": "Statistics",
      "gamesPlayed": "Games played",
      "winRate": "Win rate",
      "pointsScored": "Points scored",
      "pointsConceded": "Points conceded",
      "bestStreak": "Best streak",
      "tournamentsWon": "Tournaments won"
    },
    "elo": {
      "title": "Your ELO Evolution",
      "description": "Track your ELO rating evolution over time",
      "progression": "Period progression",
      "bestElo": "Best ELO reached"
    },
    "matches": {
      "title": "Recent Match History",
      "description": "View your latest matches and their impact on your ELO",
      "date": "Date",
      "opponent": "Opponent",
      "result": "Result",
      "score": "Score",
      "eloChange": "Δ ELO",
      "victory": "Victory",
      "defeat": "Defeat"
    },
    "ranking": {
      "title": "Global ranking",
      "description": "Discover your position in the ranking of best players",
      "rank": "Rank",
      "player": "Player",
      "elo": "ELO",
      "games": "Games",
      "winRate": "Win %",
      "you": "You"
    }
  }
} as const
