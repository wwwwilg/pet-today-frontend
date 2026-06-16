import { useCallback, useRef, useState } from 'react';

// Toast simples (auto-dismiss). Retorna o estado atual e o disparador.
export function useToast(timeout = 2600) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((msg, kind = 'ok') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ msg, kind });
    timer.current = setTimeout(() => setToast(null), timeout);
  }, [timeout]);

  return { toast, showToast };
}
