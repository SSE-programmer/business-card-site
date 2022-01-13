function responsiveNavbar() {
  let links = document.getElementById('nav-links');

  if (links.classList.contains('show')) {
    links.classList.remove('show');
    links.style.top = '-300px';
    links.style.opacity = '0';
  } else {
    links.classList.add('show');
    links.style.top = '0';
    links.style.opacity = '1';
  }
}

window.addEventListener("resize", function() {
  let links = document.getElementById('nav-links');

  if (window.matchMedia("(min-width: 800px)").matches) {
    links.classList.remove('show');
    links.style.top = '0';
    links.style.opacity = '1';
  } else {
    if (!links.classList.contains('show')) {
      links.classList.add('no-transition');
      links.style.top = '-300px';
      links.style.opacity = '0';
      links.offsetHeight;
      links.classList.remove('no-transition');
    }
  }
});
