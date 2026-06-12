// Nav background on scroll
const hdr = document.getElementById('hdr');
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 40), { passive: true });

// Smooth anchor scrolling (respects reduced motion via CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// UK clock in footer
const clk = document.getElementById('clk');
function tick() {
  if (clk) clk.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour12: false });
}
setInterval(tick, 1000); tick();

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
});

// Workflow simulators
const workflows = {
  finance: {
    title: 'Finance sync', desc: 'See how a Shopify order becomes a Xero invoice.',
    label: 'Order total (£)', placeholder: '150.00', button: 'Generate invoice',
    render(v) {
      const n = parseFloat(v) || 0;
      return `<div class="sim"><div class="sim-h"><span class="sim-b">Xero #INV-${2024 + Math.floor(Math.random() * 100)}</span><span class="sim-g">PAID</span></div><b>To:</b> Customer via Shopify<br><b>Date:</b> ${new Date().toLocaleDateString('en-GB')}<div class="sim-big">£${n.toFixed(2)}</div><div class="sim-sm">VAT (20%): £${(n * 0.2).toFixed(2)} included</div></div>`;
    }
  },
  fulfillment: {
    title: 'Smart fulfilment', desc: 'See country-based warehouse routing.',
    label: 'Shipping country', placeholder: 'France', button: 'Route order',
    render(v) {
      const uk = /^(uk|united kingdom|england|scotland|wales|northern ireland)$/i.test(v.trim());
      return `<div class="sim-ship"><div class="sim-sh">3PL — LABEL CREATED</div><div class="sim-sb"><div class="big">${escapeHtml(v.toUpperCase())}</div><div class="sm">ROUTED TO:</div><div class="wh">${uk ? 'MANCHESTER HUB (UK)' : 'EU FULFILMENT CENTRE'}</div><div class="bc">||| |||| || ||||| |||</div></div></div>`;
    }
  },
  ops: {
    title: 'Operations', desc: 'Enter a customer note to log it in Notion.',
    label: 'Customer note', placeholder: 'Customer requesting refund...', button: 'Sync to Notion',
    render(v) {
      return `<div class="sim-n"><h4>📄 Ticket #${8000 + Math.floor(Math.random() * 999)}</h4><div class="tg"><span class="tu">🔥 Urgent</span><span class="ts">@Support</span></div><div class="qt">"${escapeHtml(v)}"</div></div>`;
    }
  },
  alerts: {
    title: 'Team alerts', desc: 'Simulate a high-value order Slack alert.',
    label: 'Order value (£)', placeholder: '2500', button: 'Send alert',
    render(v) {
      return `<div class="sim-sl"><div class="av"></div><div><div class="nm">Shopify Bot <span>APP</span></div><div class="bd">🚨 <b>New high-value order</b><br>Value: <span class="hl">£${escapeHtml(v)}</span><br><em>Drinks are on us 🍻</em></div></div></div>`;
    }
  }
};

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Modal
const modal = document.getElementById('modal');
const mbody = document.getElementById('mbody');
let currentWf = null;
let lastFocused = null;

function openModal(key) {
  currentWf = key;
  lastFocused = document.activeElement;
  const wf = workflows[key];
  mbody.innerHTML = `
    <h3 id="mtitle">${wf.title}</h3>
    <p class="md">${wf.desc}</p>
    <label class="ml" for="minp">${wf.label}</label>
    <input class="mi" id="minp" placeholder="${wf.placeholder}">
    <button class="mb" id="mrun">${wf.button}</button>
    <div class="mr" id="mres" aria-live="polite"></div>`;
  modal.hidden = false;
  const input = document.getElementById('minp');
  input.focus();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') runSim(); });
  document.getElementById('mrun').addEventListener('click', runSim);
}

function runSim() {
  const v = document.getElementById('minp').value.trim();
  if (!v) return;
  const res = document.getElementById('mres');
  res.innerHTML = workflows[currentWf].render(v);
  res.classList.add('show');
}

function closeModal() {
  modal.hidden = true;
  currentWf = null;
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.auto-row').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.wf));
});
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
modal.querySelector('.modal-x').addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (modal.hidden) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Tab') {
    // Simple focus trap
    const focusables = modal.querySelectorAll('button, input, [href]');
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
