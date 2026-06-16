import { shiftDay, todayStr } from '../utils/date';

// Dados de demonstracao — usados SOMENTE quando o backend esta offline,
// para a tela renderizar completa. Espelham o formato da entidade Medication.
const t0 = todayStr();
const at = (d) => shiftDay(t0, d);

export const SAMPLE_MEDS = [
  {
    id: 'demo-1', petId: 'demo', name: 'Otomax Solucao Otologica',
    dosage: '4 gotas por orelha', frequency: 'Duas vezes por dia',
    administrationTimes: ['08:00', '12:00'], route: 'Topico (ouvido)',
    startDate: at(-2), endDate: at(4),
    observations: 'Aplicar apos limpar o ouvido com gaze. Retorno em 7 dias.', status: 'active',
  },
  {
    id: 'demo-2', petId: 'demo', name: 'Pamoato de pirantel',
    dosage: '1 comprimido (5mg/kg)', frequency: 'Uma vez por dia',
    administrationTimes: ['16:00'], route: 'Oral',
    startDate: at(0), endDate: at(2),
    observations: 'Vermifugo. Repetir dose em 15 dias.', status: 'active',
  },
  {
    id: 'demo-3', petId: 'demo', name: 'Dipirona 500mg',
    dosage: '1 comprimido', frequency: '2x ao dia',
    administrationTimes: ['08:00', '20:00'], route: 'Oral',
    startDate: at(-1), endDate: at(3),
    observations: 'Em caso de dor ou febre.', status: 'active',
  },
  {
    id: 'demo-4', petId: 'demo', name: 'Omeprazol 20mg',
    dosage: '1 capsula', frequency: '1x ao dia em jejum',
    administrationTimes: ['07:00'], route: 'Oral',
    startDate: at(-4), endDate: at(10),
    observations: 'Administrar 30 min antes da primeira refeicao.', status: 'active',
  },
  {
    id: 'demo-5', petId: 'demo', name: 'Apoquel 5.4mg',
    dosage: '1 comprimido', frequency: '2x ao dia',
    administrationTimes: ['09:00', '21:00'], route: 'Oral',
    startDate: at(-6), endDate: null,
    observations: 'Controle de prurido. Uso continuo.', status: 'active',
  },
];
