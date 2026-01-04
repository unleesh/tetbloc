export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  row: number;
  col: number;
}

export interface BlockPiece {
  id: string;
  shape: Cell[]; // 조각의 형태 (상대 좌표)
  color: string;
  position: Position; // 보드상의 절대 위치
}

export interface BlockPattern {
  id: number;
  level: number;
  gridSize: { rows: number; cols: number };
  targetCells: Cell[]; // 채워야 할 셀들
  pieces: BlockPiece[]; // 사용할 조각들
}

export interface DragState {
  isDragging: boolean;
  piece: BlockPiece | null;
  offset: Position;
}
