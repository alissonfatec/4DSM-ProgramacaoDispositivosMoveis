import { useState, useCallback } from 'react';

// useForm — gerencia estado e validação de formulários (useState)
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Limpa o erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const setError = useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const touchField = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  function validate(rules) {
    const newErrors = {};
    let isValid = true;

    Object.entries(rules).forEach(([field, ruleFn]) => {
      const error = ruleFn(values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }

  return { values, errors, touched, setValue, setError, touchField, validate, reset };
}

// useFeedback — gerencia alertas e toasts (useState)
export function useFeedback() {
  const [alert, setAlert] = useState({ message: '', type: '' });

  function showSuccess(msg) {
    setAlert({ message: msg, type: 'success' });
    setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  }

  function showError(msg) {
    setAlert({ message: msg, type: 'error' });
    setTimeout(() => setAlert({ message: '', type: '' }), 3500);
  }

  function clearAlert() {
    setAlert({ message: '', type: '' });
  }

  return { alert, showSuccess, showError, clearAlert };
}

// useBoletim — calcula médias e situação de um boletim
export function useBoletim(notas) {
  const calcularMedia = (n1, n2) => (n1 + n2) / 2;

  const getSituacao = (media) => {
    if (media >= 6) return { label: 'Aprovado', type: 'success' };
    if (media >= 4) return { label: 'Recuperação', type: 'warning' };
    return { label: 'Reprovado', type: 'danger' };
  };

  const notasComCalculo = notas.map(n => {
    const media = calcularMedia(n.nota1, n.nota2);
    return { ...n, media, situacao: getSituacao(media) };
  });

  const aprovadas = notasComCalculo.filter(n => n.media >= 6).length;
  const reprovadas = notasComCalculo.filter(n => n.media < 4).length;
  const recuperacao = notasComCalculo.filter(n => n.media >= 4 && n.media < 6).length;

  return { notasComCalculo, aprovadas, reprovadas, recuperacao };
}
