import { BlockPattern, Cell } from '@/types/game';

// 조각을 실제로 배치한 위치를 타겟으로 설정
// 100% 풀 수 있음을 보장

// 헬퍼 함수: 조각을 특정 위치에 배치했을 때의 좌표들
function placePiece(shape: Cell[], row: number, col: number): Cell[] {
  return shape.map(cell => ({ row: cell.row + row, col: cell.col + col }));
}

export const LEVEL_PATTERNS: BlockPattern[] = [
  // 레벨 1 - 간단한 조합 (12칸) = L + J + O
  {
    id: 1,
    level: 1,
    gridSize: { rows: 9, cols: 9 },
    targetCells: [
      // L 조각을 (2,2)에 배치
      ...placePiece([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 }, { row: 2, col: 1 }
      ], 2, 2),
      // J 조각을 (2,4)에 배치
      ...placePiece([
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 2, col: 0 }, { row: 2, col: 1 }
      ], 2, 4),
      // O 조각을 (5,2)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 },
        { row: 1, col: 0 }, { row: 1, col: 1 }
      ], 5, 2)
    ],
    pieces: [
      {
        id: 'p1-1',
        shape: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 }, { row: 2, col: 1 }
        ],
        color: '#FFA500',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p1-2',
        shape: [
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          { row: 2, col: 0 }, { row: 2, col: 1 }
        ],
        color: '#0000FF',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p1-3',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 },
          { row: 1, col: 0 }, { row: 1, col: 1 }
        ],
        color: '#FFFF00',
        position: { row: 0, col: 0 },
      },
    ],
  },

  // 레벨 2 - Z + S 조합 (16칸) = Z + S + O + O
  {
    id: 2,
    level: 2,
    gridSize: { rows: 10, cols: 10 },
    targetCells: [
      // Z 조각을 (2,2)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 },
        { row: 1, col: 1 }, { row: 1, col: 2 }
      ], 2, 2),
      // S 조각을 (3,4)에 배치
      ...placePiece([
        { row: 0, col: 1 }, { row: 0, col: 2 },
        { row: 1, col: 0 }, { row: 1, col: 1 }
      ], 3, 4),
      // O 조각을 (4,2)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 },
        { row: 1, col: 0 }, { row: 1, col: 1 }
      ], 4, 2),
      // O 조각을 (5,5)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 },
        { row: 1, col: 0 }, { row: 1, col: 1 }
      ], 5, 5)
    ],
    pieces: [
      {
        id: 'p2-1',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 },
          { row: 1, col: 1 }, { row: 1, col: 2 }
        ],
        color: '#FF0000',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p2-2',
        shape: [
          { row: 0, col: 1 }, { row: 0, col: 2 },
          { row: 1, col: 0 }, { row: 1, col: 1 }
        ],
        color: '#00FF00',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p2-3',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 },
          { row: 1, col: 0 }, { row: 1, col: 1 }
        ],
        color: '#FFFF00',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p2-4',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 },
          { row: 1, col: 0 }, { row: 1, col: 1 }
        ],
        color: '#FFD700',
        position: { row: 0, col: 0 },
      },
    ],
  },

  // 레벨 3 - T와 I 조합 (20칸) = I + I + T + L + O
  {
    id: 3,
    level: 3,
    gridSize: { rows: 11, cols: 11 },
    targetCells: [
      // I 조각 (가로)을 (2,2)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }
      ], 2, 2),
      // I 조각 (세로)을 (3,2)에 배치
      ...placePiece([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 },
        { row: 3, col: 0 }
      ], 3, 2),
      // T 조각을 (3,3)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
        { row: 1, col: 1 }
      ], 3, 3),
      // L 조각을 (5,5)에 배치
      ...placePiece([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 }, { row: 2, col: 1 }
      ], 5, 5),
      // O 조각을 (4,7)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 },
        { row: 1, col: 0 }, { row: 1, col: 1 }
      ], 4, 7)
    ],
    pieces: [
      {
        id: 'p3-1',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }
        ],
        color: '#00FFFF',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p3-2',
        shape: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 },
          { row: 3, col: 0 }
        ],
        color: '#00CED1',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p3-3',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
          { row: 1, col: 1 }
        ],
        color: '#800080',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p3-4',
        shape: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 }, { row: 2, col: 1 }
        ],
        color: '#FFA500',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p3-5',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 },
          { row: 1, col: 0 }, { row: 1, col: 1 }
        ],
        color: '#FFFF00',
        position: { row: 0, col: 0 },
      },
    ],
  },

  // 레벨 4 - 큰 조합 (24칸) = I + I + T + T + L + J
  {
    id: 4,
    level: 4,
    gridSize: { rows: 11, cols: 11 },
    targetCells: [
      // I 조각을 (2,2)에 가로 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }
      ], 2, 2),
      // I 조각을 (3,2)에 가로 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }
      ], 3, 2),
      // T 조각을 (4,2)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
        { row: 1, col: 1 }
      ], 4, 2),
      // T 조각을 (2,6)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
        { row: 1, col: 1 }
      ], 2, 6),
      // L 조각을 (4,6)에 배치
      ...placePiece([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 }, { row: 2, col: 1 }
      ], 4, 6),
      // J 조각을 (4,8)에 배치
      ...placePiece([
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 2, col: 0 }, { row: 2, col: 1 }
      ], 4, 8)
    ],
    pieces: [
      {
        id: 'p4-1',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }
        ],
        color: '#00FFFF',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p4-2',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }
        ],
        color: '#00CED1',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p4-3',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
          { row: 1, col: 1 }
        ],
        color: '#800080',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p4-4',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
          { row: 1, col: 1 }
        ],
        color: '#9370DB',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p4-5',
        shape: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 }, { row: 2, col: 1 }
        ],
        color: '#FFA500',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p4-6',
        shape: [
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          { row: 2, col: 0 }, { row: 2, col: 1 }
        ],
        color: '#0000FF',
        position: { row: 0, col: 0 },
      },
    ],
  },

  // 레벨 5 - 최고 난이도 (28칸) = I + I + Z + S + T + L + O
  {
    id: 5,
    level: 5,
    gridSize: { rows: 12, cols: 12 },
    targetCells: [
      // I 조각 (세로)을 (2,2)에 배치
      ...placePiece([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 },
        { row: 3, col: 0 }
      ], 2, 2),
      // I 조각 (가로)을 (2,3)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }
      ], 2, 3),
      // Z 조각을 (3,3)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 },
        { row: 1, col: 1 }, { row: 1, col: 2 }
      ], 3, 3),
      // S 조각을 (3,6)에 배치
      ...placePiece([
        { row: 0, col: 1 }, { row: 0, col: 2 },
        { row: 1, col: 0 }, { row: 1, col: 1 }
      ], 3, 6),
      // T 조각을 (5,4)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
        { row: 1, col: 1 }
      ], 5, 4),
      // L 조각을 (5,7)에 배치
      ...placePiece([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 }, { row: 2, col: 1 }
      ], 5, 7),
      // O 조각을 (6,3)에 배치
      ...placePiece([
        { row: 0, col: 0 }, { row: 0, col: 1 },
        { row: 1, col: 0 }, { row: 1, col: 1 }
      ], 6, 3)
    ],
    pieces: [
      {
        id: 'p5-1',
        shape: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 },
          { row: 3, col: 0 }
        ],
        color: '#00FFFF',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p5-2',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }
        ],
        color: '#00CED1',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p5-3',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 },
          { row: 1, col: 1 }, { row: 1, col: 2 }
        ],
        color: '#FF0000',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p5-4',
        shape: [
          { row: 0, col: 1 }, { row: 0, col: 2 },
          { row: 1, col: 0 }, { row: 1, col: 1 }
        ],
        color: '#00FF00',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p5-5',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
          { row: 1, col: 1 }
        ],
        color: '#800080',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p5-6',
        shape: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 }, { row: 2, col: 1 }
        ],
        color: '#FFA500',
        position: { row: 0, col: 0 },
      },
      {
        id: 'p5-7',
        shape: [
          { row: 0, col: 0 }, { row: 0, col: 1 },
          { row: 1, col: 0 }, { row: 1, col: 1 }
        ],
        color: '#FFFF00',
        position: { row: 0, col: 0 },
      },
    ],
  },
];
