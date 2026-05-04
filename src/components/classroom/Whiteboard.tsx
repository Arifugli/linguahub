import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Pencil, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Trash2, 
  Download,
  Undo,
  Redo,
  Palette
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DrawingAction {
  type: 'path' | 'rectangle' | 'circle' | 'text';
  data: any;
  color: string;
  lineWidth: number;
}

interface WhiteboardProps {
  initialData?: DrawingAction[];
  onDataChange?: (data: DrawingAction[]) => void;
  readOnly?: boolean;
}

const COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', 
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
];

export const Whiteboard: React.FC<WhiteboardProps> = ({ 
  initialData = [], 
  onDataChange,
  readOnly = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'rectangle' | 'circle' | 'text'>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [actions, setActions] = useState<DrawingAction[]>(initialData);
  const [undoneActions, setUndoneActions] = useState<DrawingAction[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    actions.forEach(action => {
      ctx.strokeStyle = action.color;
      ctx.fillStyle = action.color;
      ctx.lineWidth = action.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      switch (action.type) {
        case 'path':
          if (action.data.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(action.data[0].x, action.data[0].y);
          action.data.forEach((point: { x: number; y: number }) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
          break;
        case 'rectangle':
          ctx.strokeRect(
            action.data.x, 
            action.data.y, 
            action.data.width, 
            action.data.height
          );
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(
            action.data.x, 
            action.data.y, 
            action.data.radius, 
            0, 
            Math.PI * 2
          );
          ctx.stroke();
          break;
        case 'text':
          ctx.font = `${action.lineWidth * 6}px sans-serif`;
          ctx.fillText(action.data.text, action.data.x, action.data.y);
          break;
      }
    });
  }, [actions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [actions, redrawCanvas]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(pos);

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentPath([pos]);
    } else if (tool === 'text') {
      const text = prompt('Введите текст:');
      if (text) {
        const newAction: DrawingAction = {
          type: 'text',
          data: { x: pos.x, y: pos.y, text },
          color,
          lineWidth
        };
        const newActions = [...actions, newAction];
        setActions(newActions);
        setUndoneActions([]);
        onDataChange?.(newActions);
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;

    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentPath(prev => [...prev, pos]);
      
      // Draw current stroke
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const path = [...currentPath, pos];
      if (path.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(path[path.length - 2].x, path[path.length - 2].y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    } else if (startPoint && (tool === 'rectangle' || tool === 'circle')) {
      // Preview shape
      redrawCanvas();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      
      if (tool === 'rectangle') {
        ctx.strokeRect(
          startPoint.x,
          startPoint.y,
          pos.x - startPoint.x,
          pos.y - startPoint.y
        );
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(pos.x - startPoint.x, 2) + 
          Math.pow(pos.y - startPoint.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;

    const pos = getMousePos(e);
    let newAction: DrawingAction | null = null;

    if (tool === 'pen' || tool === 'eraser') {
      const path = [...currentPath, pos];
      if (path.length >= 2) {
        newAction = {
          type: 'path',
          data: path,
          color: tool === 'eraser' ? '#ffffff' : color,
          lineWidth: tool === 'eraser' ? lineWidth * 3 : lineWidth
        };
      }
    } else if (startPoint) {
      if (tool === 'rectangle') {
        newAction = {
          type: 'rectangle',
          data: {
            x: startPoint.x,
            y: startPoint.y,
            width: pos.x - startPoint.x,
            height: pos.y - startPoint.y
          },
          color,
          lineWidth
        };
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(pos.x - startPoint.x, 2) + 
          Math.pow(pos.y - startPoint.y, 2)
        );
        newAction = {
          type: 'circle',
          data: {
            x: startPoint.x,
            y: startPoint.y,
            radius
          },
          color,
          lineWidth
        };
      }
    }

    if (newAction) {
      const newActions = [...actions, newAction];
      setActions(newActions);
      setUndoneActions([]);
      onDataChange?.(newActions);
    }

    setIsDrawing(false);
    setCurrentPath([]);
    setStartPoint(null);
  };

  const handleUndo = () => {
    if (actions.length === 0) return;
    const lastAction = actions[actions.length - 1];
    setActions(actions.slice(0, -1));
    setUndoneActions([...undoneActions, lastAction]);
    onDataChange?.(actions.slice(0, -1));
  };

  const handleRedo = () => {
    if (undoneActions.length === 0) return;
    const lastUndone = undoneActions[undoneActions.length - 1];
    const newActions = [...actions, lastUndone];
    setActions(newActions);
    setUndoneActions(undoneActions.slice(0, -1));
    onDataChange?.(newActions);
  };

  const handleClear = () => {
    setActions([]);
    setUndoneActions([]);
    onDataChange?.([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border">
      {!readOnly && (
        <div className="flex items-center gap-2 p-2 border-b bg-muted/50 flex-wrap">
          <div className="flex items-center gap-1">
            <Button
              variant={tool === 'pen' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setTool('pen')}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'eraser' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setTool('eraser')}
            >
              <Eraser className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'rectangle' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setTool('rectangle')}
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'circle' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setTool('circle')}
            >
              <Circle className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === 'text' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setTool('text')}
            >
              <Type className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-border" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <div 
                  className="w-5 h-5 rounded border"
                  style={{ backgroundColor: color }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-5 gap-1">
                {COLORS.map(c => (
                  <button
                    key={c}
                    className={`w-6 h-6 rounded border-2 ${color === c ? 'border-primary' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-2 min-w-[100px]">
            <span className="text-xs text-muted-foreground">Толщина:</span>
            <Slider
              value={[lineWidth]}
              onValueChange={([v]) => setLineWidth(v)}
              min={1}
              max={20}
              step={1}
              className="w-20"
            />
          </div>

          <div className="w-px h-6 bg-border" />

          <Button variant="ghost" size="icon" onClick={handleUndo} disabled={actions.length === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleRedo} disabled={undoneActions.length === 0}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 ${readOnly ? 'cursor-default' : tool === 'text' ? 'cursor-text' : 'cursor-crosshair'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
};
