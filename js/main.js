document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Scroll Effect & Progress Bar ---
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.querySelector('.scroll-progress');

    let ticking = false;

    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Navbar scrolled state
        if (scrollPos > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Progress Bar
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                if (scrollProgress) {
                    scrollProgress.style.width = scrolled + "%";
                }

                // Active Link Detection
                let current = "";
                const sections = document.querySelectorAll('section, header');
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    // Adjust trigger point for better feel
                    if (scrollPos >= sectionTop - 150) {
                        current = section.getAttribute('id');
                    }
                });

                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${current}`) {
                        item.classList.add('active');
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // --- Magnetic Hover Effect for Nav Links ---
    const navLinkEls = document.querySelectorAll('.nav-links a');

    navLinkEls.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transition = 'transform 0.1s ease, color 0.25s ease, text-shadow 0.25s ease, background 0.25s ease';
        });
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            link.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease, text-shadow 0.25s ease, background 0.25s ease';
            link.style.transform = 'translate(0, 0)';
        });
    });

    // --- Intersection Observer for Reveals ---
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom, [data-reveal]');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Once it's revealed, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Form Category Logic ---
    const categorySelect = document.getElementById('category');
    const teamNameGroup = document.getElementById('teamNameGroup');
    const teamMembersSections = document.querySelectorAll('.team-members-section');

    categorySelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const isTeamEvent = (value === 'gaming' || value === 'both' || value === 'dev');

        if (isTeamEvent) {
            teamNameGroup.style.display = 'flex';
            teamMembersSections.forEach(section => {
                section.style.display = 'flex';
            });
        } else {
            teamNameGroup.style.display = 'none';
            teamMembersSections.forEach(section => {
                section.style.display = 'none';
            });
        }
    });

    // Initial state trigger
    categorySelect.dispatchEvent(new Event('change'));

    // --- Form Submission ---
    const regForm = document.getElementById('registrationForm');
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Disable button to prevent double clicks
        const submitBtn = regForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Registering...';
        submitBtn.disabled = true;

        // REPLACE THIS URL with your actual Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyLrg7mmB0AinsKuMKNplC18cTSOgwVmUIwABqaOt2xkWqJtjWiQc_Swsp_yaFik_TO/exec';

        // Collect all form data directly from the HTML form
        const formData = new FormData(regForm);

        // Send data to Google Sheets
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                const modal = document.getElementById('successModal');
                const closeBtn = document.getElementById('closeModalBtn');

                modal.classList.add('show');

                closeBtn.onclick = () => {
                    modal.classList.remove('show');
                };

                modal.onclick = (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('show');
                    }
                };

                regForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                categorySelect.dispatchEvent(new Event('change')); // Reset dynamic fields
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('Oops! Something went wrong while submitting the form. Please try again.');
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
    });

    // --- Glitch Effect Variation ---
    const glitchTitle = document.querySelector('.glitch-text');
    if (glitchTitle) {
        // Reduced frequency for better performance, especially on mobile
        const glitchInterval = window.innerWidth < 768 ? 500 : 200;
        setInterval(() => {
            glitchTitle.style.setProperty('--glitch-offset', Math.random() * 10 - 5 + 'px');
        }, glitchInterval);
    }

});
