// Design tokens do Pet Today.
// Paleta organica e de baixo contraste; cores vivas SOMENTE para estados semanticos.

export const T = {
  white: '#FFFFFF',
  porcelain: '#F7F6F2',
  parchment: '#F0EFE9',
  mint: '#EAF5EF',
  deepTeal: '#6B7E73',
  turf: '#1B6E4F',
  evergreen: '#1C2B22',
  border: '#d4d0c8',
  borderGreen: '#b2cfbd',

  okBg: '#DCFCE7', okTx: '#166534',
  warn: '#D97706', warnBg: '#FEF3C7', warnTx: '#92400E',
  alert: '#DC2626', alertBg: '#FEE2E2', alertTx: '#991B1B',
  info: '#2563EB', infoBg: '#DBEAFE', infoTx: '#1E40AF',
};

// Estados de dose derivados no cliente (nao existem no backend).
export const DOSE = {
  feito:     { label: 'Feito',     badge: 'Concluida',  bg: T.okBg,    tx: T.okTx,    bar: T.turf },
  agora:     { label: 'Agora',     badge: 'Para agora', bg: T.warnBg,  tx: T.warnTx,  bar: T.warn },
  faltam:    { label: 'Faltando',  badge: 'Em breve',   bg: T.infoBg,  tx: T.infoTx,  bar: T.info },
  esquecido: { label: 'Esquecido', badge: 'Atrasada',   bg: T.alertBg, tx: T.alertTx, bar: T.alert },
};

// Tons claros usados sobre o header verde (contraste sobre turf).
export const ON_GREEN = {
  feito: '#FFFFFF',
  agora: '#FCD34D',
  faltam: '#93C5FD',
  esquecido: '#FCA5A5',
};
