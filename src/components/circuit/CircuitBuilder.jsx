import React, { useState, useCallback, useRef } from 'react';
import { useCircuitStore } from '../../store/useCircuitStore';
import {
  SUPPORTED_COMPONENTS,
  GUIDED_BUILDS,
} from '../../services/circuitSchema';
import {
  Cpu,
  Grid,
  Lightbulb,
  Activity,
  Square,
  Sliders,
  Minus,
  Trash2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
  Save,
  FolderOpen,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Zap,
  X,
} from 'lucide-react';

const ICON_MAP = {
  Cpu,
  Grid,
  Lightbulb,
  Activity,
  Square,
  Sliders,
  Minus,
};

function ComponentIcon({ iconName, className }) {
  const Icon = ICON_MAP[iconName] || Activity;
  return <Icon className={className} />;
}

// ─── Component Palette Item ───
function PaletteItem({ componentDef, onAdd }) {
  const { label, icon, color, maxInstances, category } = componentDef;

  return (
    <button
      onClick={onAdd}
      title={`Add ${label} to canvas`}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[7px] bg-[#FAF4E9] border border-[#CEC0AD] hover:border-[#2A56A3] hover:bg-[#F9F2E5] transition-all group text-left"
    >
      <div
        className="w-7 h-7 rounded-[5px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18`, borderColor: color, borderWidth: 1 }}
      >
        <ComponentIcon iconName={icon} className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#18213D] truncate group-hover:text-[#2A56A3]">
          {label}
        </div>
        <div className="text-[10px] font-['Barlow'] text-[#5C6066] capitalize">{category} · max {maxInstances}</div>
      </div>
      <Plus className="w-3.5 h-3.5 text-[#5C6066] shrink-0 group-hover:text-[#2A56A3]" />
    </button>
  );
}

// ─── Component Instance on Canvas ───
function CanvasComponent({ instance, isSelected, onSelect, onDelete, onDragEnd }) {
  const def = SUPPORTED_COMPONENTS[instance.componentTypeId];
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState(instance.position);
  const dragStart = useRef(null);

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      onSelect(instance.id);
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: localPos.x,
        startY: localPos.y,
      };
      setIsDragging(true);

      const handleMouseMove = (moveE) => {
        if (!dragStart.current) return;
        const dx = moveE.clientX - dragStart.current.mouseX;
        const dy = moveE.clientY - dragStart.current.mouseY;
        setLocalPos({
          x: Math.max(0, dragStart.current.startX + dx),
          y: Math.max(0, dragStart.current.startY + dy),
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        onDragEnd(instance.id, {
          x: Math.max(0, dragStart.current?.startX + 0 || localPos.x),
          y: localPos.y,
        });
        dragStart.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [instance.id, localPos, onSelect, onDragEnd]
  );

  if (!def) return null;

  const isBoard = def.category === 'board';
  const isBreadboard = def.category === 'passive' && def.id === 'breadboard-half';

  return (
    <div
      className={`absolute select-none ${isDragging ? 'z-50 cursor-grabbing' : 'cursor-grab z-10'} ${
        isSelected ? 'z-20' : ''
      }`}
      style={{ left: localPos.x, top: localPos.y }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`rounded-[9px] border-2 transition-all ${
          isSelected ? 'border-[#2A56A3] shadow-lg shadow-[#2A56A3]/20' : 'border-[#CEC0AD] hover:border-[#18213D]'
        }`}
        style={{
          backgroundColor: isBoard ? '#111622' : isBreadboard ? '#F5EDD8' : '#FAF4E9',
          minWidth: isBoard ? 220 : isBreadboard ? 300 : 110,
        }}
      >
        {/* Component Header */}
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-t-[7px] border-b ${
            isBoard ? 'border-[#2A56A3]/30 bg-[#1a2540]' : 'border-[#CEC0AD]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-[4px] flex items-center justify-center"
              style={{ backgroundColor: `${def.color}20` }}
            >
              <ComponentIcon
                iconName={def.icon}
                className="w-3 h-3"
                style={{ color: def.color }}
              />
            </div>
            <span
              className={`text-xs font-['Barlow_Semi_Condensed'] font-bold ${
                isBoard ? 'text-[#F6EDDD]' : 'text-[#18213D]'
              }`}
            >
              {instance.label || def.label}
            </span>
          </div>

          {!isBoard && !isBreadboard && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(instance.id);
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 text-[#5C6066] hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Terminals / Pin Rows */}
        <div className="p-2 space-y-1">
          {def.terminals.slice(0, isBoard ? 6 : undefined).map((terminal) => (
            <div key={terminal.id} className="flex items-center gap-2 group">
              <div
                className={`w-2 h-2 rounded-full border ${
                  terminal.electricalType === 'power'
                    ? 'bg-[#C0652D] border-[#C0652D]'
                    : terminal.electricalType === 'ground'
                    ? 'bg-[#4B505C] border-[#4B505C]'
                    : terminal.electricalType === 'gpio'
                    ? 'bg-[#2A56A3] border-[#2A56A3]'
                    : 'bg-[#FAF4E9] border-[#5C6066]'
                }`}
              />
              <span
                className={`text-[10px] font-['JetBrains_Mono'] truncate max-w-[140px] ${
                  isBoard ? 'text-[#CEC0AD]' : 'text-[#5C6066]'
                }`}
              >
                {terminal.label}
              </span>
            </div>
          ))}
          {isBoard && def.terminals.length > 6 && (
            <div className="text-[9px] font-['Barlow'] text-[#4B6080] pl-4">
              + {def.terminals.length - 6} more terminals...
            </div>
          )}
        </div>

        {/* Breadboard Rows Indicator */}
        {isBreadboard && (
          <div className="px-3 pb-3">
            <div className="rounded-[5px] bg-[#EAE0CA] border border-[#CEC0AD] p-2 text-center">
              <div className="text-xs font-['JetBrains_Mono'] text-[#5C6066] font-bold">30 Rows × 5 Tie Points</div>
              <div className="text-[10px] font-['Barlow'] text-[#8A909C] mt-0.5">Same row = connected</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Guided Build Step Panel ───
function GuidedStepPanel({ buildId, stepIndex }) {
  const advanceGuidedStep = useCircuitStore((s) => s.advanceGuidedStep);
  const build = GUIDED_BUILDS[buildId];
  if (!build) return null;

  const step = build.steps[stepIndex];
  if (!step) return null;

  const isComplete = step.requiredAction === 'complete';
  const totalSteps = build.steps.length;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <div className="rounded-[9px] bg-[#FAF4E9] border border-[#2A56A3]/30 p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-[#2A56A3]" />
        <span className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#2A56A3]">
          Guided Build — Step {stepIndex + 1} of {totalSteps}
        </span>
      </div>

      <div className="w-full h-1.5 bg-[#CEC0AD] rounded-full mb-3">
        <div
          className="h-1.5 bg-[#2A56A3] rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h3 className="font-['Barlow_Semi_Condensed'] text-base font-bold text-[#18213D] mb-1">
        {step.title}
      </h3>
      <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed mb-3">
        {step.instruction}
      </p>

      <button
        onClick={advanceGuidedStep}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-[7px] bg-[#2A56A3] text-white text-sm font-['Barlow_Semi_Condensed'] font-bold hover:bg-[#1f4590] transition-colors"
      >
        {isComplete ? (
          <>
            <CheckCircle2 className="w-4 h-4" /> Launch Simulation
          </>
        ) : (
          <>
            Next Step <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main Circuit Builder Component ───
export default function CircuitBuilder({ onLaunchSim }) {
  const {
    circuit,
    validationResult,
    selectedInstanceId,
    activeGuidedBuildId,
    currentGuidedStep,
    addComponent,
    removeComponent,
    moveComponent,
    selectInstance,
    clearSelection,
    newCircuit,
    exportCircuit,
    loadCircuit,
    startGuidedBuild,
  } = useCircuitStore();

  const [_showSavePanel, setShowSavePanel] = useState(false);
  const [showLoadPanel, setShowLoadPanel] = useState(false);
  const [loadText, setLoadText] = useState('');
  const [loadError, setLoadError] = useState('');
  const [savedCircuits, setSavedCircuits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('onboard-saved-circuits') || '[]');
    } catch {
      return [];
    }
  });

  const handleSave = () => {
    const json = exportCircuit();
    const existing = savedCircuits.filter((s) => s.id !== circuit.id);
    const updated = [
      {
        id: circuit.id,
        name: circuit.name,
        savedAt: new Date().toISOString(),
        json,
      },
      ...existing,
    ].slice(0, 10);
    setSavedCircuits(updated);
    localStorage.setItem('onboard-saved-circuits', JSON.stringify(updated));
    setShowSavePanel(false);
  };

  const handleLoadFromText = () => {
    setLoadError('');
    try {
      const doc = JSON.parse(loadText);
      loadCircuit(doc);
      setShowLoadPanel(false);
      setLoadText('');
    } catch {
      setLoadError('Invalid circuit JSON. Paste a valid exported circuit document.');
    }
  };

  const handleLoadSaved = (json) => {
    try {
      const doc = JSON.parse(json);
      loadCircuit(doc);
      setShowLoadPanel(false);
    } catch {
      setLoadError('Failed to load saved circuit.');
    }
  };

  const handleComponentAdd = (componentTypeId) => {
    // Determine available drop position (cascade right)
    const existingOfType = circuit.instances.filter((i) => i.componentTypeId === componentTypeId);
    addComponent(componentTypeId, {
      x: 460 + existingOfType.length * 20,
      y: 180 + existingOfType.length * 60,
    });
  };

  const selectedInstance = circuit.instances.find((i) => i.id === selectedInstanceId);
  const selectedDef = selectedInstance
    ? SUPPORTED_COMPONENTS[selectedInstance.componentTypeId]
    : null;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 bg-[#FAF4E9] border-b border-[#CEC0AD] shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-['Barlow_Semi_Condensed'] text-sm font-bold text-[#18213D] truncate max-w-xs">
            {circuit.name}
          </span>
          <span
            className={`px-2 py-0.5 rounded-[4px] text-[10px] font-['Barlow_Semi_Condensed'] font-bold uppercase ${
              validationResult.valid
                ? 'bg-[#057A55]/10 text-[#057A55]'
                : 'bg-[#C0652D]/10 text-[#C0652D]'
            }`}
          >
            {validationResult.valid ? '✓ Valid' : `${validationResult.errors.length} Error(s)`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => newCircuit()}
            className="p-1.5 rounded-[6px] border border-[#CEC0AD] hover:bg-[#E3D8CA] text-[#5C6066] transition-colors"
            title="New Circuit"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="p-1.5 rounded-[6px] border border-[#CEC0AD] hover:bg-[#E3D8CA] text-[#5C6066] transition-colors"
            title="Save Circuit"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowLoadPanel(!showLoadPanel)}
            className="p-1.5 rounded-[6px] border border-[#CEC0AD] hover:bg-[#E3D8CA] text-[#5C6066] transition-colors"
            title="Load Circuit"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
          {onLaunchSim && (
            <button
              onClick={onLaunchSim}
              disabled={!validationResult.valid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-[#C0652D] text-white text-xs font-['Barlow_Semi_Condensed'] font-bold disabled:opacity-40 hover:bg-[#A85422] transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Run Simulation
            </button>
          )}
        </div>
      </div>

      {/* Guided Build Template Selector */}
      {!activeGuidedBuildId && (
        <div className="flex items-center gap-3 px-4 py-2 bg-[#2A56A3]/5 border-b border-[#2A56A3]/20 shrink-0 overflow-x-auto">
          <span className="text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#2A56A3] shrink-0">
            Guided Builds:
          </span>
          {Object.values(GUIDED_BUILDS).map((build) => (
            <button
              key={build.id}
              onClick={() => startGuidedBuild(build.id)}
              className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FAF4E9] border border-[#2A56A3]/30 text-xs font-['Barlow'] font-medium text-[#18213D] hover:border-[#2A56A3] hover:bg-[#EDF2FB] transition-colors"
            >
              <BookOpen className="w-3 h-3 text-[#2A56A3]" />
              {build.title}
            </button>
          ))}
        </div>
      )}

      {/* Main 3-Panel Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Palette */}
        <aside className="w-52 shrink-0 bg-[#FAF4E9] border-r border-[#CEC0AD] flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-[#CEC0AD]">
            <span className="text-[10px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
              Component Palette
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {Object.values(SUPPORTED_COMPONENTS)
              .filter((c) => c.id !== 'esp32-devkit-v1' && c.id !== 'breadboard-half')
              .map((def) => (
                <PaletteItem
                  key={def.id}
                  componentDef={def}
                  onAdd={() => handleComponentAdd(def.id)}
                />
              ))}
          </div>
        </aside>

        {/* Center Canvas */}
        <div
          className="flex-1 relative overflow-auto bg-[#F5EDD8]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #CEC0AD 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          onClick={() => clearSelection()}
        >
          {/* Circuit instances */}
          {circuit.instances.map((inst) => (
            <CanvasComponent
              key={inst.id}
              instance={inst}
              isSelected={selectedInstanceId === inst.id}
              onSelect={selectInstance}
              onDelete={removeComponent}
              onDragEnd={moveComponent}
            />
          ))}

          {/* Connection lines (SVG overlay) */}
          {circuit.connections.length > 0 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ minWidth: 1200, minHeight: 800 }}
            >
              {circuit.connections.map((conn) => {
                const fromInst = circuit.instances.find((i) => i.id === conn.from.instanceId);
                const toInst = circuit.instances.find((i) => i.id === conn.to.instanceId);
                if (!fromInst || !toInst) return null;
                const x1 = fromInst.position.x + 100;
                const y1 = fromInst.position.y + 30;
                const x2 = toInst.position.x + 10;
                const y2 = toInst.position.y + 30;
                const mx = (x1 + x2) / 2;
                return (
                  <g key={conn.id}>
                    <path
                      d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                      stroke={conn.color || '#2A56A3'}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="6,3"
                      opacity="0.7"
                    />
                    <circle cx={x1} cy={y1} r="3" fill={conn.color || '#2A56A3'} />
                    <circle cx={x2} cy={y2} r="3" fill={conn.color || '#2A56A3'} />
                  </g>
                );
              })}
            </svg>
          )}

          {/* Empty canvas hint */}
          {circuit.instances.length <= 2 && circuit.connections.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-2 opacity-40">
                <Grid className="w-12 h-12 text-[#CEC0AD] mx-auto" />
                <p className="font-['Barlow'] text-sm text-[#5C6066]">
                  Drag components onto the breadboard
                </p>
                <p className="font-['Barlow'] text-xs text-[#5C6066]">
                  or start a Guided Build above
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <aside className="w-64 shrink-0 bg-[#FAF4E9] border-l border-[#CEC0AD] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Guided Step Panel */}
            {activeGuidedBuildId && (
              <GuidedStepPanel
                buildId={activeGuidedBuildId}
                stepIndex={currentGuidedStep}
              />
            )}

            {/* Validation Panel */}
            <div>
              <div className="text-[10px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066] mb-2">
                Circuit Validation
              </div>

              {validationResult.valid && validationResult.warnings.length === 0 ? (
                <div className="p-3 rounded-[7px] bg-[#057A55]/10 border border-[#057A55]/20 flex items-center gap-2 text-xs font-['Barlow'] text-[#057A55]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Schema valid — ready for simulation
                </div>
              ) : null}

              {validationResult.errors.length > 0 && (
                <div className="space-y-1">
                  {validationResult.errors.map((err, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-[6px] bg-[#C0652D]/10 border border-[#C0652D]/20 text-xs font-['Barlow'] text-[#7C2D12] leading-relaxed flex items-start gap-2"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C0652D]" />
                      {err}
                    </div>
                  ))}
                </div>
              )}

              {validationResult.warnings.map((w, i) => (
                <div
                  key={i}
                  className="p-2 rounded-[6px] bg-[#D97706]/10 border border-[#D97706]/20 text-xs font-['Barlow'] text-[#78350F] leading-relaxed flex items-start gap-2 mt-1"
                >
                  <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#D97706]" />
                  {w}
                </div>
              ))}
            </div>

            {/* Selected Instance Info */}
            {selectedInstance && selectedDef && (
              <div>
                <div className="text-[10px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066] mb-2">
                  Selected: {selectedDef.label}
                </div>
                <div className="rounded-[7px] bg-[#F9F2E5] border border-[#CEC0AD] p-3 space-y-2">
                  <div className="text-xs font-['JetBrains_Mono'] text-[#5C6066]">
                    ID: {selectedInstance.id}
                  </div>
                  <div className="text-xs font-['Barlow'] text-[#4B505C]">
                    <strong>Terminals:</strong>
                  </div>
                  {selectedDef.terminals.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-[#5C6066]">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          t.electricalType === 'power'
                            ? 'bg-[#C0652D]'
                            : t.electricalType === 'ground'
                            ? 'bg-[#4B505C]'
                            : 'bg-[#2A56A3]'
                        }`}
                      />
                      {t.label}
                    </div>
                  ))}
                  {selectedDef.warnings && (
                    <div className="mt-2">
                      {selectedDef.warnings.map((w, i) => (
                        <div key={i} className="text-[10px] font-['Barlow'] text-[#C0652D] leading-tight">
                          ⚠ {w}
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedDef.category !== 'board' && selectedDef.category !== 'passive' && (
                    <button
                      onClick={() => removeComponent(selectedInstance.id)}
                      className="w-full flex items-center justify-center gap-1.5 mt-2 py-1.5 rounded-[6px] border border-red-200 text-red-600 text-xs font-['Barlow_Semi_Condensed'] font-bold hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Component
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Load panel (inline) */}
            {showLoadPanel && (
              <div className="space-y-2">
                <div className="text-[10px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                  Load Circuit
                </div>
                {savedCircuits.length > 0 && (
                  <div className="space-y-1">
                    {savedCircuits.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleLoadSaved(s.json)}
                        className="w-full text-left p-2 rounded-[6px] bg-[#F9F2E5] border border-[#CEC0AD] hover:border-[#2A56A3] text-xs font-['Barlow'] text-[#18213D] transition-colors"
                      >
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-[#5C6066]">{new Date(s.savedAt).toLocaleDateString()}</div>
                      </button>
                    ))}
                  </div>
                )}
                <textarea
                  value={loadText}
                  onChange={(e) => setLoadText(e.target.value)}
                  placeholder="Or paste exported circuit JSON..."
                  className="w-full h-24 text-[10px] font-['JetBrains_Mono'] bg-[#FAF4E9] border border-[#CEC0AD] rounded-[6px] p-2 resize-none focus:outline-hidden focus:border-[#2A56A3]"
                />
                {loadError && (
                  <p className="text-xs text-red-600 font-['Barlow']">{loadError}</p>
                )}
                <button
                  onClick={handleLoadFromText}
                  className="w-full py-1.5 rounded-[6px] bg-[#18213D] text-white text-xs font-['Barlow_Semi_Condensed'] font-bold hover:bg-[#2A56A3] transition-colors"
                >
                  Load from JSON
                </button>
              </div>
            )}

            {/* Circuit Info */}
            <div className="text-[10px] font-['JetBrains_Mono'] text-[#5C6066] space-y-1 pt-2 border-t border-[#CEC0AD]">
              <div>Instances: {circuit.instances.length}</div>
              <div>Connections: {circuit.connections.length}</div>
              <div>Schema v{circuit.schemaVersion}</div>
              <div className="text-[9px] italic mt-1 leading-tight">
                Deterministic educational simulation — not SPICE/electrical emulation
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
