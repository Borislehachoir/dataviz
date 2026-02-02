document.addEventListener('DOMContentLoaded', () => {
    const introScene = document.getElementById('intro-scene');
    const gun1 = document.getElementById('gun1');
    const gun2 = document.getElementById('gun2');
    const bullet1 = document.getElementById('bullet1');
    const bullet2 = document.getElementById('bullet2');

    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');

    const animationDuration = 5000; 
    const shotTrigger = 100;
    const bulletTravel = 600; 


    const ANIMATION_PLAYED_KEY = 'introAnimationPlayed';
    let isAnimationPlayed = sessionStorage.getItem(ANIMATION_PLAYED_KEY) === 'true'; 


     if (isAnimationPlayed) {
         introScene.style.display = 'none';
        header.style.opacity = '1';
         main.style.opacity = '1';
         footer.style.opacity = '1';

        const menuNav = document.getElementById('menu');
         const menuSeparator = document.getElementById('separator');
         if (window.innerWidth > 768) {
             menuNav.classList.remove('hidden');
             menuSeparator.classList.remove('hidden'); 
         }
         introScene.style.zIndex = '1';

        return;
}


    window.addEventListener('scroll', () => {

         if (isAnimationPlayed) {
             return;
        }

        const scrollPos = window.scrollY;


         const progress = Math.min(scrollPos / animationDuration, 1);


        if (progress <= 1) {
           const gunOpacity = 1 - progress;
           gun1.style.opacity = gunOpacity;
           gun2.style.opacity = gunOpacity;
           const translateY = -scrollPos * 0.5; 
           introScene.style.transform = `translateY(${translateY}px)`;
           header.style.opacity = progress;
           main.style.opacity = progress;
           footer.style.opacity = progress;

         if (progress === 1) {
            sessionStorage.setItem(ANIMATION_PLAYED_KEY, 'true');
            isAnimationPlayed = true; 

            introScene.style.display = 'none'; 
            introScene.style.zIndex = '1'; 
            introScene.style.position = 'relative';
            introScene.style.transform = 'none';
            header.style.opacity = '1'; 
            main.style.opacity = '1';
            footer.style.opacity = '1';
            const menuNav = document.getElementById('menu');
            const menuSeparator = document.getElementById('separator');

            if (window.innerWidth > 768) {
                  menuNav.classList.remove('hidden');
                   menuSeparator.classList.remove('hidden'); 
            } } 
            else {
                introScene.style.display = 'block';
                introScene.style.zIndex = '1000'; }
  }

      if (scrollPos >= shotTrigger && progress < 1) { 
          const shotProgress = Math.min((scrollPos - shotTrigger) / (animationDuration - shotTrigger), 1);

         if (shotProgress > 0) {
            const bullet1X = shotProgress * bulletTravel;
            bullet1.style.opacity = 1;
            bullet1.style.transform = `translateX(${bullet1X}px)`;
            const bullet2X = shotProgress * -bulletTravel;
            bullet2.style.opacity = 1; 
            bullet2.style.transform = `translateX(${bullet2X}px)`;
        } 
        else {
            bullet1.style.opacity = 0;
            bullet2.style.opacity = 0;
            bullet1.style.transform = 'none';
            bullet2.style.transform = 'none';
        }
  }
});


    if (window.scrollY > 0 && !isAnimationPlayed) {
        window.scrollTo(0, 0);
  }
});
