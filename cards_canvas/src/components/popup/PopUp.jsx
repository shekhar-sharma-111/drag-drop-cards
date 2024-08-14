
import{ forwardRef } from 'react';
import './PopUp.css';

const Popup = forwardRef(({ popupData, closePopup }, ref) => {
  return (
    <div className="popup" style={{ backgroundColor: popupData.color }}>
      <div className="popup-content" ref={ref}>
        <h3>Div Details</h3>
        <p>ID: {popupData.id}</p>
        <p>Text: {popupData.text}</p>
        <p>Position: ({popupData.x}, {popupData.y})</p>
        <p>Color: {popupData.color}</p>
        <p>Z-Index: {popupData.zIndex}</p>
        {/* <button onClick={closePopup}>Close</button> */}
      </div>
    </div>
  );
});

export default Popup;
