/**
 * ============================================================================
 * 3D PERSONAL PORTFOLIO INTERACTIVE ENGINE
 * Client: Himanshu Kumar Singh (B.Tech Student & Cybersecurity Enthusiast)
 * Features:
 *   1. Fullscreen 3D WebGL Cyber Space Matrix (Three.js with Canvas2D fallback)
 *   2. Interactive 3D Holographic Quantum Core (Drag-to-rotate, gyro rings, HUD)
 *   3. Hero View Switcher (3D Quantum Core <-> Security Profile)
 *   4. Universal 3D Tilt Engine with Dynamic Specular Glare
 *   5. High-Tech 3D Cyber Cursor Follower
 *   6. Sticky Header Elevation & Active Nav ScrollSpy
 *   7. Interactive Contact Form Validation & Transmission Feedback
 *   8. Smooth In-Page Anchor Navigation & Intersection Scroll Reveal
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // 1. MOBILE NAVIGATION DRAWER TOGGLE
    // ========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.contains('open');
            if (isOpen) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMobileNav();
                navToggle.focus();
            }
        });
    }

    function openMobileNav() {
        navMenu.classList.add('open');
        navToggle.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }


    // ========================================================================
    // 2. STICKY HEADER & ACTIVE NAVIGATION LINK ON SCROLL (rAF Throttled)
    // ========================================================================
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    let scrollTicking = false;
    let cachedSections = [];

    function cacheSectionPositions() {
        cachedSections = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop - 120,
            height: section.offsetHeight,
            link: document.querySelector(`.nav-link[href*="${section.getAttribute('id')}"]`)
        }));
    }
    cacheSectionPositions();
    window.addEventListener('resize', cacheSectionPositions, { passive: true });
    window.addEventListener('orientationchange', cacheSectionPositions, { passive: true });

    function handleScrollUpdates() {
        const scrollY = window.pageYOffset || window.scrollY;

        // Sticky Header Elevation
        if (header) {
            if (scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Active Nav Link Scrollspy (Zero layout reflow during scroll)
        for (let i = 0; i < cachedSections.length; i++) {
            const item = cachedSections[i];
            if (item.link) {
                if (scrollY >= item.top && scrollY < item.top + item.height) {
                    item.link.classList.add('active');
                } else {
                    item.link.classList.remove('active');
                }
            }
        }

        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(handleScrollUpdates);
            scrollTicking = true;
        }
    }, { passive: true });
    handleScrollUpdates();


    // ========================================================================
    // 4. CONTACT FORM VALIDATION & TRANSMISSION FEEDBACK
    // ========================================================================
    const contactForm = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const sendBtn = document.getElementById('sendMessageBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            resetValidationErrors();

            const nameVal = nameInput ? nameInput.value.trim() : '';
            if (!nameVal || nameVal.length < 2) {
                showInputError(nameInput, 'Please enter a valid name (at least 2 characters).');
                isValid = false;
            }

            const emailVal = emailInput ? emailInput.value.trim() : '';
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailVal || !emailPattern.test(emailVal)) {
                showInputError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            const messageVal = messageInput ? messageInput.value.trim() : '';
            if (!messageVal || messageVal.length < 10) {
                showInputError(messageInput, 'Message should be at least 10 characters long.');
                isValid = false;
            }

            if (!isValid) {
                showAlert('Please fill in all required fields correctly.', 'error');
                return;
            }

            if (sendBtn) {
                const originalHtml = sendBtn.innerHTML;
                sendBtn.disabled = true;
                sendBtn.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                    <span>Encrypting & Transmitting...</span>
                `;

                setTimeout(() => {
                    sendBtn.disabled = false;
                    sendBtn.innerHTML = originalHtml;
                    showAlert('Transmission sent successfully! Himanshu will respond shortly.', 'success');
                    contactForm.reset();
                }, 850);
            }
        });

        [nameInput, emailInput, messageInput].forEach(input => {
            if (!input) return;
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group && group.classList.contains('has-error')) {
                    group.classList.remove('has-error');
                }
            });
        });
    }

    function showInputError(inputElem, message) {
        if (!inputElem) return;
        const group = inputElem.closest('.form-group');
        if (group) {
            group.classList.add('has-error');
            const errorMsgSpan = group.querySelector('.input-error-msg');
            if (errorMsgSpan && message) {
                errorMsgSpan.textContent = message;
            }
        }
    }

    function resetValidationErrors() {
        const errorGroups = document.querySelectorAll('.form-group.has-error');
        errorGroups.forEach(grp => grp.classList.remove('has-error'));
        if (formAlert) {
            formAlert.style.display = 'none';
            formAlert.className = 'form-alert';
        }
    }

    function showAlert(message, type) {
        if (!formAlert) return;
        formAlert.textContent = message;
        formAlert.className = `form-alert ${type}`;
        formAlert.style.display = 'block';
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }


    // ========================================================================
    // 5. SMOOTH SCROLL WITH HEADER OFFSET
    // ========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = header ? header.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (navHeight + 10);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ========================================================================
    // 6. SCROLL REVEAL ANIMATIONS
    // ========================================================================
    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll(
            '.skill-card, .project-card, .pillar-card, .education-card, .contact-info-card, .dossier-card, .cert-card, .gh-repo-card, .li-post-card'
        );
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            el.classList.add('reveal-init');
            revealObserver.observe(el);
        });
    }


    // ========================================================================
    // 7. 3D CYBER CURSOR FOLLOWER
    // ========================================================================
    const cursorDot = document.getElementById('cursor3dDot');
    const cursorRing = document.getElementById('cursor3dRing');

    if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }, { passive: true });

        function animateCursor() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);

        const interactiveTargets = document.querySelectorAll(
            'a, button, input, textarea, .mode-tab, .skill-card, .project-card, .pillar-card, .education-card, .contact-info-card, .dossier-card, .avatar-card-wrapper'
        );

        interactiveTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
        });
    }


    // ========================================================================
    // 8. UNIVERSAL 3D CARD TILT ENGINE WITH SPECULAR GLARE
    // ========================================================================
    const tiltCardSelectors = [
        '.skill-card',
        '.project-card',
        '.pillar-card',
        '.education-card',
        '.contact-info-card',
        '.dossier-card',
        '.avatar-card-wrapper',
        '.cert-card',
        '.gh-repo-card',
        '.li-post-card'
    ];

    const tiltCards = document.querySelectorAll(tiltCardSelectors.join(', '));
    const isTouchDevice = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (!isTouchDevice) {
        tiltCards.forEach(card => {
        let glare = card.querySelector('.card-3d-glare');
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'card-3d-glare';
            card.appendChild(glare);
        }

        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.transition = 'transform 0.1s ease-out';
            glare.style.opacity = '1';
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = -((y - centerY) / centerY) * 12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025) translateZ(8px)`;

            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0, 242, 254, 0.25) 0%, transparent 60%)`;
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0)';
            glare.style.opacity = '0';
        });
    });
    }


    // ========================================================================
    // 9. HERO 3D VIEW TOGGLE (3D QUANTUM CORE <-> SECURITY AVATAR)
    // ========================================================================
    const tab3d = document.getElementById('tab3dCore');
    const tabAvatar = document.getElementById('tabAvatar');
    const hero3dContainer = document.getElementById('hero3dContainer');
    const heroAvatarCard = document.getElementById('heroAvatarCard');

    if (tab3d && tabAvatar && hero3dContainer && heroAvatarCard) {
        tab3d.addEventListener('click', () => {
            tab3d.classList.add('active');
            tabAvatar.classList.remove('active');
            tab3d.setAttribute('aria-selected', 'true');
            tabAvatar.setAttribute('aria-selected', 'false');
            hero3dContainer.classList.add('active');
            heroAvatarCard.classList.add('hidden');
            if (window.resizeHero3D) {
                window.resizeHero3D();
            }
        });

        tabAvatar.addEventListener('click', () => {
            tabAvatar.classList.add('active');
            tab3d.classList.remove('active');
            tabAvatar.setAttribute('aria-selected', 'true');
            tab3d.setAttribute('aria-selected', 'false');
            hero3dContainer.classList.remove('active');
            heroAvatarCard.classList.remove('hidden');
        });
    }


    // ========================================================================
    // 10. 3D WEBGL ENGINE: HERO INTERACTIVE QUANTUM CORE (Three.js)
    // ========================================================================
    function initHero3DCore() {
        const canvas = document.getElementById('hero3dCanvas');
        const container = document.getElementById('hero3dContainer');
        const hudFps = document.getElementById('hudFps');
        const hudUptime = document.getElementById('hudUptime');
        const hudWaveform = document.getElementById('hudWaveform');
        const hudCenterHint = document.getElementById('hudCenterHint');
        if (!canvas || !container) return;

        if (typeof THREE === 'undefined') {
            initHero2DFallback(canvas);
            return;
        }

        try {
            const scene = new THREE.Scene();
            const width = container.clientWidth || 380;
            const height = container.clientHeight || 380;

            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            camera.position.z = 8.5;

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio, 1.25));

            function resizeHero3D() {
                const w = container.clientWidth || 380;
                const h = container.clientHeight || 380;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
            window.resizeHero3D = resizeHero3D;
            window.addEventListener('resize', resizeHero3D);

            // Core Group
            const coreGroup = new THREE.Group();
            scene.add(coreGroup);

            // ====================================================================
            // A. BACKGROUND ROTATING LASER BEAM SYSTEM (Softened Light Colors & Ambient Glow)
            // ====================================================================
            const laserSystemGroup = new THREE.Group();
            laserSystemGroup.position.z = -1.2;
            scene.add(laserSystemGroup);

            // 1. Array of Soft Luminous Light-Colored Rotating Laser Beams
            const laserColors = [
                0x7dd3fc, // Soft Light Sky Cyan
                0xf472b6, // Soft Light Rose Pink
                0x6ee7b7, // Soft Light Mint Emerald
                0xc084fc, // Soft Light Lavender Purple
                0xfde047, // Soft Light Solar Gold
                0x93c5fd  // Soft Light Azure
            ];

            const laserBeams = [];
            const laserBeamCount = 6;
            const beamLength = 22;

            for (let i = 0; i < laserBeamCount; i++) {
                const angle = (i / laserBeamCount) * Math.PI;
                const beamGroup = new THREE.Group();
                beamGroup.rotation.z = angle;

                // Core Laser (soft light beam, gentle translucent luminescence)
                const coreGeom = new THREE.CylinderGeometry(0.024, 0.024, beamLength, 8, 1, true);
                const coreMat = new THREE.MeshBasicMaterial({
                    color: laserColors[i],
                    transparent: true,
                    opacity: 0.32,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide
                });
                const coreMesh = new THREE.Mesh(coreGeom, coreMat);
                beamGroup.add(coreMesh);

                // Laser Outer Glow Sheath (soft gentle ambient haze)
                const haloGeom = new THREE.CylinderGeometry(0.12, 0.18, beamLength, 12, 1, true);
                const haloMat = new THREE.MeshBasicMaterial({
                    color: laserColors[i],
                    transparent: true,
                    opacity: 0.10,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide
                });
                const haloMesh = new THREE.Mesh(haloGeom, haloMat);
                beamGroup.add(haloMesh);

                // Laser Spark Nodes along the beam (subtle stardust sparks)
                const sparkCount = 6;
                const sparkGeom = new THREE.BufferGeometry();
                const sparkPos = new Float32Array(sparkCount * 3);
                for (let s = 0; s < sparkCount; s++) {
                    sparkPos[s * 3] = (Math.random() - 0.5) * 0.08;
                    sparkPos[s * 3 + 1] = (Math.random() - 0.5) * beamLength;
                    sparkPos[s * 3 + 2] = (Math.random() - 0.5) * 0.08;
                }
                sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
                const sparkMat = new THREE.PointsMaterial({
                    color: laserColors[i],
                    size: 0.07,
                    transparent: true,
                    opacity: 0.35,
                    blending: THREE.AdditiveBlending
                });
                const sparks = new THREE.Points(sparkGeom, sparkMat);
                beamGroup.add(sparks);

                laserSystemGroup.add(beamGroup);
                laserBeams.push({ group: beamGroup, coreMat, haloMat, sparks });
            }

            // 2. Rotating Sweeping Holographic Radar Laser Fan (Gentle Soft Aura)
            const radarGeom = new THREE.RingGeometry(0.8, 5.2, 32, 1, 0, Math.PI / 2.2);
            const radarMat = new THREE.MeshBasicMaterial({
                color: 0x7dd3fc,
                transparent: true,
                opacity: 0.08,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            const laserRadarFan = new THREE.Mesh(radarGeom, radarMat);
            laserRadarFan.position.z = -0.5;
            laserSystemGroup.add(laserRadarFan);

            // 3. Central Laser Core Emitter Ring (Soft Light Cyan)
            const emitterGeom = new THREE.TorusGeometry(0.65, 0.035, 16, 32);
            const emitterMat = new THREE.MeshBasicMaterial({
                color: 0x7dd3fc,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending
            });
            const emitterRing = new THREE.Mesh(emitterGeom, emitterMat);
            emitterRing.position.z = -0.3;
            laserSystemGroup.add(emitterRing);


            // ====================================================================
            // A2. 3D SOLAR SYSTEM CELESTIAL ENGINE (Souryamandal: Free 3D Cosmic Planetary Movement)
            // Planets freely orbiting and rotating in 3D without rigid axes or tracks
            // ====================================================================
            const solarSystemGroup = new THREE.Group();
            solarSystemGroup.position.z = -1.8;
            scene.add(solarSystemGroup);

            // Procedural Canvas Texture Generator for Solar System Planets
            function createPlanetTexture(type) {
                const pCanvas = document.createElement('canvas');
                pCanvas.width = 128;
                pCanvas.height = 64;
                const pCtx = pCanvas.getContext('2d');
                if (!pCtx) return null;

                if (type === 'mercury') {
                    // Mercury: Cratered rocky slate surface
                    pCtx.fillStyle = '#9ca3af';
                    pCtx.fillRect(0, 0, 128, 64);
                    for (let i = 0; i < 35; i++) {
                        pCtx.fillStyle = i % 2 === 0 ? 'rgba(75, 85, 99, 0.45)' : 'rgba(229, 231, 235, 0.4)';
                        pCtx.beginPath();
                        pCtx.arc(Math.random() * 128, Math.random() * 64, Math.random() * 3.5 + 1, 0, Math.PI * 2);
                        pCtx.fill();
                    }
                } else if (type === 'venus') {
                    // Venus: Golden-cream pearlescent atmospheric swirls
                    const grad = pCtx.createLinearGradient(0, 0, 128, 64);
                    grad.addColorStop(0, '#fef08a');
                    grad.addColorStop(0.5, '#fde047');
                    grad.addColorStop(1, '#f59e0b');
                    pCtx.fillStyle = grad;
                    pCtx.fillRect(0, 0, 128, 64);
                    pCtx.fillStyle = 'rgba(255, 255, 255, 0.28)';
                    for (let i = 0; i < 6; i++) {
                        pCtx.fillRect(0, i * 11, 128, 5);
                    }
                } else if (type === 'earth') {
                    // Earth: Azure oceans, emerald landmasses & white cloud swirls
                    pCtx.fillStyle = '#1d4ed8';
                    pCtx.fillRect(0, 0, 128, 64);
                    pCtx.fillStyle = '#10b981';
                    pCtx.beginPath();
                    pCtx.ellipse(35, 25, 20, 14, 0.2, 0, Math.PI * 2);
                    pCtx.fill();
                    pCtx.beginPath();
                    pCtx.ellipse(85, 38, 22, 16, -0.3, 0, Math.PI * 2);
                    pCtx.fill();
                    pCtx.beginPath();
                    pCtx.ellipse(45, 48, 12, 10, 0.1, 0, Math.PI * 2);
                    pCtx.fill();
                    pCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                    for (let i = 0; i < 5; i++) {
                        pCtx.beginPath();
                        pCtx.ellipse(i * 26 + 10, 15 + (i % 3) * 12, 16, 4, 0.1, 0, Math.PI * 2);
                        pCtx.fill();
                    }
                } else if (type === 'mars') {
                    // Mars: Rust terracotta with polar ice caps
                    const grad = pCtx.createLinearGradient(0, 0, 0, 64);
                    grad.addColorStop(0, '#ffffff'); // Polar ice
                    grad.addColorStop(0.12, '#ea580c');
                    grad.addColorStop(0.5, '#dc2626');
                    grad.addColorStop(0.88, '#c2410c');
                    grad.addColorStop(1, '#ffffff'); // Polar ice
                    pCtx.fillStyle = grad;
                    pCtx.fillRect(0, 0, 128, 64);
                    pCtx.fillStyle = 'rgba(127, 29, 29, 0.35)';
                    for (let i = 0; i < 12; i++) {
                        pCtx.fillRect(Math.random() * 120, Math.random() * 48 + 8, Math.random() * 18 + 4, Math.random() * 6 + 2);
                    }
                } else if (type === 'jupiter') {
                    // Jupiter: Banded gas giant with Great Red Spot
                    const bands = ['#d97706', '#fef3c7', '#b45309', '#fde68a', '#92400e', '#fed7aa', '#c2410c', '#fef9c3'];
                    bands.forEach((color, idx) => {
                        pCtx.fillStyle = color;
                        pCtx.fillRect(0, idx * 8, 128, 8);
                    });
                    pCtx.fillStyle = '#dc2626';
                    pCtx.beginPath();
                    pCtx.ellipse(75, 42, 12, 6, 0, 0, Math.PI * 2);
                    pCtx.fill();
                } else if (type === 'saturn') {
                    // Saturn: Warm golden caramel stripes
                    const bands = ['#fef08a', '#fde68a', '#f59e0b', '#fef3c7', '#d97706', '#fef08a'];
                    bands.forEach((color, idx) => {
                        pCtx.fillStyle = color;
                        pCtx.fillRect(0, idx * 11, 128, 11);
                    });
                } else if (type === 'saturn-ring') {
                    // Saturn Rings: Concentric golden radial bands
                    pCanvas.width = 128;
                    pCanvas.height = 128;
                    const radGrad = pCtx.createRadialGradient(64, 64, 25, 64, 64, 64);
                    radGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
                    radGrad.addColorStop(0.35, 'rgba(254, 240, 138, 0.7)');
                    radGrad.addColorStop(0.55, 'rgba(217, 119, 6, 0.85)');
                    radGrad.addColorStop(0.7, 'rgba(254, 240, 138, 0.55)');
                    radGrad.addColorStop(0.85, 'rgba(180, 83, 9, 0.35)');
                    radGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
                    pCtx.fillStyle = radGrad;
                    pCtx.fillRect(0, 0, 128, 128);
                } else if (type === 'uranus') {
                    // Uranus: Pale cyan ice giant
                    const grad = pCtx.createLinearGradient(0, 0, 0, 64);
                    grad.addColorStop(0, '#a5f3fc');
                    grad.addColorStop(0.5, '#67e8f9');
                    grad.addColorStop(1, '#06b6d4');
                    pCtx.fillStyle = grad;
                    pCtx.fillRect(0, 0, 128, 64);
                } else if (type === 'neptune') {
                    // Neptune: Deep electric cobalt blue
                    const grad = pCtx.createLinearGradient(0, 0, 0, 64);
                    grad.addColorStop(0, '#38bdf8');
                    grad.addColorStop(0.5, '#2563eb');
                    grad.addColorStop(1, '#1e40af');
                    pCtx.fillStyle = grad;
                    pCtx.fillRect(0, 0, 128, 64);
                    pCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                    pCtx.fillRect(10, 24, 60, 2);
                    pCtx.fillRect(40, 36, 75, 2);
                } else if (type === 'pluto') {
                    // Pluto: Icy silver-amethyst orb
                    pCtx.fillStyle = '#c4b5fd';
                    pCtx.fillRect(0, 0, 128, 64);
                    pCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    pCtx.beginPath();
                    pCtx.arc(64, 32, 16, 0, Math.PI * 2);
                    pCtx.fill();
                }

                return new THREE.CanvasTexture(pCanvas);
            }

            // Celestial Planets Data Configuration (Solar System / Souryamandal)
            const planetConfigs = [
                { name: 'Mercury', type: 'mercury', radius: 0.085, orbitRadius: 2.3, speed: 0.58, baseAngle: 0.3, tilt: 0.22, wobbleFreq: 1.4, verticalAmp: 0.35, glowColor: 0x9ca3af, rotSpeed: 0.015 },
                { name: 'Venus',   type: 'venus',   radius: 0.14,  orbitRadius: 2.85, speed: 0.44, baseAngle: 1.7, tilt: -0.32, wobbleFreq: 1.2, verticalAmp: 0.45, glowColor: 0xfde047, rotSpeed: -0.008 },
                { name: 'Earth',   type: 'earth',   radius: 0.16,  orbitRadius: 3.45, speed: 0.35, baseAngle: 3.2, tilt: 0.38, wobbleFreq: 1.0, verticalAmp: 0.50, glowColor: 0x38bdf8, hasMoon: true, rotSpeed: 0.02 },
                { name: 'Mars',    type: 'mars',    radius: 0.11,  orbitRadius: 4.05, speed: 0.28, baseAngle: 4.6, tilt: -0.25, wobbleFreq: 1.1, verticalAmp: 0.42, glowColor: 0xef4444, rotSpeed: 0.018 },
                { name: 'Jupiter', type: 'jupiter', radius: 0.32,  orbitRadius: 4.75, speed: 0.20, baseAngle: 0.8, tilt: 0.18, wobbleFreq: 0.8, verticalAmp: 0.36, glowColor: 0xf59e0b, rotSpeed: 0.028 },
                { name: 'Saturn',  type: 'saturn',  radius: 0.25,  orbitRadius: 5.45, speed: 0.15, baseAngle: 2.5, tilt: -0.42, wobbleFreq: 0.7, verticalAmp: 0.45, glowColor: 0xfde68a, hasRing: true, rotSpeed: 0.022 },
                { name: 'Uranus',  type: 'uranus',  radius: 0.19,  orbitRadius: 6.10, speed: 0.11, baseAngle: 4.0, tilt: 0.52, wobbleFreq: 0.6, verticalAmp: 0.48, glowColor: 0x22d3ee, hasFaintRing: true, rotSpeed: 0.014 },
                { name: 'Neptune', type: 'neptune', radius: 0.18,  orbitRadius: 6.70, speed: 0.08, baseAngle: 5.4, tilt: -0.28, wobbleFreq: 0.5, verticalAmp: 0.40, glowColor: 0x3b82f6, rotSpeed: 0.016 },
                { name: 'Pluto',   type: 'pluto',   radius: 0.065, orbitRadius: 7.25, speed: 0.06, baseAngle: 1.1, tilt: 0.65, wobbleFreq: 1.3, verticalAmp: 0.65, glowColor: 0xc4b5fd, rotSpeed: 0.01 }
            ];

            const solarPlanets = [];

            planetConfigs.forEach((cfg) => {
                const planetGroup = new THREE.Group();

                // Planet Sphere with procedural surface texture
                const sphereGeom = new THREE.SphereGeometry(cfg.radius, 24, 24);
                const sphereMat = new THREE.MeshBasicMaterial({
                    map: createPlanetTexture(cfg.type),
                    transparent: true,
                    opacity: 0.94
                });
                const planetMesh = new THREE.Mesh(sphereGeom, sphereMat);
                planetGroup.add(planetMesh);

                // Planet Atmospheric Soft Glow Halo
                const haloGeom = new THREE.SphereGeometry(cfg.radius * 1.25, 16, 16);
                const haloMat = new THREE.MeshBasicMaterial({
                    color: cfg.glowColor,
                    transparent: true,
                    opacity: 0.20,
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide
                });
                const haloMesh = new THREE.Mesh(haloGeom, haloMat);
                planetMesh.add(haloMesh);

                // Earth's Moon (Freely orbiting Earth)
                let moonMesh = null;
                if (cfg.hasMoon) {
                    const moonGeom = new THREE.SphereGeometry(0.042, 12, 12);
                    const moonMat = new THREE.MeshBasicMaterial({
                        color: 0xe2e8f0,
                        transparent: true,
                        opacity: 0.9
                    });
                    moonMesh = new THREE.Mesh(moonGeom, moonMat);
                    planetGroup.add(moonMesh);
                }

                // Saturn's Rings (3D Tilted Concentric Rings)
                if (cfg.hasRing) {
                    const ringGeom = new THREE.RingGeometry(cfg.radius * 1.35, cfg.radius * 2.45, 32);
                    const ringMat = new THREE.MeshBasicMaterial({
                        map: createPlanetTexture('saturn-ring'),
                        transparent: true,
                        opacity: 0.82,
                        side: THREE.DoubleSide
                    });
                    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
                    ringMesh.rotation.x = Math.PI * 0.42;
                    ringMesh.rotation.y = Math.PI * 0.08;
                    planetMesh.add(ringMesh);
                }

                // Uranus Faint Vertical Ring
                if (cfg.hasFaintRing) {
                    const uRingGeom = new THREE.RingGeometry(cfg.radius * 1.28, cfg.radius * 1.65, 32);
                    const uRingMat = new THREE.MeshBasicMaterial({
                        color: 0x67e8f9,
                        transparent: true,
                        opacity: 0.32,
                        side: THREE.DoubleSide
                    });
                    const uRingMesh = new THREE.Mesh(uRingGeom, uRingMat);
                    uRingMesh.rotation.y = Math.PI * 0.48;
                    planetMesh.add(uRingMesh);
                }

                solarSystemGroup.add(planetGroup);

                solarPlanets.push({
                    group: planetGroup,
                    mesh: planetMesh,
                    moonMesh: moonMesh,
                    cfg: cfg
                });
            });


            // ====================================================================
            // B. 3D QUANTUM CORE: COLORFUL MULTI-LAYERED CRYSTAL
            // ====================================================================
            // 1. Center Inner Ruby/Magenta Crystal
            const innerOctaGeom = new THREE.OctahedronGeometry(0.85, 0);
            const innerOctaMat = new THREE.MeshBasicMaterial({
                color: 0xff007f, // Hot Neon Pink/Magenta
                wireframe: false,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            });
            const innerOctaMesh = new THREE.Mesh(innerOctaGeom, innerOctaMat);
            coreGroup.add(innerOctaMesh);

            // 2. Center Glowing Quantum Sphere (Cyan Core)
            const sphereGeometry = new THREE.SphereGeometry(0.5, 24, 24);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0x00f2fe,
                wireframe: false,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending
            });
            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            coreGroup.add(sphereMesh);

            // 3. Middle Faceted Electric Sky Wireframe Octahedron
            const midOctaGeom = new THREE.OctahedronGeometry(1.4, 0);
            const midOctaMat = new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                wireframe: true,
                transparent: true,
                opacity: 0.85
            });
            const octaMesh = new THREE.Mesh(midOctaGeom, midOctaMat);
            coreGroup.add(octaMesh);

            // 4. Outer Geodesic Icosahedron Cage (Violet & Cyan)
            const icosaGeometry = new THREE.IcosahedronGeometry(2.3, 1);
            const icosaMaterial = new THREE.MeshBasicMaterial({
                color: 0xa855f7, // Electric Violet
                wireframe: true,
                transparent: true,
                opacity: 0.55
            });
            const icosaMesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
            coreGroup.add(icosaMesh);


            // ====================================================================
            // C. 4 VIBRANT MULTI-COLORED CONCENTRIC GYROSCOPE RINGS
            // ====================================================================
            // Ring 1: Neon Cyan
            const ring1Geom = new THREE.TorusGeometry(3.05, 0.035, 16, 100);
            const ring1Mat = new THREE.MeshBasicMaterial({
                color: 0x00f2fe,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            });
            const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
            ring1.rotation.x = Math.PI / 3;
            coreGroup.add(ring1);

            // Ring 2: Electric Magenta / Pink
            const ring2Geom = new THREE.TorusGeometry(3.4, 0.035, 16, 100);
            const ring2Mat = new THREE.MeshBasicMaterial({
                color: 0xff007f,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            });
            const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
            ring2.rotation.y = Math.PI / 4;
            coreGroup.add(ring2);

            // Ring 3: Royal Purple
            const ring3Geom = new THREE.TorusGeometry(2.7, 0.03, 16, 80);
            const ring3Mat = new THREE.MeshBasicMaterial({
                color: 0x8b5cf6,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
            ring3.rotation.x = Math.PI / 2;
            ring3.rotation.z = Math.PI / 6;
            coreGroup.add(ring3);

            // Ring 4: Solar Amber Gold
            const ring4Geom = new THREE.TorusGeometry(2.35, 0.026, 16, 70);
            const ring4Mat = new THREE.MeshBasicMaterial({
                color: 0xfbbf24,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending
            });
            const ring4 = new THREE.Mesh(ring4Geom, ring4Mat);
            ring4.rotation.y = Math.PI / 3;
            ring4.rotation.x = Math.PI / 6;
            coreGroup.add(ring4);


            // ====================================================================
            // D. 6 SKILL SATELLITES & VIBRANT LASER ENERGY BEAMS
            // ====================================================================
            const skillNodes = [
                { name: 'Python',    color: 0x00f2fe, angle: 0 },
                { name: 'ML / AI',   color: 0xd946ef, angle: Math.PI / 3 },
                { name: 'Data Sci',  color: 0x10b981, angle: (2 * Math.PI) / 3 },
                { name: 'SQL',       color: 0xfbbf24, angle: Math.PI },
                { name: 'IoT',       color: 0xf43f5e, angle: (4 * Math.PI) / 3 },
                { name: 'Web Dev',   color: 0x38bdf8, angle: (5 * Math.PI) / 3 }
            ];

            const satelliteGroup = new THREE.Group();
            const satelliteRefs = [];
            const beamRefs = [];

            skillNodes.forEach((node) => {
                // Satellite Node Sphere
                const nodeGeom = new THREE.SphereGeometry(0.17, 16, 16);
                const nodeMat = new THREE.MeshBasicMaterial({
                    color: node.color,
                    transparent: true,
                    opacity: 0.95,
                    blending: THREE.AdditiveBlending
                });
                const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);

                // Halo ring for each satellite
                const glowRing = new THREE.Mesh(
                    new THREE.TorusGeometry(0.28, 0.02, 8, 32),
                    new THREE.MeshBasicMaterial({
                        color: node.color,
                        transparent: true,
                        opacity: 0.65,
                        blending: THREE.AdditiveBlending
                    })
                );
                nodeMesh.add(glowRing);

                satelliteGroup.add(nodeMesh);

                // Soft Luminous Colored Laser Energy Beam from core to satellite
                const beamGeom = new THREE.BufferGeometry();
                const beamMat = new THREE.LineBasicMaterial({
                    color: node.color,
                    transparent: true,
                    opacity: 0.35,
                    blending: THREE.AdditiveBlending
                });
                const beamLine = new THREE.Line(beamGeom, beamMat);
                coreGroup.add(beamLine);

                // Laser Photon Pulse Bead traveling along beam
                const photonGeom = new THREE.SphereGeometry(0.052, 8, 8);
                const photonMat = new THREE.MeshBasicMaterial({
                    color: node.color,
                    transparent: true,
                    opacity: 0.65,
                    blending: THREE.AdditiveBlending
                });
                const photon = new THREE.Mesh(photonGeom, photonMat);
                coreGroup.add(photon);

                satelliteRefs.push({
                    mesh: nodeMesh,
                    data: node,
                    glowRing: glowRing,
                    photon: photon
                });
                beamRefs.push(beamLine);
            });
            coreGroup.add(satelliteGroup);


            // ====================================================================
            // E. DUAL HELIX QUANTUM DATA STREAMS (CYAN & MAGENTA)
            // ====================================================================
            const helixCount = 140;
            const helixGeom = new THREE.BufferGeometry();
            const helixPositions = new Float32Array(helixCount * 3);
            const helixColors = new Float32Array(helixCount * 3);

            for (let i = 0; i < helixCount; i++) {
                const t = (i / helixCount) * Math.PI * 8;
                const r = 1.7 + Math.sin(t * 0.5) * 0.4;
                const strand = i % 2 === 0 ? 1 : -1;
                helixPositions[i * 3] = r * Math.cos(t) * strand;
                helixPositions[i * 3 + 1] = (i / helixCount - 0.5) * 5.5;
                helixPositions[i * 3 + 2] = r * Math.sin(t) * strand;

                // Alternate between Cyan (0, 242, 254) and Hot Pink (255, 0, 127)
                if (i % 2 === 0) {
                    helixColors[i * 3] = 0.0;
                    helixColors[i * 3 + 1] = 0.95;
                    helixColors[i * 3 + 2] = 1.0;
                } else {
                    helixColors[i * 3] = 1.0;
                    helixColors[i * 3 + 1] = 0.0;
                    helixColors[i * 3 + 2] = 0.5;
                }
            }
            helixGeom.setAttribute('position', new THREE.BufferAttribute(helixPositions, 3));
            helixGeom.setAttribute('color', new THREE.BufferAttribute(helixColors, 3));

            const helixMat = new THREE.PointsMaterial({
                size: 0.055,
                transparent: true,
                opacity: 0.85,
                vertexColors: true,
                blending: THREE.AdditiveBlending
            });
            const helixParticles = new THREE.Points(helixGeom, helixMat);
            coreGroup.add(helixParticles);


            // ====================================================================
            // F. MULTI-COLORED AMBIENT CYBER DUST
            // ====================================================================
            const particleCount = 120;
            const particleGeom = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            const particleColors = new Float32Array(particleCount * 3);
            const colorChoices = [
                [0.0, 0.95, 1.0],   // Cyan
                [1.0, 0.16, 0.5],   // Pink
                [0.65, 0.33, 0.97], // Purple
                [0.06, 0.72, 0.5],  // Emerald
                [0.98, 0.75, 0.14]  // Gold
            ];

            for (let i = 0; i < particleCount; i++) {
                const u = Math.random();
                const v = Math.random();
                const theta = u * 2.0 * Math.PI;
                const phi = Math.acos(2.0 * v - 1.0);
                const r = 2.6 + Math.random() * 2.0;
                const sinPhi = Math.sin(phi);

                particlePositions[i * 3] = r * sinPhi * Math.cos(theta);
                particlePositions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
                particlePositions[i * 3 + 2] = r * Math.cos(phi);

                const c = colorChoices[i % colorChoices.length];
                particleColors[i * 3] = c[0];
                particleColors[i * 3 + 1] = c[1];
                particleColors[i * 3 + 2] = c[2];
            }
            particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

            const particleMat = new THREE.PointsMaterial({
                size: 0.06,
                transparent: true,
                opacity: 0.8,
                vertexColors: true,
                blending: THREE.AdditiveBlending
            });
            const particles = new THREE.Points(particleGeom, particleMat);
            coreGroup.add(particles);

            // Atmospheric Outer Field
            const atmoGeom = new THREE.SphereGeometry(3.8, 32, 32);
            const atmoMat = new THREE.MeshBasicMaterial({
                color: 0x00f2fe,
                transparent: true,
                opacity: 0.04,
                side: THREE.BackSide
            });
            const atmoSphere = new THREE.Mesh(atmoGeom, atmoMat);
            coreGroup.add(atmoSphere);

            // Interactive Drag Controls with Inertia
            let isDragging = false;
            let prevPointer = { x: 0, y: 0 };
            let rotVelocity = { x: 0, y: 0 };
            let hasInteracted = false;

            container.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'touch') return;
                isDragging = true;
                prevPointer = { x: e.clientX, y: e.clientY };
                if (!hasInteracted && hudCenterHint) {
                    hasInteracted = true;
                    hudCenterHint.style.opacity = '0';
                    setTimeout(() => { hudCenterHint.style.display = 'none'; }, 600);
                }
            });

            window.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - prevPointer.x;
                const deltaY = e.clientY - prevPointer.y;
                rotVelocity.y += deltaX * 0.004;
                rotVelocity.x += deltaY * 0.004;
                prevPointer = { x: e.clientX, y: e.clientY };
            });

            window.addEventListener('pointerup', () => {
                isDragging = false;
            });

            // Container Hover Parallax Tilt
            let hoverTilt = { x: 0, y: 0 };
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                hoverTilt.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.4;
                hoverTilt.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
            });
            container.addEventListener('mouseleave', () => {
                hoverTilt = { x: 0, y: 0 };
            });

            // Resize Helper
            window.resizeHero3D = () => {
                const newW = container.clientWidth || 380;
                const newH = container.clientHeight || 380;
                camera.aspect = newW / newH;
                camera.updateProjectionMatrix();
                renderer.setSize(newW, newH);
            };
            window.addEventListener('resize', window.resizeHero3D);

            // ---- HUD TELEMETRY LOGIC ----
            const startTime = Date.now();

            // Uptime Timer
            function updateUptime() {
                if (!hudUptime) return;
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
                const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
                const s = String(elapsed % 60).padStart(2, '0');
                hudUptime.textContent = `${h}:${m}:${s}`;
            }
            setInterval(updateUptime, 1000);

            // Gauge Animation — simulate fluctuating load
            function animateGauges() {
                const gauges = [
                    { el: document.querySelector('.gauge-cpu'), valEl: document.getElementById('gaugeCpuVal'), base: 72, range: 15 },
                    { el: document.querySelector('.gauge-mem'), valEl: document.getElementById('gaugeMemVal'), base: 58, range: 12 },
                    { el: document.querySelector('.gauge-net'), valEl: document.getElementById('gaugeNetVal'), base: 89, range: 8 }
                ];
                gauges.forEach(g => {
                    if (!g.el || !g.valEl) return;
                    const val = Math.min(99, Math.max(20, g.base + Math.round((Math.random() - 0.5) * g.range)));
                    g.el.setAttribute('stroke-dasharray', `${val}, 100`);
                    g.valEl.textContent = `${val}%`;
                });
            }
            setInterval(animateGauges, 2500);

            // Skill Feed Cycling
            const intelFeed = document.getElementById('hudIntelFeed');
            let activeIntelIdx = 0;
            function cycleIntelFeed() {
                if (!intelFeed) return;
                const lines = intelFeed.querySelectorAll('.intel-line');
                lines.forEach(l => l.classList.remove('active'));
                activeIntelIdx = (activeIntelIdx + 1) % lines.length;
                lines[activeIntelIdx].classList.add('active');
            }
            setInterval(cycleIntelFeed, 2000);

            // Count-Up Animation
            document.querySelectorAll('.hud-count-up').forEach(el => {
                const target = parseInt(el.dataset.target, 10);
                let current = 0;
                const step = Math.ceil(target / 30);
                const interval = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(interval); }
                    el.textContent = current;
                }, 50);
            });

            // Neural Waveform Canvas & Visibility Controls
            let isHeroVisible = true;
            let heroAnimId = null;
            let waveAnimId = null;

            function drawWaveform() {
                if (!hudWaveform) return;
                if (!isHeroVisible) {
                    waveAnimId = null;
                    return;
                }
                const ctx = hudWaveform.getContext('2d');
                if (!ctx) return;
                hudWaveform.width = hudWaveform.clientWidth || 300;
                const w = hudWaveform.width;
                const h = hudWaveform.height;
                ctx.clearRect(0, 0, w, h);

                const now = Date.now() * 0.003;
                ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                for (let x = 0; x < w; x++) {
                    const y = h / 2 + Math.sin(x * 0.08 + now) * (h * 0.3) + Math.sin(x * 0.03 + now * 0.7) * (h * 0.15);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Second wave (indigo)
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let x = 0; x < w; x++) {
                    const y = h / 2 + Math.sin(x * 0.06 + now * 1.3) * (h * 0.25);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();

                waveAnimId = requestAnimationFrame(drawWaveform);
            }

            // FPS Counter Tracker
            let frameCount = 0;
            let lastFpsCheck = performance.now();

            // Main Animation Loop
            let clock = new THREE.Clock();

            function animateHero() {
                if (!isHeroVisible) {
                    heroAnimId = null;
                    return;
                }
                heroAnimId = requestAnimationFrame(animateHero);

                const delta = clock.getDelta();
                const time = clock.getElapsedTime();

                // 1. ROTATING BACKGROUND LASER BEAM SWEEP (Softened Light Colors & Ambient Glow)
                // Multi-axis rotation produces dynamic sweeping laser rays across the entire background
                laserSystemGroup.rotation.z += 0.012;
                laserSystemGroup.rotation.x = Math.sin(time * 0.35) * 0.22;
                laserSystemGroup.rotation.y = Math.cos(time * 0.3) * 0.18;

                // Pulsate background laser beams with gentle, soft light intensity (not harsh or glaring)
                laserBeams.forEach((lb, idx) => {
                    const pulse = 0.28 + Math.sin(time * 2.2 + idx * 1.1) * 0.08;
                    lb.coreMat.opacity = pulse;
                    lb.haloMat.opacity = pulse * 0.35;
                    lb.sparks.rotation.y += 0.015;
                });

                // Radar fan continuous laser sweep (soft gentle glow)
                laserRadarFan.rotation.z -= 0.018;

                // Emitter ring soft pulse
                emitterRing.scale.setScalar(1 + Math.sin(time * 3) * 0.08);

                // 2. 3D SOLAR SYSTEM CELESTIAL MECHANICS (Souryamandal: Free 3D Movement Without Rigid Axes/Tracks)
                // Parallax following and gentle cosmic drift in background
                solarSystemGroup.position.x = coreGroup.position.x * 0.38;
                solarSystemGroup.position.y = coreGroup.position.y * 0.38;
                solarSystemGroup.rotation.y += 0.0012;
                solarSystemGroup.rotation.x = Math.sin(time * 0.18) * 0.05;

                // All solar planets orbiting and moving completely freely in 3D space
                solarPlanets.forEach((p, idx) => {
                    const cfg = p.cfg;
                    const angle = cfg.baseAngle + time * cfg.speed;

                    // 3D dynamic free-flight non-planar orbital mechanics
                    const orbRadius = cfg.orbitRadius;
                    const rawX = Math.cos(angle) * orbRadius;
                    const rawZ = Math.sin(angle) * (orbRadius * 0.88);

                    // 3D inclined orbital tilt without any rigid mechanical axis
                    const cosTilt = Math.cos(cfg.tilt);
                    const sinTilt = Math.sin(cfg.tilt);
                    const x = rawX * cosTilt - rawZ * sinTilt;
                    const z = rawX * sinTilt + rawZ * cosTilt;

                    // Weightless free-floating zero-gravity vertical & depth bobbing
                    const floatY = Math.sin(angle * cfg.wobbleFreq + idx) * cfg.verticalAmp + Math.cos(time * 0.45 + idx * 0.8) * 0.16;
                    const floatZ = z + Math.sin(time * 0.35 + idx) * 0.20;

                    p.group.position.set(x, floatY, floatZ);

                    // Planet independent 3D self-rotation
                    p.mesh.rotation.y += cfg.rotSpeed;
                    p.mesh.rotation.x = Math.sin(time * 0.25 + idx) * 0.08;

                    // Earth's moon free orbit around Earth
                    if (p.moonMesh) {
                        const moonAngle = time * 2.2;
                        p.moonMesh.position.set(
                            Math.cos(moonAngle) * 0.36,
                            Math.sin(moonAngle * 1.4) * 0.12,
                            Math.sin(moonAngle) * 0.36
                        );
                    }
                });

                // 3. Rotational physics with damping for Core Group
                coreGroup.rotation.y += rotVelocity.y + 0.005;
                coreGroup.rotation.x += rotVelocity.x;
                rotVelocity.x *= 0.94;
                rotVelocity.y *= 0.94;

                // Subtle Parallax orientation
                coreGroup.position.x += (hoverTilt.x - coreGroup.position.x) * 0.08;
                coreGroup.position.y += (-hoverTilt.y - coreGroup.position.y) * 0.08;
                laserSystemGroup.position.x = coreGroup.position.x * 0.5;
                laserSystemGroup.position.y = coreGroup.position.y * 0.5;

                // 4. Multi-axis Independent Gyroscope Rotations
                ring1.rotation.z += 0.012;
                ring2.rotation.z -= 0.015;
                ring3.rotation.z += 0.009;
                ring4.rotation.y += 0.011;

                octaMesh.rotation.y -= 0.012;
                octaMesh.rotation.x += 0.008;

                innerOctaMesh.rotation.y += 0.022;
                innerOctaMesh.rotation.z -= 0.018;

                // 5. Pulsing Quantum Core Scale
                const pulse = 1 + Math.sin(time * 3.0) * 0.12;
                sphereMesh.scale.set(pulse, pulse, pulse);
                innerOctaMesh.scale.set(pulse, pulse, pulse);

                // Atmosphere breathing
                const atmoPulse = 0.04 + Math.sin(time * 1.5) * 0.02;
                atmoMat.opacity = atmoPulse;

                // 6. Orbiting Satellites, Soft Laser Beams & Photons
                const orbitRadius = 3.5;
                satelliteRefs.forEach((sat, i) => {
                    const angle = sat.data.angle + time * 0.32;
                    const yOff = Math.sin(time * 0.85 + i) * 0.55;
                    sat.mesh.position.set(
                        orbitRadius * Math.cos(angle),
                        yOff,
                        orbitRadius * Math.sin(angle)
                    );

                    // Pulsing satellite halo ring
                    const glowPulse = 0.5 + Math.sin(time * 3 + i * 1.2) * 0.25;
                    sat.glowRing.material.opacity = glowPulse;
                    sat.glowRing.rotation.z += 0.03;

                    // Update soft laser energy beam connecting core to satellite
                    const beamPositions = new Float32Array([
                        0, 0, 0,
                        sat.mesh.position.x, sat.mesh.position.y, sat.mesh.position.z
                    ]);
                    beamRefs[i].geometry.dispose();
                    beamRefs[i].geometry = new THREE.BufferGeometry();
                    beamRefs[i].geometry.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
                    beamRefs[i].material.opacity = 0.30 + Math.sin(time * 3 + i) * 0.12;

                    // Traveling photon pulse bead along the beam
                    const travelProg = (Math.sin(time * 2.5 + i * 1.5) + 1) * 0.5; // 0 to 1
                    sat.photon.position.set(
                        sat.mesh.position.x * travelProg,
                        sat.mesh.position.y * travelProg,
                        sat.mesh.position.z * travelProg
                    );
                });

                // 6. Data Stream Helix rotation
                helixParticles.rotation.y += 0.01;
                helixParticles.rotation.x = Math.sin(time * 0.3) * 0.15;

                // 7. Ambient Cyber Dust Orbit
                particles.rotation.y -= 0.005;
                particles.rotation.x = Math.sin(time * 0.2) * 0.06;

                renderer.render(scene, camera);

                // Update FPS Tag
                frameCount++;
                const now = performance.now();
                if (now - lastFpsCheck >= 1000) {
                    const fps = Math.round((frameCount * 1000) / (now - lastFpsCheck));
                    if (hudFps) hudFps.textContent = `${fps} FPS`;
                    frameCount = 0;
                    lastFpsCheck = now;
                }
            }

            // IntersectionObserver to pause Hero 3D rendering when scrolled out of view (Silky 60fps scrolling)
            if ('IntersectionObserver' in window) {
                const heroObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        isHeroVisible = entry.isIntersecting;
                        if (isHeroVisible) {
                            if (!heroAnimId) {
                                clock.start();
                                heroAnimId = requestAnimationFrame(animateHero);
                            }
                            if (!waveAnimId && hudWaveform) {
                                waveAnimId = requestAnimationFrame(drawWaveform);
                            }
                        } else {
                            if (heroAnimId) {
                                cancelAnimationFrame(heroAnimId);
                                heroAnimId = null;
                            }
                            if (waveAnimId) {
                                cancelAnimationFrame(waveAnimId);
                                waveAnimId = null;
                            }
                        }
                    });
                }, { threshold: 0.02 });
                heroObserver.observe(container);
            } else {
                heroAnimId = requestAnimationFrame(animateHero);
                waveAnimId = requestAnimationFrame(drawWaveform);
            }

        } catch (err) {
            console.warn('Three.js WebGL initialization failed, switching to 2D fallback:', err);
            initHero2DFallback(canvas);
        }
    }

    // Canvas 2D Fallback for Hero Core
    function initHero2DFallback(canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let angle = 0;

        function draw2D() {
            canvas.width = canvas.clientWidth || 360;
            canvas.height = canvas.clientHeight || 360;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Outer Orbit
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);

            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-65, -65, 130, 130);

            ctx.rotate(angle * 1.5);
            ctx.strokeStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(0, 0, 85, 0, Math.PI * 2);
            ctx.stroke();

            // Inner Pulsing Core
            ctx.fillStyle = '#00f2fe';
            ctx.beginPath();
            const r = 25 + Math.sin(angle * 4) * 6;
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            angle += 0.015;
            requestAnimationFrame(draw2D);
        }
        draw2D();
    }


    // ========================================================================
    // 11. 3D WEBGL ENGINE: FULLSCREEN CYBERSPACE MATRIX BACKGROUND (Three.js)
    // ========================================================================
    function init3DBackground() {
        const bgCanvas = document.getElementById('bg3dCanvas');
        if (!bgCanvas) return;

        // Bypass background 3D WebGL completely on mobile screens (<= 768px) to eliminate GPU load and ensure 60/120fps touch scrolling
        if (window.innerWidth <= 768) {
            bgCanvas.style.display = 'none';
            return;
        }

        if (typeof THREE === 'undefined') {
            initBg2DFallback(bgCanvas);
            return;
        }

        try {
            const scene = new THREE.Scene();
            // Soft deep atmospheric fog that keeps light colors delicate and ethereal
            scene.fog = new THREE.FogExp2(0x050a16, 0.0006);

            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2400);
            camera.position.z = 440;

            const renderer = new THREE.WebGLRenderer({
                canvas: bgCanvas,
                alpha: true,
                antialias: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(1);

            // ================================================================
            // 1. SOFT LIGHT MULTI-SPECTRAL AMBIENT STARDUST (750 Light Particles)
            // ================================================================
            const particleCount = 750;
            const starGeom = new THREE.BufferGeometry();
            const starPos = new Float32Array(particleCount * 3);
            const starColors = new Float32Array(particleCount * 3);

            // Very light, delicate pastel colors (Soft Ice Cyan, Lavender, Mint, Pale Gold, White)
            const lightPalette = [
                new THREE.Color(0xffffff), // Pure Crisp Starlight
                new THREE.Color(0xbae6fd), // Soft Ice Sky
                new THREE.Color(0xa5f3fc), // Light Ethereal Cyan
                new THREE.Color(0xe9d5ff), // Light Pastel Lavender
                new THREE.Color(0xa7f3d0), // Soft Mint
                new THREE.Color(0xfef08a)  // Pale Solar Amber
            ];

            for (let i = 0; i < particleCount; i++) {
                starPos[i * 3]     = (Math.random() - 0.5) * 1800;
                starPos[i * 3 + 1] = (Math.random() - 0.5) * 1400;
                starPos[i * 3 + 2] = (Math.random() - 0.5) * 1400;

                const c = lightPalette[Math.floor(Math.random() * lightPalette.length)];
                starColors[i * 3]     = c.r;
                starColors[i * 3 + 1] = c.g;
                starColors[i * 3 + 2] = c.b;
            }

            starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
            starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

            const starMat = new THREE.PointsMaterial({
                size: 2.6,
                vertexColors: true,
                transparent: true,
                opacity: 0.55,
                blending: THREE.AdditiveBlending
            });

            const starField = new THREE.Points(starGeom, starMat);
            scene.add(starField);

            // ================================================================
            // 2. TECH ROLE: AI & MACHINE LEARNING (3D DEEP NEURAL NETWORK & SYNAPSES)
            // ================================================================
            const neuralNetGroup = new THREE.Group();
            scene.add(neuralNetGroup);

            // 4-Layer Architecture: Input (4) -> Hidden1 (6) -> Hidden2 (6) -> Output (4)
            const layerDefinitions = [
                { count: 4, x: -360, color: 0xa5f3fc, spanY: 220 }, // Input Layer (Light Cyan)
                { count: 6, x: -120, color: 0xd8b4fe, spanY: 280 }, // Hidden Layer 1 (Light Lavender)
                { count: 6, x:  120, color: 0xbae6fd, spanY: 280 }, // Hidden Layer 2 (Light Sky)
                { count: 4, x:  360, color: 0xa7f3d0, spanY: 220 }  // Output Layer (Light Mint)
            ];

            const neuralLayers = [];
            const allNeurons = [];
            const synapticPaths = []; // Connection pairs for signal pulses

            // Build Neuron Nodes
            layerDefinitions.forEach((def, lIdx) => {
                const layerNodes = [];
                const stepY = def.spanY / (def.count - 1 || 1);

                for (let i = 0; i < def.count; i++) {
                    const y = (i * stepY) - (def.spanY / 2);
                    const z = (Math.random() - 0.5) * 80 - 60;

                    // Core Neuron Sphere
                    const nGeom = new THREE.SphereGeometry(3.6, 16, 16);
                    const nMat = new THREE.MeshBasicMaterial({
                        color: def.color,
                        transparent: true,
                        opacity: 0.75,
                        blending: THREE.AdditiveBlending
                    });
                    const nMesh = new THREE.Mesh(nGeom, nMat);
                    nMesh.position.set(def.x, y, z);
                    neuralNetGroup.add(nMesh);

                    // Delicate Halo Aura
                    const haloGeom = new THREE.SphereGeometry(6.5, 12, 12);
                    const haloMat = new THREE.MeshBasicMaterial({
                        color: def.color,
                        transparent: true,
                        opacity: 0.22,
                        blending: THREE.AdditiveBlending,
                        side: THREE.BackSide
                    });
                    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
                    nMesh.add(haloMesh);

                    const nodeObj = {
                        mesh: nMesh,
                        halo: haloMesh,
                        basePos: new THREE.Vector3(def.x, y, z),
                        color: def.color,
                        layerIdx: lIdx
                    };

                    layerNodes.push(nodeObj);
                    allNeurons.push(nodeObj);
                }
                neuralLayers.push(layerNodes);
            });

            // Build Synaptic Inter-Layer Connections (Dense Weights)
            const synapseSegments = [];
            for (let l = 0; l < neuralLayers.length - 1; l++) {
                const currentLayer = neuralLayers[l];
                const nextLayer = neuralLayers[l + 1];

                currentLayer.forEach(n1 => {
                    nextLayer.forEach(n2 => {
                        synapseSegments.push(n1.mesh.position.x, n1.mesh.position.y, n1.mesh.position.z);
                        synapseSegments.push(n2.mesh.position.x, n2.mesh.position.y, n2.mesh.position.z);
                        synapticPaths.push({ from: n1, to: n2 });
                    });
                });
            }

            const synapseGeom = new THREE.BufferGeometry();
            synapseGeom.setAttribute('position', new THREE.Float32BufferAttribute(synapseSegments, 3));
            const synapseMat = new THREE.LineBasicMaterial({
                color: 0x7dd3fc, // Soft Light Sky
                transparent: true,
                opacity: 0.16, // Very light, delicate
                blending: THREE.AdditiveBlending
            });
            const synapseLines = new THREE.LineSegments(synapseGeom, synapseMat);
            neuralNetGroup.add(synapseLines);

            // Dynamic Action Potential Pulses (Luminous signal beads moving between layers)
            const pulseCount = 18;
            const signalPulses = [];
            const pulseGeom = new THREE.SphereGeometry(2.0, 10, 10);

            for (let p = 0; p < pulseCount; p++) {
                const pMat = new THREE.MeshBasicMaterial({
                    color: 0xfef08a, // Soft Light Gold
                    transparent: true,
                    opacity: 0.85,
                    blending: THREE.AdditiveBlending
                });
                const pMesh = new THREE.Mesh(pulseGeom, pMat);
                neuralNetGroup.add(pMesh);

                const randomPath = synapticPaths[Math.floor(Math.random() * synapticPaths.length)];
                signalPulses.push({
                    mesh: pMesh,
                    path: randomPath,
                    progress: Math.random(),
                    speed: 0.008 + Math.random() * 0.012
                });
            }

            // ================================================================
            // 3. TECH ROLE: DATA ANALYTICS (3D MATHEMATICAL LOSS SURFACE & SCATTER WAVE)
            // ================================================================
            const gridDimX = 26;
            const gridDimZ = 26;
            const totalDataPoints = gridDimX * gridDimZ;
            const dataPointGeom = new THREE.BufferGeometry();
            const dataPointPos = new Float32Array(totalDataPoints * 3);
            const dataPointColors = new Float32Array(totalDataPoints * 3);

            const gridSpanX = 1100;
            const gridSpanZ = 850;

            for (let ix = 0; ix < gridDimX; ix++) {
                for (let iz = 0; iz < gridDimZ; iz++) {
                    const idx = ix * gridDimZ + iz;
                    const u = ix / (gridDimX - 1);
                    const v = iz / (gridDimZ - 1);

                    const x = (u - 0.5) * gridSpanX;
                    const z = (v - 0.5) * gridSpanZ - 120;
                    const y = -140;

                    dataPointPos[idx * 3]     = x;
                    dataPointPos[idx * 3 + 1] = y;
                    dataPointPos[idx * 3 + 2] = z;

                    // Light-colored gradient along the data matrix
                    dataPointColors[idx * 3]     = 0.65 + u * 0.25; // Light R
                    dataPointColors[idx * 3 + 1] = 0.85 + (1 - v) * 0.12; // Light G
                    dataPointColors[idx * 3 + 2] = 0.95 + v * 0.05; // Light B
                }
            }

            dataPointGeom.setAttribute('position', new THREE.BufferAttribute(dataPointPos, 3));
            dataPointGeom.setAttribute('color', new THREE.BufferAttribute(dataPointColors, 3));

            const dataPointMat = new THREE.PointsMaterial({
                size: 3.0,
                vertexColors: true,
                transparent: true,
                opacity: 0.38, // Light & delicate
                blending: THREE.AdditiveBlending
            });

            const dataLossSurface = new THREE.Points(dataPointGeom, dataPointMat);
            scene.add(dataLossSurface);

            // ================================================================
            // 4. DATA ANALYTICS: 3D HOLOGRAPHIC METRIC RADAR RINGS
            // ================================================================
            const metricRing1 = new THREE.Mesh(
                new THREE.TorusGeometry(220, 1.4, 16, 80),
                new THREE.MeshBasicMaterial({ color: 0xa5f3fc, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending })
            );
            metricRing1.position.set(0, 0, -560);
            metricRing1.rotation.x = Math.PI * 0.38;
            scene.add(metricRing1);

            const metricRing2 = new THREE.Mesh(
                new THREE.TorusGeometry(290, 1.2, 16, 80),
                new THREE.MeshBasicMaterial({ color: 0xd8b4fe, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending })
            );
            metricRing2.position.set(0, 0, -780);
            metricRing2.rotation.y = Math.PI * 0.44;
            scene.add(metricRing2);

            // ================================================================
            // 5. LIGHT PERSPECTIVE CYBER GRID FLOOR (Cruise Animation)
            // ================================================================
            const gridHelper = new THREE.GridHelper(2600, 52, 0x38bdf8, 0x0f223d);
            gridHelper.position.y = -225;
            gridHelper.material.opacity = 0.16; // Delicate, light
            gridHelper.material.transparent = true;
            scene.add(gridHelper);

            // Parallax mouse & scroll variables
            let targetX = 0;
            let targetY = 0;
            let targetZ = 440;
            let currentScrollY = 0;

            window.addEventListener('mousemove', (e) => {
                targetX = ((e.clientX / window.innerWidth) - 0.5) * 110;
                targetY = -((e.clientY / window.innerHeight) - 0.5) * 80;
            }, { passive: true });

            let isUserScrolling = false;
            let userScrollTimer = null;

            window.addEventListener('scroll', () => {
                isUserScrolling = true;
                currentScrollY = window.pageYOffset || window.scrollY;
                clearTimeout(userScrollTimer);
                userScrollTimer = setTimeout(() => {
                    isUserScrolling = false;
                }, 120);
            }, { passive: true });

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(1);
            });

            let bgClock = new THREE.Clock();
            let bgFrameCount = 0;

            // Main 3D Background Animation Loop
            function animateBg() {
                requestAnimationFrame(animateBg);

                // Update camera depth based on scroll progress
                const scrollProgress = currentScrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
                targetZ = 440 - scrollProgress * 320;
                camera.position.z += (targetZ - camera.position.z) * 0.08;

                // When user is actively scrolling, skip CPU-heavy geometry and pulse loops to ensure butter-smooth 60fps scrolling
                if (isUserScrolling) {
                    renderer.render(scene, camera);
                    return;
                }

                const bgTime = bgClock.getElapsedTime();
                bgFrameCount++;

                // 1. Starfield Ambient Slow Twinkle
                starField.rotation.y += 0.0004;

                // 2. Infinite Forward Gentle Cruise on Grid Floor
                gridHelper.position.z = (bgTime * 45) % (2600 / 52);

                // 3. AI / Deep Neural Network Wave & Dynamic Synaptic Signals
                neuralNetGroup.rotation.y = Math.sin(bgTime * 0.25) * 0.12;
                neuralNetGroup.rotation.x = Math.cos(bgTime * 0.2) * 0.08;

                // Neuron Gentle Breathing / Synapse Activation
                allNeurons.forEach((n, idx) => {
                    const wave = Math.sin(bgTime * 2.0 + idx * 0.6) * 0.12;
                    n.mesh.scale.set(1 + wave, 1 + wave, 1 + wave);
                    n.halo.material.opacity = 0.18 + Math.sin(bgTime * 2.5 + idx * 0.8) * 0.08;
                });

                // Update Synaptic Signal Action Potential Pulses
                signalPulses.forEach(sp => {
                    sp.progress += sp.speed;
                    if (sp.progress >= 1.0) {
                        sp.progress = 0;
                        sp.path = synapticPaths[Math.floor(Math.random() * synapticPaths.length)];
                    }
                    const pA = sp.path.from.mesh.position;
                    const pB = sp.path.to.mesh.position;
                    sp.mesh.position.lerpVectors(pA, pB, sp.progress);
                });

                // 4. Data Analytics Mathematical Loss Surface Undulation (Optimized every 2nd frame)
                if (bgFrameCount % 2 === 0) {
                    const posArr = dataLossSurface.geometry.attributes.position.array;
                    for (let ix = 0; ix < gridDimX; ix++) {
                        for (let iz = 0; iz < gridDimZ; iz++) {
                            const idx = (ix * gridDimZ + iz) * 3;
                            const u = ix * 0.22;
                            const v = iz * 0.22;
                            const waveY = -140 + Math.sin(u + bgTime * 1.2) * Math.cos(v + bgTime * 0.9) * 22 + Math.sin(u * 0.5 + bgTime * 0.6) * 10;
                            posArr[idx + 1] = waveY;
                        }
                    }
                    dataLossSurface.geometry.attributes.position.needsUpdate = true;
                }

                // 5. Rotate Holographic Metric Radar Rings
                metricRing1.rotation.z += 0.0018;
                metricRing2.rotation.z -= 0.0014;

                // 6. Dynamic 3D Camera Parallax & Subtle Spatial Roll
                camera.position.x += (targetX - camera.position.x) * 0.05;
                camera.position.y += (targetY - camera.position.y) * 0.05;
                camera.position.z += (targetZ - camera.position.z) * 0.05;
                camera.rotation.z += (-targetX * 0.00018 - camera.rotation.z) * 0.05;
                camera.rotation.x += (-targetY * 0.00012 - camera.rotation.x) * 0.05;

                renderer.render(scene, camera);
            }
            animateBg();

        } catch (err) {
            console.warn('Three.js background initialization failed, using 2D fallback:', err);
            initBg2DFallback(bgCanvas);
        }
    }

    // Canvas 2D Fallback for Background
    function initBg2DFallback(canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const dots = [];
        for (let i = 0; i < 90; i++) {
            dots.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1
            });
        }

        function draw2DBg() {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = 'rgba(0, 242, 254, 0.6)';
            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
                d.x += d.vx;
                d.y += d.vy;

                if (d.x < 0) d.x = width;
                if (d.x > width) d.x = 0;
                if (d.y < 0) d.y = height;
                if (d.y > height) d.y = 0;

                ctx.beginPath();
                ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < dots.length; j++) {
                    const d2 = dots[j];
                    const dist = Math.hypot(d.x - d2.x, d.y - d2.y);
                    if (dist < 110) {
                        ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(d.x, d.y);
                        ctx.lineTo(d2.x, d2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw2DBg);
        }
        draw2DBg();
    }

    // ========================================================================
    // 12. SKILLS CATEGORY FILTER ENGINE
    // ========================================================================
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    if (filterButtons.length > 0 && skillCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterVal = btn.getAttribute('data-filter');

                skillCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (filterVal === 'all' || cardCat === filterVal) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 20);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    }


    // ========================================================================
    // 13. REAL-TIME GITHUB & LINKEDIN AUTO-SYNC ENGINE
    // ========================================================================
    const GH_USERNAME = 'himanshu161098';
    const FEED_JSON_URL = 'data/social_feed.json';
    const LOCAL_STORAGE_KEY = 'hk_social_feed_data';

    const reposContainer = document.getElementById('dynamicReposContainer');
    const eventsContainer = document.getElementById('eventsListContainer');
    const linkedinContainer = document.getElementById('dynamicLinkedInPosts');
    const syncTimestampEl = document.getElementById('liveSyncTimestamp');
    const syncNowBtn = document.getElementById('btnSyncNow');
    const syncSpinIcon = document.getElementById('syncSpinIcon');

    // Mini telemetry elements
    const ghPublicReposEl = document.getElementById('ghPublicRepos');
    const ghFollowersEl = document.getElementById('ghFollowers');
    const ghStarsCountEl = document.getElementById('ghStarsCount');
    const ghLiveStatusEl = document.getElementById('ghLiveStatus');
    const hudGithubStatus = document.getElementById('hudGithubStatus');
    const termSyncStatus = document.getElementById('termSyncStatus');

    function formatRelativeTime(dateString) {
        if (!dateString) return 'recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return 'just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHour < 24) return `${diffHour}h ago`;
        if (diffDay < 30) return `${diffDay}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function getLanguageColor(lang) {
        const colors = {
            'JavaScript': '#f7df1e',
            'Python': '#3572A5',
            'Jupyter Notebook': '#DA5B0B',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'C++': '#f34b7d',
            'Java': '#b07219'
        };
        return colors[lang] || '#00f2fe';
    }

    // Render GitHub Repositories
    function renderGitHubRepos(repos) {
        if (!reposContainer) return;
        if (!repos || repos.length === 0) {
            reposContainer.innerHTML = `
                <div class="feed-empty-state">
                    <p>No public repositories found for @${GH_USERNAME}.</p>
                </div>
            `;
            return;
        }

        let totalStars = 0;
        const cardsHtml = repos.slice(0, 5).map(repo => {
            const stars = repo.stargazers_count || 0;
            totalStars += stars;
            const forks = repo.forks_count || 0;
            const lang = repo.language || (repo.name.includes('UNO') ? 'JavaScript' : (repo.name.includes('Sales') ? 'Python' : 'Code'));
            const langColor = getLanguageColor(lang);
            const desc = repo.description || 'Public repository created and maintained on GitHub.';
            const timeAgo = formatRelativeTime(repo.updated_at || repo.pushed_at);

            return `
                <article class="gh-repo-card">
                    <div class="repo-header">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name-link">
                            <i class="fa-solid fa-book-bookmark text-cyan"></i>
                            <span>${repo.name}</span>
                        </a>
                        <span class="event-badge">${timeAgo}</span>
                    </div>
                    <p class="repo-desc">${desc}</p>
                    <div class="repo-meta">
                        <div class="repo-lang">
                            <span class="lang-dot" style="background-color: ${langColor};"></span>
                            <span>${lang}</span>
                        </div>
                        <div class="repo-stats">
                            <span class="repo-stat-item" title="Stars">
                                <i class="fa-regular fa-star text-yellow"></i>
                                <span>${stars}</span>
                            </span>
                            <span class="repo-stat-item" title="Forks">
                                <i class="fa-solid fa-code-fork text-blue"></i>
                                <span>${forks}</span>
                            </span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        reposContainer.innerHTML = cardsHtml;
        if (ghStarsCountEl) ghStarsCountEl.textContent = `${totalStars}+`;
    }

    // Render GitHub Events / Activity Stream
    function renderGitHubEvents(events) {
        if (!eventsContainer) return;
        if (!events || events.length === 0) {
            eventsContainer.innerHTML = `
                <div class="event-item">
                    <span>Active code development on GitHub.</span>
                </div>
            `;
            return;
        }

        const eventsHtml = events.slice(0, 4).map(event => {
            let actionText = 'Contributed to';
            let iconClass = 'fa-code-commit text-cyan';
            if (event.type === 'PushEvent') {
                actionText = 'Pushed commits to';
                iconClass = 'fa-code-branch text-green';
            } else if (event.type === 'CreateEvent') {
                actionText = 'Created repository';
                iconClass = 'fa-plus text-cyan';
            } else if (event.type === 'WatchEvent') {
                actionText = 'Starred repo';
                iconClass = 'fa-star text-yellow';
            }

            const repoName = event.repo ? event.repo.name.replace(`${GH_USERNAME}/`, '') : 'Project';
            const timeAgo = formatRelativeTime(event.created_at);

            return `
                <div class="event-item">
                    <div class="event-details">
                        <i class="fa-solid ${iconClass}"></i>
                        <span>${actionText} <strong>${repoName}</strong></span>
                    </div>
                    <span class="event-time">${timeAgo}</span>
                </div>
            `;
        }).join('');

        eventsContainer.innerHTML = eventsHtml;
    }

    // Render LinkedIn Posts
    function renderLinkedInPosts(posts) {
        if (!linkedinContainer) return;
        if (!posts || posts.length === 0) {
            linkedinContainer.innerHTML = `
                <div class="feed-empty-state">
                    <p>No LinkedIn updates recorded yet.</p>
                </div>
            `;
            return;
        }

        const postsHtml = posts.map(post => {
            const tagsHtml = (post.tags || []).map(t => `<span class="li-tag">${t}</span>`).join('');
            return `
                <article class="li-post-card">
                    <div class="li-post-header">
                        <div class="li-author-wrap">
                            <div class="avatar-mini">
                                <img src="assets/profile.jpg" alt="Himanshu Kumar" class="avatar-mini-img" onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex';">
                                <i class="fa-brands fa-linkedin-in" style="display: none;"></i>
                            </div>
                            <div>
                                <span class="li-author-name">Himanshu Kumar</span>
                                <span class="li-post-date">${post.date || 'Recent'}</span>
                            </div>
                        </div>
                        <a href="${post.url || 'https://www.linkedin.com/in/himanshu-kumar-1618hks/'}" target="_blank" rel="noopener noreferrer" class="li-open-link" title="Open on LinkedIn">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                    <h4 class="li-post-title">${post.title}</h4>
                    <p class="li-post-content">${post.content}</p>
                    <div class="li-post-tags">${tagsHtml}</div>
                    <div class="li-post-footer">
                        <div class="li-reactions">
                            <span><i class="fa-regular fa-thumbs-up text-blue"></i> ${post.likes || 42}</span>
                            <span><i class="fa-regular fa-comment-dots text-cyan"></i> ${post.comments || 10}</span>
                        </div>
                        <a href="${post.url || 'https://www.linkedin.com/in/himanshu-kumar-1618hks/'}" target="_blank" rel="noopener noreferrer" class="li-open-link">
                            <span>View on LinkedIn</span>
                            <i class="fa-solid fa-chevron-right font-xs"></i>
                        </a>
                    </div>
                </article>
            `;
        }).join('');

        linkedinContainer.innerHTML = postsHtml;
    }

    // Main Live Fetch Function
    async function performAutoSync(isManual = false) {
        if (syncSpinIcon) syncSpinIcon.classList.add('fa-spin');
        if (syncTimestampEl) syncTimestampEl.textContent = 'Syncing live feeds with GitHub & LinkedIn...';

        try {
            // 1. Fetch GitHub User Profile
            const profilePromise = fetch(`https://api.github.com/users/${GH_USERNAME}`)
                .then(r => r.ok ? r.json() : null)
                .catch(() => null);

            // 2. Fetch Live GitHub Repositories
            const reposPromise = fetch(`https://api.github.com/users/${GH_USERNAME}/repos?sort=updated&per_page=8`)
                .then(r => r.ok ? r.json() : null)
                .catch(() => null);

            // 3. Fetch Live Public Events
            const eventsPromise = fetch(`https://api.github.com/users/${GH_USERNAME}/events/public?per_page=8`)
                .then(r => r.ok ? r.json() : null)
                .catch(() => null);

            // 4. Fetch Dynamic Social Feed
            const feedPromise = fetch(`${FEED_JSON_URL}?t=${Date.now()}`)
                .then(r => r.ok ? r.json() : null)
                .catch(() => null);

            const [profile, repos, events, feed] = await Promise.all([
                profilePromise,
                reposPromise,
                eventsPromise,
                feedPromise
            ]);

            // Load local storage custom posts if available
            let localFeed = null;
            try {
                localFeed = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
            } catch (e) {
                localFeed = null;
            }

            // Update Profile stats
            if (profile) {
                if (ghPublicReposEl) ghPublicReposEl.textContent = profile.public_repos;
                if (ghFollowersEl) ghFollowersEl.textContent = profile.followers;
                if (ghLiveStatusEl) {
                    ghLiveStatusEl.textContent = 'Live Synced';
                    ghLiveStatusEl.className = 'gh-stat-num text-green';
                }
                if (hudGithubStatus) hudGithubStatus.textContent = 'ONLINE (LIVE)';
                if (termSyncStatus) termSyncStatus.textContent = 'LIVE_SYNC_OK';
            }

            // Repositories Rendering (GitHub live API preferred, fallback to feed)
            if (repos && repos.length > 0) {
                renderGitHubRepos(repos);
            } else if (feed && feed.github && feed.github.featured_repos) {
                renderGitHubRepos(feed.github.featured_repos);
            }

            // Events Rendering
            if (events && events.length > 0) {
                renderGitHubEvents(events);
            } else if (feed && feed.github && feed.github.recent_events) {
                renderGitHubEvents(feed.github.recent_events);
            }

            // LinkedIn Posts Rendering (local custom posts first, then feed)
            let postsToRender = [];
            if (localFeed && localFeed.linkedin && localFeed.linkedin.posts) {
                postsToRender = localFeed.linkedin.posts;
            } else if (feed && feed.linkedin && feed.linkedin.posts) {
                postsToRender = feed.linkedin.posts;
            }
            renderLinkedInPosts(postsToRender);

            const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            if (syncTimestampEl) {
                syncTimestampEl.textContent = `Auto-Synced at ${nowTime} (Live)`;
            }

            if (isManual) {
                showAlert('Real-time sync completed! Latest GitHub and LinkedIn feeds updated.', 'success');
            }

        } catch (err) {
            console.warn('[Auto-Sync] Live sync fallback:', err);
            // Fallback to static feed file
            try {
                const res = await fetch(FEED_JSON_URL);
                if (res.ok) {
                    const data = await res.json();
                    if (data.github && data.github.featured_repos) renderGitHubRepos(data.github.featured_repos);
                    if (data.linkedin && data.linkedin.posts) renderLinkedInPosts(data.linkedin.posts);
                }
            } catch (e) {
                console.error('[Auto-Sync Error]', e);
            }
            if (syncTimestampEl) syncTimestampEl.textContent = 'Cached feed active (Offline)';
        } finally {
            if (syncSpinIcon) {
                setTimeout(() => syncSpinIcon.classList.remove('fa-spin'), 600);
            }
        }
    }

    // Manual Sync Button Click
    if (syncNowBtn) {
        syncNowBtn.addEventListener('click', () => {
            performAutoSync(true);
        });
    }

    // Auto-Sync background cycle every 5 minutes
    setInterval(() => {
        performAutoSync(false);
    }, 5 * 60 * 1000);

    // Initial Trigger
    performAutoSync(false);


    // ========================================================================
    // 14. INTERACTIVE MODALS & POST MANAGER
    // ========================================================================
    const syncInfoModal = document.getElementById('syncInfoModal');
    const addPostModal = document.getElementById('addPostModal');
    const btnSyncInfo = document.getElementById('btnSyncInfo');
    const btnOpenPostModal = document.getElementById('btnOpenPostModal');
    const closeSyncModalBtn = document.getElementById('closeSyncModalBtn');
    const closeSyncModalBtn2 = document.getElementById('closeSyncModalBtn2');
    const closePostModalBtn = document.getElementById('closePostModalBtn');
    const newPostForm = document.getElementById('newPostForm');

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (btnSyncInfo && syncInfoModal) {
        btnSyncInfo.addEventListener('click', () => openModal(syncInfoModal));
    }
    if (closeSyncModalBtn && syncInfoModal) {
        closeSyncModalBtn.addEventListener('click', () => closeModal(syncInfoModal));
    }
    if (closeSyncModalBtn2 && syncInfoModal) {
        closeSyncModalBtn2.addEventListener('click', () => closeModal(syncInfoModal));
    }

    if (btnOpenPostModal && addPostModal) {
        btnOpenPostModal.addEventListener('click', () => openModal(addPostModal));
    }
    if (closePostModalBtn && addPostModal) {
        closePostModalBtn.addEventListener('click', () => closeModal(addPostModal));
    }

    // Close on backdrop click
    [syncInfoModal, addPostModal].forEach(m => {
        if (!m) return;
        m.addEventListener('click', (e) => {
            if (e.target === m) closeModal(m);
        });
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(syncInfoModal);
            closeModal(addPostModal);
        }
    });

    // Handle Adding New LinkedIn Post
    if (newPostForm) {
        newPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('postTitleInput');
            const contentInput = document.getElementById('postContentInput');
            const tagsInput = document.getElementById('postTagsInput');
            const urlInput = document.getElementById('postUrlInput');

            if (!titleInput || !contentInput) return;

            const newPost = {
                id: `post-${Date.now()}`,
                date: 'Just now',
                title: titleInput.value.trim(),
                content: contentInput.value.trim(),
                tags: tagsInput && tagsInput.value.trim() ? tagsInput.value.split(',').map(t => t.trim()) : ['#Update', '#HimanshuKumar'],
                likes: 1,
                comments: 0,
                url: urlInput && urlInput.value.trim() ? urlInput.value.trim() : 'https://www.linkedin.com/in/himanshu-kumar-1618hks/'
            };

            // Retrieve existing posts or default from storage
            let currentFeed = {};
            try {
                currentFeed = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
            } catch (err) {
                currentFeed = {};
            }

            if (!currentFeed.linkedin) currentFeed.linkedin = { posts: [] };
            if (!currentFeed.linkedin.posts) currentFeed.linkedin.posts = [];

            currentFeed.linkedin.posts.unshift(newPost);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentFeed));

            renderLinkedInPosts(currentFeed.linkedin.posts);
            newPostForm.reset();
            closeModal(addPostModal);
            showAlert('New LinkedIn post added and published to your live feed!', 'success');
        });
    }

    // ========================================================================
    // 20. 3D ROYAL SANDESH PATRA (शाही संदेश पत्र) MODAL - HK LOGO SPOTLIGHT
    // ========================================================================
    function initHk3DReviewModal() {
        const modal = document.getElementById('hkReviewModal');
        const scene = document.getElementById('hk3dScene') || (modal ? modal.querySelector('.sandesh-3d-scene') : null);
        const scrollCard = document.getElementById('sandeshScrollCard') || document.getElementById('hk3dCard');
        const parchmentSheet = scrollCard ? scrollCard.querySelector('.sandesh-parchment-sheet') : null;
        const activeQuill = document.getElementById('sandeshActiveQuill');
        const writingIndicator = document.getElementById('sandeshWritingIndicator');
        const navBrandLogo = document.getElementById('navBrandLogo');
        const closeBtn = document.getElementById('closeHkReviewModalBtn');
        const closeFooterBtn = document.getElementById('closeHkReviewModalFooterBtn');
        const closeBackBtn = document.getElementById('closeHkReviewModalBackBtn');
        const sandeshContactBtn = document.getElementById('sandeshContactBtn') || document.getElementById('hkContactFromModalBtn');

        if (!modal || !scrollCard) return;

        let sandeshAnimationTimeouts = [];
        let activeIntervals = [];
        let isSandeshWritingActive = false;

        const ganeshFullMantra = "॥ श्री गणेशाय नमः ॥";
        const swastikFullMantra = "॥ शुभ लाभ ॥";
        const honoreeFullName = "हिमांशु कुमार";
        const hindiFullText = "प्रमाणित किया जाता है कि हिमांशु कुमार आधुनिक डिजिटल शिल्प व डेटा विज्ञान के एक निष्ठावान, नवोन्मेषी व अद्वितीय शिल्पी हैं। जटिल तकनीकी चुनौतियों को अत्यंत सुरुचिपूर्ण, तीव्र और सशक्त प्रणालियों में रूपांतरित करने में इनकी दक्षता सर्वोत्कृष्ट है। पूर्ण निष्ठा, शुचिता एवं अटूट समर्पण के साथ निर्मित इनकी कृतियाँ उच्च तकनीकी मानदंडों का जीवंत प्रमाण हैं।";
        const englishFullText = "“Himanshu stands as an exceptional modern craftsman in software engineering and data intelligence. Demonstrating extraordinary mastery across scalable full-stack architectures, automated pipelines, and human-centric interfaces, his work embodies unwavering dedication, analytical precision, and engineering purity.”";
        const visionFullText = "“Architecting robust digital solutions that bridge modern human-centric interfaces with scalable data intelligence.”";

        const ganeshMantraEl = document.getElementById('sandeshGaneshMantra');
        const swastikMantraEl = document.getElementById('sandeshSwastikMantra');
        const honoreeNameEl = document.getElementById('sandeshHonoreeName');
        const hindiTextEl = document.getElementById('sandeshHindiText');
        const englishTextEl = document.getElementById('sandeshEnglishText');
        const visionTextEl = document.getElementById('sandeshVisionText');
        const page2DetailsEl = document.getElementById('sandeshPage2Details');

        const animItems = scrollCard.querySelectorAll('.sandesh-anim-item');
        const stars = scrollCard.querySelectorAll('.sandesh-stars-row i');
        const cursiveSig = scrollCard.querySelector('.signature-cursive');

        function clearAllSandeshTimers() {
            sandeshAnimationTimeouts.forEach(t => clearTimeout(t));
            sandeshAnimationTimeouts = [];
            activeIntervals.forEach(i => clearInterval(i));
            activeIntervals = [];
            isSandeshWritingActive = false;
        }

        function moveQuillTo(el, offsetX = 0, offsetY = 0, autoScroll = true) {
            if (!activeQuill || !el || !parchmentSheet) return;
            const sheetRect = parchmentSheet.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const relTop = elRect.top - sheetRect.top + parchmentSheet.scrollTop;
            const relLeft = elRect.left - sheetRect.left + parchmentSheet.scrollLeft;
            
            activeQuill.style.opacity = '1';
            activeQuill.style.top = `${Math.round(relTop + offsetY)}px`;
            activeQuill.style.left = `${Math.round(relLeft + offsetX)}px`;

            if (autoScroll) {
                const targetScroll = Math.max(0, relTop - 110);
                parchmentSheet.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }
        }

        function streamTypewriter(el, text, step = 1, speed = 20, onDone = null) {
            if (!el) {
                if (onDone) onDone();
                return;
            }
            el.textContent = '';
            let charIdx = 0;
            const interval = setInterval(() => {
                if (!isSandeshWritingActive) {
                    clearInterval(interval);
                    el.textContent = text;
                    return;
                }
                charIdx += step;
                if (charIdx >= text.length) {
                    charIdx = text.length;
                    el.textContent = text;
                    clearInterval(interval);
                    if (onDone) onDone();
                } else {
                    el.textContent = text.slice(0, charIdx);
                }
            }, speed);
            activeIntervals.push(interval);
        }

        function instantRevealAllSandesh() {
            clearAllSandeshTimers();
            scrollCard.classList.remove('is-writing');
            scrollCard.classList.remove('is-unfolding');
            if (activeQuill) activeQuill.style.opacity = '0';

            animItems.forEach(item => {
                item.classList.add('written');
                item.style.opacity = '';
                item.style.transform = '';
                item.style.filter = '';
            });

            if (ganeshMantraEl) ganeshMantraEl.textContent = ganeshFullMantra;
            if (swastikMantraEl) swastikMantraEl.textContent = swastikFullMantra;
            if (honoreeNameEl) honoreeNameEl.textContent = honoreeFullName;
            if (hindiTextEl) hindiTextEl.textContent = hindiFullText;
            if (englishTextEl) englishTextEl.textContent = englishFullText;
            if (visionTextEl) visionTextEl.textContent = visionFullText;
            if (cursiveSig) cursiveSig.classList.add('writing-done');
            stars.forEach(s => s.classList.add('star-lit'));
        }

        function runSandeshUnfoldAndWrite() {
            clearAllSandeshTimers();
            isSandeshWritingActive = true;

            // 1. Prepare elements in unwritten state & scroll to top
            if (parchmentSheet) parchmentSheet.scrollTop = 0;
            scrollCard.classList.remove('is-unfolding');
            void scrollCard.offsetWidth; // Reflow to restart fold animation
            scrollCard.classList.add('is-unfolding');
            scrollCard.classList.add('is-writing');

            // Free scrolling after unfold animation ends (850ms)
            sandeshAnimationTimeouts.push(setTimeout(() => {
                scrollCard.classList.remove('is-unfolding');
            }, 850));

            animItems.forEach(item => item.classList.remove('written'));
            stars.forEach(s => s.classList.remove('star-lit'));
            if (cursiveSig) {
                cursiveSig.classList.remove('writing-done');
                cursiveSig.classList.remove('writing');
            }

            // Reset text strings to be live-written by the quill
            if (ganeshMantraEl) ganeshMantraEl.textContent = '';
            if (swastikMantraEl) swastikMantraEl.textContent = '';
            if (honoreeNameEl) honoreeNameEl.textContent = '';
            if (hindiTextEl) hindiTextEl.textContent = '';
            if (englishTextEl) englishTextEl.textContent = '';
            if (visionTextEl) visionTextEl.textContent = '';

            // 2. Sequential live quill handwriting schedule
            // Step 1 (T + 300ms): Sacred ॐ (Om Symbol)
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const omItem = scrollCard.querySelector('.sandesh-top-om');
                if (omItem) {
                    moveQuillTo(omItem, 28, 20);
                    omItem.classList.add('written');
                }
            }, 300));

            // Step 2 (T + 750ms): Shree Ganesh Divine Medallion & Mantra
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const ganeshItem = scrollCard.querySelector('.ganesh-flank');
                if (ganeshItem) {
                    moveQuillTo(ganeshItem, 35, 45);
                    ganeshItem.classList.add('written');
                    streamTypewriter(ganeshMantraEl, ganeshFullMantra, 1, 24);
                }
            }, 750));

            // Step 3 (T + 1200ms): Royal HK Lacquer Wax Seal Stamp
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const sealItem = scrollCard.querySelector('.sandesh-wax-seal-wrapper');
                if (sealItem) {
                    moveQuillTo(sealItem, 40, 40);
                    sealItem.classList.add('written');
                }
            }, 1200));

            // Step 4 (T + 1550ms): Swastik Divine Medallion & Mantra
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const swastikItem = scrollCard.querySelector('.swastik-flank');
                if (swastikItem) {
                    moveQuillTo(swastikItem, 35, 45);
                    swastikItem.classList.add('written');
                    streamTypewriter(swastikMantraEl, swastikFullMantra, 1, 24);
                }
            }, 1550));

            // Step 5 (T + 1950ms): Royal Title ("शाही संदेश पत्र")
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const headerItem = scrollCard.querySelector('.sandesh-header');
                if (headerItem) {
                    moveQuillTo(headerItem, 120, 40);
                    headerItem.classList.add('written');
                }
            }, 1950));

            // Step 6 (T + 2350ms): Honoree Recipient ("हिमांशु कुमार")
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const honoreeItem = scrollCard.querySelector('.sandesh-honoree-card');
                if (honoreeItem) {
                    moveQuillTo(honoreeItem, 60, 30);
                    honoreeItem.classList.add('written');
                    streamTypewriter(honoreeNameEl, honoreeFullName, 1, 25);
                }
            }, 2350));

            // Step 7 (T + 2750ms): 5-Star Royal Distinction & Stars Light-Up
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const ratingItem = scrollCard.querySelector('.sandesh-rating-strip');
                if (ratingItem) {
                    moveQuillTo(ratingItem, 40, 15);
                    ratingItem.classList.add('written');
                    stars.forEach((star, idx) => {
                        sandeshAnimationTimeouts.push(setTimeout(() => {
                            star.classList.add('star-lit');
                        }, 70 * idx));
                    });
                }
            }, 2750));

            // Step 8 (T + 3150ms): Proclamation Decree (Live Hindi Scribe Writing)
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const procBox = scrollCard.querySelector('.sandesh-proclamation-box');
                if (procBox) {
                    moveQuillTo(procBox, 25, 35);
                    procBox.classList.add('written');

                    streamTypewriter(hindiTextEl, hindiFullText, 2, 14, () => {
                        if (englishTextEl) {
                            englishTextEl.style.opacity = '0';
                            englishTextEl.textContent = englishFullText;
                            englishTextEl.style.transition = 'opacity 0.6s ease';
                            setTimeout(() => {
                                if (englishTextEl) englishTextEl.style.opacity = '1';
                            }, 40);
                        }
                    });
                }
            }, 3150));

            // Step 9 (T + 4600ms): 4 Royal Metric Pillars & Skill Chips
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const pillarsItem = scrollCard.querySelector('.sandesh-metrics-pillars');
                if (pillarsItem) {
                    moveQuillTo(pillarsItem, 30, 20);
                    pillarsItem.classList.add('written');
                }
                const skillsItem = scrollCard.querySelector('.sandesh-skills-wrapper');
                if (skillsItem) skillsItem.classList.add('written');
            }, 4600));

            // Step 10 (T + 5050ms): 2ND PAGE RE-INTEGRATED (Developer Vision & 3 Core Engineering Pillars)
            sandeshAnimationTimeouts.push(setTimeout(() => {
                if (page2DetailsEl) {
                    moveQuillTo(page2DetailsEl, 30, 20);
                    page2DetailsEl.classList.add('written');
                    streamTypewriter(visionTextEl, visionFullText, 2, 16);
                }
            }, 5050));

            // Step 11 (T + 6250ms): Authenticity Seal & Cursive Signature Drawing
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const authItem = scrollCard.querySelector('.sandesh-authenticity-block');
                if (authItem) {
                    moveQuillTo(authItem, 160, 22);
                    authItem.classList.add('written');
                    if (cursiveSig) {
                        cursiveSig.classList.add('writing');
                        setTimeout(() => {
                            cursiveSig.classList.add('writing-done');
                        }, 1000);
                    }
                }
            }, 6250));

            // Step 12 (T + 7200ms): Action Buttons (Resume, Prachi AI, Contact) & Quill Finis
            sandeshAnimationTimeouts.push(setTimeout(() => {
                const actionsItem = scrollCard.querySelector('.sandesh-actions-group');
                if (actionsItem) actionsItem.classList.add('written');
                if (activeQuill) activeQuill.style.opacity = '0';
                isSandeshWritingActive = false;
                scrollCard.classList.remove('is-writing');
            }, 7200));
        }

        function openSandeshModal() {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            scrollCard.style.transform = ''; // Clear inline styles so unroll animation executes
            document.body.style.overflow = 'hidden';
            runSandeshUnfoldAndWrite();
        }

        function closeSandeshModal() {
            clearAllSandeshTimers();
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            scrollCard.classList.remove('is-unfolding');
            scrollCard.classList.remove('is-writing');
            setTimeout(() => {
                scrollCard.style.transform = '';
            }, 300);
        }

        // Click anywhere to fast-forward animation
        scrollCard.addEventListener('click', (e) => {
            if (e.target.closest('.sandesh-close-btn') || e.target.closest('.sandesh-btn')) return;
            if (isSandeshWritingActive) {
                instantRevealAllSandesh();
            }
        });

        if (writingIndicator) {
            writingIndicator.addEventListener('click', (e) => {
                e.stopPropagation();
                instantRevealAllSandesh();
            });
        }

        // Attach click listener to brand logo in header
        if (navBrandLogo) {
            navBrandLogo.addEventListener('click', (e) => {
                e.preventDefault();
                openSandeshModal();
            });
        }

        // Close button handlers
        if (closeBtn) closeBtn.addEventListener('click', closeSandeshModal);
        if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeSandeshModal);
        if (closeBackBtn) closeBackBtn.addEventListener('click', closeSandeshModal);

        if (sandeshContactBtn) {
            sandeshContactBtn.addEventListener('click', () => {
                closeSandeshModal();
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSandeshModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeSandeshModal();
            }
        });

        // 3D Dynamic Real-time Mouse Parallax Tilt for Sandesh Patra Scroll
        if (scene) {
            scene.addEventListener('mousemove', (e) => {
                if (isSandeshWritingActive) return; // keep steady during unfolding and writing
                const rect = scene.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * 8; // -8deg to +8deg
                const rotateX = -((y - centerY) / centerY) * 7; // -7deg to +7deg

                scrollCard.style.transform = `perspective(1600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
            });

            scene.addEventListener('mouseleave', () => {
                if (!isSandeshWritingActive) {
                    scrollCard.style.transform = 'perspective(1600px) rotateX(0deg) rotateY(0deg) scale(1)';
                }
            });
        }
    }

    // Initialize 3D engines
    initHero3DCore();
    init3DBackground();
    initHk3DReviewModal();
    initCyberHudInspector();

    // Academic Documents Interactive Drawer (10th / 12th)
    window.toggleEduDocs = function(containerId) {
        const container = document.getElementById(containerId);
        const btn = document.querySelector(`[data-target="${containerId}"]`);
        if (!container) return;

        const isOpen = container.classList.contains('open');
        if (isOpen) {
            container.classList.remove('open');
            if (btn) btn.classList.remove('open');
        } else {
            container.classList.add('open');
            if (btn) btn.classList.add('open');
        }
    };

    // =========================================================================
    // FRONT PAGE CYBER HUD INTEL INSPECTOR (Dynamic Hover Overview System)
    // =========================================================================
    function initCyberHudInspector() {
        const hud = document.getElementById('cyberHudInspector');
        if (!hud) return;

        // Skip on mobile screens or touch-only devices since HUD is hidden and not needed
        if (window.innerWidth <= 768 || (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)) {
            return;
        }

        // Elements of the HUD
        const categoryEl = document.getElementById('hudInspCategory');
        const iconEl = document.getElementById('hudInspIcon');
        const titleEl = document.getElementById('hudInspTitle');
        const descEl = document.getElementById('hudInspDesc');
        const actionEl = document.getElementById('hudInspAction');
        const tagEl = document.getElementById('hudInspTag');

        // Detailed Intel Catalog for Front Page components
        const INTEL_CATALOG = [
            {
                selector: '.nav-brand',
                category: 'BRAND IDENTITY',
                title: 'HK Hologram & 3D Sandesh Patra',
                desc: 'Imperial insignia of Himanshu Kumar. Click to unfurl the 3D ancient scroll summarizing engineering milestones & philosophy.',
                icon: 'fa-solid fa-crown',
                action: 'Click to open 3D scroll',
                tag: 'BRAND // CORE'
            },
            {
                selector: '.nav-link[href="#home"]',
                category: 'NAVIGATION DECK',
                title: 'Mission Control (Home)',
                desc: 'Top flight deck displaying real-time availability, interactive 3D quantum core, bio summary, and technical highlights.',
                icon: 'fa-solid fa-house',
                action: 'Click to jump to Home',
                tag: 'NAV // 01'
            },
            {
                selector: '.nav-link[href="#about"]',
                category: 'NAVIGATION DECK',
                title: 'About & Professional Summary',
                desc: 'Engineering background, B.Tech CSE (IT) education at IIMT AKTU, problem-solving mindset, and core pillars.',
                icon: 'fa-solid fa-user-gear',
                action: 'Click to view About',
                tag: 'NAV // 02'
            },
            {
                selector: '.nav-link[href="#skills"]',
                category: 'NAVIGATION DECK',
                title: 'Technical Arsenal & Skills',
                desc: 'Interactive skills matrix covering Python, Machine Learning, Power BI, JavaScript, and database systems.',
                icon: 'fa-solid fa-layer-group',
                action: 'Click to view Skills',
                tag: 'NAV // 03'
            },
            {
                selector: '.nav-link[href="#projects"]',
                category: 'NAVIGATION DECK',
                title: 'Engineering Projects',
                desc: 'Real-world software architectures including Real-Time Facial Emotion Detection, IPL Analytics, and responsive web apps.',
                icon: 'fa-solid fa-folder-tree',
                action: 'Click to view Projects',
                tag: 'NAV // 04'
            },
            {
                selector: '.nav-link[href="#certifications"]',
                category: 'NAVIGATION DECK',
                title: 'Accreditations & Workshops',
                desc: '7+ verified industry certifications from Google, IBM, Simplilearn, Technoledge IoT, and hands-on AKTU ML workshop.',
                icon: 'fa-solid fa-certificate',
                action: 'Click to view Certifications',
                tag: 'NAV // 05'
            },
            {
                selector: '.nav-link[href="#education"]',
                category: 'NAVIGATION DECK',
                title: 'Academic Qualifications',
                desc: 'B.Tech CSE (IT) at IIMT, Class 12 & Class 10 first division marks statements, provisional certificates, and CLC dossier.',
                icon: 'fa-solid fa-graduation-cap',
                action: 'Click to view Education',
                tag: 'NAV // 06'
            },
            {
                selector: '.nav-link[href="#live-feed"]',
                category: 'NAVIGATION DECK',
                title: 'Live Activity Radar',
                desc: 'Real-time telemetry synced with GitHub commit streams, code repositories, stars, and developer milestones.',
                icon: 'fa-solid fa-tower-broadcast',
                action: 'Click to view Live Radar',
                tag: 'LIVE // SYNC'
            },
            {
                selector: '.nav-link[href="#contact"]',
                category: 'NAVIGATION DECK',
                title: 'Secure Contact Dispatcher',
                desc: 'Direct communication portal with live email dispatch, phone/WhatsApp hotline, and professional inquiry form.',
                icon: 'fa-solid fa-paper-plane',
                action: 'Click to jump to Contact',
                tag: 'DISPATCH // 08'
            },
            {
                selector: '.nav-resume-btn',
                category: 'OFFICIAL DOSSIER',
                title: 'Curriculum Vitae (PDF)',
                desc: 'ATS-optimized formal resume documenting academic background, verified credentials, and software projects.',
                icon: 'fa-solid fa-file-pdf',
                action: 'Click to view Resume PDF',
                tag: 'DOC // ATS_COMPLIANT'
            },
            {
                selector: '.btn-prachi-nav, .nav-mobile-prachi-btn',
                category: 'AI COMPANION',
                title: 'Prachi AI Companion',
                desc: 'Dedicated conversational AI companion custom-built by Himanshu. Interactive voice-enabled technical dialogue.',
                icon: 'fa-solid fa-robot',
                action: 'Click to launch Prachi AI',
                tag: 'PRACHI // LIVE'
            },
            {
                selector: '.badge-status',
                category: 'SYSTEM TELEMETRY',
                title: 'Professional Availability',
                desc: 'Currently available for Software Engineering, Data Analytics, and AI/ML full-time roles, internships, and freelance projects.',
                icon: 'fa-solid fa-circle-dot',
                action: 'Click to send hiring inquiry',
                tag: 'STATUS // READY'
            },
            {
                selector: '#hudIntelBadge',
                category: 'HUD RADAR',
                title: 'Hover Overview Inspector',
                desc: 'Move your cursor over any front page element to instantly inspect component telemetry and detailed overviews.',
                icon: 'fa-solid fa-crosshairs',
                action: 'Hover any component',
                tag: 'HUD // ACTIVE'
            },
            {
                selector: '.hero-greeting',
                category: 'COMMAND SHELL',
                title: 'UNIX Greeting Terminal',
                desc: 'Command prompt syntax welcoming visitors, recruiters, and engineering teams to the interactive portfolio terminal.',
                icon: 'fa-solid fa-terminal',
                action: 'Standard shell prompt',
                tag: 'STDOUT // HELLO_WORLD'
            },
            {
                selector: '.hero-name',
                category: 'IDENTITY NODE',
                title: 'Himanshu Kumar',
                desc: 'Final-year B.Tech CSE (IT) student at IIMT AKTU. Passionate problem solver, algorithmic coder, and AI enthusiast.',
                icon: 'fa-solid fa-user-astronaut',
                action: 'Portfolio Creator & Engineer',
                tag: 'ENGINEER // CSE_IT'
            },
            {
                selector: '.hero-role',
                category: 'SPECIALIZATIONS',
                title: 'Full-Stack & AI/ML Engineer',
                desc: 'Synergizing data science analytics, predictive computer vision models, and responsive modern web architecture.',
                icon: 'fa-solid fa-code',
                action: 'Core expertise matrix',
                tag: 'ROLES // DEV'
            },
            {
                selector: '.hero-description',
                category: 'EXECUTIVE BRIEF',
                title: 'Engineering Philosophy',
                desc: 'Committed to scalable software craftsmanship, clean code architecture, robust database design, and high-impact machine learning solutions.',
                icon: 'fa-solid fa-compass',
                action: 'Read complete story in About',
                tag: 'BRIEF // PROFILE'
            },
            {
                selector: '#heroResumeBtn',
                category: 'PRIMARY CTA',
                title: 'Download Resume PDF',
                desc: 'Instantly download the latest ATS-compliant resume with verified GPA, project repos, and official certification IDs.',
                icon: 'fa-solid fa-download',
                action: 'Click to download PDF',
                tag: 'FILE // RESUME'
            },
            {
                selector: '#heroChatGptBtn',
                category: 'AI SYSTEM',
                title: 'Prachi AI Intelligent Companion',
                desc: 'Launch Prachi AI companion with simulated voice, intelligent chat responses, and personalized portfolio guidance.',
                icon: 'fa-solid fa-sparkles',
                action: 'Click to open Prachi AI',
                tag: 'AI // COMPANION'
            },
            {
                selector: '#heroViewProjectsBtn',
                category: 'SHOWCASE',
                title: 'Explore Software Projects',
                desc: 'Inspect production projects with live demos, GitHub code repositories, tech stack breakdown, and system architecture.',
                icon: 'fa-solid fa-laptop-code',
                action: 'Click to jump to Projects',
                tag: 'REPOS // 3+ APPS'
            },
            {
                selector: '#heroContactBtn',
                category: 'COMMUNICATION',
                title: 'Dispatch Instant Message',
                desc: 'Direct bridge to Himanshu\'s inbox. Send project propositions, technical queries, or interview invitations.',
                icon: 'fa-solid fa-envelope-open-text',
                action: 'Click to jump to Contact form',
                tag: 'COMM // INBOX'
            },
            {
                selector: '.hero-social-icons a[href*="github.com"]',
                category: 'CODE RADAR',
                title: 'GitHub Profile (@himanshu161098)',
                desc: 'Explore open-source repositories, daily commits, algorithms, and continuous integration pipelines.',
                icon: 'fa-brands fa-github',
                action: 'Click to open GitHub in new tab',
                tag: 'GIT // COMMITS'
            },
            {
                selector: '.hero-social-icons a[href*="linkedin.com"]',
                category: 'PROFESSIONAL NETWORK',
                title: 'LinkedIn Network Profile',
                desc: 'Connect professionally, view verified endorsements, academic achievements, and industry milestones.',
                icon: 'fa-brands fa-linkedin-in',
                action: 'Click to open LinkedIn',
                tag: 'NETWORK // CAREER'
            },
            {
                selector: '.hero-social-icons a[href*="instagram.com"]',
                category: 'SOCIAL DISCOVERY',
                title: 'Instagram (@himanshu_singh1610)',
                desc: 'Behind-the-scenes engineering life, college moments, photography, and creative interests.',
                icon: 'fa-brands fa-instagram',
                action: 'Click to open Instagram',
                tag: 'SOCIAL // CONNECT'
            },
            {
                selector: '.hero-social-icons a[href^="mailto:"]',
                category: 'DIRECT DISPATCH',
                title: 'Direct Email Dispatcher',
                desc: 'Send an inquiry directly to himanshukumarsingh1610@gmail.com for priority responses.',
                icon: 'fa-solid fa-at',
                action: 'Click to send email',
                tag: 'MAIL // DIRECT'
            },
            {
                selector: '.hero-social-icons a[href^="tel:"]',
                category: 'VOICE & WHATSAPP',
                title: 'Direct Telephony Line',
                desc: 'Immediate phone or WhatsApp channel (+91 9341112974) for urgent technical or interview discussions.',
                icon: 'fa-solid fa-phone-volume',
                action: 'Click to dial or message',
                tag: 'PHONE // +91'
            },
            {
                selector: '.tech-pill:nth-child(1)',
                category: 'CORE LANGUAGE',
                title: 'Python 3.x Development',
                desc: 'Primary programming language for data engineering, NumPy array processing, Pandas tabular analysis, and ML algorithms.',
                icon: 'fa-brands fa-python',
                action: 'Core engineering arsenal',
                tag: 'LANG // PYTHON'
            },
            {
                selector: '.tech-pill:nth-child(2)',
                category: 'INTELLIGENCE',
                title: 'Machine Learning & AI',
                desc: 'Supervised/unsupervised algorithms, Scikit-Learn pipelines, computer vision with OpenCV, and predictive modeling.',
                icon: 'fa-solid fa-brain',
                action: 'AI/ML specialization',
                tag: 'MODEL // AI'
            },
            {
                selector: '.tech-pill:nth-child(3)',
                category: 'DATA VISUALIZATION',
                title: 'Power BI & Data Analytics',
                desc: 'Executive KPI dashboards, DAX queries, trend forecasting, business intelligence, and exploratory data analysis.',
                icon: 'fa-solid fa-chart-pie',
                action: 'Business analytics stack',
                tag: 'DATA // POWER_BI'
            },
            {
                selector: '.tech-pill:nth-child(4)',
                category: 'FRONTEND LOGIC',
                title: 'Modern JavaScript (ES6+)',
                desc: 'Interactive DOM manipulation, asynchronous Fetch APIs, event-driven architectures, and smooth 3D WebGL interfaces.',
                icon: 'fa-brands fa-js',
                action: 'Full-stack web stack',
                tag: 'LANG // JS_ES6'
            },
            {
                selector: '.tech-pill:nth-child(5)',
                category: 'PERSISTENCE',
                title: 'SQL & Relational Databases',
                desc: 'Structured query language, complex multi-table joins, aggregations, relational database schema normalization, and MySQL.',
                icon: 'fa-solid fa-database',
                action: 'Database engineering',
                tag: 'DBMS // SQL'
            },
            {
                selector: '.tech-pill:nth-child(6)',
                category: 'COLLABORATION',
                title: 'GitHub Version Control',
                desc: 'Git repository management, branch merging, semantic commit workflows, and live CI/CD deployments.',
                icon: 'fa-brands fa-github',
                action: 'Version control stack',
                tag: 'VCS // GIT'
            },
            {
                selector: '#tabAvatar',
                category: 'VIEW MODE',
                title: 'Developer Profile Hologram',
                desc: 'Toggle between the developer visual profile card and the interactive 3D WebGL quantum core.',
                icon: 'fa-solid fa-user-tie',
                action: 'Click to switch view',
                tag: 'VIEW // AVATAR'
            },
            {
                selector: '.avatar-img-container',
                category: 'BIOMETRIC IDENTITY',
                title: 'Himanshu Kumar Portrait',
                desc: 'Verified portrait of Himanshu Kumar with cybernetic holographic ring and real-time status glow.',
                icon: 'fa-solid fa-id-badge',
                action: 'Verified identity card',
                tag: 'IDENTITY // VERIFIED'
            },
            {
                selector: '.avatar-badge',
                category: 'TRUST CREDENTIAL',
                title: 'Verified Developer Badge',
                desc: 'Verified status authenticating technical accreditations, identity validation, and code commits.',
                icon: 'fa-solid fa-circle-check',
                action: 'Authenticity confirmed',
                tag: 'AUTH // PASS'
            },
            {
                selector: '.mini-terminal',
                category: 'ENVIRONMENT MONITOR',
                title: 'Virtual Terminal Session',
                desc: 'Live session echoing current institution (IIMT AKTU), graduation year (Final Year CSE-IT), 7+ certs, and auto-sync status.',
                icon: 'fa-solid fa-terminal',
                action: 'Live environment telemetry',
                tag: 'BASH // TELEMETRY'
            },
            {
                selector: '.badge-top-right',
                category: 'FOCUS BADGE',
                title: 'AI / ML Developer Track',
                desc: 'Specialized focus on artificial intelligence, algorithmic models, data preprocessing, and model deployment.',
                icon: 'fa-solid fa-microchip',
                action: 'Technical domain focus',
                tag: 'TRACK // AI_ML'
            },
            {
                selector: '.badge-bottom-left',
                category: 'FOCUS BADGE',
                title: 'Data Analytics Track',
                desc: 'End-to-end data pipeline mastery: ETL workflows, statistical testing, interactive dashboards, and decision science.',
                icon: 'fa-solid fa-chart-line',
                action: 'Technical domain focus',
                tag: 'TRACK // DATA_ENG'
            },
            {
                selector: '.scroll-indicator',
                category: 'EXPLORER',
                title: 'Scroll Navigator',
                desc: 'Smoothly glide down through the portfolio to discover the professional summary, skills matrix, projects, and credentials.',
                icon: 'fa-solid fa-chevron-down',
                action: 'Click to scroll down',
                tag: 'NAV // EXPLORE'
            }
        ];

        let activeTarget = null;
        let isVisible = false;
        let hideTimeout = null;

        // Position helper
        function positionHud(e) {
            const w = hud.offsetWidth || 320;
            const h = hud.offsetHeight || 160;
            const margin = 16;

            let x = e.clientX + margin;
            let y = e.clientY + margin;

            // Flip horizontally if overflow
            if (x + w > window.innerWidth - 12) {
                x = e.clientX - w - margin;
            }
            if (x < 12) x = 12;

            // Flip vertically if overflow
            if (y + h > window.innerHeight - 12) {
                y = e.clientY - h - margin;
            }
            if (y < 12) y = 12;

            hud.style.left = `${x}px`;
            hud.style.top = `${y}px`;
        }

        // Show HUD
        function showHud(data, target, e) {
            if (!target || target.closest('#hero3dContainer') || target.closest('.hero-3d-container') || target.closest('#tab3dCore') || target.closest('#hero3dCanvas')) {
                return;
            }

            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            categoryEl.textContent = data.category || 'SYSTEM INTEL';
            titleEl.textContent = data.title || 'Component Overview';
            descEl.textContent = data.desc || '';
            actionEl.innerHTML = `<i class="fa-regular fa-hand-pointer"></i> ${data.action || 'Click to interact'}`;
            tagEl.textContent = data.tag || 'HK_OS // v2.6';

            // Set icon
            iconEl.className = data.icon || 'fa-solid fa-circle-info';

            // Active outline on target
            if (activeTarget && activeTarget !== target) {
                activeTarget.removeAttribute('data-hud-active');
            }
            activeTarget = target;
            target.setAttribute('data-hud-active', 'true');

            positionHud(e);

            if (!isVisible) {
                hud.classList.add('active');
                hud.setAttribute('aria-hidden', 'false');
                isVisible = true;
            }
        }

        // Hide HUD
        function hideHud() {
            hideTimeout = setTimeout(() => {
                hud.classList.remove('active');
                hud.setAttribute('aria-hidden', 'true');
                if (activeTarget) {
                    activeTarget.removeAttribute('data-hud-active');
                    activeTarget = null;
                }
                isVisible = false;
            }, 80);
        }

        // Bind events to registered components
        INTEL_CATALOG.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            elements.forEach(el => {
                el.addEventListener('mouseenter', (e) => {
                    const customData = {
                        category: el.getAttribute('data-hud-category') || item.category,
                        title: el.getAttribute('data-hud-title') || item.title,
                        desc: el.getAttribute('data-hud-desc') || item.desc,
                        icon: el.getAttribute('data-hud-icon') || item.icon,
                        action: el.getAttribute('data-hud-action') || item.action,
                        tag: el.getAttribute('data-hud-tag') || item.tag
                    };
                    showHud(customData, el, e);
                });

                el.addEventListener('mousemove', (e) => {
                    if (isVisible) positionHud(e);
                });

                el.addEventListener('mouseleave', () => {
                    hideHud();
                });
            });
        });

        // Ensure 3D Quantum Core and its tab never trigger or keep open the hover overview
        const hero3d = document.getElementById('hero3dContainer');
        if (hero3d) {
            hero3d.addEventListener('mouseenter', hideHud);
            hero3d.addEventListener('mousemove', hideHud);
        }
        const tab3d = document.getElementById('tab3dCore');
        if (tab3d) {
            tab3d.addEventListener('mouseenter', hideHud);
        }

        // Also dynamically detect any element across the document with data-hud-title
        document.body.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-hud-title]');
            if (target && !target.closest('#hero3dContainer') && !target.closest('.hero-3d-container') && !target.closest('#tab3dCore') && !target.hasAttribute('data-hud-bound')) {
                target.setAttribute('data-hud-bound', 'true');
                const customData = {
                    category: target.getAttribute('data-hud-category') || 'COMPONENT INTEL',
                    title: target.getAttribute('data-hud-title'),
                    desc: target.getAttribute('data-hud-desc') || '',
                    icon: target.getAttribute('data-hud-icon') || 'fa-solid fa-circle-info',
                    action: target.getAttribute('data-hud-action') || 'Click to interact',
                    tag: target.getAttribute('data-hud-tag') || 'HK_OS'
                };
                showHud(customData, target, e);

                target.addEventListener('mousemove', (evt) => {
                    if (isVisible) positionHud(evt);
                });
                target.addEventListener('mouseleave', () => {
                    hideHud();
                });
            }
        });
    }

});


