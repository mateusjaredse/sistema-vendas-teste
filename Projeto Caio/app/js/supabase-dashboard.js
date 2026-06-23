(function(){
  const SB_URL = "https://ylldraicfwqaxbuqihul.supabase.co";
  const SB_KEY = "sb_publishable_JmQg_sdxjS5RDQDU-2p92A_BcVI_pul";
  const TABLES = {
    principal:"bd_principal",
    secundario:"bd_secundario",
    clientes:"bd_clientes",
    metas:"bd_metas",
    conversao:"bd_conversao",
    metasReais:"bd_metas_reais",
    inatividade:"vw_inatividade_dashboard",
    feriados:"bd_feriados"
  };

  const monthNames = [
    "JANEIRO","FEVEREIRO","MARCO","ABRIL","MAIO","JUNHO",
    "JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"
  ];

  function getToken(){
    try{
      return sessionStorage.getItem("sb_token") || localStorage.getItem("sb_token") || window.parent?.sessionStorage?.getItem("sb_token") || window.parent?.localStorage?.getItem("sb_token") || "";
    }catch{
      return sessionStorage.getItem("sb_token") || localStorage.getItem("sb_token") || "";
    }
  }
  function getRefreshToken(){
    try{
      return sessionStorage.getItem("sb_refresh_token") || localStorage.getItem("sb_refresh_token") || window.parent?.sessionStorage?.getItem("sb_refresh_token") || window.parent?.localStorage?.getItem("sb_refresh_token") || "";
    }catch{
      return sessionStorage.getItem("sb_refresh_token") || localStorage.getItem("sb_refresh_token") || "";
    }
  }
  function saveAuthSession(session){
    if(!session?.access_token) return;
    try{sessionStorage.setItem("sb_token",session.access_token);}catch{}
    try{localStorage.setItem("sb_token",session.access_token);}catch{}
    try{window.parent?.sessionStorage?.setItem("sb_token",session.access_token);}catch{}
    try{window.parent?.localStorage?.setItem("sb_token",session.access_token);}catch{}
    if(session.refresh_token){
      try{sessionStorage.setItem("sb_refresh_token",session.refresh_token);}catch{}
      try{localStorage.setItem("sb_refresh_token",session.refresh_token);}catch{}
      try{window.parent?.sessionStorage?.setItem("sb_refresh_token",session.refresh_token);}catch{}
      try{window.parent?.localStorage?.setItem("sb_refresh_token",session.refresh_token);}catch{}
    }
  }
  function clearAuthSession(){
    ["sb_token","sb_refresh_token"].forEach(key=>{
      try{sessionStorage.removeItem(key);}catch{}
      try{localStorage.removeItem(key);}catch{}
      try{window.parent?.sessionStorage?.removeItem(key);}catch{}
      try{window.parent?.localStorage?.removeItem(key);}catch{}
    });
  }

  const AUTH_REDIRECT_ERROR = "CAIO_AUTH_REDIRECT";
  let authRefreshPromise = null;
  function getLoginUrl(){
    const url = new URL(window.location.href);
    const markers = ["/dashboard/","/sistema/","/app/"];
    const marker = markers.find(item=>url.pathname.includes(item));
    if(marker){
      url.pathname = url.pathname.slice(0,url.pathname.indexOf(marker)+1) + "login.html";
    }else{
      url.pathname = url.pathname.replace(/[^/]*$/,"login.html");
    }
    url.search = "";
    url.hash = "";
    return url.toString();
  }

  function redirectToLogin(){
    window.__caioAuthRedirecting = true;
    clearAuthSession();
    const target = getLoginUrl();
    if(window.top && window.top !== window.self) window.top.location.href = target;
    else window.location.href = target;
    throw new Error(AUTH_REDIRECT_ERROR);
  }

  function ensureSession(){
    if(!getToken() && !getRefreshToken()) redirectToLogin();
    return getToken();
  }

  function authHeaders(extra){
    const token = ensureSession();
    return Object.assign({
      apikey:SB_KEY,
      Authorization:`Bearer ${token}`
    },extra || {});
  }

  async function refreshAuthSession(){
    const refreshToken = getRefreshToken();
    if(!refreshToken) return false;
    if(!authRefreshPromise){
      authRefreshPromise = (async()=>{
        try{
          const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=refresh_token`,{
            method:"POST",
            headers:{"Content-Type":"application/json","apikey":SB_KEY},
            body:JSON.stringify({refresh_token:refreshToken})
          });
          const data = await r.json().catch(()=>({}));
          if(!r.ok || !data.access_token) return false;
          saveAuthSession(data);
          return true;
        }catch{
          return false;
        }
      })().finally(()=>{ authRefreshPromise = null; });
    }
    return authRefreshPromise;
  }

  async function fetchWithAuth(url,options){
    ensureSession();
    let response = await fetch(url,{...(options || {}),headers:authHeaders(options?.headers)});
    if(response.status === 401 && await refreshAuthSession()){
      response = await fetch(url,{...(options || {}),headers:authHeaders(options?.headers)});
    }
    if(response.status === 401) redirectToLogin();
    return response;
  }

  async function get(table,query="select=*&limit=5000"){
    const r = await fetchWithAuth(`${SB_URL}/rest/v1/${table}?${query}`);
    if(!r.ok){
      console.warn("[CaioSupabase] Falha ao buscar",table,await r.text());
      return [];
    }
    return r.json();
  }

  async function getAll(table,query="select=*",pageSize=1000,maxPages=Number.POSITIVE_INFINITY){
    const cleanQuery = String(query || "select=*")
      .replace(/(^|&)limit=\d+/g,"")
      .replace(/(^|&)offset=\d+/g,"")
      .replace(/^&/,"")
      .replace(/&&+/g,"&")
      .replace(/&$/,"");
    const rows = [];
    for(let page=0; page<maxPages; page+=1){
      const glue = cleanQuery ? "&" : "";
      const chunk = await get(table,`${cleanQuery}${glue}limit=${pageSize}&offset=${page*pageSize}`);
      if(!Array.isArray(chunk) || !chunk.length) break;
      rows.push(...chunk);
      if(chunk.length < pageSize) break;
    }
    return rows;
  }

  function toNumber(value){
    if(typeof value === "number") return Number.isFinite(value) ? value : 0;
    const raw = String(value ?? "").trim();
    if(!raw) return 0;
    const normalized = raw
      .replace(/[^\d,.-]/g,"")
      .replace(/\.(?=\d{3}(?:\D|$))/g,"")
      .replace(",",".");
    const number = Number(normalized);
    return Number.isFinite(number) ? number : 0;
  }

  function parseDate(value){
    if(value instanceof Date && !Number.isNaN(value.getTime())) return value;
    const text = String(value ?? "").slice(0,10);
    if(!text) return null;
    if(/^\d{4}-\d{2}-\d{2}$/.test(text)){
      const [year,month,day] = text.split("-").map(Number);
      return new Date(year,month-1,day);
    }
    if(/^\d{2}\/\d{2}\/\d{4}$/.test(text)){
      const [day,month,year] = text.split("/").map(Number);
      return new Date(year,month-1,day);
    }
    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function dateISO(date){
    if(!date) return "";
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  }

  function normalizeText(value){
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .trim()
      .toUpperCase();
  }

  function monthIndexFromValue(value){
    const numeric = Number(value);
    if(Number.isFinite(numeric) && numeric >= 1 && numeric <= 12) return numeric - 1;
    const text = normalizeText(value);
    return monthNames.indexOf(text);
  }

  function normalizePrincipal(row){
    const date = parseDate(row.data ?? row.data_venda ?? row.data_emissao ?? row.created_at);
    const oferta = row.oferta_ativa;
    const ofertaText = normalizeText(oferta);
    return {
      raw:row,
      date,
      data:dateISO(date),
      horario:String(row.horario ?? row.hora ?? row.hour ?? "").slice(0,5),
      nfe:String(row.numero_nfe ?? row.num_nf ?? row.nfe ?? row.nf ?? row.nota_fiscal ?? ""),
      clientId:String(row.codigo_cliente ?? row.cod_cliente ?? row.cliente_codigo ?? row.cliente ?? ""),
      clientName:String(row.nome_cliente ?? row.cliente_nome ?? row.nome ?? row.razao_social ?? ""),
      revenue:toNumber(row.faturamento ?? row.valor_faturamento ?? row.valor ?? row.total ?? row.total_nota),
      activeOffer:typeof oferta === "boolean" ? oferta : ["SIM","S","TRUE","1"].includes(ofertaText)
    };
  }

  function normalizeCliente(row){
    const date = parseDate(row.data_inscricao ?? row.data_cadastro ?? row.data ?? row.created_at);
    return {
      raw:row,
      date,
      data:dateISO(date),
      id:String(row.codigo_cliente ?? row.codigo ?? row.cod_cliente ?? row.cliente ?? ""),
      name:String(row.nome_cliente ?? row.nome ?? row.razao_social ?? "")
    };
  }

  function normalizeMeta(row){
    const date = parseDate(row.data_cadastro ?? row.data ?? row.created_at);
    const monthIndex = monthIndexFromValue(row.mes ?? row.mes_nome ?? (date ? date.getMonth()+1 : ""));
    return {
      raw:row,
      date,
      year:Number(row.ano ?? row.year ?? date?.getFullYear()),
      monthIndex,
      value:toNumber(row.meta ?? row.meta_rs ?? row.valor_meta ?? row.valor)
    };
  }

  function normalizeSecundario(row){
    const date = parseDate(row.data ?? row.data_venda ?? row.data_emissao ?? row.created_at);
    const qty = toNumber(row["Quantidade"] ?? row.quantidade ?? row.qtd ?? row.qtde ?? row.qtd_item);
    const unit = toNumber(row["Preco Unit."] ?? row.valor_unitario ?? row.preco_unitario ?? row.valor_produto ?? row.preco ?? row.unitario);
    const total = toNumber(row["Total Item"] ?? row.total_item ?? row.valor_total ?? row.total ?? row.faturamento ?? row.valor) || qty * unit;
    return {
      raw:row,
      date,
      data:dateISO(date),
      nfe:String(row["NUM.NF"] ?? row.numero_nfe ?? row.num_nf ?? row.nfe ?? row.nf ?? row.nota_fiscal ?? ""),
      clientId:String(row["Cliente"] ?? row.codigo_cliente ?? row.cod_cliente ?? row.cliente_codigo ?? ""),
      clientName:String(row["Nome Cliente"] ?? row.nome_cliente ?? row.cliente_nome ?? row.nome_cliente_razao ?? ""),
      productCode:String(row["Cod.Item"] ?? row.codigo_produto ?? row.cod_produto ?? row.cod_item ?? row.codigo_item ?? row.coditem ?? row.produto_codigo ?? row.produto ?? ""),
      product:String(row["Descricao Item"] ?? row.descricao ?? row.nome_produto ?? row.produto_nome ?? row.descricao_produto ?? row.item_descricao ?? row.nome ?? row.produto ?? ""),
      quantity:qty || 1,
      unitValue:unit || (qty ? total / qty : total) || 0,
      total
    };
  }

  function normalizeConversao(row){
    const date = parseDate(row.data ?? row.data_cadastro ?? row.created_at);
    const conversados = Math.round(toNumber(row.conversados));
    const orcaram = Math.round(toNumber(row.orcaram ?? row.orcaram_valor));
    const geraramNfe = Math.round(toNumber(row.geraram_nfe ?? row.nfe ?? row.nfes));
    const perdidos = Math.round(toNumber(row.perdidos));
    return {raw:row,date,data:dateISO(date),conversados,orcaram,geraramNfe,perdidos};
  }

  function normalizeMetaReal(row){
    const date = parseDate(row.data);
    return {
      raw:row,
      date,
      data:dateISO(date),
      metaMensal:toNumber(row.meta_mensal),
      metaFicticiaDia:toNumber(row.meta_ficticia_dia),
      metaRealDia:toNumber(row.meta_real_dia),
      faturamentoDia:toNumber(row.faturamento_dia),
      status:/^(sim|s|true|1)$/i.test(String(row.status ?? ""))
    };
  }

  function normalizeInatividade(row){
    const date = parseDate(row.data_ultima_venda);
    return {
      raw:row,
      id:String(row.id ?? ""),
      nfe:String(row.numero_nfe ?? ""),
      clientId:String(row.codigo_cliente ?? ""),
      clientName:String(row.nome_cliente ?? ""),
      lastDate:date,
      dataUltimaVenda:dateISO(date),
      days:Math.max(0,Math.round(toNumber(row.contagem_dias)))
    };
  }

  function normalizeFeriado(row){
    const date = parseDate(row.data ?? row.date);
    return {
      raw:row,
      date,
      data:dateISO(date),
      name:String(row.nome_feriado ?? row.nome ?? "")
    };
  }

  function resetDashboardPageState(){
    document.querySelectorAll("select").forEach(select=>{
      const firstOption=select.querySelector("option");
      const nextValue=firstOption?firstOption.value:"";
      if(select.value!==nextValue){
        select.value=nextValue;
        select.dispatchEvent(new Event("change",{bubbles:true}));
      }
    });

    document.querySelectorAll(".segmented, .toggle-group, .card-actions, .hist-actions, .view-tabs").forEach(group=>{
      const firstButton=group.querySelector("button:not([disabled])");
      if(firstButton && !firstButton.classList.contains("active")){
        firstButton.click();
      }
    });

    document.querySelectorAll(".open, .is-open").forEach(el=>{
      if(el.classList.contains("page"))return;
      el.classList.remove("open","is-open");
    });
    document.querySelectorAll("[aria-expanded='true']").forEach(el=>el.setAttribute("aria-expanded","false"));
  }

  window.resetDashboardPageState=resetDashboardPageState;
  window.addEventListener("message",event=>{
    if(event.data?.type==="caio-reset-page-state")resetDashboardPageState();
  });

  function registerAutoRefresh(callback,options={}){
    if(typeof callback !== "function") return ()=>{};
    const interval = Math.max(3000,Number(options.interval) || 12000);
    let active = true;
    let stopped = false;
    let running = false;
    let queued = false;
    let timer = null;

    const canRun = ()=>!stopped && active && document.visibilityState !== "hidden" && Boolean(getToken());

    const run = async ()=>{
      if(!canRun()) return;
      if(running){
        queued = true;
        return;
      }
      running = true;
      queued = false;
      try{
        await callback();
      }catch(error){
        if(error?.message !== AUTH_REDIRECT_ERROR) console.warn("[CaioSupabase] Atualização automática falhou",error);
      }finally{
        running = false;
        if(queued) setTimeout(run,80);
      }
    };

    const tick = ()=>{ run(); };
    timer = setInterval(tick,interval);

    const onMessage = event=>{
      const data = event.data || {};
      if(data.type === "caio-page-activity"){
        active = data.active !== false;
        if(active) run();
      }
      if(data.type === "caio-data-changed"){
        run();
      }
    };

    const onStorage = event=>{
      if(event.key === "caio-data-version") run();
    };

    const onVisibility = ()=>{
      if(document.visibilityState !== "hidden") run();
    };

    window.addEventListener("message",onMessage);
    window.addEventListener("storage",onStorage);
    document.addEventListener("visibilitychange",onVisibility);
    window.addEventListener("focus",run);

    if(options.immediate) run();

    return ()=>{
      stopped = true;
      clearInterval(timer);
      window.removeEventListener("message",onMessage);
      window.removeEventListener("storage",onStorage);
      document.removeEventListener("visibilitychange",onVisibility);
      window.removeEventListener("focus",run);
    };
  }

  function byYear(rows,year){
    return rows.filter(row=>row.date && row.date.getFullYear() === Number(year));
  }

  function currentYear(){
    return new Date().getFullYear();
  }

  window.CaioSupabase = {
    getToken,
    hasSession:()=>Boolean(getToken()),
    ensureSession,
    redirectToLogin,
    get,
    getAll,
    tables:TABLES,
    toNumber,
    parseDate,
    dateISO,
    normalizePrincipal,
    normalizeCliente,
    normalizeMeta,
    normalizeSecundario,
    normalizeConversao,
    normalizeMetaReal,
    normalizeInatividade,
    normalizeFeriado,
    byYear,
    currentYear,
    registerAutoRefresh
  };
})();
