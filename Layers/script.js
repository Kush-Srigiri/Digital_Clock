function updateClock() {
  const now = new Date();

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const jsDay = now.getDay();
  const dayIndex = (jsDay + 6) % 7;
  const dayName = days[dayIndex];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
  document.getElementById('date').textContent = `${dayName}, ${month} ${day}, ${year}`;
}

setInterval(updateClock, 1000);
updateClock();

function quadBezier(p0, p1, p2, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  return {
    x: uu * p0.x + 2 * u * t * p1.x + tt * p2.x,
    y: uu * p0.y + 2 * u * t * p1.y + tt * p2.y
  };
}

document.querySelector('.clock-container').addEventListener('click', (ev) => {
  const btn = ev.currentTarget;
  const rect = btn.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  const timeEl = document.getElementById('time');
  const flying = document.createElement('div');
  flying.className = 'flying-time';
  flying.textContent = timeEl.textContent;
  flying.style.left = `${startX}px`;
  flying.style.top  = `${startY}px`;
  flying.style.opacity = '1';
  flying.style.transform = 'translate(-50%, -50%) scale(1)';

  document.body.appendChild(flying);


  const horizontalSpread = 300; 
  const verticalUpMin = 140; 
  const verticalUpMax = 380; 

  const endX = startX + (Math.random() - 0.5) * horizontalSpread * 2;
  const endY = startY - (verticalUpMin + Math.random() * (verticalUpMax - verticalUpMin)); 

  const cpX = startX + (Math.random() - 0.5) * horizontalSpread;
  const cpY = startY - (20 + Math.random() * (verticalUpMax * 0.7));

  const p0 = { x: startX, y: startY };
  const p1 = { x: cpX, y: cpY };
  const p2 = { x: endX, y: endY };

  const duration = 1200 + Math.random() * 800; 
  const rotateAmount = (Math.random() - 0.5) * 50; 

  const start = performance.now();

  function step(now) {
    const t = Math.min(1, (now - start) / duration);

    const pos = quadBezier(p0, p1, p2, t);
    flying.style.left = `${pos.x}px`;
    flying.style.top  = `${pos.y}px`;

    const scale = 1 + 0.15 * Math.sin(Math.PI * t); 
    flying.style.transform = `translate(-50%, -50%) rotate(${rotateAmount * t}deg) scale(${scale})`;
    flying.style.opacity = `${1 - t}`;

    const glow = Math.round(8 + (1 - t) * 40);
    const glowAlpha = 0.9 * (1 - t);
    flying.style.textShadow = `0 0 ${glow}px rgba(255,255,255,${glowAlpha}), 0 0 ${Math.round(glow*1.6)}px rgba(0,200,255,${glowAlpha*0.7})`;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      flying.remove();
    }
  }
  
  requestAnimationFrame(step);
});
