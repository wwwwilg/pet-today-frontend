import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { T } from '../theme/tokens';
import { dateTitle } from '../utils/date';
import { viewOf } from '../utils/dose';
import { useToast } from '../hooks/useToast';
import { useMedications } from '../hooks/useMedications';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Tabs from '../components/Tabs';
import MedCard from '../components/MedCard';
import Toast from '../components/Toast';
import FormModal from '../modals/FormModal';
import SettingsModal from '../modals/SettingsModal';

export default function MedicationsScreen() {
  const { toast, showToast } = useToast();
  const {
    apiBase, meds, doneSet, loading, refreshing, online,
    refresh, reconnect, toggleDose, changeStatus, remove, save,
  } = useMedications(showToast);

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('todos');
  const [expanded, setExpanded] = useState(null);
  const [now, setNow] = useState(Date.now());

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Atualiza o "agora" a cada minuto para reclassificar as doses.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const nowMin = useMemo(() => {
    const d = new Date(now);
    return d.getHours() * 60 + d.getMinutes();
  }, [now]);

  const views = useMemo(
    () => meds.map((m) => ({ med: m, v: viewOf(m, doneSet, nowMin) })),
    [meds, doneSet, nowMin]
  );

  const counts = useMemo(() => {
    const c = { todos: views.length, agora: 0, faltam: 0, feito: 0, esquecido: 0 };
    views.forEach(({ v }) => { c[v.state] += 1; });
    return c;
  }, [views]);

  const pct = counts.todos ? Math.round((counts.feito / counts.todos) * 100) : 0;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return views.filter(({ med, v }) => {
      if (tab !== 'todos' && v.state !== tab) return false;
      if (q && !med.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [views, tab, search]);

  const tabs = [
    { key: 'todos', label: 'Todos', n: counts.todos },
    { key: 'agora', label: 'Agora', n: counts.agora },
    { key: 'faltam', label: 'Faltando', n: counts.faltam },
    { key: 'feito', label: 'Feito', n: counts.feito },
  ];

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (med) => { setEditing(med); setFormOpen(true); };

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={T.turf} />}
      >
        <Header
          dateLabel={dateTitle(new Date(now))}
          counts={counts}
          pct={pct}
          online={online}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <SearchBar value={search} onChange={setSearch} />
        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        <View style={{ paddingHorizontal: 16 }}>
          {loading ? (
            <View style={s.state}><ActivityIndicator color={T.turf} /><Text style={s.stateSub}>Carregando...</Text></View>
          ) : filtered.length === 0 ? (
            <View style={s.state}>
              <Text style={s.emoji}>🐾</Text>
              <Text style={s.stateTitle}>Nenhum medicamento</Text>
              <Text style={s.stateSub}>Ajuste a busca ou cadastre um novo tratamento.</Text>
            </View>
          ) : (
            filtered.map(({ med, v }) => (
              <MedCard
                key={med.id}
                med={med}
                view={v}
                expanded={expanded === med.id}
                onToggleExpand={() => setExpanded(expanded === med.id ? null : med.id)}
                onDone={() => toggleDose(med, false, nowMin)}
                onUndo={() => toggleDose(med, true, nowMin)}
                onEdit={() => openEdit(med)}
                onStatus={(st) => { setExpanded(null); changeStatus(med, st); }}
                onRemove={() => { setExpanded(null); remove(med); }}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Acao primaria unica da tela */}
      <TouchableOpacity style={s.fab} activeOpacity={0.85} onPress={openNew}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Toast toast={toast} />

      <SettingsModal
        open={settingsOpen}
        apiBase={apiBase}
        online={online}
        onClose={() => setSettingsOpen(false)}
        onSave={(base) => { setSettingsOpen(false); reconnect(base); }}
      />

      <FormModal
        open={formOpen}
        editing={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={async (payload, id) => { const ok = await save(payload, id); if (ok) setFormOpen(false); }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.porcelain },
  state: { alignItems: 'center', paddingVertical: 48, backgroundColor: T.white, borderRadius: 12, borderWidth: 1, borderColor: T.border, marginTop: 8 },
  emoji: { fontSize: 36, marginBottom: 10 },
  stateTitle: { fontSize: 15, fontWeight: '500', color: T.evergreen },
  stateSub: { fontSize: 13, color: T.deepTeal, marginTop: 4 },
  fab: {
    position: 'absolute', right: 20, bottom: 28,
    width: 58, height: 58, borderRadius: 29, backgroundColor: T.turf,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
});
