/* =========================================================
   KRATS AEROSPACE
   JavaScript principal de la web
   Archivo: script.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. MENÚ MÓVIL
    ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links a");

    if (menuToggle && navLinks) {

        const openMenu = () => {
            navLinks.classList.add("active");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute(
                "aria-label",
                "Cerrar menú de navegación"
            );
            document.body.classList.add("menu-open");
        };

        const closeMenu = () => {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Abrir menú de navegación"
            );
            document.body.classList.remove("menu-open");
        };

        const toggleMenu = () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        };

        menuToggle.addEventListener("click", toggleMenu);

        // Cierra el menú cuando se selecciona una sección.
        navItems.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Cierra el menú con Escape.
        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                menuToggle.getAttribute("aria-expanded") === "true"
            ) {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Cierra el menú si se vuelve a una pantalla grande.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 850) {
                closeMenu();
            }
        });

        // Cierra el menú si se pulsa fuera de él.
        document.addEventListener("click", (event) => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (
                isOpen &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });
    }


    /* =====================================================
       02. AÑO AUTOMÁTICO DEL FOOTER
    ===================================================== */

    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       03. ANIMACIONES AL HACER SCROLL
    ===================================================== */

    const animatedElements = document.querySelectorAll(
        ".intro-heading, " +
        ".intro-copy, " +
        ".aircraft-card, " +
        ".solution-item, " +
        ".principle-card, " +
        ".contact-heading, " +
        ".contact-panel"
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !prefersReducedMotion) {

        // Evita mostrar elementos antes de que entren en pantalla.
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        animatedElements.forEach((element) => {
            element.classList.add("reveal-on-scroll");
            observer.observe(element);
        });

    } else {
        animatedElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }


    /* =====================================================
       04. NAVEGACIÓN Y SECCIÓN ACTIVA
    ===================================================== */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const sectionLinks = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    if ("IntersectionObserver" in window && sections.length) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    sectionLinks.forEach((link) => {
                        const isCurrent =
                            link.getAttribute("href") === `#${currentId}`;

                        if (isCurrent) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-25% 0px -65% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    /* =====================================================
       05. TARJETAS DE AERONAVES
    ===================================================== */

    const aircraftCards = document.querySelectorAll(".aircraft-card");

    aircraftCards.forEach((card) => {

        const image = card.querySelector(".aircraft-image img");

        if (!image) return;

        // Añade una clase cuando la imagen se ha cargado.
        const markImageAsLoaded = () => {
            image.classList.add("image-loaded");
        };

        if (image.complete && image.naturalWidth > 0) {
            markImageAsLoaded();
        } else {
            image.addEventListener("load", markImageAsLoaded, {
                once: true
            });
        }

        // Si la imagen falla, evita mantener una imagen rota.
        image.addEventListener("error", () => {
            image.classList.add("image-error");
            image.setAttribute("alt", "Imagen de aeronave no disponible");
        }, {
            once: true
        });
    });


    /* =====================================================
       06. ENLACES INTERNOS CON DESPLAZAMIENTO SUAVE
    ===================================================== */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]:not([href="#"])'
    );

    internalLinks.forEach((link) => {

        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href").slice(1);
            const target = document.getElementById(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });

            // Actualiza la dirección sin provocar un salto brusco.
            if (history.replaceState) {
                history.replaceState(null, "", `#${targetId}`);
            }
        });
    });


    /* =====================================================
       07. CARGA DE IMÁGENES
    ===================================================== */

    const images = document.querySelectorAll("img");

    images.forEach((image) => {

        if (!image.hasAttribute("decoding")) {
            image.setAttribute("decoding", "async");
        }

        image.addEventListener("error", () => {
            console.warn(
                "KRATS Aerospace: no se ha podido cargar una imagen:",
                image.currentSrc || image.src
            );
        }, {
            once: true
        });
    });


    /* =====================================================
       08. AÑO Y CONSOLA DE DESARROLLO
    ===================================================== */

    console.info(
        "%cKRATS AEROSPACE",
        "color: #e63946; font-size: 18px; font-weight: bold;"
    );

    console.info(
        "Ingeniería aeronáutica para conectar el mundo."
    );

});
