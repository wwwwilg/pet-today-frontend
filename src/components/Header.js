import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { T, ON_GREEN } from '../theme/tokens';

function Stat({ n, label, color }) {
  return (
    <View style={s.stat}>
      <Text style={[s.statN, { color }]}>{n}</Text>
      <Text style={s.statL}>{label}</Text>
    </View>
  );
}

// Header verde: pet, data, titulo e card de progresso (destaque unico da tela).
export default function Header({ dateLabel, counts, pct, online, onOpenSettings }) {
  return (
    <View style={s.header}>
      <View style={s.headerTop}>
        <TouchableOpacity style={s.iconBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={s.petChip}>
          <Text style={s.petName}>Max</Text>
          <Text style={s.petBreed}>Golden Retriever, 4 anos</Text>
        </View>
        <TouchableOpacity style={s.iconBtn} onPress={onOpenSettings}>
          <Ionicons name="notifications-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={s.dateLabel}>{dateLabel}</Text>
      <Text style={s.title}>Medicacao &amp;{'\n'}tratamentos</Text>

      <View style={s.progressCard}>
        <View style={s.pctBlock}>
          <Text style={s.pctValue}>{pct}%</Text>
          <Text style={s.pctLabel}>feito</Text>
        </View>
        <View style={s.statsRow}>
          <Stat n={counts.feito} label="feito" color={ON_GREEN.feito} />
          <Stat n={counts.agora} label="agora" color={ON_GREEN.agora} />
          <Stat n={counts.faltam} label="faltam" color={ON_GREEN.faltam} />
          <Stat n={counts.esquecido} label="esquecido" color={ON_GREEN.esquecido} />
        </View>
      </View>

      <Text style={s.progressSub}>
        {counts.feito} de {counts.todos} doses completas hoje
        {!online && <Text style={s.demoTag}>  ·  demo</Text>}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: T.turf,
    paddingTop: Platform.OS === 'web' ? 24 : (StatusBar.currentHeight || 44) + 8,
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center', justifyContent: 'center',
  },
  petChip: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 100, alignItems: 'center',
  },
  petName: { color: '#fff', fontSize: 14, fontWeight: '500' },
  petBreed: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
  dateLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 18 },
  title: { color: '#fff', fontSize: 28, fontWeight: '500', lineHeight: 32, marginTop: 2 },

  progressCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 14, padding: 12, marginTop: 18, gap: 12,
  },
  pctBlock: {
    backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', minWidth: 78,
  },
  pctValue: { color: '#fff', fontSize: 22, fontWeight: '500' },
  pctLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  statsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statN: { fontSize: 18, fontWeight: '500' },
  statL: { color: 'rgba(255,255,255,0.75)', fontSize: 10, marginTop: 2 },
  progressSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 10 },
  demoTag: { color: '#FCD34D' },
});
