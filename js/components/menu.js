"use strict"

const menuToggle =
    document.querySelector(
        ".site-header__menu-button"
    );

// const menuLabel =
//     document.querySelector(
//         ".site-header__menu-label"
//     );

const siteMenu =
    document.querySelector(
        ".site-menu"
    );
const body =
    document.body;

function openMenu() {

    siteMenu.classList.add("is-open");

    body.classList.add("menu-open");

    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    siteMenu.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeMenu() {
    siteMenu.classList.add("is-closing");
    siteMenu.classList.remove("is-open");

    body.classList.remove("menu-open");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    siteMenu.setAttribute(
        "aria-hidden",
        "true"
    );

    window.setTimeout(() => {
        siteMenu.classList.remove("is-closing");
    }, 1000); // matches your existing 900ms clip-path close
}


menuToggle.addEventListener(
    "click",
    () => {

        const isOpen =
            menuToggle.getAttribute(
                "aria-expanded"
            ) === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    }
);