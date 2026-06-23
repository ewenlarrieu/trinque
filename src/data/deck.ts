// TRINQUE — Le deck de 52 cartes.
// La règle dépend du RANG (pas de la couleur), façon Kings Cup / Picolo.

export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank =
  | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface RankRule {
  titre: string;
  regle: string;
}

export interface Card {
  id: string;
  rank: Rank;
  suit: Suit;
  color: 'red' | 'black';
}

export const RULES: Record<Rank, RankRule> = {
  A: {
    titre: 'As · La pyramide',
    regle: 'Tu distribues 5 gorgées, réparties comme tu veux entre autant de personnes que tu veux.',
  },
  '2': {
    titre: 'Deux · Pour toi',
    regle: 'Distribue 2 gorgées à qui tu veux.',
  },
  '3': {
    titre: 'Trois · Pour moi',
    regle: 'Tu bois 3 gorgées. Pas de chance.',
  },
  '4': {
    titre: 'Quatre · Par terre',
    regle: 'Le dernier à toucher le sol avec la main boit 2 gorgées.',
  },
  '5': {
    titre: 'Cinq · Les gars',
    regle: 'Tous les mecs boivent une gorgée.',
  },
  '6': {
    titre: 'Six · Les filles',
    regle: 'Toutes les filles boivent une gorgée.',
  },
  '7': {
    titre: 'Sept · Le ciel',
    regle: 'Lève la main vers le ciel ! Le dernier à le faire boit 2 gorgées.',
  },
  '8': {
    titre: 'Huit · Le binôme',
    regle: 'Choisis un binôme. À chaque fois que tu bois jusqu’à la fin de la partie, ton binôme boit aussi.',
  },
  '9': {
    titre: 'Neuf · La rime',
    regle: 'Dis un mot. Chacun à son tour doit trouver une rime. Le premier qui bloque boit 3 gorgées.',
  },
  '10': {
    titre: 'Dix · La catégorie',
    regle: 'Annonce une catégorie (ex. marques de voiture, pays, prénoms…). Chacun dit à son tour un mot qui appartient à cette catégorie. Le premier qui bloque ou répète boit 5 gorgées.',
  },
  J: {
    titre: 'Valet · Règle perso',
    regle: 'Invente un geste secret. Quand tu le fais, le dernier à le copier boit 3 gorgées. Valable jusqu’à la fin.',
  },
  Q: {
    titre: 'Dame · Questions',
    regle: 'Tu deviens maître des questions. Si quelqu’un répond à une de tes questions, il boit. Jusqu’à la prochaine Dame.',
  },
  K: {
    titre: 'Roi · La règle',
    regle: 'Invente une règle que tout le monde doit suivre jusqu’à la fin de la partie (ex. interdit de dire « boire »). Quiconque l’enfreint boit 3 gorgées.',
  },
};

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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

export function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function freshDeck(): Card[] {
  return shuffle(buildDeck());
}

export function ruleFor(card: Card): RankRule {
  return RULES[card.rank];
}
