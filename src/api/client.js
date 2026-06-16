const API_V1_SUFFIX = /\/api\/v1\/?$/;

function normalizeBaseUrl(url) {
  return (url || '').trim().replace(/\/+$/, '');
}

function candidateBaseUrls(url) {
  const base = normalizeBaseUrl(url);
  if (!base) return [];

  const alternate = API_V1_SUFFIX.test(base)
    ? base.replace(API_V1_SUFFIX, '')
    : `${base}/api/v1`;

  return alternate && alternate !== base ? [base, alternate] : [base];
}

function parseErrorMessage(data, status) {
  const message = data && data.message;
  if (Array.isArray(message)) return message.join(' · ');
  if (typeof message === 'string') return message;
  if (typeof data?.error === 'string') return data.error;
  return `Erro ${status}`;
}

async function readResponse(res) {
  if (res.status === 204) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    if (!res.ok) return { message: text };
    throw new Error('A API respondeu em um formato invalido.');
  }
}

export function createApi(getBaseUrl) {
  async function request(path, options) {
    const bases = candidateBaseUrls(getBaseUrl());
    if (bases.length === 0) throw new Error('Configure a URL base da API.');

    let lastError = null;

    for (const base of bases) {
      try {
        const res = await fetch(base + path, {
          headers: { 'Content-Type': 'application/json' },
          ...options,
        });
        const data = await readResponse(res);

        if (res.ok) return data;

        const error = new Error(parseErrorMessage(data, res.status));
        error.status = res.status;
        lastError = error;

        if (res.status !== 404) break;
      } catch (error) {
        lastError = error;
        break;
      }
    }

    throw lastError || new Error('Nao foi possivel conectar ao backend.');
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
