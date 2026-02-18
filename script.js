console.log('Architectura site loaded.');

// Force to Top on Refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

window.scrollTo(0, 0);

// Just in case, try again after load
window.addEventListener('load', () => {
    setTimeout(() => window.scrollTo(0, 0), 10);
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Setup GSAP ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // --- Nav Entrance Animation ---
        const verticalLinks = document.querySelectorAll('.vertical-nav a');
        console.log('Vertical links found:', verticalLinks.length);

        if (verticalLinks.length > 0) {
            // Animate Links
            gsap.fromTo(verticalLinks,
                { x: 50, opacity: 0, visibility: 'visible' },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    delay: 0.5,
                    ease: "power3.out",
                    clearProps: "all" // Ensure CSS hover effects take over after animation
                }
            );

            // Hero Top Bar Animation (Logo & Actions)
            const heroTopElements = document.querySelectorAll('.brand-logo, .hero-actions');
            if (heroTopElements.length > 0) {
                gsap.fromTo(heroTopElements,
                    { y: -30, opacity: 0, visibility: 'visible' },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.1,
                        delay: 0.5, // Sync with Vertical Nav
                        ease: "power3.out",
                        clearProps: "all"
                    }
                );
            }

            // Hero Text Ring Animation (Fade In)
            const heroRing = document.querySelector('.hero-ring-wrapper');
            if (heroRing) {
                gsap.fromTo(heroRing,
                    { opacity: 0, rotation: -90 },
                    {
                        opacity: 1,
                        rotation: 0,
                        duration: 1.5,
                        delay: 0.8,
                        ease: "power2.out",
                        clearProps: "opacity, rotation"
                    }
                );
            }

            // Animate Background (using CSS variables)
            const verticalNav = document.querySelector('.vertical-nav');
            if (verticalNav) {
                gsap.fromTo(verticalNav,
                    { '--bg-x': '100px', '--bg-opacity': 0 },
                    {
                        '--bg-x': '0px',
                        '--bg-opacity': 1,
                        duration: 1,
                        delay: 0.5, // Sync with links
                        ease: "power3.out"
                    }
                );
            }
        }

    }

    // --- Follow Widget Animation ---
    const followWidget = document.querySelector('.follow-widget');
    const followIcons = document.querySelector('.follow-icons');
    const followLabel = document.querySelector('.follow-label');
    let isFollowExpanded = false;

    if (followWidget && followIcons && followLabel) {
        followWidget.addEventListener('click', (e) => {
            // Prevent click from bubbling if clicking links
            if (e.target.closest('a')) return;

            const tl = gsap.timeline();

            if (!isFollowExpanded) {
                // EXPAND:
                // We simply animate the icons wrapper from 0 to "auto".
                // The parent (.follow-widget) will naturally expand to fit.

                // 1. Change text immediately so it doesn't jump at the end
                followLabel.textContent = 'CLOSE';

                // 2. Animate the icons wrapper opening
                tl.fromTo(followIcons,
                    { width: 0, opacity: 0, marginRight: 0 },
                    {
                        width: "auto",
                        opacity: 1,
                        marginRight: 15,
                        duration: 0.5,
                        ease: "back.out(1.2)" // Subtle bounce for mechanical feel
                    }
                );

                isFollowExpanded = true;
            } else {
                // COLLAPSE:
                // Animate icons wrapper closing
                tl.to(followIcons, {
                    width: 0,
                    opacity: 0,
                    marginRight: 0,
                    duration: 0.4,
                    ease: "power3.inOut"
                });

                // Change text back after animation
                setTimeout(() => {
                    followLabel.textContent = 'FOLLOW';
                }, 300);

                isFollowExpanded = false;
            }
        });
    }

    // --- Active Link Tracking (ScrollSpy) ---
    // --- Active Link Tracking (ScrollSpy) ---
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.vertical-nav a');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // 30% threshold for activation
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        // Default to 'hero' if at top of page and nothing selected
        if (scrollY < 100) {
            current = 'hero';
        }

        navItems.forEach(a => {
            a.classList.remove('nav-active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('nav-active');
            }
        });

        // --- Dynamic Nav Position (Retract on Scroll) ---
        const verticalNav = document.querySelector('.vertical-nav');
        if (verticalNav) {
            if (scrollY > 50) {
                verticalNav.classList.add('nav-scrolled');
            } else {
                verticalNav.classList.remove('nav-scrolled');
            }
        }
    }

    // Run on scroll
    window.addEventListener('scroll', updateActiveLink);
    // Run on load to set initial state
    updateActiveLink();

    // --- Navigation Smooth Scroll ---
    const navLinks = document.querySelectorAll('a[href="#about"], a[href="#projects"], a[href="#services"], a[href="#journal"], a[href="#contact"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const section = document.getElementById(targetId);

            if (section) {
                let target = section;
                if (targetId === 'about') {
                    target = section.querySelector('.about-container') || section;
                } else if (targetId === 'projects') {
                    target = section.querySelector('.project-split-layout') || section;
                } else if (targetId === 'services') {
                    target = section.querySelector('.services-container') || section;
                }

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });

    // --- Hot Bar Logic ---
    const hotBar = document.getElementById('hot-bar');
    const heroSection = document.getElementById('hero');

    if (hotBar && heroSection) {
        // Visibility Observer
        const visibilityObserverOptions = {
            root: null,
            threshold: 0,
            rootMargin: "-100px 0px 0px 0px"
        };
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    hotBar.classList.add('visible');
                } else {
                    hotBar.classList.remove('visible');
                }
            });
        }, visibilityObserverOptions);
        visibilityObserver.observe(heroSection);
        hotBar.classList.remove('visible');

        // Dynamic Contrast Observer
        const contrastObserverOptions = {
            root: null,
            threshold: 0,
            rootMargin: "-50% 0px -50% 0px" // Trigger when section is in middle of viewport
        };

        const contrastObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    if (['about', 'projects', 'contact'].includes(id)) {
                        hotBar.classList.add('light-mode');
                    } else if (['services', 'journal'].includes(id)) {
                        hotBar.classList.remove('light-mode');
                    }
                }
            });
        }, contrastObserverOptions);

        const sectionsToObserve = document.querySelectorAll('section, header');
        sectionsToObserve.forEach(section => {
            if (section.id) contrastObserver.observe(section);
        });
    }

    // --- Follow Expander Logic ---
    const expander = document.querySelector('.social-expander');
    const iconsWrapper = document.querySelector('.icons-wrapper');
    const expanderLabel = document.querySelector('.expander-label');
    let isExpanded = false;

    if (expander && iconsWrapper && expanderLabel) {
        expander.addEventListener('click', () => {
            if (!isExpanded) {
                // Open
                gsap.to(iconsWrapper, {
                    width: 'auto',
                    marginRight: 15,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.out'
                });
                gsap.fromTo('.social-icon',
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out', delay: 0.1 }
                );
                expanderLabel.textContent = 'CLOSE';
                isExpanded = true;
            } else {
                // Close
                gsap.to(iconsWrapper, {
                    width: 0,
                    marginRight: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power3.in'
                });
                expanderLabel.textContent = 'FOLLOW';
                isExpanded = false;
            }
        });
    }

    // --- Typewriter Effect ---
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const words = ['LEGACIES.', 'FUTURES.', 'ICONS.', 'SPACES.'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            let typeSpeed = 100;

            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100 + Math.random() * 50;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000);
    }


    // --- About Paragraph Masked Line Rise ---
    const aboutParagraph = document.querySelector('.about-text .body-text');
    if (aboutParagraph && typeof gsap !== 'undefined') {
        // 1. Split Text Logic (Manual)
        // 1. Split text into words (Robust & Fluid)
        // Get text content but treat newlines as spaces to avoid concatenation issues
        const text = aboutParagraph.innerText.replace(/\n/g, ' ');
        aboutParagraph.innerHTML = '';

        // Wrap each word in a span
        const words = text.split(' ').filter(word => word.trim().length > 0); // Remove empty splits
        words.forEach(word => {
            const span = document.createElement('span');
            span.textContent = word;
            span.style.display = 'inline-block';
            span.style.marginRight = '0.3em'; // Explicit spacing to prevent merging
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.filter = 'blur(10px)'; // Start blurred
            aboutParagraph.appendChild(span);
        });

        // 2. Animate Words (Blur & Fade Stagger)
        gsap.to(aboutParagraph.children, {
            scrollTrigger: {
                trigger: '.about-text',
                start: 'top 80%',
                end: 'top 40%',
                scrub: 1
            },
            y: 0,
            opacity: 1,
            filter: 'blur(0px)', // Clear blur
            stagger: 0.03,
            ease: 'power3.out',
            duration: 1
        });
    }

    // --- About Image Animation (Parallax Reveal) ---
    const aboutImageWrapper = document.querySelector('.about-img-wrapper');
    const aboutImage = document.querySelector('.about-image');

    if (aboutImageWrapper && aboutImage) {
        // Set initial state
        gsap.set(aboutImageWrapper, {
            clipPath: 'inset(0 0 100% 0)' // HIDDEN (Clipped from bottom)
        });
        gsap.set(aboutImage, {
            scale: 1.2 // Zoomed in
        });

        // Animate
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about-visual',
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1 // Smooth scrub
            }
        });

        tl.to(aboutImageWrapper, {
            clipPath: 'inset(0 0 0% 0)', // REVEAL
            duration: 1,
            ease: 'power2.inOut'
        })
            .to(aboutImage, {
                scale: 1, // Zoom out to normal
                duration: 1,
                ease: 'power2.out'
            }, 0); // Run together
    }

    // --- Project Section Animations ---

    // 1. Text Stagger (Left Column)
    const projectInfo = document.querySelector('.project-info-col');
    if (projectInfo) {
        // Select direct children: h2, p, a
        const children = projectInfo.querySelectorAll('h2, p, a');
        gsap.from(children, {
            scrollTrigger: {
                trigger: projectInfo,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            stagger: 0.2, // Distinct stagger
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // 2. Image 1: Obsidian House (Clip Reveal - Bottom to Top)
    const obsidianWrapper = document.querySelector('.item-obsidian .project-img-wrapper');
    const obsidianPlaceholder = document.querySelector('.item-obsidian .project-placeholder');

    if (obsidianWrapper && obsidianPlaceholder) {
        // Set initial state
        gsap.set(obsidianWrapper, { clipPath: 'inset(100% 0 0 0)' }); // Hidden (Clipped from Bottom)
        gsap.set(obsidianPlaceholder, { scale: 1.2 }); // Zoomed in

        const tlObsidian = gsap.timeline({
            scrollTrigger: {
                trigger: '.item-obsidian',
                start: 'top 80%',
                end: 'center 60%',
                scrub: 1
            }
        });

        tlObsidian.to(obsidianWrapper, {
            clipPath: 'inset(0% 0 0 0)', // Reveal
            ease: 'power2.inOut',
            duration: 1
        })
            .to(obsidianPlaceholder, {
                scale: 1,
                ease: 'power2.out',
                duration: 1
            }, 0);
    }

    // 3. Image 2: Gallery X (Clip Reveal - Left to Right)
    const galleryWrapper = document.querySelector('.item-gallery .project-img-wrapper');
    const galleryPlaceholder = document.querySelector('.item-gallery .project-placeholder');
    // Note: Gallery X content is dynamically loaded sometimes so we check carefully
    const galleryItem = document.querySelector('.item-gallery');

    if (galleryWrapper && galleryPlaceholder) {
        // Set initial state
        gsap.set(galleryWrapper, { clipPath: 'inset(0 100% 0 0)' }); // Hidden (Clipped from Right)
        gsap.set(galleryPlaceholder, { scale: 1.2 });

        const tlGallery = gsap.timeline({
            scrollTrigger: {
                trigger: '.item-gallery',
                start: 'top 80%',
                end: 'center 60%',
                scrub: 1
            }
        });

        tlGallery.to(galleryWrapper, {
            clipPath: 'inset(0 0% 0 0)', // Reveal
            ease: 'power2.inOut',
            duration: 1
        })
            .to(galleryPlaceholder, {
                scale: 1,
                ease: 'power2.out',
                duration: 1
            }, 0);
    }

    // 4. Image 3: Skyline (Clip Reveal - Wipe Left to Right)
    const skylineWrapper = document.querySelector('.item-skyline .project-img-wrapper');
    const skylinePlaceholder = document.querySelector('.item-skyline .project-placeholder');

    if (skylineWrapper && skylinePlaceholder) {
        // Set initial state
        gsap.set(skylineWrapper, { clipPath: 'inset(0 100% 0 0)' }); // Hidden (Clipped Right)
        gsap.set(skylinePlaceholder, { scale: 1.2 }); // Zoomed in initially

        const tlSkyline = gsap.timeline({
            scrollTrigger: {
                trigger: '.item-skyline',
                start: 'top 80%',
                end: 'center 75%', // Retuned to finish even earlier
                scrub: 1
            }
        });

        tlSkyline.to(skylineWrapper, {
            clipPath: 'inset(0 0% 0 0)', // Reveal to full
            ease: 'power2.inOut',
            duration: 1
        })
            .to(skylinePlaceholder, {
                scale: 1,
                ease: 'power2.out',
                duration: 1
            }, 0);
    }

    // --- Services Section Animations ---

    // 1. Sketch Animation (Fade In & Scale)
    const serviceImgWrapperNew = document.querySelector('.service-img-wrapper');
    const dotsPatternNew = document.querySelector('.dots-pattern');

    if (serviceImgWrapperNew && typeof gsap !== 'undefined') {
        gsap.fromTo(serviceImgWrapperNew,
            { autoAlpha: 0, scale: 0.9 },
            {
                scrollTrigger: {
                    trigger: '.services-visual',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                autoAlpha: 1,
                scale: 1,
                duration: 1.5,
                ease: 'power3.out'
            }
        );
    }

    // Orbit Effect (Continuous Rotation)
    if (dotsPatternNew && typeof gsap !== 'undefined') {
        gsap.to(dotsPatternNew, {
            rotation: 360,
            duration: 30,
            repeat: -1,
            ease: 'linear'
        });
    }

    // 2. Heading Reveal (Manual Split Text)
    // Renamed to avoid any potential scope conflict
    const servicesTitleEl = document.querySelector('.services-title');
    if (servicesTitleEl && typeof gsap !== 'undefined') {
        const textContent = servicesTitleEl.textContent.trim();
        servicesTitleEl.innerHTML = '';
        const chars = textContent.split('');

        chars.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            if (char === ' ') {
                span.style.width = '0.3em'; // Preserve spaces visually
            }
            servicesTitleEl.appendChild(span);
        });

        // Animate children (spans)
        // Convert HTMLCollection to Array for safety
        const spans = Array.from(servicesTitleEl.children);

        if (spans.length > 0) {
            gsap.from(spans, {
                scrollTrigger: {
                    trigger: servicesTitleEl,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: '100%',
                opacity: 0,
                rotationX: 90, // clean flip effect
                stagger: 0.03,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
        }
    }

    // 3. Service List Stagger
    const serviceListItems = document.querySelectorAll('.service-item');
    if (serviceListItems.length > 0 && typeof gsap !== 'undefined') {
        gsap.from(serviceListItems, {
            scrollTrigger: {
                trigger: '.services-list',
                start: 'top 80%', // When list enters viewport
                toggleActions: 'play none none none' // Play once, don't reverse
            },
            y: 30, // Entrance from below
            opacity: 0,
            stagger: 0.2, // 0.2s delay between items
            duration: 0.8,
            ease: 'power2.out',
            clearProps: "all" // Remove inline styles after animation to fix layout bugs
        });
    }

    // --- AI Chat Trigger Logic ---
    const aiChatTrigger = document.querySelector('.ai-chat-trigger');
    if (aiChatTrigger) {
        aiChatTrigger.addEventListener('click', function () {
            // Placeholder: In a real implementation, this would open a chat modal
            console.log('AI Chat Trigger Clicked');
            alert('AI Chat feature coming soon! Ask DDS AI your architectural questions.');
        });

    }




    // --- Mobile Sticky Header Logic ---
    const mobileHeader = document.querySelector('.mobile-scroll-header');
    if (mobileHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                mobileHeader.classList.add('visible');
            } else {
                mobileHeader.classList.remove('visible');
            }
        });
    }

    // --- Mobile Hamburger Menu Logic (Strictly Isolated) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavLinks = document.querySelector('.nav-links');

    if (menuToggle && mobileNavLinks) {
        menuToggle.addEventListener('click', () => {
            mobileNavLinks.classList.toggle('active');
            menuToggle.classList.toggle('open'); // Animate Hamburger to X

            // Hide Sticky Header when Menu is Open
            if (mobileHeader) {
                if (mobileNavLinks.classList.contains('active')) {
                    mobileHeader.classList.add('hide-sticky');
                } else {
                    mobileHeader.classList.remove('hide-sticky');
                }
            }

            // Optional: Prevent scrolling when menu is open
            document.body.style.overflow = mobileNavLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        const links = mobileNavLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close Menu
                mobileNavLinks.classList.remove('active');
                menuToggle.classList.remove('open');
                document.body.style.overflow = '';

                // Show Sticky Header again
                if (mobileHeader) {
                    mobileHeader.classList.remove('hide-sticky');
                }

                // Smooth Scroll with Offset for Mobile
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const headerOffset = 50; // User requested 50px buffer
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                }
            });
        });
    }
});
