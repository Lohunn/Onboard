import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from '@xyflow/react';
import {
  Play,
  Square,
  RotateCcw,
  Cpu,
  Layers,
  Terminal,
  Lightbulb,
  Search,
  Plus,
  Trash2,
  Box,
  Monitor,
  Sparkles,
} from 'lucide-react';

import { boards } from '../data/boards';
import { components } from '../data/components';
import { experiments } from '../data/experiments';
import Board3DViewer from '../components/3d/Board3DViewer';

// Photorealistic Microcontroller Node using @wokwi/elements
function WokwiBoardNode({ data }) {
  const boardId = data.boardId || 'esp32-devkit-v1';

  return (
    <div className="relative p-2 rounded-[9px] bg-[#18213D]/90 border-2 border-[#2A56A3] shadow-xl backdrop-blur-xs">
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#34436A] text-[10px] font-['JetBrains_Mono'] text-[#FAF4E9]">
        <span className="font-bold">{data.name}</span>
        <span className="text-[#AAA59D]">{data.voltage}</span>
      </div>

      <div className="relative flex justify-center items-center py-2">
        {boardId.includes('esp32') ? (
          <wokwi-esp32-devkit-v1 />
        ) : boardId.includes('uno') ? (
          <wokwi-arduino-uno />
        ) : (
          <wokwi-pi-pico />
        )}

        {/* Pin Handles positioned along edges */}
        <Handle
          type="source"
          position={Position.Left}
          id="vcc"
          style={{ top: '35%', background: '#E02424', width: 10, height: 10 }}
          title="3.3V / 5V VCC"
        />
        <Handle
          type="source"
          position={Position.Left}
          id="gnd"
          style={{ top: '65%', background: '#18213D', border: '1px solid #FAF4E9', width: 10, height: 10 }}
          title="GND Ground"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="gpio2"
          style={{ top: '35%', background: '#2A56A3', width: 10, height: 10 }}
          title="GPIO 2 (Digital Out)"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="gpio4"
          style={{ top: '50%', background: '#057A55', width: 10, height: 10 }}
          title="GPIO 4 (Digital In)"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="adc"
          style={{ top: '65%', background: '#D97706', width: 10, height: 10 }}
          title="ADC Analog In"
        />
      </div>

      <div className="flex justify-between text-[9px] font-['JetBrains_Mono'] text-[#AAA59D] pt-1 border-t border-[#34436A]/60">
        <span>◀ Power & GND</span>
        <span>GPIO & Peripherals ▶</span>
      </div>
    </div>
  );
}

// Photorealistic Component Node using @wokwi/elements
function WokwiComponentNode({ data }) {
  const compId = data.compId || 'led-red';

  return (
    <div className="relative p-2.5 rounded-[9px] bg-[#FAF4E9] border-2 border-[#CEC0AD] shadow-md flex flex-col items-center">
      <div className="text-[10px] font-['Barlow_Semi_Condensed'] font-bold text-[#18213D] mb-1">
        {data.name}
      </div>

      <div className="relative my-1 flex items-center justify-center min-w-[70px] min-h-[50px]">
        {compId.includes('led') ? (
          <wokwi-led color={data.color || 'red'} value={data.value ? 'true' : ''} />
        ) : compId.includes('resistor') ? (
          <wokwi-resistor value="220" />
        ) : compId.includes('button') ? (
          <wokwi-pushbutton color="red" />
        ) : compId.includes('potentiometer') ? (
          <wokwi-potentiometer />
        ) : compId.includes('ultrasonic') ? (
          <wokwi-hc-sr04 />
        ) : compId.includes('oled') ? (
          <wokwi-ssd1306 />
        ) : (
          <div className="w-8 h-8 rounded bg-[#C0652D]" />
        )}

        {/* Pin Connection Handles */}
        <Handle
          type="target"
          position={Position.Left}
          id="pin1"
          style={{ top: '50%', background: '#2A56A3', width: 9, height: 9 }}
          title="Terminal 1"
        />
        <Handle
          type="target"
          position={Position.Right}
          id="pin2"
          style={{ top: '50%', background: '#18213D', width: 9, height: 9 }}
          title="Terminal 2"
        />
      </div>

      <div className="text-[9px] font-['JetBrains_Mono'] text-[#5C6066]">
        {data.value ? '⚡ Active' : 'Idle'}
      </div>
    </div>
  );
}

export default function VirtualLab() {
  const [searchParams] = useSearchParams();
  const initialExpId = searchParams.get('experiment') || 'exp-01-blink';

  const [currentExp, setCurrentExp] = useState(
    () => experiments.find((e) => e.id === initialExpId) || experiments[0]
  );

  const [selectedBoardId, setSelectedBoardId] = useState(
    currentExp ? currentExp.boardId : 'esp32-devkit-v1'
  );

  const selectedBoard = useMemo(
    () => boards.find((b) => b.id === selectedBoardId) || boards[0],
    [selectedBoardId]
  );

  const [code, setCode] = useState(currentExp.starterCode);
  const [activeTab, setActiveTab] = useState('explain'); // 'code' | 'explain' | 'serial'
  const [canvasMode, setCanvasMode] = useState('canvas'); // 'canvas' | '3d'
  const [componentSearch, setComponentSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Simulation State
  const [simState, setSimState] = useState('stopped');
  const [simLedState, setSimLedState] = useState(false);
  const [serialLogs, setSerialLogs] = useState([]);
  const [selectedExplainItem, setSelectedExplainItem] = useState(null);

  // Setup Initial Nodes with photorealistic hardware
  const initialNodes = useMemo(() => {
    return [
      {
        id: 'board-node',
        type: 'wokwiBoard',
        position: { x: 40, y: 50 },
        data: {
          boardId: selectedBoard.id,
          name: selectedBoard.name,
          voltage: selectedBoard.specs.operatingVoltage,
        },
      },
      {
        id: 'component-node-1',
        type: 'wokwiComponent',
        position: { x: 400, y: 60 },
        data: {
          compId: 'led-red',
          name: 'Red LED (5mm)',
          color: 'red',
          value: false,
        },
      },
      {
        id: 'component-node-2',
        type: 'wokwiComponent',
        position: { x: 400, y: 220 },
        data: {
          compId: 'resistor-220',
          name: '220Ω Resistor',
          value: false,
        },
      },
    ];
  }, [selectedBoard]);

  const initialEdges = useMemo(() => {
    return [
      {
        id: 'e1',
        source: 'board-node',
        sourceHandle: 'gpio2',
        target: 'component-node-1',
        targetHandle: 'pin1',
        animated: true,
        style: { stroke: '#2A56A3', strokeWidth: 2 },
      },
      {
        id: 'e2',
        source: 'component-node-1',
        sourceHandle: 'pin2',
        target: 'component-node-2',
        targetHandle: 'pin1',
        style: { stroke: '#C0652D', strokeWidth: 2 },
      },
      {
        id: 'e3',
        source: 'component-node-2',
        sourceHandle: 'pin2',
        target: 'board-node',
        targetHandle: 'gnd',
        style: { stroke: '#18213D', strokeWidth: 2 },
      },
    ];
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(
    () => ({
      wokwiBoard: WokwiBoardNode,
      wokwiComponent: WokwiComponentNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#2A56A3' } }, eds)),
    [setEdges]
  );

  // Sync node definitions when board switches
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === 'board-node') {
          return {
            ...n,
            data: {
              ...n.data,
              boardId: selectedBoard.id,
              name: selectedBoard.name,
              voltage: selectedBoard.specs.operatingVoltage,
            },
          };
        }
        return n;
      })
    );
  }, [selectedBoard, setNodes]);

  // Load experiment handler
  const loadExperiment = (exp) => {
    setCurrentExp(exp);
    setSelectedBoardId(exp.boardId);
    setCode(exp.starterCode);
    setSimState('stopped');
    setSimLedState(false);
    setSerialLogs([`[LAB READY]: Loaded ${exp.title}. Click RUN to start simulation.`]);
  };

  // Simulation Loop
  useEffect(() => {
    let interval = null;
    if (simState === 'running') {
      let tick = 0;
      interval = setInterval(() => {
        tick++;
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);

        if (currentExp.id === 'exp-01-blink') {
          const isHigh = tick % 2 === 1;
          setSimLedState(isHigh);
          // Update LED node visual state
          setNodes((nds) =>
            nds.map((n) => {
              if (n.id === 'component-node-1') {
                return { ...n, data: { ...n.data, value: isHigh } };
              }
              return n;
            })
          );
          setSerialLogs((prev) => [
            `[${timestamp}] GPIO 2: ${isHigh ? 'HIGH (3.3V) -> LED ON' : 'LOW (0V) -> LED OFF'}`,
            ...prev.slice(0, 40),
          ]);
        } else if (currentExp.id === 'exp-03-potentiometer') {
          const simulatedAdc = Math.floor(1000 + Math.sin(tick * 0.3) * 800 + Math.random() * 50);
          const volts = ((simulatedAdc / 4095.0) * 3.3).toFixed(2);
          setSerialLogs((prev) => [
            `[${timestamp}] ADC Raw: ${simulatedAdc} | Voltage: ${volts}V`,
            ...prev.slice(0, 40),
          ]);
        } else {
          setSerialLogs((prev) => [`[${timestamp}] Firmware cycle #${tick} ok`, ...prev.slice(0, 40)]);
        }
      }, 1000);
    } else {
      setSimLedState(false);
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === 'component-node-1') {
            return { ...n, data: { ...n.data, value: false } };
          }
          return n;
        })
      );
    }
    return () => clearInterval(interval);
  }, [simState, currentExp, setNodes]);

  // Filtered components
  const filteredComponents = useMemo(() => {
    return components.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(componentSearch.toLowerCase());
      const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [componentSearch, selectedCategory]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F6EDDD] text-[#18213D] overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 bg-[#FAF4E9] border-b border-[#CEC0AD] px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-[6px] bg-[#18213D] flex items-center justify-center text-[#F6EDDD]">
              <Cpu className="w-4 h-4 text-[#FAF4E9]" />
            </div>
            <span className="font-['Barlow_Semi_Condensed'] text-lg font-bold tracking-tight text-[#18213D]">
              ONBOARD LAB
            </span>
          </Link>

          <div className="h-5 w-px bg-[#CEC0AD]" />

          {/* Experiment Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#5C6066] uppercase">
              Project:
            </span>
            <select
              value={currentExp.id}
              onChange={(e) => {
                const found = experiments.find((x) => x.id === e.target.value);
                if (found) loadExperiment(found);
              }}
              className="text-xs font-['Barlow'] font-semibold bg-[#E3D8CA] border border-[#CEC0AD] rounded-[5px] px-2.5 py-1 text-[#18213D] outline-none"
            >
              {experiments.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Simulator Controls */}
        <div className="flex items-center gap-2">
          {simState === 'stopped' ? (
            <button
              onClick={() => {
                setSimState('running');
                setSerialLogs((prev) => ['[SIMULATOR]: Firmware execution started at 240MHz...', ...prev]);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] bg-[#057A55] hover:bg-[#046c4e] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-xs shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN SIMULATION</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSimState('stopped');
                setSerialLogs((prev) => ['[SIMULATOR]: Simulation stopped.', ...prev]);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] bg-[#E02424] hover:bg-[#c81e1e] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-xs shadow-xs transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>STOP</span>
            </button>
          )}

          <button
            onClick={() => {
              setSimState('stopped');
              setSerialLogs(['[SIMULATOR]: Hardware reset executed.']);
            }}
            className="p-1.5 rounded-[6px] bg-[#E3D8CA] hover:bg-[#D6C7B3] text-[#18213D] text-xs font-semibold"
            title="Reset Board"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 pl-3">
            <span
              className={`w-2 h-2 rounded-full ${
                simState === 'running' ? 'bg-[#057A55] animate-ping' : 'bg-[#AAA59D]'
              }`}
            />
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#5C6066] uppercase">
              {simState === 'running' ? 'Running' : 'Halted'}
            </span>
          </div>
        </div>

        {/* Right side: View mode toggle & Exit */}
        <div className="flex items-center gap-2">
          {/* Canvas View Mode Toggle */}
          <div className="flex items-center bg-[#E3D8CA] rounded-[6px] p-0.5 border border-[#CEC0AD]">
            <button
              onClick={() => setCanvasMode('canvas')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-xs font-['Barlow_Semi_Condensed'] font-bold transition-colors ${
                canvasMode === 'canvas' ? 'bg-[#18213D] text-[#FAF4E9]' : 'text-[#4B505C] hover:text-[#18213D]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Realistic Canvas</span>
            </button>
            <button
              onClick={() => setCanvasMode('3d')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-xs font-['Barlow_Semi_Condensed'] font-bold transition-colors ${
                canvasMode === '3d' ? 'bg-[#18213D] text-[#FAF4E9]' : 'text-[#4B505C] hover:text-[#18213D]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Orbit Model</span>
            </button>
          </div>

          <Link
            to="/"
            className="text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#5C6066] hover:text-[#18213D] ml-2"
          >
            Exit Lab
          </Link>
        </div>
      </header>

      {/* 3-Panel Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Board & Components */}
        <div className="w-72 bg-[#FAF4E9] border-r border-[#CEC0AD] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#CEC0AD]">
            <label className="text-[10px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066] block mb-1">
              Microcontroller Model
            </label>
            <select
              value={selectedBoardId}
              onChange={(e) => setSelectedBoardId(e.target.value)}
              className="w-full text-xs font-['Barlow'] font-semibold bg-[#E3D8CA] border border-[#CEC0AD] rounded-[5px] p-2 text-[#18213D] outline-none"
            >
              {boards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.specs.operatingVoltage})
                </option>
              ))}
            </select>
          </div>

          {/* Component Search & Filter */}
          <div className="p-3 border-b border-[#CEC0AD] space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#5C6066]" />
              <input
                type="text"
                placeholder="Search components..."
                value={componentSearch}
                onChange={(e) => setComponentSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F9F2E5] border border-[#CEC0AD] rounded-[5px] outline-none placeholder-[#AAA59D]"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-['Barlow_Semi_Condensed']">
              {['all', 'output', 'input', 'sensor', 'display'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded-[4px] capitalize whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#18213D] text-[#FAF4E9] font-bold'
                      : 'bg-[#E3D8CA] text-[#4B505C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Component Tray List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="text-[10px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066] mb-1">
              Hardware Tray ({filteredComponents.length})
            </div>

            {filteredComponents.map((comp) => (
              <div
                key={comp.id}
                className="p-2 rounded-[7px] bg-[#F9F2E5] border border-[#CEC0AD] hover:border-[#2A56A3] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-['Barlow_Semi_Condensed'] text-xs font-bold text-[#18213D]">
                    {comp.name}
                  </div>
                  <div className="text-[10px] font-['Barlow'] text-[#5C6066]">
                    {comp.category} • {comp.pins.length} pins
                  </div>
                </div>

                <button
                  onClick={() => {
                    const newNode = {
                      id: `comp-${Date.now()}`,
                      type: 'wokwiComponent',
                      position: { x: 350 + Math.random() * 80, y: 120 + Math.random() * 80 },
                      data: {
                        compId: comp.id,
                        name: comp.shortName,
                        color: comp.color || 'red',
                        value: false,
                      },
                    };
                    setNodes((nds) => [...nds, newNode]);
                  }}
                  className="p-1.5 rounded-[5px] bg-[#E3D8CA] group-hover:bg-[#18213D] group-hover:text-[#FAF4E9] text-[#18213D] transition-colors"
                  title="Add to breadboard"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#E3D8CA] border-t border-[#CEC0AD] text-[11px] font-['JetBrains_Mono'] space-y-0.5">
            <div className="flex justify-between">
              <span className="text-[#5C6066]">Arch:</span>
              <span className="font-semibold text-[#18213D]">{selectedBoard.architecture}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C6066]">Clock:</span>
              <span className="font-semibold text-[#18213D]">{selectedBoard.specs.clockSpeed}</span>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Circuit Canvas OR 3D Orbit Model */}
        <div className="flex-1 relative bg-[#F6EDDD] overflow-hidden">
          {canvasMode === 'canvas' ? (
            <div className="w-full h-full relative">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#FAF4E9]/90 backdrop-blur-xs p-1.5 rounded-[7px] border border-[#CEC0AD] shadow-xs">
                <span className="text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#18213D] px-2">
                  Photorealistic Hardware Circuit
                </span>
                <div className="h-4 w-px bg-[#CEC0AD]" />
                <button
                  onClick={() => {
                    setNodes([
                      {
                        id: 'board-node',
                        type: 'wokwiBoard',
                        position: { x: 40, y: 50 },
                        data: {
                          boardId: selectedBoard.id,
                          name: selectedBoard.name,
                          voltage: selectedBoard.specs.operatingVoltage,
                        },
                      },
                    ]);
                    setEdges([]);
                  }}
                  className="p-1 rounded text-[#5C6066] hover:text-[#E02424] hover:bg-[#E3D8CA]"
                  title="Clear Components"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ReactFlow with Photorealistic Hardware Components */}
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
              >
                <Background color="#CEC0AD" gap={20} size={1} />
                <Controls position="bottom-left" />
              </ReactFlow>
            </div>
          ) : (
            /* 3D ORBIT MODEL VIEW */
            <div className="w-full h-full p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-[#2A56A3]" />
                  <span className="font-['Barlow_Semi_Condensed'] text-sm font-bold text-[#18213D]">
                    Three.js Interactive 3D Model: {selectedBoard.name}
                  </span>
                </div>
                <button
                  onClick={() => setCanvasMode('canvas')}
                  className="text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#2A56A3] hover:underline"
                >
                  Switch back to 2D Canvas →
                </button>
              </div>

              <div className="flex-1 w-full min-h-[350px]">
                <Board3DViewer
                  boardId={selectedBoard.id}
                  isSimulating={simState === 'running'}
                  ledState={simLedState}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Code, Explain & Serial Tabs */}
        <div className="w-[420px] bg-[#FAF4E9] border-l border-[#CEC0AD] flex flex-col shrink-0">
          <div className="flex border-b border-[#CEC0AD] bg-[#E3D8CA]">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-2 text-xs font-['Barlow_Semi_Condensed'] font-bold tracking-wider uppercase transition-colors ${
                activeTab === 'code'
                  ? 'bg-[#FAF4E9] text-[#18213D] border-b-2 border-[#2A56A3]'
                  : 'text-[#5C6066] hover:text-[#18213D]'
              }`}
            >
              Firmware
            </button>
            <button
              onClick={() => setActiveTab('explain')}
              className={`flex-1 py-2 text-xs font-['Barlow_Semi_Condensed'] font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'explain'
                  ? 'bg-[#FAF4E9] text-[#2A56A3] border-b-2 border-[#2A56A3]'
                  : 'text-[#5C6066] hover:text-[#18213D]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Explain Mode
            </button>
            <button
              onClick={() => setActiveTab('serial')}
              className={`flex-1 py-2 text-xs font-['Barlow_Semi_Condensed'] font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'serial'
                  ? 'bg-[#FAF4E9] text-[#18213D] border-b-2 border-[#2A56A3]'
                  : 'text-[#5C6066] hover:text-[#18213D]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Serial
            </button>
          </div>

          {/* TAB 1: Monaco Code Editor */}
          {activeTab === 'code' && (
            <div className="flex-1 flex flex-col">
              <div className="p-2 bg-[#FAF4E9] border-b border-[#CEC0AD] flex justify-between items-center text-xs">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#5C6066]">
                  sketch.ino (C++ / Arduino)
                </span>
                <span className="text-[10px] text-[#2A56A3] font-semibold">
                  Board: {selectedBoard.shortName}
                </span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage="cpp"
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono',
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Explain Mode */}
          {activeTab === 'explain' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3 rounded-[7px] bg-[#E3D8CA] border border-[#CEC0AD]">
                <div className="flex items-center gap-2 text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#2A56A3] mb-1">
                  <Lightbulb className="w-4 h-4 text-[#C0652D]" />
                  Circuit Physical Behavior
                </div>
                <p className="font-['Barlow'] text-xs text-[#4B505C] leading-relaxed">
                  {currentExp.expectedResult}
                </p>
              </div>

              {/* Interactive Code Line Breakdown */}
              <div className="space-y-2">
                <h4 className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#18213D]">
                  Interactive Code Line Inspector
                </h4>
                {currentExp.explainMap &&
                  Object.entries(currentExp.explainMap).map(([stmt, info], i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedExplainItem(stmt)}
                      className={`p-3 rounded-[7px] border cursor-pointer transition-all ${
                        selectedExplainItem === stmt
                          ? 'bg-[#FAF4E9] border-[#2A56A3] shadow-xs'
                          : 'bg-[#F9F2E5] border-[#CEC0AD] hover:border-[#2A56A3]'
                      }`}
                    >
                      <div className="font-['JetBrains_Mono'] text-xs font-bold text-[#18213D] mb-1">
                        <code>{stmt}</code>
                      </div>
                      <div className="text-[11px] font-['Barlow_Semi_Condensed'] font-bold text-[#2A56A3] uppercase mb-0.5">
                        {info.concept}
                      </div>
                      <p className="font-['Barlow'] text-xs text-[#4B505C] leading-snug">
                        {info.text}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Challenge Box */}
              {currentExp.challenge && (
                <div className="p-3 rounded-[7px] bg-[#18213D] text-[#FAF4E9] border border-[#34436A] space-y-1">
                  <div className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#C0652D]">
                    Challenge: {currentExp.challenge.title}
                  </div>
                  <p className="font-['Barlow'] text-xs text-[#AAA59D]">
                    {currentExp.challenge.description}
                  </p>
                  <div className="text-[11px] font-['Barlow'] text-[#F6EDDD] italic pt-1">
                    💡 Hint: {currentExp.challenge.hint}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Serial Monitor */}
          {activeTab === 'serial' && (
            <div className="flex-1 flex flex-col bg-[#18213D] text-[#FAF4E9] p-3 font-['JetBrains_Mono'] text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#34436A] text-[11px] text-[#AAA59D]">
                <span>Baud Rate: 115200 bps</span>
                <button
                  onClick={() => setSerialLogs([])}
                  className="px-2 py-0.5 rounded bg-[#283656] text-[#FAF4E9] hover:bg-[#34436A]"
                >
                  Clear Console
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 font-['JetBrains_Mono'] text-xs text-[#057A55]">
                {serialLogs.length === 0 ? (
                  <div className="text-[#AAA59D] italic">No serial events received. Press Run.</div>
                ) : (
                  serialLogs.map((log, i) => (
                    <div key={i} className="text-[#F6EDDD]">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
