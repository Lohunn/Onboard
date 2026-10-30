/**
 * @file BoardDetail.jsx
 * @description Detailed board page — shows specs, interactive pinout diagram,
 * supported components, and example projects for a specific board.
 */

import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Cpu,
  ChevronRight,
  Home,
  Info,
  Zap,
  Cable,
  ArrowRight,
  CircuitBoard,
  Box,
} from 'lucide-react';
import { boards } from '../data/boards';
import { components as allComponents } from '../data/components';
import { experiments } from '../data/experiments';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Board3DViewer from '../components/3d/Board3DViewer';

/**
 * Pin type to color mapping for the pinout diagram.
 * @type {Record<string, string>}
 */
const PIN_TYPE_COLORS = {
  power: '#C0652D',
  ground: '#4B505C',
  digital: '#2A56A3',
  analog: '#5B8C3E',
  pwm: '#8B5CF6',
  communication: '#0891B2',
  gpio: '#18213D',
};

/**
 * BoardDetail page — comprehensive view of a single microcontroller board.
 * Uses URL param :boardId to look up the board from data.
 * @returns {JSX.Element}
 */
export default function BoardDetail() {
  const { boardId } = useParams();
  const board = boards.find((b) => b.id === boardId);

  if (!board) {
    return <NotFound boardId={boardId} />;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb boardName={board.name} />

      {/* Hero */}
      <BoardHero board={board} />

      {/* Specs grid */}
      <SpecsGrid board={board} />

      {/* Interactive Pinout */}
      <PinoutSection board={board} />

      {/* Supported Components */}
      <SupportedComponents board={board} />

      {/* Example Projects */}
      <ExampleProjects board={board} />
    </main>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Sub-components                                            */
/* ────────────────────────────────────────────────────────── */

/**
 * Breadcrumb navigation: Home > Boards > Board Name.
 * @param {{ boardName: string }} props
 */
function Breadcrumb({ boardName }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm font-body text-text-muted mb-8"
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-navy transition-colors"
      >
        <Home size={14} />
        Home
      </Link>
      <ChevronRight size={14} className="text-text-subtle" />
      <Link to="/boards" className="hover:text-navy transition-colors">
        Boards
      </Link>
      <ChevronRight size={14} className="text-text-subtle" />
      <span className="text-navy font-medium">{boardName}</span>
    </nav>
  );
}

/**
 * Hero section with board name, manufacturer, and description.
 * @param {{ board: import('../data/boards').Board }} props
 */
function BoardHero({ board }) {
  return (
    <section className="flex flex-col lg:flex-row gap-8 mb-16 items-start">
      {/* 3D Interactive Board Model */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-navy">
            <Box size={14} className="text-blue" />
            Interactive 3D Board Model
          </span>
          <span className="text-[11px] font-mono text-text-muted">
            Drag to rotate • Scroll to zoom
          </span>
        </div>
        <Board3DViewer boardId={board.id} />
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-label text-text-muted mb-1">{board.manufacturer}</p>
        <h1 className="text-display text-navy mb-3">{board.name}</h1>
        <p className="text-lg text-text-secondary font-body leading-relaxed max-w-2xl">
          {board.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {Array.isArray(board.specs?.connectivity) ? (
            board.specs.connectivity.map((conn) => (
              <Badge key={conn} variant="primary">
                {conn}
              </Badge>
            ))
          ) : board.specs?.connectivity ? (
            <Badge variant="primary">{board.specs.connectivity}</Badge>
          ) : null}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Link
            to={`/lab?experiment=${board.supportedExperiments?.[0] || 'exp-01-blink'}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-navy text-surface font-['Barlow_Semi_Condensed'] font-bold text-sm hover:bg-blue transition-colors shadow-sm"
          >
            <span>Open in Virtual Lab</span>
            <ArrowRight size={14} />
          </Link>
          <a
            href="#pinout"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-surface-high text-navy font-['Barlow_Semi_Condensed'] font-semibold text-sm hover:bg-surface-highest transition-colors"
          >
            Jump to Pinout Map
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Grid displaying all technical specifications.
 * @param {{ board: import('../data/boards').Board }} props
 */
function SpecsGrid({ board }) {
  if (!board.specs) return null;

  /** Convert specs object to displayable key-value pairs. */
  const specEntries = useMemo(() => {
    const entries = [];
    const specs = board.specs;
    if (specs.processor) entries.push({ label: 'Processor', value: specs.processor });
    if (specs.clockSpeed) entries.push({ label: 'Clock Speed', value: specs.clockSpeed });
    if (specs.flash) entries.push({ label: 'Flash Memory', value: specs.flash });
    if (specs.sram) entries.push({ label: 'SRAM', value: specs.sram });
    if (specs.gpioCount) entries.push({ label: 'GPIO Pins', value: `${specs.gpioCount} pins` });
    if (specs.analogInPins) entries.push({ label: 'Analog Pins', value: `${specs.analogInPins} pins` });
    if (specs.pwmPins) entries.push({ label: 'PWM Pins', value: `${specs.pwmPins} pins` });
    if (specs.operatingVoltage) entries.push({ label: 'Operating Voltage', value: specs.operatingVoltage });
    if (specs.connectivity)
      entries.push({
        label: 'Connectivity',
        value: Array.isArray(specs.connectivity) ? specs.connectivity.join(', ') : specs.connectivity,
      });
    return entries;
  }, [board.specs]);

  return (
    <section className="mb-16">
      <h2 className="text-section-heading text-navy mb-6 flex items-center gap-2">
        <Info size={22} className="text-blue" />
        Technical Specifications
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specEntries.map(({ label, value }) => (
          <div
            key={label}
            className="px-5 py-4 rounded-md bg-surface border border-border"
          >
            <dt className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider mb-1">
              {label}
            </dt>
            <dd className="text-navy font-body font-medium">{value}</dd>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Interactive pinout diagram.
 * Shows an SVG board representation with clickable/hoverable pins.
 * Selected pin details appear in a side panel.
 * @param {{ board: import('../data/boards').Board }} props
 */
function PinoutSection({ board }) {
  const [selectedPin, setSelectedPin] = useState(null);

  const pins = board.pins || [];

  // Split pins into left and right columns for the diagram
  const mid = Math.ceil(pins.length / 2);
  const leftPins = pins.slice(0, mid);
  const rightPins = pins.slice(mid);

  const boardWidth = 180;
  const pinSpacing = 28;
  const pinWidth = 100;
  const svgPadding = 20;
  const maxRows = Math.max(leftPins.length, rightPins.length);
  const svgHeight = maxRows * pinSpacing + svgPadding * 2 + 20;
  const svgWidth = pinWidth + boardWidth + pinWidth + svgPadding * 2;

  const leftX = svgPadding;
  const boardX = svgPadding + pinWidth;
  const rightX = boardX + boardWidth;

  return (
    <section className="mb-16">
      <h2 className="text-section-heading text-navy mb-6 flex items-center gap-2">
        <CircuitBoard size={22} className="text-blue" />
        Interactive Pinout
      </h2>

      {pins.length === 0 ? (
        <p className="text-text-muted font-body">
          No pin data available for this board yet.
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SVG Diagram */}
          <div className="flex-1 overflow-x-auto rounded-lg border border-border bg-surface p-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full max-w-2xl mx-auto"
              role="img"
              aria-label={`${board.name} pinout diagram`}
            >
              {/* Board body */}
              <rect
                x={boardX}
                y={svgPadding}
                width={boardWidth}
                height={svgHeight - svgPadding * 2}
                rx={8}
                fill="#18213D"
                opacity={0.9}
              />
              <text
                x={boardX + boardWidth / 2}
                y={svgPadding + 24}
                textAnchor="middle"
                fill="#F6EDDD"
                fontSize="12"
                fontWeight="600"
                fontFamily="Barlow Semi Condensed, sans-serif"
              >
                {board.name}
              </text>

              {/* Left pins */}
              {leftPins.map((pin, i) => {
                const y = svgPadding + 48 + i * pinSpacing;
                const isSelected = selectedPin?.name === pin.name;
                const color =
                  PIN_TYPE_COLORS[pin.types?.[0]] || PIN_TYPE_COLORS.gpio;

                return (
                  <g
                    key={pin.name}
                    className="cursor-pointer"
                    onClick={() => setSelectedPin(isSelected ? null : pin)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Pin ${pin.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPin(isSelected ? null : pin);
                      }
                    }}
                  >
                    {/* Pin line */}
                    <line
                      x1={boardX}
                      y1={y}
                      x2={boardX - 20}
                      y2={y}
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    {/* Pin circle */}
                    <circle
                      cx={boardX - 20}
                      cy={y}
                      r={isSelected ? 5 : 4}
                      fill={color}
                      stroke={isSelected ? '#F6EDDD' : 'none'}
                      strokeWidth={2}
                    />
                    {/* Pin label */}
                    <text
                      x={boardX - 28}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                      fill={isSelected ? '#18213D' : '#4B505C'}
                      fontWeight={isSelected ? 700 : 400}
                    >
                      {pin.name}
                    </text>
                    {/* Hover highlight */}
                    <rect
                      x={leftX}
                      y={y - 10}
                      width={pinWidth + 20}
                      height={20}
                      fill="transparent"
                    />
                  </g>
                );
              })}

              {/* Right pins */}
              {rightPins.map((pin, i) => {
                const y = svgPadding + 48 + i * pinSpacing;
                const isSelected = selectedPin?.name === pin.name;
                const color =
                  PIN_TYPE_COLORS[pin.types?.[0]] || PIN_TYPE_COLORS.gpio;

                return (
                  <g
                    key={pin.name}
                    className="cursor-pointer"
                    onClick={() => setSelectedPin(isSelected ? null : pin)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Pin ${pin.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPin(isSelected ? null : pin);
                      }
                    }}
                  >
                    {/* Pin line */}
                    <line
                      x1={rightX}
                      y1={y}
                      x2={rightX + 20}
                      y2={y}
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    {/* Pin circle */}
                    <circle
                      cx={rightX + 20}
                      cy={y}
                      r={isSelected ? 5 : 4}
                      fill={color}
                      stroke={isSelected ? '#F6EDDD' : 'none'}
                      strokeWidth={2}
                    />
                    {/* Pin label */}
                    <text
                      x={rightX + 28}
                      y={y + 4}
                      textAnchor="start"
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                      fill={isSelected ? '#18213D' : '#4B505C'}
                      fontWeight={isSelected ? 700 : 400}
                    >
                      {pin.name}
                    </text>
                    <rect
                      x={rightX}
                      y={y - 10}
                      width={pinWidth + 20}
                      height={20}
                      fill="transparent"
                    />
                  </g>
                );
              })}

              {/* Pin type legend */}
              {Object.entries(PIN_TYPE_COLORS).map(([type, color], i) => (
                <g key={type}>
                  <circle
                    cx={svgPadding + i * 90}
                    cy={svgHeight - 10}
                    r={4}
                    fill={color}
                  />
                  <text
                    x={svgPadding + i * 90 + 8}
                    y={svgHeight - 6}
                    fontSize="9"
                    fontFamily="Barlow, sans-serif"
                    fill="#5C6066"
                    className="capitalize"
                  >
                    {type}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Pin detail panel */}
          <div className="lg:w-72 shrink-0">
            {selectedPin ? (
              <PinDetailPanel pin={selectedPin} />
            ) : (
              <div className="rounded-md border border-border bg-surface-low p-5 text-center">
                <Zap size={28} className="mx-auto text-text-subtle mb-3" />
                <p className="text-sm text-text-muted font-body">
                  Click a pin on the diagram to view its details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Side panel showing details for a selected pin.
 * @param {{ pin: object }} props
 */
function PinDetailPanel({ pin }) {
  return (
    <div className="rounded-md border border-border bg-surface p-5">
      <h3 className="font-mono font-bold text-lg text-navy mb-3">{pin.name}</h3>

      {pin.description && (
        <p className="text-sm text-text-secondary font-body mb-4">
          {pin.description}
        </p>
      )}

      {pin.types && pin.types.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Types
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pin.types.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-xs"
                style={{
                  backgroundColor: `${PIN_TYPE_COLORS[type] || '#18213D'}15`,
                  color: PIN_TYPE_COLORS[type] || '#18213D',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: PIN_TYPE_COLORS[type] || '#18213D' }}
                />
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {pin.notes && (
        <div>
          <p className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Notes
          </p>
          <p className="text-sm text-text-secondary font-body">{pin.notes}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Components that work with this board.
 * @param {{ board: import('../data/boards').Board }} props
 */
function SupportedComponents({ board }) {
  const supported = useMemo(() => {
    if (!board.supportedComponents || board.supportedComponents.length === 0)
      return allComponents;
    return allComponents.filter((c) =>
      board.supportedComponents.includes(c.id)
    );
  }, [board.supportedComponents]);

  if (supported.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-section-heading text-navy mb-6 flex items-center gap-2">
        <Cable size={22} className="text-blue" />
        Supported Components
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {supported.slice(0, 9).map((comp) => (
          <div
            key={comp.id}
            className="flex items-center gap-3 px-4 py-3 rounded-md bg-surface border border-border"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-sm bg-surface-high text-navy">
              <Cpu size={18} />
            </div>
            <div>
              <p className="text-sm font-display font-semibold text-navy">
                {comp.name}
              </p>
              <p className="text-xs text-text-muted font-body">{comp.category}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Example experiments/projects for this board.
 * @param {{ board: import('../data/boards').Board }} props
 */
function ExampleProjects({ board }) {
  const boardExperiments = useMemo(
    () => experiments.filter((exp) => exp.boardId === board.id),
    [board.id]
  );

  if (boardExperiments.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-section-heading text-navy mb-6 flex items-center gap-2">
        <Zap size={22} className="text-orange" />
        Example Projects
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {boardExperiments.map((exp) => (
          <Card key={exp.id} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <h3 className="font-display font-semibold text-navy">
                {exp.title}
              </h3>
              <Badge
                variant={
                  exp.difficulty === 'beginner'
                    ? 'success'
                    : exp.difficulty === 'intermediate'
                      ? 'warning'
                      : 'danger'
                }
              >
                {exp.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-text-secondary font-body line-clamp-2">
              {exp.description}
            </p>
            <Link to={`/lab?experiment=${exp.id}`} className="mt-auto">
              <Button variant="secondary" className="w-full group text-sm">
                Open in Virtual Lab
                <ArrowRight
                  size={14}
                  className="ml-1 transition-transform group-hover:translate-x-0.5"
                />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

/**
 * 404-style fallback when boardId is not found.
 * @param {{ boardId: string }} props
 */
function NotFound({ boardId }) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-24 text-center">
      <Cpu size={64} className="mx-auto mb-6 text-text-subtle" />
      <h1 className="text-display text-navy mb-3">Board Not Found</h1>
      <p className="text-lg text-text-muted font-body mb-8">
        We couldn't find a board with the ID "{boardId}".
      </p>
      <Link to="/boards">
        <Button variant="primary">Browse All Boards</Button>
      </Link>
    </main>
  );
}
