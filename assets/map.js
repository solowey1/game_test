const sb = new ScrollBooster({
    viewport: screenMap,
    content: screenMap.querySelector('.map'),
    scrollMode: 'transform',
    direction: 'vertical',
    bounce: false,
    friction: 0.3,
    emulateScroll: true,
    lockScrollOnDragDirection: 'vertical',
    dragDirectionTolerance: 20,
    
});

document.addEventListener('map', (e) => {
    setTimeout(() => {
        const mapBottom = screenMap.scrollHeight - window.innerHeight;
        const level1 = document.getElementById('level-1');
        const level1Top = level1.getBoundingClientRect().top;
        const coordY = Math.min(level1Top - 100, mapBottom);
        sb.scrollTo({ x: 0, y: coordY });
    }, 1000);
});
