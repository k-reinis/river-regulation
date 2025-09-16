import React from 'react';

interface LegendEntryProps {
  color: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const LegendEntry: React.FC<LegendEntryProps> = ({ color, name, checked, onChange }) => {
  return (
    <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        margin: "4px 0",
        cursor: "pointer",
        userSelect: "none"
      }}
      onClick={() => onChange(!checked)}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginRight: "8px" }}
        onClick={(e) => e.stopPropagation()} // Prevent double-toggle when clicking checkbox directly
      />
      <div
        style={{
          width: "20px",
          height: "3px",
          backgroundColor: color,
          marginRight: "8px",
        }}
      />
      <span style={{ cursor: "pointer" }}>{name}</span>
    </div>
  );
};

export default LegendEntry;
