import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { T } from '../theme/tokens';

export default function Toast({ toast }) {
  if (!toast) return null;
  const err = toast.kind === 'err';
  return (
    <View style={[s.toast, err && s.err]}>
      <Text style={[s.tx, err && s.txErr]}>{toast.msg}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  toast: {
    position: 'absolute', left: 20, right: 20, bottom: 96,
    backgroundColor: T.okBg, borderWidth: 1, borderColor: '#86efac', borderRadius: 10, padding: 12,
  },
  err: { backgroundColor: T.alertBg, borderColor: '#fca5a5' },
  tx: { color: T.okTx, fontSize: 14, textAlign: 'center' },
  txErr: { color: T.alertTx },
});
