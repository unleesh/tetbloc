'use client';

import { useState, useEffect, useCallback } from 'react';
import GameBoard from '@/components/GameBoard';
import PieceSelector from '@/components/PieceSelector';
import { BlockPattern, BlockPiece, Position } from '@/types/game';
import { LEVEL_PATTERNS } from '@/data/patterns';

function GameContent() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [pattern, setPattern] = useState<BlockPattern>(LEVEL_PATTERNS[0]);
  const [placedPieces, setPlacedPieces] = useState<Map<string, BlockPiece>>(new Map());
  const [availablePieces, setAvailablePieces] = useState<BlockPiece[]>([]);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<BlockPiece | null>(null);
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);

  // Global touch/mouse move handler for floating preview
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (draggedPiece && e.touches[0]) {
        const touch = e.touches[0];
        const pos = { x: touch.clientX, y: touch.clientY };
        setTouchPosition(pos);
        console.log('🌐 [Global] Touch move - updating position:', pos);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggedPiece) {
        const pos = { x: e.clientX, y: e.clientY };
        setTouchPosition(pos);
        console.log('🌐 [Global] Mouse move - updating position:', pos);
      }
    };

    const handleGlobalEnd = () => {
      console.log('🌐 [Global] Touch/Mouse END - clearing position');
      setTouchPosition(null);
    };

    if (draggedPiece) {
      console.log('🌐 [Global] Adding global listeners for piece:', draggedPiece.id);
      // Use passive listeners for global tracking (doesn't block scrolling)
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
      document.addEventListener('touchend', handleGlobalEnd, { passive: true });
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
      document.addEventListener('mouseup', handleGlobalEnd, { passive: true });
    }

    return () => {
      if (draggedPiece) {
        console.log('🌐 [Global] Removing global listeners');
      }
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalEnd);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
    };
  }, [draggedPiece]);

  // 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isCompleted]);

  // 레벨 초기화
  useEffect(() => {
    const currentPattern = LEVEL_PATTERNS[currentLevel];
    setPattern(currentPattern);
    setAvailablePieces(shuffleArray([...currentPattern.pieces]));
    setPlacedPieces(new Map());
    setTimer(0);
    setIsCompleted(false);
    setIsRunning(true);
  }, [currentLevel]);

  // 완성 체크 - 모든 타겟 셀이 정확하게 채워졌는지 확인
  useEffect(() => {
    // 모든 조각을 사용했는지 확인
    if (availablePieces.length !== 0 || placedPieces.size !== pattern.pieces.length) {
      return;
    }

    // 모든 타겟 셀이 채워졌는지 확인
    const allTargetsFilled = pattern.targetCells.every(targetCell => {
      // 이 타겟 셀을 차지하는 조각이 있는지 확인
      for (const piece of Array.from(placedPieces.values())) {
        const isOccupied = piece.shape.some(
          cell =>
            cell.row + piece.position.row === targetCell.row &&
            cell.col + piece.position.col === targetCell.col
        );
        if (isOccupied) return true;
      }
      return false;
    });

    // 배치된 모든 셀이 타겟 영역 안에 있는지 확인
    const allPiecesInTarget = Array.from(placedPieces.values()).every(piece => {
      return piece.shape.every(cell => {
        const absoluteRow = cell.row + piece.position.row;
        const absoluteCol = cell.col + piece.position.col;
        return pattern.targetCells.some(
          targetCell => targetCell.row === absoluteRow && targetCell.col === absoluteCol
        );
      });
    });

    if (allTargetsFilled && allPiecesInTarget) {
      console.log('🎉 Level completed!');
      setIsCompleted(true);
      setIsRunning(false);
    }
  }, [availablePieces, placedPieces, pattern.pieces.length, pattern.targetCells]);

  const handlePieceDrop = useCallback((piece: BlockPiece, boardPosition: Position) => {
    console.log('✅ Piece dropped:', piece.id, 'at', boardPosition);
    
    // 유효성 검사: 모든 셀이 타겟 영역 안에 있는지 확인
    const isValidPlacement = piece.shape.every(cell => {
      const absoluteRow = cell.row + boardPosition.row;
      const absoluteCol = cell.col + boardPosition.col;
      
      // 보드 범위 안에 있는지 확인
      if (absoluteRow < 0 || absoluteRow >= pattern.gridSize.rows ||
          absoluteCol < 0 || absoluteCol >= pattern.gridSize.cols) {
        return false;
      }
      
      // 타겟 셀 안에 있는지 확인
      return pattern.targetCells.some(
        targetCell => targetCell.row === absoluteRow && targetCell.col === absoluteCol
      );
    });

    if (!isValidPlacement) {
      console.log('❌ Invalid placement - piece must be placed entirely on target cells');
      setDraggedPiece(null);
      return;
    }

    console.log('✅ Valid placement on target cells');
    
    // 충돌 감지: 새로 배치할 조각이 다른 조각과 겹치는지 확인
    const occupiedCells = new Set<string>();
    const piecesToRemove: BlockPiece[] = [];
    
    // 현재 배치된 조각들이 차지하는 셀을 찾고, 겹치는 조각들을 기록
    for (const [pieceId, existingPiece] of placedPieces.entries()) {
      // 자기 자신은 제외 (드래그 중인 조각이 이미 보드에 있을 수 있음)
      if (pieceId === piece.id) continue;
      
      let hasCollision = false;
      
      for (const cell of existingPiece.shape) {
        const existingRow = cell.row + existingPiece.position.row;
        const existingCol = cell.col + existingPiece.position.col;
        const cellKey = `${existingRow},${existingCol}`;
        
        // 새 조각이 이 셀을 차지하는지 확인
        const isOccupiedByNewPiece = piece.shape.some(newCell => {
          const newRow = newCell.row + boardPosition.row;
          const newCol = newCell.col + boardPosition.col;
          return newRow === existingRow && newCol === existingCol;
        });
        
        if (isOccupiedByNewPiece) {
          hasCollision = true;
          break;
        }
        
        occupiedCells.add(cellKey);
      }
      
      if (hasCollision) {
        piecesToRemove.push(existingPiece);
      }
    }
    
    // 겹치는 조각이 있으면 배치 불가
    if (piecesToRemove.length > 0) {
      console.log('❌ Collision detected with pieces:', piecesToRemove.map(p => p.id));
      console.log('Cannot place - pieces would overlap');
      setDraggedPiece(null);
      return;
    }

    console.log('✅ No collision detected');

    const newPlacedPieces = new Map(placedPieces);
    let newAvailablePieces = [...availablePieces];

    // 새 조각 배치
    const updatedPiece = { ...piece, position: boardPosition };
    newPlacedPieces.set(piece.id, updatedPiece);
    
    // available에서 제거
    newAvailablePieces = newAvailablePieces.filter(p => p.id !== piece.id);

    console.log('📊 New state - Placed:', newPlacedPieces.size, 'Available:', newAvailablePieces.length);

    setPlacedPieces(newPlacedPieces);
    setAvailablePieces(newAvailablePieces);
    setDraggedPiece(null);
  }, [placedPieces, availablePieces, pattern.gridSize, pattern.targetCells]);

  const handlePieceReturn = useCallback((piece: BlockPiece) => {
    console.log('Returning piece:', piece.id);
    const newPlacedPieces = new Map(placedPieces);
    newPlacedPieces.delete(piece.id);
    setPlacedPieces(newPlacedPieces);
    setAvailablePieces([...availablePieces, piece]);
  }, [placedPieces, availablePieces]);

  const handleNextLevel = () => {
    if (currentLevel < LEVEL_PATTERNS.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      alert('모든 레벨을 완료했습니다!');
    }
  };

  const handleRestart = () => {
    setCurrentLevel(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 p-4"
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">블록 퍼즐 게임</h1>
                <p className="text-gray-600">레벨 {currentLevel + 1} / {LEVEL_PATTERNS.length}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-blue-600">
                  {formatTime(timer)}
                </div>
                <div className="text-sm text-gray-600">
                  남은 조각: {availablePieces.length}
                </div>
              </div>
            </div>
          </div>

          {/* Game Board */}
          <GameBoard
            pattern={pattern}
            placedPieces={placedPieces}
            onPieceDrop={handlePieceDrop}
            onPieceReturn={handlePieceReturn}
            draggedPiece={draggedPiece}
            setDraggedPiece={setDraggedPiece}
          />

          {/* Piece Selector */}
          <PieceSelector
            pieces={availablePieces}
            onPieceSelect={(piece) => {
              console.log('Piece selected:', piece.id);
              // Don't remove piece here - it will be removed when successfully placed
            }}
            draggedPiece={draggedPiece}
            setDraggedPiece={setDraggedPiece}
            setTouchPosition={setTouchPosition}
          />

          {/* Completion Modal */}
          {isCompleted && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md text-center">
                <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 완성!</h2>
                <p className="text-xl mb-2">레벨 {currentLevel + 1} 클리어</p>
                <p className="text-2xl font-mono font-bold text-blue-600 mb-6">
                  {formatTime(timer)}
                </p>
                <div className="flex gap-4 justify-center">
                  {currentLevel < LEVEL_PATTERNS.length - 1 ? (
                    <>
                      <button
                        onClick={handleRestart}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        처음부터
                      </button>
                      <button
                        onClick={handleNextLevel}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        다음 레벨
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleRestart}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      다시 시작
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Floating piece preview for touch drag */}
          {draggedPiece && touchPosition && (
            <div
              style={{
                position: 'fixed',
                left: touchPosition.x,
                top: touchPosition.y,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: 0.85,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
              }}
            >
              <div
                className="grid gap-0"
                style={{
                  gridTemplateColumns: `repeat(${Math.max(...draggedPiece.shape.map(c => c.col)) + 1}, 40px)`,
                  gridTemplateRows: `repeat(${Math.max(...draggedPiece.shape.map(c => c.row)) + 1}, 40px)`,
                  pointerEvents: 'none',
                }}
              >
                {Array.from({ length: Math.max(...draggedPiece.shape.map(c => c.row)) + 1 }, (_, row) =>
                  Array.from({ length: Math.max(...draggedPiece.shape.map(c => c.col)) + 1 }, (_, col) => {
                    const hasCell = draggedPiece.shape.some(
                      (cell) => cell.row === row && cell.col === col
                    );
                    return (
                      <div
                        key={`float-${row}-${col}`}
                        className={`border-2 ${hasCell ? 'border-white' : 'border-transparent'} rounded`}
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: hasCell ? draggedPiece.color : 'transparent',
                          boxShadow: hasCell ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                          pointerEvents: 'none',
                        }}
                        }}
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </main>
  );
}

export default function Home() {
  return <GameContent />;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
