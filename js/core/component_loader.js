async function loadComponent(id, file) {
  const element = document.getElementById(id);

  const response = await fetch(file);

  const html = await response.text();

  element.innerHTML = html;
}

loadComponent("navbar-component", "components/navbar.html");

loadComponent(
  "hero-branding-component",
  "components/hero-branding.html"
);

loadComponent(
  "hero-auth-component",
  "components/hero-auth.html"
);

loadComponent(
  "footer-component",
  "components/footer.html"
);