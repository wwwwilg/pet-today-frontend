import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DOSE, T } from '../theme/tokens';
import { fmtDateShort } from '../utils/date';

// Card de medicamento: barra de status semantica, badge, horario, frequencia,
// tempo de tratamento (Dia X/Y), acao "marcar como feito" e detalhes expansiveis.
export default function MedCard({ med, view, expanded, onToggleExpand, onDone, onUndo, onEdit, onStatus, onRemove }) {
  const done = view.state === 'feito';
  const inactive = Boolean(med.status && med.status !== 'active');
  const statusLabel = med.status === 'paused' ? 'Pausado' : med.status === 'finished' ? 'Concluido' : null;
  const meta = inactive
    ? { badge: statusLabel, bg: T.parchment, tx: T.deepTeal, bar: T.border }
    : DOSE[view.state];
  const fillPct = Math.round((view.progress != null ? view.progress : 0.15) * 100);

  return (
    <View style={s.card}>
      <View style={[s.bar, { backgroundColor: meta.bar }]} />
      <View style={s.body}>
        <View style={s.head}>
          <View style={s.icon}><Ionicons name="medical-outline" size={18} color={T.turf} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{med.name}</Text>
            <View style={s.pills}>
              <View style={s.dosagePill}><Text style={s.dosageTx}>{med.dosage}</Text></View>
            </View>
          </View>
          <View style={[s.badge, { backgroundColor: meta.bg }]}>
            <Text style={[s.badgeTx, { color: meta.tx }]}>{meta.badge}</Text>
          </View>
        </View>

        <View style={s.info}>
          {view.repTime ? (
            <View style={s.infoItem}>
              <Ionicons name="time-outline" size={15} color={T.deepTeal} />
              <Text style={s.infoTime}>{view.repTime}</Text>
            </View>
          ) : null}
          <Text style={s.infoFreq}>{med.frequency}</Text>
          {view.total > 1 && <Text style={s.infoDoses}>{view.doneCount}/{view.total} doses</Text>}
        </View>

        {view.dayNum != null && (
          <View style={s.treat}>
            <View style={s.treatTop}>
              <Text style={s.treatLabel}>Tempo de tratamento</Text>
              <Text style={s.treatDay}>{view.totalDays ? `Dia ${view.dayNum}/${view.totalDays}` : `Dia ${view.dayNum}`}</Text>
            </View>
            <View style={s.track}><View style={[s.fill, { width: `${fillPct}%` }]} /></View>
          </View>
        )}

        <View style={s.actions}>
          <TouchableOpacity
            style={[s.doneBtn, done && s.doneBtnDone, inactive && s.doneBtnDisabled]}
            activeOpacity={0.85}
            onPress={inactive ? undefined : done ? onUndo : onDone}
            disabled={inactive}
          >
            <Ionicons name={done ? 'checkmark-circle' : 'checkmark'} size={18} color={done ? T.turf : '#fff'} />
            <Text style={[s.doneTx, done && s.doneTxDone, inactive && s.doneTxDisabled]}>
              {inactive ? 'Tratamento inativo' : done ? 'Concluido hoje' : 'Marcar como feito'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.skip} onPress={onUndo} activeOpacity={0.7}>
            <Ionicons name="close" size={18} color={T.alertTx} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.notesToggle} onPress={onToggleExpand} activeOpacity={0.7}>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={T.turf} />
          <Text style={s.notesToggleTx}>{expanded ? 'Ocultar detalhes' : 'Ver notas do veterinario'}</Text>
        </TouchableOpacity>

        {expanded && (
          <View style={s.notes}>
            {med.observations ? <Text style={s.notesTx}>{med.observations}</Text> : <Text style={s.notesEmpty}>Sem observacoes.</Text>}
            <View style={s.notesMeta}>
              {med.route ? <Text style={s.notesMetaTx}>Via: {med.route}</Text> : null}
              <Text style={s.notesMetaTx}>
                {med.endDate ? `${fmtDateShort(med.startDate)} -> ${fmtDateShort(med.endDate)}` : `desde ${fmtDateShort(med.startDate)}`}
              </Text>
            </View>
            <View style={s.manage}>
              <TouchableOpacity style={s.mBtn} onPress={onEdit}><Text style={s.mBtnTx}>Editar</Text></TouchableOpacity>
              {inactive ? (
                <TouchableOpacity style={s.mBtn} onPress={() => onStatus('active')}><Text style={s.mBtnTx}>Reativar</Text></TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={s.mBtn} onPress={() => onStatus('paused')}><Text style={s.mBtnTx}>Pausar</Text></TouchableOpacity>
                  <TouchableOpacity style={s.mBtn} onPress={() => onStatus('finished')}><Text style={s.mBtnTx}>Concluir</Text></TouchableOpacity>
                </>
              )}
              <TouchableOpacity style={[s.mBtn, s.mBtnDanger]} onPress={onRemove}><Text style={s.mBtnDangerTx}>Remover</Text></TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: T.white, borderRadius: 12, borderWidth: 1, borderColor: T.border, overflow: 'hidden', marginBottom: 12 },
  bar: { height: 3, width: '100%' },
  body: { padding: 16 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  icon: { width: 34, height: 34, borderRadius: 10, backgroundColor: T.mint, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.borderGreen },
  name: { fontSize: 15, fontWeight: '500', color: T.evergreen },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  dosagePill: { alignSelf: 'flex-start', backgroundColor: T.parchment, borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2 },
  dosageTx: { fontSize: 12, color: T.deepTeal },
  badge: { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 },
  badgeTx: { fontSize: 11, fontWeight: '500' },

  info: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoTime: { fontSize: 13, color: T.evergreen, fontWeight: '500' },
  infoFreq: { fontSize: 13, color: T.deepTeal },
  infoDoses: { fontSize: 12, color: T.turf, backgroundColor: T.mint, borderRadius: 100, paddingHorizontal: 8, paddingVertical: 1, borderWidth: 1, borderColor: T.borderGreen },

  treat: { marginTop: 14 },
  treatTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  treatLabel: { fontSize: 12, color: T.deepTeal },
  treatDay: { fontSize: 12, color: T.turf, fontWeight: '500' },
  track: { height: 6, borderRadius: 100, backgroundColor: T.parchment, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 100, backgroundColor: T.turf },

  actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  doneBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: T.turf, borderRadius: 10, height: 44 },
  doneBtnDone: { backgroundColor: T.mint, borderWidth: 1, borderColor: T.borderGreen },
  doneBtnDisabled: { backgroundColor: T.parchment, borderWidth: 1, borderColor: T.border },
  doneTx: { color: '#fff', fontSize: 14, fontWeight: '500' },
  doneTxDone: { color: T.turf },
  doneTxDisabled: { color: T.deepTeal },
  skip: { width: 44, height: 44, borderRadius: 10, backgroundColor: T.alertBg, borderWidth: 1, borderColor: '#fca5a5', alignItems: 'center', justifyContent: 'center' },

  notesToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12, alignSelf: 'flex-start' },
  notesToggleTx: { color: T.turf, fontSize: 13, fontWeight: '500' },
  notes: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: T.border },
  notesTx: { fontSize: 13, color: T.evergreen, lineHeight: 19 },
  notesEmpty: { fontSize: 13, color: T.deepTeal, fontStyle: 'italic' },
  notesMeta: { marginTop: 8, gap: 2 },
  notesMetaTx: { fontSize: 12, color: T.deepTeal },
  manage: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  mBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, backgroundColor: T.parchment, borderWidth: 1, borderColor: T.border },
  mBtnTx: { fontSize: 13, color: T.evergreen },
  mBtnDanger: { backgroundColor: T.alertBg, borderColor: '#fca5a5' },
  mBtnDangerTx: { fontSize: 13, color: T.alertTx },
});
