import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

type ErrorRecord = Record<string, string>;

interface UseErrorHandlerReturn {
  errors: ErrorRecord;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
  validateField: (field: string, value: any, validationFn: (value: any) => string | null) => boolean;
  handleApiError: (error: any, defaultMessage?: string) => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errors, setErrors] = useState<ErrorRecord>({});

  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateField = useCallback((field: string, value: any, validationFn: (value: any) => string | null) => {
    const errorMessage = validationFn(value);
    
    if (errorMessage) {
      setError(field, errorMessage);
      return false;
    } else {
      clearError(field);
      return true;
    }
  }, [setError, clearError]);

  const handleApiError = useCallback((error: any, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    
    // error handling
    if (error?.response?.data?.message) {
      // for API errors
      toast.error(error.response.data.message);
    } else if (error?.message) {
      // standard errors
      toast.error(error.message);
    } else {
      // "hanya tuhan yang tau" ahh errors
      toast.error(defaultMessage);
    }
  }, []);

  return {
    errors,
    setError,
    clearError,
    clearAllErrors,
    hasErrors: Object.keys(errors).length > 0,
    validateField,
    handleApiError,
  };
}; 