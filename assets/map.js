// const scrollboosterOptions = {
//     viewport: screenMap,
//     content: screenMap.querySelector('.map'),
//     scrollMode: 'transform',
//     direction: 'vertical',
//     bounce: false,
//     friction: 0.3,
//     emulateScroll: true,
//     lockScrollOnDragDirection: 'vertical',
//     dragDirectionTolerance: 40
// }
// const sb = new ScrollBooster(scrollboosterOptions);

const lenis = new Lenis({
    wrapper: screenMap,
    content: screenMap.querySelector('.map'),
    // eventsTarget: screenMap.querySelector('.map-level-number'),
});
lenis.on('scroll', (e) => {
    // console.log(e);
})
const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.addEventListener('map', (e) => {
    screenStart.classList.add('hide');
    screenSignup.classList.add('hide');
    screenMap.classList.remove('hide');
    const mapBottom = screenMap.scrollHeight - window.innerHeight;
    const levels = document.querySelectorAll('.map-level-number');
    const levelsComplete = Array.from(levels).filter(level => level.classList.contains('complete'));
    const lastLevelComplete = levelsComplete.length ? levelsComplete[levelsComplete.length - 1] : levels[0];
    const lastLevelCompleteTop = Math.ceil(lastLevelComplete.getBoundingClientRect().top);
    const coordY = Math.min(lastLevelCompleteTop - window.innerHeight, mapBottom);
    setTimeout(() => {
        // sb.scrollTo({ x: 0, y: coordY });
        lenis.scrollTo(coordY, {
            duration: 2,
            easing: (x) => {
                return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
            },
            lock: true
        });
    }, 1000);
});
