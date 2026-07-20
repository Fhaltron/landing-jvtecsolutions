import { useEffect, useRef, useState } from "react";
import Lightfall from "./Lightfall";
import logo from "../assets/logo.png";
import portada from "../assets/portada.png";
import "./App.css";

const LIGHTFALL_COLORS = Object.freeze(["#A6C8FF", "#5227FF", "#FF9FFC"]);

const hideUnavailableImage = event => {
  event.currentTarget.hidden = true;
};

function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });
  const [useDarkNavText, setUseDarkNavText] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // El cambio visual funciona aunque el navegador bloquee el almacenamiento.
    }
  }, [isDark]);

  useEffect(() => {
    let contrastTimer;

    const updateNavContrast = () => {
      const navbar = navbarRef.current;
      if (!navbar) return;

      const navbarRect = navbar.getBoundingClientRect();
      const sampleX = window.innerWidth / 2;
      const sampleY = Math.min(
        window.innerHeight - 1,
        navbarRect.top + navbarRect.height / 2,
      );

      const backgroundElement = document
        .elementsFromPoint(sampleX, sampleY)
        .find(element => !navbar.contains(element));
      const region = backgroundElement?.closest("[data-nav-tone]");
      const tone = region?.dataset.navTone;
      const hasLightBackground = tone === "light" || (tone === "theme" && !isDark);

      setUseDarkNavText(currentValue =>
        currentValue === hasLightBackground ? currentValue : hasLightBackground,
      );
    };

    const scheduleContrastUpdate = () => {
      if (contrastTimer) return;
      contrastTimer = window.setTimeout(() => {
        contrastTimer = undefined;
        updateNavContrast();
      }, 80);
    };

    updateNavContrast();
    window.addEventListener("scroll", scheduleContrastUpdate, { passive: true });
    window.addEventListener("resize", scheduleContrastUpdate);

    return () => {
      window.clearTimeout(contrastTimer);
      window.removeEventListener("scroll", scheduleContrastUpdate);
      window.removeEventListener("resize", scheduleContrastUpdate);
    };
  }, [isDark]);

  return (
    <>
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido principal
      </a>

      <header className="header" id="inicio" data-nav-tone="dark">
        <nav
          ref={navbarRef}
          className={`navbar ${useDarkNavText ? "navbar--dark-text" : "navbar--light-text"}`}
          aria-label="Navegación principal"
        >
          <div className="brand">
            <a className="brand-logo-link" href="#inicio" aria-label="Volver al inicio">
              <img
                src={logo}
                alt="Logo JV TecSolutions"
                className="brand-logo"
                width="912"
                height="900"
                decoding="async"
              />
            </a>

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

        <section className="hero lightfall-hero" data-nav-tone="dark">
          <Lightfall
            colors={LIGHTFALL_COLORS}
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
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </section>
      </header>

      <main id="contenido-principal">
        <section className="section intro" id="nosotros" data-nav-tone="theme">
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

        <section className="section services" id="servicios" data-nav-tone="theme">
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

        <section className="section why" data-nav-tone="theme">
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

        <section className="section gallery" id="galeria" data-nav-tone="theme">
          <div className="section-title">
            <p>Galería</p>
            <h2>Servicios que ofrecemos</h2>
          </div>

          <div className="gallery-grid">
            <img
              src="/assets/servicios-computo.jpg"
              alt="Servicio de reparación de computadoras"
              loading="lazy"
              decoding="async"
              onError={hideUnavailableImage}
            />

            <img
              src="/assets/servicios-web.jpg"
              alt="Servicio de páginas web"
              loading="lazy"
              decoding="async"
              onError={hideUnavailableImage}
            />

            <img
              src="/assets/servicios-camaras.jpg"
              alt="Servicio de cámaras de seguridad"
              loading="lazy"
              decoding="async"
              onError={hideUnavailableImage}
            />

            <img
              src="/assets/servicios-redes.jpg"
              alt="Servicio de redes e internet"
              loading="lazy"
              decoding="async"
              onError={hideUnavailableImage}
            />
          </div>
        </section>

        <section className="cta" id="contacto" data-nav-tone="theme">
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

      <footer className="footer" data-nav-tone="theme">
        <div className="footer-content">
          <nav className="social-links" aria-label="Redes sociales y contacto">
            <a
              href="https://www.facebook.com/JVTecSolutions"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Facebook de JV TecSolutions"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v7h4v-7h3.2l.8-4h-4V9c0-.7.3-1 1-1Z" />
              </svg>
            </a>

            <a
              href="https://wa.me/523333018023"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 11.7A8 8 0 0 1 8.1 18.6L4 20l1.4-4A8 8 0 1 1 20 11.7Z" />
                <path d="M9 8.2c.3-.5.6-.5.9-.5h.4l.8 2c.1.3 0 .5-.2.7l-.6.7c.8 1.6 1.9 2.7 3.5 3.5l.7-.8c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.4.4.7-.2 1.3-1.2 2-2.5 2-3.8 0-8-4-8-7.8 0-.5.2-.9.5-1.2.4-.4 1-.4 1.5 0Z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/jv_tecsolutions/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Instagram de JV TecSolutions"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle className="social-icon-dot" cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>

            <a href="mailto:jvtecsolutions@gmail.com" aria-label="Enviar correo a JV TecSolutions">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
          </nav>

          <p>© 2026 JV TecSolutions - Soluciones en Tecnología. Todos los derechos reservados.</p>
        </div>

        <img
          src={logo}
          alt="Logo JV TecSolutions"
          className="footer-logo"
          width="912"
          height="900"
          loading="lazy"
          decoding="async"
        />
      </footer>
    </>
  );
}

export default App;
