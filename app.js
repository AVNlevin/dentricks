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
    initBookingScheduler();
    initAdminPortal();
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
        if (!selectedRecData) return;
        window.location.href = `contact.html?treatment=${selectedRecData.treatmentId}`;
    });
}

// ==========================================
// 7. Interactive Booking Scheduler (Contact Page)
// ==========================================
function initBookingScheduler() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;

    let bookingState = {
        step: 1,
        branchId: 'vesu', // default
        date: null,
        timeSlot: null
    };

    const stepLinks = document.querySelectorAll('.booking-steps-sidebar .step-link');
    const formSteps = document.querySelectorAll('.booking-form .form-step');
    const branchCards = document.querySelectorAll('.dentist-card');

    const btnNext1 = document.getElementById('btn-next-1');
    const btnPrev2 = document.getElementById('btn-prev-2');
    const btnNext2 = document.getElementById('btn-next-2');
    const btnPrev3 = document.getElementById('btn-prev-3');

    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarDaysGrid = document.getElementById('calendar-days-grid');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    const dateDisplay = document.getElementById('selected-date-display');

    const summaryDentist = document.getElementById('summary-dentist');
    const summaryDatetime = document.getElementById('summary-datetime');

    const successModal = document.getElementById('success-modal');
    const modalDentist = document.getElementById('modal-dentist-name');
    const modalTime = document.getElementById('modal-appointment-time');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Date variables (defaulting calendar display to May 2026 for consistent demo slots)
    let currentCalDate = new Date(2026, 4, 1); 
    const todayDemo = new Date(2026, 4, 23); // Simulated system local date

    // Parse URL parameters for pre-selected treatments from Services Page
    const urlParams = new URLSearchParams(window.location.search);
    const treatmentParam = urlParams.get('treatment');
    if (treatmentParam) {
        const selectEl = document.getElementById('treatment-select');
        if (selectEl) {
            selectEl.value = treatmentParam;
        }
    }

    function showFormStep(stepNum) {
        formSteps.forEach(step => step.classList.remove('active'));
        document.getElementById(`form-step-${stepNum}`).classList.add('active');
        
        stepLinks.forEach((link, idx) => {
            link.classList.remove('active');
            if (idx + 1 === stepNum) {
                link.classList.add('active');
            }
        });
        
        bookingState.step = stepNum;
        if (stepNum === 3) {
            updateBookingSummary();
        }
    }

    // Step 1: Branch Selection
    branchCards.forEach(card => {
        card.addEventListener('click', () => {
            branchCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            bookingState.branchId = card.getAttribute('data-branch-id');
            
            // Reset date/slots if branch changes
            bookingState.date = null;
            bookingState.timeSlot = null;
            btnNext2.disabled = true;
            dateDisplay.textContent = '(Select a Date)';
            
            renderCalendar();
            renderTimeSlots();
        });
    });

    btnNext1.addEventListener('click', () => {
        showFormStep(2);
        renderCalendar();
    });

    // Step 2 Calendar Navigation
    btnPrev2.addEventListener('click', () => showFormStep(1));
    btnNext2.addEventListener('click', () => showFormStep(3));
    btnPrev3.addEventListener('click', () => showFormStep(2));

    function updateBookingSummary() {
        const branchName = bookingState.branchId === 'vesu' ? 'Vesu Branch (Times Square)' : 'Kadodara Branch (Satkar Complex)';
        summaryDentist.textContent = branchName;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = bookingState.date.toLocaleDateString('en-US', options);
        summaryDatetime.textContent = `${formattedDate} at ${bookingState.timeSlot}`;
    }

    // Render Calendar grid
    function renderCalendar() {
        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
        calendarDaysGrid.innerHTML = '';

        const firstDayOffset = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Prefill empty blocks
        for (let i = 0; i < firstDayOffset; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'cal-day empty';
            calendarDaysGrid.appendChild(emptyDay);
        }

        // Fill month days
        for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'cal-day';
            dayEl.textContent = dayNum;

            const thisDate = new Date(year, month, dayNum);
            const dayOfWeek = thisDate.getDay();

            // Disable past days and weekends (Saturday/Sunday)
            const isPast = thisDate < new Date(todayDemo.getFullYear(), todayDemo.getMonth(), todayDemo.getDate());
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6

            if (isPast || isWeekend) {
                dayEl.classList.add('disabled');
            } else {
                if (thisDate.toDateString() === todayDemo.toDateString()) {
                    dayEl.classList.add('today');
                }
                
                if (bookingState.date && thisDate.toDateString() === bookingState.date.toDateString()) {
                    dayEl.classList.add('selected');
                }

                dayEl.addEventListener('click', () => {
                    const days = calendarDaysGrid.querySelectorAll('.cal-day');
                    days.forEach(d => d.classList.remove('selected'));
                    dayEl.classList.add('selected');
                    
                    bookingState.date = thisDate;
                    bookingState.timeSlot = null; // reset slot selection
                    btnNext2.disabled = true;

                    const displayOptions = { month: 'short', day: 'numeric' };
                    dateDisplay.textContent = `(${thisDate.toLocaleDateString('en-US', displayOptions)})`;

                    renderTimeSlots();
                });
            }
            calendarDaysGrid.appendChild(dayEl);
        }
    }

    prevMonthBtn.addEventListener('click', () => {
        // Restrict scrolling backward before mock today
        if (currentCalDate.getMonth() > todayDemo.getMonth() || currentCalDate.getFullYear() > todayDemo.getFullYear()) {
            currentCalDate.setMonth(currentCalDate.getMonth() - 1);
            renderCalendar();
        }
    });

    nextMonthBtn.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() + 1);
        renderCalendar();
    });

    // Populate Time Slots based on Branch and shift timings
    function renderTimeSlots() {
        timeSlotsGrid.innerHTML = '';
        if (!bookingState.date) {
            timeSlotsGrid.innerHTML = '<div class="empty-state-slots">Please select an available date on the calendar first.</div>';
            return;
        }

        // Shift lists
        const vesuSlots = ["03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM", "06:00 PM", "06:45 PM", "07:30 PM"];
        const kadodaraSlots = ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM", "01:30 PM"];

        const slots = bookingState.branchId === 'vesu' ? vesuSlots : kadodaraSlots;
        const daySeed = bookingState.date.getDate(); // Pseudo-random booked slots generator

        slots.forEach((time, index) => {
            const slotEl = document.createElement('div');
            slotEl.className = 'time-slot';
            slotEl.textContent = time;

            // Generate mock bookings dynamically so calendar feels live
            const isBooked = (daySeed + index) % 4 === 0;

            if (isBooked) {
                slotEl.classList.add('booked');
                slotEl.setAttribute('title', 'Already Booked');
            } else {
                if (bookingState.timeSlot === time) {
                    slotEl.classList.add('selected');
                }

                slotEl.addEventListener('click', () => {
                    const allSlots = timeSlotsGrid.querySelectorAll('.time-slot');
                    allSlots.forEach(s => s.classList.remove('selected'));
                    slotEl.classList.add('selected');
                    
                    bookingState.timeSlot = time;
                    btnNext2.disabled = false; // Enable submit
                });
            }
            timeSlotsGrid.appendChild(slotEl);
        });
    }

    // Submit and store booking in localStorage
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const nameInput = document.getElementById('patient-name');
        const emailInput = document.getElementById('patient-email');
        const phoneInput = document.getElementById('patient-phone');

        nameInput.closest('.input-group').classList.remove('invalid');
        emailInput.closest('.input-group').classList.remove('invalid');
        phoneInput.closest('.input-group').classList.remove('invalid');

        if (!nameInput.value.trim()) {
            nameInput.closest('.input-group').querySelector('.error-message').style.display = 'block';
            nameInput.closest('.input-group').classList.add('invalid');
            isValid = false;
        } else {
            nameInput.closest('.input-group').querySelector('.error-message').style.display = 'none';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
            emailInput.closest('.input-group').querySelector('.error-message').style.display = 'block';
            emailInput.closest('.input-group').classList.add('invalid');
            isValid = false;
        } else {
            emailInput.closest('.input-group').querySelector('.error-message').style.display = 'none';
        }

        const phoneRegex = /^[6789]\d{9}$/; // Standard Indian mobile numbers (10 digits)
        const rawPhone = phoneInput.value.trim().replace(/\s+/g, '');
        if (!rawPhone || !phoneRegex.test(rawPhone)) {
            phoneInput.closest('.input-group').querySelector('.error-message').style.display = 'block';
            phoneInput.closest('.input-group').classList.add('invalid');
            isValid = false;
        } else {
            phoneInput.closest('.input-group').querySelector('.error-message').style.display = 'none';
        }

        if (isValid) {
            const newBooking = {
                id: 'DK-' + Math.floor(100000 + Math.random() * 900000).toString(),
                patientName: nameInput.value.trim(),
                patientEmail: emailInput.value.trim(),
                patientPhone: phoneInput.value.trim(),
                treatment: document.getElementById('treatment-select').value,
                notes: document.getElementById('patient-notes').value.trim(),
                branch: bookingState.branchId,
                date: bookingState.date.toISOString(),
                timeSlot: bookingState.timeSlot,
                timestamp: new Date().toISOString()
            };

            // Save to LocalStorage database list
            const existingBookings = JSON.parse(localStorage.getItem('dentricks_bookings')) || [];
            existingBookings.push(newBooking);
            localStorage.setItem('dentricks_bookings', JSON.stringify(existingBookings));

            // Trigger success modal
            const branchDisplayName = bookingState.branchId === 'vesu' ? 'Vesu Times Square Branch' : 'Kadodara Satkar Complex Branch';
            modalDentist.textContent = branchDisplayName;

            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = bookingState.date.toLocaleDateString('en-US', options);
            modalTime.innerHTML = `<i class="fa-solid fa-calendar-day"></i> ${formattedDate} at ${bookingState.timeSlot}`;

            successModal.classList.add('active');
        }
    });

    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        bookingForm.reset();
        
        // Reset local variables
        bookingState = {
            step: 1,
            branchId: 'vesu',
            date: null,
            timeSlot: null
        };
        
        branchCards.forEach(c => c.classList.remove('active'));
        document.querySelector('.dentist-card[data-branch-id="vesu"]').classList.add('active');
        dateDisplay.textContent = '(Select a Date)';
        btnNext2.disabled = true;
        
        renderTimeSlots();
        showFormStep(1);
        
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 8. Staff Portal Admin Dashboard (LocalStorage Client Side)
// ==========================================
function initAdminPortal() {
    const staffLink = document.getElementById('staff-portal-link');
    const adminModal = document.getElementById('admin-modal');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const searchInput = document.getElementById('admin-search-input');
    const exportBtn = document.getElementById('admin-export-btn');
    const clearBtn = document.getElementById('admin-clear-btn');
    const bookingsList = document.getElementById('admin-bookings-list');

    const totalBookingsEl = document.getElementById('admin-total-bookings');
    const vesuCountEl = document.getElementById('admin-dr-mercer-count');
    const kadodaraCountEl = document.getElementById('admin-dr-vance-count');

    if (!staffLink || !adminModal) return;

    let loadedBookings = [];
    const STAFF_PIN = "2005"; // Clinic staff passcode PIN

    staffLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const pin = prompt("Enter Clinic Staff Passcode (PIN):");
        if (!pin) return;
        
        if (pin === STAFF_PIN) {
            loadLocalBookings();
            adminModal.classList.add('active');
        } else {
            alert("Access Denied: Incorrect staff PIN passcode.");
        }
    });

    closeAdminBtn.addEventListener('click', () => adminModal.classList.remove('active'));

    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.classList.remove('active');
        }
    });

    searchInput.addEventListener('input', () => renderBookingsTable());

    clearBtn.addEventListener('click', () => {
        if (loadedBookings.length === 0) {
            alert("No records to clear.");
            return;
        }
        if (confirm("Are you sure you want to clear all appointment records? This action cannot be undone.")) {
            localStorage.removeItem('dentricks_bookings');
            loadedBookings = [];
            renderBookingsTable();
            alert("All records successfully cleared.");
        }
    });

    exportBtn.addEventListener('click', () => {
        if (loadedBookings.length === 0) {
            alert("No bookings found to export.");
            return;
        }

        const escapeCsv = (str) => `"${(str || '').replace(/"/g, '""')}"`;
        let csvContent = "Appointment ID,Date,Time Slot,Patient Name,Email,Phone,Location,Reason for Visit,Special Notes,Booked At\n";

        loadedBookings.forEach(bk => {
            const branchName = bk.branch === 'vesu' ? 'Vesu Branch' : 'Kadodara Branch';
            const formattedDate = new Date(bk.date).toLocaleDateString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            });

            const row = [
                escapeCsv(bk.id),
                escapeCsv(formattedDate),
                escapeCsv(bk.timeSlot),
                escapeCsv(bk.patientName),
                escapeCsv(bk.patientEmail),
                escapeCsv(bk.patientPhone),
                escapeCsv(branchName),
                escapeCsv(bk.treatment),
                escapeCsv(bk.notes),
                escapeCsv(new Date(bk.timestamp).toLocaleString())
            ];
            csvContent += row.join(",") + "\n";
        });

        // Trigger CSV download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `dentricks_appointments_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    function loadLocalBookings() {
        loadedBookings = JSON.parse(localStorage.getItem('dentricks_bookings')) || [];
        renderBookingsTable();
    }

    function renderBookingsTable() {
        const query = searchInput.value.toLowerCase().trim();

        // Filter list
        const filteredBookings = loadedBookings.filter(bk => {
            return (
                bk.patientName.toLowerCase().includes(query) ||
                bk.patientEmail.toLowerCase().includes(query) ||
                bk.patientPhone.toLowerCase().includes(query) ||
                bk.id.toLowerCase().includes(query)
            );
        });

        // Sort by date-time descending (newest first)
        filteredBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Update stats summary counter cards
        totalBookingsEl.textContent = loadedBookings.length;
        vesuCountEl.textContent = loadedBookings.filter(b => b.branch === 'vesu').length;
        kadodaraCountEl.textContent = loadedBookings.filter(b => b.branch === 'kadodara').length;

        bookingsList.innerHTML = '';

        if (filteredBookings.length === 0) {
            bookingsList.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 40px; text-align: center; color: var(--text-muted);">
                        <i class="fa-solid fa-folder-open" style="font-size: 2rem; display: block; margin-bottom: 12px; opacity: 0.5;"></i>
                        No matching appointments found.
                    </td>
                </tr>
            `;
            return;
        }

        filteredBookings.forEach(bk => {
            const tr = document.createElement('tr');
            
            const branchClass = bk.branch === 'vesu' ? 'mercer' : 'vance'; // reuse existing css classes
            const branchName = bk.branch === 'vesu' ? 'Vesu Branch' : 'Kadodara Branch';

            const apptDate = new Date(bk.date);
            const formattedDate = apptDate.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            });

            const treatmentNames = {
                'laser': 'Laser Consultation',
                'implants': 'Dental Implants',
                'ortho': 'Invisalign & Ortho',
                'rct': 'Root Canal (RCT)',
                'cosmetic': 'Teeth Whitening',
                'surgery': 'Tooth Extraction',
                'general-checkup': 'Routine Checkup'
            };
            const treatmentDisplay = treatmentNames[bk.treatment] || bk.treatment;

            tr.innerHTML = `
                <td style="padding: 12px 16px;">
                    <h5 style="margin: 0; font-size: 0.95rem;">${formattedDate}</h5>
                    <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> ${bk.timeSlot}</p>
                </td>
                <td style="padding: 12px 16px;">
                    <strong style="font-size: 0.95rem;">${bk.patientName}</strong>
                    <p style="margin: 4px 0 0 0; font-size: 0.75rem; color: var(--text-muted)">ID: ${bk.id}</p>
                </td>
                <td style="padding: 12px 16px; font-size: 0.85rem;">
                    <p style="margin: 0;"><i class="fa-regular fa-envelope"></i> ${bk.patientEmail}</p>
                    <p style="margin: 4px 0 0 0;"><i class="fa-solid fa-phone-flip" style="font-size: 0.75rem"></i> ${bk.patientPhone}</p>
                </td>
                <td style="padding: 12px 16px;">
                    <span class="admin-badge ${branchClass}">${branchName}</span>
                </td>
                <td style="padding: 12px 16px;">
                    <span class="admin-badge treatment">${treatmentDisplay}</span>
                </td>
                <td style="padding: 12px 16px; font-size: 0.85rem;">
                    <p style="max-width: 250px; white-space: normal; word-break: break-word; margin: 0;">${bk.notes || '<span class="text-muted" style="color: var(--text-muted)">No notes</span>'}</p>
                </td>
            `;

            bookingsList.appendChild(tr);
        });
    }
}
