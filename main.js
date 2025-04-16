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

// Load and display portfolio items
async function loadPortfolioData() {
    try {
        const response = await fetch('.//data/gallery.json');
        const data = await response.json();
        
        const portfolioGrid = document.getElementById('portfolioGrid');
        portfolioGrid.innerHTML = ''; // Clear existing content
        
        data.categories.forEach(category => {
            category.projects.forEach(project => {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                portfolioItem.innerHTML = `
                    <img src="${project.thumbnail}" alt="${project.title}">
                    <div class="portfolio-item-content">
                        <h3>${project.title}</h3>
                        <p>${category.name}</p>
                    </div>
                `;
                portfolioItem.addEventListener('click', () => {
                    window.location.href = `gallery.html#${category.id}`;
                });
                portfolioGrid.appendChild(portfolioItem);
            });
        });
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        const portfolioGrid = document.getElementById('portfolioGrid');
        portfolioGrid.innerHTML = '<p class="error-message">Failed to load portfolio items</p>';
    }
}

// Copy email to clipboard and show feedback
async function copyEmailToClipboard(email) {
    try {
        await navigator.clipboard.writeText(email);
        
        // Create and show the tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = 'Email copied!';
        document.body.appendChild(tooltip);
        
        // Remove the tooltip after animation
        setTimeout(() => {
            tooltip.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 300);
        }, 2000);
    } catch (err) {
        console.error('Failed to copy email:', err);
    }
}

// Load and display contacts and team members
async function loadContactData() {
    try {
        const response = await fetch('.//data/contacts.json');
        const data = await response.json();
        
        // Display team members
        const teamList = document.getElementById('team-list');
        data.team.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'contact-card';
            memberCard.innerHTML = `
                <h4>${member.name}</h4>
                <p>${member.role}</p>
                <span class="email" role="button" tabindex="0">${member.email}</span>
            `;
            const emailSpan = memberCard.querySelector('.email');
            if (member.email !== 'redacted') {
                emailSpan.addEventListener('click', () => copyEmailToClipboard(member.email));
                emailSpan.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        copyEmailToClipboard(member.email);
                    }
                });
            }
            teamList.appendChild(memberCard);
        });

        // Display contacts
        const contactsList = document.getElementById('contacts-list');
        data.contacts.forEach(contact => {
            const contactCard = document.createElement('div');
            contactCard.className = 'contact-card';
            contactCard.innerHTML = `
                <h4>${contact.name}</h4>
                <span class="email" role="button" tabindex="0">${contact.email}</span>
            `;
            const emailSpan = contactCard.querySelector('.email');
            emailSpan.addEventListener('click', () => copyEmailToClipboard(contact.email));
            emailSpan.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    copyEmailToClipboard(contact.email);
                }
            });
            contactsList.appendChild(contactCard);
        });
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData();
    loadContactData();
});

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