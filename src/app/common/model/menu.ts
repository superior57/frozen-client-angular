export interface Menu {
  text: string;
  navigatesTo: string;
  icon?: string;
  tooltip?: string;
  requiresPermisions?: string[];
}
