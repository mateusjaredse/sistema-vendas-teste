// Verificação de acesso via Supabase Auth
// Visual copy: acesso liberado para abrir este HTML localmente.

/* --- lógica operacional do Sistema --- */

const SB_URL="https://ylldraicfwqaxbuqihul.supabase.co";
const SB_KEY="sb_publishable_JmQg_sdxjS5RDQDU-2p92A_BcVI_pul";
const TB_VENDAS="bd_principal";
const TB_CLIENTES="bd_clientes";
const TB_SECUNDARIO="bd_secundario";
const TB_PRODUTOS=null;
const TB_METAS="bd_metas";
const TB_CONVERSOES="bd_conversao";

// Dados em cache (buscados do Supabase)
let CLIENTES=[];
let PRODUTOS=[];
let todosRegistros=[];
let todosClientes=[];
let todosProdutos=[];
let todasMetas=[];
let todasConversoes=[];
let todosArquivosImportados=[];
let conversoesLocalTouched=false;
let clientesLoadPromise=null;

let itemRows=[],itemId=0,ofertaAtiva=false,saleImportFiles=[];
let editVendaId=null,editClienteId=null,editProdutoId=null,editMetaId=null,editConversaoId=null;
let historicoModo="principal";
const SALE_IMPORT_MAX_FILES=10;
const SALE_IMPORT_MAX_FILE_SIZE=25*1024*1024;
const SALE_IMPORT_MAX_TOTAL_SIZE=100*1024*1024;
const SALE_IMPORT_CHUNK_ROWS=1200;
let saleImportProgress=null;
const HISTORICO_MESES=[
  {v:"01",n:"Janeiro"},{v:"02",n:"Fevereiro"},{v:"03",n:"Março"},{v:"04",n:"Abril"},
  {v:"05",n:"Maio"},{v:"06",n:"Junho"},{v:"07",n:"Julho"},{v:"08",n:"Agosto"},
  {v:"09",n:"Setembro"},{v:"10",n:"Outubro"},{v:"11",n:"Novembro"},{v:"12",n:"Dezembro"}
];
let historicoPeriodoMes="",historicoPeriodoAno="",historicoPeriodoAnos=[];
let avisosImportacao=[];
let resumoImportacaoAtivo=false;
let limpezaImportacoesOrfasExecutada=false;
let arquivosResumoImportacao=[];
let resumoImportacaoDbStats=null;

// Dados visuais para testar formatação localmente enquanto o banco não está conectado.
const DEMO_CLIENTES=[
  {id:28512,data_inscricao:"2026-01-12",codigo:"28512",nome:"2 R- TRANSPORTES RODOVIARIO LTDA"},
  {id:83769,data_inscricao:"2026-02-18",codigo:"83769",nome:"2R AUTO PECAS DIESEL LTDA"},
  {id:89164,data_inscricao:"2026-03-03",codigo:"89164",nome:"36.980.312 JOSE VITOR VIEIRA DA MAIA"},
  {id:90776,data_inscricao:"2026-03-21",codigo:"90776",nome:"60.480.797 NICOLI ADNA SANTOS GUILHERME"},
  {id:90303,data_inscricao:"2026-04-09",codigo:"90303",nome:"64.379.766 FABIO JOSE MARTINS DE SA"},
  {id:91059,data_inscricao:"2026-05-16",codigo:"91059",nome:"65.418.209 VICKTOR ROCHO SEVERO"},
  {id:5651,data_inscricao:"2026-05-27",codigo:"5651",nome:"A J RORATO & CIA LTDA"}
];
const DEMO_PRODUTOS=[
  {id:1,codigo:"3172755",nome:"CONJUNTO ESTRUTURAL REFORCADO",preco_unitario:18476.00},
  {id:2,codigo:"1441237",nome:"KIT DE VEDACAO HIDRAULICA",preco_unitario:892.50},
  {id:3,codigo:"2684392",nome:"MANCAL SUPORTE DIANTEIRO",preco_unitario:1248.90},
  {id:4,codigo:"1111497",nome:"PARAFUSO SEXTAVADO ZINCADO",preco_unitario:7.85},
  {id:5,codigo:"2086028",nome:"CORREIA INDUSTRIAL PERFIL B",preco_unitario:312.40},
  {id:6,codigo:"2684667",nome:"ROLAMENTO BLINDADO 6205",preco_unitario:96.70},
  {id:7,codigo:"1352803",nome:"VALVULA CONTROLE DE FLUXO",preco_unitario:643.25},
  {id:8,codigo:"1472144",nome:"BASE METALICA USINADA",preco_unitario:1280.00}
];
const DEMO_METAS=[
  {id:1,data_cadastro:"2026-01-01",mes:1,ano:"2026",meta:540000},
  {id:2,data_cadastro:"2026-02-01",mes:2,ano:"2026",meta:575000},
  {id:3,data_cadastro:"2026-03-01",mes:3,ano:"2026",meta:610000},
  {id:4,data_cadastro:"2026-04-01",mes:4,ano:"2026",meta:635000},
  {id:5,data_cadastro:"2026-05-01",mes:5,ano:"2026",meta:650000},
  {id:6,data_cadastro:"2026-06-01",mes:6,ano:"2026",meta:680000}
];
const DEMO_REGISTROS=[
  {id:9001,data:"2026-05-03",hora:"08:30",num_nf:"437100",cod_cliente:"28512",nome_cliente:"2 R- TRANSPORTES RODOVIARIO LTDA",faturamento:41340.50,oferta_ativa:"Sim"},
  {id:9002,data:"2026-05-06",hora:"10:15",num_nf:"437118",cod_cliente:"83769",nome_cliente:"2R AUTO PECAS DIESEL LTDA",faturamento:79090.00,oferta_ativa:"Não"},
  {id:9003,data:"2026-05-09",hora:"13:20",num_nf:"437126",cod_cliente:"89164",nome_cliente:"36.980.312 JOSE VITOR VIEIRA DA MAIA",faturamento:52860.40,oferta_ativa:"Sim"},
  {id:9004,data:"2026-05-12",hora:"15:40",num_nf:"437144",cod_cliente:"90776",nome_cliente:"60.480.797 NICOLI ADNA SANTOS GUILHERME",faturamento:28640.30,oferta_ativa:"Não"},
  {id:9005,data:"2026-05-15",hora:"09:10",num_nf:"437167",cod_cliente:"90303",nome_cliente:"64.379.766 FABIO JOSE MARTINS DE SA",faturamento:62410.75,oferta_ativa:"Sim"},
  {id:9006,data:"2026-05-18",hora:"11:25",num_nf:"437190",cod_cliente:"91059",nome_cliente:"65.418.209 VICKTOR ROCHO SEVERO",faturamento:35980.90,oferta_ativa:"Não"},
  {id:9007,data:"2026-05-22",hora:"14:05",num_nf:"437211",cod_cliente:"5651",nome_cliente:"A J RORATO & CIA LTDA",faturamento:18476.00,oferta_ativa:"Sim"},
  {id:9008,data:"2026-05-25",hora:"16:35",num_nf:"437233",cod_cliente:"28512",nome_cliente:"2 R- TRANSPORTES RODOVIARIO LTDA",faturamento:51200.00,oferta_ativa:"Não"},
  {id:9009,data:"2026-06-02",hora:"08:45",num_nf:"437302",cod_cliente:"83769",nome_cliente:"2R AUTO PECAS DIESEL LTDA",faturamento:68440.20,oferta_ativa:"Sim"},
  {id:9010,data:"2026-06-04",hora:"17:10",num_nf:"437318",cod_cliente:"90303",nome_cliente:"64.379.766 FABIO JOSE MARTINS DE SA",faturamento:44790.60,oferta_ativa:"Não"}
];
const DEMO_CONVERSOES=[
  {id:7001,data:"2026-05-03",conversados:318,orcaram:184,geraram_nfe:112,perdidos:71},
  {id:7002,data:"2026-05-08",conversados:276,orcaram:151,geraram_nfe:96,perdidos:54},
  {id:7003,data:"2026-05-14",conversados:341,orcaram:206,geraram_nfe:138,perdidos:63},
  {id:7004,data:"2026-05-22",conversados:289,orcaram:167,geraram_nfe:109,perdidos:49},
  {id:7005,data:"2026-06-02",conversados:302,orcaram:198,geraram_nfe:126,perdidos:58},
  {id:7006,data:"2026-06-07",conversados:265,orcaram:139,geraram_nfe:82,perdidos:46}
];

let dataChangeNotifyTimer=null;
function notifyDashboardDataChanged(detail){
  clearTimeout(dataChangeNotifyTimer);
  dataChangeNotifyTimer=setTimeout(()=>{
    window.caioBroadcastDataChange?.(detail||{source:"sistema"});
  },350);
}

function cloneDemo(list){return list.map(item=>({...item}));}
function applyDemoClientes(){todosClientes=cloneDemo(DEMO_CLIENTES);CLIENTES=todosClientes;}
function applyDemoProdutos(){todosProdutos=cloneDemo(DEMO_PRODUTOS);PRODUTOS=todosProdutos;}
function applyDemoMetas(){todasMetas=cloneDemo(DEMO_METAS);}
function applyDemoRegistros(){todosRegistros=cloneDemo(DEMO_REGISTROS);}
function applyDemoConversoes(){
  if(!conversoesLocalTouched&&!todasConversoes.length)todasConversoes=cloneDemo(DEMO_CONVERSOES);
}
function addImportAlerts(alerts){
  if(!alerts?.length)return;
  const stamped=alerts.map(alert=>({
    id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt:new Date().toISOString(),
    ...alert
  }));
  avisosImportacao=[...avisosImportacao,...stamped];
}

function syncSystemTableEmptyState(tbody){
  const table=tbody?.closest("table");
  if(!table)return;
  table.classList.toggle("is-empty",!!tbody.querySelector(".empty-row"));
}

function initSystemTableEmptyState(){
  document.querySelectorAll("#page-historico tbody,#page-cadastro tbody").forEach(tbody=>{
    syncSystemTableEmptyState(tbody);
    new MutationObserver(()=>syncSystemTableEmptyState(tbody)).observe(tbody,{childList:true});
  });
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initSystemTableEmptyState);
else initSystemTableEmptyState();

function getBrasiliaDateTime(){
  const parts=Intl.DateTimeFormat("en-CA",{
    timeZone:"America/Sao_Paulo",
    year:"numeric",
    month:"2-digit",
    day:"2-digit",
    hour:"2-digit",
    minute:"2-digit",
    hourCycle:"h23"
  }).formatToParts(new Date()).reduce((acc,part)=>{
    acc[part.type]=part.value;
    return acc;
  },{});
  return {date:`${parts.year}-${parts.month}-${parts.day}`,time:`${parts.hour}:${parts.minute}`};
}
function setSaleDateTimeToBrasiliaNow(){
  const now=getBrasiliaDateTime();
  document.getElementById("v-data").value=now.date;
  document.getElementById("v-hora").value=now.time;
}

// ── INIT ─────────────────────────────────────────────────────────────────
window.onload=async()=>{
  document.querySelectorAll(".page").forEach(x=>{
    if(!x.classList.contains("active"))x.style.display="none";
  });
  setSaleDateTimeToBrasiliaNow();
  initSaleFileImport();
  addItem();
  await Promise.all([carregarClientes(),carregarMetas()]);
};
document.addEventListener("click",e=>{
  const wrap=document.querySelector(".history-date-filter");
  if(wrap&&!e.composedPath().includes(wrap))fecharHistoricoPeriodoMenu();
});
function ajustarPopoverAlertaHistorico(icon){
  if(!icon)return;
  const wrap=icon.closest(".table-wrap");
  const popover=icon.querySelector(".history-warning-popover");
  if(!wrap||!popover)return;
  icon.classList.remove("open-up");
  const wrapRect=wrap.getBoundingClientRect();
  const iconRect=icon.getBoundingClientRect();
  const popoverHeight=popover.offsetHeight||76;
  const deveSubir=(iconRect.top+popoverHeight+8)>wrapRect.bottom;
  icon.classList.toggle("open-up",deveSubir);
}
document.addEventListener("pointerover",e=>{
  const icon=e.target.closest?.(".history-warning-icon");
  if(icon)ajustarPopoverAlertaHistorico(icon);
});

// ── API HELPERS ───────────────────────────────────────────────────────────
function getToken(){
  try{
    return sessionStorage.getItem("sb_token") || localStorage.getItem("sb_token") || window.parent?.sessionStorage?.getItem("sb_token") || window.parent?.localStorage?.getItem("sb_token") || "";
  }catch(e){
    return sessionStorage.getItem("sb_token") || localStorage.getItem("sb_token") || "";
  }
}
function getRefreshToken(){
  try{
    return sessionStorage.getItem("sb_refresh_token") || localStorage.getItem("sb_refresh_token") || window.parent?.sessionStorage?.getItem("sb_refresh_token") || window.parent?.localStorage?.getItem("sb_refresh_token") || "";
  }catch(e){
    return sessionStorage.getItem("sb_refresh_token") || localStorage.getItem("sb_refresh_token") || "";
  }
}
function saveAuthSession(session){
  if(!session?.access_token)return;
  try{sessionStorage.setItem("sb_token",session.access_token);}catch(e){}
  try{localStorage.setItem("sb_token",session.access_token);}catch(e){}
  try{window.parent?.sessionStorage?.setItem("sb_token",session.access_token);}catch(e){}
  try{window.parent?.localStorage?.setItem("sb_token",session.access_token);}catch(e){}
  if(session.refresh_token){
    try{sessionStorage.setItem("sb_refresh_token",session.refresh_token);}catch(e){}
    try{localStorage.setItem("sb_refresh_token",session.refresh_token);}catch(e){}
    try{window.parent?.sessionStorage?.setItem("sb_refresh_token",session.refresh_token);}catch(e){}
    try{window.parent?.localStorage?.setItem("sb_refresh_token",session.refresh_token);}catch(e){}
  }
}
function clearAuthSession(){
  ["sb_token","sb_refresh_token"].forEach(key=>{
    try{sessionStorage.removeItem(key);}catch(e){}
    try{localStorage.removeItem(key);}catch(e){}
    try{window.parent?.sessionStorage?.removeItem(key);}catch(e){}
    try{window.parent?.localStorage?.removeItem(key);}catch(e){}
  });
}
const AUTH_REDIRECT_ERROR="CAIO_AUTH_REDIRECT";
let authRefreshPromise=null;
function getLoginUrl(){
  const url=new URL(window.location.href);
  const markers=["/dashboard/","/sistema/","/app/"];
  const marker=markers.find(item=>url.pathname.includes(item));
  if(marker){
    url.pathname=url.pathname.slice(0,url.pathname.indexOf(marker)+1)+"login.html";
  }else{
    url.pathname=url.pathname.replace(/[^/]*$/,"login.html");
  }
  url.search="";
  url.hash="";
  return url.toString();
}
function redirectToLogin(){
  window.__caioAuthRedirecting=true;
  clearAuthSession();
  const target=getLoginUrl();
  if(window.top&&window.top!==window.self)window.top.location.href=target;
  else window.location.href=target;
  throw new Error(AUTH_REDIRECT_ERROR);
}
function ensureSession(){
  if(!getToken()&&!getRefreshToken())redirectToLogin();
  return getToken();
}
function isAuthRedirectError(error){
  return window.__caioAuthRedirecting || error?.message===AUTH_REDIRECT_ERROR;
}
function authHeaders(extra){
  const token=ensureSession();
  return Object.assign({"apikey":SB_KEY,"Authorization":`Bearer ${token}`},extra||{});
}
async function refreshAuthSession(){
  const refreshToken=getRefreshToken();
  if(!refreshToken)return false;
  if(!authRefreshPromise){
    authRefreshPromise=(async()=>{
      try{
        const r=await fetch(`${SB_URL}/auth/v1/token?grant_type=refresh_token`,{
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":SB_KEY},
          body:JSON.stringify({refresh_token:refreshToken})
        });
        const data=await r.json().catch(()=>({}));
        if(!r.ok||!data.access_token)return false;
        saveAuthSession(data);
        return true;
      }catch(e){
        return false;
      }
    })().finally(()=>{authRefreshPromise=null;});
  }
  return authRefreshPromise;
}
async function fetchWithAuth(url,options){
  ensureSession();
  const requestOptions={...(options||{}),headers:authHeaders(options?.headers)};
  let response=await fetch(url,requestOptions);
  if(response.status===401&&await refreshAuthSession()){
    response=await fetch(url,{...(options||{}),headers:authHeaders(options?.headers)});
  }
  if(response.status===401)redirectToLogin();
  return response;
}
function restId(id){
  return encodeURIComponent(String(id));
}
function normalizeArquivoNome(nome){
  let value=String(nome??"").trim();
  for(let i=0;i<3;i+=1){
    try{
      const decoded=decodeURIComponent(value);
      if(decoded===value)break;
      value=decoded;
    }catch(e){
      break;
    }
  }
  return value;
}
function normalizeBdSecundarioPayload(body){
  const normalizeRow=row=>{
    if(!row || typeof row!=="object" || Array.isArray(row))return row;
    const out={...row};
    const map=[
      ["codigo_cliente","Cliente"],
      ["nome_cliente","Nome Cliente"],
      ["cidade","Cidade"],
      ["numero_nfe","NUM.NF"],
      ["codigo_produto","Cod.Item"],
      ["descricao_produto","Descricao Item"],
      ["descricao","Descricao Item"],
      ["quantidade","Quantidade"],
      ["preco_unitario","Preco Unit."],
      ["valor_unitario","Preco Unit."],
      ["total_item","Total Item"]
    ];
    map.forEach(([oldKey,newKey])=>{
      if(Object.prototype.hasOwnProperty.call(out,oldKey) && !Object.prototype.hasOwnProperty.call(out,newKey)){
        out[newKey]=out[oldKey];
      }
      delete out[oldKey];
    });
    return out;
  };
  return Array.isArray(body)?body.map(normalizeRow):normalizeRow(body);
}
async function sbGet(table,query=""){
  const r=await fetchWithAuth(`${SB_URL}/rest/v1/${table}?${query}`);
  if(!r.ok)throw new Error(await r.text());
  return r.json();
}
async function sbPost(table,body){
  const payload=table===TB_SECUNDARIO?normalizeBdSecundarioPayload(body):body;
  const r=await fetchWithAuth(`${SB_URL}/rest/v1/${table}`,{method:"POST",headers:{"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(payload)});
  if(!r.ok)throw new Error(await r.text());
  notifyDashboardDataChanged({source:"post",table});
}
async function sbPatch(table,id,body){
  const r=await fetchWithAuth(`${SB_URL}/rest/v1/${table}?id=eq.${restId(id)}`,{method:"PATCH",headers:{"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify(body)});
  if(!r.ok)throw new Error(await r.text());
  notifyDashboardDataChanged({source:"patch",table});
}
async function sbDelete(table,id){
  const r=await fetchWithAuth(`${SB_URL}/rest/v1/${table}?id=eq.${restId(id)}`,{method:"DELETE"});
  if(!r.ok)throw new Error(await r.text());
  notifyDashboardDataChanged({source:"delete",table});
}
async function sbRpc(fn,body){
  const r=await fetchWithAuth(`${SB_URL}/rest/v1/rpc/${fn}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body||{})});
  if(!r.ok)throw new Error(await r.text());
  notifyDashboardDataChanged({source:"rpc",fn});
  const text=await r.text();
  if(!text)return null;
  try{return JSON.parse(text);}catch(e){return text;}
}

function setCadastro(tipo){
  const tipos=["clientes","metas","arquivos"];
  tipos.forEach(key=>{
    const ativo=tipo===key;
    document.getElementById(`cad-panel-${key}`)?.classList.toggle("active",ativo);
    document.querySelectorAll(`[data-cad-switch="${key}"]`).forEach(btn=>btn.classList.toggle("active",ativo));
    document.querySelectorAll(`[data-cad-action="${key}"]`).forEach(btn=>btn.classList.toggle("active",ativo));
  });
  if(tipo==="clientes"){
    renderClientes(todosClientes);
    ensureClientesLoaded().then(()=>renderClientes(todosClientes));
  }else if(tipo==="metas")renderMetas(todasMetas);
  else carregarArquivosImportados();
}

// ── CLIENTES (cache) ──────────────────────────────────────────────────────
function getClienteCodigo(c){
  return String(
    c?.codigo_cliente ??
    c?.cod_cliente ??
    c?.cliente_codigo ??
    c?.cliente ??
    c?.Cliente ??
    c?.CODIGO_CLIENTE ??
    c?.COD_CLIENTE ??
    c?.CODIGO ??
    c?.codigo ??
    c?.Código ??
    c?.COD ??
    ""
  ).trim();
}
function getClienteNome(c){
  return String(
    c?.nome_cliente ??
    c?.cliente_nome ??
    c?.nome ??
    c?.Nome ??
    c?.NOME ??
    c?.razao_social ??
    c?.razao ??
    c?.RAZAO_SOCIAL ??
    ""
  ).trim();
}
function getClienteData(c){
  return String(
    c?.data_inscricao ??
    c?.data_cadastro ??
    c?.data ??
    c?.Data ??
    c?.DATA ??
    ""
  ).trim();
}
function getCadastroClientesList(){
  if(Array.isArray(todosClientes) && todosClientes.length)return todosClientes;
  if(Array.isArray(CLIENTES) && CLIENTES.length)return CLIENTES;
  const rows=[...document.querySelectorAll("#cli-body tr")].filter(row=>!row.classList.contains("empty-row"));
  return rows.map(row=>{
    const cells=[...row.children];
    return {
      data_inscricao:cells[0]?.textContent?.trim() || "",
      codigo_cliente:cells[1]?.textContent?.trim() || "",
      nome_cliente:cells[2]?.textContent?.trim() || ""
    };
  }).filter(c=>getClienteCodigo(c)||getClienteNome(c));
}
async function carregarClientes(){
  ensureSession();
  try{
    todosClientes=await sbGet(TB_CLIENTES,"select=*&order=nome_cliente.asc");
    CLIENTES=todosClientes;
  }catch(e){
    if(isAuthRedirectError(e))return;
    todosClientes=[];
    CLIENTES=[];
  }
  renderClientes(todosClientes);
}
function ensureClientesLoaded(){
  if(getCadastroClientesList().length)return Promise.resolve();
  if(!clientesLoadPromise){
    clientesLoadPromise=carregarClientes().finally(()=>{clientesLoadPromise=null;});
  }
  return clientesLoadPromise;
}
function renderClientes(list){
  const b=document.getElementById("cli-body");
  if(!list.length){b.innerHTML=`<tr class="empty-row"><td colspan="4"><div class="empty empty-strong"><p>Nenhum Cliente Cadastrado</p></div></td></tr>`;return;}
  b.innerHTML=list.map(c=>{
    const id=inlineMetaId(c.id);
    return `<tr><td><span class="history-meta">${formatDataBR(getClienteData(c))}</span></td><td><span class="mn">${escapeSaleText(getClienteCodigo(c))}</span></td><td class="hl">${escapeSaleText(getClienteNome(c))}</td><td><button class="btn btn-secondary btn-sm" onclick="editarCliente('${id}')" style="margin-right:4px">Editar</button><button class="btn btn-danger btn-sm" onclick="excluirCliente('${id}')">Excluir</button></td></tr>`;
  }).join("");
}
function filtrarClientes(){
  const v=document.getElementById("f-cli").value.toLowerCase();
  renderClientes(todosClientes.filter(c=>getClienteCodigo(c).includes(v)||getClienteNome(c).toLowerCase().includes(v)||formatDataBR(getClienteData(c)).toLowerCase().includes(v)));
}

// ── PRODUTOS (cache) ──────────────────────────────────────────────────────
async function carregarProdutos(){
  todosProdutos=[];
  PRODUTOS=[];
}
function renderProdutos(list){
  const b=document.getElementById("prod-body");
  if(!b)return;
  if(!list.length){b.innerHTML=`<tr class="empty-row"><td colspan="4"><div class="empty empty-strong"><p>Nenhum Produto Cadastrado</p></div></td></tr>`;return;}
  b.innerHTML=list.map(p=>`<tr><td><span class="mn">${p.codigo}</span></td><td class="hl">${p.nome}</td><td><span class="money">R$ ${fmt(p.preco_unitario)}</span></td><td><button class="btn btn-secondary btn-sm" onclick="editarProduto(${p.id})" style="margin-right:4px">Editar</button><button class="btn btn-danger btn-sm" onclick="excluirProduto(${p.id})">Excluir</button></td></tr>`).join("");
}
function filtrarProdutos(){
  if(!document.getElementById("f-prod"))return;
  const v=document.getElementById("f-prod").value.toLowerCase();
  renderProdutos(todosProdutos.filter(p=>p.codigo.includes(v)||p.nome.toLowerCase().includes(v)));
}

// ── METAS (cache) ─────────────────────────────────────────────────────────
async function carregarMetas(){
  ensureSession();
  try{
    todasMetas=await sbGet(TB_METAS,"select=*&order=ano.desc,mes.asc");
  }catch(e){
    if(isAuthRedirectError(e))return;
    todasMetas=[];
  }
  renderMetas(todasMetas);
}
function getMetaValor(m){
  return parseMetaCurrencyValue(m.valor ?? m.meta ?? m.meta_rs ?? m.valor_meta);
}
function getMetaData(m){
  return String(m?.data_cadastro ?? m?.data ?? "");
}
function getMetaMes(m){
  if(m?.mes_nome)return String(m.mes_nome).toUpperCase();
  const mesNumero=Number(m?.mes);
  if(Number.isFinite(mesNumero)&&mesNumero>=1&&mesNumero<=12)return HISTORICO_MESES[mesNumero-1].n.toUpperCase();
  return String(m?.mes || mesNomePorData(getMetaData(m))).toUpperCase();
}
function getMetaAno(m){
  return String(m?.ano || anoPorData(getMetaData(m)) || "");
}
function metaMonthIndex(mes){
  const numeric=Number(mes);
  if(Number.isFinite(numeric)&&numeric>=1&&numeric<=12)return numeric-1;
  const normalized=String(mes||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();
  const idx=HISTORICO_MESES.findIndex(m=>m.n.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase()===normalized);
  return idx<0?99:idx;
}
function sortMetas(list){
  return [...list].sort((a,b)=>{
    const yearDiff=Number(getMetaAno(b))-Number(getMetaAno(a));
    if(yearDiff)return yearDiff;
    return metaMonthIndex(getMetaMes(a))-metaMonthIndex(getMetaMes(b));
  });
}
function inlineMetaId(id){
  return String(id).replace(/\\/g,"\\\\").replace(/'/g,"\\'");
}
function renderMetas(list){
  const b=document.getElementById("meta-body");
  if(!b)return;
  if(!list.length){b.innerHTML=`<tr class="empty-row"><td colspan="5"><div class="empty empty-strong"><p>Nenhuma Meta Cadastrada</p></div></td></tr>`;return;}
  b.innerHTML=sortMetas(list).map(m=>{
    const id=inlineMetaId(m.id);
    return `<tr><td><span class="history-meta">${formatDataBR(getMetaData(m))}</span></td><td class="hl">${getMetaMes(m)}</td><td><span class="history-meta">${getMetaAno(m)}</span></td><td><span class="money">R$ ${fmt(getMetaValor(m))}</span></td><td><button class="btn btn-secondary btn-sm" onclick="editarMeta('${id}')" style="margin-right:4px">Editar</button><button class="btn btn-danger btn-sm" onclick="excluirMeta('${id}')">Excluir</button></td></tr>`;
  }).join("");
}
function filtrarMetas(){
  const v=document.getElementById("f-meta").value.toLowerCase();
  renderMetas(todasMetas.filter(m=>{
    const data=formatDataBR(getMetaData(m)).toLowerCase();
    const mes=getMetaMes(m).toLowerCase();
    const ano=getMetaAno(m).toLowerCase();
    const valor=fmt(getMetaValor(m)).toLowerCase();
    return data.includes(v)||mes.includes(v)||ano.includes(v)||valor.includes(v);
  }));
}

// ── ARQUIVOS IMPORTADOS ──────────────────────────────────────────────────
function getArquivoImportadoNome(row){
  return String(row?.arquivo_nome ?? row?.arquivo ?? row?.file_name ?? "").trim();
}
function getArquivoImportadoData(row){
  return String(row?.data ?? row?.data_importacao ?? "").trim();
}
function getArquivoImportadoTotalItem(row){
  const totalItem=parseCurrencyValue(row?.["Total Item"] ?? row?.total_item);
  return Number.isFinite(totalItem)?totalItem:0;
}
function getSecundarioNfe(row){
  return normalizeImportNfe(row?.["NUM.NF"] ?? row?.numero_nfe ?? row?.num_nf ?? row?.nfe);
}
function getSecundarioField(row,...keys){
  for(const key of keys){
    if(row && row[key]!==undefined && row[key]!==null)return row[key];
  }
  return "";
}
async function sbGetAll(table,query="",pageSize=1000){
  const rows=[];
  for(let from=0;;from+=pageSize){
    const sep=query ? `${query}&` : "";
    const batch=await sbGet(table,`${sep}limit=${pageSize}&offset=${from}`);
    rows.push(...batch);
    if(batch.length<pageSize)break;
  }
  return rows;
}
function formatDataHoraBR(value){
  if(!value)return "—";
  if(/^\d{4}-\d{2}-\d{2}$/.test(String(value)))return formatDataBR(value);
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return formatDataBR(value);
  return date.toLocaleString("pt-BR",{
    timeZone:"America/Sao_Paulo",
    day:"2-digit",
    month:"2-digit",
    year:"numeric",
    hour:"2-digit",
    minute:"2-digit"
  });
}
function agruparArquivosImportados(rows){
  const map=new Map();
  (rows||[]).forEach(row=>{
    const nome=getArquivoImportadoNome(row);
    if(!nome)return;
    if(!map.has(nome)){
      map.set(nome,{
        nome,
        data_arquivo:getArquivoImportadoData(row),
        itens:0,
        nfes:new Set(),
        total:0
      });
    }
    const item=map.get(nome);
    item.itens+=1;
    const dataAtual=getArquivoImportadoData(row);
    if(dataAtual && (!item.data_arquivo || String(dataAtual)>String(item.data_arquivo)))item.data_arquivo=dataAtual;
    const nfe=normalizeImportNfe(row?.["NUM.NF"] ?? row?.numero_nfe ?? row?.num_nf ?? row?.nfe);
    if(nfe)item.nfes.add(nfe);
    item.total+=getArquivoImportadoTotalItem(row);
  });
  return [...map.values()]
    .map(item=>({...item,nfeLista:[...item.nfes],nfes:item.nfes.size,total:+item.total.toFixed(2)}))
    .sort((a,b)=>String(b.data_arquivo||"").localeCompare(String(a.data_arquivo||"")));
}
async function carregarArquivosImportados(){
  const body=document.getElementById("arquivos-body");
  if(body)body.innerHTML=`<tr class="empty-row"><td colspan="4"><div class="empty empty-strong"><p class="loading-text">Carregando</p></div></td></tr>`;
  ensureSession();
  try{
    let rows=[];
    try{
      rows=await sbGetAll(TB_SECUNDARIO,"select=arquivo_nome,data,%22NUM.NF%22,%22Total%20Item%22,%22Quantidade%22,%22Preco%20Unit.%22&arquivo_nome=not.is.null&order=data.desc");
    }catch(e){
      try{
        rows=await sbGetAll(TB_SECUNDARIO,"select=arquivo_nome,data,numero_nfe,total_item,quantidade,valor_unitario&arquivo_nome=not.is.null&order=data.desc");
      }catch(inner){
        rows=await sbGetAll(TB_SECUNDARIO,"select=arquivo_nome,data,numero_nfe,total_item,quantidade,valor_unitario&arquivo_nome=not.is.null");
      }
    }
    todosArquivosImportados=agruparArquivosImportados(rows);
  }catch(e){
    if(isAuthRedirectError(e))return;
    todosArquivosImportados=[];
  }
  renderArquivosImportados(todosArquivosImportados);
}
async function calcularResumoImportacaoPorArquivos(fileNames){
  const nomes=[...new Set((fileNames||[]).map(normalizeArquivoNome).filter(Boolean))];
  let itensImportados=0;
  let totalSecundario=0;
  for(const nome of nomes){
    const safe=restId(nome);
    let secundarioRows=[];
    try{
      secundarioRows=await sbGetAll(TB_SECUNDARIO,`select=%22Total%20Item%22&arquivo_nome=eq.${safe}`);
    }catch(e){
      secundarioRows=await sbGetAll(TB_SECUNDARIO,`select=*&arquivo_nome=eq.${safe}`);
    }
    itensImportados+=secundarioRows.length;
    totalSecundario+=secundarioRows.reduce((sum,row)=>sum+getArquivoImportadoTotalItem(row),0);
  }
  return {
    itensImportados,
    totalSecundario:+totalSecundario.toFixed(2)
  };
}
async function atualizarResumoImportacaoDbStats(fileNames=arquivosResumoImportacao){
  const nomes=[...new Set((fileNames||[]).map(normalizeArquivoNome).filter(Boolean))];
  if(!nomes.length){
    resumoImportacaoDbStats=null;
    return null;
  }
  try{
    resumoImportacaoDbStats=await calcularResumoImportacaoPorArquivos(nomes);
  }catch(e){
    if(isAuthRedirectError(e))throw e;
    console.warn("Resumo real da importação indisponível; mantendo resumo temporário.",e);
    resumoImportacaoDbStats=null;
  }
  return resumoImportacaoDbStats;
}
async function carregarConferenciaFaturamento(){
  try{
    const secundarioRows=await sbGetAll(TB_SECUNDARIO,"select=data,%22NUM.NF%22,%22Total%20Item%22,arquivo_nome&arquivo_nome=not.is.null");
    const totais=new Map();
    secundarioRows.forEach(row=>{
      const data=String(row?.data||"").slice(0,10);
      const nfe=getSecundarioNfe(row);
      if(!data||!nfe)return;
      const key=`${data}|${nfe}`;
      const current=totais.get(key)||{data,nfe,total:0,arquivo_nome:getArquivoImportadoNome(row)};
      current.total+=getArquivoImportadoTotalItem(row);
      if(!current.arquivo_nome)current.arquivo_nome=getArquivoImportadoNome(row);
      totais.set(key,current);
    });

    const novosDiffs=[];
    todosRegistros.forEach(row=>{
      const key=getRegistroAlertKey(row);
      const total=totais.get(key);
      if(!total)return;
      const principalValue=+getRegistroFaturamento(row).toFixed(2);
      const secundarioValue=+total.total.toFixed(2);
      if(Math.abs(principalValue-secundarioValue)>0.02){
        novosDiffs.push({
          type:"diff",
          tipo:"divergente",
          arquivo_nome:total.arquivo_nome,
          data:total.data,
          nfe:total.nfe,
          numero_nfe:total.nfe,
          principal:principalValue,
          valor_principal:principalValue,
          importado:secundarioValue,
          valor_secundario:secundarioValue
        });
      }
    });

    avisosImportacao=[
      ...avisosImportacao.filter(alert=>!isImportDiffAlert(alert)),
      ...novosDiffs
    ];
  }catch(e){
    if(isAuthRedirectError(e))throw e;
    console.warn("Conferência de faturamento indisponível.",e);
  }
}
function renderArquivosImportados(list){
  const body=document.getElementById("arquivos-body");
  if(!body)return;
  if(!list.length){
    body.innerHTML=`<tr class="empty-row"><td colspan="4"><div class="empty empty-strong"><p>Nenhum Arquivo Importado</p></div></td></tr>`;
    return;
  }
  body.innerHTML=list.map(item=>{
    const nome=escapeSaleText(item.nome);
    return `<tr>
      <td class="hl" title="${nome}">${nome}</td>
      <td><span class="history-meta">${formatDataHoraBR(item.data_arquivo)}</span></td>
      <td><span class="money">R$ ${fmt(item.total)}</span></td>
      <td><div class="arquivo-actions">
        <button class="btn btn-secondary btn-sm arquivo-download-btn" data-arquivo-nome="${nome}" onclick="baixarArquivoImportado(this.dataset.arquivoNome)" aria-label="Baixar ${nome}" title="Baixar arquivo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.75v10.1m0 0 4.05-4.05M12 13.85 7.95 9.8M5.25 16.75v2.5h13.5v-2.5"/></svg>
        </button>
        <button class="btn btn-danger btn-sm" data-arquivo-nome="${nome}" onclick="excluirArquivoImportado(this.dataset.arquivoNome)">Excluir</button>
      </div></td>
    </tr>`;
  }).join("");
}
function montarMatrizArquivoImportado(rows){
  const headers=["Cliente","Nome Cliente","Cidade","NUM.NF","data","","Cod.Item","Descricao Item","Quantidade","Preco Unit.","Total Item"];
  const body=(rows||[])
    .slice()
    .sort((a,b)=>
      String(a?.data||"").localeCompare(String(b?.data||"")) ||
      String(getSecundarioNfe(a)).localeCompare(String(getSecundarioNfe(b))) ||
      String(getSecundarioField(a,"Cod.Item","codigo_produto")).localeCompare(String(getSecundarioField(b,"Cod.Item","codigo_produto")))
    )
    .map(row=>[
      getSecundarioField(row,"Cliente","codigo_cliente"),
      getSecundarioField(row,"Nome Cliente","nome_cliente"),
      getSecundarioField(row,"Cidade","cidade"),
      getSecundarioNfe(row),
      getSecundarioField(row,"data","Data"),
      "",
      getSecundarioField(row,"Cod.Item","codigo_produto"),
      getSecundarioField(row,"Descricao Item","descricao_produto","descricao"),
      getSecundarioField(row,"Quantidade","quantidade"),
      getSecundarioField(row,"Preco Unit.","preco_unitario","valor_unitario"),
      getSecundarioField(row,"Total Item","total_item")
    ]);
  return [Array(headers.length).fill(""),Array(headers.length).fill(""),Array(headers.length).fill(""),headers,...body];
}
function matrizParaCsv(matriz){
  return (matriz||[]).map(row=>(row||[]).map(value=>{
    const text=String(value??"");
    return /[;"\r\n]/.test(text) ? `"${text.replace(/"/g,'""')}"` : text;
  }).join(";")).join("\r\n");
}
function baixarBlobArquivo(blob,nome){
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
}
async function baixarArquivoImportado(nome){
  const arquivoNome=normalizeArquivoNome(nome);
  if(!arquivoNome)return;
  try{
    ensureSession();
    const safe=restId(arquivoNome);
    const rows=await sbGetAll(TB_SECUNDARIO,`select=*&arquivo_nome=eq.${safe}&order=data.asc`);
    if(!rows.length){toast("Nenhum item encontrado para este arquivo.","error");return;}
    const matriz=montarMatrizArquivoImportado(rows);
    const ext=(arquivoNome.match(/\.([a-z0-9]+)$/i)?.[1]||"xlsx").toLowerCase();
    const nomeDownload=/\.[a-z0-9]+$/i.test(arquivoNome)?arquivoNome:`${arquivoNome}.${ext}`;
    if(ext==="csv"){
      baixarBlobArquivo(new Blob(["\ufeff"+matrizParaCsv(matriz)],{type:"text/csv;charset=utf-8"}),nomeDownload);
    }else{
      if(!window.XLSX)throw new Error("Biblioteca XLSX indisponível nesta página.");
      const wb=XLSX.utils.book_new();
      const ws=XLSX.utils.aoa_to_sheet(matriz);
      XLSX.utils.book_append_sheet(wb,ws,"Importacao");
      const output=XLSX.write(wb,{bookType:ext==="xls"?"biff8":"xlsx",type:"array"});
      baixarBlobArquivo(new Blob([output],{type:"application/octet-stream"}),nomeDownload);
    }
    toast("Arquivo pronto para baixar.","success");
  }catch(e){
    if(isAuthRedirectError(e))return;
    toast("Erro ao baixar arquivo: "+e.message,"error");
  }
}
function filtrarArquivosImportados(){
  const value=String(document.getElementById("f-arquivos")?.value||"").toLowerCase();
  if(!value){renderArquivosImportados(todosArquivosImportados);return;}
  renderArquivosImportados(todosArquivosImportados.filter(item=>
    item.nome.toLowerCase().includes(value) ||
    (item.nfeLista||[]).some(nfe=>String(nfe).toLowerCase().includes(value)) ||
    String(item.nfes).includes(value) ||
    fmt(item.total).includes(value)
  ));
}
async function sbDeleteWhere(table,query){
  const r=await fetchWithAuth(`${SB_URL}/rest/v1/${table}?${query}`,{method:"DELETE",headers:{"Prefer":"return=minimal"}});
  if(!r.ok)throw new Error(await r.text());
  notifyDashboardDataChanged({source:"delete-where",table});
}
async function excluirArquivoImportado(nome){
  const arquivoNome=normalizeArquivoNome(nome);
  if(!arquivoNome)return;
  confirmar(
    "Excluir este arquivo importado?",
    "Os dados desse arquivo serão removidos do Banco de Dados.",
    async()=>{
      const anterior=[...todosArquivosImportados];
      todosArquivosImportados=todosArquivosImportados.filter(item=>normalizeArquivoNome(item.nome)!==arquivoNome);
      avisosImportacao=avisosImportacao.filter(alert=>normalizeArquivoNome(alert.arquivo_nome)!==arquivoNome);
      arquivosResumoImportacao=arquivosResumoImportacao.filter(item=>normalizeArquivoNome(item)!==arquivoNome);
      resumoImportacaoDbStats=null;
      filtrarArquivosImportados();
      renderImportAlerts();
      try{
        ensureSession();
        const safe=restId(arquivoNome);

        let rpcOk=false;
        try{
          await sbRpc("excluir_importacao_arquivo",{p_arquivo_nome:arquivoNome});
          rpcOk=true;
        }catch(rpcError){
          if(isAuthRedirectError(rpcError))throw rpcError;
          console.warn("Exclusão completa no Supabase indisponível; usando fallback REST.",rpcError);
        }

        if(!rpcOk){
          await sbDeleteWhere(TB_VENDAS,`arquivo_nome=eq.${safe}`);
          await sbDeleteWhere(TB_SECUNDARIO,`arquivo_nome=eq.${safe}`);
        }
        limpezaImportacoesOrfasExecutada=true;
        if(document.getElementById("page-historico")?.classList.contains("active"))await carregarHistorico({sincronizar:false});
        toast("Arquivo importado excluído","success");
      }catch(e){
        if(isAuthRedirectError(e))return;
        todosArquivosImportados=anterior;
        filtrarArquivosImportados();
        toast("Erro ao excluir arquivo: "+e.message,"error");
      }
    }
  );
}

// ── AUTOCOMPLETE CLIENTE ──────────────────────────────────────────────────
async function acCliente(val){
  const lista=document.getElementById("ac-cli");
  await ensureClientesLoaded();
  const base=getCadastroClientesList();
  const termo=String(val||"").trim();
  if(!base.length){lista.style.display="none";return;}
  const v=termo.toLowerCase();
  const res=(v
    ? base.filter(c=>getClienteCodigo(c).includes(v)||getClienteNome(c).toLowerCase().includes(v))
    : base
  );
  if(!res.length){lista.style.display="none";return;}
  lista.innerHTML=res.map(c=>{
    const codigo=escapeSaleText(getClienteCodigo(c));
    const nome=escapeSaleText(getClienteNome(c));
    return `<div class="ac-item" onclick="selCliente('${inlineMetaId(getClienteCodigo(c))}')"><span class="ac-code">${codigo}</span><span class="ac-name">${nome}</span></div>`;
  }).join("");
  lista.style.display="block";
}
function selCliente(cod){
  const c=getCadastroClientesList().find(x=>getClienteCodigo(x)===cod);if(!c)return;
  document.getElementById("v-cli-cod").value=getClienteCodigo(c);
  document.getElementById("v-cli-nome").value=getClienteNome(c);
  document.getElementById("ac-cli").style.display="none";
}

// ── AUTOCOMPLETE PRODUTO ──────────────────────────────────────────────────
function acProduto(id,val){
  const lista=document.getElementById("ac-p-"+id);
  if(!val||val.length<1){lista.style.display="none";return;}
  const v=val.toLowerCase();
  const res=PRODUTOS.filter(p=>p.codigo.includes(v)||p.nome.toLowerCase().includes(v)).slice(0,8);
  if(!res.length){lista.style.display="none";return;}
  lista.innerHTML=res.map(p=>`<div class="ac-item" onclick="selProduto(${id},'${p.codigo}')"><span class="ac-code">${p.codigo}</span><span class="ac-name">${p.nome}</span><span class="ac-price">R$ ${fmt(p.preco_unitario)}</span></div>`).join("");
  lista.style.display="block";
}
function selProduto(id,cod){
  const p=PRODUTOS.find(x=>x.codigo===cod);if(!p)return;
  document.getElementById("i-cod-"+id).value=p.codigo;
  document.getElementById("i-nome-"+id).value=p.nome;
  document.getElementById("i-preco-"+id).value=p.preco_unitario;
  document.getElementById("ac-p-"+id).style.display="none";
  calcItemTotal(id);
}

document.addEventListener("click",e=>{
  if(!e.target.closest(".ac-wrap"))document.querySelectorAll(".ac-list").forEach(l=>l.style.display="none");
});

// ── TOGGLE OFERTA ─────────────────────────────────────────────────────────
function toggleOferta(){
  ofertaAtiva=!ofertaAtiva;
  document.getElementById("tgl-oferta").classList.toggle("on",ofertaAtiva);
  const l=document.getElementById("tgl-label");
  l.textContent=ofertaAtiva?"Sim":"Não";l.classList.toggle("on",ofertaAtiva);
}

// ── ITENS ─────────────────────────────────────────────────────────────────
function formatFileSize(bytes){
  const size=Number(bytes)||0;
  if(size>=1024*1024)return (size/(1024*1024)).toFixed(2).replace(".",",")+" MB";
  if(size>=1024)return (size/1024).toFixed(1).replace(".",",")+" KB";
  return size+" B";
}
function getFileExt(file){
  const name=file?.name||"";
  const ext=name.includes(".")?name.split(".").pop().toUpperCase():"ARQUIVO";
  return ext.slice(0,8);
}
function getSaleFileDisplayName(file){
  return String(file?.name||"").replace(/\.(xlsx|csv)$/i,"").trim();
}
function getExcelFileIcon(){
  return `<svg class="sale-file-excel-icon" viewBox="0 0 28 28" aria-hidden="true">
    <rect class="excel-sheet" x="8.5" y="3.5" width="15" height="21" rx="2.4"/>
    <path class="excel-fold" d="M19.5 3.5v5h4"/>
    <rect class="excel-panel" x="4" y="8" width="13" height="13" rx="2"/>
    <path class="excel-x" d="M8.1 11.3l4.8 6.4M12.9 11.3l-4.8 6.4"/>
  </svg>`;
}
function isSaleImportFile(file){
  return /\.(xlsx|csv)$/i.test(file?.name||"");
}
function getSaleFileKey(file){
  return `${file.name}|${file.size}|${file.lastModified}`;
}
function escapeSaleText(value){
  return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function getSaleFilesTotal(files){
  return files.reduce((sum,file)=>sum+(Number(file.size)||0),0);
}
function renderSaleImportFiles(){
  const list=document.getElementById("sale-file-list");
  const zone=document.getElementById("sale-upload-zone");
  const label=document.getElementById("sale-upload-label");
  if(!list)return;

  if(!saleImportFiles.length){
    list.hidden=true;
    list.innerHTML="";
    if(zone){
      zone.classList.remove("has-file","single-file","multi-file");
      zone.style.removeProperty("--sale-upload-height");
    }
    if(label)label.innerHTML="<strong>Solte os arquivos aqui para enviar</strong><small>ou clique aqui para procurar</small>";
    return;
  }

  list.hidden=false;
  list.innerHTML=saleImportFiles.map((file,index)=>{
    const safeName=escapeSaleText(file.name);
    const safeDisplayName=escapeSaleText(getSaleFileDisplayName(file)||file.name);
    const status=saleImportProgress?.fileName===file.name ? saleImportProgress : null;
    const pct=status ? Math.max(0,Math.min(100,Number(status.percent)||0)) : 0;
    const statusText=status?.message ? escapeSaleText(status.message) : formatFileSize(file.size);
    const uploadingClass=status ? " is-uploading" : "";
    const disabled=status ? " disabled" : "";
    return `
      <div class="sale-file-preview${uploadingClass}">
        <div class="sale-file-icon">${getExcelFileIcon()}</div>
        <div class="sale-file-info">
          <strong title="${safeName}">${safeDisplayName}</strong>
          <span>${statusText}</span>
          ${status?`<div class="sale-file-progress" style="--sale-file-progress:${pct}%"><i></i></div>`:""}
        </div>
        <button class="sale-file-remove" type="button" title="Remover arquivo" aria-label="Remover arquivo" onclick="removeSaleImportFile(${index})"${disabled}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M6 7l1 14h10l1-14"/>
            <path d="M9 7V4h6v3"/>
          </svg>
        </button>
      </div>
    `;
  }).join("");
  if(zone){
    const fileCount=saleImportFiles.length;
    const uploadHeight=284;
    zone.classList.add("has-file");
    zone.classList.toggle("single-file",fileCount===1);
    zone.classList.toggle("multi-file",fileCount>1);
    zone.style.setProperty("--sale-upload-height",uploadHeight+"px");
  }
  if(label)label.innerHTML="Adicionar mais arquivos";
}
function setSaleImportProgress(progress){
  saleImportProgress=progress;
  renderSaleImportFiles();
}
function addSaleImportFiles(files){
  if(saleImportProgress){
    toast("Aguarde o envio atual terminar.","error");
    return;
  }
  const incoming=Array.from(files||[]);
  if(!incoming.length)return;
  const keys=new Set(saleImportFiles.map(getSaleFileKey));
  const rejected=[];
  const next=[...saleImportFiles];

  for(const file of incoming){
    if(!isSaleImportFile(file)){
      rejected.push(`${file.name} não é .xlsx ou .csv`);
      continue;
    }
    if(keys.has(getSaleFileKey(file)))continue;
    if(next.length>=SALE_IMPORT_MAX_FILES){
      rejected.push(`limite de ${SALE_IMPORT_MAX_FILES} arquivos`);
      break;
    }
    if(file.size>SALE_IMPORT_MAX_FILE_SIZE){
      rejected.push(`${file.name} passa de ${formatFileSize(SALE_IMPORT_MAX_FILE_SIZE)}`);
      continue;
    }
    if(getSaleFilesTotal(next)+file.size>SALE_IMPORT_MAX_TOTAL_SIZE){
      rejected.push(`limite total de ${formatFileSize(SALE_IMPORT_MAX_TOTAL_SIZE)}`);
      break;
    }
    next.push(file);
    keys.add(getSaleFileKey(file));
  }

  saleImportFiles=next;
  renderSaleImportFiles();
  if(rejected.length)toast("Arquivo ignorado: "+rejected[0],"error");
}
function removeSaleImportFile(index){
  if(saleImportProgress)return;
  saleImportFiles.splice(index,1);
  renderSaleImportFiles();
}
function clearSaleImportFile(){
  if(saleImportProgress)return;
  saleImportFiles=[];
  const input=document.getElementById("sale-file-input");
  if(input)input.value="";
  renderSaleImportFiles();
}
function hasDraggedFiles(event){
  return Array.from(event?.dataTransfer?.types||[]).includes("Files");
}
function getDroppedFiles(dataTransfer){
  const items=Array.from(dataTransfer?.items||[])
    .filter(item=>item.kind==="file")
    .map(item=>item.getAsFile())
    .filter(Boolean);
  return items.length ? items : Array.from(dataTransfer?.files||[]);
}
function initSaleFileImport(){
  const input=document.getElementById("sale-file-input");
  const zone=document.getElementById("sale-upload-zone");
  if(!input||!zone)return;

  zone.addEventListener("click",()=>input.click());
  zone.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===" "){e.preventDefault();input.click();}
  });
  input.addEventListener("change",()=>{
    addSaleImportFiles(input.files);
    input.value="";
  });

  function prepareFileDrag(event){
    if(!hasDraggedFiles(event))return false;
    event.preventDefault();
    event.stopPropagation();
    document.body.classList.remove("sale-file-dragging-blocked");
    if(event.dataTransfer)event.dataTransfer.dropEffect="copy";
    return true;
  }
  function setDragOver(active){
    zone.classList.toggle("drag-over",active);
  }
  function clearBlockedDrag(){
    document.body.classList.remove("sale-file-dragging-blocked");
    setDragOver(false);
  }
  function blockPageDrop(event){
    if(!hasDraggedFiles(event) || zone.contains(event.target))return false;
    event.preventDefault();
    event.stopPropagation();
    document.body.classList.add("sale-file-dragging-blocked");
    setDragOver(false);
    if(event.dataTransfer)event.dataTransfer.dropEffect="none";
    return true;
  }
  const dropTarget=zone;
  ["dragenter","dragover"].forEach(type=>{
    dropTarget.addEventListener(type,event=>{
      if(prepareFileDrag(event))setDragOver(true);
    });
  });
  dropTarget.addEventListener("dragleave",event=>{
    if(!prepareFileDrag(event))return;
    if(!dropTarget.contains(event.relatedTarget))setDragOver(false);
  });
  dropTarget.addEventListener("drop",event=>{
    if(!prepareFileDrag(event))return;
    setDragOver(false);
    addSaleImportFiles(getDroppedFiles(event.dataTransfer));
  });
  document.addEventListener("dragenter",event=>{
    blockPageDrop(event);
  },true);
  document.addEventListener("dragover",event=>{
    blockPageDrop(event);
  },true);
  document.addEventListener("drop",event=>{
    blockPageDrop(event);
    clearBlockedDrag();
  },true);
  document.addEventListener("dragend",clearBlockedDrag);
}
async function readXlsxMatrix(file){
  if(!window.XLSX)throw new Error("Leitor XLSX não carregado.");
  const buffer=await file.arrayBuffer();
  const workbook=XLSX.read(buffer,{type:"array",cellDates:true});
  const firstSheet=workbook.Sheets[workbook.SheetNames[0]];
  if(!firstSheet)throw new Error(`Arquivo ${file.name} sem planilha.`);
  return XLSX.utils.sheet_to_json(firstSheet,{header:1,raw:true,defval:null});
}
function parseCsvLine(line,delimiter){
  const cells=[];
  let value="";
  let quoted=false;
  for(let i=0;i<line.length;i++){
    const char=line[i];
    if(char==='"'){
      if(quoted && line[i+1]==='"'){
        value+='"';
        i++;
      }else quoted=!quoted;
      continue;
    }
    if(char===delimiter && !quoted){
      cells.push(value);
      value="";
      continue;
    }
    value+=char;
  }
  cells.push(value);
  return cells;
}
function detectCsvDelimiter(text){
  const lines=String(text||"").split(/\r?\n/).slice(0,8).filter(Boolean);
  const delimiters=[";","\t",",","|"];
  return delimiters
    .map(delimiter=>({
      delimiter,
      score:lines.reduce((sum,line)=>sum+parseCsvLine(line,delimiter).length,0)
    }))
    .sort((a,b)=>b.score-a.score)[0]?.delimiter || ";";
}
async function readCsvMatrix(file){
  const buffer=await file.arrayBuffer();
  let text=new TextDecoder("utf-8").decode(buffer);
  if(text.includes("\uFFFD"))text=new TextDecoder("windows-1252").decode(buffer);
  text=text.replace(/^\uFEFF/,"");
  const delimiter=detectCsvDelimiter(text);
  return text.split(/\r?\n/)
    .filter((line,index)=>line.trim() || index<4)
    .map(line=>parseCsvLine(line,delimiter));
}
async function readImportMatrix(file){
  return /\.csv$/i.test(file?.name||"") ? readCsvMatrix(file) : readXlsxMatrix(file);
}
function normalizeImportText(value){
  return String(value??"")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-zA-Z0-9]+/g," ")
    .trim()
    .toUpperCase();
}
function findImportColumn(headers,aliases){
  const normalized=headers.map(normalizeImportText);
  for(const alias of aliases.map(normalizeImportText).filter(Boolean)){
    const exact=normalized.indexOf(alias);
    if(exact>=0)return exact;
  }
  for(const alias of aliases.map(normalizeImportText).filter(Boolean)){
    const partial=normalized.findIndex(header=>header && (header.includes(alias) || alias.includes(header)));
    if(partial>=0)return partial;
  }
  return -1;
}
function parseImportDateToTime(value){
  const iso=parseImportDate(value);
  if(!iso)return NaN;
  const [year,month,day]=iso.split("-").map(Number);
  return Date.UTC(year,month-1,day);
}
function getImportPeriod(linhas){
  const values=(linhas||[]).slice(0,3).flat();
  const times=[];
  values.forEach(value=>{
    const time=parseImportDateToTime(value);
    if(Number.isFinite(time))times.push(time);
  });
  if(times.length<2)return null;
  times.sort((a,b)=>a-b);
  return {start:times[0],end:times[times.length-1]};
}
function findImportDateColumn(linhas,headers){
  const rawChassi=findImportColumn(headers,["chassi"]);
  if(rawChassi>=0){
    const hasChassiDates=(linhas||[]).slice(4,90).some(row=>Array.isArray(row)&&Number.isFinite(parseImportDateToTime(row[rawChassi])));
    if(hasChassiDates)return rawChassi;
  }
  const explicit=findImportColumn(headers,["data","data emissao","dt emissao","emissao","data venda"]);
  const period=getImportPeriod(linhas);
  const maxCols=Math.max(0,...(linhas||[]).slice(0,80).map(row=>Array.isArray(row)?row.length:0));
  const candidates=[];
  for(let col=0;col<maxCols;col++){
    let count=0;
    let inside=0;
    for(const row of (linhas||[]).slice(4,90)){
      if(!Array.isArray(row))continue;
      const time=parseImportDateToTime(row[col]);
      if(!Number.isFinite(time))continue;
      count++;
      if(period && time>=period.start && time<=period.end)inside++;
    }
    if((period && inside>0) || (!period && count>=3))candidates.push({col,count,inside,explicit:col===explicit});
  }
  if(period && candidates.length){
    return candidates.sort((a,b)=>
      b.inside-a.inside ||
      b.count-a.count ||
      Number(b.explicit)-Number(a.explicit)
    )[0].col;
  }
  if(explicit>=0)return explicit;
  return candidates.sort((a,b)=>b.count-a.count)[0]?.col ?? -1;
}
function normalizarMatrizSecundariaParaBanco(linhas){
  if(!Array.isArray(linhas)||linhas.length<5)throw new Error("O arquivo precisa ter cabeçalho na linha 4 e dados a partir da linha 5.");
  const header=linhas[3]||[];
  const dataCol=findImportDateColumn(linhas,header);
  const nfeCol=findImportColumn(header,["numero nfe","nfe","nf","nota fiscal","num nf","numero nf"]);
  const clientCodeCol=findImportColumn(header,["codigo cliente","cod cliente","cliente codigo","cod cli","cliente"]);
  const clientNameCol=findImportColumn(header,["nome cliente","cliente nome","razao social","nome"]);
  const cityCol=findImportColumn(header,["cidade","municipio"]);
  const productCol=findImportColumn(header,["codigo produto","cod produto","cod item","codigo item","coditem","produto codigo","produto"]);
  const descCol=findImportColumn(header,["descricao","descricao produto","nome produto","produto nome","item descricao","desc item"]);
  const qtyCol=findImportColumn(header,["quantidade","qtd","qtde","qtd item"]);
  const unitCol=findImportColumn(header,["valor unitario","preco unitario","unitario","valor produto","preco","vl unitario","vl unit"]);
  const totalCol=findImportColumn(header,["total item","valor total","vl total","total","faturamento","valor mercadoria"]);

  if(dataCol<0||nfeCol<0)throw new Error("O arquivo precisa ter colunas de Data e NFE na linha 4.");
  if(productCol<0)throw new Error("O arquivo precisa ter coluna de Código do Produto na linha 4.");
  if(descCol<0)throw new Error("O arquivo precisa ter coluna de Descrição do Produto na linha 4.");
  if(totalCol<0&&(qtyCol<0||unitCol<0))throw new Error("O arquivo precisa ter Valor Total ou Quantidade + Valor Unitário.");

  const normalized=[
    Array(11).fill(null),
    Array(11).fill(null),
    Array(11).fill(null),
    ["Cliente","Nome Cliente","Cidade","NUM.NF","data",null,"Cod.Item","Descricao Item","Quantidade","Preco Unit.","Total Item"]
  ];

  linhas.slice(4).forEach(row=>{
    if(!Array.isArray(row))return;
    normalized.push([
      clientCodeCol>=0 ? row[clientCodeCol] : null,
      clientNameCol>=0 ? row[clientNameCol] : null,
      cityCol>=0 ? row[cityCol] : null,
      row[nfeCol],
      row[dataCol],
      null,
      row[productCol],
      row[descCol],
      qtyCol>=0 ? row[qtyCol] : null,
      unitCol>=0 ? row[unitCol] : null,
      totalCol>=0 ? row[totalCol] : null
    ]);
  });

  return normalized;
}
function parseImportDate(value){
  if(value instanceof Date && !Number.isNaN(value.getTime())){
    return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,"0")}-${String(value.getDate()).padStart(2,"0")}`;
  }
  if(typeof value==="number"&&Number.isFinite(value)){
    const epoch=new Date(Date.UTC(1899,11,30));
    epoch.setUTCDate(epoch.getUTCDate()+Math.floor(value));
    return `${epoch.getUTCFullYear()}-${String(epoch.getUTCMonth()+1).padStart(2,"0")}-${String(epoch.getUTCDate()).padStart(2,"0")}`;
  }
  const text=String(value??"").trim();
  if(!text)return "";
  const iso=text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if(iso)return `${iso[1]}-${String(iso[2]).padStart(2,"0")}-${String(iso[3]).padStart(2,"0")}`;
  const br=text.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/);
  if(br){
    const year=br[3].length===2?`20${br[3]}`:br[3];
    return `${year}-${String(br[2]).padStart(2,"0")}-${String(br[1]).padStart(2,"0")}`;
  }
  const date=new Date(text);
  if(Number.isNaN(date.getTime()))return "";
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function normalizeImportNfe(value){
  const text=String(value??"").trim();
  if(!text)return "";
  const numeric=Number(text.replace(/\./g,"").replace(",","."));
  if(Number.isFinite(numeric)&&/^[\d.,]+$/.test(text))return String(Math.trunc(numeric));
  return text.replace(/\.0+$/,"");
}
function compactarMatrizSecundaria(linhas){
  const header=linhas[3]||[];
  const dataCol=findImportColumn(header,["data","data emissao","dt emissao","emissao","data venda","chassi"]);
  const nfeCol=findImportColumn(header,["numero nfe","nfe","nf","nota fiscal","num nf","numero nf"]);
  const clientCodeCol=findImportColumn(header,["codigo cliente","cod cliente","cliente codigo","cliente"]);
  const clientNameCol=findImportColumn(header,["nome cliente","cliente nome","razao social","nome"]);
  const totalCol=findImportColumn(header,["total item","valor total","vl total","total","faturamento"]);
  const qtyCol=findImportColumn(header,["quantidade","qtd","qtde"]);
  const unitCol=findImportColumn(header,["valor unitario","preco unitario","unitario","valor produto","preco"]);

  if(dataCol<0||nfeCol<0)throw new Error("O arquivo precisa ter colunas de data e NFE na linha 4.");
  if(totalCol<0&&(qtyCol<0||unitCol<0))throw new Error("O arquivo precisa ter valor total ou quantidade + valor unitário.");

  const grouped=new Map();
  linhas.slice(4).forEach(row=>{
    if(!Array.isArray(row))return;
    const data=parseImportDate(row[dataCol]);
    const numero_nfe=normalizeImportNfe(row[nfeCol]);
    if(!data||!numero_nfe)return;
    const itemTotal=totalCol>=0
      ? parseCurrencyValue(row[totalCol])
      : parseCurrencyValue(row[qtyCol])*parseCurrencyValue(row[unitCol]);
    if(!Number.isFinite(itemTotal)||itemTotal<=0)return;
    const key=`${data}|${numero_nfe}`;
    if(!grouped.has(key)){
      grouped.set(key,{
        data,
        numero_nfe,
        codigo_cliente:String(row[clientCodeCol]??"").trim(),
        nome_cliente:String(row[clientNameCol]??"").trim(),
        faturamento:0
      });
    }
    grouped.get(key).faturamento+=itemTotal;
  });

  return [...grouped.values()].map(item=>({
    ...item,
    faturamento:+item.faturamento.toFixed(2)
  }));
}
function criarItensSecundariosParaBanco(linhas,fileName){
  const itens=[];
  linhas.slice(4).forEach(row=>{
    if(!Array.isArray(row))return;
    const data=parseImportDate(row[4]);
    const numero_nfe=normalizeImportNfe(row[3]);
    const codigo_produto=String(row[6]??"").trim();
    const descricao=String(row[7]??"").trim();
    if(!data||!numero_nfe||!codigo_produto||!descricao)return;
    let quantidade=parseCurrencyValue(row[8]);
    if(!Number.isFinite(quantidade)||quantidade<=0)quantidade=1;
    let valor_unitario=parseCurrencyValue(row[9]);
    let total_item=parseCurrencyValue(row[10]);
    if((!Number.isFinite(total_item)||total_item<=0)&&Number.isFinite(valor_unitario)){
      total_item=quantidade*valor_unitario;
    }
    if(!Number.isFinite(total_item)||total_item<=0)return;
    if((!Number.isFinite(valor_unitario)||valor_unitario<=0)&&quantidade>0){
      valor_unitario=total_item/quantidade;
    }
    itens.push({
      "Cliente":String(row[0]??"").trim(),
      "Nome Cliente":String(row[1]??"").trim(),
      "Cidade":String(row[2]??"").trim(),
      "NUM.NF":numero_nfe,
      data,
      "Cod.Item":codigo_produto,
      "Descricao Item":descricao,
      "Quantidade":+quantidade.toFixed(4),
      "Preco Unit.":+(Number(valor_unitario)||0).toFixed(4),
      "Total Item":+total_item.toFixed(2),
      arquivo_nome:fileName
    });
  });
  return itens;
}
async function reconciliarImportacaoPrincipal(compactas,fileName=""){
  return [];
}
async function reconciliarImportacaoNoBanco(fileName,compactas){
  return [];
}
async function limparImportacaoParcial(nome){
  const arquivoNome=normalizeArquivoNome(nome);
  const safe=restId(arquivoNome);
  try{
    await sbRpc("excluir_importacao_arquivo",{p_arquivo_nome:arquivoNome});
    return;
  }catch(e){
    if(isAuthRedirectError(e))throw e;
  }
  try{await sbDeleteWhere(TB_VENDAS,`arquivo_nome=eq.${safe}`);}catch(e){}
  try{await sbDeleteWhere(TB_SECUNDARIO,`arquivo_nome=eq.${safe}`);}catch(e){}
}
async function inserirItensSecundariosDireto(itens,fileName,onProgress){
  if(!itens.length)throw new Error("Arquivo sem itens válidos para importar.");
  await limparImportacaoParcial(fileName);
  let inseridos=0;
  const totalChunks=Math.ceil(itens.length/SALE_IMPORT_CHUNK_ROWS);
  for(let i=0;i<itens.length;i+=SALE_IMPORT_CHUNK_ROWS){
    const chunkIndex=Math.floor(i/SALE_IMPORT_CHUNK_ROWS)+1;
    if(onProgress)onProgress(chunkIndex,totalChunks,inseridos);
    await sbPost(TB_SECUNDARIO,itens.slice(i,i+SALE_IMPORT_CHUNK_ROWS));
    inseridos+=Math.min(SALE_IMPORT_CHUNK_ROWS,itens.length-i);
  }
  return inseridos;
}
async function importarItensSecundariosNoBanco(linhas,itens,fileName,onProgress){
  if(!itens.length)throw new Error("Arquivo sem itens válidos para importar.");
  try{
    if(onProgress)onProgress(1,1,0);
    const total=await sbRpc("importar_bd_secundario_matriz",{
      p_linhas:linhas,
      p_arquivo_nome:fileName,
      p_substituir:true
    });
    return Number(total)||itens.length;
  }catch(e){
    if(isAuthRedirectError(e))throw e;
    console.warn("Importação em lote indisponível; usando fallback por chunks.",e);
    return inserirItensSecundariosDireto(itens,fileName,onProgress);
  }
}
async function importarArquivosSecundarios(files){
  let inseridos=0;
  let avisos=0;
  avisosImportacao=[];
  resumoImportacaoDbStats=null;
  arquivosResumoImportacao=[...new Set([...files].map(file=>normalizeArquivoNome(file.name)).filter(Boolean))];
  resumoImportacaoAtivo=true;
  const btn=document.getElementById("btn-salvar");
  for(let fileIndex=0;fileIndex<files.length;fileIndex+=1){
    const file=files[fileIndex];
    try{
      setSaleImportProgress({fileName:file.name,percent:2,message:"Lendo arquivo..."});
      if(btn)btn.innerHTML='<span class="spinner"></span> Lendo...';
      const linhasOriginais=await readImportMatrix(file);
      const linhas=normalizarMatrizSecundariaParaBanco(linhasOriginais);
      const itens=criarItensSecundariosParaBanco(linhas,file.name);
      const total=await importarItensSecundariosNoBanco(linhas,itens,file.name,(chunkIndex,totalChunks,totalInseridos)=>{
        const percent=Math.round(((chunkIndex-1)/totalChunks)*78)+7;
        setSaleImportProgress({
          fileName:file.name,
          percent,
          message:`Enviando ${chunkIndex}/${totalChunks} · ${totalInseridos} itens`
        });
        if(btn)btn.innerHTML=`<span class="spinner"></span> Enviando ${chunkIndex}/${totalChunks}`;
      });
      inseridos+=Number(total)||0;
      setSaleImportProgress({fileName:file.name,percent:94,message:"Finalizando importação..."});
      if(btn)btn.innerHTML='<span class="spinner"></span> Finalizando...';
      setSaleImportProgress({fileName:file.name,percent:100,message:"Arquivo enviado."});
    }catch(e){
      if(isAuthRedirectError(e))throw e;
      setSaleImportProgress({fileName:file.name,percent:100,message:"Falha no envio. Limpando parcial..."});
      await limparImportacaoParcial(file.name);
      setSaleImportProgress(null);
      throw e;
    }
  }
  setSaleImportProgress(null);
  await atualizarResumoImportacaoDbStats();
  renderImportAlerts();
  await carregarArquivosImportados();
  return {inseridos,avisos};
}
function addItem(){
  const lista=document.getElementById("itens-lista");
  if(!lista)return;
  const id=++itemId;itemRows.push(id);
  const el=document.createElement("div");
  el.className="item-row";el.id="irow-"+id;
  el.innerHTML=`
    <div class="ac-wrap">
      <input type="text" id="i-cod-${id}" placeholder="Código" autocomplete="off" oninput="acProduto(${id},this.value)" style="font-family:var(--sans);font-size:12px"/>
      <div class="ac-list" id="ac-p-${id}" style="display:none"></div>
    </div>
    <input type="text" id="i-nome-${id}" placeholder="Nome do produto" readonly style="color:#fff"/>
    <input type="number" id="i-preco-${id}" placeholder="0,00" step="0.01" oninput="calcItemTotal(${id})"/>
    <input type="number" id="i-qtd-${id}" value="1" min="1" step="1" oninput="calcItemTotal(${id})"/>
    <div class="total-cell" id="i-tot-${id}">R$ 0,00</div>
    <button class="btn-rm" onclick="removeItem(${id})" title="Remover">X</button>
  `;
  lista.appendChild(el);
  updateSummary();
}
function calcItemTotal(id){
  const p=parseFloat(document.getElementById("i-preco-"+id)?.value)||0;
  const q=parseFloat(document.getElementById("i-qtd-"+id)?.value)||0;
  document.getElementById("i-tot-"+id).textContent="R$ "+fmt(p*q);
  updateSummary();
}
function removeItem(id){
  itemRows=itemRows.filter(r=>r!==id);
  document.getElementById("irow-"+id).remove();
  updateSummary();
}
function updateSummary(){
  const sumItens=document.getElementById("sum-itens");
  const sumTotal=document.getElementById("sum-total");
  if(!sumItens||!sumTotal)return;
  let tot=0,qtd=0;
  itemRows.forEach(id=>{
    const p=parseFloat(document.getElementById("i-preco-"+id)?.value)||0;
    const q=parseFloat(document.getElementById("i-qtd-"+id)?.value)||0;
    tot+=p*q;qtd+=q;
  });
  sumItens.textContent=qtd%1===0?qtd:qtd.toFixed(2);
  sumTotal.textContent="R$ "+fmt(tot);
}

// ── SALVAR VENDA ──────────────────────────────────────────────────────────
function salvarDadosNotaFiscal(){
  const data=document.getElementById("v-data").value;
  const codCli=document.getElementById("v-cli-cod").value.trim();
  const faturamento=document.getElementById("v-faturamento").value.trim();
  if(!data){toast("Informe a data","error");return;}
  if(!codCli){toast("Selecione um cliente","error");return;}
  if(!faturamento){toast("Informe o faturamento","error");return;}
  toast("Dados da nota fiscal salvos","success");
}
async function salvarVenda(){
  const data=document.getElementById("v-data").value;
  const horario=document.getElementById("v-hora").value;
  const nfe=document.getElementById("v-nfe").value.trim();
  const codCli=document.getElementById("v-cli-cod").value.trim();
  const nomeCli=document.getElementById("v-cli-nome").value.trim();
  const faturamento=document.getElementById("v-faturamento").value.trim();
  const temArquivo=saleImportFiles.length>0;
  const temNotaManual=Boolean(nfe||codCli||nomeCli||faturamento);
  if(!temArquivo||temNotaManual){
    if(!data){toast("Informe a data","error");return;}
    if(!nfe){toast("Informe o número NFE","error");return;}
    if(!codCli){toast("Selecione um cliente","error");return;}
    if(!faturamento){toast("Informe o faturamento","error");return;}
  }

  const btn=document.getElementById("btn-salvar");
  btn.innerHTML='<span class="spinner"></span> Salvando...';btn.disabled=true;
  const valor=parseCurrencyValue(faturamento);
  const payload=temNotaManual?{
    data,
    horario:horario||null,
    numero_nfe:nfe,
    codigo_cliente:codCli,
    nome_cliente:nomeCli||codCli,
    faturamento:valor,
    oferta_ativa:ofertaAtiva
  }:null;
  try{
    ensureSession();
    if(payload)await sbPost(TB_VENDAS,payload);
    let resultadoImport={inseridos:0,avisos:0};
    if(saleImportFiles.length){
      try{
        resultadoImport=await importarArquivosSecundarios(saleImportFiles);
      }catch(importError){
        if(isAuthRedirectError(importError))return;
        toast((payload?"Nota salva, mas o import do arquivo falhou: ":"Import do arquivo falhou: ")+importError.message,"error");
        return;
      }
    }
    toast(saleImportFiles.length?`${payload?"Registro salvo e arquivo importado":"Arquivo importado"}, ${resultadoImport.inseridos} itens no Banco de Dados.`:"Registro salvo.","success");
    limparVenda();
  }catch(e){
    if(isAuthRedirectError(e))return;
    toast("Erro ao salvar: "+e.message,"error");
  }finally{
    btn.innerHTML="Salvar";btn.disabled=false;
  }
}
function salvarRegistro(){
  return salvarVenda();
}
function limparVenda(){
  document.getElementById("v-faturamento").value="";
  document.getElementById("v-nfe").value="";
  document.getElementById("v-cli-cod").value="";
  document.getElementById("v-cli-nome").value="";
  ofertaAtiva=false;
  document.getElementById("tgl-oferta").classList.remove("on");
  const l=document.getElementById("tgl-label");l.textContent="Não";l.classList.remove("on");
  const itensLista=document.getElementById("itens-lista");
  if(itensLista)itensLista.innerHTML="";
  itemRows=[];itemId=0;
  clearSaleImportFile();
  setSaleDateTimeToBrasiliaNow();
  addItem();
}

function fecharEstadosTemporariosSistema(){
  document.querySelectorAll(".modal-bg.open").forEach(modal=>modal.classList.remove("open"));
  document.querySelectorAll(".ac-list").forEach(lista=>lista.style.display="none");
  fecharHistoricoPeriodoMenu();
  fecharToast();
}

function resetHistoricoParaPadrao(){
  const busca=document.getElementById("f-txt");
  if(busca){
    busca.value="";
    busca.placeholder="Buscar NF, cliente...";
  }
  historicoModo="principal";
  historicoPeriodoMes="";
  historicoPeriodoAno="";
  document.querySelectorAll("[data-history-mode]").forEach(btn=>btn.classList.toggle("active",btn.dataset.historyMode==="principal"));
  atualizarHistoricoPeriodoLabel();
  fecharHistoricoPeriodoMenu();
  renderHistoricoCabecalho("principal");
}

function resetCadastroParaPadrao(){
  ["f-cli","f-meta","f-arquivos"].forEach(id=>{
    const input=document.getElementById(id);
    if(input)input.value="";
  });
  setCadastro("clientes");
}

window.resetSistemaPageState=function(pageKey){
  fecharEstadosTemporariosSistema();
  if(pageKey==="nova-venda"){
    limparVenda();
    return;
  }
  if(pageKey==="historico"){
    resetHistoricoParaPadrao();
    return;
  }
  if(pageKey==="cadastro"){
    resetCadastroParaPadrao();
  }
};

// ── HISTÓRICO ─────────────────────────────────────────────────────────────
async function carregarImportAlerts(){
  renderImportAlerts();
}
async function limparImportacoesOrfasSePossivel(force=false){
  if(limpezaImportacoesOrfasExecutada&&!force)return;
  limpezaImportacoesOrfasExecutada=true;
}
async function carregarConversoes(){
  ensureSession();
  try{
    todasConversoes=await sbGetAll(TB_CONVERSOES,"select=*&order=data.desc");
  }catch(e){
    if(isAuthRedirectError(e))return;
    todasConversoes=[];
  }
}
async function carregarHistorico(options={}){
  const b=document.getElementById("hist-body");
  b.innerHTML=`<tr class="empty-row"><td colspan="7"><div class="empty empty-strong"><p class="loading-text">Carregando</p></div></td></tr>`;
  ensureSession();
  if(options.sincronizar!==false)await limparImportacoesOrfasSePossivel();
  try{
    todosRegistros=await sbGetAll(TB_VENDAS,"select=*&order=data.desc,horario.desc");
  }catch(e){
    if(isAuthRedirectError(e))return;
    todosRegistros=[];
  }
  await carregarConferenciaFaturamento();
  await carregarConversoes();
  await carregarImportAlerts();
  await atualizarGeraramNfeConversoesPorDatas(todasConversoes.map(c=>c.data),{persist:false});
  atualizarFiltroPeriodos(getHistoricoDadosAtuais());
  filtrar();
}
function parseCurrencyValue(value){
  if(typeof value==="number")return value;
  const raw=String(value||"").replace(/[^\d,.-]/g,"");
  if(!raw)return 0;
  const normalized=raw.includes(",")?raw.replace(/\./g,"").replace(",","."):raw;
  return parseFloat(normalized)||0;
}
function getRegistroFaturamento(r){
  return parseCurrencyValue(r.faturamento ?? r.valor_faturamento ?? r.valor ?? r.total ?? r.total_item);
}
function getRegistroHora(r){
  return r.hora || r.horario || "—";
}
function getRegistroNfe(r){
  return String(r?.numero_nfe ?? r?.num_nf ?? r?.nfe ?? "");
}
function getRegistroCodigoCliente(r){
  return String(r?.codigo_cliente ?? r?.cod_cliente ?? "");
}
function getRegistroNomeCliente(r){
  return String(r?.nome_cliente ?? r?.cliente ?? "");
}
function getRegistroOfertaBool(r){
  const value=r?.oferta_ativa;
  if(typeof value==="boolean")return value;
  return String(value||"").toLowerCase()==="sim";
}
function getRegistroOfertaLabel(r){
  return getRegistroOfertaBool(r)?"Sim":"Não";
}
function formatDataBR(data){
  const value=String(data||"");
  const match=value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match?`${match[3]}/${match[2]}/${match[1]}`:(value||"—");
}
function atualizarFiltroPeriodos(d){
  const anoAtual=new Date().getFullYear().toString();
  historicoPeriodoAnos=[...new Set(d.map(r=>(r.data||"").slice(0,4)).filter(Boolean))].sort((a,b)=>b.localeCompare(a));
  if(!historicoPeriodoAnos.includes(anoAtual))historicoPeriodoAnos.unshift(anoAtual);
  if(historicoPeriodoAno&&!historicoPeriodoAnos.includes(historicoPeriodoAno)){
    historicoPeriodoAno="";
    document.getElementById("f-periodo").value="";
  }
  atualizarHistoricoPeriodoLabel();
}
function atualizarHistoricoPeriodoLabel(){
  const btn=document.getElementById("f-periodo-btn");
  const input=document.getElementById("f-periodo");
  if(!btn||!input)return;
  const mes=HISTORICO_MESES.find(m=>m.v===historicoPeriodoMes);
  const ok=mes&&historicoPeriodoAno;
  btn.textContent=ok?`${mes.n} · ${historicoPeriodoAno}`:"Todos · Anos";
  input.value=ok?`${historicoPeriodoAno}-${historicoPeriodoMes}`:"";
}
function abrirHistoricoPeriodoMenu(etapa="mes"){
  const wrap=document.querySelector(".history-date-filter");
  const btn=document.getElementById("f-periodo-btn");
  const menu=document.getElementById("f-periodo-menu");
  if(!wrap||!btn||!menu)return;
  const html=etapa==="ano"
    ? `<button type="button" class="history-period-back" onclick="renderHistoricoPeriodoMeses()">Voltar aos meses</button>`+
      historicoPeriodoAnos.map(a=>`<button type="button" class="${a===historicoPeriodoAno?"active":""}" onclick="selecionarHistoricoPeriodoAno('${a}')">${a}</button>`).join("")
    : `<button type="button" class="history-period-back" onclick="limparHistoricoPeriodo()">Todos · Anos</button>`+
      HISTORICO_MESES.map(m=>`<button type="button" class="${m.v===historicoPeriodoMes?"active":""}" onclick="selecionarHistoricoPeriodoMes('${m.v}')">${m.n}</button>`).join("");
  menu.innerHTML=html;
  menu.hidden=false;
  wrap.classList.add("open");
  btn.setAttribute("aria-expanded","true");
}
function fecharHistoricoPeriodoMenu(){
  const wrap=document.querySelector(".history-date-filter");
  const btn=document.getElementById("f-periodo-btn");
  const menu=document.getElementById("f-periodo-menu");
  if(!wrap||!btn||!menu)return;
  menu.hidden=true;
  wrap.classList.remove("open");
  btn.setAttribute("aria-expanded","false");
}
function toggleHistoricoPeriodo(){
  const menu=document.getElementById("f-periodo-menu");
  if(menu&&!menu.hidden){fecharHistoricoPeriodoMenu();return;}
  abrirHistoricoPeriodoMenu("mes");
}
function renderHistoricoPeriodoMeses(){abrirHistoricoPeriodoMenu("mes");}
function selecionarHistoricoPeriodoMes(mes){
  historicoPeriodoMes=mes;
  historicoPeriodoAno="";
  atualizarHistoricoPeriodoLabel();
  abrirHistoricoPeriodoMenu("ano");
}
function selecionarHistoricoPeriodoAno(ano){
  historicoPeriodoAno=ano;
  atualizarHistoricoPeriodoLabel();
  fecharHistoricoPeriodoMenu();
}
function limparHistoricoPeriodo(){
  historicoPeriodoMes="";
  historicoPeriodoAno="";
  atualizarHistoricoPeriodoLabel();
  fecharHistoricoPeriodoMenu();
}
function getHistoricoDadosAtuais(){
  return historicoModo==="conversao"?todasConversoes:todosRegistros;
}
function setHistoricoModo(modo){
  historicoModo=modo==="conversao"?"conversao":"principal";
  document.querySelectorAll("[data-history-mode]").forEach(btn=>btn.classList.toggle("active",btn.dataset.historyMode===historicoModo));
  const search=document.getElementById("f-txt");
  if(search)search.placeholder=historicoModo==="conversao"?"Buscar data ou valores...":"Buscar NF, cliente...";
  atualizarFiltroPeriodos(getHistoricoDadosAtuais());
  filtrar();
}
function renderHistoricoCabecalho(modo){
  const h=document.getElementById("hist-head");
  const table=h?.closest("table");
  if(table)table.classList.toggle("history-conversion-table",modo==="conversao");
  if(!h)return;
  h.innerHTML=modo==="conversao"
    ? `<tr><th>Data</th><th>Conversados</th><th>Orçaram</th><th>Geraram NFE</th><th>Perdidos</th><th>Conversão</th><th>Ações</th></tr>`
    : `<tr><th>Data</th><th>Horário</th><th>NFE</th><th>Cliente</th><th>Faturamento</th><th>Oferta Ativa</th><th>Ações</th></tr>`;
}
function getImportAlertTipo(alert){
  return String(alert?.type ?? alert?.tipo ?? "").toLowerCase();
}
function isImportAddedAlert(alert){
  const tipo=getImportAlertTipo(alert);
  return tipo==="added" || tipo==="adicionada";
}
function isImportDiffAlert(alert){
  const tipo=getImportAlertTipo(alert);
  return tipo==="diff" || tipo==="divergente";
}
function getImportAlertNfe(alert){
  return escapeSaleText(alert?.nfe ?? alert?.numero_nfe ?? "");
}
function getImportAlertRawNfe(alert){
  return normalizeImportNfe(alert?.nfe ?? alert?.numero_nfe ?? "");
}
function getImportAlertKey(alert){
  const data=String(alert?.data||"").slice(0,10);
  const nfe=getImportAlertRawNfe(alert);
  return data&&nfe?`${data}|${nfe}`:"";
}
function getImportAlertPrincipal(alert){
  return alert?.principal ?? alert?.valor_principal ?? 0;
}
function getImportAlertSecundario(alert){
  return alert?.importado ?? alert?.secundario ?? alert?.valor_secundario ?? 0;
}
function getRegistroAlertKey(r){
  const data=String(r?.data||"").slice(0,10);
  const nfe=normalizeImportNfe(getRegistroNfe(r));
  return data&&nfe?`${data}|${nfe}`:"";
}
function getDivergentAlertMap(){
  const map=new Map();
  avisosImportacao.filter(isImportDiffAlert).forEach(alert=>{
    const key=getImportAlertKey(alert);
    if(key)map.set(key,alert);
  });
  return map;
}
function atualizarDivergenciaAposEdicao(data,nfe,valor){
  const key=`${String(data||"").slice(0,10)}|${normalizeImportNfe(nfe)}`;
  avisosImportacao=avisosImportacao.filter(alert=>{
    if(!isImportDiffAlert(alert)||getImportAlertKey(alert)!==key)return true;
    const secundario=parseCurrencyValue(getImportAlertSecundario(alert));
    if(Math.abs(Number(valor||0)-secundario)<=0.02)return false;
    alert.principal=Number(valor||0);
    alert.valor_principal=Number(valor||0);
    return true;
  });
}
function renderImportAlerts(){
  const box=document.getElementById("import-alerts");
  if(!box)return;
  if(historicoModo!=="principal" || !resumoImportacaoAtivo){
    box.hidden=true;
    box.innerHTML="";
    return;
  }
  const adicionadas=avisosImportacao.filter(isImportAddedAlert);
  const divergentes=avisosImportacao.filter(isImportDiffAlert);
  box.hidden=false;
  const addedCount=Number.isFinite(resumoImportacaoDbStats?.itensImportados)
    ? resumoImportacaoDbStats.itensImportados
    : adicionadas.length;
  const addedTotal=Number.isFinite(resumoImportacaoDbStats?.totalSecundario)
    ? resumoImportacaoDbStats.totalSecundario
    : adicionadas.reduce((sum,alert)=>sum+parseCurrencyValue(getImportAlertSecundario(alert)),0);
  const diffItems=divergentes.map(alert=>{
    const data=formatDataBR(alert.data);
    const nfe=getImportAlertNfe(alert);
    return `<span>NFE ${nfe} · ${data} · Site R$ ${fmt(getImportAlertPrincipal(alert))} · Banco de Dados R$ ${fmt(getImportAlertSecundario(alert))}</span>`;
  }).join("");
  const ticker=divergentes.length>0;
  const diffHtml=divergentes.length
    ? `<div class="import-alert-list${ticker?" is-ticker":""}"><div class="import-alert-track">${diffItems}${ticker?diffItems:""}</div></div>`
    : `<span>Nenhuma incoerência de faturamento encontrada.</span>`;
  box.innerHTML=`
    <div class="import-alert import-alert-added">
      <strong>Itens importados</strong>
      <span>${addedCount} itens importados no Banco de Dados · R$ ${fmt(addedTotal)}</span>
    </div>
    <div class="import-alert import-alert-diff">
      <strong>Conferência de faturamento</strong>
      ${diffHtml}
    </div>
  `;
}
function renderStats(d){
  const tot=d.reduce((s,r)=>s+getRegistroFaturamento(r),0);
  const nfs=new Set(d.map(r=>getRegistroNfe(r)).filter(Boolean)).size;
  const clis=new Set(d.map(r=>getRegistroCodigoCliente(r)).filter(Boolean)).size;
  document.getElementById("stats-grid").innerHTML=`
    <div class="stat"><div class="stat-lbl">Total Faturado</div><div class="stat-val green">R$ ${fmt(tot)}</div></div>
    <div class="stat"><div class="stat-lbl">Notas Fiscais</div><div class="stat-val blue">${nfs}</div></div>
    <div class="stat"><div class="stat-lbl">Clientes</div><div class="stat-val">${clis}</div></div>
    <div class="stat"><div class="stat-lbl">Registros</div><div class="stat-val">${d.length}</div></div>
  `;
  renderImportAlerts();
}
function getConversaoInt(campo){
  return Math.max(0,parseInt(String(campo??"").replace(/\D/g,""),10)||0);
}
function normalizarDataHistorico(data){
  return String(data||"").slice(0,10);
}
function contarGeraramNfePrincipalPorData(data){
  const alvo=normalizarDataHistorico(data);
  if(!alvo)return 0;
  return todosRegistros.filter(r=>normalizarDataHistorico(r.data)===alvo).length;
}
async function atualizarGeraramNfeConversoesPorDatas(datas,options={}){
  const persist=options.persist!==false;
  const alvos=[...new Set((datas||[]).map(normalizarDataHistorico).filter(Boolean))];
  if(!alvos.length||!todasConversoes.length)return;
  const atualizadas=[];
  todasConversoes=todasConversoes.map(c=>{
    const data=normalizarDataHistorico(c.data);
    if(!alvos.includes(data))return c;
    const geraram_nfe=contarGeraramNfePrincipalPorData(data);
    const atual=getConversaoInt(c.geraram_nfe ?? c.geraramNfe ?? c.geraram_nota ?? c.nfe);
    if(atual===geraram_nfe)return c;
    const next={...c,geraram_nfe};
    atualizadas.push(next);
    return next;
  });
  if(!persist||!atualizadas.length)return;
  await Promise.allSettled(atualizadas
    .filter(c=>c.id)
    .map(c=>sbPatch(TB_CONVERSOES,c.id,{geraram_nfe:c.geraram_nfe})));
}
function getConversaoGeraramNfe(c){
  const raw=c?.geraram_nfe ?? c?.geraramNfe ?? c?.geraram_nota ?? c?.nfe;
  if(raw!==undefined&&raw!==null&&String(raw)!=="")return getConversaoInt(raw);
  return Math.max(0,getConversaoInt(c?.orcaram)-getConversaoInt(c?.perdidos));
}
function getConversaoTaxa(c){
  const conversados=getConversaoInt(c.conversados);
  const geraramNfe=getConversaoGeraramNfe(c);
  return conversados?geraramNfe/conversados*100:0;
}
function renderStatsConversao(d){
  const conversados=d.reduce((s,r)=>s+getConversaoInt(r.conversados),0);
  const orcaram=d.reduce((s,r)=>s+getConversaoInt(r.orcaram),0);
  const geraramNfe=d.reduce((s,r)=>s+getConversaoGeraramNfe(r),0);
  const perdidos=d.reduce((s,r)=>s+getConversaoInt(r.perdidos),0);
  const taxa=conversados?geraramNfe/conversados*100:0;
  document.getElementById("stats-grid").innerHTML=`
    <div class="stat"><div class="stat-lbl">Conversados</div><div class="stat-val blue">${conversados}</div></div>
    <div class="stat"><div class="stat-lbl">Orçaram</div><div class="stat-val green">${orcaram}</div></div>
    <div class="stat"><div class="stat-lbl">Geraram NFE</div><div class="stat-val">${geraramNfe}</div></div>
    <div class="stat"><div class="stat-lbl">Perdidos</div><div class="stat-val">${perdidos}</div></div>
    <div class="stat"><div class="stat-lbl">Conversão</div><div class="stat-val">${taxa.toLocaleString("pt-BR",{maximumFractionDigits:1})}%</div></div>
  `;
  renderImportAlerts();
}
function renderHistorico(d){
  renderHistoricoCabecalho("principal");
  const b=document.getElementById("hist-body");
  if(!d.length){b.innerHTML=`<tr class="empty-row"><td colspan="7"><div class="empty empty-strong"><p>Sem histórico no momento.</p></div></td></tr>`;return;}
  const divergentes=getDivergentAlertMap();
  const ordered=[...d].sort((a,b)=>{
    const aDiff=divergentes.has(getRegistroAlertKey(a));
    const bDiff=divergentes.has(getRegistroAlertKey(b));
    if(aDiff!==bDiff)return aDiff?-1:1;
    const dateDiff=String(b.data||"").localeCompare(String(a.data||""));
    if(dateDiff)return dateDiff;
    const hourDiff=String(getRegistroHora(b)||"").localeCompare(String(getRegistroHora(a)||""));
    if(hourDiff)return hourDiff;
    return String(getRegistroNfe(b)||"").localeCompare(String(getRegistroNfe(a)||""));
  });
  b.innerHTML=ordered.map(r=>{
    const id=inlineMetaId(r.id);
    const diffAlert=divergentes.get(getRegistroAlertKey(r));
    const diffSite=diffAlert?fmt(getImportAlertPrincipal(diffAlert)):"";
    const diffBanco=diffAlert?fmt(getImportAlertSecundario(diffAlert)):"";
    const diffTitle=diffAlert
      ? `Faturamento divergente: Site R$ ${diffSite} · Banco de Dados R$ ${diffBanco}`
      : "";
    return `<tr${diffAlert?' class="history-row-warning"':""}>
    <td><span class="history-meta">${formatDataBR(r.data)}</span></td>
    <td><span class="history-meta">${getRegistroHora(r)}</span></td>
    <td><span class="history-meta">${escapeSaleText(getRegistroNfe(r))||"—"}</span></td>
    <td><span class="hl">${escapeSaleText(getRegistroNomeCliente(r))||"—"}</span><br/><span class="history-client-code">${escapeSaleText(getRegistroCodigoCliente(r))}</span></td>
    <td><span class="money">R$ ${fmt(getRegistroFaturamento(r))}</span></td>
    <td><span class="badge ${getRegistroOfertaBool(r)?"bg-green":"bg-gray"}">${getRegistroOfertaLabel(r)}</span></td>
    <td><div class="history-actions"><button class="btn btn-secondary btn-sm" onclick="abrirEditVenda('${id}')">Editar</button><button class="btn btn-danger btn-sm" onclick="excluirVenda('${id}')">Excluir</button>${diffAlert?`<span class="history-warning-icon" aria-label="${escapeSaleText(diffTitle)}"><svg viewBox="0 0 32 28" aria-hidden="true"><path d="M16 1.6c1.35 0 2.55.72 3.2 1.9l11.35 20.15c.72 1.28-.2 2.85-1.68 2.85H3.13c-1.48 0-2.4-1.57-1.68-2.85L12.8 3.5c.65-1.18 1.85-1.9 3.2-1.9Z"/><path class="warning-mark" d="M16 8.2c.9 0 1.55.65 1.5 1.55l-.45 7.7c-.04.65-.5 1.08-1.05 1.08s-1.01-.43-1.05-1.08l-.45-7.7c-.05-.9.6-1.55 1.5-1.55Zm0 12.35c.9 0 1.62.7 1.62 1.55s-.72 1.55-1.62 1.55-1.62-.7-1.62-1.55.72-1.55 1.62-1.55Z"/></svg><span class="history-warning-popover"><strong>Faturamento divergente</strong><span class="history-warning-line"><span>Site R$ ${diffSite}</span><i class="warning-x">&times;</i></span><span class="history-warning-line"><span>B.Dados R$ ${diffBanco}</span><i class="warning-ok">&#10003;</i></span></span></span>`:""}</div></td>
  </tr>`;
  }).join("");
}
function renderHistoricoConversao(d){
  renderHistoricoCabecalho("conversao");
  const b=document.getElementById("hist-body");
  if(!d.length){b.innerHTML=`<tr class="empty-row"><td colspan="7"><div class="empty empty-strong"><p>Sem histórico no momento.</p></div></td></tr>`;return;}
  const ordered=[...d].sort((a,b)=>String(b.data||"").localeCompare(String(a.data||"")));
  b.innerHTML=ordered.map(r=>{
    const id=inlineMetaId(r.id);
    return `<tr>
      <td><span class="history-meta">${formatDataBR(r.data)}</span></td>
      <td><span class="history-meta">${getConversaoInt(r.conversados)}</span></td>
      <td><span class="history-meta">${getConversaoInt(r.orcaram)}</span></td>
      <td><span class="history-meta">${getConversaoGeraramNfe(r)}</span></td>
      <td><span class="history-meta">${getConversaoInt(r.perdidos)}</span></td>
      <td><span class="money">${getConversaoTaxa(r).toLocaleString("pt-BR",{maximumFractionDigits:1})}%</span></td>
      <td><button class="btn btn-secondary btn-sm" onclick="editarConversao('${id}')" style="margin-right:4px">Editar</button><button class="btn btn-danger btn-sm" onclick="excluirConversao('${id}')">Excluir</button></td>
    </tr>`;
  }).join("");
}
function filtrar(){
  const txt=document.getElementById("f-txt").value.toLowerCase();
  const periodo=document.getElementById("f-periodo").value;
  if(historicoModo==="conversao"){
    const f=todasConversoes.filter(r=>{
      const data=r.data||"";
      const texto=[formatDataBR(data),r.conversados,r.orcaram,getConversaoGeraramNfe(r),r.perdidos,getConversaoTaxa(r).toLocaleString("pt-BR",{maximumFractionDigits:1})].join(" ").toLowerCase();
      const mt=!txt||texto.includes(txt);
      const md=!periodo||data.startsWith(periodo);
      return mt&&md;
    });
    renderHistoricoConversao(f);renderStatsConversao(f);
    return;
  }
  const f=todosRegistros.filter(r=>{
    const data=r.data||"";
    const mt=!txt||getRegistroNomeCliente(r).toLowerCase().includes(txt)||getRegistroNfe(r).includes(txt)||getRegistroCodigoCliente(r).includes(txt)||getRegistroOfertaLabel(r).toLowerCase().includes(txt);
    const md=!periodo||data.startsWith(periodo);
    return mt&&md;
  });
  renderHistorico(f);renderStats(f);
}
function limparFiltros(){
  document.getElementById("f-txt").value="";
  historicoPeriodoMes="";
  historicoPeriodoAno="";
  atualizarHistoricoPeriodoLabel();
  fecharHistoricoPeriodoMenu();
  filtrar();
}

// ── EDITAR VENDA ──────────────────────────────────────────────────────────
function getRegistroArquivoNome(r){
  return String(r?.arquivo_nome ?? r?.origem_importacao_arquivo ?? "").trim();
}
function isRegistroImportado(r){
  return Boolean(getRegistroArquivoNome(r)||r?.origem_importacao_auto);
}
function abrirEditVenda(id){
  const r=todosRegistros.find(x=>String(x.id)===String(id));if(!r)return;
  editVendaId=id;
  document.getElementById("e-data").value=r.data||"";
  document.getElementById("e-hora").value=getRegistroHora(r)==="—"?"":getRegistroHora(r);
  document.getElementById("e-nfe").value=getRegistroNfe(r);
  document.getElementById("e-codcli").value=getRegistroCodigoCliente(r);
  document.getElementById("e-nomecli").value=getRegistroNomeCliente(r);
  document.getElementById("e-faturamento").value="R$ "+fmt(getRegistroFaturamento(r));
  const oferta=getRegistroOfertaBool(r);
  document.getElementById("e-tgl-oferta").classList.toggle("on",oferta);
  document.getElementById("e-tgl-label").textContent=oferta?"Sim":"Não";
  document.getElementById("e-tgl-label").classList.toggle("on",oferta);
  document.getElementById("modal-venda").classList.add("open");
}
function toggleEditOferta(){
  const btn=document.getElementById("e-tgl-oferta");
  const lbl=document.getElementById("e-tgl-label");
  const on=btn.classList.toggle("on");
  lbl.textContent=on?"Sim":"Não";lbl.classList.toggle("on",on);
}
function calcEditTotal(){
  const input=document.getElementById("e-faturamento");
  if(input)formatCurrencyInput(input);
}
async function executarSalvarEditVenda(payload,datasAfetadas=[]){
  try{
    ensureSession();
    await sbPatch(TB_VENDAS,editVendaId,payload);
    atualizarDivergenciaAposEdicao(payload.data,payload.numero_nfe,payload.faturamento);
    todosRegistros=todosRegistros.map(r=>String(r.id)===String(editVendaId)?{...r,...payload}:r);
    await atualizarGeraramNfeConversoesPorDatas(datasAfetadas);
    atualizarFiltroPeriodos(getHistoricoDadosAtuais());
    filtrar();
    toast("Atualizado","success");fecharModal("modal-venda");
  }catch(e){
    if(isAuthRedirectError(e))return;
    toast("Erro: "+e.message,"error");
  }
}
async function salvarEditVenda(){
  const ofertaEdit=document.getElementById("e-tgl-oferta").classList.contains("on");
  const faturamento=getRegistroFaturamento({faturamento:document.getElementById("e-faturamento").value});
  const payload={data:document.getElementById("e-data").value,horario:document.getElementById("e-hora").value||null,numero_nfe:document.getElementById("e-nfe").value,codigo_cliente:document.getElementById("e-codcli").value,nome_cliente:document.getElementById("e-nomecli").value,faturamento,oferta_ativa:ofertaEdit};
  const registro=todosRegistros.find(r=>String(r.id)===String(editVendaId));
  const datasAfetadas=[registro?.data,payload.data];
  if(isRegistroImportado(registro)){
    const arquivo=getRegistroArquivoNome(registro)||"arquivo importado";
    confirmar(
      "Confirmar edição?",
      `Este registro pertence ao arquivo "${arquivo}". Confirme para editar uma linha importada.`,
      ()=>executarSalvarEditVenda(payload,datasAfetadas),
      {okText:"Salvar",okClass:"btn btn-primary"}
    );
    return;
  }
  await executarSalvarEditVenda(payload,datasAfetadas);
}
async function executarExcluirVenda(id){
  try{
    const registro=todosRegistros.find(r=>String(r.id)===String(id));
    const dataAfetada=registro?.data;
    ensureSession();
    await sbDelete(TB_VENDAS,id);
    todosRegistros=todosRegistros.filter(r=>String(r.id)!==String(id));
    await atualizarGeraramNfeConversoesPorDatas([dataAfetada]);
    atualizarFiltroPeriodos(getHistoricoDadosAtuais());
    filtrar();
    toast("Excluído","success");
  }
  catch(e){
    if(isAuthRedirectError(e))return;
    toast("Erro: "+e.message,"error");
  }
}
async function excluirVenda(id){
  confirmar("Excluir este registro?","Esta ação não pode ser desfeita.",async()=>{
    const registro=todosRegistros.find(r=>String(r.id)===String(id));
    if(isRegistroImportado(registro)){
      const arquivo=getRegistroArquivoNome(registro)||"arquivo importado";
      confirmar(
        "Excluir registro importado?",
        `Este registro pertence ao arquivo "${arquivo}". Confirme para excluir uma linha importada.`,
        ()=>executarExcluirVenda(id)
      );
      return;
    }
    await executarExcluirVenda(id);
  });
}

// ── CONVERSÃO CRUD ───────────────────────────────────────────────────────
function abrirModalConversao(id){
  editConversaoId=id||null;
  document.getElementById("modal-conv-title").textContent=id?"Editar Conversão":"Nova Conversão";
  const c=id?todasConversoes.find(x=>String(x.id)===String(id)):null;
  const now=getBrasiliaDateTime();
  document.getElementById("conv-data").value=c?.data || now.date;
  document.getElementById("conv-conversados").value=c?getConversaoInt(c.conversados):"";
  document.getElementById("conv-orcaram").value=c?getConversaoInt(c.orcaram):"";
  document.getElementById("conv-perdidos").value=c?getConversaoInt(c.perdidos):"";
  document.getElementById("modal-conversao").classList.add("open");
}
function getConversaoPayload(){
  const data=document.getElementById("conv-data").value;
  return {
    data,
    conversados:getConversaoInt(document.getElementById("conv-conversados").value),
    orcaram:getConversaoInt(document.getElementById("conv-orcaram").value),
    perdidos:getConversaoInt(document.getElementById("conv-perdidos").value),
    geraram_nfe:contarGeraramNfePrincipalPorData(data)
  };
}
function upsertConversaoLocal(payload){
  conversoesLocalTouched=true;
  const id=editConversaoId || Date.now()+Math.random();
  const idx=todasConversoes.findIndex(c=>String(c.id)===String(id));
  if(idx>=0)todasConversoes[idx]={...todasConversoes[idx],...payload,id};
  else todasConversoes.unshift({id,...payload});
}
async function salvarConversao(){
  const payload=getConversaoPayload();
  if(!payload.data){toast("Informe a data","error");return;}
  if(!payload.conversados&&!payload.orcaram&&!payload.perdidos){toast("Preencha pelo menos um valor","error");return;}
  try{
    ensureSession();
    if(editConversaoId)await sbPatch(TB_CONVERSOES,editConversaoId,payload);
    else await sbPost(TB_CONVERSOES,payload);
    await carregarConversoes();
  }catch(e){
    if(isAuthRedirectError(e))return;
    upsertConversaoLocal(payload);
  }
  toast("Conversão salva","success");
  fecharModal("modal-conversao");
  setHistoricoModo("conversao");
}
function editarConversao(id){abrirModalConversao(id);}
async function excluirConversao(id){
  confirmar("Excluir esta conversão?","Esta ação não pode ser desfeita.",async()=>{
    try{
      ensureSession();
      await sbDelete(TB_CONVERSOES,id);
      await carregarConversoes();
    }catch(e){
      if(isAuthRedirectError(e))return;
      conversoesLocalTouched=true;
      todasConversoes=todasConversoes.filter(c=>String(c.id)!==String(id));
    }
    toast("Conversão excluída","success");
    filtrar();
  });
}

// ── CLIENTES CRUD ─────────────────────────────────────────────────────────
function abrirModalCliente(id){
  editClienteId=id||null;
  document.getElementById("modal-cli-title").textContent=id?"Editar Cliente":"Novo Cliente";
  const dataInput=document.getElementById("mc-data-inscricao");
  if(id){
    const c=todosClientes.find(x=>String(x.id)===String(id));
    if(dataInput)dataInput.value=getClienteData(c)||getBrasiliaDateTime().date;
    document.getElementById("mc-cod").value=getClienteCodigo(c);
    document.getElementById("mc-nome").value=getClienteNome(c);
  }
  else{
    if(dataInput)dataInput.value=getBrasiliaDateTime().date;
    document.getElementById("mc-cod").value="";
    document.getElementById("mc-nome").value="";
  }
  document.getElementById("modal-cliente").classList.add("open");
}
async function salvarCliente(){
  const data=document.getElementById("mc-data-inscricao")?.value || getBrasiliaDateTime().date;
  const cod=document.getElementById("mc-cod").value.trim();
  const nome=document.getElementById("mc-nome").value.trim();
  if(!cod||!nome){toast("Preencha código e nome","error");return;}
  const payload={data_inscricao:data,codigo_cliente:cod,nome_cliente:nome};
  try{
    ensureSession();
    if(editClienteId)await sbPatch(TB_CLIENTES,editClienteId,payload);
    else await sbPost(TB_CLIENTES,payload);
    await carregarClientes();
  }catch(e){
    if(isAuthRedirectError(e))return;
    toast("Erro: "+e.message,"error");
    return;
  }
  toast("Cliente salvo","success");fecharModal("modal-cliente");
  renderClientes(todosClientes);
}
function editarCliente(id){abrirModalCliente(id);}
async function excluirCliente(id){
  confirmar("Excluir este cliente?","Esta ação não pode ser desfeita.",async()=>{
  try{
    ensureSession();
    await sbDelete(TB_CLIENTES,id);
    await carregarClientes();
  }
  catch(e){
    if(isAuthRedirectError(e))return;
    toast("Erro: "+e.message,"error");
    return;
  }
  toast("Cliente excluído","success");renderClientes(todosClientes);});
}

// ── PRODUTOS CRUD ─────────────────────────────────────────────────────────
function abrirModalProduto(id){
  editProdutoId=id||null;
  document.getElementById("modal-prod-title").textContent=id?"Editar Produto":"Novo Produto";
  if(id){const p=todosProdutos.find(x=>x.id===id);document.getElementById("mp-cod").value=p.codigo;document.getElementById("mp-nome").value=p.nome;document.getElementById("mp-preco").value=p.preco_unitario;}
  else{document.getElementById("mp-cod").value="";document.getElementById("mp-nome").value="";document.getElementById("mp-preco").value="";}
  document.getElementById("modal-produto").classList.add("open");
}
async function salvarProduto(){
  toast("Produtos agora entram pelo arquivo .xlsx no Banco de Dados.","info");
  fecharModal("modal-produto");
}
function editarProduto(id){abrirModalProduto(id);}
async function excluirProduto(id){
  todosProdutos=todosProdutos.filter(p=>String(p.id)!==String(id));
  PRODUTOS=todosProdutos;
  renderProdutos(todosProdutos);
  toast("Produto removido localmente","success");
}

// ── METAS CRUD ────────────────────────────────────────────────────────────
function mesNomePorData(data){
  const mes=String(data||"").slice(5,7);
  return HISTORICO_MESES.find(m=>m.v===mes)?.n || "";
}
function anoPorData(data){
  return String(data||"").slice(0,4);
}
function syncMetaYear(){
  const data=document.getElementById("mm-data").value;
  const ano=anoPorData(data);
  document.getElementById("mm-ano").value=ano;
  renderMetaMonthGoals(ano,data);
}
function syncMetaMonth(){
  syncMetaYear();
}
function formatMetaMonthInput(input){
  input.value=String(input.value||"").replace(/[^A-Za-zÀ-ÿ\s]/g,"").toUpperCase();
}
function formatMetaInput(input){
  formatCurrencyInput(input);
}
function parseMetaCurrencyValue(value){
  if(typeof value==="number")return value;
  const raw=String(value||"").replace(/[^\d,.-]/g,"");
  if(!raw)return 0;
  if(raw.includes(","))return parseFloat(raw.replace(/\./g,"").replace(",","."))||0;
  if(/^\d{1,3}(\.\d{3})+$/.test(raw))return Number(raw.replace(/\D/g,""))||0;
  return parseFloat(raw)||0;
}
function metaRowDate(baseDate,monthNumber){
  const year=anoPorData(baseDate)||String(new Date().getFullYear());
  return `${year}-${String(monthNumber).padStart(2,"0")}-01`;
}
function renderMetaMonthGoals(ano,baseDate){
  const wrap=document.getElementById("meta-month-goals");
  if(!wrap)return;
  const metasByMonth=new Map(todasMetas.filter(m=>getMetaAno(m)===String(ano)).map(m=>[metaMonthIndex(m.mes ?? getMetaMes(m)),m]));
  wrap.innerHTML=HISTORICO_MESES.map((month,index)=>{
    const existing=metasByMonth.get(index);
    const monthName=(existing?getMetaMes(existing):month.n.toUpperCase());
    const value=existing?`R$ ${fmt(getMetaValor(existing))}`:"";
    const id=existing?.id??"";
    return `<div class="meta-month-row" data-meta-row data-meta-id="${inlineMetaId(id)}" data-meta-month="${String(index+1).padStart(2,"0")}"><input type="text" class="meta-month-name" value="${monthName}" oninput="formatMetaMonthInput(this)"/><input type="text" class="meta-month-value" inputmode="decimal" value="${value}" placeholder="R$ 0,00" oninput="formatMetaInput(this)"/></div>`;
  }).join("");
  if(!baseDate)document.getElementById("mm-data").value=metaRowDate(`${ano}-01-01`,1);
}
function upsertMetaLocal(payload){
  const idx=todasMetas.findIndex(m=>String(getMetaAno(m))===String(payload.ano)&&metaMonthIndex(m.mes ?? getMetaMes(m))===metaMonthIndex(payload.mes));
  if(idx>=0)todasMetas[idx]={...todasMetas[idx],...payload};
  else todasMetas.unshift({id:Date.now()+Math.random(),...payload});
}
function abrirModalMeta(id){
  editMetaId=id||null;
  document.getElementById("modal-meta-title").textContent=id?"Editar Metas":"Nova Meta";
  if(id){
    const m=todasMetas.find(x=>String(x.id)===String(id));
    document.getElementById("mm-data").value=getMetaData(m) || "";
    document.getElementById("mm-ano").value=getMetaAno(m||{});
    renderMetaMonthGoals(getMetaAno(m||{}),getMetaData(m));
  }else{
    const now=getBrasiliaDateTime();
    document.getElementById("mm-data").value=now.date;
    document.getElementById("mm-ano").value=anoPorData(now.date);
    renderMetaMonthGoals(anoPorData(now.date),now.date);
  }
  document.getElementById("modal-meta").classList.add("open");
}
async function salvarMeta(){
  const data=document.getElementById("mm-data").value;
  const ano=(document.getElementById("mm-ano").value.trim()||anoPorData(data));
  const rows=[...document.querySelectorAll("[data-meta-row]")];
  const payloads=rows.map(row=>{
    const mes=row.querySelector(".meta-month-name").value.trim().toUpperCase();
    const valor=parseMetaCurrencyValue(row.querySelector(".meta-month-value").value);
    const monthNumber=row.dataset.metaMonth;
    const rowData=data||metaRowDate(`${ano}-${monthNumber}-01`,Number(monthNumber));
    return {data_cadastro:rowData,mes:Number(monthNumber),mes_nome:mes,ano:Number(ano),meta:valor,id:row.dataset.metaId||""};
  }).filter(m=>m.mes&&m.meta);
  if(!data||!ano){toast("Preencha data e ano","error");return;}
  if(!payloads.length){toast("Preencha pelo menos uma meta","error");return;}
  try{
    ensureSession();
    for(const payload of payloads){
      const body={data_cadastro:payload.data_cadastro,mes:payload.mes,ano:payload.ano,meta:payload.meta};
      if(payload.id)await sbPatch(TB_METAS,payload.id,body);
      else await sbPost(TB_METAS,body);
    }
    await carregarMetas();
  }catch(e){
    if(isAuthRedirectError(e))return;
    payloads.forEach(({id,...payload})=>upsertMetaLocal(payload));
    renderMetas(todasMetas);
  }
  toast("Metas salvas","success");
  fecharModal("modal-meta");
}
function editarMeta(id){abrirModalMeta(id);}
async function excluirMeta(id){
  confirmar("Excluir esta meta?","Esta ação não pode ser desfeita.",async()=>{
    try{
      ensureSession();
      await sbDelete(TB_METAS,id);
      await carregarMetas();
    }catch(e){
      if(isAuthRedirectError(e))return;
      todasMetas=todasMetas.filter(m=>String(m.id)!==String(id));
      renderMetas(todasMetas);
    }
    toast("Meta excluída","success");
  });
}


// ── MODAL CONFIRMAR EXCLUSÃO ──────────────────────────────────────────────
function confirmar(titulo, subtitulo, callback, options={}){
  document.getElementById("confirm-titulo").textContent = titulo;
  document.getElementById("confirm-subtitulo").textContent = subtitulo;
  const btn = document.getElementById("confirm-btn-ok");
  btn.textContent=options.okText||"Excluir";
  btn.className=options.okClass||"btn btn-danger";
  btn.onclick = ()=>{ fecharModal("modal-confirm"); callback(); };
  document.getElementById("modal-confirm").classList.add("open");
}
// ── UTILS ─────────────────────────────────────────────────────────────────
function fmt(n){return Number(n).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});}
function formatCurrencyInput(input){
  let raw=String(input.value||"").replace(/^R\$\s*/,"").replace(/[^\d,]/g,"");
  if(!raw){input.value="";return;}

  const hasComma=raw.includes(",");
  const parts=raw.split(",");
  let integer=parts[0].replace(/\D/g,"").replace(/^0+(?=\d)/,"");
  let decimals=(parts.slice(1).join("")).replace(/\D/g,"").slice(0,2);
  const formattedInteger=integer?Number(integer).toLocaleString("pt-BR"):"0";

  input.value="R$ "+formattedInteger+(hasComma?","+decimals:"");
}
function formatCurrencyInputCents(input){
  const digits=String(input.value||"").replace(/\D/g,"");
  if(!digits){input.value="";return;}
  const cents=Number(digits);
  input.value=(cents/100).toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL",
    minimumFractionDigits:2,
    maximumFractionDigits:2
  });
}
function onlyDigitsInput(input){
  input.value=String(input.value||"").replace(/\D/g,"");
}
function toast(msg,tipo){
  if(window.__caioAuthRedirecting)return;
  const el=document.getElementById("toast");
  if(!el)return;
  if(window.__toastTimer)clearTimeout(window.__toastTimer);
  const kind=tipo==="success"||tipo==="error"||tipo==="info"?tipo:"info";
  const title=kind==="success"?"Concluído":kind==="error"?"Erro":"Aviso";
  el.className=kind;
  el.setAttribute("role","status");
  el.innerHTML=`
    <div class="toast-dialog">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${escapeSaleText(msg)}</div>
    </div>`;
  el.style.display="flex";
  requestAnimationFrame(()=>el.classList.add("show"));
  window.__toastTimer=setTimeout(fecharToast,4000);
}
function fecharToast(){
  const el=document.getElementById("toast");
  if(!el)return;
  if(window.__toastTimer)clearTimeout(window.__toastTimer);
  window.__toastTimer=null;
  el.classList.remove("show");
  setTimeout(()=>{
    if(el.classList.contains("show"))return;
    el.style.display="none";
    el.innerHTML="";
  },320);
}
document.addEventListener("click",e=>{
  const el=document.getElementById("toast");
  if(!el||el.style.display==="none")return;
  if(!e.target.closest?.(".toast-dialog"))fecharToast();
});
function fecharModal(id){document.getElementById(id).classList.remove("open");}
