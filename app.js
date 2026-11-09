(function(){
'use strict';

/* ---------- utilidades ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const brl=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const int=n=>Number(n||0).toLocaleString('pt-BR');
const pad=n=>String(n).padStart(2,'0');
const LOW=5;
const MONTHS=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const MONTHS_FULL=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const WD=['dom','seg','ter','qua','qui','sex','sáb'];

const IC={
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  chart:'<path d="M5 20V11M12 20V4M19 20v-6"/><path d="M3 20h18"/>',
  receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  logout:'<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
  store:'<path d="M4 10v10h16V10"/><path d="M3 10l2-6h14l2 6z"/><path d="M10 20v-5h4v5"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/>',
  send:'<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  bot:'<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>'
};
const ic=(n,s)=>`<svg class="ic" width="${s||20}" height="${s||20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const LOGO_LOCKUP='assets/logo-completa.jpg';
const LOGO_ICON='assets/logo-icone.jpg';
const logo=s=>`<img class="logo-ic" src="${LOGO_ICON}" width="${s}" height="${s}" alt="">`;
const brandMark=s=>`${logo(s)}<span class="wordmark">Estoque<span class="wmi">i</span></span>`;

/* ---------- cores e miniaturas ---------- */
const PALETTE=[['Preto','#1B1B1F'],['Branco','#F7F7F4'],['Cinza','#8C939F'],['Azul','#2563EB'],['Azul-marinho','#1E2A5A'],['Verde','#2E8B57'],['Vermelho','#D32F2F'],['Rosa','#EC6FA3'],['Amarelo','#F4C20D'],['Laranja','#F57C20'],['Roxo','#7E57C2'],['Bege','#D8C3A5'],['Marrom','#7B4B2A'],['Vinho','#7A1F3D']];
function colorHex(name){
  const n=norm(name).trim();
  const f=PALETTE.find(p=>norm(p[0])===n);
  if(f) return f[1];
  let h=0; for(const ch of n) h=(h*31+ch.charCodeAt(0))%360;
  return `hsl(${h} 45% 52%)`;
}
const SHAPES={
  shirt:'<path d="M40 14 L22 24 L30 40 L40 35 L40 76 L80 76 L80 35 L90 40 L98 24 L80 14 C74 25 46 25 40 14 Z"/>',
  dress:'<path d="M49 10 L56 10 C58 19 62 19 64 10 L71 10 L75 30 L70 38 L88 78 L32 78 L50 38 L45 30 Z"/>',
  pants:'<path d="M38 10 L82 10 L87 80 L66 80 L60 38 L54 80 L33 80 Z"/>',
  shoe:'<path d="M12 60 C12 52 20 49 28 46 L40 29 C44 26 49 28 51 33 C57 42 68 45 84 49 C99 53 108 57 108 64 L108 68 L12 68 Z"/><rect x="10" y="67" width="100" height="8" rx="4" fill="rgba(0,0,0,.35)" stroke="none"/>',
  bag:'<path d="M44 36 C44 14 76 14 76 36" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="4"/><rect x="28" y="34" width="64" height="46" rx="7"/>',
  box:'<path d="M60 12 L94 29 V63 L60 80 L26 63 V29 Z"/><path d="M26 29 L60 46 L94 29 M60 46 V80" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="2"/>'
};
function thumb(i){
  if(i.photos&&i.photos.length) return `<img src="${i.photos[0]}" alt="${esc(i.name)}">`;
  const c=colorHex((i.colors&&i.colors[0])||'Cinza');
  return `<svg viewBox="0 0 120 90" role="img" aria-label="${esc(i.name||'Item')}"><g fill="${c}" stroke="rgba(0,0,0,.3)" stroke-width="1.5" stroke-linejoin="round">${SHAPES[i.kind]||SHAPES.box}</g></svg>`;
}

/* ---------- dados fictícios ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
let itemSeq=0;
const mk=(name,kind,colors,sizes,qty,venda,custo)=>({id:'i'+(++itemSeq),name,kind,colors,sizes,qty,venda,custo,photos:[]});
function genSales(store,seed,weights,vendors){
  const rnd=mulberry32(seed); const out=[]; let n=0;
  const pays=['Pix','Pix','Cartão de crédito','Cartão de crédito','Cartão de débito','Dinheiro'];
  weights.forEach((cnt,m)=>{
    for(let k=0;k<cnt;k++){
      const last=m===10?1:new Date(2026,m+1,0).getDate();
      const day=m===10?1:1+Math.floor(rnd()*last);
      const hour=m===10?9+Math.floor(rnd()*8):9+Math.floor(rnd()*10);
      const ts=new Date(2026,m,day,hour,Math.floor(rnd()*60),Math.floor(rnd()*60)).getTime();
      const it=store.items[Math.floor(rnd()*store.items.length)];
      const atac=rnd()<0.18;
      const qty=atac?6+Math.floor(rnd()*7):1+(rnd()<0.25?1:0)+(rnd()<0.08?1:0);
      const v=vendors[Math.floor(rnd()*vendors.length)];
      out.push({id:'v-'+store.id+'-'+(++n),ts,vendedor:v[0],papel:v[1],pagamento:pays[Math.floor(rnd()*pays.length)],itemId:it.id,itemName:it.name,qty,tipo:atac?'Atacado':'Varejo',canal:rnd()<0.3?'Online':'Presencial',preco:it.venda,custo:it.custo,total:it.venda*qty});
    }
  });
  return out.sort((a,b)=>b.ts-a.ts);
}
function seedStores(){
  const s1={id:'s1',name:'Moda Bela Boutique',type:'Roupas femininas',code:'EST-8F3K29',items:[
    mk('Camiseta Básica Algodão','shirt',['Branco','Preto','Rosa'],['P','M','G'],34,59.9,22),
    mk('Vestido Midi Floral','dress',['Vinho','Azul-marinho'],['P','M','G'],4,189.9,78),
    mk('Calça Jeans Skinny','pants',['Azul','Preto'],['36','38','40','42'],18,169.9,64),
    mk('Camiseta Oversized','shirt',['Preto','Bege'],['M','G','GG'],0,79.9,31),
    mk('Bolsa Tiracolo Couro','bag',['Marrom','Preto'],['Único'],7,229,96),
    mk('Vestido Longo Linho','dress',['Bege','Verde'],['P','M','G'],11,259.9,110),
    mk('Calça Alfaiataria','pants',['Preto','Cinza'],['38','40','42'],3,219.9,92),
    mk('Blusa Cropped Canelada','shirt',['Rosa','Branco','Amarelo'],['PP','P','M'],26,49.9,17.5),
    mk('Camiseta Estampada Verão','shirt',['Laranja','Amarelo','Azul'],['P','M','G','GG'],42,64.9,24),
    mk('Vestido Curto Festa','dress',['Vermelho','Preto'],['P','M'],0,199.9,82)
  ],sales:[]};
  s1.sales=genSales(s1,1138,[7,8,9,10,15,11,9,10,11,13,3],[['Rafael Mendes','Dono'],['Camila Souza','Equipe'],['Camila Souza','Equipe'],['Bruna Lima','Equipe']]);
  const s2={id:'s2',name:'Calçados Passo Certo',type:'Calçados e acessórios',code:'EST-2M7QX4',items:[
    mk('Tênis Corrida Leve','shoe',['Branco','Azul'],['38','40','42','44'],22,299.9,140),
    mk('Sandália Rasteira','shoe',['Bege','Preto'],['34','36','38'],15,119.9,42),
    mk('Bota Cano Curto','shoe',['Marrom','Preto'],['36','38','40'],4,349.9,160),
    mk('Chinelo Slide','shoe',['Preto','Verde','Rosa'],['36','38','40','42'],60,49.9,15),
    mk('Sapatênis Casual','shoe',['Cinza','Marrom'],['40','42','44'],0,259.9,118),
    mk('Mochila Urbana','bag',['Preto','Azul-marinho'],['Único'],9,189.9,76)
  ],sales:[]};
  s2.sales=genSales(s2,2077,[5,6,7,7,9,8,6,7,8,10,2],[['Rafael Mendes','Dono'],['Diego Alves','Equipe'],['Diego Alves','Equipe']]);
  return [s1,s2];
}

const state={
  screen:'auth',authRole:'dono',authMode:'login',view:'dono',
  owner:{name:'Rafael Mendes',email:'rafael@gmail.com'},
  employee:{name:'Camila Souza',email:'camila@gmail.com',storeId:'s1'},
  stores:seedStores(),storeId:null,tab:'estoque',
  search:'',histSearch:'',histLimit:30,chartMetric:'pecas',regCode:'',
  chat:[{from:'team',text:'Olá! Aqui é a equipe do ESTOQUEI. Se tiver dúvida sobre estoque, vendas ou o seu plano, escreva aqui.',ts:new Date(2026,10,1,9,2).getTime()}]
};
const app=$('#app');
let modalEl=null,lastFocus=null,ctx={},draft=null,editId=null;
const curStore=()=>state.stores.find(s=>s.id===state.storeId)||state.stores[0];
const isOwner=()=>state.view==='dono';
const me=()=>isOwner()?state.owner:state.employee;
const initials=n=>n.split(' ').filter(Boolean).slice(0,2).map(p=>p[0].toUpperCase()).join('');
function uniqueCode(){
  const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c; do{ c='EST-'; for(let i=0;i<6;i++) c+=A[Math.floor(Math.random()*A.length)]; }while(state.stores.some(s=>s.code===c)||c===state.regCode);
  return c;
}
const findStoreByCode=c=>state.stores.find(s=>s.code===String(c).trim().toUpperCase());

/* ---------- cálculos ---------- */
function stockStats(st){
  let pecas=0,sem=0,baixo=0,valor=0,potencial=0;
  st.items.forEach(i=>{pecas+=i.qty;if(i.qty===0)sem++;else if(i.qty<=LOW)baixo++;valor+=i.qty*i.custo;potencial+=i.qty*i.venda;});
  return {pecas,sem,baixo,valor,potencial};
}
function analysis(st){
  let pecas=0,fat=0,lucro=0; const by={};
  st.sales.forEach(s=>{pecas+=s.qty;fat+=s.total;lucro+=(s.preco-s.custo)*s.qty;by[s.itemName]=(by[s.itemName]||0)+s.qty;});
  const top=Object.entries(by).sort((a,b)=>b[1]-a[1]);
  return {vendas:st.sales.length,pecas,fat,lucro,top,margem:fat>0?Math.round(lucro/fat*100):0};
}
function monthsWindow(sales){
  const latest=Math.max(Date.now(),...sales.map(s=>s.ts)); const end=new Date(latest); const arr=[];
  for(let i=10;i>=0;i--){const d=new Date(end.getFullYear(),end.getMonth()-i,1);arr.push({y:d.getFullYear(),m:d.getMonth(),pecas:0,fat:0});}
  sales.forEach(s=>{const d=new Date(s.ts);const w=arr.find(a=>a.y===d.getFullYear()&&a.m===d.getMonth());if(w){w.pecas+=s.qty;w.fat+=s.total;}});
  return arr;
}
function niceTop(max,intOnly){
  if(max<=0) return {cap:4,step:1};
  const raw=max/4, mag=Math.pow(10,Math.floor(Math.log10(raw))), n=raw/mag;
  const opts=intOnly?[1,2,5,10]:[1,2,2.5,5,10];
  const step=(opts.find(o=>n<=o)||10)*mag;
  return {cap:step*4,step};
}
const compact=v=>v>=1000?(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+'k':int(v);
function dParts(ts){const d=new Date(ts);return {d:`${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`,t:`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,w:WD[d.getDay()]};}
const saleBlob=s=>{const p=dParts(s.ts);return norm([p.w,p.d,p.t,s.vendedor,s.papel,s.pagamento,s.itemName,s.qty,s.tipo,s.canal,brl(s.total),s.total.toFixed(2)].join(' '));};

/* ---------- avisos, cópia, modais ---------- */
function toast(msg){
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg; $('#toasts').appendChild(t);
  setTimeout(()=>{t.style.transition='opacity .3s';t.style.opacity='0';setTimeout(()=>t.remove(),320);},3600);
}
async function copyCode(code,src){
  try{ await navigator.clipboard.writeText(code); toast('Código copiado: '+code); }
  catch(_){
    toast('Não foi possível copiar sozinho. Selecione o código: '+code);
    const inp=src&&src.closest('.code-row')&&src.closest('.code-row').querySelector('input');
    if(inp){inp.focus();inp.select();return;}
    const c=src&&src.closest('.store-foot')&&src.closest('.store-foot').querySelector('code');
    if(c){const r=document.createRange();r.selectNodeContents(c);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);}
  }
}
function openModal(html,cls){
  closeModal(true);
  lastFocus=document.activeElement;
  const w=document.createElement('div'); w.className='scrim';
  w.innerHTML=`<div class="modal ${cls||''}" role="dialog" aria-modal="true" aria-labelledby="mTitle">${html}</div>`;
  document.body.appendChild(w); modalEl=w; document.body.style.overflow='hidden';
  w.addEventListener('mousedown',e=>{if(e.target===w)closeModal();});
  const f=w.querySelector('input:not([type=file]):not([readonly]),button'); if(f) f.focus();
  return w;
}
function closeModal(silent){
  if(!modalEl) return;
  modalEl.remove(); modalEl=null; document.body.style.overflow='';
  if(!silent&&lastFocus&&document.contains(lastFocus)) lastFocus.focus();
}
const modalHead=t=>`<div class="modal-head"><h2 id="mTitle">${t}</h2><button type="button" class="icon-btn" data-act="close-modal" aria-label="Fechar">${ic('x',20)}</button></div>`;

/* ---------- renderização principal ---------- */
function render(){
  closeModal(true);
  document.body.dataset.screen=state.screen;
  if(state.screen==='auth') renderAuth();
  else if(state.screen==='stores') renderStores();
  else renderApp();
  window.scrollTo(0,0);
}
function viewSwitch(){
  return `<div class="proto" role="group" aria-label="Alternar visão de teste"><span class="proto-l">Visão</span><div class="seg mini">
    <button type="button" data-act="set-view" data-v="dono" aria-pressed="${state.view==='dono'}">Dono</button>
    <button type="button" data-act="set-view" data-v="func" aria-pressed="${state.view==='func'}">Funcionário</button>
  </div></div>`;
}

/* ===== ACESSO ===== */
function renderAuth(){
  const dono=state.authRole==='dono', reg=state.authMode==='register';
  app.innerHTML=`
  <main>
    <div class="auth-hero"><div class="wrap">
      <img class="lockup" src="${LOGO_LOCKUP}" alt="Estoquei. Controle. Organize. Cresça.">
      <p class="tagline"><span>Simplifique sua gestão.</span><span>Potencialize seus resultados.</span></p>
    </div></div>
    <div class="wrap auth-main">
      <section class="card auth-card" aria-label="Acesso ao ESTOQUEI">
        <div class="seg strong" role="tablist" aria-label="Tipo de acesso">
          <button type="button" role="tab" aria-selected="${dono}" data-act="auth-role" data-v="dono">Sou Dono</button>
          <button type="button" role="tab" aria-selected="${!dono}" data-act="auth-role" data-v="func">Sou Funcionário</button>
        </div>
        <div class="seg" role="tablist" aria-label="Entrar ou criar conta">
          <button type="button" role="tab" aria-selected="${!reg}" data-act="auth-mode" data-v="login">Entrar</button>
          <button type="button" role="tab" aria-selected="${reg}" data-act="auth-mode" data-v="register">Criar conta</button>
        </div>
        <p class="lead">${dono?(reg?'Crie sua conta e a primeira loja. O código da loja é gerado na hora.':'Acesse suas lojas, a análise de resultados e o código da equipe.'):(reg?'Use o código da empresa que o dono passou para você.':'Entre direto na loja onde você trabalha.')}</p>
        ${authForm()}
      </section>
      <p class="fine">Protótipo navegável com dados fictícios. Nada é salvo de verdade.</p>
    </div>
  </main>`;
}
function authForm(){
  const dono=state.authRole==='dono', reg=state.authMode==='register';
  const F=(id,label,type,ph,ac)=>`<div class="field"><label for="${id}">${label}</label><input id="${id}" class="input" type="${type}" placeholder="${ph}" autocomplete="${ac}"><div class="err" id="e-${id}" role="alert"></div></div>`;
  const rules=`<ul class="rules" id="rules"><li data-r="len"><span class="dot">${ic('check',12)}</span>Pelo menos 10 caracteres<span class="cnt" id="cnt">0/10</span></li><li data-r="up"><span class="dot">${ic('check',12)}</span>Uma letra maiúscula</li></ul>`;
  const pass=`<div class="field"><label for="f-pass">Senha</label><div class="pw"><input id="f-pass" class="input" type="password" placeholder="${reg?'Crie uma senha forte':'Sua senha'}" autocomplete="${reg?'new-password':'current-password'}"><button type="button" class="pw-t" data-act="toggle-pass" aria-label="Mostrar senha">${ic('eye',20)}</button></div>${reg?rules:''}<div class="err" id="e-f-pass" role="alert"></div></div>`;
  const email=F('f-email','Gmail','email','seunome@gmail.com','email');
  let body='', btn='';
  if(!reg){
    body=email+pass+`<button type="button" class="link-btn" data-act="demo-fill">Preencher com conta de demonstração</button>`;
    btn=dono?'Entrar como dono':'Entrar como funcionário';
  }else if(dono){
    body=F('f-name','Nome','text','Seu nome completo','name')+email+pass+F('f-store','Nome da loja','text','Ex.: Moda Bela Boutique','organization')+
    `<div class="field"><label for="f-gen">Código da loja</label><div class="code-row"><input id="f-gen" class="input" readonly value="${state.regCode}" aria-describedby="h-gen"><button type="button" class="btn" data-act="copy" data-v="${state.regCode}">${ic('copy',18)} Copiar</button></div><p class="hint" id="h-gen">Gerado automaticamente e exclusivo desta loja. Seus funcionários usam este código para entrar.</p></div>
    <div class="plan"><div><strong>Plano ESTOQUEI</strong><p class="muted small">Estoque, vendas e análise da sua loja.</p></div><div class="price">R$ 29,90<small> por mês</small></div></div>`;
    btn='Criar conta e loja';
  }else{
    body=F('f-name','Nome','text','Seu nome completo','name')+
    `<div class="field"><label for="f-code">Código da empresa</label><input id="f-code" class="input code" type="text" placeholder="EST-XXXXXX" autocomplete="off" autocapitalize="characters"><div class="err" id="e-f-code" role="alert"></div>
      <div class="hint">Para testar, toque em um código:</div><div class="chips-row">${state.stores.map(s=>`<button type="button" class="mini-chip" data-act="fill-code" data-v="${s.code}"><span class="code">${s.code}</span><span class="muted">${esc(s.name)}</span></button>`).join('')}</div></div>`+email+pass;
    btn='Criar conta de funcionário';
  }
  return `<form class="form" id="authForm" novalidate>${body}<button type="submit" class="btn primary lg block">${btn}</button></form>`;
}
const validEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
function passError(p){
  if(p.length<10) return 'A senha precisa ter pelo menos 10 caracteres.';
  if(!/[A-ZÀ-ÖØ-Þ]/.test(p)) return 'Inclua pelo menos uma letra maiúscula.';
  return '';
}
function validateField(id){
  const el=$('#'+id); if(!el) return '';
  const v=el.value.trim();
  switch(id){
    case 'f-name': return v.length<2?'Informe seu nome.':'';
    case 'f-email': return validEmail(v)?'':'Digite um e-mail válido, como nome@gmail.com.';
    case 'f-pass': return state.authMode==='register'?passError(el.value):(el.value?'':'Digite sua senha.');
    case 'f-store': return v.length<2?'Dê um nome para a sua loja.':'';
    case 'f-code': return !v?'Informe o código da empresa.':(findStoreByCode(v)?'':'Código não encontrado. Confira com o dono da loja.');
  }
  return '';
}
function setErr(id,msg){
  const el=$('#'+id), e=$('#e-'+id); if(!el) return;
  if(e) e.textContent=msg||'';
  el.classList.toggle('invalid',!!msg);
  el.setAttribute('aria-invalid',msg?'true':'false');
}
function updateRules(){
  const p=($('#f-pass')||{}).value||''; const r=$('#rules'); if(!r) return;
  $('[data-r="len"]',r).classList.toggle('ok',p.length>=10);
  $('[data-r="up"]',r).classList.toggle('ok',/[A-ZÀ-ÖØ-Þ]/.test(p));
  $('#cnt').textContent=Math.min(p.length,99)+'/10';
}
function submitAuth(){
  const role=state.authRole, mode=state.authMode, reg=mode==='register';
  const ids=reg?(role==='dono'?['f-name','f-email','f-pass','f-store']:['f-name','f-code','f-email','f-pass']):['f-email','f-pass'];
  let first=null;
  ids.forEach(id=>{const m=validateField(id);setErr(id,m);if(m&&!first)first=id;});
  if(first){$('#'+first).focus();return;}
  const v=id=>$('#'+id).value.trim();
  const email=v('f-email');
  if(role==='dono'){
    if(reg){
      state.owner={name:v('f-name'),email};
      state.stores.push({id:'s'+Date.now().toString(36),name:v('f-store'),type:'Loja nova',code:state.regCode,items:[],sales:[],isNew:true});
      state.regCode=uniqueCode();
      toast('Conta criada. A sua loja já tem um código exclusivo.');
    }else{ state.owner.email=email; }
    state.view='dono'; state.screen='stores'; render();
  }else{
    let storeId=state.employee.storeId;
    if(reg){
      const s=findStoreByCode(v('f-code')); storeId=s.id;
      state.employee={name:v('f-name'),email,storeId};
    }else{ state.employee.email=email; }
    state.view='func'; state.storeId=storeId; state.tab='estoque'; state.search=''; state.screen='app'; render();
    if(reg) toast('Conta criada. Você entrou direto na loja do código.');
  }
}

/* ===== ESCOLHA DE LOJA ===== */
function storeCard(s){
  const t=stockStats(s);
  return `<article class="card store-card">
    <button type="button" class="store-open" data-act="open-store" data-id="${s.id}">
      <span class="tile">${ic('store',24)}</span>
      <span class="s-name">${esc(s.name)}${s.isNew?' <span class="pill good">Nova</span>':''}</span>
      <span class="s-type">${esc(s.type)}</span>
      <span class="s-stats"><span><b>${int(s.items.length)}</b> itens</span><span><b>${int(t.pecas)}</b> peças</span>${t.sem+t.baixo?`<span class="warn-t"><b>${t.sem+t.baixo}</b> pedindo atenção</span>`:''}</span>
      <span class="s-go">Abrir estoque ${ic('arrow',16)}</span>
    </button>
    <div class="store-foot"><span class="muted">Código</span><code class="code">${s.code}</code><button type="button" class="btn sm" data-act="copy" data-v="${s.code}">${ic('copy',16)} Copiar</button></div>
  </article>`;
}
function renderStores(){
  const first=me().name.split(' ')[0];
  app.innerHTML=`
  <header class="topbar"><div class="wrap topbar-in">
    <div class="tb-brand">${brandMark(36)}</div>
    ${viewSwitch()}
    <button type="button" class="icon-btn" data-act="logout" aria-label="Sair" title="Sair">${ic('logout',20)}</button>
  </div></header>
  <main class="wrap page">
    <div class="page-head"><h1>Escolha sua loja</h1><p>Olá, ${esc(first)}. Toque em uma loja para abrir o estoque dela.</p></div>
    <div class="store-grid">
      ${state.stores.map(storeCard).join('')}
      <button type="button" class="store-new" data-act="new-store">${ic('plus',26)}<span>Criar nova loja</span><small>Gera um código novo e exclusivo</small></button>
    </div>
    <div class="card plan-bar"><div><strong>Plano ESTOQUEI</strong><p class="muted small">Informação do seu plano</p></div><div class="price">R$ 29,90<small> por mês</small></div></div>
  </main>`;
}
function openNewStore(){
  ctx={type:'store',code:uniqueCode()};
  openModal(`${modalHead('Criar nova loja')}
  <div class="modal-body">
    <p class="muted">Cada loja tem seu próprio estoque e um código exclusivo para a sua equipe.</p>
    <div class="field"><label for="n-name">Nome da loja</label><input id="n-name" class="input" type="text" placeholder="Ex.: Perfumaria Aroma"><div class="err" id="e-n-name"></div></div>
    <div class="field"><label for="n-type">Tipo de loja</label><input id="n-type" class="input" type="text" list="types" placeholder="Ex.: Roupas, Calçados, Cosméticos"><datalist id="types"><option value="Roupas"><option value="Calçados"><option value="Cosméticos"><option value="Papelaria"><option value="Eletrônicos"><option value="Acessórios"></datalist></div>
    <div class="field"><label for="n-code">Código da loja</label><div class="code-row"><input id="n-code" class="input" readonly value="${ctx.code}"><button type="button" class="btn" data-act="copy" data-v="${ctx.code}">${ic('copy',18)} Copiar</button></div><p class="hint">Gerado automaticamente. Os funcionários usam este código no cadastro.</p></div>
  </div>
  <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">Cancelar</button><button type="button" class="btn primary" data-act="create-store">Criar loja</button></div>`,'narrow');
}
function createStore(){
  const name=$('#n-name').value.trim();
  if(name.length<2){const e=$('#e-n-name');e.textContent='Dê um nome para a loja.';$('#n-name').classList.add('invalid');$('#n-name').focus();return;}
  const type=$('#n-type').value.trim()||'Loja';
  state.stores.push({id:'s'+Date.now().toString(36),name,type,code:ctx.code,items:[],sales:[],isNew:true});
  render(); toast(`Loja "${name}" criada com o código ${ctx.code}.`);
}

/* ===== APP ===== */
const TAB_NAMES={estoque:'Estoque',analise:'Análise',historico:'Histórico',suporte:'Suporte'};
function renderApp(){
  const st=curStore(); state.storeId=st.id;
  if(state.tab==='analise'&&!isOwner()) state.tab='estoque';
  const views={estoque:estoqueView,analise:analiseView,historico:historicoView,suporte:suporteView};
  app.innerHTML=`
  <header class="topbar"><div class="wrap topbar-in">
    <button type="button" class="icon-btn" data-act="open-menu" aria-label="Abrir menu" aria-controls="drawer" aria-expanded="false">${ic('menu',22)}</button>
    <div class="tb-title"><strong>${esc(st.name)}</strong><span>${TAB_NAMES[state.tab]}</span></div>
    ${viewSwitch()}
  </div></header>
  <main class="wrap page" id="main">${views[state.tab](st)}</main>
  ${drawerHtml(st)}`;
  if(state.tab==='estoque') paintItems();
  if(state.tab==='historico') paintHistory();
  if(state.tab==='suporte') paintMsgs();
}
function drawerHtml(st){
  const dono=isOwner(), u=me();
  const nav=[['estoque','box','Estoque']].concat(dono?[['analise','chart','Análise']]:[]).concat([['historico','receipt','Histórico'],['suporte','chat','Suporte']]);
  return `<div class="drawer-scrim" id="dScrim" data-act="close-menu"></div>
  <aside class="drawer" id="drawer" aria-label="Menu" inert>
    <div class="drawer-head">${brandMark(36)}<button type="button" class="icon-btn" data-act="close-menu" aria-label="Fechar menu">${ic('x',20)}</button></div>
    <div class="drawer-store">
      <strong>${esc(st.name)}</strong><span class="muted small">${esc(st.type)}</span>
      ${dono?`<div class="code-row"><input class="input code" readonly value="${st.code}" aria-label="Código da loja"><button type="button" class="btn sm" data-act="copy" data-v="${st.code}">${ic('copy',16)}</button></div><span class="hint">Código da loja para a sua equipe</span>`:`<span class="hint">Você é funcionário desta loja.</span>`}
    </div>
    <nav class="drawer-nav" aria-label="Seções">${nav.map(n=>`<button type="button" class="nav-item" data-act="nav" data-v="${n[0]}" ${state.tab===n[0]?'aria-current="page"':''}>${ic(n[1],20)}<span>${n[2]}</span></button>`).join('')}</nav>
    <div class="drawer-foot">
      <div class="plan"><div><strong>Plano ESTOQUEI</strong>${dono?'':'<p class="muted small">Plano da loja, gerenciado pelo dono.</p>'}</div><div class="price">R$ 29,90<small> por mês</small></div></div>
      ${dono?`<button type="button" class="btn block" data-act="switch-store">${ic('store',18)} Trocar de loja</button>`:''}
      <div class="who"><span class="avatar">${esc(initials(u.name))}</span><div><strong>${esc(u.name)}</strong><small>${dono?'Dono':'Funcionário'}</small></div></div>
      <button type="button" class="btn block" data-act="logout">${ic('logout',18)} Sair</button>
    </div>
  </aside>`;
}
function setMenu(open){
  const d=$('#drawer'), s=$('#dScrim'), b=$('[data-act="open-menu"]'); if(!d) return;
  d.classList.toggle('open',open); s.classList.toggle('open',open); d.inert=!open; b.setAttribute('aria-expanded',String(open));
  if(open){const n=$('.nav-item',d); if(n) n.focus();} else b.focus();
}

/* --- Estoque --- */
function kpisHtml(st){
  const s=stockStats(st), dono=isOwner();
  const k=(l,v,sub,tone)=>`<div class="card kpi ${tone||''}"><div class="kpi-l">${l}</div><div class="kpi-v">${v}</div><div class="kpi-s">${sub}</div></div>`;
  return k('Peças em estoque',int(s.pecas),`${int(st.items.length)} ${st.items.length===1?'item cadastrado':'itens cadastrados'}`)
    +k('Sem estoque',int(s.sem),'itens zerados',s.sem?'bad':'')
    +k('Estoque baixo',int(s.baixo),`itens com até ${LOW} peças`,s.baixo?'warn':'')
    +(dono?k(`Valor em estoque <span class="lock">${ic('lock',12)} Só dono</span>`,brl(s.valor),`Venda potencial ${brl(s.potencial)}`):'');
}
function estoqueView(st){
  return `<div class="page-head"><h1>Estoque</h1><p>Veja o que tem, o que está acabando e registre vendas.</p></div>
  <section class="kpis" id="kpis" aria-label="Visão geral do estoque">${kpisHtml(st)}</section>
  <div class="toolbar"><button type="button" class="btn primary lg" data-act="add-item">${ic('plus',20)} Adicionar novo item</button></div>
  <div class="searchbar">${ic('search',20)}<input id="q" class="input" type="search" placeholder="Pesquisar por nome, cor ou tamanho" value="${esc(state.search)}" autocomplete="off" aria-label="Pesquisar itens"></div>
  <div class="list-meta" id="listMeta"></div>
  <div class="items" id="itemsGrid"></div>`;
}
const stockPill=q=>q===0?'<span class="pill bad">Sem estoque</span>':q<=LOW?'<span class="pill warn">Estoque baixo</span>':'<span class="pill good">Em estoque</span>';
function itemCard(i){
  return `<article class="card item">
    <div class="thumb">${thumb(i)}</div>
    <div class="item-body">
      <div class="item-top"><h3>${esc(i.name)}</h3>${stockPill(i.qty)}</div>
      <div class="item-qty"><strong class="${i.qty===0?'t-bad':i.qty<=LOW?'t-warn':''}">${int(i.qty)}</strong><span>${i.qty===1?'peça':'peças'}</span><span class="pr">${brl(i.venda)}</span></div>
      <dl class="meta">
        <div><dt>Cores</dt><dd class="colors">${i.colors.map(c=>`<span class="col"><i style="background:${colorHex(c)}"></i>${esc(c)}</span>`).join('')}</dd></div>
        <div><dt>Tamanho</dt><dd>${i.sizes.map(esc).join(' · ')}</dd></div>
      </dl>
      <div class="item-act">
        ${i.qty===0
          ?`<button type="button" class="btn primary" data-act="restock" data-id="${i.id}">${ic('plus',18)} Repor estoque</button>`
          :`<button type="button" class="btn primary" data-act="sell" data-id="${i.id}">Vender</button><button type="button" class="btn sec" data-act="restock" data-id="${i.id}" aria-label="Repor estoque de ${esc(i.name)}" title="Repor estoque">${ic('plus',18)}<span class="act-t">Repor</span></button>`}
        <button type="button" class="btn sec" data-act="edit-item" data-id="${i.id}" aria-label="Editar ${esc(i.name)}" title="Editar item">${ic('edit',18)}<span class="act-t">Editar</span></button>
      </div>
    </div>
  </article>`;
}
function paintItems(){
  const st=curStore(), q=norm(state.search).trim();
  const list=st.items.filter(i=>!q||norm([i.name,i.colors.join(' '),i.sizes.join(' ')].join(' ')).includes(q));
  $('#listMeta').textContent=q?`${list.length} de ${st.items.length} itens`:`${st.items.length} ${st.items.length===1?'item':'itens'}`;
  const g=$('#itemsGrid');
  if(!st.items.length){g.innerHTML='<div class="empty"><strong>Nenhum item no estoque ainda</strong><span>Toque em "Adicionar novo item" para cadastrar o primeiro.</span></div>';return;}
  if(!list.length){g.innerHTML=`<div class="empty"><strong>Nada encontrado</strong><span>Nenhum item combina com "${esc(state.search)}".</span></div>`;return;}
  g.innerHTML=list.map(itemCard).join('');
}
function refreshEstoque(){
  if(state.tab!=='estoque'||!$('#kpis')) return;
  $('#kpis').innerHTML=kpisHtml(curStore()); paintItems();
}

/* --- Adicionar item --- */
const SIZE_GROUPS=[['Roupas',['PP','P','M','G','GG']],['Calçados',['34','35','36','37','38','39','40','41','42','43','44']],['Outros',['Único']]];
const SIZE_ALL=SIZE_GROUPS.reduce((a,g)=>a.concat(g[1]),[]);
function openAdd(id){
  const it=id?curStore().items.find(x=>x.id===id):null;
  editId=it?it.id:null;
  draft=it?{name:it.name,qty:String(it.qty),colors:it.colors.slice(),sizes:it.sizes.slice(),venda:String(it.venda),custo:String(it.custo),photos:it.photos.slice()}:{name:'',qty:'',colors:[],sizes:[],venda:'',custo:'',photos:[]};
  openModal(`${modalHead(it?'Editar item':'Adicionar novo item')}
  <div class="modal-body"><div class="form-grid">
    <div class="stack">
      <div class="field"><label for="a-name">Nome do item</label><input id="a-name" class="input" type="text" placeholder="Ex.: Camiseta Básica Algodão" maxlength="60" autocomplete="off"><div class="err" id="e-name"></div></div>
      <div class="field"><label for="a-qty">Quantidade em estoque</label><input id="a-qty" class="input" type="number" inputmode="numeric" min="0" step="1" placeholder="0"><div class="err" id="e-qty"></div></div>
      <div class="field"><span class="lbl" id="l-cor">Cor</span>
        <div class="color-add"><input id="a-colorText" class="input" type="text" maxlength="24" placeholder="Digite uma cor, ex.: Verde-água" aria-labelledby="l-cor"><button type="button" class="btn" data-act="add-color">Adicionar</button></div>
        <div class="palette" id="palette" role="group" aria-label="Paleta de cores"></div>
        <div class="chips" id="colorChips"></div>
        <div class="err" id="e-colors"></div></div>
      <div class="field"><span class="lbl">Tamanho</span><div id="sizeArea"></div><div class="err" id="e-sizes"></div></div>
      <div class="two">
        <div class="field"><label for="a-venda">Valor de venda</label><div class="money"><span>R$</span><input id="a-venda" class="input" type="number" inputmode="decimal" min="0" step="0.01" placeholder="0,00"></div><div class="err" id="e-venda"></div></div>
        <div class="field"><label for="a-custo">Valor de custo</label><div class="money"><span>R$</span><input id="a-custo" class="input" type="number" inputmode="decimal" min="0" step="0.01" placeholder="0,00"></div><div class="err" id="e-custo"></div></div>
      </div>
      <div class="field"><span class="lbl">Fotos do item</span>
        <input id="a-photos" class="sr" type="file" accept="image/*" multiple>
        <label class="drop" for="a-photos">${ic('image',24)}<span>Adicionar fotos (até 4)</span></label>
        <div class="photos" id="photoGrid"></div></div>
    </div>
    <aside class="summary" aria-label="Resumo do produto"><h3>Resumo do produto</h3><div id="summary"></div></aside>
  </div></div>
  <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">Cancelar</button><button type="button" class="btn primary" data-act="save-item">${it?'Salvar alterações':'Salvar'}</button></div>`);
  if(it){$('#a-name').value=draft.name;$('#a-qty').value=draft.qty;$('#a-venda').value=draft.venda;$('#a-custo').value=draft.custo;}
  paintColors(); paintSizes(); paintPhotos(); updateSummary();
}
function paintColors(){
  $('#palette').innerHTML=PALETTE.map(p=>{const on=draft.colors.some(c=>norm(c)===norm(p[0]));return `<button type="button" class="sw ${on?'on':''}" style="--c:${p[1]}" data-act="toggle-color" data-v="${p[0]}" aria-pressed="${on}" aria-label="${p[0]}" title="${p[0]}">${on?ic('check',16):''}</button>`;}).join('');
  $('#colorChips').innerHTML=draft.colors.map(c=>`<span class="chip"><i style="background:${colorHex(c)}"></i>${esc(c)}<button type="button" data-act="rm-color" data-v="${esc(c)}" aria-label="Remover ${esc(c)}">${ic('x',14)}</button></span>`).join('')||'<span class="muted small">Nenhuma cor escolhida.</span>';
}
function paintSizes(){
  $('#sizeArea').innerHTML=SIZE_GROUPS.map(g=>`<div class="size-group"><span>${g[0]}</span><div class="sizes">${g[1].map(s=>`<button type="button" class="sz" data-act="toggle-size" data-v="${s}" aria-pressed="${draft.sizes.includes(s)}">${s}</button>`).join('')}</div></div>`).join('');
}
function paintPhotos(){
  $('#photoGrid').innerHTML=draft.photos.map((p,i)=>`<div class="ph"><img src="${p}" alt="Foto ${i+1}">${i===0?'<span class="cover">Capa</span>':''}<button type="button" data-act="rm-photo" data-id="${i}" aria-label="Remover foto ${i+1}">${ic('x',14)}</button></div>`).join('');
}
function addColor(){
  const inp=$('#a-colorText'); let v=inp.value.trim(); if(!v) return;
  v=v.charAt(0).toUpperCase()+v.slice(1);
  const known=PALETTE.find(p=>norm(p[0])===norm(v)); if(known) v=known[0];
  if(!draft.colors.some(c=>norm(c)===norm(v))) draft.colors.push(v);
  inp.value=''; $('#e-colors').textContent=''; paintColors(); updateSummary();
}
function updateSummary(){
  const el=$('#summary'); if(!el||!draft) return;
  const d=draft, dono=isOwner();
  const q=Number(d.qty), hasQ=d.qty!==''&&Number.isInteger(q)&&q>=0;
  const venda=Number(d.venda), custo=Number(d.custo);
  const hasV=d.venda!==''&&venda>=0, hasC=d.custo!==''&&custo>=0;
  const dash='<span class="muted">—</span>';
  const cover=thumb({name:d.name,kind:'box',colors:d.colors,photos:d.photos});
  let rows=`<div><dt>Quantidade</dt><dd>${hasQ?int(q):dash}</dd></div>
    <div><dt>Cores</dt><dd>${d.colors.length?d.colors.map(esc).join(', '):dash}</dd></div>
    <div><dt>Tamanhos</dt><dd>${d.sizes.length?d.sizes.slice().sort((a,b)=>SIZE_ALL.indexOf(a)-SIZE_ALL.indexOf(b)).join(' · '):dash}</dd></div>
    <div><dt>Venda</dt><dd>${hasV?brl(venda):dash}</dd></div>
    <div><dt>Custo</dt><dd>${hasC?brl(custo):dash}</dd></div>
    <div><dt>Fotos</dt><dd>${d.photos.length?d.photos.length:dash}</dd></div>`;
  if(dono){
    const lucro=hasV&&hasC?venda-custo:null;
    const pct=lucro!==null&&venda>0?Math.round(lucro/venda*100):0;
    rows+=`<div><dt>Margem por peça</dt><dd>${lucro!==null?`${brl(lucro)} (${pct}%)`:dash}</dd></div>
    <div><dt>Valor em estoque</dt><dd>${hasQ&&hasC?brl(q*custo):dash}</dd></div>`;
  }
  el.innerHTML=`<div class="thumb">${cover}</div><div class="sname">${d.name.trim()?esc(d.name):'<span class="muted">Nome do item</span>'}</div>${hasQ?stockPill(q):''}<dl class="srows">${rows}</dl>`;
}
function saveItem(){
  const d=draft, errs={}, st=curStore();
  if(d.name.trim().length<2) errs.name='Dê um nome ao item.';
  const q=Number(d.qty); if(d.qty===''||!Number.isInteger(q)||q<0) errs.qty='Informe a quantidade em estoque (número inteiro).';
  if(!d.colors.length) errs.colors='Escolha ou digite ao menos uma cor.';
  if(!d.sizes.length) errs.sizes='Escolha ao menos um tamanho.';
  const venda=Number(d.venda); if(d.venda===''||!(venda>0)) errs.venda='Informe o valor de venda.';
  const custo=Number(d.custo); if(d.custo===''||!(custo>=0)) errs.custo='Informe o valor de custo.';
  const keys=['name','qty','colors','sizes','venda','custo'];
  keys.forEach(k=>{const e=$('#e-'+k); if(e) e.textContent=errs[k]||''; const inp=$('#a-'+k); if(inp) inp.classList.toggle('invalid',!!errs[k]);});
  const first=keys.find(k=>errs[k]);
  if(first){const t=$('#a-'+first)||$('#e-'+first); if(t){t.scrollIntoView({block:'center'}); if(t.focus&&$('#a-'+first)) t.focus();} return;}
  const data={name:d.name.trim(),colors:d.colors.slice(),sizes:d.sizes.slice().sort((a,b)=>SIZE_ALL.indexOf(a)-SIZE_ALL.indexOf(b)),qty:q,venda,custo,photos:d.photos.slice()};
  if(editId){
    const cur=st.items.find(x=>x.id===editId); if(cur) Object.assign(cur,data);
    editId=null; closeModal(); refreshEstoque(); toast('Alterações salvas.'); return;
  }
  st.items.unshift(Object.assign({id:'i'+(++itemSeq),kind:'box'},data));
  closeModal(); refreshEstoque(); toast('Item adicionado ao estoque.');
}
function fileToDataURL(file){
  return new Promise((res,rej)=>{
    const fr=new FileReader(); fr.onerror=()=>rej(fr.error);
    fr.onload=()=>{
      const img=new Image(); img.onerror=()=>res(fr.result);
      img.onload=()=>{
        try{
          const sc=Math.min(1,900/Math.max(img.width,img.height)); const c=document.createElement('canvas');
          c.width=Math.max(1,Math.round(img.width*sc)); c.height=Math.max(1,Math.round(img.height*sc));
          c.getContext('2d').drawImage(img,0,0,c.width,c.height); res(c.toDataURL('image/jpeg',.82));
        }catch(_){res(fr.result);}
      };
      img.src=fr.result;
    };
    fr.readAsDataURL(file);
  });
}

/* --- Vender --- */
const radios=(g,opts,val,lab)=>`<div class="opts" role="radiogroup" aria-labelledby="${lab}">${opts.map(o=>`<button type="button" role="radio" class="opt" aria-checked="${o===val}" data-act="pick" data-g="${g}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
function openSell(id){
  const st=curStore(), it=st.items.find(x=>x.id===id); if(!it||it.qty<1) return;
  ctx={type:'sell',id,qty:1,pay:'Pix',tipo:'Varejo',canal:'Presencial'};
  openModal(`${modalHead('Registrar venda')}
  <div class="modal-body">
    <div class="sell-item"><div class="thumb">${thumb(it)}</div><div><h3>${esc(it.name)}</h3><p class="muted small">${it.colors.map(esc).join(', ')} · ${it.sizes.map(esc).join(' · ')}</p><p><strong>${brl(it.venda)}</strong> cada · ${int(it.qty)} em estoque</p></div></div>
    <div class="field"><label for="s-qty">Quantidade a vender</label>
      <div class="stepper"><button type="button" class="icon-btn" data-act="qty-dec" aria-label="Diminuir">${ic('minus',18)}</button><input id="s-qty" class="input" type="text" inputmode="numeric" value="1"><button type="button" class="icon-btn" data-act="qty-inc" aria-label="Aumentar">${ic('plus',18)}</button></div>
      <div class="err" id="e-sqty"></div></div>
    <div class="field"><span class="lbl" id="l-pay">Forma de pagamento</span>${radios('pay',['Pix','Dinheiro','Cartão de crédito','Cartão de débito'],'Pix','l-pay')}</div>
    <div class="field"><span class="lbl" id="l-tipo">Tipo de venda</span>${radios('tipo',['Varejo','Atacado'],'Varejo','l-tipo')}</div>
    <div class="field"><span class="lbl" id="l-canal">Canal</span>${radios('canal',['Presencial','Online'],'Presencial','l-canal')}</div>
    <div class="total"><span>Total da venda</span><strong id="s-total">${brl(it.venda)}</strong></div>
  </div>
  <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">Cancelar</button><button type="button" class="btn primary" data-act="confirm-sell">Confirmar venda</button></div>`,'narrow');
}
function sellItem(){return curStore().items.find(x=>x.id===ctx.id);}
function setQty(n){
  const it=sellItem(); n=Math.max(1,Math.min(it.qty,n)); ctx.qty=n;
  $('#s-qty').value=n; $('#s-total').textContent=brl(it.venda*n); $('#e-sqty').textContent='';
}
function onQtyInput(val){
  const it=sellItem(), n=parseInt(val,10), e=$('#e-sqty');
  if(Number.isNaN(n)){ctx.qty=NaN;$('#s-total').textContent=brl(0);e.textContent='';return;}
  ctx.qty=n;
  e.textContent=n>it.qty?`Só há ${int(it.qty)} em estoque.`:(n<1?'Digite uma quantidade de 1 em diante.':'');
  $('#s-total').textContent=brl(it.venda*Math.max(0,Math.min(n,it.qty)));
}
function confirmSell(){
  const st=curStore(), it=sellItem(), q=ctx.qty; if(!it) return;
  const e=$('#e-sqty');
  if(!Number.isInteger(q)||q<1){e.textContent='Digite uma quantidade de 1 em diante.';$('#s-qty').focus();return;}
  if(q>it.qty){e.textContent=`Só há ${int(it.qty)} em estoque.`;$('#s-qty').focus();return;}
  it.qty-=q;
  st.sales.unshift({id:'v-'+Date.now(),ts:Date.now(),vendedor:me().name,papel:isOwner()?'Dono':'Equipe',pagamento:ctx.pay,itemId:it.id,itemName:it.name,qty:q,tipo:ctx.tipo,canal:ctx.canal,preco:it.venda,custo:it.custo,total:it.venda*q});
  closeModal(); refreshEstoque();
  toast(`Venda registrada: ${q}× ${it.name}.`+(it.qty===0?' Item sem estoque agora.':it.qty<=LOW?' Estoque baixo.':''));
}

/* --- Repor estoque --- */
function restockItem(){return curStore().items.find(x=>x.id===ctx.id);}
function openRestock(id){
  const it=curStore().items.find(x=>x.id===id); if(!it) return;
  ctx={type:'restock',id,add:1};
  openModal(`${modalHead('Repor estoque')}
  <div class="modal-body">
    <div class="sell-item"><div class="thumb">${thumb(it)}</div><div><h3>${esc(it.name)}</h3><p class="muted small">${it.colors.map(esc).join(', ')} · ${it.sizes.map(esc).join(' · ')}</p><p>${stockPill(it.qty)} <span class="muted small">${int(it.qty)} em estoque agora</span></p></div></div>
    <div class="field"><label for="r-qty">Quantidade que chegou</label>
      <div class="stepper"><button type="button" class="icon-btn" data-act="rs-dec" aria-label="Diminuir">${ic('minus',18)}</button><input id="r-qty" class="input" type="text" inputmode="numeric" value="1"><button type="button" class="icon-btn" data-act="rs-inc" aria-label="Aumentar">${ic('plus',18)}</button></div>
      <div class="quick" role="group" aria-label="Quantidades rápidas">${[5,10,20,50].map(n=>`<button type="button" class="opt" data-act="rs-chip" data-v="${n}" aria-label="Definir ${n} peças">${n}</button>`).join('')}</div>
      <div class="err" id="e-rqty"></div></div>
    <div class="field"><label for="r-custo">Novo valor de custo (opcional)</label><div class="money"><span>R$</span><input id="r-custo" class="input" type="number" inputmode="decimal" min="0" step="0.01" placeholder="${it.custo.toFixed(2).replace('.',',')}"></div><p class="hint">Preencha só se pagou um preço diferente nesta compra.</p></div>
    <div class="total"><span>Novo total em estoque</span><strong id="r-total">${int(it.qty+1)} ${it.qty+1===1?'peça':'peças'}</strong></div>
  </div>
  <div class="modal-foot"><button type="button" class="btn" data-act="close-modal">Cancelar</button><button type="button" class="btn primary" data-act="confirm-restock">Repor estoque</button></div>`,'narrow');
}
function paintRestockTotal(n){
  const it=restockItem(), t=it.qty+(Number.isInteger(n)&&n>0?n:0);
  $('#r-total').textContent=`${int(t)} ${t===1?'peça':'peças'}`;
}
function setRestock(n){
  n=Math.max(1,Math.min(99999,n)); ctx.add=n; $('#r-qty').value=n; $('#e-rqty').textContent=''; paintRestockTotal(n);
}
function onRestockInput(val){
  const n=parseInt(val,10);
  if(Number.isNaN(n)||n<1){ctx.add=NaN;$('#e-rqty').textContent=val===''?'':'Digite uma quantidade de 1 em diante.';paintRestockTotal(0);return;}
  ctx.add=n; $('#e-rqty').textContent=''; paintRestockTotal(n);
}
function confirmRestock(){
  const it=restockItem(); if(!it) return;
  const n=ctx.add;
  if(!Number.isInteger(n)||n<1){$('#e-rqty').textContent='Digite uma quantidade de 1 em diante.';$('#r-qty').focus();return;}
  const raw=$('#r-custo').value.trim();
  if(raw!==''){const c=Number(raw); if(!(c>=0)){toast('Confira o valor de custo.');$('#r-custo').focus();return;} it.custo=c;}
  it.qty+=n; closeModal(); refreshEstoque();
  toast(`Estoque reposto: +${int(n)} em ${it.name}. Agora são ${int(it.qty)} ${it.qty===1?'peça':'peças'}.`);
}

/* --- Análise (só dono) --- */
function analiseView(st){
  const a=analysis(st), s=stockStats(st);
  const kp=(l,v,sub)=>`<div class="card kpi"><div class="kpi-l">${l}</div><div class="kpi-v">${v}</div><div class="kpi-s">${sub}</div></div>`;
  const top=a.top[0];
  return `<div class="page-head"><h1>Análise</h1><p>Resultados de ${esc(st.name)}. Só o dono vê esta página.</p></div>
  <section class="kpis wide" aria-label="Indicadores">
    ${kp('Quantidade vendida',int(a.vendas),'vendas registradas')}
    ${kp('Peças vendidas',int(a.pecas),`${brl(a.fat)} faturados`)}
    ${kp('Quantidade a vender',int(s.pecas),'peças em estoque agora')}
    ${kp('Peça mais vendida',top?`<span class="kpi-name">${esc(top[0])}</span>`:'—',top?`${int(top[1])} peças vendidas`:'Sem vendas ainda')}
    ${kp('Lucro estimado',brl(a.lucro),`Margem de ${a.margem}% sobre as vendas`)}
    ${kp('Dinheiro total do estoque',brl(s.valor),'Peças em estoque ao preço de custo')}
  </section>
  <div class="an-grid">
    <section class="card chart-card" id="chartCard" aria-label="Vendas por mês">${chartInner(st)}</section>
    <section class="card top-card"><h2>Mais vendidos</h2>${a.top.length?`<ol class="rank">${a.top.slice(0,5).map(t=>`<li><div class="rk-top"><span class="rk-n">${esc(t[0])}</span><span class="rk-q">${int(t[1])} peças</span></div><div class="rk-bar"><i style="width:${(t[1]/a.top[0][1]*100).toFixed(1)}%"></i></div></li>`).join('')}</ol>`:'<p class="muted" style="margin-top:12px">As peças mais vendidas aparecem aqui depois da primeira venda.</p>'}</section>
  </div>`;
}
function chartInner(st){
  const mt=state.chartMetric, ms=monthsWindow(st.sales);
  const vals=ms.map(m=>mt==='pecas'?m.pecas:m.fat), max=Math.max.apply(null,vals.concat([0]));
  const t=niceTop(max,mt==='pecas'), best=vals.indexOf(max);
  const fmt=v=>mt==='pecas'?int(v):compact(v);
  const full=v=>mt==='pecas'?`${int(v)} peças`:brl(v);
  const ticks=[0,1,2,3,4];
  return `<div class="chart-head"><div><h2>Vendas por mês</h2><p class="muted">${max>0?`Melhor mês: ${MONTHS_FULL[ms[best].m]} de ${ms[best].y}, com ${full(max)}.`:'Ainda sem vendas registradas.'}</p></div>
    <div class="seg" role="group" aria-label="Métrica do gráfico"><button type="button" data-act="metric" data-v="pecas" aria-pressed="${mt==='pecas'}">Peças</button><button type="button" data-act="metric" data-v="fat" aria-pressed="${mt==='fat'}">Faturamento</button></div></div>
  <div class="chart" style="--n:${ms.length}" role="img" aria-label="Gráfico de barras com as vendas dos últimos ${ms.length} meses">
    <div class="yax">${ticks.map(i=>`<span style="bottom:${i*25}%">${fmt(t.step*i)}</span>`).join('')}</div>
    <div class="plot"><div class="gl">${ticks.map(i=>`<i style="bottom:${i*25}%"></i>`).join('')}</div>
      <div class="bars">${ms.map((m,i)=>`<div class="col ${max>0&&i===best?'is-max':''}" title="${MONTHS_FULL[m.m]} de ${m.y}: ${full(vals[i])}"><div class="bar" style="height:${(vals[i]/t.cap*100).toFixed(1)}%">${vals[i]>0?`<span class="bv">${fmt(vals[i])}</span>`:''}</div></div>`).join('')}</div></div>
    <div class="xax">${ms.map(m=>`<span>${MONTHS[m.m]}<small>${String(m.y).slice(2)}</small></span>`).join('')}</div>
  </div>
  <p class="unit">${mt==='pecas'?'Peças vendidas por mês.':'Faturamento por mês, em reais (k = mil).'}</p>`;
}

/* --- Histórico --- */
function historicoView(st){
  return `<div class="page-head"><h1>Histórico</h1><p>Todas as vendas de ${esc(st.name)}, da mais recente para a mais antiga.</p></div>
  <div class="searchbar">${ic('search',20)}<input id="h-q" class="input" type="search" placeholder="Pesquisar por data, vendedor, peça, pagamento ou canal" value="${esc(state.histSearch)}" autocomplete="off" aria-label="Pesquisar no histórico"></div>
  <div class="list-meta" id="hMeta"></div>
  <section class="card table-card"><div id="hTable"></div></section>
  <div class="more" id="hMore"></div>`;
}
function paintHistory(){
  const st=curStore(), q=norm(state.histSearch).trim();
  const list=q?st.sales.filter(s=>saleBlob(s).includes(q)):st.sales;
  const shown=list.slice(0,state.histLimit);
  $('#hMeta').textContent=q?`${list.length} de ${st.sales.length} vendas`:`${st.sales.length} ${st.sales.length===1?'venda':'vendas'}`;
  if(!shown.length){
    $('#hTable').innerHTML=`<div class="empty plain"><strong>${st.sales.length?'Nada encontrado':'Nenhuma venda ainda'}</strong><span>${st.sales.length?`Nenhuma venda combina com "${esc(state.histSearch)}".`:'As vendas feitas no estoque aparecem aqui.'}</span></div>`;
  }else{
    $('#hTable').innerHTML=`<table class="sales"><thead><tr><th>Data e hora</th><th>Vendedor</th><th>Peça</th><th class="num">Qtd.</th><th>Pagamento</th><th>Tipo</th><th>Canal</th><th class="num">Valor</th></tr></thead><tbody>${shown.map(s=>{const p=dParts(s.ts);const it=st.items.find(x=>x.id===s.itemId)||{name:s.itemName,kind:'box',colors:[],photos:[]};return `<tr>
      <td data-l="Data e hora"><div><span class="dt">${p.w}, ${p.d}</span> <span class="tm">${p.t}</span></div></td>
      <td data-l="Vendedor"><div>${esc(s.vendedor)} <span class="role">${s.papel}</span></div></td>
      <td data-l="Peça"><div class="pc"><span class="hthumb" aria-hidden="true">${thumb(it)}</span><span>${esc(s.itemName)}</span></div></td>
      <td data-l="Quantidade" class="num">${int(s.qty)}</td>
      <td data-l="Pagamento">${esc(s.pagamento)}</td>
      <td data-l="Tipo">${s.tipo}</td>
      <td data-l="Canal">${s.canal}</td>
      <td data-l="Valor" class="num">${brl(s.total)}</td></tr>`;}).join('')}</tbody></table>`;
  }
  $('#hMore').innerHTML=list.length>shown.length?`<button type="button" class="btn" data-act="hist-more">Mostrar mais ${Math.min(30,list.length-shown.length)} vendas</button>`:'';
}

/* --- Suporte --- */
function suporteView(){
  return `<div class="page-head"><h1>Suporte</h1><p>Fale com a equipe do ESTOQUEI. Respondemos por aqui.</p></div>
  <div class="support">
    <section class="card chat" aria-label="Conversa com o suporte">
      <div class="chat-head"><span class="avatar">${ic('chat',18)}</span><div><strong>Equipe ESTOQUEI</strong><span class="muted small">Atendimento por mensagem</span></div></div>
      <div class="msgs" id="msgs" role="log" aria-live="polite"></div>
      <form class="composer" id="chatForm"><label class="sr" for="chatIn">Mensagem para o suporte</label><textarea id="chatIn" class="input" rows="1" placeholder="Escreva sua dúvida..."></textarea><button type="submit" class="btn primary" aria-label="Enviar mensagem">${ic('send',20)}<span class="hide-sm">Enviar</span></button></form>
    </section>
    <aside class="card bot"><span class="pill soon">Em breve</span><h3>Assistente virtual</h3><p>Um chatbot vai responder as dúvidas mais comuns na hora, a qualquer horário. A equipe continua disponível para o resto.</p><div class="bot-mock" aria-hidden="true"><input class="input" disabled placeholder="Pergunte ao assistente"><button type="button" class="btn" disabled>${ic('bot',20)}</button></div></aside>
  </div>`;
}
function paintMsgs(){
  const el=$('#msgs'); if(!el) return;
  const hm=ts=>{const d=new Date(ts);return `${pad(d.getHours())}:${pad(d.getMinutes())}`;};
  el.innerHTML=state.chat.map(m=>m.from==='note'?`<div class="note">${esc(m.text)}</div>`:`<div class="msg ${m.from}"><div class="b">${esc(m.text).replace(/\n/g,'<br>')}</div><time>${m.from==='me'?'Enviada · ':'Equipe · '}${hm(m.ts)}</time></div>`).join('');
  el.scrollTop=el.scrollHeight;
}
function sendChat(){
  const inp=$('#chatIn'); const text=inp.value.trim(); if(!text) return;
  const first=!state.chat.some(m=>m.from==='me');
  state.chat.push({from:'me',text,ts:Date.now()});
  if(first) state.chat.push({from:'note',text:'Mensagem enviada para a equipe. A resposta aparece nesta conversa.',ts:Date.now()});
  inp.value=''; inp.style.height=''; paintMsgs(); inp.focus();
}

/* ---------- ações ---------- */
function setView(v){
  if(state.view===v) return;
  state.view=v;
  if(v==='func'){
    state.storeId=state.employee.storeId; state.screen='app'; if(state.tab==='analise') state.tab='estoque';
    toast('Visão de funcionário: só a loja do código, sem Análise e sem valor em estoque.');
  }else{
    toast('Visão de dono: todas as lojas, Análise e valor em estoque.');
  }
  render();
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]'); if(!t) return;
  const act=t.dataset.act, v=t.dataset.v, id=t.dataset.id;
  switch(act){
    case 'auth-role': state.authRole=v; render(); break;
    case 'auth-mode': state.authMode=v; if(v==='register') state.regCode=state.regCode||uniqueCode(); render(); break;
    case 'toggle-pass':{const i=$('#f-pass');const show=i.type==='password';i.type=show?'text':'password';t.innerHTML=ic(show?'eyeoff':'eye',20);t.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha');break;}
    case 'demo-fill':{$('#f-email').value=state.authRole==='dono'?'rafael@gmail.com':'camila@gmail.com';$('#f-pass').value='Estoquei2026';['f-email','f-pass'].forEach(k=>setErr(k,''));break;}
    case 'fill-code':{const i=$('#f-code');i.value=v;setErr('f-code','');i.focus();break;}
    case 'copy': copyCode(v,t); break;
    case 'set-view': setView(v); break;
    case 'open-menu': setMenu(true); break;
    case 'close-menu': setMenu(false); break;
    case 'nav': state.tab=v; render(); break;
    case 'switch-store': state.screen='stores'; render(); break;
    case 'logout': state.screen='auth'; state.authMode='login'; render(); break;
    case 'open-store': state.storeId=id; state.tab='estoque'; state.search=''; state.histSearch=''; state.histLimit=30; state.screen='app'; render(); break;
    case 'new-store': openNewStore(); break;
    case 'create-store': createStore(); break;
    case 'add-item': openAdd(); break;
    case 'close-modal': closeModal(); break;
    case 'save-item': saveItem(); break;
    case 'toggle-color':{const i=draft.colors.findIndex(c=>norm(c)===norm(v));if(i>=0)draft.colors.splice(i,1);else draft.colors.push(v);$('#e-colors').textContent='';paintColors();updateSummary();break;}
    case 'add-color': addColor(); break;
    case 'rm-color':{draft.colors=draft.colors.filter(c=>c!==v);paintColors();updateSummary();break;}
    case 'toggle-size':{const i=draft.sizes.indexOf(v);if(i>=0)draft.sizes.splice(i,1);else draft.sizes.push(v);$('#e-sizes').textContent='';paintSizes();updateSummary();break;}
    case 'rm-photo': draft.photos.splice(Number(id),1); paintPhotos(); updateSummary(); break;
    case 'sell': openSell(id); break;
    case 'qty-dec': setQty((Number.isNaN(ctx.qty)?1:ctx.qty)-1); break;
    case 'qty-inc': setQty((Number.isNaN(ctx.qty)?0:ctx.qty)+1); break;
    case 'pick':{const g=t.dataset.g;ctx[g]=v;$$('[data-g="'+g+'"]',modalEl).forEach(b=>b.setAttribute('aria-checked',String(b===t)));break;}
    case 'confirm-sell': confirmSell(); break;
    case 'restock': openRestock(id); break;
    case 'edit-item': openAdd(id); break;
    case 'rs-dec': setRestock((Number.isNaN(ctx.add)?2:ctx.add)-1); break;
    case 'rs-inc': setRestock((Number.isNaN(ctx.add)?0:ctx.add)+1); break;
    case 'rs-chip': setRestock(Number(v)); break;
    case 'confirm-restock': confirmRestock(); break;
    case 'hist-more': state.histLimit+=30; paintHistory(); break;
    case 'metric': state.chartMetric=v; $('#chartCard').innerHTML=chartInner(curStore()); break;
  }
});
document.addEventListener('input',e=>{
  const el=e.target, id=el.id||'';
  if(id==='q'){state.search=el.value;paintItems();return;}
  if(id==='h-q'){state.histSearch=el.value;state.histLimit=30;paintHistory();return;}
  if(id==='chatIn'){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,140)+'px';return;}
  if(id==='s-qty'){onQtyInput(el.value);return;}
  if(id==='r-qty'){onRestockInput(el.value);return;}
  if(id==='n-name'){el.classList.remove('invalid');$('#e-n-name').textContent='';return;}
  if(id.indexOf('a-')===0&&draft){
    const k={'a-name':'name','a-qty':'qty','a-venda':'venda','a-custo':'custo'}[id];
    if(k){draft[k]=el.value;el.classList.remove('invalid');const er=$('#e-'+k);if(er)er.textContent='';updateSummary();}
    return;
  }
  if(id.indexOf('f-')===0){
    if(id==='f-code') el.value=el.value.toUpperCase();
    if(id==='f-pass') updateRules();
    if(el.getAttribute('aria-invalid')==='true') setErr(id,validateField(id));
  }
});
document.addEventListener('focusout',e=>{
  const el=e.target, id=el.id||'';
  if(id.indexOf('f-')===0&&id!=='f-gen'&&el.value.trim()) setErr(id,validateField(id));
  if(id==='s-qty'&&modalEl&&ctx.type==='sell'){ if(Number.isNaN(ctx.qty)||ctx.qty<1) setQty(1); else if(ctx.qty>sellItem().qty) setQty(sellItem().qty); }
  if(id==='r-qty'&&modalEl&&ctx.type==='restock'){ if(Number.isNaN(ctx.add)||ctx.add<1) setRestock(1); }
});
document.addEventListener('change',async e=>{
  if(e.target.id!=='a-photos'||!draft) return;
  const files=Array.from(e.target.files).filter(f=>f.type.indexOf('image/')===0);
  const room=4-draft.photos.length;
  if(files.length>room) toast('Máximo de 4 fotos por item.');
  for(const f of files.slice(0,Math.max(0,room))){
    try{ draft.photos.push(await fileToDataURL(f)); }catch(_){ toast('Não foi possível ler a foto '+f.name+'.'); }
  }
  e.target.value=''; if(!draft) return; paintPhotos(); updateSummary();
});
document.addEventListener('submit',e=>{
  e.preventDefault();
  if(e.target.id==='authForm') submitAuth();
  else if(e.target.id==='chatForm') sendChat();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ if(modalEl) closeModal(); else if($('#drawer.open')) setMenu(false); return; }
  if(e.key==='Tab'&&modalEl){
    const f=$$('button:not([disabled]),input:not([disabled]):not([type=file]),select,textarea',modalEl);
    if(!f.length) return;
    const a=f[0], z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
    return;
  }
  if(e.key==='Enter'&&e.target.id==='a-colorText'){e.preventDefault();addColor();return;}
  if(e.key==='Enter'&&!e.shiftKey&&e.target.id==='chatIn'){e.preventDefault();sendChat();}
});

state.regCode=uniqueCode();
render();
})();
