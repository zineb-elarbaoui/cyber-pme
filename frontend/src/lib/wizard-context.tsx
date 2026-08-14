

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { PmeProfilCreate } from "./api";

const STORAGE_KEY = "cyberpme_wizard_state";

export type WizardState = {
  profil: Partial<PmeProfilCreate>;
  idPme: string | null;
  reponses: Record<number, string>; // id_question -> valeur_reponse
};

const defaultState: WizardState = {
  profil: {},
  idPme: null,
  reponses: {},
};

function loadInitialState(): WizardState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

type WizardContextValue = {
  state: WizardState;
  setProfil: (profil: Partial<PmeProfilCreate>) => void;
  setIdPme: (idPme: string) => void;
  setReponse: (idQuestion: number, valeur: string) => void;
  setReponses: (reponses: Record<number, string>) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(loadInitialState);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage indisponible (mode privé strict) — on continue sans persister
    }
  }, [state]);

  const setProfil = (profil: Partial<PmeProfilCreate>) =>
    setState((s) => ({ ...s, profil: { ...s.profil, ...profil } }));

  const setIdPme = (idPme: string) => setState((s) => ({ ...s, idPme }));

  const setReponse = (idQuestion: number, valeur: string) =>
    setState((s) => ({ ...s, reponses: { ...s.reponses, [idQuestion]: valeur } }));

  // Remplace/fusionne plusieurs réponses en un seul update — utilisé à la
  // connexion pour recharger les réponses déjà enregistrées en base
  // (GET /profil/{id_pme}/reponses), au lieu de les demander à nouveau.
  const setReponses = (reponses: Record<number, string>) =>
    setState((s) => ({ ...s, reponses: { ...s.reponses, ...reponses } }));

  const reset = () => {
    setState(defaultState);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <WizardContext.Provider value={{ state, setProfil, setIdPme, setReponse, setReponses, reset }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard doit être utilisé à l'intérieur de <WizardProvider>");
  return ctx;
}