function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ padding: "2px 10px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "rgba(232,228,220,0.5)", textTransform: "uppercase" as const }}>
      {children}
    </span>
  );
}

export default Tag;