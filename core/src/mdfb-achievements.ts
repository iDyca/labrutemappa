export type AchievementType = 'WINSTREAK' | 'MATCHES' | 'CRITS' | 'QUICK' | 'IDENTITY' | 'VICTORIES';
export type ChestType = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface AchievementDef {
  id: string;
  label: string;
  description: string;
  type: AchievementType;
  threshold: number;
  characterKey?: string;
  reward: ChestType;
}

export const MDFB_ACHIEVEMENTS: AchievementDef[] = [
  // ── Winstreak
  { id:'streak3',  label:'Inarrêtable', description:'3 victoires d\'affilée',  type:'WINSTREAK', threshold:3,  reward:'BRONZE' },
  { id:'streak5',  label:'En feu !',    description:'5 victoires d\'affilée',  type:'WINSTREAK', threshold:5,  reward:'SILVER' },
  { id:'streak10', label:'Légende',     description:'10 victoires d\'affilée', type:'WINSTREAK', threshold:10, reward:'GOLD'   },

  // ── Combats joués (total, victoires ou défaites)
  { id:'matches10',  label:'Combattant',      description:'10 combats joués',  type:'MATCHES', threshold:10,  reward:'BRONZE' },
  { id:'matches50',  label:'Vétéran',         description:'50 combats joués',  type:'MATCHES', threshold:50,  reward:'SILVER' },
  { id:'matches200', label:'Guerrier éternel',description:'200 combats joués', type:'MATCHES', threshold:200, reward:'GOLD'   },

  // ── Coups critiques
  { id:'crits20',  label:'Coup de chance',  description:'20 coups critiques cumulés',  type:'CRITS', threshold:20,  reward:'SILVER' },
  { id:'crits100', label:'Critique en série',description:'100 coups critiques cumulés', type:'CRITS', threshold:100, reward:'GOLD'   },

  // ── Victoires rapides
  { id:'quickwin',  label:'Éclair',     description:'Gagner en moins de 5 tours',             type:'QUICK', threshold:1, reward:'SILVER' },
  { id:'quickwin5', label:'Fulgurant',  description:'5 victoires en moins de 5 tours',         type:'QUICK', threshold:5, reward:'GOLD'   },

  // ── Identités personnages
  { id:'timmy_frites',      label:'Pluie de frites', description:'Lancer 5 frites dans un même combat (Timmy)',           type:'IDENTITY', threshold:5,  characterKey:'TIMMY',     reward:'GOLD'   },
  { id:'hugo_rich',         label:'Magnat',           description:'Accumuler 500 pièces d\'or (Hugo)',                     type:'IDENTITY', threshold:1,  characterKey:'HUGO',      reward:'SILVER' },
  { id:'robin_dodge',       label:'Insaisissable',    description:'Esquiver 3 attaques dans un même combat (Robin)',       type:'IDENTITY', threshold:1,  characterKey:'ROBIN',     reward:'SILVER' },
  { id:'pierre_tank',       label:'Mur de pierre',    description:'Survivre avec plus de 80% PV après 10 tours (Pierre)', type:'IDENTITY', threshold:1,  characterKey:'PIERRE',    reward:'SILVER' },
  { id:'pierrelbz_tenacite',label:'Indestructible',   description:'Survivre grâce à la Ténacité 5 fois (PierreLBZ)',      type:'IDENTITY', threshold:5,  characterKey:'PIERRELBZ', reward:'GOLD'   },
  { id:'romain_execute',    label:'Bourreau',          description:'Tuer 10 ennemis sous 25% PV (Romain)',                 type:'IDENTITY', threshold:10, characterKey:'ROMAIN',    reward:'GOLD'   },
  { id:'maiko_resist',      label:'Esprit d\'acier',  description:'Résister à 3 effets de contrôle dans un combat (Maiko)',type:'IDENTITY',threshold:1,  characterKey:'MAIKO',     reward:'SILVER' },
  { id:'antoine_parry',     label:'Anti-virus',        description:'Parer 10 projectiles (Antoine)',                       type:'IDENTITY', threshold:10, characterKey:'ANTOINE',   reward:'SILVER' },

  // ── Jalons de victoires (total carrière) — espacés volontairement pour garder les légendaires rares
  { id:'wins_5',   label:'Première série',     description:'5 victoires au total',   type:'VICTORIES', threshold:5,   reward:'BRONZE'   },
  { id:'wins_10',  label:'En forme',            description:'10 victoires au total',  type:'VICTORIES', threshold:10,  reward:'BRONZE'   },
  { id:'wins_25',  label:'Combattant aguerri', description:'25 victoires au total',  type:'VICTORIES', threshold:25,  reward:'SILVER'   },
  { id:'wins_50',  label:'Demi-centenaire',    description:'50 victoires au total',  type:'VICTORIES', threshold:50,  reward:'SILVER'   },
  { id:'wins_75',  label:'Infatigable',        description:'75 victoires au total',  type:'VICTORIES', threshold:75,  reward:'SILVER'   },
  { id:'wins_100', label:'Centurion',          description:'100 victoires au total', type:'VICTORIES', threshold:100, reward:'GOLD'     },
  { id:'wins_150', label:'Inarrêtable',        description:'150 victoires au total', type:'VICTORIES', threshold:150, reward:'GOLD'     },
  { id:'wins_200', label:'Légende vivante',    description:'200 victoires au total', type:'VICTORIES', threshold:200, reward:'GOLD'     },
  { id:'wins_300', label:'Maître de l\'arène', description:'300 victoires au total', type:'VICTORIES', threshold:300, reward:'PLATINUM' },
  { id:'wins_500', label:'Invincible',         description:'500 victoires au total', type:'VICTORIES', threshold:500, reward:'PLATINUM' },
];

export function checkAchievements(params: {
  winStreak: number;
  totalMatches: number;
  victories: number;
  critsTotal: number;
  quickWins: number;
  characterKey: string;
  identityCounters: Record<string, number>;
  unlocked: string[];
}): string[] {
  const newlyUnlocked: string[] = [];
  for (const a of MDFB_ACHIEVEMENTS) {
    if (params.unlocked.includes(a.id)) continue;
    let val = 0;
    if      (a.type === 'WINSTREAK')  val = params.winStreak;
    else if (a.type === 'MATCHES')    val = params.totalMatches;
    else if (a.type === 'VICTORIES')  val = params.victories;
    else if (a.type === 'CRITS')      val = params.critsTotal;
    else if (a.type === 'QUICK')      val = params.quickWins;
    else if (a.type === 'IDENTITY') {
      if (a.characterKey && a.characterKey !== params.characterKey) continue;
      val = params.identityCounters[a.id] || 0;
    }
    if (val >= a.threshold) newlyUnlocked.push(a.id);
  }
  return newlyUnlocked;
}
