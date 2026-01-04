'use client';

import React, { useCallback } from 'react';
import { BlockPiece } from '@/types/game';

interface PieceSelectorProps {
  pieces: BlockPiece[];
  onPieceSelect: (piece: BlockPiece) => void;
  draggedPiece: BlockPiece | null;
  setDraggedPiece: (piece: BlockPiece | null) => void;
}

const CELL_SIZE = 30;

export default function PieceSelector({ 
  pieces, 
  onPieceSelect,
  draggedPiece,
  setDraggedPiece 
}: PieceSelectorProps) {

  const handleMouseDown = useCallback((piece: BlockPiece) => {
    console.log('🎯 Piece grabbed:', piece.id);
    setDraggedPiece(piece);
  }, [setDraggedPiece]);

  const handleDragStart = useCallback((e: React.DragEvent, piece: BlockPiece) => {
    console.log('🚀 Drag started:', piece.id);
    setDraggedPiece(piece);
    
    // Set a minimal transparent drag image
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1, 1);
    }
    e.dataTransfer.setDragImage(canvas, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
  }, [setDraggedPiece]);

  const handleDragEnd = useCallback(() => {
    console.log('🏁 Drag ended');
    // Don't clear draggedPiece here - let the drop handler do it
  }, []);

  const renderPiece = (piece: BlockPiece) => {
    const minRow = Math.min(...piece.shape.map((c) => c.row));
    const maxRow = Math.max(...piece.shape.map((c) => c.row));
    const minCol = Math.min(...piece.shape.map((c) => c.col));
    const maxCol = Math.max(...piece.shape.map((c) => c.col));

    const rows = maxRow - minRow + 1;
    const cols = maxCol - minCol + 1;

    const normalizedShape = piece.shape.map((cell) => ({
      row: cell.row - minRow,
      col: cell.col - minCol,
    }));

    const isBeingDragged = draggedPiece?.id === piece.id;

    return (
      <div
        key={piece.id}
        draggable={true}
        onMouseDown={() => handleMouseDown(piece)}
        onDragStart={(e) => handleDragStart(e, piece)}
        onDragEnd={handleDragEnd}
        className={`
          inline-block cursor-grab active:cursor-grabbing 
          hover:scale-110 active:scale-95 transition-all
          p-3 bg-gradient-to-br from-gray-50 to-gray-100 
          rounded-xl border-2 border-gray-300 
          hover:border-blue-400 hover:shadow-lg
          ${isBeingDragged ? 'opacity-50 scale-90' : ''}
        `}
        onClick={() => onPieceSelect(piece)}
      >
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
          }}
        >
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => {
              const hasCell = normalizedShape.some(
                (cell) => cell.row === row && cell.col === col
              );
              return (
                <div
                  key={`${row}-${col}`}
                  className={`border ${hasCell ? 'border-gray-400' : 'border-transparent'} rounded-sm`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: hasCell ? piece.color : 'transparent',
                    opacity: hasCell ? 0.95 : 0,
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span>사용 가능한 조각</span>
        <span className="text-sm font-normal text-blue-600">({pieces.length}개)</span>
      </h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-2 min-w-max">
          {pieces.length > 0 ? (
            pieces.map((piece) => renderPiece(piece))
          ) : (
            <div className="text-gray-500 py-8 text-center w-full">
              🎉 모든 조각을 사용했습니다!
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600 text-center bg-blue-50 py-2 rounded-lg border border-blue-200">
        💡 <strong>조작 방법:</strong> 조각을 드래그해서 <span className="text-amber-600 font-semibold">노란색 영역</span>에만 놓을 수 있습니다
      </div>
    </div>
  );
}
