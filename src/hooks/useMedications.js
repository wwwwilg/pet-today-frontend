import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createApi } from '../api/client';
import { SAMPLE_MEDS } from '../data/sample';
import { DEFAULT_API_BASE } from '../config/env';
import { doseKey, viewOf } from '../utils/dose';
import { todayStr } from '../utils/date';

// Hook central: carrega medicamentos do backend (com fallback demo),
// mantem o registro local de doses concluidas e expoe as acoes de CRUD/status.
export function useMedications(showToast) {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [meds, setMeds] = useState([]);
  const [doneSet, setDoneSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [online, setOnline] = useState(false);

  const baseRef = useRef(apiBase);
  baseRef.current = apiBase;
  const api = useMemo(() => createApi(() => baseRef.current), []);

  const load = useCallback(async () => {
    try {
      const data = await api.listMedications({ status: 'active' });
      setMeds(Array.isArray(data) ? data : []);
      setOnline(true);
    } catch (_) {
      setMeds(SAMPLE_MEDS);
      setOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [api]);

  useEffect(() => { load(); }, [load, apiBase]);

  const refresh = useCallback(() => { setRefreshing(true); load(); }, [load]);

  const reconnect = useCallback((base) => {
    setLoading(true);
    setApiBase(base || DEFAULT_API_BASE);
  }, []);

  // Marca/desmarca a dose representativa do medicamento (estado local — o
  // backend de medicamentos nao possui log de doses).
  const toggleDose = useCallback((med, undo, nowMin) => {
    setDoneSet((prev) => {
      const v = viewOf(med, prev, nowMin);
      const today = todayStr();
      const next = new Set(prev);
      if (undo) {
        const done = v.times.filter((t) => next.has(doseKey(med.id, t, today)));
        const last = done[done.length - 1];
        if (last) { next.delete(doseKey(med.id, last, today)); showToast('Dose desmarcada.'); }
      } else if (v.repTime) {
        next.add(doseKey(med.id, v.repTime, today));
        showToast(`Dose das ${v.repTime} registrada.`);
      }
      return next;
    });
  }, [showToast]);

  const changeStatus = useCallback(async (med, status) => {
    if (status !== 'active') setMeds((m) => m.filter((x) => x.id !== med.id));
    else setMeds((m) => m.map((x) => (x.id === med.id ? { ...x, status } : x)));
    if (online) {
      try { await api.updateMedicationStatus(med.id, status); }
      catch (e) { showToast(e.message, 'err'); return; }
    }
    showToast(
      status === 'paused' ? 'Tratamento pausado.'
        : status === 'finished' ? 'Tratamento concluido.'
        : 'Tratamento reativado.'
    );
  }, [api, online, showToast]);

  const remove = useCallback(async (med) => {
    setMeds((m) => m.filter((x) => x.id !== med.id));
    if (online) {
      try { await api.deleteMedication(med.id); }
      catch (e) { showToast(e.message, 'err'); return; }
    }
    showToast('Medicamento removido.');
  }, [api, online, showToast]);

  const save = useCallback(async (payload, id) => {
    if (id) {
      setMeds((m) => m.map((x) => (x.id === id ? { ...x, ...payload } : x)));
      if (online) {
        try { await api.updateMedication(id, payload); }
        catch (e) { showToast(e.message, 'err'); return false; }
      }
      showToast('Medicamento atualizado.');
    } else {
      let created = null;
      if (online) {
        try { created = await api.createMedication(payload); }
        catch (e) { showToast(e.message, 'err'); return false; }
      }
      setMeds((m) => [created || { ...payload, id: 'local-' + Date.now() }, ...m]);
      showToast('Medicamento cadastrado.');
    }
    return true;
  }, [api, online, showToast]);

  return {
    apiBase, meds, doneSet, loading, refreshing, online,
    load, refresh, reconnect, toggleDose, changeStatus, remove, save,
  };
}
