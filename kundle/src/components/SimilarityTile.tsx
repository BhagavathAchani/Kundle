import { useEffect, useId, useRef, useState } from 'react';
import type { SimilarityResult } from '../types';

interface SimilarityTileProps {
  tile: SimilarityResult;
  index: number;
}

export function SimilarityTile({ tile, index }: SimilarityTileProps) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailsId = useId();

  useEffect(() => {
    if (!expanded) return;
    function dismissOutside(event: Event) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('focusin', dismissOutside);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('focusin', dismissOutside);
    };
  }, [expanded]);

  return (
    <div
      ref={containerRef}
      className={`tile-slot${expanded ? ' tile-slot--expanded' : ''}`}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setExpanded(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch') setExpanded(false);
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(':focus-visible')) setExpanded(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
      }}
      role="group"
      aria-label={`Similarity ${tile.guessDisplay}: details`}
      aria-describedby={expanded ? detailsId : undefined}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setExpanded(false);
      }}
    >
      <div className="tile-slot__flipper" style={{ animationDelay: `${index * 500}ms` }}>
        <div className="tile-slot__face tile-slot__face--front" />
        <div className={`tile-slot__face tile-slot__face--back tile tile--${tile.status}`}>
          <span className="tile__label">Similarity</span>
          <span className="tile__value">{tile.guessDisplay}</span>
        </div>
      </div>
      {expanded && (
        <div id={detailsId} role="tooltip" className="similarity-detail">
          <ul>
            {tile.breakdown.map((item) => (
              <li key={item.label}>
                <span>{item.matched ? '✓' : '✕'} {item.label}</span>
                <span>+{item.points}</span>
              </li>
            ))}
          </ul>
          <div className="similarity-detail__total">
            Similarity: {tile.score}/{tile.maxScore}
          </div>
        </div>
      )}
    </div>
  );
}

