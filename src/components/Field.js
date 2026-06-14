import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { T } from '../theme/tokens';

// Campo de formulario com label sempre acima do campo e mensagem de erro.
export default function Field({ label, error, children, style }) {
  return (
    <View style={[s.group, style]}>
      <Text style={s.label}>{label}</Text>
      {children}
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '500', color: T.deepTeal, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 },
  error: { fontSize: 11, color: T.alertTx, marginTop: 4 },
});

export const fieldStyles = StyleSheet.create({
  input: { borderWidth: 1.5, borderColor: T.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: T.evergreen, backgroundColor: T.white, outlineStyle: 'none' },
  inputErr: { borderColor: T.alert },
});
