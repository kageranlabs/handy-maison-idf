import { ServiceDefinition } from './types';

export const SERVICES: ServiceDefinition[] = [
  {
    id: 'cleaning',
    hourlyRate: 20,
    minHours: 2,
    image: '/housecleaning_opt.jpg',
    name: {
      fr: 'Ménage à Domicile',
      en: 'Home Cleaning',
    },
    description: {
      fr: 'Nettoyage en profondeur, désinfection des surfaces et entretien minutieux de votre domicile.',
      en: 'Deep home cleaning, surface sanitization, and meticulous housekeeping for your residence.',
    },
    highlights: {
      fr: ['Fournis par le client (ou achetés sur demande)', 'Service certifié & vérifié'],
      en: ['Client-provided (or purchased upon request)', 'Vetted & trusted service'],
    },
  },
  {
    id: 'ironing',
    hourlyRate: 20,
    minHours: 2,
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1000&auto=format&fit=crop',
    name: {
      fr: 'Repassage & Soin du Linge',
      en: 'Ironing & Laundry Care',
    },
    description: {
      fr: 'Repassage impeccable de vos vêtements, pliage soigné et rangement sur cintre.',
      en: 'Impeccable garment ironing, careful folding, and hanger organizing for your wardrobe.',
    },
    highlights: {
      fr: ['Soin des textiles délicats', 'Repassage chemises & costumes'],
      en: ['Care for delicate fabrics', 'Shirt & suit crisp ironing'],
    },
  },
  {
    id: 'cooking',
    hourlyRate: 20,
    minHours: 2,
    image: '/homecooking_opt.jpg',
    name: {
      fr: 'Cuisine à Domicile',
      en: 'Home Cooking',
    },
    description: {
      fr: 'Préparation de repas équilibrés, faits maison selon vos goûts et régimes alimentaires.',
      en: 'Preparation of balanced, home-cooked meals tailored to your taste and dietary needs.',
    },
    highlights: {
      fr: ['Repas de la semaine (Batch Cooking)', 'Respect des régimes'],
      en: ['Weekly meal prep (Batch Cooking)', 'Dietary requirements respected'],
    },
  },
  {
    id: 'shopping',
    hourlyRate: 20,
    minHours: 2,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop',
    name: {
      fr: 'Courses Alimentaires',
      en: 'Grocery Shopping',
    },
    description: {
      fr: 'Achat de vos produits frais au marché ou en supermarché et rangement dans vos placards.',
      en: 'Fresh grocery shopping at local markets or supermarkets and kitchen pantry stocking.',
    },
    highlights: {
      fr: ['Produits frais & locaux', 'Rangement à domicile'],
      en: ['Fresh & local produce', 'Pantry & fridge stocking'],
    },
  },
  {
    id: 'errands',
    hourlyRate: 20,
    minHours: 2,
    image: '/errands_opt.jpg',
    name: {
      fr: 'Courses & Démarches',
      en: 'Errands & Concierge',
    },
    description: {
      fr: 'Dépôt/retrait pressing, colis, pharmacie, cordonnerie et petits services du quotidien.',
      en: 'Dry cleaning pickup, package delivery, pharmacy, shoesmith, and daily task management.',
    },
    highlights: {
      fr: ['Gestion intégrale de vos colis', 'Gain de temps précieux'],
      en: ['Complete package/errand handling', 'Saves valuable time'],
    },
  },
  {
    id: 'babysitting',
    hourlyRate: 15,
    minHours: 2,
    image: '/babysitting_opt.jpg',
    name: {
      fr: 'Garde d\'Enfants (Babysitting)',
      en: 'Babysitting & Childcare',
    },
    description: {
      fr: 'Garde bienveillante, sortie d\'école, aide aux devoirs et activités ludiques à domicile.',
      en: 'Nurturing childcare, school pickup, homework help, and engaging home activities.',
    },
    highlights: {
      fr: ['Intervenants vérifiés & bienveillants', 'Sortie d\'école & goûter'],
      en: ['Verified & caring providers', 'School pickup & snacks'],
    },
  },
];
