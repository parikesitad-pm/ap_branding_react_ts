export type LoadState =
  | 'pending'
  | 'fulfilled'
  | 'failed'
  | 'timed-out';

export interface ReadinessTask {
  id: string;
  weight: number;
  state: LoadState;
}

export interface HexCellData {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  distanceFromCenter: number;
  directionX: number;
  directionY: number;
  isEven: boolean;
}
