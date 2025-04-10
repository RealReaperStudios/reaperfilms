// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Get Started button scroll to contact
document.querySelector('.cta-button').addEventListener('click', () => {
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
    });
});

// Load and display contacts and team members
async function loadContactData() {
    try {
        const response = await fetch('data\contacts.json');
        const data = await response.json();
        
        // Display team members
        const teamList = document.getElementById('team-list');
        data.team.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'contact-card';
            memberCard.innerHTML = `
                <h4>${member.name}</h4>
                <p>${member.role}</p>
                <span class="email">${member.email}</span>
            `;
            teamList.appendChild(memberCard);
        });

        // Display contacts
        const contactsList = document.getElementById('contacts-list');
        data.contacts.forEach(contact => {
            const contactCard = document.createElement('div');
            contactCard.className = 'contact-card';
            contactCard.innerHTML = `
                <h4>${contact.name}</h4>
                <span class="email">${contact.email}</span>
            `;
            contactsList.appendChild(contactCard);
        });
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
}

// Load contacts when the page loads
document.addEventListener('DOMContentLoaded', loadContactData);

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate sections on scroll
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease-out';
    observer.observe(section);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});