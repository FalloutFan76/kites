/* =========================================================
   KITES AIR
   JavaScript principal de la web
   Archivo: script.js
   Versión corregida y compatible con index.html y style.css
========================================================= */

(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        /* =====================================================
           01. CONFIGURACIÓN GENERAL
        ===================================================== */

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const mobileBreakpoint = 850;

        /*
         * Indica al CSS que JavaScript está disponible.
         * Se añade después de cargar el documento para evitar
         * dejar contenido invisible si el script no funciona.
         */

        document.documentElement.classList.add("js-enabled");


        /* =====================================================
           02. MENÚ MÓVIL
        ===================================================== */

        const menuToggle = document.querySelector(".menu-toggle");
        const navLinks = document.querySelector(".nav-links");

        if (menuToggle && navLinks) {

            const navItems = navLinks.querySelectorAll("a");

            /*
             * Inicializa el estado accesible del botón.
             */

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Abrir menú de navegación"
            );

            const isMenuOpen = () => {
                return menuToggle.getAttribute("aria-expanded") === "true";
            };

            const openMenu = () => {
                navLinks.classList.add("active");
                menuToggle.setAttribute("aria-expanded", "true");
                menuToggle.setAttribute(
                    "aria-label",
                    "Cerrar menú de navegación"
                );

                document.body.classList.add("menu-open");
            };

            const closeMenu = ({ restoreFocus = false } = {}) => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Abrir menú de navegación"
                );

                document.body.classList.remove("menu-open");

                if (restoreFocus) {
                    menuToggle.focus();
                }
            };

            menuToggle.addEventListener("click", () => {
                if (isMenuOpen()) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            /*
             * Cierra el menú al seleccionar un enlace.
             * No interfiere con enlaces a otras páginas.
             */

            navItems.forEach((link) => {
                link.addEventListener("click", () => {
                    closeMenu();
                });
            });

            /*
             * Cierra el menú con Escape y devuelve el foco
             * al botón que lo abrió.
             */

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape" && isMenuOpen()) {
                    closeMenu({ restoreFocus: true });
                }
            });

            /*
             * Cierra el menú al pulsar fuera de la navegación.
             */

            document.addEventListener("click", (event) => {
                if (!isMenuOpen()) {
                    return;
                }

                const clickedInsideMenu = navLinks.contains(event.target);
                const clickedToggle = menuToggle.contains(event.target);

                if (!clickedInsideMenu && !clickedToggle) {
                    closeMenu();
                }
            });

            /*
             * Cierra el menú al pasar a una pantalla grande.
             */

            let resizeTimer;

            window.addEventListener("resize", () => {
                window.clearTimeout(resizeTimer);

                resizeTimer = window.setTimeout(() => {
                    if (window.innerWidth > mobileBreakpoint) {
                        closeMenu();
                    }
                }, 100);
            });

            /*
             * Cierra el menú si cambia la orientación del dispositivo
             * y la nueva anchura ya no corresponde al menú móvil.
             */

            window.addEventListener("orientationchange", () => {
                if (window.innerWidth > mobileBreakpoint) {
                    closeMenu();
                }
            });
        }


        /* =====================================================
           03. AÑO AUTOMÁTICO DEL PIE DE PÁGINA
        ===================================================== */

        const currentYear = document.querySelector("#current-year");

        if (currentYear) {
            currentYear.textContent = String(new Date().getFullYear());
        }


        /* =====================================================
           04. ANIMACIONES AL DESPLAZARSE
        ===================================================== */

        const animatedElements = document.querySelectorAll(
            [
                ".intro-heading",
                ".intro-copy",
                ".aircraft-card",
                ".solution-item",
                ".principle-card",
                ".contact-heading",
                ".contact-panel"
            ].join(", ")
        );

        /*
         * Si el usuario prefiere movimiento reducido, mostramos
         * todo el contenido sin animaciones de entrada.
         */

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {

            animatedElements.forEach((element) => {
                element.classList.add("is-visible");
            });

        } else {

            const revealObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -35px 0px"
                }
            );

            animatedElements.forEach((element) => {
                element.classList.add("reveal-on-scroll");
                revealObserver.observe(element);
            });
        }


        /* =====================================================
           05. NAVEGACIÓN Y SECCIÓN ACTIVA
        ===================================================== */

        const sections = document.querySelectorAll("main section[id]");

        const sectionLinks = document.querySelectorAll(
            '.nav-links a[href^="#"]'
        );

        /*
         * Marca en la navegación la sección que está en pantalla.
         */

        if ("IntersectionObserver" in window && sections.length > 0) {

            const sectionObserver = new IntersectionObserver(
                (entries) => {
                    const visibleEntries = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort((a, b) => {
                            return b.intersectionRatio - a.intersectionRatio;
                        });

                    if (visibleEntries.length === 0) {
                        return;
                    }

                    const currentId = visibleEntries[0].target.id;

                    sectionLinks.forEach((link) => {
                        const linkTarget = link.getAttribute("href");
                        const isCurrent = linkTarget === `#${currentId}`;

                        if (isCurrent) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                },
                {
                    rootMargin: "-25% 0px -60% 0px",
                    threshold: [0, 0.1, 0.25, 0.5]
                }
            );

            sections.forEach((section) => {
                sectionObserver.observe(section);
            });
        }


        /* =====================================================
           06. CARGA Y ERRORES DE IMÁGENES
        ===================================================== */

        const images = document.querySelectorAll("img");

        images.forEach((image) => {

            /*
             * Decodificación asíncrona cuando no está configurada
             * explícitamente en el HTML.
             */

            if (!image.hasAttribute("decoding")) {
                image.setAttribute("decoding", "async");
            }

            const markImageAsLoaded = () => {
                image.classList.add("image-loaded");
                image.classList.remove("image-error");
            };

            const markImageAsError = () => {
                image.classList.remove("image-loaded");
                image.classList.add("image-error");

                console.warn(
                    "Kites Air: no se ha podido cargar una imagen:",
                    image.currentSrc || image.src
                );
            };

            /*
             * Comprueba las imágenes que ya han terminado de cargar
             * antes de registrar los eventos.
             */

            if (image.complete) {
                if (image.naturalWidth > 0) {
                    markImageAsLoaded();
                } else {
                    markImageAsError();
                }
            } else {
                image.addEventListener("load", markImageAsLoaded, {
                    once: true
                });

                image.addEventListener("error", markImageAsError, {
                    once: true
                });
            }
        });


        /* =====================================================
           07. ENLACES INTERNOS Y DESPLAZAMIENTO SUAVE
        ===================================================== */

        const internalLinks = document.querySelectorAll(
            'a[href^="#"]:not([href="#"])'
        );

        internalLinks.forEach((link) => {

            link.addEventListener("click", (event) => {

                /*
                 * Solo procesamos enlaces a elementos existentes
                 * en esta misma página.
                 */

                const href = link.getAttribute("href");

                if (!href || href.length < 2) {
                    return;
                }

                let targetId;

                try {
                    targetId = decodeURIComponent(href.slice(1));
                } catch {
                    return;
                }

                const target = document.getElementById(targetId);

                if (!target) {
                    return;
                }

                /*
                 * Dejamos que el navegador gestione los enlaces
                 * si se mantiene pulsada una tecla modificadora.
                 */

                if (
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                ) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "start"
                });

                /*
                 * Actualiza el fragmento de la URL sin generar
                 * un salto brusco ni añadir entradas al historial.
                 */

                try {
                    if (window.history && window.history.replaceState) {
                        window.history.replaceState(
                            null,
                            "",
                            `#${encodeURIComponent(targetId)}`
                        );
                    }
                } catch (error) {
                    console.warn(
                        "Kites Air: no se ha podido actualizar la URL.",
                        error
                    );
                }
            });
        });


        /* =====================================================
           08. PREVENCIÓN DE ERRORES EN ELEMENTOS OPCIONALES
        ===================================================== */

        /*
         * No se presupone que todos los elementos existan en todas
         * las páginas. Esto permite reutilizar el script en páginas
         * con estructuras ligeramente distintas.
         */

        const mainContent = document.querySelector("main");

        if (mainContent && !mainContent.hasAttribute("tabindex")) {
            /*
             * No añadimos tabindex automáticamente: el contenido
             * principal no necesita recibir el foco por defecto.
             */
        }


        /* =====================================================
           09. MENSAJE DE DESARROLLO
        ===================================================== */

        console.info(
            "%cKITES AIR",
            "color: #e63946; font-size: 18px; font-weight: bold;"
        );

        console.info(
            "Sitio web inicializado correctamente."
        );

    });
})();
