// Calendar functionality
let currentMonth = 2; // March (0-based index)
let currentYear = 2025;
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Function to add a new event
function addNewEvent() {
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const project = document.getElementById('event-project');
    const projectName = project.options[project.selectedIndex].text;
    const projectColor = project.value;
    const description = document.getElementById('event-description').value;
    
    if (!title || !date) {
        alert('Please provide at least an event title and date');
        return;
    }
    
    // Parse the date to get the day
    const eventDate = new Date(date);
    const day = eventDate.getDate();
    
    // Find the calendar day cell
    const calendarDays = document.querySelectorAll('.calendar-day:not(.other-month)');
    let targetDay = null;
    
    for (let dayCell of calendarDays) {
        const dayNumber = dayCell.querySelector('.day-number');
        if (parseInt(dayNumber.textContent) === day) {
            targetDay = dayCell;
            break;
        }
    }
    
    if (targetDay) {
        // Create a new event element
        const eventElement = document.createElement('div');
        eventElement.className = 'calendar-event';
        eventElement.style.backgroundColor = projectColor;
        eventElement.textContent = title;
        
        // Format the date and time for display
        const formattedDate = new Date(date).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        const formattedTime = time ? new Date(`2025-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }) : 'All day';
        
        // Add click handler to view event details
        eventElement.onclick = function(e) {
            e.stopPropagation();
            viewEventDetails(title, formattedDate, formattedTime, projectName, description);
            return false;
        };
        
        // Add the event to the calendar
        targetDay.appendChild(eventElement);
        
        // Clear the form
        document.getElementById('event-title').value = '';
        document.getElementById('event-date').value = '';
        document.getElementById('event-time').value = '';
        document.getElementById('event-description').value = '';
        
        alert('Event added successfully!');
    } else {
        alert('Cannot add event: The selected date is not in the current view');
    }
}

// Function to quickly add an event by double-clicking on a day
function quickAddEvent(day) {
    // Set the date input to the selected day
    const dateInput = document.getElementById('event-date');
    const selectedDate = new Date(currentYear, currentMonth, day);
    const formattedDate = selectedDate.toISOString().substring(0, 10);
    dateInput.value = formattedDate;
    
    // Focus the title input
    document.getElementById('event-title').focus();
    
    // Scroll to the add event form
    document.querySelector('.sidebar-section:nth-child(3)').scrollIntoView({ behavior: 'smooth' });
    
    alert(`Quick add event for day ${day}. Please fill in the event details in the form.`);
}

// Function to view event details
function viewEventDetails(title, date, time, project, description) {
    // Populate the modal with event details
    document.getElementById('modal-event-title').textContent = title;
    document.getElementById('modal-event-date').textContent = date;
    document.getElementById('modal-event-time').textContent = time;
    document.getElementById('modal-event-project').textContent = project;
    document.getElementById('modal-event-description').textContent = description || 'No description provided';
    
    // Show the modal
    document.getElementById('event-modal').style.display = 'block';
}

// Function to close the event modal
function closeEventModal() {
    document.getElementById('event-modal').style.display = 'none';
}

// Function to edit an event
function editEvent() {
    const title = document.getElementById('modal-event-title').textContent;
    document.getElementById('event-title').value = title;
    
    // Close the modal
    closeEventModal();
    
    // Scroll to the add event form
    document.querySelector('.sidebar-section:nth-child(3)').scrollIntoView({ behavior: 'smooth' });
    
    alert(`Editing event: ${title}. Update the details in the form and click 'Add Event' to save changes.`);
}

// Function to delete an event
function deleteEvent() {
    const title = document.getElementById('modal-event-title').textContent;
    if (confirm(`Are you sure you want to delete the event "${title}"?`)) {
        // Find the event in the calendar
        const events = document.querySelectorAll('.calendar-event');
        for (let event of events) {
            if (event.textContent === title) {
                event.remove();
                break;
            }
        }
        
        // Close the modal
        closeEventModal();
        
        alert(`Event "${title}" has been deleted.`);
    }
}

// Function to clear all events
function clearAllEvents() {
    if (confirm('Are you sure you want to clear all events? This cannot be undone.')) {
        const events = document.querySelectorAll('.calendar-event');
        for (let event of events) {
            event.remove();
        }
        alert('All events have been cleared.');
    }
}

// Function to navigate to the previous month
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

// Function to navigate to the next month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

// Function to show a specific month when in year view
function showMonth(monthIndex) {
    currentMonth = monthIndex;
    updateCalendar();
    changeView('month');
}

// Function to update the calendar display
function updateCalendar() {
    // Update the month/year header
    document.getElementById('current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // In a real application, we would update the calendar grid here
    // For this demo, we'll just simulate a month change
    alert(`Showing calendar for ${monthNames[currentMonth]} ${currentYear}`);
}

// Function to change the calendar view
function changeView(viewType) {
    // Reset all view buttons to inactive
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to the selected view button
    const selectedButton = Array.from(viewButtons).find(btn => 
        btn.textContent.toLowerCase() === viewType.toLowerCase()
    );
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // Handle view switching
    const calendarView = document.getElementById('calendar-view');
    const yearView = document.getElementById('year-view');
    
    switch (viewType) {
        case 'day':
            calendarView.style.display = 'none';
            yearView.style.display = 'none';
            alert('Day view selected. Showing events for a single day.');
            break;
        case 'week':
            calendarView.style.display = 'none';
            yearView.style.display = 'none';
            alert('Week view selected. Showing events for the week.');
            break;
        case 'month':
            calendarView.style.display = 'grid';
            yearView.style.display = 'none';
            break;
        case 'year':
            calendarView.style.display = 'none';
            yearView.style.display = 'block';
            alert('Year view selected. Click on a month to view its events.');
            break;
    }
}

// Initialize the calendar
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for window clicks to close modals
    window.onclick = function(event) {
        const modal = document.getElementById('event-modal');
        if (event.target === modal) {
            closeEventModal();
        }
    };
    
    // Set the default date in the form to today
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    document.getElementById('event-date').value = formattedDate;
});