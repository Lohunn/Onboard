import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createEmptyCircuit,
  validateCircuitDocument,
  generateInstanceId,
} from '../services/circuitSchema';

export const useCircuitStore = create(
  persist(
    (set, get) => ({
      // Active circuit document
      circuit: createEmptyCircuit(),

      // Validation state
      validationResult: { valid: true, errors: [], warnings: [] },

      // UI transient state (not persisted)
      selectedInstanceId: null,
      hoveredInstanceId: null,
      activeGuidedBuildId: null,
      currentGuidedStep: 0,

      // ─── Circuit Document Actions ───

      setCircuitName: (name) => {
        set((state) => ({
          circuit: {
            ...state.circuit,
            name,
            updatedAt: new Date().toISOString(),
          },
        }));
        get().revalidate();
      },

      newCircuit: (name = 'Untitled Circuit') => {
        const fresh = createEmptyCircuit('esp32-devkit-v1', name);
        set({
          circuit: fresh,
          validationResult: { valid: true, errors: [], warnings: [] },
          selectedInstanceId: null,
          activeGuidedBuildId: null,
          currentGuidedStep: 0,
        });
      },

      loadCircuit: (circuitDoc) => {
        const result = validateCircuitDocument(circuitDoc);
        set({
          circuit: { ...circuitDoc, updatedAt: new Date().toISOString() },
          validationResult: result,
          selectedInstanceId: null,
        });
      },

      exportCircuit: () => {
        const state = get();
        return JSON.stringify(state.circuit, null, 2);
      },

      // ─── Component Instance Actions ───

      addComponent: (componentTypeId, position = { x: 400, y: 300 }) => {
        const state = get();
        const circuit = state.circuit;

        const newInstance = {
          id: generateInstanceId(componentTypeId),
          componentTypeId,
          label: componentTypeId,
          position,
          rotation: 0,
        };

        const updatedCircuit = {
          ...circuit,
          instances: [...circuit.instances, newInstance],
          updatedAt: new Date().toISOString(),
        };

        set({ circuit: updatedCircuit });
        get().revalidate();
      },

      removeComponent: (instanceId) => {
        const state = get();
        const circuit = state.circuit;

        // Remove all connections referencing this instance
        const filteredConnections = circuit.connections.filter(
          (c) => c.from.instanceId !== instanceId && c.to.instanceId !== instanceId
        );

        const updatedCircuit = {
          ...circuit,
          instances: circuit.instances.filter((i) => i.id !== instanceId),
          connections: filteredConnections,
          updatedAt: new Date().toISOString(),
        };

        set({
          circuit: updatedCircuit,
          selectedInstanceId:
            state.selectedInstanceId === instanceId ? null : state.selectedInstanceId,
        });
        get().revalidate();
      },

      moveComponent: (instanceId, newPosition) => {
        const state = get();
        const updatedCircuit = {
          ...state.circuit,
          instances: state.circuit.instances.map((inst) =>
            inst.id === instanceId ? { ...inst, position: newPosition } : inst
          ),
          updatedAt: new Date().toISOString(),
        };
        set({ circuit: updatedCircuit });
      },

      // ─── Wire / Connection Actions ───

      addConnection: (fromEndpoint, toEndpoint) => {
        const state = get();
        const circuit = state.circuit;

        // Prevent duplicate connections
        const isDuplicate = circuit.connections.some(
          (c) =>
            (c.from.instanceId === fromEndpoint.instanceId &&
              c.from.terminalId === fromEndpoint.terminalId &&
              c.to.instanceId === toEndpoint.instanceId &&
              c.to.terminalId === toEndpoint.terminalId) ||
            (c.from.instanceId === toEndpoint.instanceId &&
              c.from.terminalId === toEndpoint.terminalId &&
              c.to.instanceId === fromEndpoint.instanceId &&
              c.to.terminalId === fromEndpoint.terminalId)
        );

        if (isDuplicate) return;

        const newConnection = {
          id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          from: fromEndpoint,
          to: toEndpoint,
          color: '#2A56A3',
          label: null,
        };

        const updatedCircuit = {
          ...circuit,
          connections: [...circuit.connections, newConnection],
          updatedAt: new Date().toISOString(),
        };

        set({ circuit: updatedCircuit });
        get().revalidate();
      },

      removeConnection: (connectionId) => {
        const state = get();
        const updatedCircuit = {
          ...state.circuit,
          connections: state.circuit.connections.filter((c) => c.id !== connectionId),
          updatedAt: new Date().toISOString(),
        };
        set({ circuit: updatedCircuit });
        get().revalidate();
      },

      // ─── Selection ───

      selectInstance: (instanceId) => set({ selectedInstanceId: instanceId }),
      clearSelection: () => set({ selectedInstanceId: null }),

      // ─── Guided Build ───

      startGuidedBuild: (buildId) => {
        get().newCircuit(`Guided Build: ${buildId}`);
        set({ activeGuidedBuildId: buildId, currentGuidedStep: 0 });
      },

      advanceGuidedStep: () => {
        set((state) => ({ currentGuidedStep: state.currentGuidedStep + 1 }));
      },

      // ─── Revalidate ───

      revalidate: () => {
        const state = get();
        const result = validateCircuitDocument(state.circuit);
        set({ validationResult: result });
        return result;
      },
    }),
    {
      name: 'onboard-circuit-storage',
      partialize: (state) => ({
        circuit: state.circuit,
      }),
    }
  )
);
