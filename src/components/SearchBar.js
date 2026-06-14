import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { T } from '../theme/tokens';

export default function SearchBar({ value, onChange }) {
  return (
    <View style={s.row}>
      <View style={s.box}>
        <Ionicons name="search" size={18} color={T.deepTeal} />
        <TextInput
          style={s.input}
          placeholder="Pesquisar medicamentos"
          placeholderTextColor={T.deepTeal}
          value={value}
          onChangeText={onChange}
        />
      </View>
      <TouchableOpacity style={s.filter}>
        <Ionicons name="options-outline" size={20} color={T.turf} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 18 },
  box: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: T.white, borderWidth: 1, borderColor: T.border,
    borderRadius: 12, paddingHorizontal: 14, height: 46,
  },
  input: { flex: 1, fontSize: 14, color: T.evergreen, padding: 0, outlineStyle: 'none' },
  filter: {
    width: 46, height: 46, borderRadius: 12, backgroundColor: T.mint,
    borderWidth: 1, borderColor: T.borderGreen, alignItems: 'center', justifyContent: 'center',
  },
});
