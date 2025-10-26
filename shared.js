// inietta un frammento HTML dentro un div target
function injectFragment(targetId, filePath) {
  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  fetch(filePath)
    .then(res => {
      if (!res.ok) {
        console.error("Errore caricando " + filePath, res.status);
        return "";
      }
      return res.text();
    })
    .then(html => {
      targetEl.innerHTML = html;

      // dopo aver montato l'header o footer, attacca i listener
      if (filePath === "header.html") setupHeaderLogic();
      if (filePath === "footer.html") setupFooterLogic();
    })
    .catch(err => {
      console.error("Fetch fallito per " + filePath, err);
    });
}

// attiva menù mobile, tema, carrello, ecc. DOPO che l'header è stato iniettato
function setupHeaderLogic() {
  // toggle tema
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    // applica subito il tema salvato
    const saved = localStorage.getItem("luma_theme");
    if (saved === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else if (saved === "dark") {
      document.documentElement.removeAttribute("data-theme");
    }

    themeToggle.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      if (isLight) {
        // passa a dark
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("luma_theme", "dark");
      } else {
        // passa a light
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("luma_theme", "light");
      }
    });
  }

  // menù mobile
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const nowOpen = mobileMenu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", nowOpen ? "true" : "false");
    });

    // chiudi menu al click su una voce
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // carrello
  const openCartBtn = document.getElementById("openCart");
  if (openCartBtn && typeof window.openCart === "function") {
    openCartBtn.addEventListener("click", () => {
      window.openCart();
    });
  }
}

// roba del footer (es. anno dinamico, se lo usi nel footer)
function setupFooterLogic() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// quando la pagina è caricata, inietta header e footer
document.addEventListener("DOMContentLoaded", () => {
  injectFragment("site-header", "header.html");
  injectFragment("site-footer", "footer.html");
});