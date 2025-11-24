document.addEventListener('DOMContentLoaded', function() {
    // Navigation arrows functionality
    const leftArrow = document.querySelector('.nav-arrow.left');
    const rightArrow = document.querySelector('.nav-arrow.right');
    const slideshowContainer = document.querySelector('.slideshow-container');
    const slides = document.querySelectorAll('.slide');
    
    // Clone slides for infinite loop
    const firstSlide = slides[0].cloneNode(true);
    const lastSlide = slides[slides.length - 1].cloneNode(true);
    firstSlide.classList.add('clone', 'clone-first');
    lastSlide.classList.add('clone', 'clone-last');
    
    slideshowContainer.insertBefore(lastSlide, slides[0]);
    slideshowContainer.appendChild(firstSlide);
    
    // Start at the first real slide (index 1 after adding clone at start)
    let currentSlide = 1;
    const totalSlides = slides.length + 2; // original + 2 clones
    
    // Update slide position
    function updateSlide(index, instant = false) {
        if (instant) {
            slideshowContainer.style.transition = 'none';
        } else {
            slideshowContainer.style.transition = 'transform 0.6s ease-in-out';
        }
        
        currentSlide = index;
        const translateX = -currentSlide * 100;
        slideshowContainer.style.transform = `translateX(${translateX}%)`;
        
        // Handle infinite loop - jump to real slide after transition
        if (!instant) {
            setTimeout(() => {
                if (currentSlide === 0) {
                    // Jump to last real slide
                    updateSlide(slides.length, true);
                } else if (currentSlide === totalSlides - 1) {
                    // Jump to first real slide
                    updateSlide(1, true);
                }
            }, 600); // Wait for transition to complete
        }
    }
    
    // Initialize at first real slide
    updateSlide(1, true);
    
    // Event listeners for navigation arrows
    if (leftArrow && rightArrow) {
        leftArrow.addEventListener('click', function() {
            const newIndex = currentSlide - 1;
            updateSlide(newIndex);
        });
        
        rightArrow.addEventListener('click', function() {
            const newIndex = currentSlide + 1;
            updateSlide(newIndex);
        });
    }
    
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') { // Ignore empty anchors
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Get header height for proper offset
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight - 20, // Additional 20px padding
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
});
