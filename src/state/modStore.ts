import { create } from "zustand";
import type { ModTreeNode } from "../lib/tydClient";

export type AppMode = "simple" | "advanced";
export type ContentType = "softwareTypes" | "personalities" | "companyTypes" | "meta";

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  modified: boolean;
  fileType: "tyd" | "txt" | "json" | "meta";
  contentType?: string;
}

export interface ValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
}

interface ModStore {
  mode: AppMode | null;
  modPath: string | null;
  modName: string;
  modTree: ModTreeNode[];
  contentType: ContentType;
  openTabs: Tab[];
  activeTab: string | null;
  validationErrors: ValidationError[];
  unsavedChanges: boolean;
  consoleLog: string[];

  setMode: (mode: AppMode) => void;
  setModPath: (path: string) => void;
  setModName: (name: string) => void;
  setModTree: (tree: ModTreeNode[]) => void;
  setContentType: (ct: ContentType) => void;
  openTab: (tab: Tab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string | null) => void;
  updateTabContent: (id: string, content: string) => void;
  markTabSaved: (id: string) => void;
  addValidationError: (error: ValidationError) => void;
  clearValidationErrors: () => void;
  addConsoleLog: (message: string) => void;
  clearConsoleLog: () => void;
  reset: () => void;
}

export const useModStore = create<ModStore>((set) => ({
  mode: null,
  modPath: null,
  modName: "",
  modTree: [],
  contentType: "softwareTypes",
  openTabs: [],
  activeTab: null,
  validationErrors: [],
  unsavedChanges: false,
  consoleLog: [],

  setMode: (mode) => set({ mode }),
  setModPath: (path) => set({ modPath: path }),
  setModName: (name) => set({ modName: name }),
  setModTree: (tree) => set({ modTree: tree }),
  setContentType: (ct) => set({ contentType: ct }),

  openTab: (tab) =>
    set((state) => {
      const existing = state.openTabs.find((t) => t.id === tab.id);
      if (existing) {
        return { activeTab: tab.id };
      }
      return {
        openTabs: [...state.openTabs, tab],
        activeTab: tab.id,
      };
    }),

  closeTab: (id) =>
    set((state) => {
      const newTabs = state.openTabs.filter((t) => t.id !== id);
      const newActive =
        state.activeTab === id
          ? newTabs.length > 0
            ? newTabs[newTabs.length - 1].id
            : null
          : state.activeTab;
      return { openTabs: newTabs, activeTab: newActive };
    }),

  setActiveTab: (id) => set({ activeTab: id }),

  updateTabContent: (id, content) =>
    set((state) => ({
      openTabs: state.openTabs.map((t) =>
        t.id === id ? { ...t, content, modified: true } : t
      ),
      unsavedChanges: true,
    })),

  markTabSaved: (id) =>
    set((state) => ({
      openTabs: state.openTabs.map((t) =>
        t.id === id ? { ...t, modified: false } : t
      ),
      unsavedChanges: state.openTabs.some(
        (t) => t.id !== id && t.modified
      ),
    })),

  addValidationError: (error) =>
    set((state) => ({
      validationErrors: [...state.validationErrors, error],
    })),

  clearValidationErrors: () => set({ validationErrors: [] }),

  addConsoleLog: (message) =>
    set((state) => ({
      consoleLog: [...state.consoleLog, message],
    })),

  clearConsoleLog: () => set({ consoleLog: [] }),

  reset: () =>
    set({
      mode: null,
      modPath: null,
      modName: "",
      modTree: [],
      contentType: "softwareTypes",
      openTabs: [],
      activeTab: null,
      validationErrors: [],
      unsavedChanges: false,
      consoleLog: [],
    }),
}));
