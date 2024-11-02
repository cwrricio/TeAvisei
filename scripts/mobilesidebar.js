// Detecta se é um dispositivo móvel
const isMobile = () => window.innerWidth <= 768;

// Elementos do DOM
const header = document.querySelector("header");
const hamburgerMenu = document.createElement("div");
hamburgerMenu.className = "hamburger-menu";
hamburgerMenu.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
`;

// Criar sidebar
const sidebar = document.createElement("div");
sidebar.className = "mobile-sidebar";
sidebar.innerHTML = `
    <div class="sidebar-links">
        <a href="index.html">Home</a>
        <a href="#como-funciona">Sobre</a>
        <a href="#fale-conosco">Contato</a>
        <a href="pages/form.html" class="sign-up">Quero criar meu site</a>
    </div>
`;

// Criar overlay
const overlay = document.createElement("div");
overlay.className = "overlay";

// Adicionar elementos ao DOM
document.body.appendChild(hamburgerMenu);
document.body.appendChild(sidebar);
document.body.appendChild(overlay);

// Função para alternar sidebar
const toggleSidebar = () => {
    sidebar.classList.toggle("active");
    overlay.style.display = sidebar.classList.contains("active") ? "block" : "none";
};

// Event listeners
hamburgerMenu.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);

// Scroll behavior
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
    if (isMobile()) return; // Desativa o comportamento de scroll em dispositivos móveis
    
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop === 0) {
        header.classList.remove("expanded");
    } else if (scrollTop < lastScrollTop) {
        header.style.top = "0";
        header.classList.add("expanded");
    } else {
        header.style.top = "-80px";
    }

    lastScrollTop = scrollTop;
});

// Smooth scroll para links da sidebar
sidebar.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        const offsetTop = target.offsetTop - 80;

        window.scrollTo({
            top: offsetTop,
            behavior: "smooth"
        });

        toggleSidebar(); // Fecha a sidebar após clicar
    });
});

// Ajuste para redimensionamento da janela
window.addEventListener("resize", () => {
    if (!isMobile()) {
        sidebar.classList.remove("active");
        overlay.style.display = "none";
    }
});