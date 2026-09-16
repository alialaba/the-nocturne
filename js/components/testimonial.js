// EXPERIENCE

const testimonials = [
    {
        image: "./assets/louis-hansel-7qeQXRppR9o-unsplash.jpg",

        lines: [
            "From the moment we arrived,",
            "every detail felt intentional",
            "and refined. The flavors were",
            "beautifully balanced, the service",
            "was attentive without being intrusive,",
            "and the atmosphere created",
            "a sense of calm luxury."
        ],

        customer: "— Daniel R., Creative Producer, Chicago"
    },

    {
        image: "./assets/phil-hearing-Ee5FZp9MJlI-unsplash.jpg",

        lines: [
            "An unforgettable evening from",
            "beginning to end. Every course felt",
            "carefully considered, the service was",
            "effortless, and the atmosphere made",
            "the entire experience feel extraordinary."
        ],

        customer: "— Sophia M., Art Director, New York"
    },

    {
        image: "./assets/louis-hansel-7qeQXRppR9o-unsplash.jpg",

        lines: [
            "The kind of restaurant where",
            "every detail tells a story.",
            "Beautiful food, thoughtful service,",
            "and an atmosphere that makes",
            "you want to stay a little longer."
        ],

        customer: "— Marcus T., Photographer, London"
    }
];


const experience = document.querySelector(".experience");
const experienceNote = document.querySelector(".experience__note");
const experienceCustomer = document.querySelector(".experience__customer");
const experienceImage = document.querySelector(".experience__img");

const previousButton = document.querySelector(".experience__navigator-left");
const nextButton = document.querySelector(".experience__navigator-right");
const testimonialPrefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

function shouldReduceMotion() {
    return testimonialPrefersReducedMotion.matches;
}

// STATE

let currentTestimonial = 0;
let isAnimating = false;


// RENDER TESTIMONIAL LINES

const renderTestimonialLines = (lines) => {
    experienceNote.innerHTML = "";

    const fragment = document.createDocumentFragment();

    lines.forEach((line) => {
        const wrapper = document.createElement("span");
        const inner = document.createElement("span");

        wrapper.className = "experience__line";
        inner.className = "experience__line-inner";

        inner.textContent = line;

        wrapper.appendChild(inner);
        fragment.appendChild(wrapper);
    });

    experienceNote.appendChild(fragment);

    return [
        ...experienceNote.querySelectorAll(
            ".experience__line-inner"
        )
    ];
};


function renderTestimonialImmediately(testimonial) {
    const lines =
        renderTestimonialLines(testimonial.lines);

    experienceCustomer.textContent =
        testimonial.customer;

    experienceImage.src =
        testimonial.image;

    lines.forEach((line) => {
        line.style.transform = "translateY(0)";
        line.style.opacity = "1";
    });

    experienceCustomer.style.transform =
        "translateY(0)";

    experienceCustomer.style.opacity = "1";
}

// INITIAL TESTIMONIAL

const initialTestimonial =
    testimonials[currentTestimonial];

// renderTestimonialLines(initialTestimonial.lines);

const initialLines =
    renderTestimonialLines(
        initialTestimonial.lines
    );

initialLines.forEach((line) => {
    line.style.transform = "translateY(0)";
    line.style.opacity = "1";
});

experienceCustomer.textContent =
    initialTestimonial.customer;

experienceImage.src =
    initialTestimonial.image;


// OUTGOING ANIMATION

// ========================================
// TESTIMONIAL — OUTGOING ANIMATION
// ========================================

async function animateTestimonialOut(lines) {

    const lineDuration = 280;
    const lineStagger = 90;
    const customerDuration = 300;

    // ----------------------------------------
    // Customer leaves downward
    // ----------------------------------------

    const customerAnimation =
        experienceCustomer.animate(
            [
                {
                    transform: "translateY(0)",
                    opacity: 1
                },
                {
                    transform: "translateY(100%)",
                    opacity: 0
                }
            ],
            {
                duration: customerDuration,
                easing: "cubic-bezier(0.65, 0, 0.35, 1)",
                fill: "forwards"
            }
        );


    // ----------------------------------------
    // Lines leave bottom → top
    // ----------------------------------------

    const linesAnimation = [];

    for (
        let index = lines.length - 1;
        index >= 0;
        index--
    ) {

        const positionFromBottom =
            lines.length - 1 - index;

        const delay =
            Math.max(
                0,
                customerDuration - 120 +
                positionFromBottom * lineStagger
            );

        const animation =
            lines[index].animate(
                [
                    {
                        transform: "translateY(0)",
                        opacity: 1
                    },
                    {
                        transform: "translateY(100%)",
                        opacity: 0
                    }
                ],
                {
                    duration: lineDuration,
                    delay,
                    easing: "cubic-bezier(0.65, 0, 0.35, 1)",
                    fill: "forwards"
                }
            );

        linesAnimation.push(animation);
    }


    // ----------------------------------------
    // Wait until everything finishes
    // ----------------------------------------

    await Promise.all([
        customerAnimation.finished,

        ...linesAnimation.map(
            (animation) => animation.finished
        )
    ]);
}


// ========================================
// TESTIMONIAL — INCOMING ANIMATION
// ========================================

async function animateTestimonialIn(lines) {

    const lineDuration = 220;
    const lineStagger = 70;
    const customerDuration = 300;

    // ----------------------------------------
    // Start every line hidden
    // ----------------------------------------

    lines.forEach((line) => {

        line.style.transform =
            "translateY(100%)";

        line.style.opacity = "0";
    });


    // ----------------------------------------
    // Lines enter with a stagger
    // ----------------------------------------

    const lineAnimations =
        lines.map((line, index) => {

            return line.animate(
                [
                    {
                        transform: "translateY(100%)",
                        opacity: 0
                    },
                    {
                        transform: "translateY(0)",
                        opacity: 1
                    }
                ],
                {
                    duration: lineDuration,
                    delay: index * lineStagger,
                    easing: "cubic-bezier(0.76, 0, 0.24, 1)",
                    fill: "forwards"
                }
            );

        });


    // ----------------------------------------
    // Wait for all lines to finish
    // ----------------------------------------

    await Promise.all(
        lineAnimations.map(
            (animation) => animation.finished
        )
    );


    // ----------------------------------------
    // Customer enters after lines
    // ----------------------------------------

    await experienceCustomer.animate(
        [
            {
                transform: "translateY(100%)",
                opacity: 0
            },
            {
                transform: "translateY(0)",
                opacity: 1
            }
        ],
        {
            duration: customerDuration,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards"
        }
    ).finished;
}

// ========================================
// TESTIMONIAL — IMAGE ANIMATION
// ========================================

async function animateTestimonialImage(nextImage) {

    if (
        shouldReduceMotion() ||
        window.matchMedia("(max-width: 767px)").matches
    ) {
        experienceImage.src = nextImage;
        return;
    }


    // ----------------------------------------
    // Preload the next image
    // ----------------------------------------

    const image = new Image();

    image.src = nextImage;

    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });


    // ----------------------------------------
    // Fade current image out
    // ----------------------------------------

    await experienceImage.animate(
        [
            {
                opacity: 1,
                transform: "scale(1)"
            },
            {
                opacity: 0,
                transform: "scale(1.015)"
            }
        ],
        {
            duration: 350,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards"
        }
    ).finished;


    // ----------------------------------------
    // Swap image
    // ----------------------------------------

    experienceImage.src = nextImage;


    // ----------------------------------------
    // Fade new image in
    // ----------------------------------------

    await experienceImage.animate(
        [
            {
                opacity: 0,
                transform: "scale(1.015)"
            },
            {
                opacity: 1,
                transform: "scale(1)"
            }
        ],
        {
            duration: 450,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards"
        }
    ).finished;
}




// ========================================
// TESTIMONIAL — PREVIOUS OUTGOING
// ========================================

async function animateTestimonialOutPrevious(lines) {

    const lineDuration = 280;
    const lineStagger = 90;
    const customerDuration = 300;

    // ----------------------------------------
    // Customer leaves upward
    // ----------------------------------------

    const customerAnimation =
        experienceCustomer.animate(
            [
                {
                    transform: "translateY(0)",
                    opacity: 1
                },
                {
                    transform: "translateY(-100%)",
                    opacity: 0
                }
            ],
            {
                duration: customerDuration,
                easing: "cubic-bezier(0.65, 0, 0.35, 1)",
                fill: "forwards"
            }
        );


    // ----------------------------------------
    // Lines leave top → bottom
    // ----------------------------------------

    const linesAnimation = [];

    for (
        let index = 0;
        index < lines.length;
        index++
    ) {

        const positionFromTop = index;

        const delay =
            Math.max(
                0,
                customerDuration - 120 +
                positionFromTop * lineStagger
            );

        const animation =
            lines[index].animate(
                [
                    {
                        transform: "translateY(0)",
                        opacity: 1
                    },
                    {
                        transform: "translateY(-100%)",
                        opacity: 0
                    }
                ],
                {
                    duration: lineDuration,
                    delay,
                    easing: "cubic-bezier(0.65, 0, 0.35, 1)",
                    fill: "forwards"
                }
            );

        linesAnimation.push(animation);
    }


    // ----------------------------------------
    // Wait until everything finishes
    // ----------------------------------------

    await Promise.all([
        customerAnimation.finished,

        ...linesAnimation.map(
            (animation) => animation.finished
        )
    ]);
}


// ========================================
// TESTIMONIAL — PREVIOUS INCOMING
// ========================================

async function animateTestimonialInPrevious(lines) {

    const lineDuration = 220;
    const lineStagger = 70;
    const customerDuration = 300;

    // ----------------------------------------
    // Start every line above its position
    // ----------------------------------------

    lines.forEach((line) => {

        line.style.transform =
            "translateY(-100%)";

        line.style.opacity = "0";
    });


    // ----------------------------------------
    // Lines enter with a stagger
    // First line → last line
    // ----------------------------------------

    const lineAnimations =
        lines.map((line, index) => {

            return line.animate(
                [
                    {
                        transform: "translateY(-100%)",
                        opacity: 0
                    },
                    {
                        transform: "translateY(0)",
                        opacity: 1
                    }
                ],
                {
                    duration: lineDuration,
                    delay: index * lineStagger,
                    easing: "cubic-bezier(0.76, 0, 0.24, 1)",
                    fill: "forwards"
                }
            );

        });


    // ----------------------------------------
    // Wait for all lines
    // ----------------------------------------

    await Promise.all(
        lineAnimations.map(
            (animation) => animation.finished
        )
    );


    // ----------------------------------------
    // Customer enters after lines
    // ----------------------------------------

    await experienceCustomer.animate(
        [
            {
                transform: "translateY(-100%)",
                opacity: 0
            },
            {
                transform: "translateY(0)",
                opacity: 1
            }
        ],
        {
            duration: customerDuration,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards"
        }
    ).finished;
}

// NEXT TESTIMONIAL

async function showNextTestimonial() {

    if (isAnimating) return;


      // Reduced motion
    if (shouldReduceMotion()) {

        currentTestimonial =
            (currentTestimonial + 1) %
            testimonials.length;

        renderTestimonialImmediately(
            testimonials[currentTestimonial]
        );

        return;
    }

    isAnimating = true;


    // Get current lines

    const currentLines = [
        ...experienceNote.querySelectorAll(
            ".experience__line-inner"
        )
    ];


    // 1. Animate current testimonial OUT

    await animateTestimonialOut(currentLines);


    // 2. Move to next testimonial

    currentTestimonial =
        (currentTestimonial + 1) %
        testimonials.length;

    const testimonial =
        testimonials[currentTestimonial];


    // 3. Update content

    const newLines =
        renderTestimonialLines(
            testimonial.lines
        );

    experienceCustomer.textContent =
        testimonial.customer;

        // 4. Animate image

    // experienceImage.src =
    //     testimonial.image;
        const imageAnimation = animateTestimonialImage(testimonial.image)

     
    // 5. Animate new testimonial IN

    // await animateTestimonialIn(newLines);
    await Promise.all([imageAnimation, animateTestimonialIn(newLines)])


    isAnimating = false;
}


async function showPreviousTestimonial() {

    if (isAnimating) return;

    isAnimating = true;

    // Reduced motion
    if (shouldReduceMotion()) {

        currentTestimonial =
            (currentTestimonial - 1 +
                testimonials.length) %
            testimonials.length;

        renderTestimonialImmediately(
            testimonials[currentTestimonial]
        );

        return;
    }

    // Get current lines

    const currentLines = [
        ...experienceNote.querySelectorAll(
            ".experience__line-inner"
        )
    ];


    // 1. Animate current testimonial OUT

    await animateTestimonialOutPrevious(
        currentLines
    );


    // 2. Move to previous testimonial

    currentTestimonial =
        (currentTestimonial - 1 + testimonials.length) %
        testimonials.length;

    const testimonial =
        testimonials[currentTestimonial];


    // 3. Update text

    const newLines =
        renderTestimonialLines(
            testimonial.lines
        );

    experienceCustomer.textContent =
        testimonial.customer;


    // 4. Animate image

    const imageAnimation =
        animateTestimonialImage(
            testimonial.image
        );


    // 5. Animate new testimonial IN

    await Promise.all([
        imageAnimation,
        animateTestimonialInPrevious(
            newLines
        )
    ]);


    isAnimating = false;
}

nextButton.addEventListener(
    "click",
    showNextTestimonial
);
previousButton.addEventListener(
    "click",
    showPreviousTestimonial
);