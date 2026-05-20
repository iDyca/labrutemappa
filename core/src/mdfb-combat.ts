import { CharacterDef } from './characters.js';

export interface Fighter {
  id: string;
  name: string;
  characterKey: string;
  level: number;
  HP: number;
  maxHP: number;
  STR: number;
  AGI: number;
  SPD: number;
  WIS: number;
  loadout: Record<string, { defId: string; rolled: Record<string, number>; effect?: string }>;
  isAI?: boolean;
}

export interface CombatEvent {
  turn: number;
  actorId: string;
  actorName: string;
  type: 'ATTACK' | 'MISS' | 'CRIT' | 'DODGE' | 'PASSIVE' | 'EFFECT' | 'DEATH';
  message: string;
  damage?: number;
  targetHP?: number;
  targetMaxHP?: number;
}

export interface CombatResult {
  winnerId: string;
  loserId: string;
  turns: number;
  events: CombatEvent[];
  xpGain: number;
  goldGain: number;
  isQuickWin: boolean;
  critsThisFight: number;
  identityCounters: Record<string, number>;
}

function roll(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getLoadoutBonus(fighter: Fighter, stat: string): number {
  let bonus = 0;
  for (const inst of Object.values(fighter.loadout)) {
    if (inst.rolled[stat]) bonus += inst.rolled[stat];
  }
  return bonus;
}

function hasEffect(fighter: Fighter, effect: string): boolean {
  return Object.values(fighter.loadout).some(i => i.effect === effect);
}

export function simulateCombat(attacker: Fighter, defender: Fighter): CombatResult {
  const events: CombatEvent[] = [];
  let turn = 0;
  let crits = 0;
  const identityCounters: Record<string, number> = {};
  let tenacityUsed = false;
  let attackerFirstCC = true;
  let defenderFirstCC = true;

  let aHP = attacker.HP;
  let dHP = defender.HP;

  const aSTR = attacker.STR + getLoadoutBonus(attacker, 'STR');
  const aAGI = attacker.AGI + getLoadoutBonus(attacker, 'AGI');
  const aSPD = attacker.SPD + getLoadoutBonus(attacker, 'SPD');
  const dSTR = defender.STR + getLoadoutBonus(defender, 'STR');
  const dAGI = defender.AGI + getLoadoutBonus(defender, 'AGI');
  const dSPD = defender.SPD + getLoadoutBonus(defender, 'SPD');
  const dWIS = defender.WIS + getLoadoutBonus(defender, 'WIS');

  while (aHP > 0 && dHP > 0 && turn < 50) {
    turn++;

    // Timmy frites
    if (attacker.characterKey === 'TIMMY' && Math.random() < 0.10) {
      const fd = roll(3, 8);
      dHP -= fd;
      identityCounters['timmy_frites'] = (identityCounters['timmy_frites'] || 0) + 1;
      events.push({ turn, actorId: attacker.id, actorName: attacker.name, type: 'PASSIVE', message: `🍟 Frite volante ! ${fd} dégâts bonus !`, damage: fd, targetHP: Math.max(0, dHP), targetMaxHP: defender.maxHP });
    }

    // Ombre (Voile d'Encre / Cape du Corbac)
    if (hasEffect(attacker, 'SHADOW8') && Math.random() < 0.08) {
      events.push({ turn, actorId: attacker.id, actorName: attacker.name, type: 'EFFECT', message: `🌊 Ombre profonde — ${defender.name} rate son attaque !` });
      continue;
    }
    if (hasEffect(attacker, 'SHADOW5') && Math.random() < 0.05) {
      events.push({ turn, actorId: attacker.id, actorName: attacker.name, type: 'EFFECT', message: `🦅 Ombre légère — ${defender.name} rate son attaque !` });
      continue;
    }

    // Robin esquive
    if (attacker.characterKey === 'ROBIN' && Math.random() < 0.04 + aAGI * 0.001) {
      events.push({ turn, actorId: attacker.id, actorName: attacker.name, type: 'DODGE', message: `⚡ ${attacker.name} esquive l'attaque !` });
      if (Math.random() < 0.10) {
        const cdmg = roll(aSTR, aSTR + 5);
        dHP -= cdmg;
        events.push({ turn, actorId: attacker.id, actorName: attacker.name, type: 'ATTACK', message: `⚡ Contre-attaque éclair ! ${cdmg} dégâts`, damage: cdmg, targetHP: Math.max(0, dHP), targetMaxHP: defender.maxHP });
      }
      continue;
    }

    // Calcul dégâts
    const hitChance = Math.min(0.98, Math.max(0.40, 0.80 + (aAGI - dAGI) * 0.015));
    if (Math.random() > hitChance) {
      events.push({ turn, actorId: attacker.id, actorName: attacker.name, type: 'MISS', message: `${attacker.name} rate son attaque sur ${defender.name}` });
    } else {
      let dmg = roll(aSTR + 1, aSTR + 6);
      let isCrit = false;
      const critChance = 0.05 + (aAGI * 0.002);
      if (Math.random() < critChance) {
        dmg = Math.floor(dmg * 1.5);
        isCrit = true;
        crits++;
        if (defender.characterKey === 'PIERRELBZ') {
          identityCounters['pierrelbz_tenacite'] = (identityCounters['pierrelbz_tenacite'] || 0);
        }
        if (attacker.characterKey === 'ROMAIN') {
          identityCounters['romain_execute'] = (identityCounters['romain_execute'] || 0);
        }
      }

      // Exécution Romain
      if (attacker.characterKey === 'ROMAIN' && dHP / defender.maxHP < 0.25) {
        dmg = Math.floor(dmg * 1.12);
        identityCounters['romain_execute'] = (identityCounters['romain_execute'] || 0) + 1;
      }

      // Hugo bonus items
      if (attacker.characterKey === 'HUGO') {
        const equippedCount = Object.values(attacker.loadout).filter(Boolean).length;
        dmg = Math.floor(dmg * (1 + equippedCount * 0.02));
      }

      // Mitigation WIS
      const mitigation = Math.floor(dWIS * 0.05);
      dmg = Math.max(1, dmg - mitigation);

      // Thorns
      if (hasEffect(defender, 'THORNS1')) {
        aHP = Math.max(0, aHP - 1);
      }

      dHP -= dmg;

      // Ténacité PierreLBZ
      if (defender.characterKey === 'PIERRELBZ' && dHP <= 0 && !tenacityUsed) {
        dHP = 1;
        tenacityUsed = true;
        identityCounters['pierrelbz_tenacite'] = (identityCounters['pierrelbz_tenacite'] || 0) + 1;
        events.push({ turn, actorId: defender.id, actorName: defender.name, type: 'PASSIVE', message: `💪 Ténacité ! ${defender.name} survit à 1 PV !` });
      }

      // Saignement
      if ((hasEffect(attacker, 'DOUBLEHIT_BLEED12') || hasEffect(attacker, 'DOUBLEHIT_BLEED15_CRIT5')) && Math.random() < 0.12) {
        const bleed = Math.floor(defender.maxHP * 0.02);
        dHP -= bleed;
        events.push({ turn, actorId: attacker.id, actorName: attacker.name, type: 'EFFECT', message: `🩸 Saignement ! ${bleed} dégâts`, damage: bleed });
      }

      events.push({
        turn, actorId: attacker.id, actorName: attacker.name,
        type: isCrit ? 'CRIT' : 'ATTACK',
        message: `${attacker.name} ${isCrit ? '⚡ CRITIQUE !' : 'attaque'} ${defender.name} — ${dmg} dégâts`,
        damage: dmg, targetHP: Math.max(0, dHP), targetMaxHP: defender.maxHP
      });
    }

    if (dHP <= 0) break;

    // Tour défenseur
    const dHitChance = Math.min(0.98, Math.max(0.40, 0.80 + (dAGI - aAGI) * 0.015));
    if (Math.random() <= dHitChance) {
      let ddmg = roll(dSTR + 1, dSTR + 6);
      const aMitigation = Math.floor((attacker.WIS + getLoadoutBonus(attacker, 'WIS')) * 0.05);
      ddmg = Math.max(1, ddmg - aMitigation);
      aHP -= ddmg;

      if (attacker.characterKey === 'PIERRELBZ' && aHP <= 0 && !tenacityUsed) {
        aHP = 1;
        tenacityUsed = true;
        identityCounters['pierrelbz_tenacite'] = (identityCounters['pierrelbz_tenacite'] || 0) + 1;
        events.push({ turn, actorId: attacker.id, actorName: attacker.name, type: 'PASSIVE', message: `💪 Ténacité ! ${attacker.name} survit à 1 PV !` });
      }

      events.push({
        turn, actorId: defender.id, actorName: defender.name,
        type: 'ATTACK',
        message: `${defender.name} attaque ${attacker.name} — ${ddmg} dégâts`,
        damage: ddmg, targetHP: Math.max(0, aHP), targetMaxHP: attacker.maxHP
      });
    }
  }

  const attackerWon = aHP > 0;
  const winner = attackerWon ? attacker : defender;
  const loser = attackerWon ? defender : attacker;
  const goldBonus = attacker.characterKey === 'HUGO' ? 1.10 : 1;

  return {
    winnerId: winner.id,
    loserId: loser.id,
    turns: turn,
    events,
    xpGain: attackerWon ? 20 : 8,
    goldGain: Math.floor((attackerWon ? 15 : 5) * goldBonus),
    isQuickWin: attackerWon && turn < 5,
    critsThisFight: crits,
    identityCounters,
  };
}
