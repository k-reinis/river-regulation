type LegendEntryProps = {
    color: string;
    name: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  };
  
  export default function LegendEntry({ color, name, checked, onChange }: LegendEntryProps) {
    return (
      <div style={{ display: "flex", alignItems: "center", margin: "4px 0" }}               
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}>

        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onClick={e => {
            e.stopPropagation(); // Prevent click from bubbling to parent/map
          }}
          style={{ marginRight: "8px" }}
        />
        <div
          style={{
            width: "24px",
            height: "5px",
            background: color,
            marginRight: "8px",
            borderRadius: "2px",
          }}
        />
        <span>{name}</span>
      </div>
    );
  }
  