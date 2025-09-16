import { useState } from "react";
import { RiInformationLine } from "react-icons/ri";

type MapDescriptionProps = {
  children: React.ReactNode;
};

export default function MapDescription({ children }: MapDescriptionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          style={{
            position: "absolute",
            right: 20, // adjust if you want
            bottom: 20,
            zIndex: 1100,
            background: "white",
            borderRadius: "4px",
            width: 40,
            height: 40,
            border: "1px solid #ccc",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          aria-label="Show map description"
        >
          <RiInformationLine size={18} />
        </button>
      )}
      {open && (
        <div
          style={{
            position: "absolute",
            right: "15px", // adjust to not overlap legend
            bottom: "20px",
            background: "white",
            padding: "16px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 1000,
            maxWidth: "90vw",
            maxHeight: "60vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            onDoubleClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              zIndex: 1010,
            }}
            aria-label="Close map description"
          >
            ×
          </button>
          <div style={{ paddingRight: 24 }}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
