/*
 * Receptivo Website Script
 *
 * Handles interactive functionality such as the ROI calculator and
 * accordion toggles. This script executes after the DOM has loaded.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements for the ROI calculator
  const missedCallsSlider = document.getElementById('missedCalls');
  const conversionRateSlider = document.getElementById('conversionRate');
  const avgValueSlider = document.getElementById('avgValue');
  const missedCallsVal = document.getElementById('missedCallsVal');
  const conversionRateVal = document.getElementById('conversionRateVal');
  const avgValueVal = document.getElementById('avgValueVal');
  const lostRevenueEl = document.getElementById('lostRevenue');

  function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US');
  }

  function updateCalculator() {
    const missed = parseInt(missedCallsSlider.value, 10);
    const conversion = parseInt(conversionRateSlider.value, 10) / 100;
    const avg = parseInt(avgValueSlider.value, 10);
    // Update labels
    missedCallsVal.textContent = missed;
    conversionRateVal.textContent = conversionRateSlider.value + '%';
    avgValueVal.textContent = '$' + avg;
    // Compute lost revenue
    const lostRevenue = Math.round(missed * conversion * avg);
    lostRevenueEl.textContent = formatCurrency(lostRevenue);
  }

  // Initial calculation
  updateCalculator();

  // Event listeners for sliders
  [missedCallsSlider, conversionRateSlider, avgValueSlider].forEach((slider) => {
    slider.addEventListener('input', updateCalculator);
  });

  // Accordion functionality
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });
});

/*
 * Animated sea‑wave background for the hero
 *
 * This section implements a dynamic canvas animation inspired by
 * receptivoai.com's fluid shapes. Multiple circle containers move
 * slowly across the canvas creating an organic, ever‑changing pattern.
 * Colours are tuned to the Receptivo brand palette. The animation is
 * deliberately slower and more subdued than the reference to avoid
 * distracting from the headline.
 */

const TWO_PI = Math.PI * 2;

class GooCircle {
  constructor(x, y, baseRadius, bounceRadius, angleCircle) {
    this.basePosition = { x, y };
    this.position = { x, y };
    // Slow down the rotation speed for a calmer motion
    this.speed = 0.004;
    this.baseSize = 10;
    this.size = 10;
    this.angle = (x + y);
    this.baseRadius = baseRadius;
    this.bounceRadius = bounceRadius;
    this.angleCircle = angleCircle;
  }
  update() {
    this.position.x = this.basePosition.x + Math.cos(this.angleCircle) * (Math.sin(this.angle + this.angleCircle) * this.bounceRadius + this.baseRadius);
    this.position.y = this.basePosition.y + Math.sin(this.angleCircle) * (Math.sin(this.angle + this.angleCircle) * this.bounceRadius + this.baseRadius);
    this.size = Math.cos(this.angle) * 8 + this.baseSize;
    this.angle += this.speed;
  }
  render(context) {
    // Use a hue aligned with the Receptivo brand (around 208) and vary the lightness based on size
    const hue = 208;
    const lightness = Math.min(80, Math.max(20, this.size * 4));
    context.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.size, 0, TWO_PI);
    context.fill();
  }
}

class GooCircleContainer {
  constructor(context, x, y) {
    this.context = context;
    this.position = { x, y };
    this.numberOfCircles = 12;
    this.circles = [];
    this.baseRadius = 15;
    this.bounceRadius = 120;
    this.singleSlice = TWO_PI / this.numberOfCircles;
  }
  initializeCircles() {
    for (let i = 0; i < this.numberOfCircles; i++) {
      this.circles.push(new GooCircle(this.position.x, this.position.y + Math.random(), this.baseRadius, this.bounceRadius, i * this.singleSlice));
    }
  }
  update() {
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].update();
    }
  }
  render(context) {
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].render(context);
    }
  }
}

class GooApplication {
  constructor() {
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas) return;
    this.context = this.canvas.getContext('2d');
    this.circleContainers = [];
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas(), false);
  }
  resizeCanvas() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.circleContainers = [];
    // Create containers across the width and height with some spacing
    for (let x = 0; x < this.width + 100; x += 120) {
      for (let y = 0; y < this.height + 100; y += 120) {
        let cc = new GooCircleContainer(this.context, x, y);
        cc.initializeCircles();
        this.circleContainers.push(cc);
      }
    }
  }
  update() {
    for (let i = 0; i < this.circleContainers.length; i++) {
      this.circleContainers[i].update();
    }
  }
  render() {
    this.context.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.circleContainers.length; i++) {
      this.circleContainers[i].render(this.context);
    }
  }
  loop() {
    this.update();
    this.render();
    window.requestAnimationFrame(() => this.loop());
  }
}

// Initialise the GooApplication on page load
window.addEventListener('load', () => {
  const gooApp = new GooApplication();
  if (gooApp && gooApp.canvas) {
    gooApp.loop();
  }
});