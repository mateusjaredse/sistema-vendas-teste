// Navegação da casca principal do app: troca de páginas e alternância Sistema/Dashboard.

// ── NAVEGAÇÃO ─────────────────────────────────────────────────────────────
function resetFrameToDefaultState(page){
  const frame=page?.querySelector?.("iframe");
  if(!frame)return;
  try{
    if(typeof frame.contentWindow?.resetDashboardPageState==="function"){
      frame.contentWindow.resetDashboardPageState();
      return;
    }
  }catch(_){}
  try{
    frame.contentWindow?.postMessage({type:"caio-reset-page-state"},"*");
  }catch(_){}
}

function resetPageOnOpen(pageKey,page,previousPageId){
  if(previousPageId===page?.id)return;
  if(typeof window.fecharEstadosTemporariosSistema==="function"){
    window.fecharEstadosTemporariosSistema();
  }
  if(pageKey.startsWith("dashboard")){
    resetFrameToDefaultState(page);
    return;
  }
  if(typeof window.resetSistemaPageState==="function"){
    window.resetSistemaPageState(pageKey);
  }
}

function syncDashboardFrameActivity(){
  document.querySelectorAll(".page").forEach(page=>{
    const frame=page.querySelector?.("iframe");
    if(!frame?.contentWindow)return;
    const active=page.classList.contains("active")&&page.style.display!=="none";
    try{
      frame.contentWindow.postMessage({type:"caio-page-activity",active},"*");
    }catch(_){}
  });
}

function caioBroadcastDataChange(detail){
  const payload={type:"caio-data-changed",at:Date.now(),detail:detail||{}};
  try{localStorage.setItem("caio-data-version",String(payload.at));}catch(_){}
  document.querySelectorAll("iframe").forEach(frame=>{
    try{frame.contentWindow?.postMessage(payload,"*");}catch(_){}
  });
}
window.caioBroadcastDataChange=caioBroadcastDataChange;
window.addEventListener("storage",event=>{
  if(event.key!=="caio-data-version")return;
  const payload={type:"caio-data-changed",at:Date.now(),detail:{source:"storage"}};
  document.querySelectorAll("iframe").forEach(frame=>{
    try{frame.contentWindow?.postMessage(payload,"*");}catch(_){}
  });
});

function caioLogout(event){
  if(event)event.preventDefault();
  ["sb_token","sb_refresh_token"].forEach(key=>{
    try{sessionStorage.removeItem(key);}catch(_){}
    try{localStorage.removeItem(key);}catch(_){}
  });
  window.location.href="login.html";
}
window.caioLogout=caioLogout;

function showPage(p,el){
  const previousPageId=document.querySelector(".page.active")?.id||"";
  document.querySelectorAll(".page").forEach(x=>{x.classList.remove("active");x.style.display="none";});
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
  const pg=document.getElementById("page-"+p);
  if(!pg)return;
  resetPageOnOpen(p,pg,previousPageId);
  pg.classList.add("active");
  const app=document.getElementById("appShell");
  pg.style.display=(p.startsWith("dashboard")||(app&&app.classList.contains("mode-system")))?"flex":"block";
  if(el)el.classList.add("active");
  requestAnimationFrame(syncDashboardFrameActivity);
  if(p==="historico")carregarHistorico();
  if(p==="cadastro"){
    renderClientes(todosClientes);
    if(typeof renderMetas==="function")renderMetas(todasMetas||[]);
  }
}

// ── SVGs DO BOTÃO S/D ─────────────────────────────────────────────────────
const SVG_GRID = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3"  y="3"  width="7" height="7" rx="1"/>
  <rect x="14" y="3"  width="7" height="7" rx="1"/>
  <rect x="14" y="14" width="7" height="7" rx="1"/>
  <rect x="3"  y="14" width="7" height="7" rx="1"/>
</svg>`;

const SVG_LAYERS = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;

function syncBodyModeClasses(){
  const app=document.getElementById("appShell");
  const isSystem=!!app&&app.classList.contains("mode-system");
  document.body.classList.toggle("mode-system-body",isSystem);
  document.body.classList.toggle("mode-dashboard-body",!isSystem);
}

function syncResponsiveScale(){
  const baseWidth=1920;
  const baseHeight=1080;
  const minScale=.7111;
  const screenWidth=Math.max(0,Math.round(window.screen?.width||0));
  const screenHeight=Math.max(0,Math.round(window.screen?.height||0));
  const viewportWidth=Math.max(1,Math.round(document.documentElement.clientWidth||window.innerWidth||baseWidth));
  const viewportHeight=Math.max(1,Math.round(document.documentElement.clientHeight||window.innerHeight||baseHeight));
  const referenceWidth=screenWidth||viewportWidth;
  const referenceHeight=screenHeight||viewportHeight;
  let nextScale=Math.min(1,Math.max(minScale,Math.min(referenceWidth/baseWidth,referenceHeight/baseHeight)));
  if(nextScale>.98&&viewportWidth<=1500&&viewportHeight<=850){
    nextScale=Math.min(1,Math.max(minScale,Math.min(viewportWidth/baseWidth,viewportHeight/baseHeight)));
  }
  const root=document.documentElement;
  const scaleText=nextScale.toFixed(4);
  const setPx=(name,value)=>root.style.setProperty(name,`${Math.round(value*nextScale)}px`);
  root.style.setProperty("--app-scale",scaleText);
  root.style.setProperty("--app-width",`${Math.ceil(viewportWidth/nextScale)}px`);
  root.style.setProperty("--app-height",`${Math.ceil(viewportHeight/nextScale)}px`);
  setPx("--ai-size",50);
  setPx("--ai-hover-size",54);
  setPx("--ai-active-size",51);
  setPx("--ai-glow",10);
  setPx("--ai-left-gap",86);
  setPx("--ai-top-gap",62);
  setPx("--ai-panel-width",400);
  setPx("--ai-panel-height",700);
  setPx("--ai-panel-bottom",60);
  setPx("--ai-panel-offset",8);
  root.style.setProperty("--ai-badge-font",`${Math.max(7,Math.round(9*nextScale))}px`);
  root.style.setProperty("--ai-panel-scale",scaleText);
  root.style.setProperty("--ai-panel-closed-scale",(nextScale*.98).toFixed(4));
  document.body.classList.toggle("is-responsive-scaled",nextScale<.999);
  document.querySelectorAll("iframe").forEach(frame=>{
    try{
      const doc=frame.contentDocument;
      if(doc?.documentElement){
        doc.documentElement.style.setProperty("--app-scale",scaleText);
        doc.body?.classList.toggle("is-responsive-scaled",nextScale<.999);
      }
    }catch(_){}
    try{
      frame.contentWindow?.postMessage({type:"caio-responsive-scale",scale:nextScale},"*");
    }catch(_){}
  });
}

window.addEventListener("resize",()=>{
  requestAnimationFrame(syncResponsiveScale);
});
window.visualViewport?.addEventListener("resize",()=>{
  requestAnimationFrame(syncResponsiveScale);
});
window.addEventListener("load",syncResponsiveScale);
window.addEventListener("load",syncDashboardFrameActivity);

syncResponsiveScale();
syncBodyModeClasses();

// ── ÓRBITA DOS QUADRADOS (hover no modo sistema) ──────────────────────────
(function(){
  const CX=12, CY=12, HALF=3.5;
  const ORBIT_R     = 7.78;  // raio original (posição de repouso)
  const EXPAND_R    = 10.5;  // raio expandido — leve afastamento antes de girar
  const SPEED       = 0.2;   // GRAUS POR FRAME (0.2 deixa o giro bem lento e suave)
  const BASE_ANGLES = [-135, -45, 45, 135];
  const DEFAULTS    = [[3,3],[14,3],[14,14],[3,14]];

  let rafId=null, angle=0, expanding=false, orbiting=false;

  function calcOrbit(a, r){
    return BASE_ANGLES.map((ba)=>{
      const rad=(ba+a)*Math.PI/180;
      return [CX+Math.cos(rad)*r-HALF, CY+Math.sin(rad)*r-HALF];
    });
  }

  function setRects(btn, positions){
    [...btn.querySelectorAll('rect')].forEach((r,i)=>{
      r.setAttribute('x', positions[i][0].toFixed(3));
      r.setAttribute('y', positions[i][1].toFixed(3));
    });
  }

  // Desativa/Ativa as transições CSS e garante visibilidade fora das bordas
  function setTransitions(btn, enable) {
    // Evita o corte: Força o botão e o SVG interno a mostrarem elementos fora da borda
    btn.style.overflow = 'visible';
    const svg = btn.querySelector('svg');
    if (svg) svg.style.overflow = 'visible';

    [...btn.querySelectorAll('rect')].forEach((r) => {
      r.style.transition = enable ? '' : 'none';
    });
  }

  function startOrbit(btn){
    if(orbiting || expanding) return;
    expanding=true;
    angle = 0; // Reseta o ângulo para iniciar sempre do mesmo ponto de expansão

    // Prepara o terreno (habilita transição de expansão e remove cortes de borda)
    setTransitions(btn, true);
    
    // Passo 1: move para raio expandido (CSS cuida do fade/ease de afastamento)
    setRects(btn, calcOrbit(angle, EXPAND_R));

    // Passo 2: após a transição (300ms), desliga o CSS transition e começa a girar
    setTimeout(()=>{
      if(!expanding) return; // mouseleave antes de terminar a expansão
      expanding=false;
      orbiting=true;

      // Desativa o CSS transition para o requestAnimationFrame fluir perfeitamente
      setTransitions(btn, false);

      function tick(){
        if(!orbiting) return;
        angle += SPEED; // Incremento bem menor por frame
        setRects(btn, calcOrbit(angle, EXPAND_R));
        rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    }, 320);
  }

  function stopOrbit(btn){
    expanding=false;
    orbiting=false;
    if(rafId){ cancelAnimationFrame(rafId); rafId=null; }
    angle=0;
    
    // Reativa a transição para que a volta ao grid original (DEFAULTS) seja suave
    setTransitions(btn, true);
    
    requestAnimationFrame(() => {
      setRects(btn, DEFAULTS);
    });
  }

  function bindOrbit(btn){
    btn.addEventListener('mouseenter', ()=>{
      const app=document.getElementById('appShell');
      if(app && app.classList.contains('mode-system')) startOrbit(btn);
    });
    btn.addEventListener('mouseleave', ()=> stopOrbit(btn));
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const btn=document.getElementById('sd-toggle');
    if(btn) bindOrbit(btn);
  });

  window._bindSdOrbit = bindOrbit;
})();

// ── ALTERNÂNCIA SISTEMA / DASHBOARD ───────────────────────────────────────
function syncPainelGeralGrid(){
  const frame=document.getElementById("iframe-dashboard");
  if(!frame)return;
  const appScale=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--app-scale"))||1;
  const layoutWidth=window.innerWidth/appScale;
  const miniSidebarPadding=104;
  const openSidebarPadding=272;
  const painelHorizontalPadding=48;
  const painelGridGap=14;
  const reportMinWidth=280;
  const miniGridWidth=Math.max(0,layoutWidth-miniSidebarPadding-painelHorizontalPadding-painelGridGap);
  const openGridWidth=Math.max(0,layoutWidth-openSidebarPadding-painelHorizontalPadding-painelGridGap);
  const naturalReportWidth=Math.max(400,miniGridWidth*(.42/1.42));
  const naturalLeftWidth=Math.max(0,miniGridWidth-naturalReportWidth);
  const leftWidth=Math.max(0,Math.round(Math.min(naturalLeftWidth,Math.max(0,openGridWidth-reportMinWidth))));
  const template=`minmax(0,${leftWidth}px) minmax(${reportMinWidth}px,1fr)`;

  try{
    if(frame.contentDocument){
      frame.contentDocument.documentElement.style.setProperty("--pg-grid-template",template);
    }
  }catch(_){
    // Em arquivo local, alguns navegadores bloqueiam acesso direto ao iframe.
  }

  if(frame.contentWindow){
    frame.contentWindow.postMessage({type:"painel-geral-layout",template,leftWidth},"*");
  }
}

function toggleMode(){
  const app=document.getElementById("appShell");
  const btn=document.getElementById("sd-toggle");
  const goingSystem=app.classList.contains("mode-dashboard");
  app.classList.toggle("mode-dashboard",!goingSystem);
  app.classList.toggle("mode-system",goingSystem);
  syncBodyModeClasses();
  if(window.syncSidebarMode) window.syncSidebarMode();

  btn.innerHTML = goingSystem ? SVG_GRID : SVG_LAYERS;

  if(goingSystem && window._bindSdOrbit) window._bindSdOrbit(btn);

  showPage(goingSystem?"nova-venda":"dashboard",document.querySelector(goingSystem?".system-nav .nav-item":".dashboard-nav .nav-item"));
  syncPainelGeralGrid();
}

// ── SIDEBAR EXPAND/COLLAPSE ────────────────────────────────────────────────
(function(){
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const main    = document.querySelector('.main');

  function isSystemMode(){
    const app = document.getElementById('appShell');
    return !!app && app.classList.contains('mode-system');
  }

  function lockSystemSidebar(){
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('expanded');
    overlay.classList.remove('active');
    main.classList.add('sidebar-open');
    document.querySelectorAll('iframe').forEach(f => f.style.pointerEvents = '');
  }

  function pointerInsideSidebar(e){
    const r = sidebar.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  }

  function expand(){
    if(isSystemMode()){
      lockSystemSidebar();
      return;
    }
    if(sidebar.classList.contains('expanded')) return;
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('expanded');
    overlay.classList.add('active');
    main.classList.add('sidebar-open');
    document.querySelectorAll('iframe').forEach(f => f.style.pointerEvents = 'none');
  }

  function collapse(){
    if(isSystemMode()){
      lockSystemSidebar();
      return;
    }
    if(sidebar.classList.contains('collapsed')) return;
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');
    overlay.classList.remove('active');
    main.classList.remove('sidebar-open');
    document.querySelectorAll('iframe').forEach(f => f.style.pointerEvents = '');
  }

  function syncSidebarHover(e){
    if(isSystemMode()){
      lockSystemSidebar();
      return;
    }
    if(pointerInsideSidebar(e)) expand();
    else collapse();
  }

  sidebar.addEventListener('pointerenter', expand);
  sidebar.addEventListener('pointerleave', collapse);
  document.addEventListener('pointerdown', syncSidebarHover);
  document.addEventListener('pointerleave', collapse);

  overlay.addEventListener('click', function(){
    if(isSystemMode()) lockSystemSidebar();
    else collapse();
  });
  window.syncSidebarMode = function(){
    if(isSystemMode()) lockSystemSidebar();
  };
  const painelFrame=document.getElementById('iframe-dashboard');
  document.querySelectorAll('iframe').forEach(frame=>{
    frame.addEventListener('load',syncResponsiveScale);
    frame.addEventListener('load',syncDashboardFrameActivity);
  });
  if(painelFrame)painelFrame.addEventListener('load',syncPainelGeralGrid);
  window.addEventListener('message',e=>{
    if(e.data&&e.data.type==='painel-geral-ready') syncPainelGeralGrid();
  });
  window.addEventListener('resize',syncPainelGeralGrid);
  syncPainelGeralGrid();
})();

// ── ÓRBITA CONTÍNUA DA SIDEBAR DO DASHBOARD ──────────────────────────────
(function(){
  const orbit = document.querySelector('.sidebar-orbit');
  if(!orbit) return;

  const LOOP_SECONDS = 13;
  const TRACK_UNITS = 1000;
  let dashLength = 145;

  const tracks = [
    {
      phase: 0,
      nodes: [
        orbit.querySelector('.sidebar-orbit-glow.sidebar-orbit-a'),
        orbit.querySelector('.sidebar-orbit-core.sidebar-orbit-a')
      ].filter(Boolean)
    },
    {
      phase: .5,
      nodes: [
        orbit.querySelector('.sidebar-orbit-glow.sidebar-orbit-b'),
        orbit.querySelector('.sidebar-orbit-core.sidebar-orbit-b')
      ].filter(Boolean)
    }
  ].filter(track => track.nodes.length);

  function measureOrbit(){
    const css = getComputedStyle(orbit);
    dashLength = parseFloat(css.getPropertyValue('--sidebar-orbit-length')) || 145;
  }

  function setTrack(track,progress){
    const dash = Math.min(dashLength, TRACK_UNITS * .42);
    const gap = Math.max(1, TRACK_UNITS - dash);
    const offset = -((progress + track.phase) * TRACK_UNITS);

    track.nodes.forEach(node => {
      node.style.strokeDasharray = `${dash} ${gap}`;
      node.style.strokeDashoffset = `${offset}`;
    });
  }

  measureOrbit();
  window.addEventListener('resize', measureOrbit);

  function tick(now){
    const progress = (now / (LOOP_SECONDS * 1000)) % 1;
    tracks.forEach(track => setTrack(track, progress));
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

// ── MINI IA FLUTUANTE ─────────────────────────────────────────────────────
(function(){
  const floatBox = document.getElementById('aiFloat');
  const launcher = document.getElementById('aiLauncher');
  const closeBtn = document.getElementById('aiClose');
  const list = document.getElementById('aiList');
  const badge = document.getElementById('aiLauncherBadge');
  const pageTitle = document.getElementById('aiPageTitle');
  const chatMailboxes = document.getElementById('aiChatMailboxes');
  const homeBackBtn = document.getElementById('aiHomeBack');
  if(!floatBox || !launcher || !list) return;

  const icons = {
    close:`<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    unread:`<svg viewBox="0 0 24 24"><path class="icon-fill" d="M4.5 5.8h15c.9 0 1.5.7 1.5 1.5v9.4c0 .9-.7 1.5-1.5 1.5h-15c-.9 0-1.5-.7-1.5-1.5V7.3c0-.9.7-1.5 1.5-1.5Zm.8 1.8 6.7 5 6.7-5H5.3Z"/><path class="icon-outline" d="M4 6h16v12H4z"/><path class="icon-outline" d="m4 7 8 6 8-6"/></svg>`,
    replied:`<svg viewBox="0 0 24 24"><path class="icon-fill" d="M6 4.7c0-.5.4-.9.9-.9h10c.7 0 1.1.8.7 1.4L15.7 8l1.9 2.8c.4.6 0 1.4-.7 1.4H7.8v6.9c0 .5-.4.9-.9.9S6 19.6 6 19.1V4.7Z"/><path class="icon-outline" d="M6 20V4"/><path class="icon-outline" d="M6 4h11l-2.2 4L17 12H6"/></svg>`,
    pin:`<svg viewBox="0 0 24 24"><path class="icon-fill" d="m15 3.7 5.3 5.3-4.2 1-3.6 7.2-1.9-1.9-4.8 4.8c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l4.8-4.8-1.9-1.9 7.2-3.6 1-4.2Z"/><path class="icon-outline" d="m15 4 5 5-4 1-4 8-2-2-4 4 4-4-2-2 8-4 1-4Z"/></svg>`,
    restore:`<svg viewBox="0 0 24 24"><path class="icon-fill" d="M9.2 4.4c.5-.5 1.3-.1 1.3.6v2h3.2c3.8 0 6.8 3 6.8 6.8s-3 6.8-6.8 6.8H8.2c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2h5.5c2.4 0 4.4-2 4.4-4.4s-2-4.4-4.4-4.4h-3.2v2c0 .7-.8 1.1-1.3.6L4.9 8.7c-.4-.4-.4-.9 0-1.3l4.3-3Z"/><path class="icon-outline" d="M10 5 5 9l5 4V9h4a6 6 0 0 1 0 12H8"/></svg>`,
    trash:`<svg viewBox="0 0 24 24"><g class="icon-fill"><path d="M6.7 8h10.6l-.86 12H7.56L6.7 8Z"/><path d="M8.8 4h6.4v3H8.8V4Z"/><path d="M4 7h16v1.6H4V7Z"/></g><g class="icon-outline"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/></g></svg>`,
    archive:`<svg viewBox="0 0 24 24"><path d="M3 7h18"/><path d="M5 7v12h14V7"/><path d="M10 11h4"/><path d="M4 4h16v3H4z"/></svg>`
  };

  let activeTab = 'inicio';
  let activeAtendimentoBox = 'principal';
  let expandedId = null;
  let activeHomeArticle = null;
  let homeTransition = 'none';
  const collapsedAiChatSections = new Set();
  const messages = [
    {id:'n1',tab:'notificacoes',kind:'warn',area:'dashboard',title:'Painel Geral',card:'Ritmo de Atingimento',sentAt:'2026-06-10T09:42:00',body:'A quinzena está abaixo do ritmo necessário para fechar a meta no prazo.',detail:'Acompanhe o card Ritmo de Atingimento: se a projeção continuar nesse ritmo, a diferença simulada fica em R$ 11.833,00 antes do fechamento.',unread:true,pinned:true,archived:false},
    {id:'n2',tab:'notificacoes',kind:'ok',area:'dashboard',title:'Vendas',card:'Fluxo Mensal',sentAt:'2026-06-10T08:15:00',body:'Maio superou a meta mensal e manteve o ticket médio acima da referência.',detail:'O resultado indica recuperação consistente no fluxo de faturamento; vale comparar os próximos meses para confirmar se a curva continua forte.',unread:true,pinned:false,archived:false},
    {id:'n3',tab:'notificacoes',kind:'danger',area:'dashboard',title:'Clientes',card:'Lista de Vendas',sentAt:'2026-06-09T17:30:00',body:'O faturamento está concentrado em poucos clientes no período filtrado.',detail:'Se os três primeiros continuarem dominando o ranking, qualquer pausa de compra deles pode afetar diretamente o desempenho geral.',unread:false,pinned:false,archived:false},
    {id:'n4',tab:'notificacoes',kind:'info',area:'dashboard',title:'Vendas',card:'Oferta Ativa',sentAt:'2026-06-08T14:10:00',body:'A participação de Oferta Ativa ficou menor que nos meses mais fortes.',detail:'Use essa leitura para orientar recompras e abordagens comerciais; elevar a Oferta Ativa pode melhorar conversão sem depender só de volume.',unread:false,pinned:false,archived:false},
    {id:'n5',tab:'notificacoes',kind:'ok',area:'dashboard',title:'Clientes',card:'Ranking',sentAt:'2026-06-08T16:20:00',body:'Dois clientes ficaram muito próximos na disputa do pódio de faturamento.',detail:'A diferença entre eles está curta o suficiente para inverter posição na próxima venda relevante, então o ranking merece acompanhamento.',unread:false,pinned:false,archived:false},
    {id:'n6',tab:'notificacoes',kind:'warn',area:'dashboard',title:'Painel Geral',card:'Período de Inatividade',sentAt:'2026-06-06T11:05:00',body:'Clientes avançaram para faixas maiores de dias sem comprar.',detail:'Priorize os nomes que acabaram de mudar de faixa: são os casos com maior chance de recuperação antes de virarem inatividade longa.',unread:false,pinned:false,archived:false},
    {id:'n7',tab:'notificacoes',kind:'info',area:'sistema',title:'Sistemas',card:'Cadastro de Vendas',sentAt:'2026-06-07T10:30:00',body:'O cadastro visual já está preparado para servir como base do Dashboard.',detail:'Quando o banco for conectado, clientes, produtos, notas e oferta ativa devem alimentar automaticamente os cards e listas analíticas.',unread:false,pinned:false,archived:false},
    {id:'n8',tab:'notificacoes',kind:'danger',area:'sistema',title:'Sistemas',card:'Produtos',sentAt:'2026-05-20T18:12:00',body:'Códigos de produto precisam estar consistentes antes da integração.',detail:'Divergências de código podem quebrar filtros, rankings, Produto de Maior Valor e métricas por unidade depois que os dados reais entrarem.',unread:false,pinned:false,archived:false},
    {id:'a1',tab:'atendimento',kind:'info',title:'NUTRIOIL INDUSTRIA E COMERCIO DE GORDURAS E FARINHAS LTDA MATRIZ OPERACIONAL',subject:'Solicitação urgente de revisão completa do pedido com entrega programada',body:'Olá, precisamos confirmar todos os detalhes do pedido, revisar disponibilidade de estoque, validar prazo de entrega, condição comercial e retorno do faturamento antes da próxima compra.',sentAt:'2026-06-10T11:00:00',unread:true,pinned:false,archived:false},
    {id:'a2',tab:'atendimento',kind:'info',title:'RIZZATO',subject:'Confirmação de faturamento',body:'Aguardando confirmação de faturamento para emissão da nota fiscal.',sentAt:'2026-06-10T10:00:00',unread:true,pinned:false,archived:false},
    {id:'a3',tab:'atendimento',kind:'info',title:'PETRIS',subject:'Atualização de orçamento',body:'Cliente pediu atualização do orçamento enviado no último contato.',sentAt:'2026-06-09T15:20:00',unread:false,pinned:false,archived:false},
    {id:'a4',tab:'atendimento',kind:'info',title:'DA SILVA AM',subject:'Condição comercial',body:'Conversa aberta sobre condição comercial e retirada do pedido.',sentAt:'2026-06-08T13:45:00',unread:false,pinned:false,archived:false},
    {id:'a5',tab:'atendimento',kind:'info',title:'MATEC',subject:'Disponibilidade de produtos',body:'Verificar disponibilidade dos produtos antes de confirmar a compra.',sentAt:'2026-06-07T09:12:00',unread:false,pinned:false,archived:false},
    {id:'a6',tab:'atendimento',kind:'info',title:'ALFA SINAL',subject:'Quantidade e pagamento',body:'Contato pendente para validar quantidades e prazo de pagamento.',sentAt:'2026-06-06T16:30:00',unread:false,pinned:false,archived:false},
    {id:'a7',tab:'atendimento',kind:'info',title:'NOVA ROTA',subject:'Revisão de pedido',body:'Cliente quer revisar os itens do pedido antes de finalizar.',sentAt:'2026-06-05T12:10:00',unread:false,pinned:false,archived:false},
    {id:'a8',tab:'atendimento',kind:'info',title:'BRASIL VIAS',subject:'Histórico para negociação',body:'Separar histórico recente para próxima negociação comercial.',sentAt:'2026-06-04T14:00:00',unread:false,pinned:false,archived:false},
    {id:'a9',tab:'atendimento',kind:'info',title:'TRIUNFO',subject:'Proposta com oferta ativa',body:'Acompanhar retorno sobre proposta com oferta ativa.',sentAt:'2026-06-03T11:40:00',unread:false,pinned:false,archived:false},
    {id:'a10',tab:'atendimento',kind:'info',title:'VIA NORTE',subject:'Compra recorrente',body:'Cliente solicitou novas condições para compra recorrente.',sentAt:'2026-06-02T10:25:00',unread:false,pinned:false,archived:false},
    {id:'a11',tab:'atendimento',kind:'info',title:'TRANSPORTE BOA SAFRA',subject:'Produtos em aberto',body:'Conferir produtos em aberto e confirmar previsão de faturamento.',sentAt:'2026-06-01T15:55:00',unread:false,pinned:false,archived:false},
    {id:'a12',tab:'atendimento',kind:'info',title:'RODOFAIXA',subject:'Valor atualizado',body:'Retornar com valor atualizado e disponibilidade de estoque.',sentAt:'2026-05-29T09:35:00',unread:false,pinned:false,archived:false},
    {id:'a13',tab:'atendimento',kind:'info',title:'J S SOARES',subject:'Recompra de itens',body:'Cliente precisa de suporte para recomprar itens anteriores.',sentAt:'2026-04-28T17:10:00',unread:false,pinned:false,archived:false},
    {id:'a14',tab:'atendimento',kind:'info',title:'JOSIVAN',subject:'Atendimento iniciado',body:'Aguardando confirmação para concluir atendimento iniciado.',sentAt:'2026-03-31T08:50:00',unread:false,pinned:false,archived:false},
    {id:'a15',tab:'atendimento',kind:'info',title:'SANTUS',subject:'Proposta enviada',body:'Monitorar resposta sobre proposta enviada pelo comercial.',sentAt:'2026-02-20T11:25:00',unread:false,pinned:false,archived:false}
  ];
  const homeStories = [
    {
      id:'dashboard',
      visual:'dashboard',
      unread:true,
      kicker:'Dashboard',
      title:'Dashboard comercial completo',
      summary:'Painel visual para acompanhar faturamento, metas, vendas, clientes, rankings, oferta ativa e períodos de inatividade em um só lugar.',
      detailTitle:'Dashboard comercial completo',
      detailMeta:'Visão central do negócio',
      paragraphs:[
        'O Dashboard reúne as páginas Painel Geral, Vendas, Clientes e demais análises para transformar os dados do sistema em leitura rápida. A ideia é enxergar ritmo de meta, faturamento mensal, ticket médio, quantidade de vendas, oferta ativa, rankings e clientes inativos sem precisar procurar essas informações manualmente.',
        'Cada card foi pensado para mostrar uma pergunta comercial específica: quem está comprando mais, quais meses estão fortes, onde existe risco, quais clientes precisam de contato e quais metas estão próximas de bater. Quando o banco de dados estiver conectado, essas leituras passam a ser atualizadas automaticamente.'
      ],
      bullets:['Metas, ritmo de atingimento e progresso financeiro.','Gráficos de vendas por mês, quinzena, dia e horário.','Ranking de clientes, lista de vendas e indicadores de novos clientes.']
    },
    {
      id:'sistemas',
      visual:'sistemas',
      unread:true,
      kicker:'Sistemas',
      title:'Sistema operacional de vendas',
      summary:'Área de cadastro e controle para registrar vendas, clientes, produtos, notas fiscais e dados que alimentam automaticamente o dashboard.',
      detailTitle:'Sistema operacional de vendas',
      detailMeta:'Base de dados e cadastros',
      paragraphs:[
        'A área de Sistemas é a parte operacional do projeto. Ela concentra cadastros, lançamentos, consultas e informações que depois serão usadas pelo Dashboard. É aqui que entram clientes, produtos, códigos, notas fiscais, valores, oferta ativa e demais campos necessários para montar os indicadores.',
        'Quando a integração com o banco estiver pronta, essa área vai funcionar como a origem organizada dos dados. Tudo que for registrado corretamente no sistema poderá aparecer nas análises, filtros, listas, notificações e resumos automáticos.'
      ],
      bullets:['Cadastro de clientes, produtos e vendas.','Base para notas fiscais, códigos de produto e valores.','Estrutura preparada para alimentar relatórios e alertas.']
    },
    {
      id:'ia',
      visual:'ia',
      unread:true,
      kicker:'Mini IA',
      title:'Mensageiro inteligente da plataforma',
      summary:'Central flutuante para atendimento, notificações, lembretes e mensagens automáticas baseadas nos cálculos do próprio sistema.',
      detailTitle:'Mensageiro inteligente da plataforma',
      detailMeta:'Atendimento, alertas e leitura automática',
      paragraphs:[
        'A mini IA funciona como uma central de comunicação dentro do projeto. Ela pode organizar atendimentos, mensagens de clientes, notificações de metas, riscos, oportunidades e avisos internos gerados pelo próprio sistema.',
        'No futuro, ela pode avisar quando clientes ficarem inativos, quando uma meta estiver perto de bater, quando um mês estiver abaixo do esperado, quando uma venda importante alterar o ranking ou quando alguma ação exigir atenção. A ideia é transformar o dashboard em algo ativo, que informa o usuário no momento certo.'
      ],
      bullets:['Atendimento com mensagens lidas, não lidas, fixadas e lixeira.','Notificações automáticas de Dashboard e Sistemas.','Resumos e alertas calculados com base nos dados reais.']
    },
    {
      id:'supabase',
      visual:'supabase',
      unread:true,
      kicker:'Supabase',
      title:'Banco de dados conectado ao site',
      summary:'Camada de banco, autenticação e integração para ligar as informações reais ao sistema, mantendo dados centralizados e reutilizáveis.',
      detailTitle:'Banco de dados conectado ao site',
      detailMeta:'Dados, autenticação e integração',
      paragraphs:[
        'O Supabase pode ser usado como a base de dados do projeto. Ele permite guardar tabelas de clientes, produtos, vendas, notas fiscais, metas, feriados, permissões e outras informações que o site precisa consultar para funcionar com dados reais.',
        'Com as tabelas organizadas, o projeto consegue buscar informações automaticamente, calcular indicadores, preencher listas, gerar alertas e manter o login protegido. A integração transforma os cards visuais em painéis vivos conectados ao banco.'
      ],
      bullets:['Banco relacional para organizar as tabelas do sistema.','Autenticação para controlar acesso ao projeto.','Consultas automáticas para alimentar Dashboard, Sistemas e Mini IA.']
    }
  ];
  const clientIdentityKey = 'caio.aiClientIdentity.v1';
  const avatarColors = ['#3656b3','#9b2f87','#0f8c98','#15955f','#b05b21','#6d4cc2','#2f7a65','#a33e52','#2f6fa8','#83702b','#8b3f73','#227a8d'];
  let clientIdentityCache = {};

  try{
    clientIdentityCache = JSON.parse(localStorage.getItem(clientIdentityKey) || '{}') || {};
  }catch(err){
    clientIdentityCache = {};
  }

  function escapeAiText(value){
    return String(value ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  function getClientKey(name){
    return String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/\s+/g,' ')
      .trim()
      .toUpperCase();
  }

  function createClientInitials(name){
    const parts = String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-zA-Z0-9\s]/g,' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if(!parts.length) return '?';
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }

  function fallbackAvatarColor(name){
    let hash = 0;
    String(name || '').split('').forEach(char=>{ hash = ((hash << 5) - hash) + char.charCodeAt(0); hash |= 0; });
    return avatarColors[Math.abs(hash) % avatarColors.length];
  }

  function saveClientIdentityCache(){
    try{
      localStorage.setItem(clientIdentityKey,JSON.stringify(clientIdentityCache));
    }catch(err){}
  }

  function getClientIdentity(name){
    const key = getClientKey(name);
    if(!key) return {initials:'?',color:avatarColors[0]};
    const saved = clientIdentityCache[key];
    if(saved?.initials && saved?.color) return saved;

    const identity = {
      initials:createClientInitials(name),
      color:avatarColors[Math.floor(Math.random() * avatarColors.length)] || fallbackAvatarColor(name)
    };
    clientIdentityCache[key] = identity;
    saveClientIdentityCache();
    return identity;
  }

  function parseAiDate(value){
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }

  function formatAiChatDate(value){
    const date = parseAiDate(value);
    const now = new Date();
    const startToday = new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const startDate = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    const diffDays = Math.floor((startToday - startDate) / 86400000);
    const weekNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const dd = String(date.getDate()).padStart(2,'0');
    const mm = String(date.getMonth() + 1).padStart(2,'0');
    const yyyy = date.getFullYear();

    if(diffDays <= 0) return `${String(date.getHours()).padStart(2,'0')}h`;

    const weekStart = new Date(startToday);
    weekStart.setDate(startToday.getDate() - startToday.getDay());
    if(startDate >= weekStart) return weekNames[date.getDay()];

    if(diffDays >= 20) return `${dd}/${mm}/${yyyy}`;
    return `${weekNames[date.getDay()]} ${dd}/${mm}`;
  }

  function formatAiNoticeDate(value){
    const date = parseAiDate(value);
    const now = new Date();
    const startToday = new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const startDate = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    const diffDays = Math.floor((startToday - startDate) / 86400000);
    const weekNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const dd = String(date.getDate()).padStart(2,'0');
    const mm = String(date.getMonth() + 1).padStart(2,'0');
    const yyyy = date.getFullYear();
    const hhmm = `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}h`;

    if(diffDays <= 0) return hhmm;

    const weekStart = new Date(startToday);
    weekStart.setDate(startToday.getDate() - startToday.getDay());
    if(startDate >= weekStart) return hhmm;

    if(diffDays >= 20) return `${dd}/${mm}/${yyyy}`;
    return `${weekNames[date.getDay()]} · ${dd}/${mm}`;
  }

  function getAiMonthLabel(date){
    const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    return monthNames[date.getMonth()] || '';
  }

  function getAiChatGroup(message){
    const date = parseAiDate(message.sentAt);
    const now = new Date();
    const monthDiff = ((now.getFullYear() - date.getFullYear()) * 12) + (now.getMonth() - date.getMonth());

    if(monthDiff <= 0) return {key:'current',label:'Este mês',order:0};
    if(monthDiff <= 3) return {key:`month-${date.getFullYear()}-${date.getMonth()}`,label:getAiMonthLabel(date),order:monthDiff};
    return {key:'old',label:'Mais Antigos',order:99};
  }

  function sortAiChatByDate(a,b){
    return parseAiDate(b.sentAt).getTime() - parseAiDate(a.sentAt).getTime();
  }

  function renderAiChatMessage(m){
    const identity = getClientIdentity(m.title);
    return `
      <article class="ai-chat-row ${m.unread?'unread':''} ${m.pinned?'pinned':''} ${m.replied?'replied':''} ${expandedId===m.id?'expanded':''}" data-ai-id="${m.id}">
        <span class="ai-chat-avatar" style="--avatar-bg:${identity.color}">${escapeAiText(identity.initials)}</span>
        <div class="ai-chat-content">
          <strong class="ai-chat-name">${escapeAiText(m.title)}</strong>
          <div class="ai-chat-head">
            <div class="ai-chat-subject">${escapeAiText(m.subject || m.body)}</div>
            <time class="ai-chat-time">${formatAiChatDate(m.sentAt)}</time>
          </div>
          <div class="ai-chat-preview">${escapeAiText(m.body)}</div>
          <div class="ai-chat-body">${escapeAiText(m.body)}</div>
        </div>
        <div class="ai-chat-state">
          ${m.replied ? `<span class="ai-chat-state-icon is-replied" title="Respondida">${icons.replied}</span>` : ''}
          ${m.pinned ? `<span class="ai-chat-state-icon is-pin" title="Fixada">${icons.pin}</span>` : ''}
        </div>
        <div class="ai-chat-actions ai-chat-actions-top">
          <button class="ai-chat-action is-unread" type="button" data-ai-action="unread" title="Marcar como não lida">${icons.unread}</button>
          <button class="ai-chat-action is-replied ${m.replied?'active':''}" type="button" data-ai-action="replied" title="Marcar como respondida">${icons.replied}</button>
          <button class="ai-chat-action is-pin ${m.pinned?'active':''}" type="button" data-ai-action="pin" title="${m.pinned?'Desfixar':'Fixar no topo'}">${icons.pin}</button>
          ${activeAtendimentoBox === 'trash' ? `<button class="ai-chat-action is-restore" type="button" data-ai-action="restore" title="Restaurar para principal">${icons.restore}</button>` : ''}
        </div>
        <button class="ai-chat-action ai-chat-delete is-delete" type="button" data-ai-action="delete" title="Mover para lixeira">${icons.trash}</button>
      </article>
    `;
  }

  function renderAiChatSection(key,label,messages){
    if(!messages.length) return '';
    const collapsed = collapsedAiChatSections.has(key);
    return `
      <section class="ai-chat-section ${collapsed?'collapsed':''}" data-ai-section="${key}">
        <button class="ai-chat-section-title" type="button" data-ai-section-toggle="${key}">
          <span aria-hidden="true">›</span><strong>${label}</strong>
        </button>
        <div class="ai-chat-section-items">
          ${messages.map(renderAiChatMessage).join('')}
        </div>
      </section>
    `;
  }

  function renderAiNotice(m){
    const area = m.area === 'sistema' ? 'system' : 'dashboard';
    const areaLabel = area === 'system' ? 'SISTEMAS' : 'DASHBOARD';
    const toneLabels = {ok:'META BATIDA',warn:'ATENÇÃO',danger:'RISCO',info:'INFO'};
    return `
      <article class="ai-notice-card ${m.unread?'unread':''} ${m.kind || 'info'} ${area} ${expandedId===m.id?'expanded':''}" data-ai-id="${m.id}">
        <button class="ai-notice-close" type="button" data-ai-action="delete" title="Excluir notificação">${icons.close}</button>
        <div class="ai-notice-visual">
          <span class="ai-notice-area">${areaLabel}</span>
          <span class="ai-notice-kind">${toneLabels[m.kind] || 'INFO'}</span>
          <i></i><i></i><i></i>
        </div>
        <div class="ai-notice-copy">
          <div class="ai-notice-head">
            <div>
              <strong>${escapeAiText(m.title)}</strong>
              <span>${escapeAiText(m.card || '')}</span>
            </div>
            <time>${escapeAiText(formatAiNoticeDate(m.sentAt))}</time>
          </div>
          <p>${escapeAiText(m.body)}</p>
          <div class="ai-notice-detail">${escapeAiText(m.detail || '')}</div>
        </div>
      </article>
    `;
  }

  function getHomeStory(id){
    return homeStories.find(story=>story.id === id);
  }

  function getHomeLogoSrc(){
    return 'assets/logo-quadrado.png';
  }

  function renderHomeOwnerAvatar(){
    return `
      <span class="ai-home-owner-avatar" aria-label="Mateus">
        <img src="assets/img/mateus-perfil.png" alt="Mateus" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <b>MF</b>
      </span>
    `;
  }

  function renderHomeStage(content){
    const slideClass = homeTransition === 'back' ? 'slide-back' : (homeTransition === 'forward' ? 'slide-forward' : '');
    return `<div class="ai-home-stage ${slideClass}">${content}</div>`;
  }

  function renderHomeIntro(){
    return `
      <section class="ai-home-intro" aria-label="Início">
        <div class="ai-home-intro-top">
          <span class="ai-home-brand-logo" aria-hidden="true"><img src="${getHomeLogoSrc()}" alt=""></span>
        </div>
      </section>
    `;
  }

  function renderHomeMedia(story,large=false){
    return `
      <div class="ai-home-story-media ${story.visual} ${large?'large':''}" aria-hidden="true">
        <b></b><b></b><b></b><i></i><i></i><i></i>
      </div>
    `;
  }

  function renderHomeStoryCard(story){
    return `
      <article class="ai-home-story-card ${story.unread?'unread':''}" data-ai-home-open="${story.id}" role="button" tabindex="0">
        ${renderHomeMedia(story)}
        <div class="ai-home-story-copy">
          <strong>${escapeAiText(story.title)}</strong>
          <p>${escapeAiText(story.summary)}</p>
          <span class="ai-home-arrow" aria-hidden="true">›</span>
        </div>
      </article>
    `;
  }

  function renderHomeStoryDetail(story){
    return `
      <article class="ai-home-detail">
        ${renderHomeMedia(story,true)}
        <div class="ai-home-detail-copy">
          <div class="ai-home-detail-tags">
            <span>${escapeAiText(story.kicker)}</span>
            <span>Resumo</span>
          </div>
          <h2>${escapeAiText(story.detailTitle)}</h2>
          <em>${escapeAiText(story.detailMeta)}</em>
          ${story.paragraphs.map(text=>`<p>${escapeAiText(text)}</p>`).join('')}
          <ul>
            ${story.bullets.map(item=>`<li>${escapeAiText(item)}</li>`).join('')}
          </ul>
        </div>
      </article>
    `;
  }

  function updateAiUnreadIndicators(){
    const activeUnread = messages.filter(m=>m.unread && !m.archived && !m.trashed);
    const homeUnreadCount = homeStories.filter(story=>story.unread).length;
    const atendimentoUnreadCount = activeUnread.filter(m=>m.tab === 'atendimento').length;
    const notificacoesUnreadCount = activeUnread.filter(m=>m.tab === 'notificacoes').length;
    const totalUnread = activeUnread.length + homeUnreadCount;

    badge.textContent = atendimentoUnreadCount > 0 ? String(atendimentoUnreadCount) : '';
    badge.style.display = totalUnread === 0 ? 'none' : '';
    launcher.classList.toggle('no-unread', totalUnread === 0);
    document.querySelectorAll('.ai-tabs [data-ai-tab]').forEach(btn=>{
      const tab = btn.dataset.aiTab;
      btn.classList.toggle('has-unread',
        (tab === 'inicio' && homeUnreadCount > 0) ||
        (tab === 'atendimento' && atendimentoUnreadCount > 0) ||
        (tab === 'notificacoes' && notificacoesUnreadCount > 0)
      );
    });
  }

  function renderAiMessages(){
    const tabTitles = {inicio:'Início', atendimento:'Atendimento', notificacoes:'Notificação'};
    const homeStory = activeTab === 'inicio' && activeHomeArticle ? getHomeStory(activeHomeArticle) : null;
    floatBox.dataset.aiTab = activeTab;
    floatBox.classList.toggle('home-detail-open', Boolean(homeStory));
    if(pageTitle) pageTitle.textContent = homeStory ? homeStory.kicker : (tabTitles[activeTab] || '');
    if(chatMailboxes){
      chatMailboxes.querySelectorAll('[data-ai-mailbox]').forEach(btn=>{
        btn.classList.toggle('active', btn.dataset.aiMailbox === activeAtendimentoBox);
      });
    }

    updateAiUnreadIndicators();

    if(activeTab === 'inicio'){
      if(homeStory){
        list.innerHTML = renderHomeStage(renderHomeStoryDetail(homeStory));
        return;
      }
      list.innerHTML = renderHomeStage(`
        ${renderHomeIntro()}
        <section class="ai-home-feed" aria-label="Resumos do sistema">
          ${homeStories.map(renderHomeStoryCard).join('')}
        </section>
      `);
      return;
    }

    let visible = messages
      .filter(m => m.tab === activeTab && !m.archived && (activeTab !== 'atendimento' || (activeAtendimentoBox === 'trash' ? m.trashed : !m.trashed)))
      .sort((a,b)=>(b.pinned-a.pinned) || messages.indexOf(a)-messages.indexOf(b));

    if(activeTab === 'notificacoes'){
      visible = visible.sort((a,b)=>parseAiDate(b.sentAt).getTime() - parseAiDate(a.sentAt).getTime());
    }

    if(!visible.length){
      list.innerHTML = `<div class="ai-empty ${activeTab === 'notificacoes' ? 'ai-empty-center' : ''}">${activeTab === 'notificacoes' ? 'Nenhuma informação no momento.' : 'Nenhuma mensagem'}</div>`;
      return;
    }

    if(activeTab === 'atendimento'){
      const pinned = visible.filter(m=>m.pinned).sort(sortAiChatByDate);
      const regular = visible.filter(m=>!m.pinned).sort(sortAiChatByDate);
      const groups = new Map();

      regular.forEach(message=>{
        const group = getAiChatGroup(message);
        if(!groups.has(group.key)) groups.set(group.key,{...group,messages:[]});
        groups.get(group.key).messages.push(message);
      });

      const sections = [...groups.values()]
        .sort((a,b)=>a.order - b.order)
        .map(group=>{
          if(group.key === 'current' && !pinned.length) return group.messages.map(renderAiChatMessage).join('');
          return renderAiChatSection(group.key,group.label,group.messages);
        })
        .join('');

      list.innerHTML = `${pinned.map(renderAiChatMessage).join('')}${sections}`;
      return;
    }

    if(activeTab === 'notificacoes'){
      list.innerHTML = visible.map(renderAiNotice).join('');
      return;
    }

    list.innerHTML = visible.map(m=>`
      <article class="ai-msg ${m.unread?'unread':''} ${m.pinned?'pinned':''} ${expandedId===m.id?'expanded':''}" data-ai-id="${m.id}">
        <div class="ai-msg-top">
          <span class="ai-sev ${m.kind}"></span>
          <div class="ai-msg-main">
            <div class="ai-msg-title">${m.title}</div>
            <div class="ai-msg-meta">${m.pinned?'FIXADO · ':''}${m.meta}</div>
          </div>
          <div class="ai-msg-actions">
            <button type="button" data-ai-action="unread" title="Marcar como ${m.unread?'lida':'não lida'}">${icons.unread}</button>
            <button type="button" data-ai-action="pin" title="${m.pinned?'Desfixar':'Fixar'}">${icons.pin}</button>
            <button type="button" data-ai-action="archive" title="Arquivar">${icons.archive}</button>
            <button type="button" data-ai-action="delete" title="Excluir">${icons.close}</button>
          </div>
        </div>
        <div class="ai-msg-body">${m.body}</div>
      </article>
    `).join('');
  }

  function getMessage(id){ return messages.find(m=>m.id === id); }

  list.addEventListener('click', e=>{
    const homeTab = e.target.closest('[data-ai-home-tab]');
    if(homeTab){
      setAiTab(homeTab.dataset.aiHomeTab);
      return;
    }

    const homeBack = e.target.closest('[data-ai-home-back]');
    if(homeBack){
      homeTransition = 'back';
      activeHomeArticle = null;
      renderAiMessages();
      list.scrollTop = 0;
      return;
    }

    const homeOpen = e.target.closest('[data-ai-home-open]');
    if(homeOpen){
      homeTransition = 'forward';
      activeHomeArticle = homeOpen.dataset.aiHomeOpen;
      renderAiMessages();
      list.scrollTop = 0;
      return;
    }

    const sectionToggle = e.target.closest('[data-ai-section-toggle]');
    if(sectionToggle){
      const key = sectionToggle.dataset.aiSectionToggle;
      if(collapsedAiChatSections.has(key)) collapsedAiChatSections.delete(key);
      else collapsedAiChatSections.add(key);
      renderAiMessages();
      return;
    }

    const item = e.target.closest('.ai-msg,.ai-chat-row,.ai-notice-card');
    if(!item) return;
    const msg = getMessage(item.dataset.aiId);
    if(!msg) return;

    const actionBtn = e.target.closest('[data-ai-action]');
    if(actionBtn){
      e.stopPropagation();
      const action = actionBtn.dataset.aiAction;
      if(action === 'delete'){
        if(msg.tab === 'atendimento' && !msg.trashed){
          msg.trashed = true;
          expandedId = null;
        }else{
          const idx = messages.indexOf(msg);
          if(idx >= 0) messages.splice(idx, 1);
        }
      }
      if(action === 'archive') msg.archived = true;
      if(action === 'unread') msg.unread = !msg.unread;
      if(action === 'pin') msg.pinned = !msg.pinned;
      if(action === 'replied') msg.replied = !msg.replied;
      if(action === 'restore'){
        msg.trashed = false;
        expandedId = null;
      }
      renderAiMessages();
      return;
    }

    const wasExpanded = expandedId === msg.id;
    const openedItem = list.querySelector('.ai-chat-row.expanded,.ai-notice-card.expanded,.ai-msg.expanded');
    if(openedItem && openedItem !== item) openedItem.classList.remove('expanded');

    expandedId = wasExpanded ? null : msg.id;
    item.classList.toggle('expanded', !wasExpanded);

    if(msg.unread){
      msg.unread = false;
      item.classList.remove('unread');
      updateAiUnreadIndicators();
    }
  });

  list.addEventListener('pointerover', e=>{
    if(activeTab !== 'inicio' || activeHomeArticle) return;
    const homeCard = e.target.closest('[data-ai-home-open]');
    if(!homeCard || !list.contains(homeCard)) return;

    const story = getHomeStory(homeCard.dataset.aiHomeOpen);
    if(!story || !story.unread) return;

    story.unread = false;
    homeCard.classList.remove('unread');
    updateAiUnreadIndicators();
  });

  function setAiTab(tab){
    activeTab = tab;
    if(tab === 'atendimento') activeAtendimentoBox = 'principal';
    expandedId = null;
    activeHomeArticle = null;
    homeTransition = 'none';
    document.querySelectorAll('.ai-tabs [data-ai-tab]').forEach(b=>b.classList.toggle('active', b.dataset.aiTab === tab));
    renderAiMessages();
  }

  document.querySelectorAll('[data-ai-tab]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      setAiTab(btn.dataset.aiTab);
    });
  });

  if(chatMailboxes){
    chatMailboxes.querySelectorAll('[data-ai-mailbox]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        activeAtendimentoBox = btn.dataset.aiMailbox;
        expandedId = null;
        renderAiMessages();
      });
    });
  }

  if(closeBtn) closeBtn.addEventListener('click', ()=>floatBox.classList.remove('open'));
  if(homeBackBtn){
    homeBackBtn.addEventListener('click', ()=>{
      if(activeTab !== 'inicio' || !activeHomeArticle) return;
      homeTransition = 'back';
      activeHomeArticle = null;
      renderAiMessages();
      list.scrollTop = 0;
    });
  }

  try{ localStorage.removeItem('caio.aiFloat.position.v1'); }catch(err){}

  function updatePanelSide(){
    const rect = floatBox.getBoundingClientRect();
    floatBox.classList.toggle('panel-right', rect.left < 450);
  }

  function resetAiPosition(){
    floatBox.style.left = '';
    floatBox.style.top = '';
    floatBox.style.right = '';
    floatBox.style.bottom = '';
    updatePanelSide();
  }

  function toggleAiPanel(){
    const willOpen = !floatBox.classList.contains('open');
    floatBox.classList.toggle('open', willOpen);
    updatePanelSide();
    if(willOpen) setAiTab('atendimento');
    else renderAiMessages();
  }

  launcher.addEventListener('click', toggleAiPanel);

  window.addEventListener('resize', ()=>{
    requestAnimationFrame(updatePanelSide);
  });

  resetAiPosition();
  renderAiMessages();
})();
