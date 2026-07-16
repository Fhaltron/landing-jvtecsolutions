import { useEffect, useState } from "react";
import Lightfall from "./Lightfall";
import logo from "../assets/logo.png";
import portada from "../assets/portada.png";
import "./App.css";

function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // El cambio visual funciona aunque el navegador bloquee el almacenamiento.
    }
  }, [isDark]);

  return (
    <>
      <header className="header">
        <nav className="navbar">
          <div className="brand">
            <img
              src={logo}
              alt="Logo JV TecSolutions"
              className="brand-logo"
              width="912"
              height="900"
            />

            <div>
              <strong>JV TecSolutions</strong>
              <span>Soluciones en tecnología</span>
            </div>
          </div>

          <div className="nav-actions">
            <div className="nav-links">
              <a href="#servicios">Servicios</a>
              <a href="#nosotros">Nosotros</a>
              <a href="#galeria">Galería</a>
              <a href="#contacto">Contacto</a>
            </div>

            <button
              className="theme-toggle"
              type="button"
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
              aria-pressed={isDark}
              onClick={() => setIsDark(currentTheme => !currentTheme)}
            >
              <span className="theme-icon theme-icon-moon" aria-hidden="true">
                ☾
              </span>
              <span className="theme-icon theme-icon-sun" aria-hidden="true">
                ☀
              </span>
              <span className="theme-label">{isDark ? "Modo claro" : "Modo oscuro"}</span>
            </button>
          </div>
        </nav>

        <section className="hero lightfall-hero">
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
            <p className="tag">Soluciones tecnológicas para hogar, negocio y oficina</p>

            <h1>Impulsamos tu negocio con tecnología confiable</h1>

            <p className="hero-text">
              En JV TecSolutions te ayudamos con páginas web, instalación de cámaras,
              redes, mantenimiento de computadoras, actualización de equipos y soporte técnico.
            </p>

            <div className="hero-buttons">
              <a
                href="https://wa.me/523333018023"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cotizar por WhatsApp
              </a>

              <a href="#servicios" className="btn btn-secondary">
                Ver servicios
              </a>
            </div>
          </div>

          <div className="hero-card">
            <img
              src={portada}
              alt="Portada de JV TecSolutions"
              width="1080"
              height="608"
            />
          </div>
        </section>
      </header>

      <main>
        <section className="section intro" id="nosotros">
          <div className="section-title">
            <p>Sobre nosotros</p>
            <h2>Tecnología simple, funcional y a tu medida</h2>
          </div>

          <div className="intro-grid">
            <div>
              <p>
                Somos una opción práctica para personas, emprendedores y pequeños negocios
                que necesitan soluciones tecnológicas sin complicaciones.
              </p>

              <p>
                Nuestro objetivo es ayudarte a mejorar tu presencia digital, proteger tu espacio,
                optimizar tus equipos y resolver necesidades tecnológicas del día a día.
              </p>
            </div>

            <div className="stats-card">
              <div>
                <strong>Soporte</strong>
                <span>Equipo de cómputo y software</span>
              </div>

              <div>
                <strong>Seguridad</strong>
                <span>Cámaras y monitoreo</span>
              </div>

              <div>
                <strong>Web</strong>
                <span>Páginas, hosting y correo</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section services" id="servicios">
          <div className="section-title">
            <p>Servicios</p>
            <h2>¿En qué podemos ayudarte?</h2>
          </div>

          <div className="services-grid">
            <article className="service-card">
              <div className="icon" aria-hidden="true">💻</div>
              <h3>Reparación de equipo de cómputo</h3>
              <p>
                Diagnóstico, mantenimiento preventivo y correctivo, instalación de sistemas,
                programas, reparación general y optimización de equipos.
              </p>
            </article>

            <article className="service-card">
              <div className="icon" aria-hidden="true">🌐</div>
              <h3>Páginas web</h3>
              <p>
                Creación de páginas web tipo landing page, administración de dominios,
                hosting, correos y presencia digital para negocios.
              </p>
            </article>

            <article className="service-card">
              <div className="icon" aria-hidden="true">📹</div>
              <h3>Cámaras de seguridad</h3>
              <p>
                Instalación y configuración de cámaras de seguridad para hogar o negocio,
                con acceso remoto desde celular.
              </p>
            </article>

            <article className="service-card">
              <div className="icon" aria-hidden="true">📶</div>
              <h3>Redes e internet</h3>
              <p>
                Implementación de redes, ampliación de señal WiFi, access points,
                antenas y soluciones para mejorar la cobertura de internet.
              </p>
            </article>

            <article className="service-card">
              <div className="icon" aria-hidden="true">💾</div>
              <h3>Actualización de hardware</h3>
              <p>
                Cambio a discos SSD, aumento de memoria RAM, mejoras de rendimiento,
                ensamblado de PC y venta de equipos bajo pedido.
              </p>
            </article>

            <article className="service-card">
              <div className="icon" aria-hidden="true">🏠</div>
              <h3>Smart Home</h3>
              <p>
                Automatización básica para el hogar, dispositivos inteligentes,
                conectividad y soluciones prácticas para controlar tu espacio.
              </p>
            </article>
          </div>
        </section>

        <section className="section why">
          <div className="section-title">
            <p>Por qué elegirnos</p>
            <h2>Atención clara, cercana y enfocada en soluciones</h2>
          </div>

          <div className="why-grid">
            <div className="why-item">
              <h3>Diagnóstico claro</h3>
              <p>
                Te explicamos el problema y las opciones disponibles antes de realizar el servicio.
              </p>
            </div>

            <div className="why-item">
              <h3>Soluciones prácticas</h3>
              <p>
                Buscamos alternativas funcionales de acuerdo con tu necesidad y presupuesto.
              </p>
            </div>

            <div className="why-item">
              <h3>Atención personalizada</h3>
              <p>
                Cada proyecto se adapta al tipo de cliente, espacio, equipo o negocio.
              </p>
            </div>
          </div>
        </section>

        <section className="section gallery" id="galeria">
          <div className="section-title">
            <p>Galería</p>
            <h2>Servicios que ofrecemos</h2>
          </div>

          <div className="gallery-grid">
            <img
              src="/assets/servicios-computo.jpg"
              alt="Servicio de reparación de computadoras"
            />

            <img
              src="/assets/servicios-web.jpg"
              alt="Servicio de páginas web"
            />

            <img
              src="/assets/servicios-camaras.jpg"
              alt="Servicio de cámaras de seguridad"
            />

            <img
              src="/assets/servicios-redes.jpg"
              alt="Servicio de redes e internet"
            />
          </div>
        </section>

        <section className="cta" id="contacto">
          <div className="cta-inner">
            <div>
              <p>¿Necesitas una solución tecnológica?</p>
              <h2>Cotiza con JV TecSolutions</h2>
              <span>
                Envíanos un mensaje con tus dudas para darte una mejor atención y solución.
              </span>
            </div>

            <div className="contact-buttons">
              <a
                href="https://wa.me/523333018023"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>

              <a href="mailto:jvtecsolutions@gmail.com" className="btn btn-secondary">
                Enviar correo
              </a>

              <a
                href="https://www.facebook.com/JVTecSolutions"
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 JV TecSolutions. Soluciones en tecnología.</p>
          <p>WhatsApp: 33 33 01 80 23 | jvtecsolutions@gmail.com</p>
          <p>Todos los derechos reservados</p>
        </div>

        <img
          src={logo}
          alt="Logo JV TecSolutions"
          className="footer-logo"
          width="912"
          height="900"
        />
      </footer>
    </>
  );
}

export default App;
