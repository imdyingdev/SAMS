document.addEventListener('DOMContentLoaded', function() {
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }

    // Function to add animation class when element is in viewport
    function handleScrollAnimation() {
        const announcements = document.querySelectorAll('.announcement');
        const updateTitle = document.querySelector('#update h2');
        const approachItems = document.querySelectorAll('.approach-item');
        
        // Animate title if in viewport
        if (updateTitle && isInViewport(updateTitle)) {
            updateTitle.classList.add('animate');
        }
        
        // Animate each approach item if in viewport
        approachItems.forEach((item, index) => {
            if (isInViewport(item) && !item.classList.contains('animate')) {
                // Add delay based on index for cascade effect
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 100);
            }
        });
        
        // Animate each announcement if in viewport
        announcements.forEach((announcement, index) => {
            if (isInViewport(announcement)) {
                // Add delay based on index for cascade effect
                setTimeout(() => {
                    announcement.classList.add('animate');
                }, index * 150);
            }
        });
    }

    // Run once on page load
    handleScrollAnimation();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimation);
});
