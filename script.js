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
    // 2. STICKY HEADER ELEVATION ON SCROLL
    // ========================================================================
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });


    // ========================================================================
    // 3. ACTIVE NAVIGATION LINK ON SCROLL (SCROLLSPY)
    // ========================================================================
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();


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
            camera.position.z = 7.5;

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Core Group
            const coreGroup = new THREE.Group();
            scene.add(coreGroup);

            // 1. Outer Geodesic Icosahedron Wireframe
            const icosaGeometry = new THREE.IcosahedronGeometry(2.3, 1);
            const icosaMaterial = new THREE.MeshBasicMaterial({
                color: 0x00f2fe,
                wireframe: true,
                transparent: true,
                opacity: 0.65
            });
            const icosaMesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
            coreGroup.add(icosaMesh);

            // 2. Inner Rotating Octahedron
            const octaGeometry = new THREE.OctahedronGeometry(1.4, 0);
            const octaMaterial = new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                wireframe: true,
                transparent: true,
                opacity: 0.85
            });
            const octaMesh = new THREE.Mesh(octaGeometry, octaMaterial);
            coreGroup.add(octaMesh);

            // 3. Center Glowing Quantum Sphere
            const sphereGeometry = new THREE.SphereGeometry(0.7, 24, 24);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0x00f2fe,
                wireframe: true,
                transparent: true,
                opacity: 0.95
            });
            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            coreGroup.add(sphereMesh);

            // 4. Concentric Counter-Rotating Gyroscope Rings
            const ring1Geom = new THREE.TorusGeometry(3.0, 0.03, 16, 90);
            const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.75 });
            const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
            ring1.rotation.x = Math.PI / 3;
            coreGroup.add(ring1);

            const ring2Geom = new THREE.TorusGeometry(3.35, 0.03, 16, 90);
            const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.75 });
            const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
            ring2.rotation.y = Math.PI / 4;
            coreGroup.add(ring2);

            // 5. Orbiting Cyber Satellite Nodes
            const particleCount = 80;
            const particleGeom = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                const u = Math.random();
                const v = Math.random();
                const theta = u * 2.0 * Math.PI;
                const phi = Math.acos(2.0 * v - 1.0);
                const r = 2.6 + Math.random() * 1.2;
                const sinPhi = Math.sin(phi);

                particlePositions[i * 3] = r * sinPhi * Math.cos(theta);
                particlePositions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
                particlePositions[i * 3 + 2] = r * Math.cos(phi);
            }
            particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

            const particleMat = new THREE.PointsMaterial({
                color: 0x00f2fe,
                size: 0.08,
                transparent: true,
                opacity: 0.9
            });
            const particles = new THREE.Points(particleGeom, particleMat);
            coreGroup.add(particles);

            // Interactive Drag Controls with Inertia
            let isDragging = false;
            let prevPointer = { x: 0, y: 0 };
            let rotVelocity = { x: 0, y: 0 };

            container.addEventListener('pointerdown', (e) => {
                isDragging = true;
                prevPointer = { x: e.clientX, y: e.clientY };
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

            // FPS Counter Tracker
            let frameCount = 0;
            let lastFpsCheck = performance.now();

            // Main Animation Loop
            let clock = new THREE.Clock();

            function animateHero() {
                requestAnimationFrame(animateHero);

                const delta = clock.getDelta();
                const time = clock.getElapsedTime();

                // Rotational physics with damping
                coreGroup.rotation.y += rotVelocity.y + 0.007;
                coreGroup.rotation.x += rotVelocity.x;
                rotVelocity.x *= 0.94;
                rotVelocity.y *= 0.94;

                // Subtle Parallax orientation
                coreGroup.position.x += (hoverTilt.x - coreGroup.position.x) * 0.08;
                coreGroup.position.y += (-hoverTilt.y - coreGroup.position.y) * 0.08;

                // Independent sub-object rotations
                ring1.rotation.z += 0.012;
                ring2.rotation.z -= 0.015;
                octaMesh.rotation.y -= 0.012;
                octaMesh.rotation.x += 0.008;

                // Pulsing Quantum Core Scale
                const pulse = 1 + Math.sin(time * 3.5) * 0.12;
                sphereMesh.scale.set(pulse, pulse, pulse);

                // Particles Orbit
                particles.rotation.y -= 0.005;

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
            animateHero();

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

        if (typeof THREE === 'undefined') {
            initBg2DFallback(bgCanvas);
            return;
        }

        try {
            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x060913, 0.0016);

            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1500);
            camera.position.z = 400;

            const renderer = new THREE.WebGLRenderer({
                canvas: bgCanvas,
                alpha: true,
                antialias: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

            // 1. Floating 3D Starfield / Cyber Constellation Points
            const particleCount = 450;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            const color1 = new THREE.Color(0x00f2fe);
            const color2 = new THREE.Color(0x38bdf8);
            const color3 = new THREE.Color(0x6366f1);

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 1200;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

                const mixedColor = i % 3 === 0 ? color1 : (i % 3 === 1 ? color2 : color3);
                colors[i * 3] = mixedColor.r;
                colors[i * 3 + 1] = mixedColor.g;
                colors[i * 3 + 2] = mixedColor.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 3.2,
                vertexColors: true,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending
            });

            const pointCloud = new THREE.Points(geometry, material);
            scene.add(pointCloud);

            // 2. Dynamic 3D Horizon Grid
            const gridHelper = new THREE.GridHelper(1600, 32, 0x00f2fe, 0x111c38);
            gridHelper.position.y = -220;
            gridHelper.material.opacity = 0.35;
            gridHelper.material.transparent = true;
            scene.add(gridHelper);

            // Parallax mouse & scroll variables
            let targetX = 0;
            let targetY = 0;
            let targetZ = 400;

            window.addEventListener('mousemove', (e) => {
                targetX = ((e.clientX / window.innerWidth) - 0.5) * 90;
                targetY = -((e.clientY / window.innerHeight) - 0.5) * 90;
            }, { passive: true });

            window.addEventListener('scroll', () => {
                const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
                targetZ = 400 - scrollProgress * 320;
            }, { passive: true });

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            function animateBg() {
                requestAnimationFrame(animateBg);

                pointCloud.rotation.y += 0.0006;
                pointCloud.rotation.x += 0.0003;
                gridHelper.rotation.y += 0.0004;

                camera.position.x += (targetX - camera.position.x) * 0.05;
                camera.position.y += (targetY - camera.position.y) * 0.05;
                camera.position.z += (targetZ - camera.position.z) * 0.05;

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
        const scrollCard = document.getElementById('sandeshScrollCard') || document.getElementById('hk3dCard');
        const scene = document.getElementById('hk3dScene');
        const navBrandLogo = document.getElementById('navBrandLogo');
        const closeBtn = document.getElementById('closeHkReviewModalBtn');
        const closeFooterBtn = document.getElementById('closeHkReviewModalFooterBtn');
        const closeBackBtn = document.getElementById('closeHkReviewModalBackBtn');
        const sandeshContactBtn = document.getElementById('sandeshContactBtn') || document.getElementById('hkContactFromModalBtn');

        if (!modal || !scrollCard) return;

        function openSandeshModal() {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            scrollCard.style.transform = 'perspective(1600px) rotateX(0deg) rotateY(0deg) scale(1)';
            document.body.style.overflow = 'hidden';
        }

        function closeSandeshModal() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => {
                scrollCard.style.transform = '';
            }, 300);
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
                scrollCard.style.transform = 'perspective(1600px) rotateX(0deg) rotateY(0deg) scale(1)';
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
                selector: '#tab3dCore',
                category: 'VIEW MODE',
                title: '3D Quantum Core (Three.js)',
                desc: 'Launch real-time interactive Three.js 3D geometric core. Drag and rotate in 3D space with dynamic particles.',
                icon: 'fa-solid fa-cube',
                action: 'Click to switch to 3D canvas',
                tag: 'VIEW // 3D_CORE'
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
                selector: '.hero-3d-container',
                category: '3D WEBGL ENGINE',
                title: 'Quantum Core 3D Viewport',
                desc: 'Custom WebGL Three.js render canvas. Click & drag anywhere inside this viewport to freely rotate the 3D model.',
                icon: 'fa-solid fa-cubes',
                action: 'Click & drag to rotate',
                tag: 'THREE.JS // WEBGL'
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

        // Also dynamically detect any element across the document with data-hud-title
        document.body.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-hud-title]');
            if (target && !target.hasAttribute('data-hud-bound')) {
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


