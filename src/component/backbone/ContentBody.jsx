export default function ContentBody({ children }) {
  return (
    <div
      className="overflow-y-auto"
      style={{ minHeight: "50vh", marginTop: "4.5rem" }}
    >
      {children}
    </div>
  );
}
