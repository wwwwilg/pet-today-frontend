import { daysBetween, minutesOf, todayStr } from './date';

// Chave unica de uma dose (medicamento + horario + dia).
export const doseKey = (medId, time, day = todayStr()) => `${medId}|${time}|${day}`;

// Classifica um horario relativo ao "agora" (em minutos do dia).
export function doseStateOf(hhmm, nowMin) {
  const diff = minutesOf(hhmm) - nowMin; // >0 futuro, <0 passado
  if (diff > 30) return 'faltam';
  if (diff >= -90) return 'agora';
  return 'esquecido';
}

// Constroi a "visao de hoje" de um medicamento:
// estado representativo, horario em foco, progresso de doses e tempo de tratamento.
export function viewOf(med, doneSet, nowMin) {
  const today = todayStr();
  const times = (med.administrationTimes || []).slice().sort();
  const doneTimes = times.filter((t) => doneSet.has(doseKey(med.id, t, today)));
  const pending = times.filter((t) => !doneTimes.includes(t));

  let state, repTime;
  if (times.length === 0) {
    state = 'agora';
    repTime = null;
  } else if (pending.length === 0) {
    state = 'feito';
    repTime = doneTimes[doneTimes.length - 1] || null;
  } else {
    const byState = { agora: [], esquecido: [], faltam: [] };
    pending.forEach((t) => byState[doseStateOf(t, nowMin)].push(t));
    if (byState.agora.length) { state = 'agora'; repTime = byState.agora[0]; }
    else if (byState.esquecido.length) { state = 'esquecido'; repTime = byState.esquecido.sort()[0]; }
    else { state = 'faltam'; repTime = byState.faltam[0]; }
  }

  let dayNum = null, totalDays = null, progress = null;
  if (med.startDate) {
    dayNum = Math.max(1, daysBetween(med.startDate, today) + 1);
    if (med.endDate) {
      totalDays = Math.max(1, daysBetween(med.startDate, med.endDate) + 1);
      progress = Math.min(1, dayNum / totalDays);
    }
  }

  return { state, repTime, times, doneCount: doneTimes.length, total: times.length, dayNum, totalDays, progress };
}
