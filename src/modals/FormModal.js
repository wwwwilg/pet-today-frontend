import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { T } from '../theme/tokens';
import Field, { fieldStyles as f } from '../components/Field';
import { isHHmm, todayStr } from '../utils/date';
import { genUuidV4, isUuidV4 } from '../utils/uuid';

const STATUS_OPTIONS = [['active', 'Em uso'], ['paused', 'Pausado'], ['finished', 'Concluido']];

// Modal de cadastro/edicao. Valida no cliente espelhando os DTOs do backend
// (petId UUID v4, horarios HH:mm nao-vazios, datas, etc.).
export default function FormModal({ open, editing, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm());
  const [timeDraft, setTimeDraft] = useState('');
  const [errors, setErrors] = useState({});

  function emptyForm() {
    return { petId: '', name: '', dosage: '', frequency: '', times: [], route: '', status: 'active', startDate: todayStr(), endDate: '', observations: '' };
  }
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (!open) return;
    const m = editing;
    setForm(m ? {
      petId: m.petId, name: m.name, dosage: m.dosage, frequency: m.frequency,
      times: (m.administrationTimes || []).slice(), route: m.route || '',
      status: m.status, startDate: m.startDate, endDate: m.endDate || '', observations: m.observations || '',
    } : emptyForm());
    setTimeDraft('');
    setErrors({});
  }, [open, editing]);

  const addTime = () => {
    const v = timeDraft.trim();
    if (!isHHmm(v)) { setErrors((e) => ({ ...e, times: 'Use HH:mm (ex: 08:00).' })); return; }
    if (!form.times.includes(v)) set('times', [...form.times, v].sort());
    setTimeDraft('');
    setErrors((e) => ({ ...e, times: undefined }));
  };
  const removeTime = (t) => set('times', form.times.filter((x) => x !== t));

  const submit = () => {
    const er = {};
    if (!form.petId.trim()) er.petId = 'Informe o UUID do pet.';
    else if (!isUuidV4(form.petId.trim())) er.petId = 'UUID v4 invalido.';
    if (!form.name.trim()) er.name = 'Informe o nome.';
    if (!form.dosage.trim()) er.dosage = 'Informe a dosagem.';
    if (!form.frequency.trim()) er.frequency = 'Informe a frequencia.';
    if (form.times.length === 0) er.times = 'Adicione ao menos um horario.';
    if (!form.startDate.trim()) er.startDate = 'Informe a data de inicio.';
    if (form.endDate && form.endDate < form.startDate) er.endDate = 'Termino antes do inicio.';
    setErrors(er);
    if (Object.keys(er).length) return;

    onSubmit({
      petId: form.petId.trim(),
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency.trim(),
      administrationTimes: form.times.slice(),
      route: form.route.trim() || null,
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim() || null,
      observations: form.observations.trim() || null,
      status: form.status,
    }, editing ? editing.id : null);
  };

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.wrap}>
        <View style={s.modal}>
          <View style={s.head}>
            <Text style={s.title}>{editing ? 'Editar medicamento' : 'Novo medicamento'}</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={T.deepTeal} /></TouchableOpacity>
          </View>

          <ScrollView style={{ paddingHorizontal: 20 }} contentContainerStyle={{ paddingVertical: 18 }}>
            <Field label="Pet (UUID) *" error={errors.petId}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput style={[f.input, { flex: 1 }, errors.petId && f.inputErr]} value={form.petId} onChangeText={(v) => set('petId', v)} placeholder="00000000-0000-4000-8000-..." placeholderTextColor={T.deepTeal} autoCapitalize="none" />
                <TouchableOpacity style={s.ghost} onPress={() => set('petId', genUuidV4())}><Text style={s.ghostTx}>Gerar</Text></TouchableOpacity>
              </View>
            </Field>

            <Field label="Nome do medicamento *" error={errors.name}>
              <TextInput style={[f.input, errors.name && f.inputErr]} value={form.name} onChangeText={(v) => set('name', v)} placeholder="Ex: Dipirona 500mg" placeholderTextColor={T.deepTeal} />
            </Field>

            <View style={s.cols}>
              <Field label="Dosagem *" error={errors.dosage} style={s.col}>
                <TextInput style={[f.input, errors.dosage && f.inputErr]} value={form.dosage} onChangeText={(v) => set('dosage', v)} placeholder="1 comprimido" placeholderTextColor={T.deepTeal} />
              </Field>
              <Field label="Frequencia *" error={errors.frequency} style={s.col}>
                <TextInput style={[f.input, errors.frequency && f.inputErr]} value={form.frequency} onChangeText={(v) => set('frequency', v)} placeholder="2x ao dia" placeholderTextColor={T.deepTeal} />
              </Field>
            </View>

            <Field label="Horarios (HH:mm) *" error={errors.times}>
              <View style={s.tags}>
                {form.times.map((t) => (
                  <View key={t} style={s.tag}>
                    <Text style={s.tagTx}>{t}</Text>
                    <TouchableOpacity onPress={() => removeTime(t)}><Ionicons name="close" size={14} color={T.turf} /></TouchableOpacity>
                  </View>
                ))}
                {form.times.length === 0 && <Text style={s.tagEmpty}>Nenhum horario.</Text>}
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <TextInput style={[f.input, { width: 110 }]} value={timeDraft} onChangeText={setTimeDraft} placeholder="08:00" placeholderTextColor={T.deepTeal} keyboardType="numbers-and-punctuation" onSubmitEditing={addTime} />
                <TouchableOpacity style={s.sec} onPress={addTime}><Text style={s.secTx}>Adicionar</Text></TouchableOpacity>
              </View>
            </Field>

            <View style={s.cols}>
              <Field label="Via (opcional)" style={s.col}>
                <TextInput style={f.input} value={form.route} onChangeText={(v) => set('route', v)} placeholder="Oral" placeholderTextColor={T.deepTeal} />
              </Field>
              <Field label="Status" style={s.col}>
                <View style={s.seg}>
                  {STATUS_OPTIONS.map(([val, lb]) => (
                    <TouchableOpacity key={val} style={[s.segItem, form.status === val && s.segActive]} onPress={() => set('status', val)}>
                      <Text style={[s.segTx, form.status === val && s.segTxActive]}>{lb}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Field>
            </View>

            <View style={s.cols}>
              <Field label="Inicio * (AAAA-MM-DD)" error={errors.startDate} style={s.col}>
                <TextInput style={[f.input, errors.startDate && f.inputErr]} value={form.startDate} onChangeText={(v) => set('startDate', v)} placeholder="2026-06-14" placeholderTextColor={T.deepTeal} />
              </Field>
              <Field label="Termino (opcional)" error={errors.endDate} style={s.col}>
                <TextInput style={[f.input, errors.endDate && f.inputErr]} value={form.endDate} onChangeText={(v) => set('endDate', v)} placeholder="2026-06-21" placeholderTextColor={T.deepTeal} />
              </Field>
            </View>

            <Field label="Observacoes (opcional)">
              <TextInput style={[f.input, { height: 80, textAlignVertical: 'top' }]} value={form.observations} onChangeText={(v) => set('observations', v)} placeholder="Notas do tratamento..." placeholderTextColor={T.deepTeal} multiline />
            </Field>
          </ScrollView>

          <View style={s.foot}>
            <TouchableOpacity style={s.neutral} onPress={onClose}><Text style={s.neutralTx}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity style={s.primary} onPress={submit}><Text style={s.primaryTx}>{editing ? 'Salvar' : 'Cadastrar'}</Text></TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: 'rgba(28,43,34,0.45)', justifyContent: 'flex-end' },
  modal: { backgroundColor: T.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '92%' },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: T.border },
  title: { fontSize: 18, fontWeight: '500', color: T.evergreen },
  foot: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, padding: 16, borderTopWidth: 1, borderTopColor: T.border, backgroundColor: T.porcelain },
  cols: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: T.mint, borderWidth: 1, borderColor: T.borderGreen, borderRadius: 100, paddingLeft: 12, paddingRight: 8, paddingVertical: 4 },
  tagTx: { color: T.turf, fontSize: 13 },
  tagEmpty: { color: T.deepTeal, fontSize: 12, fontStyle: 'italic' },

  seg: { flexDirection: 'row', borderWidth: 1, borderColor: T.border, borderRadius: 10, overflow: 'hidden' },
  segItem: { flex: 1, paddingVertical: 9, alignItems: 'center', backgroundColor: T.white },
  segActive: { backgroundColor: T.turf },
  segTx: { fontSize: 11, color: T.deepTeal },
  segTxActive: { color: '#fff' },

  primary: { backgroundColor: T.turf, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  primaryTx: { color: '#fff', fontSize: 14, fontWeight: '500' },
  neutral: { backgroundColor: T.parchment, borderWidth: 1, borderColor: T.border, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  neutralTx: { color: T.evergreen, fontSize: 14, fontWeight: '500' },
  sec: { backgroundColor: T.mint, borderWidth: 1, borderColor: T.borderGreen, borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  secTx: { color: T.turf, fontSize: 13, fontWeight: '500' },
  ghost: { paddingHorizontal: 14, justifyContent: 'center', borderRadius: 10 },
  ghostTx: { color: T.turf, fontSize: 13, fontWeight: '500' },
});
