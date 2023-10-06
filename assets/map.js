const lenis = new Lenis({
    wrapper: screenMap,
    content: screenMap.querySelector('.map'),
    smoothTouch: true,

})

lenis.on('scroll', (e) => {
//   console.log(e)
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

document.addEventListener('map', (e) => {
    setTimeout(() => {
        const mapBottom = screenMap.scrollHeight - window.innerHeight;
        const level1 = document.getElementById('level-1');
        const level1Top = level1.getBoundingClientRect().top;
        const coordY = Math.min(level1Top, mapBottom);
        lenis.scrollTo(coordY, {
            offset: 100
        })
    }, 1000);
});
