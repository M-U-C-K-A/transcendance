import sqlite3
from tabulate import tabulate  # Pour un affichage plus propre des résultats

class SQLiteQueryTool:
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None
        self.cursor = None

    def connect(self):
        """Établir la connexion à la base de données"""
        try:
            self.connection = sqlite3.connect(self.db_name)
            self.cursor = self.connection.cursor()
            print(f"Connecté à la base de données: {self.db_name}")
        except sqlite3.Error as e:
            print(f"Erreur de connexion: {e}")

    def execute_query(self, query):
        """Exécuter une requête SELECT et afficher les résultats"""
        try:
            self.cursor.execute(query)

            # Récupérer les noms des colonnes
            columns = [description[0] for description in self.cursor.description]

            # Récupérer les données
            data = self.cursor.fetchall()

            # Afficher les résultats de manière élégante
            if data:
                print("\nRésultats:")
                print(tabulate(data, headers=columns, tablefmt="grid"))
                print(f"\n{len(data)} ligne(s) retournée(s).")
            else:
                print("\nAucun résultat trouvé.")

        except sqlite3.Error as e:
            print(f"Erreur lors de l'exécution de la requête: {e}")

    def get_table_list(self):
        """Afficher la liste des tables disponibles"""
        try:
            self.cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = self.cursor.fetchall()
            if tables:
                print("\nTables disponibles:")
                for table in tables:
                    print(f"- {table[0]}")
            else:
                print("La base de données ne contient aucune table.")
        except sqlite3.Error as e:
            print(f"Erreur lors de la récupération des tables: {e}")

    def close(self):
        """Fermer la connexion à la base de données"""
        if self.connection:
            self.connection.close()
            print("Connexion à la base de données fermée.")

def main():
    print("\n=== Outil de requêtes SQLite ===")
    db_name = input("Entrez le nom de la base de données (ex: ma_base.db): ").strip()

    tool = SQLiteQueryTool(db_name)
    tool.connect()
    tool.get_table_list()

    while True:
        print("\nOptions:")
        print("1. Exécuter une requête SELECT")
        print("2. Afficher les tables disponibles")
        print("3. Quitter")

        choice = input("Votre choix (1-3): ").strip()

        if choice == "1":
            query = input("\nEntrez votre requête SELECT: ").strip()
            tool.execute_query(query)
        elif choice == "2":
            tool.get_table_list()
        elif choice == "3":
            break
        else:
            print("Choix invalide. Veuillez réessayer.")

    tool.close()
    print("Au revoir!")

if __name__ == "__main__":
    main()
