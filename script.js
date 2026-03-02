// ═══ Scroll Reveals ═══
const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v');obs.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.r,.r-up,.r-left,.r-right,.r-scale,.r-clip,.r-count').forEach(e=>obs.observe(e));

// ═══ Counter Animation ═══
const counted=new Set();
const cObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting&&!counted.has(e.target)){counted.add(e.target);const el=e.target.querySelector('.num-val');const target=+el.dataset.count;const suffix=el.dataset.suffix||'';const dur=1200;const start=performance.now();!function tick(now){const p=Math.min((now-start)/dur,1);const eased=1-Math.pow(1-p,3);el.textContent=Math.round(target*eased)+suffix;if(p<1)requestAnimationFrame(tick)}(performance.now())}})},{threshold:.3});
document.querySelectorAll('.num-item').forEach(e=>cObs.observe(e));

// ═══ Typed Effect ═══
const phrases=['DTC brands.','sports nutrition.','outdoor equipment.','growing businesses.','ambitious founders.'];
let pi=0,ci=0,deleting=false;
const typedEl=document.getElementById('typed');
function typeLoop(){
  const word=phrases[pi];
  if(!deleting){
    typedEl.textContent=word.slice(0,++ci);
    if(ci===word.length){deleting=true;setTimeout(typeLoop,2000);return}
    setTimeout(typeLoop,80+Math.random()*40);
  }else{
    typedEl.textContent=word.slice(0,--ci);
    if(ci===0){deleting=false;pi=(pi+1)%phrases.length;setTimeout(typeLoop,400);return}
    setTimeout(typeLoop,40);
  }
}
setTimeout(typeLoop,1800);

// ═══ Nav ═══
const hdr=document.getElementById('hdr');
window.addEventListener('scroll',()=>{hdr.classList.toggle('scrolled',scrollY>40)});

// ═══ Smooth scroll ═══
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})});

// ═══ Clock ═══
function tick(){const e=document.getElementById('clk');if(e)e.textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'Europe/London',hour12:false})}
setInterval(tick,1000);tick();

// ═══ Testimonial Carousel ═══
let slide=0;const track=document.getElementById('testTrack');const dots=document.querySelectorAll('.test-dot');
function goSlide(n){slide=n;track.style.transform=`translateX(-${n*100}%)`;dots.forEach((d,i)=>d.classList.toggle('active',i===n))}
setInterval(()=>{goSlide((slide+1)%3)},5000);

// ═══ FAQ ═══
function toggleFaq(btn){const item=btn.parentElement;item.classList.toggle('open')}

// ═══ Modal ═══
const wf={
  finance:{t:'Finance Sync',d:'See how a Shopify order becomes a Xero invoice.',l:'Order total (£)',p:'150.00',b:'Generate Invoice',
    r(v){return`<div class="sim"><div class="sim-h"><span class="sim-b">Xero #INV-${2024+~~(Math.random()*100)}</span><span class="sim-g">PAID</span></div><b>To:</b> Customer via Shopify<br><b>Date:</b> ${new Date().toLocaleDateString('en-GB')}<div class="sim-big">£${v}</div><div class="sim-sm">VAT (20%): £${(v*.2).toFixed(2)} included</div></div>`}},
  fulfillment:{t:'Smart Fulfillment',d:'See country-based warehouse routing.',l:'Shipping country',p:'France',b:'Route Order',
    r(v){const uk=/^(uk|united kingdom|england|scotland|wales)$/i.test(v.trim());return`<div class="sim-ship"><div class="sim-sh">SHIPSTATION — LABEL CREATED</div><div class="sim-sb"><div class="big">${v.toUpperCase()}</div><div class="sm">ROUTED TO:</div><div class="wh">${uk?'MANCHESTER HUB (UK)':'BERLIN CENTRE (EU)'}</div><div class="bc">||| |||| || ||||| |||</div></div></div>`}},
  ops:{t:'Operations',d:'Enter a customer note to log it in Notion.',l:'Customer note',p:'Customer requesting refund...',b:'Sync to Notion',
    r(v){return`<div class="sim-n"><h4>📄 Ticket #${8e3+~~(Math.random()*999)}</h4><div class="tg"><span class="tu">🔥 Urgent</span><span class="ts">@Support</span></div><div class="qt">"${v}"</div></div>`}},
  alerts:{t:'Team Alerts',d:'Simulate a high-value order Slack alert.',l:'Order value (£)',p:'2500',b:'Send Alert',
    r(v){return`<div class="sim-sl"><div class="av"></div><div><div class="nm">Shopify Bot <span>APP</span></div><div class="bd">🚨 <b>New High Value Order!</b><br>Value: <span class="hl">£${v}</span><br><em>Drinks are on us! 🍻</em></div></div></div>`}}
};
let cur=null;
function openModal(k){cur=k;const d=wf[k];document.getElementById('mbody').innerHTML=`<h3>${d.t}</h3><p class="md">${d.d}</p><label class="ml">${d.l}</label><input class="mi" id="minp" placeholder="${d.p}" onkeydown="if(event.key==='Enter')runSim()"><button class="mb" onclick="runSim()">${d.b}</button><div class="mr" id="mres"></div>`;document.getElementById('modal').classList.add('open');setTimeout(()=>document.getElementById('minp').focus(),80)}
function runSim(){const v=document.getElementById('minp').value.trim();if(!v)return;const r=document.getElementById('mres');r.innerHTML=wf[cur].r(v);r.classList.add('show')}
function closeModal(){document.getElementById('modal').classList.remove('open');cur=null}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});