import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { T } from '../theme/tokens';

// Tabs em formato pill: item ativo em turf solido, sem underline.
export default function Tabs({ tabs, active, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <TouchableOpacity key={t.key} onPress={() => onChange(t.key)} style={[s.tab, isActive && s.tabActive]}>
            <Text style={[s.tx, isActive && s.txActive]}>{t.label} {t.n}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  row: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, backgroundColor: T.white, borderWidth: 1, borderColor: T.border },
  tabActive: { backgroundColor: T.turf, borderColor: T.turf },
  tx: { fontSize: 13, color: T.deepTeal, fontWeight: '500' },
  txActive: { color: '#fff' },
});
