import { useState, useRef, useEffect } from 'react';
import './Canvas.css';
import Popup from '../popup/PopUp';

const Canvas = () => {
  const [divs, setDivs] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: '90%', height: '80%' });
  const [canvasSize, setCanvasSize] = useState({ width: '80%', height: '80%' });
  const canvasRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
        setPopupData(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
  };

  const addDiv = () => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const maxWidth = canvasRect.width - 220;
    const maxHeight = canvasRect.height - 220;
    const x = Math.floor(Math.random() * maxWidth);
    const y = Math.floor(Math.random() * maxHeight);
    const newZIndex = divs.length > 0 ? Math.max(...divs.map((div) => div.zIndex)) + 1 : 1;

    setDivs((prevDivs) => [
      ...prevDivs,
      {
        id: prevDivs.length + 1,
        x,
        y,
        text: `Hi Shekhar\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget quam turpis. Phasellus sit amet augue nec purus congue laoreet. Nulla facilisi. Proin nec libero sit amet nulla scelerisque feugiat. Vestibulum euismod neque eget nisl convallis, ac rhoncus libero vestibulum.`,
        expanded: false,
        color: getRandomColor(),
        zIndex: newZIndex,
      },
    ]);
    setSelectedDiv(divs.length);
  };

  const handleDragStart = () => {
    setPopupVisible(false);
  };

  const handleDragEnd = (e, index) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    bringToTop(index);
    setDivs((prevDivs) =>
      prevDivs.map((div, i) => (i === index ? { ...div, x, y } : div))
    );
  };

  const toggleText = (index) => {
    setDivs((prevDivs) =>
      prevDivs.map((div, i) => (i === index ? { ...div, expanded: !div.expanded } : div))
    );
  };

  const bringToTop = (index) => {
    const maxZIndex = Math.max(...divs.map((div) => div.zIndex));
    setDivs((prevDivs) =>
      prevDivs.map((div, i) => (i === index ? { ...div, zIndex: maxZIndex + 1 } : div))
    );
    setSelectedDiv(index);
  };

  const deleteDiv = (index, e) => {
    e.stopPropagation();
    setDivs((prevDivs) => {
      const updatedDivs = prevDivs.filter((_, i) => i !== index);
      if (selectedDiv === index) {
        setSelectedDiv(null);
        setPopupVisible(false);
      }
      return updatedDivs;
    });
  };

  const clearCanvas = () => {
    setDivs([]);
    setSelectedDiv(null);
    setPopupVisible(false);
  };

  const handleClick = (index) => {
    bringToTop(index);
    setPopupData(divs[index]);
    setPopupVisible(true);
  };

  return (
    <div className="canvas-container">
      <div className="btn-container">
        <button className="add-button" onClick={addDiv}>
          New Card
        </button>
        <button className="clear-button" onClick={clearCanvas}>
          Clear
        </button>
      </div>
      <div
        className="canvas"
        ref={canvasRef}
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        {divs.map((div, index) => (
          <div
            key={div.id}
            className="canvas-div"
            draggable
            style={{ 
              left: div.x, 
              top: div.y,
              backgroundColor: div.color,
              zIndex: div.zIndex,
              position: 'absolute',
              border: selectedDiv === index ? '3px solid #FFFFFF' : '',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(index);
            }}
            onDragStart={handleDragStart}
            onDragEnd={(e) => handleDragEnd(e, index)}
          >
            <p>
              {div.expanded
                ? div.text
                : div.text.length > 100
                ? `${div.text.substring(0, 100)}...`
                : div.text}
            </p>
            <button className="show-more-button" onClick={(e) => {
              e.stopPropagation();
              toggleText(index);
            }}>
              {div.expanded ? 'Show Less' : 'Show More'}
            </button>
            <button className="delete-button" onClick={(e) => deleteDiv(index, e)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      {popupVisible && popupData && (
        <Popup ref={popupRef} popupData={popupData} closePopup={() => setPopupVisible(false)} />
      )}
    </div>
  );
};

export default Canvas;
