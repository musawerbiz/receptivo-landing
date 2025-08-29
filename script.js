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