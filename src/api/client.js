// Cliente HTTP minimo que CONSOME a API NestJS (o backend nao e alterado).
// Cada metodo mapeia 1:1 com um endpoint do MedicationsController.

export function createApi(getBaseUrl) {
  async function request(path, options) {
    const base = getBaseUrl().replace(/\/+$/, '');
    const res = await fetch(base + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (res.status === 204) return null;
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const msg = data && data.message
        ? (Array.isArray(data.message) ? data.message.join(' · ') : data.message)
        : `Erro ${res.status}`;
      throw new Error(msg);
    }
    return data;
  }

  return {
    health: () => request('/health'),
    listMedications: (filters = {}) => {
      const qs = new URLSearchParams();
      if (filters.status) qs.set('status', filters.status);
      if (filters.petId) qs.set('petId', filters.petId);
      if (filters.q) qs.set('q', filters.q);
      const suffix = qs.toString() ? `?${qs}` : '';
      return request(`/medications${suffix}`);
    },
    getMedication: (id) => request(`/medications/${id}`),
    createMedication: (body) => request('/medications', { method: 'POST', body: JSON.stringify(body) }),
    updateMedication: (id, body) => request(`/medications/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    updateMedicationStatus: (id, status) =>
      request(`/medications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    deleteMedication: (id) => request(`/medications/${id}`, { method: 'DELETE' }),
  };
}
