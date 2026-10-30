/**
 * @file Boards.jsx
 * @description Board selection page — browse all supported microcontroller boards
 * with search/filter capabilities and board cards linking to detail pages.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Search, ArrowRight } from 'lucide-react';
import { boards } from '../data/boards';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

/**
 * Color map for board image placeholders based on board id.
 * @type {Record<string, string>}
 */
const BOARD_COLORS = {
  'esp32': 'bg-blue/10 text-blue',
  'arduino-uno': 'bg-orange/10 text-orange',
  'raspberry-pi-pico': 'bg-navy/10 text-navy',
};

/**
 * Boards page — displays all supported boards in a filterable grid.
 * @returns {JSX.Element}
 */
export default function Boards() {
  const [searchQuery, setSearchQuery] = useState('');

  /** Filter boards by name (case-insensitive). */
  const filteredBoards = useMemo(() => {
    if (!searchQuery.trim()) return boards;
    const q = searchQuery.toLowerCase();
    return boards.filter(
      (board) =>
        board.name.toLowerCase().includes(q) ||
        board.manufacturer.toLowerCase().includes(q) ||
        board.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      {/* Page header */}
      <SectionHeading
        title="Supported Boards"
        description="Explore our library of supported microcontroller boards. Each board comes with interactive pinout diagrams, starter projects, and full simulation support."
      />

      {/* Search / filter bar */}
      <div className="mt-10 mb-10">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            size={18}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search boards…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-surface font-body text-navy placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-blue/40 focus:border-blue transition-colors"
            aria-label="Search boards"
          />
        </div>
      </div>

      {/* Board grid */}
      {filteredBoards.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <Cpu size={48} className="mx-auto mb-4 text-text-subtle" />
          <p className="text-lg font-body">No boards match "{searchQuery}"</p>
          <p className="text-sm mt-1 text-text-subtle">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBoards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </main>
  );
}

/**
 * Individual board card with image placeholder, specs, and explore link.
 * @param {{ board: import('../data/boards').Board }} props
 * @returns {JSX.Element}
 */
function BoardCard({ board }) {
  const colorClass = BOARD_COLORS[board.id] || 'bg-surface-high text-navy';

  return (
    <Card className="flex flex-col">
      {/* Board image placeholder */}
      <div
        className={`flex items-center justify-center h-40 rounded-t-md ${colorClass}`}
      >
        <Cpu size={56} strokeWidth={1.2} />
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Name & manufacturer */}
        <div>
          <h3 className="font-display font-semibold text-lg text-navy">
            {board.name}
          </h3>
          <p className="text-sm text-text-muted font-body">{board.manufacturer}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary font-body leading-relaxed line-clamp-3">
          {board.description}
        </p>

        {/* Key specs */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {board.specs?.processor && (
            <Badge variant="muted">{board.specs.processor}</Badge>
          )}
          {board.specs?.gpio && (
            <Badge variant="muted">{board.specs.gpio} GPIO</Badge>
          )}
          {board.specs?.connectivity &&
            board.specs.connectivity.map((conn) => (
              <Badge key={conn} variant="muted">
                {conn}
              </Badge>
            ))}
        </div>

        {/* Explore link */}
        <Link to={`/boards/${board.id}`} className="mt-3">
          <Button variant="secondary" className="w-full group">
            Explore Board
            <ArrowRight
              size={16}
              className="ml-1.5 transition-transform group-hover:translate-x-0.5"
            />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
