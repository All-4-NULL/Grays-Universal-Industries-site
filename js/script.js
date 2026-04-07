const canvas = document.getElementById('warpCanvas');
const ctx = canvas.getContext('2d');
let width, height, stars = [];

const speed = 3; //warp speed for the background
const numStars = 100;
const colors = ['#0066FF', '#cbd5e1', '#ffffff'];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = Math.random() * width;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.z -= speed;
        if (this.z < 1) { this.reset(); this.z = width; }
    }
    draw() {
        let sx = (this.x / this.z) * width + width / 2;
        let sy = (this.y / this.z) * height + height / 2;
        let px = (this.x / (this.z + 50)) * width + width / 2;
        let py = (this.y / (this.z + 50)) * height + height / 2;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

for (let i = 0; i < numStars; i++) stars.push(new Star());

function animate() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    stars.forEach(star => { star.update(); star.draw(); });
    requestAnimationFrame(animate);
}
animate();

// --- Hamburger Menu  ---
const menuBtn = document.getElementById('menuBtn');
const sideNav = document.getElementById('sideNav');
const closeBtn = document.getElementById('closeBtn');

menuBtn.addEventListener('click', () => {
    sideNav.classList.remove('translate-x-full');
});

closeBtn.addEventListener('click', () => {
    sideNav.classList.add('translate-x-full');
});

// --- Mouse Parallax for the Hero Logo ---
// This makes the logo in the center tilt slightly as mouse moves
document.addEventListener('mousemove', (e) => {
    const logo = document.querySelector('.hero-svg');
    if (!logo) return;
    
    const x = (window.innerWidth / 2 - e.pageX) / 30;
    const y = (window.innerHeight / 2 - e.pageY) / 30;
    
    logo.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});