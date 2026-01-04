'use client';

import React, { useState, useRef, useCallback } from 'react';
import { BlockPattern, BlockPiece, Position } from '@/types/game';
import { useDrag } from '@/app/page';

interface GameBoardProps {
  pattern: BlockPattern;
  placedPieces: Map<string, BlockPiece>;
  onPieceDrop: (piece: BlockPiece, position: Position) => void;
  onPieceReturn: (piece: BlockPiece) => void;
}

const CELL_SIZE = 40;

export default function GameBoard({
  pattern,
  placedPieces,
  onPieceDrop,
  onPieceReturn,
}: GameBoardProps) {
  const [dragOverCell, setDragOverCell] = useState<Position | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const { draggedPiece, setDraggedPiece } = useDrag();

  // 드래그 중인 조각이 차지할 모든 셀 계산
  const getDragPreviewCells = useCallback((baseRow: number, baseCol: number): Position[] => {
    if (!draggedPiece) return [];
    
    return draggedPiece.shape.map(cell => ({
      row: baseRow + cell.row,
      col: baseCol + cell.col,
    }));
  }, [draggedPiece]);

  // 배치가 유효한지 확인 (모든 셀이 타겟 영역에 있고, 다른 조각과 겹치지 않는지)
  const isValidPlacement = useCallback((baseRow: number, baseCol: number): boolean => {
    if (!draggedPiece) return false;

    // 1. 타겟 영역 확인
    const isInTargetArea = draggedPiece.shape.every(cell => {
      const absoluteRow = baseRow + cell.row;
      const absoluteCol = baseCol + cell.col;
      
      // 보드 범위 확인
      if (absoluteRow < 0 || absoluteRow >= pattern.gridSize.rows ||
          absoluteCol < 0 || absoluteCol >= pattern.gridSize.cols) {
        return false;
      }
      
      // 타겟 셀 확인
      return pattern.targetCells.some(
        targetCell => targetCell.row === absoluteRow && targetCell.col === absoluteCol
      );
    });

    if (!isInTargetArea) return false;

    // 2. 충돌 감지 - 다른 조각과 겹치는지 확인
    for (const [pieceId, existingPiece] of placedPieces.entries()) {
      // 자기 자신은 제외
      if (pieceId === draggedPiece.id) continue;

      // 겹치는 셀이 있는지 확인
      const hasCollision = existingPiece.shape.some(existingCell => {
        const existingRow = existingCell.row + existingPiece.position.row;
        const existingCol = existingCell.col + existingPiece.position.col;

        return draggedPiece.shape.some(newCell => {
          const newRow = baseRow + newCell.row;
          const newCol = baseCol + newCell.col;
          return newRow === existingRow && newCol === existingCol;
        });
      });

      if (hasCollision) return false;
    }

    return true;
  }, [draggedPiece, pattern.gridSize, pattern.targetCells, placedPieces]);

  const handleDragOver = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCell({ row, col });
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverCell(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('💧 Drop at:', row, col);
    
    setDragOverCell(null);

    if (!draggedPiece) {
      console.error('❌ No piece being dragged!');
      return;
    }

    console.log('✅ Calling onPieceDrop');
    onPieceDrop(draggedPiece, { row, col });
  }, [draggedPiece, onPieceDrop]);

  const handlePieceMouseDown = useCallback((piece: BlockPiece, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🎯 Piece grabbed from board:', piece.id);
    
    // 보드에서 조각을 제거하고 드래그 시작
    onPieceReturn(piece);
    setDraggedPiece(piece);
  }, [onPieceReturn, setDraggedPiece]);

  const handlePieceClick = useCallback((piece: BlockPiece, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 드래그 중이 아닐 때만 클릭으로 제거
    if (!draggedPiece) {
      console.log('🔄 Returning piece via click:', piece.id);
      onPieceReturn(piece);
    }
  }, [draggedPiece, onPieceReturn]);

  const isCellTarget = useCallback((row: number, col: number): boolean => {
    return pattern.targetCells.some(
      (cell) => cell.row === row && cell.col === col
    );
  }, [pattern.targetCells]);

  const getCellPiece = useCallback((row: number, col: number): BlockPiece | null => {
    for (const piece of placedPieces.values()) {
      const isOccupied = piece.shape.some(
        (cell) =>
          cell.row + piece.position.row === row &&
          cell.col + piece.position.col === col
      );
      if (isOccupied) return piece;
    }
    return null;
  }, [placedPieces]);

  const renderCell = (row: number, col: number) => {
    const isTarget = isCellTarget(row, col);
    const piece = getCellPiece(row, col);
    
    // 드래그 프리뷰 확인
    const previewCells = dragOverCell ? getDragPreviewCells(dragOverCell.row, dragOverCell.col) : [];
    const isInPreview = previewCells.some(p => p.row === row && p.col === col);
    const isValidDrop = dragOverCell ? isValidPlacement(dragOverCell.row, dragOverCell.col) : false;

    return (
      <div
        key={`${row}-${col}`}
        className={`
          border border-gray-300 relative transition-all
          ${isTarget ? 'bg-amber-100' : 'bg-white'}
          ${isInPreview && isValidDrop ? 'ring-2 ring-green-500 bg-green-100' : ''}
          ${isInPreview && !isValidDrop ? 'ring-2 ring-red-500 bg-red-100' : ''}
          ${piece ? 'cursor-grab hover:opacity-80' : ''}
        `}
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
        }}
        onDragOver={(e) => handleDragOver(e, row, col)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, row, col)}
        onMouseDown={(e) => piece && handlePieceMouseDown(piece, e)}
        onClick={(e) => piece && handlePieceClick(piece, e)}
      >
        {piece && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-sm"
            style={{
              backgroundColor: piece.color,
              opacity: 0.9,
              pointerEvents: 'none',
            }}
          />
        )}
        {isInPreview && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className={`w-2 h-2 rounded-full ${isValidDrop ? 'bg-green-600 animate-pulse' : 'bg-red-600 animate-ping'}`}
            ></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="flex justify-center">
        <div
          ref={boardRef}
          className={`inline-grid gap-0 border-4 rounded-lg overflow-hidden transition-all ${
            draggedPiece ? 'border-blue-500 shadow-xl' : 'border-gray-400'
          }`}
          style={{
            gridTemplateColumns: `repeat(${pattern.gridSize.cols}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${pattern.gridSize.rows}, ${CELL_SIZE}px)`,
          }}
        >
          {Array.from({ length: pattern.gridSize.rows }, (_, row) =>
            Array.from({ length: pattern.gridSize.cols }, (_, col) =>
              renderCell(row, col)
            )
          )}
        </div>
      </div>

      {/* 레전드 */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-amber-100 border border-gray-300 rounded"></div>
          <span>채울 영역</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white border border-gray-300 rounded"></div>
          <span>빈 영역</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-100 border-2 border-green-500 rounded"></div>
          <span>배치 가능</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-100 border-2 border-red-500 rounded"></div>
          <span>배치 불가 (영역 밖 또는 충돌)</span>
        </div>
      </div>

      {/* Status info */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-600">
            배치된 조각: <strong className="text-blue-600">{placedPieces.size}</strong>
          </span>
          {draggedPiece && (
            <span className="text-sm text-green-600 animate-pulse font-semibold">
              🎯 드래그 중: {draggedPiece.id}
            </span>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-3 text-center text-sm text-gray-500">
        💡 배치된 조각을 클릭하거나 드래그하면 다시 아래로 이동합니다<br/>
        ⚠️ 블록은 서로 겹칠 수 없습니다
      </div>
    </div>
  );
}
