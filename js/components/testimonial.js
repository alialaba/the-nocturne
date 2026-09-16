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

async function animateTestimonialOut(lines) {

    const lineDuration = 400;
    const lineStagger = 180;
    const customerDuration = 450;


    // Customer leaves first

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


    // Lines leave bottom → top

    const linesAnimation = [];

    for (
        let index = lines.length - 1;
        index >= 0;
        index--
    ) {

        const positionFromBottom =
            lines.length - 1 - index;

        const animation =
            lines[index].animate(
                [
                    {
                        transform: "translateY(0)"
                    },
                    {
                        transform: "translateY(100%)"
                    }
                ],
                {
                    duration: lineDuration,

                    delay:
                        customerDuration +
                        positionFromBottom * lineStagger,

                    easing:
                        "cubic-bezier(0.65, 0, 0.35, 1)",

                    fill: "forwards"
                }
            );

        linesAnimation.push(animation);
    }


    // IMPORTANT:
    // Wait until everything finishes

    await Promise.all([
        customerAnimation.finished,

        ...linesAnimation.map(
            (animation) => animation.finished
        )
    ]);
}


// INCOMING ANIMATION

async function animateTestimonialIn(lines) {

    const lineDuration = 250;
    const lineGap = 150;
    const customerDuration = 400;

    // Start every line hidden
    lines.forEach((line) => {
        line.style.transform = "translateY(100%)";
        line.style.opacity = "0";
    });

    // Reveal lines one by one
    for (const line of lines) {

        await line.animate(
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
                easing: "cubic-bezier(0.76, 0, 0.24, 1)",
                fill: "forwards"
            }
        ).finished;

        // Small breathing space before next line
        await new Promise((resolve) => {
            setTimeout(resolve, lineGap);
        });
    }


    // Customer enters after all lines
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

async function animateTestimonialImage(nextImage) {

    if (
        shouldReduceMotion() ||
        window.matchMedia("(max-width: 767px)").matches
    ) {
        experienceImage.src = nextImage;
        return;
    }
    // Preload the next image first
    const image = new Image();

    image.src = nextImage;

    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });


    // Fade current image out

    await experienceImage.animate(
        [
            {
                opacity: 1,
                transform: "scale(1)"
            },
            {
                opacity: 0,
                transform: "scale(1.025)"
            }
        ],
        {
            duration: 500,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards"
        }
    ).finished;


    // New image is already loaded
    experienceImage.src = nextImage;


    // Fade new image in

    await experienceImage.animate(
        [
            {
                opacity: 0,
                transform: "scale(1.025)"
            },
            {
                opacity: 1,
                transform: "scale(1)"
            }
        ],
        {
            duration: 750,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards"
        }
    ).finished;
}




async function animateTestimonialOutPrevious(lines) {

    const lineDuration = 500;
    const lineGap = 350;
    const customerDuration = 550;


    // 1. Customer fades out FIRST

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


    await customerAnimation.finished;


    // 2. Last line → first line

    for (
        let index = lines.length - 1;
        index >= 0;
        index--
    ) {

        await lines[index].animate(
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
                easing: "cubic-bezier(0.65, 0, 0.35, 1)",
                fill: "forwards"
            }
        ).finished;


        await new Promise((resolve) => {
            setTimeout(resolve, lineGap);
        });
    }
}

async function animateTestimonialInPrevious(lines) {

    const lineDuration = 650;
    const lineGap = 180;
    const customerDuration = 600;


    // Start every line above its normal position

    lines.forEach((line) => {
        line.style.transform = "translateY(-100%)";
        line.style.opacity = "0";
    });


    // 1. First line → last line

    for (const line of lines) {

        await line.animate(
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
                easing: "cubic-bezier(0.76, 0, 0.24, 1)",
                fill: "forwards"
            }
        ).finished;


        await new Promise((resolve) => {
            setTimeout(resolve, lineGap);
        });
    }


    // 2. Customer enters LAST

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