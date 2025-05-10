import type { Locale } from "@/middleware"

// Importation des dictionnaires
import en from "./dictionaries/en.json"
import fr from "./dictionaries/fr.json"
import es from "./dictionaries/es.json"
import ru from "./dictionaries/ru.json"
import de from "./dictionaries/de.json"
import ch from "./dictionaries/ch.json"
import na from "./dictionaries/na.json"
import id from "./dictionaries/id.json"

// Dictionnaires disponibles
const dictionaries = {
  en,
  fr,
  es,
  ru,
  de,
  ch,
  na,
  id
}

// Fonction pour obtenir le dictionnaire correspondant à la locale
export const getDictionary = (locale: Locale) => {
  return dictionaries[locale as keyof typeof dictionaries]
}
