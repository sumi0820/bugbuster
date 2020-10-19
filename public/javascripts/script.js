document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

const tl = gsap.timeline({ defaults: { ease: "power1.out" } });

tl.to(".text", { y: "0%", duration: 1, stagger: 0.25 });
tl.to(".slider", { y: "-100%", duration: 1.5, delay: 0.5 });
tl.to(".intro", { y: "-100%", duration: 1 }, "-=1");
tl.fromTo(".landing__navbar", { opacity: 0 }, { opacity: 1, duration: 1 });
tl.fromTo(
  ".landing__copy__main",
  { opacity: 0 },
  { opacity: 1, duration: 2 },
  "-=1"
);

new fullpage("#fullpage", {
  //options here
  autoScrolling: true,
  navigation: true,
  verticalCentered: true,
});

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".main__nav__links");
const links = document.querySelector(".main__nav__links li");

hamburger.addEventListener("click", () => {
  console.log("clicked");
  navLinks.classList.toggle("open");

});


