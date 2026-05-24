import { create } from 'zustand';

// Translations for the app
const translations = {
  en: {
    home: 'Home',
    tutorials: 'Tutorials',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    allTutorials: 'All Tutorials',
    browseTutorials: 'Browse all free engineering tutorials',
    difficulty: 'Difficulty',
    allLevels: 'All Levels',
    all: 'All',
    filterBy: 'Filter by:',
    prev: '← Prev',
    next: 'Next →',
    noTutorials: 'No tutorials found',
    tryAdjusting: 'Try adjusting your filters',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    searchTutorials: 'Search tutorials...',
    learnEngineering: 'Learn Engineering Online',
    engineering: 'Engineering',
    tutorials_desc: 'Free, comprehensive engineering tutorials across Electrical, Civil, Mechanical, Computer, Chemical Engineering and more.',
  },
  es: {
    home: 'Inicio',
    tutorials: 'Tutoriales',
    contact: 'Contacto',
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    dashboard: 'Panel',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    allTutorials: 'Todos los Tutoriales',
    browseTutorials: 'Explora todos los tutoriales de ingeniería gratuitos',
    difficulty: 'Dificultad',
    allLevels: 'Todos los Niveles',
    all: 'Todos',
    filterBy: 'Filtrar por:',
    prev: '← Anterior',
    next: 'Siguiente →',
    noTutorials: 'No se encontraron tutoriales',
    tryAdjusting: 'Intenta ajustar tus filtros',
    language: 'Idioma',
    theme: 'Tema',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    searchTutorials: 'Buscar tutoriales...',
    learnEngineering: 'Aprende Ingeniería en Línea',
    engineering: 'Ingeniería',
    tutorials_desc: 'Tutoriales de ingeniería gratuitos y completos en Ingeniería Eléctrica, Civil, Mecánica, Informática, Química y más.',
  },
  fr: {
    home: 'Accueil',
    tutorials: 'Tutoriels',
    contact: 'Contact',
    login: 'Connexion',
    signup: 'Inscription',
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    logout: 'Déconnexion',
    allTutorials: 'Tous les Tutoriels',
    browseTutorials: 'Consultez tous les tutoriels d\'ingénierie gratuits',
    difficulty: 'Difficulté',
    allLevels: 'Tous les Niveaux',
    all: 'Tous',
    filterBy: 'Filtrer par :',
    prev: '← Précédent',
    next: 'Suivant →',
    noTutorials: 'Aucun tutoriel trouvé',
    tryAdjusting: 'Essayez d\'ajuster vos filtres',
    language: 'Langue',
    theme: 'Thème',
    darkMode: 'Mode Sombre',
    lightMode: 'Mode Clair',
    searchTutorials: 'Rechercher des tutoriels...',
    learnEngineering: 'Apprenez l\'Ingénierie en Ligne',
    engineering: 'Ingénierie',
    tutorials_desc: 'Tutoriels d\'ingénierie gratuits et complets en Génie Électrique, Civil, Mécanique, Informatique, Chimie et plus.',
  },
  de: {
    home: 'Startseite',
    tutorials: 'Tutorials',
    contact: 'Kontakt',
    login: 'Anmelden',
    signup: 'Registrieren',
    dashboard: 'Armaturenbrett',
    profile: 'Profil',
    logout: 'Abmelden',
    allTutorials: 'Alle Tutorials',
    browseTutorials: 'Kostenlose Ingenieur-Tutorials durchsuchen',
    difficulty: 'Schwierigkeit',
    allLevels: 'Alle Stufen',
    all: 'Alle',
    filterBy: 'Filtern nach:',
    prev: '← Zurück',
    next: 'Weiter →',
    noTutorials: 'Keine Tutorials gefunden',
    tryAdjusting: 'Versuchen Sie, Ihre Filter anzupassen',
    language: 'Sprache',
    theme: 'Thema',
    darkMode: 'Dunkler Modus',
    lightMode: 'Heller Modus',
    searchTutorials: 'Tutorials durchsuchen...',
    learnEngineering: 'Ingenieurwissenschaften Online Lernen',
    engineering: 'Ingenieurwissenschaften',
    tutorials_desc: 'Kostenlose und umfassende Ingenieur-Tutorials in Elektro-, Bau-, Maschinen-, Informatik- und Chemieingenieurwesen und mehr.',
  },
};

export const useLanguageStore = create((set) => ({
  language: 'en',
  initLanguage: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') || 'en';
      set({ language: saved });
      document.documentElement.setAttribute('lang', saved);
    }
  },
  setLanguage: (lang) => {
    if (translations[lang]) {
      localStorage.setItem('language', lang);
      document.documentElement.setAttribute('lang', lang);
      set({ language: lang });
    }
  },
  t: (key) => {
    const state = useLanguageStore.getState();
    return translations[state.language]?.[key] || translations.en[key] || key;
  },
}));

export const getTranslation = (lang, key) => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];
