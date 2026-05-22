export interface Fighter {
  id: string;
  name: string;
  characterKey: string;
  level: number;
  HP: number;
  maxHP: number;
  FORCE: number;
  AGILITE: number;
  INTELLIGENCE: number;
  CHANCE: number;
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

// ─── Stat formulas ────────────────────────────────────────────────────────────
// FORCE        → damage: roll(FORCE, FORCE + FORCE/3)
// AGILITE      → determines who attacks first; each point = +0.5% dodge (shared with INTELLIGENCE)
// INTELLIGENCE → dodge: base 5% + INTELLIGENCE * 0.3%  (capped 50%)
// CHANCE       → crit:  base 3% + CHANCE * 0.25%       (capped 40%)

export function simulateCombat(a: Fighter, b: Fighter): CombatResult {
  const events: CombatEvent[] = [];
  let turn = 0;
  let crits = 0;
  const identityCounters: Record<string, number> = {};
  let tenacityUsed = false;

  // Effective stats with loadout bonuses
  const aFORCE  = a.FORCE  + getLoadoutBonus(a, 'FORCE');
  const aAGI    = a.AGILITE + getLoadoutBonus(a, 'AGILITE');
  const aINT    = a.INTELLIGENCE + getLoadoutBonus(a, 'INTELLIGENCE');
  const aCHANCE = a.CHANCE + getLoadoutBonus(a, 'CHANCE');

  const bFORCE  = b.FORCE  + getLoadoutBonus(b, 'FORCE');
  const bAGI    = b.AGILITE + getLoadoutBonus(b, 'AGILITE');
  const bINT    = b.INTELLIGENCE + getLoadoutBonus(b, 'INTELLIGENCE');
  const bCHANCE = b.CHANCE + getLoadoutBonus(b, 'CHANCE');

  // Who strikes first is determined by AGILITE (higher = attacker keeps initiative)
  let [attacker, defender]   = aAGI >= bAGI ? [a, b] : [b, a];
  let [atkF, atkAGI, atkINT, atkCHANCE] = aAGI >= bAGI
    ? [aFORCE, aAGI, aINT, aCHANCE]
    : [bFORCE, bAGI, bINT, bCHANCE];
  let [defF, defAGI, defINT, defCHANCE] = aAGI >= bAGI
    ? [bFORCE, bAGI, bINT, bCHANCE]
    : [aFORCE, aAGI, aINT, aCHANCE];

  let aHP = attacker.HP;
  let dHP = defender.HP;

  // FIRST_STRIKE boot effect: guaranteed initiative regardless of AGILITE
  if (hasEffect(a, 'FIRST_STRIKE') && !hasEffect(b, 'FIRST_STRIKE')) {
    [attacker, defender] = [a, b];
    [atkF, atkAGI, atkINT, atkCHANCE] = [aFORCE, aAGI, aINT, aCHANCE];
    [defF, defAGI, defINT, defCHANCE] = [bFORCE, bAGI, bINT, bCHANCE];
    aHP = a.HP; dHP = b.HP;
  }

  function strikeOnce(
    actor: Fighter, target: Fighter,
    actorF: number, actorINT: number, actorCHANCE: number,
    targetINT: number,
    actorHP: number, targetHP: number,
  ): { actorHP: number; targetHP: number; killed: boolean } {
    // Dodge (INTELLIGENCE based)
    const dodgeChance = Math.min(0.50, 0.05 + targetINT * 0.003);
    if (Math.random() < dodgeChance) {
      events.push({ turn, actorId: target.id, actorName: target.name, type: 'DODGE',
        message: `${target.name} esquive l'attaque de ${actor.name} !` });
      // Robin counter-attack on dodge
      if (target.characterKey === 'ROBIN' && Math.random() < 0.10) {
        const cdmg = roll(1, Math.max(1, Math.floor(targetINT * 0.5)));
        targetHP; // no change, this is target attacking back
        actorHP = Math.max(0, actorHP - cdmg);
        identityCounters['robin_counter'] = (identityCounters['robin_counter'] || 0) + 1;
        events.push({ turn, actorId: target.id, actorName: target.name, type: 'ATTACK',
          message: `⚡ Contre-attaque éclair ! ${cdmg} dégâts`, damage: cdmg,
          targetHP: Math.max(0, actorHP), targetMaxHP: actor.maxHP });
      }
      return { actorHP, targetHP, killed: false };
    }

    // Shadow effects (cape)
    if (hasEffect(actor, 'SHADOW8') && Math.random() < 0.08) {
      events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'EFFECT',
        message: `🌊 Voile d'Encre — ${target.name} rate son attaque !` });
      return { actorHP, targetHP, killed: false };
    }
    if (hasEffect(actor, 'SHADOW5') && Math.random() < 0.05) {
      events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'EFFECT',
        message: `🦅 Cape du Corbac — ${target.name} rate son attaque !` });
      return { actorHP, targetHP, killed: false };
    }

    // Damage: FORCE determines base roll
    const dmgMin = actorF;
    const dmgMax = actorF + Math.max(1, Math.floor(actorF / 3));
    let dmg = roll(dmgMin, dmgMax);

    // Crit (CHANCE based)
    const critChance = Math.min(0.40, 0.03 + actorCHANCE * 0.0025);
    let isCrit = false;
    if (Math.random() < critChance) {
      dmg = Math.floor(dmg * 1.5);
      isCrit = true;
      crits++;
    }

    // Exécution Romain
    if (actor.characterKey === 'ROMAIN' && targetHP / target.maxHP < 0.25) {
      dmg = Math.floor(dmg * 1.12);
      identityCounters['romain_execute'] = (identityCounters['romain_execute'] || 0) + 1;
    }

    // Hugo +2% dmg per equipped item
    if (actor.characterKey === 'HUGO') {
      const count = Object.values(actor.loadout).filter(Boolean).length;
      dmg = Math.floor(dmg * (1 + count * 0.02));
    }

    // DMG_REDUCE3 (belt effect) — applied to target
    if (hasEffect(target, 'DMG_REDUCE3')) {
      dmg = Math.max(1, Math.floor(dmg * 0.97));
    }

    // Thorns
    if (hasEffect(target, 'THORNS1')) {
      actorHP = Math.max(0, actorHP - 1);
    }

    targetHP = Math.max(0, targetHP - dmg);

    // Ténacité PierreLBZ
    if (target.characterKey === 'PIERRELBZ' && targetHP <= 0 && !tenacityUsed) {
      targetHP = 1;
      tenacityUsed = true;
      identityCounters['pierrelbz_tenacite'] = (identityCounters['pierrelbz_tenacite'] || 0) + 1;
      events.push({ turn, actorId: target.id, actorName: target.name, type: 'PASSIVE',
        message: `💪 Ténacité ! ${target.name} survit à 1 PV !` });
    }

    events.push({
      turn, actorId: actor.id, actorName: actor.name,
      type: isCrit ? 'CRIT' : 'ATTACK',
      message: `${actor.name} ${isCrit ? '⚡ CRITIQUE !' : 'attaque'} ${target.name} — ${dmg} dégâts`,
      damage: dmg, targetHP, targetMaxHP: target.maxHP,
    });

    // BERSERK belt — check after each hit
    if (hasEffect(actor, 'BERSERK') && actorHP / actor.maxHP < 0.30) {
      identityCounters['berserk_active'] = 1;
    }

    return { actorHP, targetHP, killed: targetHP <= 0 };
  }

  while (aHP > 0 && dHP > 0 && turn < 50) {
    turn++;

    // Timmy frites
    if (attacker.characterKey === 'TIMMY' && Math.random() < 0.10) {
      const fd = roll(3, 8);
      dHP = Math.max(0, dHP - fd);
      identityCounters['timmy_frites'] = (identityCounters['timmy_frites'] || 0) + 1;
      events.push({ turn, actorId: attacker.id, actorName: attacker.name, type: 'PASSIVE',
        message: `🍟 Frite volante ! ${fd} dégâts bonus !`, damage: fd,
        targetHP: dHP, targetMaxHP: defender.maxHP });
      if (dHP <= 0) break;
    }

    // Attacker strikes
    const berserkBonus = (hasEffect(attacker, 'BERSERK') && identityCounters['berserk_active'])
      ? 5 : 0;
    const res = strikeOnce(attacker, defender,
      atkF + berserkBonus, atkINT, atkCHANCE, defINT,
      aHP, dHP);
    aHP = res.actorHP; dHP = res.targetHP;
    if (res.killed || dHP <= 0) break;

    // Defender strikes back
    const defBerserk = (hasEffect(defender, 'BERSERK') && identityCounters['berserk_active']) ? 5 : 0;
    const res2 = strikeOnce(defender, attacker,
      defF + defBerserk, defINT, defCHANCE, atkINT,
      dHP, aHP);
    dHP = res2.actorHP; aHP = res2.targetHP;
    if (res2.killed || aHP <= 0) break;
  }

  const attackerWon = aHP > 0;
  const winner = attackerWon ? attacker : defender;
  const loser  = attackerWon ? defender : attacker;
  const goldBonus = attacker.characterKey === 'HUGO' || defender.characterKey === 'HUGO'
    ? (winner.characterKey === 'HUGO' ? 1.10 : 1) : 1;

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
