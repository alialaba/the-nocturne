const story = document.querySelector(".story");

if (story) {
    const updateStoryReveal = () => {
        const rect = story.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // How far the section has entered the viewport
        const progress =
            (viewportHeight - rect.top) /
            (viewportHeight + rect.height);

        const clampedProgress = Math.max(0, Math.min(1, progress));

        story.style.setProperty(
            "--story-progress",
            clampedProgress
        );

        // Stage 1 — visual
        if (clampedProgress > 0.12) {
            story.classList.add("story--visual-visible");
        }

        // Stage 2 — title
        if (clampedProgress > 0.28) {
            story.classList.add("story--title-visible");
        }

        // Stage 3 — description
        if (clampedProgress > 0.42) {
            story.classList.add("story--description-visible");
        }
    };

    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateStoryReveal();
                ticking = false;
            });

            ticking = true;
        }
    };

    window.addEventListener("scroll", handleScroll, {
        passive: true,
    });

    updateStoryReveal();
}


/* =========================================================
   PHILOSOPHY CARD REVEAL
   ========================================================= */

const philosophy = document.querySelector(".philosophy");

if (philosophy) {
    const philosophyObserver = new IntersectionObserver(
        ([entry], observer) =>{
            if(!entry.isIntersecting) return ;
            const cards = document.querySelectorAll(".philosophy-card");
            cards.forEach((card, index)=>{
               setTimeout(()=>{
                    card.classList.add("is-visible");
               }, index * 450)
            });
             observer.unobserve(entry.target);
        }, {
            threshold: 0.35
        }
    );

    philosophyObserver.observe(philosophy);
}
if (window.matchMedia("(max-width: 1024px)").matches) {
    const cards = document.querySelectorAll(
        ".philosophy-card"
    );

    const cardObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.6,
        }
    );

    cards.forEach((card) => {
        cardObserver.observe(card);
    });
}




/* =========================================================
   ROOM SCROLL REVEAL
   ========================================================= */

const room = document.querySelector(".room");

if (room) {
    const roomObserver = new IntersectionObserver(
        ([entry], observer) => {
            if (!entry.isIntersecting) return;

            room.classList.add("room--list-visible");

            setTimeout(() => {
                room.classList.add("room--title-visible");
            }, 180);

            setTimeout(() => {
                room.classList.add("room--description-visible");
            }, 420);

            setTimeout(() => {
                room.classList.add("room--button-visible");
            }, 600);

            observer.unobserve(entry.target);
        },
        {
            threshold: 0.3,
        }
    );

    roomObserver.observe(room);
}

const dish = document.querySelector(".dish");

if(dish) {
    const dishObserver = new IntersectionObserver(
        ([entry], observer)=>{
           if(!entry.isIntersecting) return;
             if (!entry.isIntersecting) return;

            dish.classList.add("dish--title-visible");

            setTimeout(() => {
                dish.classList.add("dish--intro-visible");
            }, 180);

            setTimeout(() => {
                dish.classList.add("dish--cards-visible");
            }, 350);

            observer.unobserve(entry.target);
        },
         {
            threshold: 0.3,
        }
    );
     dishObserver.observe(dish);
}


const bookTable = document.querySelector(".book-table");

if (bookTable) {
    const bookTableObserver = new IntersectionObserver(
        ([entry], observer) => {
            if (!entry.isIntersecting) return;

            bookTable.classList.add("book-table--title-visible");

            setTimeout(() => {
                bookTable.classList.add("book-table--description-visible");
            }, 150);

            setTimeout(() => {
                bookTable.classList.add("book-table--form-visible");
            }, 300);

            observer.unobserve(entry.target);
        },
        {
            threshold: 0.25,
        }
    );

    bookTableObserver.observe(bookTable);
}