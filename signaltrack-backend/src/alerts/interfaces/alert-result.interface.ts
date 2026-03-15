export type AlertType = 'speed' | 'fuel';

export interface AlertResult {
  type: AlertType;
  value: number;
  threshold: number;
}
