// Operations gets a full-bleed layout that escapes dashboard's padded <main>.
// We use position:absolute + inset to cover the entire <main> area including its padding.
import "../../operations.css";
export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,         // covers the parent <main>'s padding area too
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >
      {children}
    </div>
  );
}
