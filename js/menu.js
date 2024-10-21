const abrirMenu = document.querySelector("#open-menu");
const cerrarMenu = document.querySelector("#close-menu");
const aside = document.querySelector("aside");

abrirMenu.addEventListener("click", () => {
    aside.classList.add("aside-visible");
})

cerrarMenu.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
})