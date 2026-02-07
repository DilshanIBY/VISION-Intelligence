export interface CanvasObject {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'note' | 'arrow' | 'curved-arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string; // For text/note
  color?: string;
  floorIndex: number;

  // Connection Logic
  startObjectId?: string;
  endObjectId?: string;
  startPoint?: { x: number; y: number };
  endPoint?: { x: number; y: number };
}
