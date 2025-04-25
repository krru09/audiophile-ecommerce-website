const observerOptions = {
  root: null,
  threshold: 0
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    const el = entry.target;
    const animationClass = getResponsiveAnimation(el);

    if (entry.isIntersecting) {
      console.log("Animation class:", animationClass);
      if (animationClass) {
        el.classList.add('animate', animationClass);
      }
    } else {
      if (animationClass) {
        el.classList.remove("animation", animationClass);
      }
    }
  });
}, observerOptions);

const getResponsiveAnimation = (element) => {
  let animationClass;
  if (window.innerWidth <= 767) {
    animationClass = element.dataset.animationMobile || element.dataset.animation;
    console.log(animationClass);
  } else if (window.innerWidth <= 1024) {
    animationClass = element.dataset.animationTablet || element.dataset.animation;
    console.log(animationClass);
  } else {
    animationClass = element.dataset.animationDesktop || element.dataset.animationTablet || element.dataset.animation;
    console.log(animationClass);
  }

  return animationClass;
}

// observe all elements with data-animation attribute
setTimeout(() => {
  const animatedElements = document.querySelectorAll('[data-animation], [data-animation-mobile],[data-animation-tablet], [data-animation-desktop]');

  animatedElements.forEach(element => 
    {console.log("observing:", element);
    observer.observe(element)});
}, 100);