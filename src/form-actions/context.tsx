"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FormAction } from "./types";

type FormActionContextValue = {
  actions: FormAction[];
  setActions: (actions: FormAction[]) => void;
};

const FormActionContext = createContext<FormActionContextValue | null>(null);

export function FormActionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [actions, setActions] = useState<FormAction[]>([]);

  const value = useMemo(() => ({ actions, setActions }), [actions]);

  return (
    <FormActionContext.Provider value={value}>
      {children}
    </FormActionContext.Provider>
  );
}

/** Read the currently published actions. Used by the Action Bar. */
export function useFormActions() {
  const ctx = useContext(FormActionContext);
  if (!ctx) {
    throw new Error("useFormActions must be used within a FormActionProvider");
  }
  return ctx.actions;
}

/**
 * Called inside a form component to publish its actions into the Action Bar.
 * Actions are cleared automatically when the form unmounts.
 *
 * Pass a stable `actions` array (or memo it) to avoid infinite update loops.
 */
export function useRegisterActions(actions: FormAction[]) {
  const ctx = useContext(FormActionContext);
  if (!ctx) {
    throw new Error(
      "useRegisterActions must be used within a FormActionProvider",
    );
  }

  const { setActions } = ctx;

  // Keep a ref to avoid the effect depending on setActions identity
  const setActionsRef = useRef(setActions);
  setActionsRef.current = setActions;

  // Serialize actions to a stable primitive for dependency comparison

  const serialized = JSON.stringify(
    actions.map(({ id, label, variant, disabled, loading }) => ({
      id,
      label,
      variant,
      disabled,
      loading,
    })),
  );

  const stableActions = useRef(actions);
  stableActions.current = actions;

  useEffect(() => {
    setActionsRef.current(stableActions.current);
    return () => {
      setActionsRef.current([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);
}

export function useSetFormActions() {
  const ctx = useContext(FormActionContext);
  if (!ctx) {
    throw new Error(
      "useSetFormActions must be used within a FormActionProvider",
    );
  }
  return useCallback((actions: FormAction[]) => ctx.setActions(actions), [ctx]);
}
