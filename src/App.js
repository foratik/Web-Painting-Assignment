import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [draggingShape, setDraggingShape] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const shapeNames = {
    rectangle: 'مربع',
    circle: 'دایره',
    triangle: 'مثلث'
  };

  const handleCanvasClick = (e) => {
    if (!selectedShape) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    
    const newShape = {
      id: Date.now(),
      type: selectedShape,
      x,
      y,
      size: 50,
    };
    
    setShapes([...shapes, newShape]);
  };

  const handleDragStart = (e, shapeType) => {
    e.dataTransfer.setData('shapeType', shapeType);
    setDraggingShape(shapeType);
  };

  const handleDragEnd = () => {
    setDraggingShape(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const shapeType = e.dataTransfer.getData('shapeType');
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    
    const newShape = {
      id: Date.now(),
      type: shapeType,
      x,
      y,
      size: 50,
    };
    
    setShapes([...shapes, newShape]);
  };

  const handleShapeDoubleClick = (id) => {
    setShapes(shapes.filter(shape => shape.id !== id));
  };

  const shapeCounts = shapes.reduce((counts, shape) => {
    counts[shape.type] = (counts[shape.type] || 0) + 1;
    return counts;
  }, {});

  const handleExport = () => {
    const data = JSON.stringify(shapes);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drawing.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedShapes = JSON.parse(event.target.result);
        setShapes(importedShapes);
      } catch (error) {
        alert('فرمت فایل نامعتبر است');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">نرم‌افزار نقاشی</h1>
        <div className="header-buttons">
          <button 
            onClick={() => fileInputRef.current.click()}
            className="import-button"
          >
            بارگذاری
          </button>
          <button 
            onClick={handleExport}
            className="export-button"
          >
            ذخیره
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <h2 className="sidebar-title">اشکال</h2>
          <div 
            className={`shape-option ${selectedShape === 'rectangle' ? 'selected' : ''}`}
            onClick={() => setSelectedShape('rectangle')}
            draggable
            onDragStart={(e) => handleDragStart(e, 'rectangle')}
            onDragEnd={handleDragEnd}
          >
            <div className="rectangle shape-preview"></div>
            <span>مربع</span>
          </div>
          <div 
            className={`shape-option ${selectedShape === 'circle' ? 'selected' : ''}`}
            onClick={() => setSelectedShape('circle')}
            draggable
            onDragStart={(e) => handleDragStart(e, 'circle')}
            onDragEnd={handleDragEnd}
          >
            <div className="circle shape-preview"></div>
            <span>دایره</span>
          </div>
          <div 
            className={`shape-option ${selectedShape === 'triangle' ? 'selected' : ''}`}
            onClick={() => setSelectedShape('triangle')}
            draggable
            onDragStart={(e) => handleDragStart(e, 'triangle')}
            onDragEnd={handleDragEnd}
          >
            <div className="triangle shape-preview"></div>
            <span>مثلث</span>
          </div>
        </div>

        <div 
          className={`canvas ${draggingShape ? 'drag-over' : ''}`}
          ref={canvasRef}
          onClick={handleCanvasClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {shapes.map(shape => (
            <div
              key={shape.id}
              className={`shape ${shape.type}`}
              style={{
                left: shape.x - shape.size/2,
                top: shape.y - shape.size/2,
                width: shape.size,
                height: shape.size,
              }}
              onDoubleClick={() => handleShapeDoubleClick(shape.id)}
            />
          ))}
          
          <div className="canvas-hint">
            {selectedShape 
              ? `شکل ${shapeNames[selectedShape]} انتخاب شده. روی بوم کلیک کنید` 
              : draggingShape
                ? `شکل ${shapeNames[draggingShape]} را به بوم بکشید و رها کنید`
                : "لطفاً شکلی از نوار کناری انتخاب کنید"}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="shape-counts">
          <div className="count-item">
            <div className="rectangle shape-icon"></div>
            <span>مربع: {shapeCounts.rectangle || 0}</span>
          </div>
          <div className="count-item">
            <div className="circle shape-icon"></div>
            <span>دایره: {shapeCounts.circle || 0}</span>
          </div>
          <div className="count-item">
            <div className="triangle shape-icon"></div>
            <span>مثلث: {shapeCounts.triangle || 0}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
