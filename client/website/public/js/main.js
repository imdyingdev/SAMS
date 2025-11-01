document.addEventListener('DOMContentLoaded', function() {
    // Navigation arrows functionality
    const leftArrow = document.querySelector('.nav-arrow.left');
    const rightArrow = document.querySelector('.nav-arrow.right');
    
    // Sample hero content for carousel
    const heroContent = [
        {
            title: 'AMPID Elementary School',
            subtitle: 'Nurturing Young Minds, Building Bright Futures',
            cta: 'Discover Our School',
            ctaLink: '#learn-more'
        },
        {
            title: 'Excellence in Education',
            subtitle: 'Fostering Creativity and Academic Growth',
            cta: 'Our Approach',
            ctaLink: '#approach'
        },
        {
            title: 'Student Success',
            subtitle: 'Where Every Child Reaches Their Potential',
            cta: 'Learn More',
            ctaLink: '#programs'
        }
    ];

    // Background images for carousel
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
    
    let currentSlide = 0;
    
    // Function to update hero content and background image
    function updateHeroContent(index) {
        const heroTitle = document.querySelector('.hero-content h1');
        const heroSubtitle = document.querySelector('.hero-content p');
        const heroCta = document.querySelector('.hero-content .cta-button');
        const heroContentElement = document.querySelector('.hero-content');
        const homeSection = document.getElementById('home');

        // Add transition class
        heroContentElement.classList.add('transitioning');

        // Fade out
        heroTitle.style.opacity = 0;
        heroSubtitle.style.opacity = 0;
        heroCta.style.opacity = 0;

        setTimeout(() => {
            // Update background image
            homeSection.style.backgroundImage = `url('../images/${images[index]}')`;

            // Update content
            heroTitle.textContent = heroContent[index].title;
            heroSubtitle.textContent = heroContent[index].subtitle;
            heroCta.textContent = heroContent[index].cta;
            heroCta.setAttribute('href', heroContent[index].ctaLink);

            // Fade in
            heroTitle.style.opacity = 1;
            heroSubtitle.style.opacity = 1;
            heroCta.style.opacity = 1;

            // Remove transition class
            setTimeout(() => {
                heroContentElement.classList.remove('transitioning');
            }, 300);
        }, 300);
    }
    
    // Event listeners for navigation arrows
    if (leftArrow && rightArrow) {
        leftArrow.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + heroContent.length) % heroContent.length;
            updateHeroContent(currentSlide);
        });
        
        rightArrow.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % heroContent.length;
            updateHeroContent(currentSlide);
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
