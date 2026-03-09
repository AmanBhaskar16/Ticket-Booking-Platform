function Stars({ n }: { n: number }) {
  return (
    <span style={{ color: "#fbbf24", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

export default Stars;