// Custom Cursor
const cursorDot = document.createElement('div');
const cursorOutline = document.createElement('div');
cursorDot.className = 'cursor-dot';
cursorOutline.className = 'cursor-outline';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorOutline);

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

function animateCursor() {
    // Linear interpolation for smooth trailing effect
    // Speed factor: 0.1 (lower is smoother/slower, higher is faster)
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;

    outlineX += distX * 0.15;
    outlineY += distY * 0.15;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Header Scroll Effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 3D Tilt Effect for Cards
const cards = document.querySelectorAll('.dest-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Particle Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'; // Neon colors
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Connect particles
    particles.forEach((a, index) => {
        for (let b of particles.slice(index + 1)) {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1000})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resize);
resize();
initParticles();
animateParticles();
