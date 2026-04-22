import { useState, useCallback, useRef } from "react";
import type { ZodSchema, ZodError } from "zod";

// ─── Types ───────────────────────────────────────────────────
export interface UseFormOptions<T extends Record<string, unknown>> {
  /** Zod schema used for validation */
  schema: ZodSchema<T>;
  /** Initial values for every field */
  initialValues: T;
  /** Callback executed when validation passes on submit */
  onSubmit: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  /** Current field values */
  values: T;
  /** Per-field error messages (empty string = no error) */
  errors: Partial<Record<keyof T, string>>;
  /** Whether each field has been interacted with */
  touched: Partial<Record<keyof T, boolean>>;
  /** Whether a submit is currently in progress */
  isSubmitting: boolean;
  /** Update a single field value — triggers live validation */
  handleChange: (field: keyof T, value: T[keyof T]) => void;
  /** Mark a field as touched — triggers validation for that field */
  handleBlur: (field: keyof T) => void;
  /** Submit handler to attach to <form onSubmit> */
  handleSubmit: (e: React.FormEvent) => void;
  /** Programmatically set a specific error */
  setFieldError: (field: keyof T, message: string) => void;
  /** Reset the entire form to initial values */
  reset: () => void;
  /** Batch-update multiple fields at once (avoids race conditions) */
  setMultipleValues: (fields: Partial<T>) => void;
}

// ─── Helper: extract field errors from ZodError ──────────────
function extractErrors<T extends Record<string, unknown>>(
  zodError: ZodError,
  touchedFields: Partial<Record<keyof T, boolean>>
): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {};

  zodError.issues.forEach((issue) => {
    const field = issue.path[0] as keyof T;
    if (touchedFields[field] && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  });

  return fieldErrors;
}

// ─── Hook ────────────────────────────────────────────────────
export function useForm<T extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use a ref to always have latest values without adding to deps
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const validate = useCallback(
    (fields: T, touchedFields: Partial<Record<keyof T, boolean>>): boolean => {
      const result = schema.safeParse(fields);

      if (!result.success) {
        setErrors(extractErrors<T>(result.error, touchedFields));
        return false;
      }

      setErrors({});
      return true;
    },
    [schema]
  );

  const handleChange = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValues((prev) => {
        const updated = { ...prev, [field]: value };
        
        setTouched((prevTouched) => {
          const newTouched = { ...prevTouched, [field]: true };
          validate(updated, newTouched);
          return newTouched;
        });
        
        return updated;
      });
    },
    [validate]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      const newTouched = { ...touched, [field]: true };
      setTouched(newTouched);
      validate(valuesRef.current, newTouched);
    },
    [touched, validate]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(valuesRef.current).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      );
      setTouched(allTouched);

      if (!validate(valuesRef.current, allTouched)) return;

      setIsSubmitting(true);
      try {
        await onSubmit(valuesRef.current);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, onSubmit]
  );

  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setMultipleValues = useCallback((fields: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...fields }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    reset,
    setMultipleValues,
  };
}
