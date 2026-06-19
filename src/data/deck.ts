// TRINQUE — Le deck de 52 cartes.
// La règle dépend du RANG (pas de la couleur), façon Kings Cup / Picolo.
// Copie ce fichier dans src/data/deck.ts

export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface RankRule {
  /** Titre court affiché en haut de la carte révélée. */
  titre: string;
  /** La règle / le défi, en français, ton TRINQUE. */
  regle: string;
}

export interface Card {
  id: string;        // ex. "K♠"
  rank: Rank;
  suit: Suit;
  /** Couleur d'affichage du symbole : rouge pour ♥♦, noir pour ♠♣. */
  color: 'red' | 'black';
}

/** La règle associée à chaque rang. */
export const RULES: Record<Rank, RankRule> = {
  A: {
    titre: 'As · Cascade',
    regle:
      'Cascade ! Tu commences à boire, ton voisin de gauche ne peut s\u2019arrêter que quand tu t\u2019arrêtes, et ainsi de suite tout autour de la table.',
  },
  '2': {
    titre: 'Deux · Pour toi',
    regle: 'Toi. Distribue 2 gorgées à qui tu veux.',
  },
  '3': {
    titre: 'Trois · Pour moi',
    regle: 'Moi. Tu bois 3 gorgées. Pas de chance.',
  },
  '4': {
    titre: 'Quatre · Par terre',
    regle:
      'Le dernier à toucher le sol avec la main boit 2 gorgées. À go… maintenant !',
  },
  '5': {
    titre: 'Cinq · Les gars',
    regle: 'Tous les mecs boivent une gorgée. Santé les gars !',
  },
  '6': {
    titre: 'Six · Les filles',
    regle: 'Toutes les filles boivent une gorgée. À la vôtre !',
  },
  '7': {
    titre: 'Sept · Le ciel',
    regle:
      'Lève la main vers le ciel ! Le dernier à le faire boit 2 gorgées.',
  },
  '8': {
    titre: 'Huit · Le binôme',
    regle:
      'Choisis un binôme. À chaque fois que tu bois jusqu\u2019à la fin de la partie, ton binôme boit aussi.',
  },
  '9': {
    titre: 'Neuf · La rime',
    regle:
      'Dis un mot. Chacun à son tour doit trouver une rime. Le premier qui bloque boit 2 gorgées.',
  },
  '10': {
    titre: 'Dix · La catégorie',
    regle:
      'Choisis une catégorie (marques de bière, prénoms…). Chacun en cite une. Le premier qui bloque boit.',
  },
  J: {
    titre: 'Valet · Règle perso',
    regle:
      'Invente un geste secret. Quand tu le fais, le dernier à le copier boit. Valable jusqu\u2019à la fin.',
  },
  Q: {
    titre: 'Dame · Questions',
    regle:
      'Tu deviens maître des questions. Si quelqu\u2019un répond à une de tes questions, il boit. Jusqu\u2019à la prochaine Dame.',
  },
  K: {
    titre: 'Roi · La règle',
    regle:
      'Invente une règle que tout le monde doit suivre jusqu\u2019à la fin de la partie ! (ex. interdit de dire « boire »).',
  },
};

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/** Construit un deck de 52 cartes, ordonné. */
export function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank}${suit}`,
        rank,
        suit,
        color: suit === '♥' || suit === '♦' ? 'red' : 'black',
      });
    }
  }
  return deck;
}

/** Mélange (Fisher-Yates) — renvoie une nouvelle liste. */
export function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Un deck mélangé prêt à jouer. */
export function freshDeck(): Card[] {
  return shuffle(buildDeck());
}

/** La règle d'une carte donnée. */
export function ruleFor(card: Card): RankRule {
  return RULES[card.rank];
}
