/**
 * Dentricks Dental Clinic - Core Interactivity Script
 * Handles: Theme Toggle, Mobile Menu, Symptom Checker, Before/After Slider, Testimonials, FAQs Accordion, Custom Calendar, Booking Scheduler, and LocalStorage Staff Portal.
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initBeforeAfterSlider();
    initTestimonialCarousel();
    initFaqAccordion();
    initSymptomChecker();
    initClinicCarousel();
});

// ==========================================
// 1. Theme Toggle (All Pages)
// ==========================================
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;
    const body = document.body;

    // Load saved preference
    const savedTheme = localStorage.getItem('dentricks-theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    toggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('dentricks-theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('dentricks-theme', 'light');
        }
    });
}

// ==========================================
// 2. Mobile Menu Navigation (All Pages)
// ==========================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// ==========================================
// 3. Before/After Image Slider (Home Page)
// ==========================================
function initBeforeAfterSlider() {
    const sliderInput = document.getElementById('compare-slider');
    const afterOverlay = document.getElementById('img-after-overlay');
    const sliderLine = document.getElementById('slider-line');

    if (!sliderInput || !afterOverlay || !sliderLine) return;

    sliderInput.addEventListener('input', (e) => {
        const value = e.target.value;
        afterOverlay.style.width = `${value}%`;
        sliderLine.style.left = `${value}%`;
    });
}

// ==========================================
// 4. Testimonials Carousel (Home Page)
// ==========================================
function initTestimonialCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const track = document.getElementById('testimonials-track');
    
    if (slides.length === 0 || !track) return;

    let currentIndex = 0;
    let autoplayInterval;

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${index * 100}%)`;

        slides.forEach((slide, idx) => {
            slide.classList.remove('active');
            if (idx === index) {
                slide.classList.add('active');
            }
        });

        indicators.forEach((ind, idx) => {
            ind.classList.remove('active');
            if (idx === index) {
                ind.classList.add('active');
            }
        });
    }

    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const slideIndex = parseInt(indicator.getAttribute('data-slide'));
            goToSlide(slideIndex);
            resetAutoplay();
        });
    });

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Pause autoplay on mouse hover
    const carouselContainer = document.querySelector('.testimonials-slider-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
}

// ==========================================
// 5. FAQs Accordion (About Page)
// ==========================================
function initFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question-btn');
    if (questions.length === 0) return;

    questions.forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.nextElementSibling;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Close other items
            questions.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherBtn.nextElementSibling) {
                        otherBtn.nextElementSibling.style.maxHeight = null;
                    }
                }
            });

            // Toggle current item
            if (isExpanded) {
                btn.setAttribute('aria-expanded', 'false');
                wrapper.style.maxHeight = null;
            } else {
                btn.setAttribute('aria-expanded', 'true');
                wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
            }
        });
    });
}

// ==========================================
// 6. Dental Symptom Checker Quiz (Services Page)
// ==========================================
const QUIZ_DATA = {
    details: {
        pain: [
            { value: 'sensitivity', title: 'Hot/Cold Sensitivity', desc: 'Sharp pain when drinking hot coffee or cold water.' },
            { value: 'severe-pain', title: 'Severe Throbbing Pain', desc: 'Constant toothache that worsens when biting down or lying down.' },
            { value: 'gum-pain', title: 'Bleeding or Swollen Gums', desc: 'Redness and bleeding when brushing teeth or flossing.' }
        ],
        aesthetics: [
            { value: 'stains', title: 'Stained or Yellow Teeth', desc: 'Surface stains from tea, coffee, or general yellowing.' },
            { value: 'crooked', title: 'Crooked or Misaligned Teeth', desc: 'Spacing issues, overlapping teeth, or a crooked bite.' },
            { value: 'chipped-cosmetic', title: 'Chipped/Asymmetric Tooth', desc: 'A chip, crack, or minor spacing gap on the front smile line.' }
        ],
        checkup: [
            { value: 'routine-cleaning', title: 'Routine 6-Month Clean', desc: 'Standard plaque scaling and regular preventive examination.' },
            { value: 'deep-clean', title: 'Overdue Clean (12+ Months)', desc: 'It has been more than a year since my last dental checkup.' },
            { value: 'xray-check', title: 'Full Checkup & Diagnostics', desc: 'Complete review of teeth and jaws using 3D digital imaging.' }
        ],
        broken: [
            { value: 'fracture', title: 'Broken or Cracked Tooth', desc: 'A structural tooth fracture due to decay or physical trauma.' },
            { value: 'lost-restoration', title: 'Lost Filling or Crown', desc: 'An older tooth filling or crown has fallen off and exposed the tooth.' },
            { value: 'missing-gap', title: 'Missing Tooth Gap', desc: 'Looking to fill an empty gap left by a previous extraction.' }
        ]
    },
    recommendations: {
        'sensitivity': {
            title: 'Fluoride Treatment & Desensitizing',
            icon: 'fa-shield-halved',
            desc: 'For temperature sensitivity, we recommend a sensitive hygiene treatment. We apply clinical fluoride varnishes to re-mineralize enamel and block exposed nerve tubules.',
            duration: '45 Mins',
            treatmentId: 'general-checkup'
        },
        'severe-pain': {
            title: 'Root Canal Treatment (RCT)',
            icon: 'fa-notes-medical',
            desc: 'Severe throbbing pain usually points to an infected tooth pulp. Dr. Shah specializes in virtually painless single-sitting root canals to remove infection and save your natural tooth.',
            duration: '60 Mins',
            treatmentId: 'rct'
        },
        'gum-pain': {
            title: 'Deep Scaling & Gum Therapy',
            icon: 'fa-hand-holding-droplet',
            desc: 'Bleeding gums are a key symptom of gum disease. We recommend a deep scaling session to clear out plaque, calculus, and bacterial pockets beneath the gumline.',
            duration: '45 Mins',
            treatmentId: 'general-checkup'
        },
        'stains': {
            title: 'Laser Teeth Whitening',
            icon: 'fa-wand-magic-sparkles',
            desc: 'To lift deep stains and brighten yellow teeth, we recommend our clinical laser teeth bleaching. Safe, fast, and gives results up to 8 shades lighter in just 1 visit.',
            duration: '60 Mins',
            treatmentId: 'cosmetic'
        },
        'crooked': {
            title: 'Invisalign® Aligner Assessment',
            icon: 'fa-align-center',
            desc: 'For alignment corrections, Invisalign clear aligners provide a comfortable, transparent, and removable solution. Dr. Shah will take digital scans to design your week-by-week teeth shifts.',
            duration: '45 Mins',
            treatmentId: 'ortho'
        },
        'chipped-cosmetic': {
            title: 'Porcelain Veneers or Bonding',
            icon: 'fa-sparkles',
            desc: 'To fix chips or spacing gaps on your smile line, custom porcelain veneers or tooth-colored composite bonding offer an immediate and highly aesthetic transformation.',
            duration: '60 Mins',
            treatmentId: 'cosmetic'
        },
        'routine-cleaning': {
            title: 'Preventive Cleaning & Scaling',
            icon: 'fa-calendar-check',
            desc: 'Excellent routine habits! We recommend a standard scaling, polishing, and dental exam to prevent decay and maintain perfect oral hygiene.',
            duration: '45 Mins',
            treatmentId: 'general-checkup'
        },
        'deep-clean': {
            title: 'Comprehensive Dental Cleaning',
            icon: 'fa-shield-halved',
            desc: 'Plaque that stays on teeth for over a year calcifies into hard tartar. We recommend a full clean and scaling to protect gums from inflammatory gum diseases.',
            duration: '60 Mins',
            treatmentId: 'general-checkup'
        },
        'xray-check': {
            title: 'Checkup & Digital 3D Scans',
            icon: 'fa-circle-info',
            desc: 'For a thorough assessment of your oral structures, we recommend a general consultation paired with 3D diagnostic scans to review roots and bone density.',
            duration: '45 Mins',
            treatmentId: 'general-checkup'
        },
        'fracture': {
            title: 'Tooth Restoration or Crowns',
            icon: 'fa-tooth',
            desc: 'A broken tooth needs fast treatment to prevent infection. Depending on the size of the break, we will restore it using a matching composite filling or a zirconia crown.',
            duration: '60 Mins',
            treatmentId: 'cosmetic'
        },
        'lost-restoration': {
            title: 'Filling Replacement & Crown Repair',
            icon: 'fa-screwdriver',
            desc: 'An open space from a lost filling allows bacteria to enter the tooth structure. We will sanitize the cavity and restore the tooth with modern composite materials.',
            duration: '45 Mins',
            treatmentId: 'cosmetic'
        },
        'missing-gap': {
            title: 'Advanced Dental Implants',
            icon: 'fa-screwdriver',
            desc: 'Implants are the gold standard to replace missing teeth. A biocompatible titanium post is placed in the jaw bone and capped with a custom ceramic crown to restore 100% bite function.',
            duration: '60 Mins',
            treatmentId: 'implants'
        }
    }
};

function initSymptomChecker() {
    let currentStep = 1;
    let selectedConcern = '';
    let selectedDetail = '';
    let selectedRecData = null;

    const progressFill = document.getElementById('quiz-progress');
    const stepIndicators = document.querySelectorAll('.progress-step');
    const steps = document.querySelectorAll('.quiz-step');
    
    if (steps.length === 0 || !progressFill) return;
    
    const step1Options = document.querySelectorAll('#quiz-step-1 .quiz-option');
    const q2Title = document.getElementById('quiz-q2-title');
    const q2OptionsGrid = document.getElementById('quiz-q2-options');
    const prevBtn = document.getElementById('quiz-prev-btn');
    
    const resultTitle = document.getElementById('quiz-result-title');
    const resultDesc = document.getElementById('quiz-result-desc');
    const resultIcon = document.getElementById('result-icon');
    const resultDuration = document.getElementById('quiz-result-duration');
    const resultSpecialist = document.getElementById('quiz-result-specialist');
    const resetBtn = document.getElementById('quiz-reset-btn');
    const bookResultBtn = document.getElementById('quiz-book-result-btn');

    function updateProgress() {
        const percentage = ((currentStep - 1) / 2) * 100;
        progressFill.style.width = `${percentage}%`;

        stepIndicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                indicator.classList.add('active');
            } else if (stepNum < currentStep) {
                indicator.classList.add('completed');
            }
        });
    }

    function showStep(stepNum) {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`quiz-step-${stepNum}`).classList.add('active');
        currentStep = stepNum;
        updateProgress();
    }

    // Step 1 Click
    step1Options.forEach(option => {
        option.addEventListener('click', () => {
            step1Options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedConcern = option.getAttribute('data-value');
            
            buildStep2Options();
            setTimeout(() => {
                showStep(2);
            }, 250);
        });
    });

    // Step 2 content population
    function buildStep2Options() {
        const titles = {
            pain: 'Select the statement that matches your pain:',
            aesthetics: 'Choose your main aesthetic goal:',
            checkup: 'When was your last dental visit?',
            broken: 'Describe the structural tooth issue:'
        };
        q2Title.textContent = titles[selectedConcern] || 'Select details:';
        q2OptionsGrid.innerHTML = '';

        const optionsList = QUIZ_DATA.details[selectedConcern] || [];
        optionsList.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.setAttribute('data-value', opt.value);
            
            let iconHTML = '<i class="fa-solid fa-circle-question"></i>';
            if (opt.value === 'sensitivity') iconHTML = '<i class="fa-solid fa-snowflake"></i>';
            else if (opt.value === 'severe-pain') iconHTML = '<i class="fa-solid fa-fire-flame-curved"></i>';
            else if (opt.value === 'gum-pain') iconHTML = '<i class="fa-solid fa-droplet"></i>';
            else if (opt.value === 'stains') iconHTML = '<i class="fa-solid fa-sun"></i>';
            else if (opt.value === 'crooked') iconHTML = '<i class="fa-solid fa-align-center"></i>';
            else if (opt.value === 'chipped-cosmetic') iconHTML = '<i class="fa-solid fa-sparkles"></i>';
            else if (opt.value === 'routine-cleaning') iconHTML = '<i class="fa-solid fa-shield-heart"></i>';
            else if (opt.value === 'deep-clean') iconHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
            else if (opt.value === 'xray-check') iconHTML = '<i class="fa-solid fa-magnifying-glass-chart"></i>';
            else if (opt.value === 'fracture') iconHTML = '<i class="fa-solid fa-heart-crack"></i>';
            else if (opt.value === 'lost-restoration') iconHTML = '<i class="fa-solid fa-wrench"></i>';
            else if (opt.value === 'missing-gap') iconHTML = '<i class="fa-solid fa-tooth"></i>';

            btn.innerHTML = `
                <span class="option-icon">${iconHTML}</span>
                <span class="option-title" style="color: var(--primary-deep);">${opt.title}</span>
                <span class="option-desc">${opt.desc}</span>
            `;

            btn.addEventListener('click', () => {
                const step2Buttons = q2OptionsGrid.querySelectorAll('.quiz-option');
                step2Buttons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedDetail = opt.value;

                loadRecommendation();
                setTimeout(() => {
                    showStep(3);
                }, 250);
            });

            q2OptionsGrid.appendChild(btn);
        });
    }

    function loadRecommendation() {
        const rec = QUIZ_DATA.recommendations[selectedDetail];
        if (!rec) return;
        selectedRecData = rec;

        resultTitle.textContent = rec.title;
        resultDesc.textContent = rec.desc;
        resultDuration.textContent = rec.duration;
        resultSpecialist.textContent = "Dr. Rikin Shah";
        resultIcon.className = `fa-solid ${rec.icon}`;
    }

    prevBtn.addEventListener('click', () => showStep(1));

    resetBtn.addEventListener('click', () => {
        selectedConcern = '';
        selectedDetail = '';
        selectedRecData = null;
        step1Options.forEach(opt => opt.classList.remove('selected'));
        showStep(1);
    });

    bookResultBtn.addEventListener('click', () => {
        window.location.href = 'contact.html';
    });
}

// ==========================================
// 8. Clinic Carousel (About Page)
// ==========================================
function initClinicCarousel() {
    const track = document.getElementById('clinic-carousel-track');
    const dots = document.querySelectorAll('#clinic-carousel-dots .carousel-dot');
    if (!track || dots.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval;

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${index * 100}%)`;

        dots.forEach((dot, idx) => {
            dot.classList.remove('active');
            if (idx === index) {
                dot.classList.add('active');
            }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % dots.length;
            goToSlide(nextIndex);
        }, 4000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Pause on hover
    const container = track.closest('.clinic-carousel-container');
    if (container) {
        container.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        container.addEventListener('mouseleave', startAutoSlide);
    }
}


