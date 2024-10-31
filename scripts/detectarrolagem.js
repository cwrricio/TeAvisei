let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop === 0) {
    // No topo da página, diminua a altura do cabeçalho
    header.classList.remove("expanded");
  } else if (scrollTop < lastScrollTop) {
    // Rolando para cima, exibe e aumenta a altura do cabeçalho
    header.style.top = "0";
    header.classList.add("expanded");
  } else {
    // Rolando para baixo, esconde o cabeçalho
    header.style.top = "-80px"; /* Ajuste conforme necessário */
  }

  lastScrollTop = scrollTop;
});


document.querySelector("a[href='#como-funciona']").addEventListener("click", (event) => {
    event.preventDefault(); // Impede o comportamento padrão do link
    const target = document.querySelector("#como-funciona");
    const offsetTop = target.offsetTop - 50; // Ajuste de 50px para baixo
  
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth"
    });
  });


  
  document.querySelector('a[href="#fale-conosco"]').addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.querySelector("#fale-conosco");
    const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 80; // Ajuste de 80px
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth"
    });
});