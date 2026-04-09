// js/space-engine.js
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('space');
    if (!canvas) return; // Safety check: If there's no canvas on this page, stop running.
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [], shootingStars = [], galaxies = [];

    // --- ENGINE SETTINGS ---
    const SETTINGS = {
        ambientStars: 1000,     
        totalGalaxies: 6,       
        driftSpeed: 0.3,        
        twinkleSpeed: 0.002,    
        fov: 400                
    };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function project3D(x, y, z) {
        const scale = SETTINGS.fov / Math.max(z, 0.1); 
        return {
            x: (x * scale) + width / 2,
            y: (y * scale) + height / 2,
            scale: scale
        };
    }

    // --- AMBIENT STARS ---
    class Star {
        constructor() { this.reset(true); }
        reset(initial = false) {
            this.x = (Math.random() - 0.5) * width * 4;
            this.y = (Math.random() - 0.5) * height * 4;
            this.z = initial ? Math.random() * 2000 : 2000;
            this.baseSize = Math.random() * 1.5;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }
        update(time) {
            this.z -= SETTINGS.driftSpeed;
            if (this.z <= 0) this.reset();
            this.alpha = 0.2 + 0.8 * Math.abs(Math.sin(time * SETTINGS.twinkleSpeed + this.twinklePhase));
        }
        draw() {
            const p = project3D(this.x, this.y, this.z);
            if (p.scale <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) return;
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            const size = Math.max(0.5, this.baseSize * p.scale);
            ctx.fillRect(p.x, p.y, size, size);
        }
    }

    // --- GALAXIES ---
    class Galaxy {
        constructor(initial = false) {
            this.particles = [];
            this.reset(initial);
        }
        reset(initial = false) {
            this.x = (Math.random() - 0.5) * width * 3;
            this.y = (Math.random() - 0.5) * height * 3;
            this.z = initial ? Math.random() * 3000 + 500 : 3500; 
            this.rotation = Math.random() * Math.PI * 2;
            this.spinSpeed = (Math.random() - 0.5) * 0.001; 
            this.radius = Math.random() * 400 + 200;
            this.isSpiral = Math.random() > 0.3; 
            const hues = [220, 260, 20, 180, 300]; 
            this.hue = hues[Math.floor(Math.random() * hues.length)];
            this.generateParticles();
        }
        generateParticles() {
            this.particles = [];
            const particleCount = Math.floor(Math.random() * 600 + 400);
            const arms = Math.floor(Math.random() * 3) + 2; 
            for (let i = 0; i < particleCount; i++) {
                const distance = Math.pow(Math.random(), 2) * this.radius;
                let angle, spread;
                if (this.isSpiral) {
                    angle = (i % arms) * ((Math.PI * 2) / arms) + (distance * 0.015);
                    spread = (Math.random() - 0.5) * (this.radius * 0.2); 
                } else {
                    angle = Math.random() * Math.PI * 2;
                    spread = (Math.random() - 0.5) * (distance * 0.5);
                }
                this.particles.push({
                    ox: Math.cos(angle) * distance + Math.cos(angle) * spread,
                    oy: Math.sin(angle) * distance + Math.sin(angle) * spread,
                    size: Math.random() * 2,
                    lightness: 100 - (distance / this.radius) * 60 
                });
            }
        }
        update() {
            this.rotation += this.spinSpeed;
            this.z -= SETTINGS.driftSpeed;
            if (this.z <= 0) this.reset();
        }
        draw() {
            if (this.z > 4000) return;
            this.particles.forEach(p => {
                const rx = p.ox * Math.cos(this.rotation) - p.oy * Math.sin(this.rotation);
                const ry = p.ox * Math.sin(this.rotation) + p.oy * Math.cos(this.rotation);
                const proj = project3D(this.x + rx, this.y + ry, this.z);
                if (proj.scale <= 0 || proj.x < 0 || proj.x > width || proj.y < 0 || proj.y > height) return;
                ctx.fillStyle = `hsl(${this.hue}, 80%, ${p.lightness}%)`;
                const size = Math.max(0.2, p.size * proj.scale);
                ctx.fillRect(proj.x, proj.y, size, size);
            });
        }
    }

    // --- SHOOTING STARS ---
    class ShootingStar {
        constructor() {
            this.x = Math.random() * width;
            this.y = -100; 
            this.length = Math.random() * 80 + 40;
            this.speed = Math.random() * 10 + 15; 
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; 
            this.opacity = 1;
            this.active = true;
        }
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.02; 
            if (this.opacity <= 0 || this.x > width || this.y > height) this.active = false;
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
            ctx.lineWidth = 1.5;
            const grad = ctx.createLinearGradient(this.x, this.y, this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
            grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
            ctx.strokeStyle = grad;
            ctx.stroke();
        }
    }

    // --- INITIALIZE & LOOP ---
    for (let i = 0; i < SETTINGS.ambientStars; i++) stars.push(new Star());
    for (let i = 0; i < SETTINGS.totalGalaxies; i++) galaxies.push(new Galaxy(true));

    function animate(time) {
        ctx.fillStyle = '#030303';
        ctx.fillRect(0, 0, width, height);

        galaxies.sort((a, b) => b.z - a.z).forEach(galaxy => {
            galaxy.update();
            galaxy.draw();
        });

        stars.forEach(star => {
            star.update(time);
            star.draw();
        });

        if (Math.random() < 0.005) shootingStars.push(new ShootingStar());
        
        shootingStars.forEach((star, index) => {
            if (star.active) {
                star.update();
                star.draw();
            } else {
                shootingStars.splice(index, 1);
            }
        });

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});