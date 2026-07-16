import Lightfall from "./Lightfall";
import "./App.css";

function App() {
  return (
    <main className="page">
      <section className="lightfall-demo">
        <Lightfall
          colors={["#A6C8FF", "#5227FF", "#FF9FFC"]}
          backgroundColor="#0A29FF"
          speed={0.5}
          streakCount={2}
          streakWidth={1}
          streakLength={1}
          glow={1}
          density={0.6}
          twinkle={1}
          zoom={3}
          backgroundGlow={0.5}
          opacity={1}
          mouseInteraction
          mouseStrength={0.5}
          mouseRadius={1}
          color1="#A6C8FF"
          color2="#5227FF"
          color3="#FF9FFC"
        />

        <div className="hero-content">
          <span className="pill">Soluciones en tecnología</span>

          <h1>Impulsa tu negocio con tecnología confiable</h1>

          <p>
            Páginas web, instalación de cámaras, redes, reparación de equipo de
            cómputo, mantenimiento y soporte técnico.
          </p>

          <div className="buttons">
            <a href="https://wa.me/523333018023" target="_blank">
              Cotizar por WhatsApp
            </a>

            <a href="#servicios" className="secondary">
              Ver servicios
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;