import React from "react";

const PrintFooter: React.FC = () => {
  return (
    <div className="hidden print:block print-footer">
      <p>Fecha: {new Date().toLocaleDateString()} | VitaSpoon</p>
    </div>
  );
};

export default PrintFooter;
