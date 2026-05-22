import { getSpellDef } from './mdfb-spells.js';

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
  equippedSpells?: string[];
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
// AGILITE      → determines who attacks first
// INTELLIGENCE → dodge: base 5% + INTELLIGENCE * 0.3%  (capped 50%)
// CHANCE       → crit:  base 3% + CHANCE * 0.25%       (capped 40%)
// HP items     → added to effective maxHP at combat start

export function simulateCombat(a: Fighter, b: Fighter): CombatResult {
  const events: CombatEvent[] = [];
  let turn = 0;
  let crits = 0;
  const identityCounters: Record<string, number> = {};
  let tenacityUsed = false;

  // ─── Spell state ─────────────────────────────────────────────────────────────
  const spellTriggered: Record<string, Set<string>> = { [a.id]: new Set(), [b.id]: new Set() };
  const shieldHP: Record<string, number> = { [a.id]: 0, [b.id]: 0 };
  const skipNextAttack: Record<string, boolean> = { [a.id]: false, [b.id]: false };
  const damageMultiplier: Record<string, number> = { [a.id]: 1, [b.id]: 1 };
  const strikeMultiplier: Record<string, number> = { [a.id]: 1, [b.id]: 1 };
  const spellSurvive: Record<string, boolean> = { [a.id]: false, [b.id]: false };

  // Effective stats with loadout bonuses
  const aFORCE  = a.FORCE  + getLoadoutBonus(a, 'FORCE');
  const aAGI    = a.AGILITE + getLoadoutBonus(a, 'AGILITE');
  const aINT    = a.INTELLIGENCE + getLoadoutBonus(a, 'INTELLIGENCE');
  const aCHANCE = a.CHANCE + getLoadoutBonus(a, 'CHANCE');

  const bFORCE  = b.FORCE  + getLoadoutBonus(b, 'FORCE');
  const bAGI    = b.AGILITE + getLoadoutBonus(b, 'AGILITE');
  const bINT    = b.INTELLIGENCE + getLoadoutBonus(b, 'INTELLIGENCE');
  const bCHANCE = b.CHANCE + getLoadoutBonus(b, 'CHANCE');

  // HP items are additive to base HP — tracked via effectiveMaxHP for % calculations
  const effectiveMaxHP: Record<string, number> = {
    [a.id]: a.maxHP + getLoadoutBonus(a, 'HP'),
    [b.id]: b.maxHP + getLoadoutBonus(b, 'HP'),
  };

  // Who strikes first is determined by AGILITE (higher = attacker keeps initiative)
  let [attacker, defender]   = aAGI >= bAGI ? [a, b] : [b, a];
  let [atkF, atkAGI, atkINT, atkCHANCE] = aAGI >= bAGI
    ? [aFORCE, aAGI, aINT, aCHANCE]
    : [bFORCE, bAGI, bINT, bCHANCE];
  let [defF, defAGI, defINT, defCHANCE] = aAGI >= bAGI
    ? [bFORCE, bAGI, bINT, bCHANCE]
    : [aFORCE, aAGI, aINT, aCHANCE];

  // Start each fighter at their full effective HP (base + item HP bonuses)
  let aHP = aAGI >= bAGI
    ? effectiveMaxHP[a.id] ?? a.HP
    : effectiveMaxHP[b.id] ?? b.HP;
  let dHP = aAGI >= bAGI
    ? effectiveMaxHP[b.id] ?? b.HP
    : effectiveMaxHP[a.id] ?? a.HP;

  // FIRST_STRIKE boot effect: guaranteed initiative regardless of AGILITE
  if (hasEffect(a, 'FIRST_STRIKE') && !hasEffect(b, 'FIRST_STRIKE')) {
    [attacker, defender] = [a, b];
    [atkF, atkAGI, atkINT, atkCHANCE] = [aFORCE, aAGI, aINT, aCHANCE];
    [defF, defAGI, defINT, defCHANCE] = [bFORCE, bAGI, bINT, bCHANCE];
    aHP = effectiveMaxHP[a.id] ?? a.HP;
    dHP = effectiveMaxHP[b.id] ?? b.HP;
  }

  // ─── applySpells closure ─────────────────────────────────────────────────────
  function applySpells(
    actor: Fighter, target: Fighter,
    actorHP: number, targetHP: number,
  ): { actorHP: number; targetHP: number } {
    for (const spellId of (actor.equippedSpells ?? [])) {
      if (spellTriggered[actor.id]!.has(spellId)) continue;
      const spell = getSpellDef(spellId);
      if (!spell) continue;
      const maxHP = effectiveMaxHP[actor.id] ?? actor.maxHP;
      const triggerChance = Math.min(95, spell.baseTriggerChance + (1 - actorHP / maxHP) * 100);
      if (Math.random() * 100 >= triggerChance) continue;
      spellTriggered[actor.id]!.add(spellId);
      const { effect } = spell;
      const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const targetMaxHP = effectiveMaxHP[target.id] ?? target.maxHP;

      switch (effect.type) {
        case 'DAMAGE': {
          const dmg = r(effect.minVal!, effect.maxVal!);
          targetHP = Math.max(0, targetHP - dmg);
          events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
            message: `✨ ${spell.name} ! ${dmg} dégâts bonus sur ${target.name}`,
            damage: dmg, targetHP, targetMaxHP });
          break;
        }
        case 'HEAL': {
          const healed = Math.floor(r(effect.minVal!, effect.maxVal!) / 100 * maxHP);
          actorHP = Math.min(maxHP, actorHP + healed);
          events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
            message: `✨ ${spell.name} ! +${healed} PV récupérés`,
            targetHP: actorHP, targetMaxHP: maxHP });
          break;
        }
        case 'SHIELD': {
          const shield = r(effect.minVal!, effect.maxVal!);
          shieldHP[actor.id] = (shieldHP[actor.id] ?? 0) + shield;
          events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
            message: `✨ ${spell.name} ! Bouclier de ${shield} PV activé` });
          break;
        }
        case 'LIFESTEAL': {
          const dmg = r(effect.minVal!, effect.maxVal!);
          const healed = Math.floor(dmg * (effect.healRatio ?? 0.5));
          targetHP = Math.max(0, targetHP - dmg);
          actorHP = Math.min(maxHP, actorHP + healed);
          events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
            message: `✨ ${spell.name} ! ${dmg} dégâts + ${healed} PV volés`,
            damage: dmg, targetHP, targetMaxHP });
          break;
        }
        case 'SKIP_ATTACK': {
          skipNextAttack[target.id] = true;
          events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
            message: `✨ ${spell.name} ! ${target.name} rate sa prochaine attaque` });
          break;
        }
        case 'DEBUFF_DAMAGE': {
          damageMultiplier[target.id] = (damageMultiplier[target.id] ?? 1) * (1 - (effect.debuffRatio ?? 0.15));
          if (effect.minVal && effect.maxVal) {
            const dmg = r(effect.minVal, effect.maxVal);
            targetHP = Math.max(0, targetHP - dmg);
            events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
              message: `✨ ${spell.name} ! ${dmg} dégâts + ${target.name} affaibli (-${Math.round((effect.debuffRatio ?? 0.15) * 100)}% dégâts)`,
              damage: dmg, targetHP, targetMaxHP });
          } else {
            events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
              message: `✨ ${spell.name} ! ${target.name} affaibli (-${Math.round((effect.debuffRatio ?? 0.20) * 100)}% dégâts)` });
          }
          break;
        }
        case 'MULTI_HIT': {
          const hits = effect.hits ?? 2;
          let totalDmg = 0;
          for (let i = 0; i < hits; i++) {
            const d = r(effect.minVal!, effect.maxVal!);
            totalDmg += d;
            targetHP = Math.max(0, targetHP - d);
            if (targetHP <= 0) break;
          }
          events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
            message: `✨ ${spell.name} ! ${hits} frappes pour ${totalDmg} dégâts totaux`,
            damage: totalDmg, targetHP, targetMaxHP });
          break;
        }
        case 'SURVIVE': {
          spellSurvive[actor.id] = true;
          events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
            message: `✨ ${spell.name} ! Barrière de vie activée sur ${actor.name}` });
          break;
        }
        case 'DOUBLE_STRIKE': {
          strikeMultiplier[actor.id] = effect.minVal ?? 2.5;
          events.push({ turn, actorId: actor.id, actorName: actor.name, type: 'PASSIVE',
            message: `✨ ${spell.name} ! Prochain coup ×${effect.minVal ?? 2.5}` });
          break;
        }
      }
    }
    return { actorHP, targetHP };
  }

  function strikeOnce(
    actor: Fighter, target: Fighter,
    actorF: number, actorINT: number, actorCHANCE: number,
    targetINT: number,
    actorHP: number, targetHP: number,
  ): { actorHP: number; targetHP: number; killed: boolean } {
    const targetMaxHP = effectiveMaxHP[target.id] ?? target.maxHP;
    const actorMaxHP  = effectiveMaxHP[actor.id]  ?? actor.maxHP;

    // Dodge (INTELLIGENCE based)
    const dodgeChance = Math.min(0.50, 0.05 + targetINT * 0.003);
    if (Math.random() < dodgeChance) {
      events.push({ turn, actorId: target.id, actorName: target.name, type: 'DODGE',
        message: `${target.name} esquive l'attaque de ${actor.name} !` });
      // Robin counter-attack on dodge
      if (target.characterKey === 'ROBIN' && Math.random() < 0.10) {
        const cdmg = roll(1, Math.max(1, Math.floor(targetINT * 0.5)));
        actorHP = Math.max(0, actorHP - cdmg);
        identityCounters['robin_counter'] = (identityCounters['robin_counter'] || 0) + 1;
        events.push({ turn, actorId: target.id, actorName: target.name, type: 'ATTACK',
          message: `⚡ Contre-attaque éclair ! ${cdmg} dégâts`, damage: cdmg,
          targetHP: Math.max(0, actorHP), targetMaxHP: actorMaxHP });
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

    // Exécution Romain — bonus si cible < 25% PV effectifs
    if (actor.characterKey === 'ROMAIN' && targetHP / targetMaxHP < 0.25) {
      dmg = Math.floor(dmg * 1.12);
      identityCounters['romain_execute'] = (identityCounters['romain_execute'] || 0) + 1;
    }

    // Hugo +2% dmg per equipped item
    if (actor.characterKey === 'HUGO') {
      const count = Object.values(actor.loadout).filter(Boolean).length;
      dmg = Math.floor(dmg * (1 + count * 0.02));
    }

    // Apply outgoing damage multiplier (from DEBUFF_DAMAGE spells on actor)
    dmg = Math.floor(dmg * (damageMultiplier[actor.id] ?? 1));

    // Apply DOUBLE_STRIKE multiplier (Transcendance)
    dmg = Math.floor(dmg * (strikeMultiplier[actor.id] ?? 1));
    strikeMultiplier[actor.id] = 1;

    // DMG_REDUCE3 (belt effect) — applied to target
    if (hasEffect(target, 'DMG_REDUCE3')) {
      dmg = Math.max(1, Math.floor(dmg * 0.97));
    }

    // Thorns
    if (hasEffect(target, 'THORNS1')) {
      actorHP = Math.max(0, actorHP - 1);
    }

    // SHIELD absorption — applied before reducing targetHP
    const absorbed = Math.min(shieldHP[target.id] ?? 0, dmg);
    shieldHP[target.id] = (shieldHP[target.id] ?? 0) - absorbed;
    dmg = Math.max(0, dmg - absorbed);

    targetHP = Math.max(0, targetHP - dmg);

    // Ténacité PierreLBZ
    if (target.characterKey === 'PIERRELBZ' && targetHP <= 0 && !tenacityUsed) {
      targetHP = 1;
      tenacityUsed = true;
      identityCounters['pierrelbz_tenacite'] = (identityCounters['pierrelbz_tenacite'] || 0) + 1;
      events.push({ turn, actorId: target.id, actorName: target.name, type: 'PASSIVE',
        message: `💪 Ténacité ! ${target.name} survit à 1 PV !` });
    }

    // Spell SURVIVE — survives a fatal blow at 1 HP (not for PIERRELBZ who has tenacity)
    if (target.characterKey !== 'PIERRELBZ' && targetHP <= 0 && spellSurvive[target.id]) {
      targetHP = 1;
      spellSurvive[target.id] = false;
      events.push({ turn, actorId: target.id, actorName: target.name, type: 'PASSIVE',
        message: `✨ Mot de Prévention ! ${target.name} survit à 1 PV grâce à la barrière !` });
    }

    events.push({
      turn, actorId: actor.id, actorName: actor.name,
      type: isCrit ? 'CRIT' : 'ATTACK',
      message: `${actor.name} ${isCrit ? '⚡ CRITIQUE !' : 'attaque'} ${target.name} — ${dmg} dégâts`,
      damage: dmg, targetHP, targetMaxHP,
    });

    // BERSERK belt — check after each hit
    if (hasEffect(actor, 'BERSERK') && actorHP / actorMaxHP < 0.30) {
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
        targetHP: dHP, targetMaxHP: effectiveMaxHP[defender.id] ?? defender.maxHP });
      if (dHP <= 0) break;
    }

    // Appliquer sorts de l'attaquant avant son coup
    const sa = applySpells(attacker, defender, aHP, dHP);
    aHP = sa.actorHP; dHP = sa.targetHP;
    if (dHP <= 0) break;

    // Check SKIP_ATTACK for defender (set by attacker's Décélération spell)
    const defenderSkips = skipNextAttack[defender.id] ?? false;
    if (defenderSkips) skipNextAttack[defender.id] = false;

    // Attacker strikes
    const berserkBonus = (hasEffect(attacker, 'BERSERK') && identityCounters['berserk_active'])
      ? 5 : 0;
    const res = strikeOnce(attacker, defender,
      atkF + berserkBonus, atkINT, atkCHANCE, defINT,
      aHP, dHP);
    aHP = res.actorHP; dHP = res.targetHP;
    if (res.killed || dHP <= 0) break;

    // Appliquer sorts du défenseur avant sa contre-attaque
    const sd = applySpells(defender, attacker, dHP, aHP);
    dHP = sd.actorHP; aHP = sd.targetHP;
    if (aHP <= 0) break;

    // Defender strikes back (unless skipping due to SKIP_ATTACK)
    if (!defenderSkips) {
      const defBerserk = (hasEffect(defender, 'BERSERK') && identityCounters['berserk_active']) ? 5 : 0;
      const res2 = strikeOnce(defender, attacker,
        defF + defBerserk, defINT, defCHANCE, atkINT,
        dHP, aHP);
      dHP = res2.actorHP; aHP = res2.targetHP;
      if (res2.killed || aHP <= 0) break;
    }
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
