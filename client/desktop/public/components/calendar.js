// Calendar Component JavaScript
function initCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const newDate = new Date();
    newDate.setDate(newDate.getDate());
    
    function updateCalendar() {
        const hours = new Date().getHours();
        const seconds = new Date().getSeconds();
        const minutes = new Date().getMinutes();
        
        // Update clock elements
        const hourElement = document.querySelector('.calendar-component .hour span');
        const secondElement = document.querySelector('.calendar-component .second span');
        const minuteElement = document.querySelector('.calendar-component .minute span');
        
        if (hourElement) hourElement.textContent = (hours < 10 ? "0" : "") + hours;
        if (secondElement) secondElement.textContent = (seconds < 10 ? "0" : "") + seconds;
        if (minuteElement) minuteElement.textContent = (minutes < 10 ? "0" : "") + minutes;
        
        // Update calendar elements
        const monthElements = document.querySelectorAll('.calendar-component .month span, .calendar-component .month2 span');
        const dateElements = document.querySelectorAll('.calendar-component .date span, .calendar-component .date2 span');
        const dayElements = document.querySelectorAll('.calendar-component .day span, .calendar-component .day2 span');
        const yearElement = document.querySelector('.calendar-component .year span');
        
        monthElements.forEach(el => el.textContent = monthNames[newDate.getMonth()]);
        dateElements.forEach(el => el.textContent = newDate.getDate());
        dayElements.forEach(el => el.textContent = dayNames[newDate.getDay()]);
        if (yearElement) yearElement.textContent = newDate.getFullYear();
    }
    
    // Update calendar immediately and then every second
    updateCalendar();
    const intervalId = setInterval(updateCalendar, 1000);
    
    // Add mouse event handlers for the interactive effect
    const outerElement = document.querySelector('.calendar-component .outer');
    if (outerElement) {
        outerElement.addEventListener('mousedown', function() {
            // Add any mousedown effects if needed
        });
        
        outerElement.addEventListener('mouseup', function() {
            // Add any mouseup effects if needed
        });
    }
    
    // Return cleanup function
    return function cleanup() {
        clearInterval(intervalId);
    };
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalendar);
} else {
    initCalendar();
}
