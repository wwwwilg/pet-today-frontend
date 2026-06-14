import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { T } from '../theme/tokens';
import Field, { fieldStyles as f } from '../components/Field';
import { DEFAULT_API_BASE } from '../config/env';

// Ajuste da URL base da API + status de conexao.
export default function SettingsModal({ open, apiBase, online, onClose, onSave }) {
  const [draft, setDraft] = useState(apiBase);
  useEffect(() => { if (open) setDraft(apiBase); }, [open, apiBase]);

  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={onClose}>
      <View style={s.wrap}>
        <View style={s.modal}>
          <View style={s.head}>
            <Text style={s.title}>Conexao com a API</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={T.deepTeal} /></TouchableOpacity>
          </View>

          <View style={{ padding: 20 }}>
            <View style={s.statusRow}>
              <View style={[s.dot, { backgroundColor: online ? T.turf : T.alert }]} />
              <Text style={s.statusTx}>{online ? 'Conectado ao backend' : 'Offline — usando dados de demonstracao'}</Text>
            </View>

            <Field label="URL base">
              <TextInput style={f.input} value={draft} onChangeText={setDraft} autoCapitalize="none" placeholder={DEFAULT_API_BASE} placeholderTextColor={T.deepTeal} />
            </Field>

            <Text style={s.hint}>
              Web/emulador: http://localhost:3333/api/v1{'\n'}
              Dispositivo fisico (Expo Go): use o IP da sua maquina, ex: http://192.168.0.10:3333/api/v1
            </Text>
          </View>

          <View style={s.foot}>
            <TouchableOpacity style={s.neutral} onPress={onClose}><Text style={s.neutralTx}>Fechar</Text></TouchableOpacity>
            <TouchableOpacity style={s.primary} onPress={() => onSave(draft.trim() || DEFAULT_API_BASE)}><Text style={s.primaryTx}>Conectar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: 'rgba(28,43,34,0.45)', justifyContent: 'flex-end' },
  modal: { backgroundColor: T.white, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: T.border },
  title: { fontSize: 18, fontWeight: '500', color: T.evergreen },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  statusTx: { color: T.deepTeal, fontSize: 13 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  hint: { color: T.deepTeal, fontSize: 12, lineHeight: 18 },
  foot: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, padding: 16, borderTopWidth: 1, borderTopColor: T.border, backgroundColor: T.porcelain },
  primary: { backgroundColor: T.turf, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  primaryTx: { color: '#fff', fontSize: 14, fontWeight: '500' },
  neutral: { backgroundColor: T.parchment, borderWidth: 1, borderColor: T.border, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  neutralTx: { color: T.evergreen, fontSize: 14, fontWeight: '500' },
});
