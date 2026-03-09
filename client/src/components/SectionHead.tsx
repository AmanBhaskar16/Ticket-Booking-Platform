import {motion} from "framer-motion";

function SecHead({ sub, title, cta }: { sub: string; title: string; cta?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
      <div>
        <p style={{ fontSize: 10, letterSpacing: 4, color: "rgba(232,228,220,0.3)", textTransform: "uppercase", marginBottom: 8 }}>{sub}</p>
        <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 46, letterSpacing: 3, color: "#fff", lineHeight: 1 }}>{title}</h2>
      </div>
      {cta && (
        <motion.a href="#" whileHover={{ color: "#ff6b35" }}
          style={{ fontSize: 11, letterSpacing: 2, color: "rgba(232,228,220,0.3)", textDecoration: "none", textTransform: "uppercase", transition: "color .2s" }}>
          {cta} →
        </motion.a>
      )}
    </motion.div>
  );
}

export default SecHead;