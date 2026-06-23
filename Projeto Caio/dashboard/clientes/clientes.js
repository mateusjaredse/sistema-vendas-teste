const BRL = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});

const rankingData = [
  {name:"NUTRIOIL INDUSTRIA E COMERCIO DE GORDURAS E FARINHAS LTDA",revenue:928600.70,nfe:36},
  {name:"RIZZATO",revenue:846230.40,nfe:21},
  {name:"PETRIS",revenue:792480.90,nfe:44},
  {name:"DA SILVA AM",revenue:721950.20,nfe:18},
  {name:"MATEC",revenue:688310.75,nfe:52},
  {name:"ALFA SINAL",revenue:641880.10,nfe:27},
  {name:"NOVA ROTA",revenue:598420.35,nfe:63},
  {name:"BRASIL VIAS",revenue:554900.00,nfe:31},
  {name:"TRIUNFO",revenue:489760.60,nfe:14},
  {name:"VIA NORTE",revenue:432510.45,nfe:47}
];

const newClientsData = [
  {m:"JAN",v:140},
  {m:"FEV",v:168},
  {m:"MAR",v:191},
  {m:"ABR",v:150},
  {m:"MAI",v:110},
  {m:"JUN",v:126},
  {m:"JUL",v:134},
  {m:"AGO",v:119},
  {m:"SET",v:142},
  {m:"OUT",v:157},
  {m:"NOV",v:149},
  {m:"DEZ",v:173}
];

const salesData = [
  {date:"2026-01-08",clientId:"62548",clientName:"RIZZATO",product:"Manta asfaltica premium",productQty:84,productValue:2520.60,nfe:"440112",activeOffer:false},
  {date:"2026-01-19",clientId:"36944",clientName:"NUTRIOIL INDUSTRIA E COMERCIO DE GORDURAS E FARINHAS LTDA",product:"Gordura proteica industrial",productQty:112,productValue:3120.40,nfe:"440148",activeOffer:true},
  {date:"2026-02-06",clientId:"4499",clientName:"PETRIS",product:"Aditivo mineral concentrado",productQty:96,productValue:1840.25,nfe:"440231",activeOffer:true},
  {date:"2026-02-18",clientId:"4421",clientName:"DA SILVA AM",product:"Composto premium unidade",productQty:10,productValue:18476.00,nfe:"440284",activeOffer:false},
  {date:"2026-03-03",clientId:"65231",clientName:"MATEC",product:"Farinha tecnica especial",productQty:138,productValue:2135.80,nfe:"440351",activeOffer:true},
  {date:"2026-03-12",clientId:"54213",clientName:"ALFA SINAL",product:"Base emulsiva azul",productQty:75,productValue:2970.30,nfe:"440389",activeOffer:false},
  {date:"2026-03-22",clientId:"2211",clientName:"NOVA ROTA",product:"Resina industrial flex",productQty:122,productValue:1688.90,nfe:"440421",activeOffer:true},
  {date:"2026-04-04",clientId:"2313",clientName:"BRASIL VIAS",product:"Conjunto estrutural reforcado",productQty:64,productValue:3310.75,nfe:"440512",activeOffer:false},
  {date:"2026-04-15",clientId:"65418",clientName:"TRIUNFO",product:"Polimero alto rendimento",productQty:92,productValue:2418.10,nfe:"440588",activeOffer:true},
  {date:"2026-04-29",clientId:"77420",clientName:"VIA NORTE",product:"Kit acabamento industrial",productQty:118,productValue:1395.45,nfe:"440631",activeOffer:true},
  {date:"2026-05-03",clientId:"62548",clientName:"RIZZATO",product:"Manta asfaltica premium",productQty:130,productValue:2580.00,nfe:"440702",activeOffer:false},
  {date:"2026-05-07",clientId:"4499",clientName:"PETRIS",product:"Aditivo mineral concentrado",productQty:88,productValue:1925.40,nfe:"440748",activeOffer:true},
  {date:"2026-05-11",clientId:"65231",clientName:"MATEC",product:"Farinha tecnica especial",productQty:145,productValue:2210.15,nfe:"440811",activeOffer:true},
  {date:"2026-05-17",clientId:"36944",clientName:"NUTRIOIL INDUSTRIA E COMERCIO DE GORDURAS E FARINHAS LTDA",product:"Gordura proteica industrial",productQty:156,productValue:3188.35,nfe:"440876",activeOffer:false},
  {date:"2026-05-25",clientId:"54213",clientName:"ALFA SINAL",product:"Base emulsiva azul",productQty:104,productValue:2876.90,nfe:"440932",activeOffer:false},
  {date:"2026-06-09",clientId:"2211",clientName:"NOVA ROTA",product:"Resina industrial flex",productQty:92,productValue:1710.25,nfe:"441018",activeOffer:true},
  {date:"2026-06-21",clientId:"4421",clientName:"DA SILVA AM",product:"Composto premium unidade",productQty:16,productValue:17680.00,nfe:"441079",activeOffer:true},
  {date:"2026-07-05",clientId:"2313",clientName:"BRASIL VIAS",product:"Conjunto estrutural reforcado",productQty:76,productValue:3260.10,nfe:"441144",activeOffer:false},
  {date:"2026-07-18",clientId:"65418",clientName:"TRIUNFO",product:"Polimero alto rendimento",productQty:121,productValue:2350.80,nfe:"441209",activeOffer:true},
  {date:"2026-08-02",clientId:"77420",clientName:"VIA NORTE",product:"Kit acabamento industrial",productQty:144,productValue:1422.60,nfe:"441288",activeOffer:false},
  {date:"2026-08-17",clientId:"62548",clientName:"RIZZATO",product:"Manta asfaltica premium",productQty:98,productValue:2660.70,nfe:"441351",activeOffer:true},
  {date:"2026-09-06",clientId:"4499",clientName:"PETRIS",product:"Aditivo mineral concentrado",productQty:115,productValue:1890.35,nfe:"441427",activeOffer:false},
  {date:"2026-09-19",clientId:"65231",clientName:"MATEC",product:"Farinha tecnica especial",productQty:167,productValue:2155.10,nfe:"441490",activeOffer:true},
  {date:"2026-10-08",clientId:"36944",clientName:"NUTRIOIL INDUSTRIA E COMERCIO DE GORDURAS E FARINHAS LTDA",product:"Gordura proteica industrial",productQty:142,productValue:3275.25,nfe:"441561",activeOffer:true},
  {date:"2026-10-24",clientId:"54213",clientName:"ALFA SINAL",product:"Base emulsiva azul",productQty:96,productValue:2940.40,nfe:"441628",activeOffer:false},
  {date:"2026-11-07",clientId:"2211",clientName:"NOVA ROTA",product:"Resina industrial flex",productQty:138,productValue:1744.85,nfe:"441702",activeOffer:true},
  {date:"2026-11-21",clientId:"4421",clientName:"DA SILVA AM",product:"Composto premium unidade",productQty:13,productValue:18120.00,nfe:"441766",activeOffer:false},
  {date:"2026-12-04",clientId:"2313",clientName:"BRASIL VIAS",product:"Conjunto estrutural reforcado",productQty:91,productValue:3385.50,nfe:"441833",activeOffer:true},
  {date:"2026-12-16",clientId:"65418",clientName:"TRIUNFO",product:"Polimero alto rendimento",productQty:134,productValue:2495.70,nfe:"441902",activeOffer:false},
  {date:"2026-12-27",clientId:"77420",clientName:"VIA NORTE",product:"Kit acabamento industrial",productQty:158,productValue:1468.30,nfe:"441976",activeOffer:true}
];

const productCodeData = [
  "3172755","1441237","2684392","1441237","1111497","2086028","1111497","2684667","1352803","1472144",
  "1472718","1529441","1725887","1764363","1494100","1783287","392702","3165362","3020152","1771913",
  "3165362","1494100","2086028","1529445","1783287","2003149","2003149","1882576","2388303","2625884"
];

let rankingMode = "faturamento";
let rankingWaterController = null;
const SALES_COLUMN_STORAGE_KEY = "clientes.salesColumnsDraft.v2";
const SALES_COLUMN_MIN_WIDTH = 12;
const SALES_ROW_HEIGHT = 25;
const SALES_VIRTUAL_RENDER_LIMIT = 15;
const SALES_SORTABLE_COLUMNS = new Set(["date","city","revenue","nfe","activeOffer"]);
const salesColumnDefaults = [
  {key:"index",label:"#",width:81,minWidth:SALES_COLUMN_MIN_WIDTH},
  {key:"date",label:"Data",width:144,minWidth:SALES_COLUMN_MIN_WIDTH},
  {key:"clientId",label:"Cliente",width:155,minWidth:SALES_COLUMN_MIN_WIDTH},
  {key:"clientName",label:"Nome",width:565,minWidth:SALES_COLUMN_MIN_WIDTH},
  {key:"city",label:"Cidade",width:240,minWidth:SALES_COLUMN_MIN_WIDTH},
  {key:"revenue",label:"Faturamento Total",width:253,minWidth:SALES_COLUMN_MIN_WIDTH},
  {key:"nfe",label:"NFE",width:161,minWidth:SALES_COLUMN_MIN_WIDTH},
  {key:"activeOffer",label:"Oferta Ativa",width:124,minWidth:SALES_COLUMN_MIN_WIDTH}
];
const salesColumnMap = new Map(salesColumnDefaults.map(column=>[column.key,column]));
let salesColumnLayout = loadSalesColumnLayout();
let salesVirtualRows = [];
let salesVirtualColumns = [];
let salesVirtualScrollBound = false;
let salesVirtualFrame = 0;
let salesProductsByNfe = new Map();
let salesPrincipalRows = [];
let salesSecundarioRows = [];
let activeSalesProductPopupNfe = "";
let salesSortState = null;
let salesPanelPointerInside = false;
let salesPanelPendingTopReset = false;

function shortMoney(value){
  if(value >= 1000000) return `R$ ${(value/1000000).toFixed(1).replace(".",",")}M`;
  if(value >= 1000) return `R$ ${Math.round(value/1000)}k`;
  return BRL.format(value);
}

function fullMoney(value){
  return `R$ ${value.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
}

function formatRankLabel(name){
  const maxVisibleChars = 52;
  if(name.length <= maxVisibleChars) return name;
  return `${name.slice(0,maxVisibleChars).trimEnd()} ...`;
}

function saleRevenue(row){
  return Number.isFinite(row.revenue) ? row.revenue : row.productQty * row.productValue;
}

function getRankingRowsByMonth(){
  const month = document.getElementById("ranking-filter-month")?.value || "";
  if(!month) return rankingData;

  const rows = salesData.filter(item=>item.date.slice(5,7) === month);
  const grouped = new Map();

  rows.forEach(item=>{
    const key = item.clientId || item.clientName;
    if(!grouped.has(key)){
      grouped.set(key,{
        name:item.clientName,
        revenue:0,
        nfeSet:new Set()
      });
    }

    const client = grouped.get(key);
    client.revenue += saleRevenue(item);
    client.nfeSet.add(item.nfe);
  });

  return [...grouped.values()].map(item=>({
    name:item.name,
    revenue:item.revenue,
    nfe:item.nfeSet.size
  }));
}

function getCurrentSalesMonth(){
  return document.getElementById("sales-filter-month")?.value || "";
}

function filterRowsByCurrentMonth(rows){
  const month = getCurrentSalesMonth();
  if(!month) return rows;
  return rows.filter(item=>String(item.data || item.date || "").slice(5,7) === month);
}

function renderClientVisor(){
  const strip = document.getElementById("client-visor-strip");
  if(!strip) return;

  const principalRows = filterRowsByCurrentMonth(salesPrincipalRows);
  const productRows = filterRowsByCurrentMonth(salesSecundarioRows);
  const totalRevenue = principalRows.reduce((sum,item)=>sum + Number(item.revenue || 0),0);
  const totalNfe = new Set(principalRows.map(item=>String(item.nfe || "")).filter(Boolean)).size;
  const productQuantity = productRows.reduce((sum,item)=>sum + Number(item.quantity || 0),0);
  const distinctProductCount = countDistinctProducts(productRows);
  const highestProductRow = productRows.reduce((best,item)=>!best || Number(item.unitValue || 0) > Number(best.unitValue || 0) ? item : best,null);
  const highestProductValue = Number(highestProductRow?.unitValue || 0);
  const highestProductName = String(highestProductRow?.product || "").toUpperCase();
  const activeOfferRevenue = principalRows.reduce((sum,item)=>sum + (item.activeOffer ? Number(item.revenue || 0) : 0),0);
  const items = [
    {label:"Faturamento",value:fullMoney(totalRevenue),money:true},
    {label:"Ticket Medio",value:fullMoney(totalNfe ? totalRevenue / totalNfe : 0),money:true},
    {label:"Quantidade de NFE",value:totalNfe.toLocaleString("pt-BR")},
    {label:"Quantidade de Produto",value:productQuantity.toLocaleString("pt-BR")},
    {label:"Quantidade de Produto p/ Unidade",value:distinctProductCount.toLocaleString("pt-BR")},
    {label:"Produto de Maior Valor",value:fullMoney(highestProductValue),money:true,reveal:highestProductName},
    {label:"Faturamento p/ Oferta Ativa",value:fullMoney(activeOfferRevenue),money:true}
  ];

  strip.innerHTML = items.map(item=>`
    <div class="visor-item${item.money ? " is-money" : ""}${item.label === "Produto de Maior Valor" || item.reveal ? " has-reveal" : ""}" title="${item.reveal ? escapeHtml(item.reveal) : `${item.label}: ${item.value}`}">
      <span class="visor-label">${item.label}</span>
      <strong class="visor-value">${item.value}</strong>
      ${item.label === "Produto de Maior Valor" || item.reveal ? `<span class="visor-reveal"><span class="visor-reveal-label">NOME DO PRODUTO</span><strong class="visor-reveal-value" title="${escapeHtml(item.reveal)}">${item.reveal ? escapeHtml(item.reveal) : "&nbsp;"}</strong></span>` : ""}
    </div>
  `).join("");
}

function escapeHtml(value){
  return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

function formatDateBR(value){
  const [year,month,day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function normalizeSalesColumnLayout(layout){
  const fallback = salesColumnDefaults.map(column=>({key:column.key,width:column.width}));
  if(!Array.isArray(layout)) return fallback;

  const used = new Set();
  const normalized = layout
    .filter(item=>item && salesColumnMap.has(item.key) && !used.has(item.key))
    .map(item=>{
      used.add(item.key);
      const base = salesColumnMap.get(item.key);
      return {
        key:item.key,
        width:base.width
      };
    });

  salesColumnDefaults.forEach(column=>{
    if(!used.has(column.key)) normalized.push({key:column.key,width:column.width});
  });

  return normalized;
}

function loadSalesColumnLayout(){
  try{
    return normalizeSalesColumnLayout(JSON.parse(localStorage.getItem(SALES_COLUMN_STORAGE_KEY)));
  }catch{
    return normalizeSalesColumnLayout(null);
  }
}

function saveSalesColumnLayout(){
  try{
    localStorage.setItem(SALES_COLUMN_STORAGE_KEY,JSON.stringify(salesColumnLayout));
  }catch{
    // Local storage may be unavailable when the file is opened in stricter browser modes.
  }
}

function getSalesColumns(){
  return salesColumnDefaults.map(column=>({...column,width:column.width}));
}

function renderSalesColumnStructure(columns=getSalesColumns()){
  const colgroup = document.getElementById("sales-list-cols");
  const head = document.getElementById("sales-list-head");
  const table = colgroup?.closest("table");
  if(!colgroup || !head || !table) return;

  colgroup.innerHTML = columns.map(column=>`<col data-col-key="${column.key}" style="width:${column.width}px">`).join("");
  table.style.setProperty("--sales-table-width",`${columns.reduce((sum,column)=>sum + column.width,0)}px`);
  head.innerHTML = `
    <tr>
      ${columns.map(column=>{
        const sortable = SALES_SORTABLE_COLUMNS.has(column.key);
        const active = salesSortState?.key === column.key;
        return `
        <th data-col-key="${column.key}" class="${sortable ? "is-sortable" : ""}${active ? " is-sort-active" : ""}">
          <button type="button" class="sales-th-button" ${sortable ? `data-sales-sort="${column.key}"` : `tabindex="-1"`} aria-label="${sortable ? `Ordenar ${column.label}` : column.label}">
            <span class="sales-th-inner">${column.label}</span>
            ${sortable ? `<span class="sales-sort-indicator">${active ? (salesSortState.direction === "desc" ? "↓" : "↑") : ""}</span>` : ""}
          </button>
        </th>
      `;}).join("")}
    </tr>`;
  bindSalesSortHeaders(head);
}

function moveSalesColumn(fromKey,toKey){
  if(!fromKey || !toKey || fromKey === toKey) return;

  const fromIndex = salesColumnLayout.findIndex(column=>column.key === fromKey);
  const toIndex = salesColumnLayout.findIndex(column=>column.key === toKey);
  if(fromIndex < 0 || toIndex < 0) return;

  const [moved] = salesColumnLayout.splice(fromIndex,1);
  salesColumnLayout.splice(toIndex,0,moved);
  saveSalesColumnLayout();
  renderSalesDashboard();
}

function bindSalesColumnAdjustments(head){
  let dragKey = null;

  head.querySelectorAll("th[data-col-key]").forEach(th=>{
    th.addEventListener("dragstart",event=>{
      dragKey = th.dataset.colKey;
      th.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain",dragKey);
    });

    th.addEventListener("dragend",()=>{
      dragKey = null;
      head.querySelectorAll("th").forEach(item=>item.classList.remove("is-dragging","is-drop-target"));
    });

    th.addEventListener("dragover",event=>{
      event.preventDefault();
      th.classList.add("is-drop-target");
    });

    th.addEventListener("dragleave",()=>{
      th.classList.remove("is-drop-target");
    });

    th.addEventListener("drop",event=>{
      event.preventDefault();
      th.classList.remove("is-drop-target");
      moveSalesColumn(dragKey || event.dataTransfer.getData("text/plain"),th.dataset.colKey);
    });
  });
}

function getSalesSortLabel(key,direction){
  if(key === "date") return direction === "desc" ? "Mais recente" : "Mais antigo";
  if(key === "city") return direction === "desc" ? "Z para A" : "A para Z";
  if(key === "activeOffer") return direction === "desc" ? "SIM primeiro" : "NAO primeiro";
  return direction === "desc" ? "Maior para menor" : "Menor para maior";
}

function closeSalesSortMenu(){
  document.querySelector(".sales-sort-menu")?.remove();
}

function openSalesSortMenu(trigger,key){
  const wrap = trigger.closest(".sales-table-wrap");
  if(!wrap) return;

  closeSalesSortMenu();
  const menu = document.createElement("div");
  menu.className = "sales-sort-menu";
  menu.innerHTML = `
    <button type="button" data-sort-dir="desc">${getSalesSortLabel(key,"desc")}</button>
    <button type="button" data-sort-dir="asc">${getSalesSortLabel(key,"asc")}</button>
  `;
  wrap.appendChild(menu);

  const wrapRect = wrap.getBoundingClientRect();
  const triggerRect = trigger.getBoundingClientRect();
  const menuWidth = 132;
  menu.style.width = `${menuWidth}px`;
  menu.style.left = `${Math.min(Math.max(6,triggerRect.left - wrapRect.left),Math.max(6,wrap.clientWidth - menuWidth - 6))}px`;
  menu.style.top = `${Math.max(29,triggerRect.bottom - wrapRect.top + wrap.scrollTop + 3)}px`;

  menu.querySelectorAll("button").forEach(button=>{
    button.addEventListener("click",event=>{
      event.stopPropagation();
      salesSortState = {key,direction:button.dataset.sortDir === "asc" ? "asc" : "desc"};
      closeSalesSortMenu();
      renderSalesDashboard();
    });
  });
}

function bindSalesSortHeaders(head){
  head.querySelectorAll("[data-sales-sort]").forEach(button=>{
    button.addEventListener("click",event=>{
      event.stopPropagation();
      openSalesSortMenu(button,button.dataset.salesSort);
    });
  });
}

document.addEventListener("click",event=>{
  if(event.target.closest(".sales-sort-menu") || event.target.closest("[data-sales-sort]")) return;
  closeSalesSortMenu();
});

function getFilteredSales(){
  const month = getCurrentSalesMonth();

  if(month){
    return salesData.filter(item=>item.date.slice(5,7) === month);
  }

  return salesData;
}

function normalizeSortText(value){
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase();
}

function getSalesSortValue(item,key){
  switch(key){
    case "date":
      return item.date || "";
    case "city":
      return normalizeSortText(item.city || "Maringa");
    case "revenue":
      return saleRevenue(item);
    case "nfe": {
      const numeric = Number(String(item.nfe || "").replace(/\D/g,""));
      return Number.isFinite(numeric) ? numeric : normalizeSortText(item.nfe);
    }
    case "activeOffer":
      return item.activeOffer ? 1 : 0;
    default:
      return "";
  }
}

function sortSalesRows(rows){
  const sorted = [...rows];
  if(!salesSortState){
    return sorted.sort((a,b)=>String(a.date || "").localeCompare(String(b.date || "")) || String(a.nfe || "").localeCompare(String(b.nfe || "")));
  }

  const {key,direction} = salesSortState;
  const multiplier = direction === "desc" ? -1 : 1;
  sorted.sort((a,b)=>{
    const va = getSalesSortValue(a,key);
    const vb = getSalesSortValue(b,key);
    let result = 0;
    if(typeof va === "number" && typeof vb === "number"){
      result = va - vb;
    }else{
      result = String(va).localeCompare(String(vb),"pt-BR",{numeric:true,sensitivity:"base"});
    }
    if(result === 0){
      result = (a.date || "").localeCompare(b.date || "") || String(a.nfe || "").localeCompare(String(b.nfe || ""));
    }
    return result * multiplier;
  });
  return sorted;
}

function renderSalesCell(item,index,column){
  const revenue = saleRevenue(item);
  let value = "";
  let className = "";
  let title = "";

  switch(column.key){
    case "index":
      value = index + 1;
      break;
    case "date":
      value = formatDateBR(item.date);
      break;
    case "clientId":
      value = escapeHtml(item.clientId);
      break;
    case "clientName":
      value = escapeHtml(item.clientName);
      title = item.clientName;
      break;
    case "city":
      value = escapeHtml(item.city || "MaringÃ¡");
      break;
    case "product":
      value = escapeHtml(item.product);
      title = item.product;
      break;
    case "productQty":
      value = item.productQty.toLocaleString("pt-BR");
      break;
    case "productValue":
      value = fullMoney(item.productValue);
      className = "money";
      break;
    case "revenue":
      value = fullMoney(revenue);
      className = "money";
      break;
    case "nfe":
      value = escapeHtml(item.nfe);
      break;
    case "activeOffer":
      value = item.activeOffer ? "SIM" : "NAO";
      className = item.activeOffer ? "status-active" : "status-idle";
      break;
    case "productCode":
      value = escapeHtml(item.productCode || productCodeData[salesData.indexOf(item) % productCodeData.length] || "");
      break;
  }

  return `<td data-col-key="${column.key}" class="${className}"${title ? ` title="${escapeHtml(title)}"` : ""}>${value}</td>`;
}

function getSaleProductRows(nfe){
  return salesProductsByNfe.get(String(nfe || "")) || [];
}

function getProductsForSalesRows(rows){
  return rows.flatMap((item,index)=>{
    const products = getSaleProductRows(item.nfe);
    if(products.length) return products;
    return [{
      productCode:item.productCode || productCodeData[index % productCodeData.length] || "",
      product:item.product || "",
      quantity:Number(item.productQty || 0),
      unitValue:Number(item.productValue || 0),
      total:saleRevenue(item)
    }];
  });
}

function countDistinctProducts(products){
  const keys = new Set();
  products.forEach(product=>{
    const key = normalizeSortText(product.productCode || product.product || "");
    if(key) keys.add(key);
  });
  return keys.size;
}

function hideSalesProductPopup(){
  activeSalesProductPopupNfe = "";
  document.querySelector(".sales-products-pop")?.remove();
  document.querySelectorAll(".sales-data-row.is-selected").forEach(row=>row.classList.remove("is-selected"));
}

function renderSalesProductPopup(event,rowEl,item){
  const card = rowEl.closest(".sales-panel-card");
  const wrap = rowEl.closest(".sales-table-wrap");
  if(!card || !wrap || !item?.nfe) return;

  const products = getSaleProductRows(item.nfe);
  hideSalesProductPopup();
  activeSalesProductPopupNfe = String(item.nfe);
  rowEl.classList.add("is-selected");

  const popup = document.createElement("div");
  popup.className = "sales-products-pop";
  popup.innerHTML = `
    <div class="sales-products-table-wrap">
      <table class="sales-products-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Produto</th>
            <th>Qtd.</th>
            <th>Preço Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${products.length ? products.map(product=>`
            <tr>
              <td>${escapeHtml(product.productCode || "")}</td>
              <td title="${escapeHtml(product.product || "")}">${escapeHtml(product.product || "")}</td>
              <td>${Number(product.quantity || 0).toLocaleString("pt-BR")}</td>
              <td class="money">${fullMoney(Number(product.unitValue || 0))}</td>
              <td class="money">${fullMoney(Number(product.total || 0))}</td>
            </tr>
          `).join("") : `
            <tr>
              <td colspan="5" class="sales-products-empty">Nenhum produto encontrado para esta NFE.</td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  `;

  card.appendChild(popup);
  const cardRect = card.getBoundingClientRect();
  const pointerX = Number.isFinite(event?.clientX) ? event.clientX : cardRect.left + card.clientWidth - 24;
  const pointerY = Number.isFinite(event?.clientY) ? event.clientY : cardRect.top + card.clientHeight / 2;
  const preferredTop = pointerY - cardRect.top - 18;
  const preferredLeft = pointerX - cardRect.left - 18;
  const maxTop = Math.max(8,card.clientHeight - popup.offsetHeight - 8);
  const maxLeft = Math.max(12,card.clientWidth - popup.offsetWidth - 16);
  popup.style.top = `${Math.min(Math.max(8,preferredTop),maxTop)}px`;
  popup.style.left = `${Math.min(Math.max(12,preferredLeft),maxLeft)}px`;

  popup.addEventListener("pointerleave",hideSalesProductPopup);
}

function scheduleSalesVirtualRender(){
  if(salesVirtualFrame) return;
  salesVirtualFrame = requestAnimationFrame(()=>{
    salesVirtualFrame = 0;
    renderSalesVisibleRows();
  });
}

function bindSalesVirtualScroll(wrap){
  if(salesVirtualScrollBound || !wrap) return;
  salesVirtualScrollBound = true;
  wrap.addEventListener("scroll",scheduleSalesVirtualRender,{passive:true});
}

function bindSalesPanelHoverState(){
  const card = document.querySelector(".sales-panel-card");
  if(!card || card.dataset.hoverStateBound) return;
  card.dataset.hoverStateBound = "1";

  card.addEventListener("pointerenter",()=>{
    salesPanelPointerInside = true;
  });

  card.addEventListener("pointerleave",()=>{
    salesPanelPointerInside = false;
    hideSalesProductPopup();

    if(salesPanelPendingTopReset){
      const wrap = card.querySelector(".sales-table-wrap");
      if(wrap) wrap.scrollTop = 0;
      salesPanelPendingTopReset = false;
      scheduleSalesVirtualRender();
    }
  });
}

function renderSalesVisibleRows(){
  const body = document.getElementById("sales-list-body");
  if(!body) return;
  const wrap = body.closest(".sales-table-wrap");
  if(!wrap || !salesVirtualRows.length){
    if(body) body.innerHTML = "";
    return;
  }

  const columns = salesVirtualColumns.length ? salesVirtualColumns : getSalesColumns();
  const rowCount = salesVirtualRows.length;
  const visibleRows = Math.max(1,Math.ceil((wrap.clientHeight || 0) / SALES_ROW_HEIGHT));
  const visibleCount = Math.min(SALES_VIRTUAL_RENDER_LIMIT,rowCount);
  const baseStart = Math.floor(wrap.scrollTop / SALES_ROW_HEIGHT);
  const bufferBefore = Math.max(0,Math.floor((visibleCount - visibleRows) / 2));
  const maxStart = Math.max(0,rowCount - visibleCount);
  const start = Math.min(maxStart,Math.max(0,baseStart - bufferBefore));
  const end = Math.min(rowCount,start + visibleCount);
  const topHeight = start * SALES_ROW_HEIGHT;
  const bottomHeight = Math.max(0,(rowCount - end) * SALES_ROW_HEIGHT);
  const colspan = Math.max(1,columns.length);
  const rowsHtml = salesVirtualRows.slice(start,end).map((item,offset)=>{
    const rowIndex = start + offset;
    const selected = activeSalesProductPopupNfe && String(item.nfe) === activeSalesProductPopupNfe;
    return `
    <tr class="sales-data-row ${rowIndex % 2 ? "is-even" : "is-odd"}${selected ? " is-selected" : ""}" data-row-index="${rowIndex}" data-nfe="${escapeHtml(item.nfe || "")}">
      ${columns.map(column=>renderSalesCell(item,rowIndex,column)).join("")}
    </tr>
  `;
  }).join("");

  body.innerHTML = `
    ${topHeight ? `<tr class="sales-spacer-row" aria-hidden="true"><td colspan="${colspan}" style="height:${topHeight}px"></td></tr>` : ""}
    ${rowsHtml}
    ${bottomHeight ? `<tr class="sales-spacer-row" aria-hidden="true"><td colspan="${colspan}" style="height:${bottomHeight}px"></td></tr>` : ""}
  `;
}

function renderSalesList(rows){
  const body = document.getElementById("sales-list-body");
  if(!body) return;

  const wrap = body.closest(".sales-table-wrap");
  const keepPanelState = salesPanelPointerInside;
  wrap?.querySelector(".sales-empty-state")?.remove();
  if(!keepPanelState) hideSalesProductPopup();
  wrap?.classList.remove("is-empty");

  const columns = getSalesColumns();
  renderSalesColumnStructure(columns);
  bindSalesVirtualScroll(wrap);

  const sorted = sortSalesRows(rows);
  if(!sorted.length){
    salesVirtualRows = [];
    salesVirtualColumns = columns;
    body.innerHTML = "";
    wrap?.classList.add("is-empty");
    return;
  }

  salesVirtualRows = sorted;
  salesVirtualColumns = columns;
  if(wrap && !keepPanelState){
    wrap.scrollTop = 0;
    salesPanelPendingTopReset = false;
  }else if(wrap && keepPanelState){
    salesPanelPendingTopReset = true;
  }
  renderSalesVisibleRows();
}

function bindSalesProductPopup(){
  const body = document.getElementById("sales-list-body");
  const wrap = body?.closest(".sales-table-wrap");
  if(!body || body.dataset.productPopupBound) return;
  body.dataset.productPopupBound = "1";
  body.addEventListener("click",event=>{
    const rowEl = event.target.closest(".sales-data-row");
    if(!rowEl) return;
    const index = Number(rowEl.dataset.rowIndex);
    const item = salesVirtualRows[index];
    if(!item) return;
    if(activeSalesProductPopupNfe && String(item.nfe) === activeSalesProductPopupNfe){
      hideSalesProductPopup();
      return;
    }
    renderSalesProductPopup(event,rowEl,item);
  });
  document.addEventListener("click",event=>{
    if(event.target.closest(".sales-products-pop") || event.target.closest(".sales-data-row")) return;
    hideSalesProductPopup();
  });
}

function renderSalesDashboard(){
  const rows = getFilteredSales();
  renderSalesList(rows);
  renderClientVisor();
}

function bindSalesFilters(){
  const month = document.getElementById("sales-filter-month");
  if(!month) return;

  month.addEventListener("change",()=>{
    renderSalesDashboard();
  });
}

function seededRandom(seed){
  const x = Math.sin(seed) * 43758.5453123;
  return x - Math.floor(x);
}

function smoothNoise2D(x,y,seed){
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const sx = xf * xf * (3 - 2 * xf);
  const sy = yf * yf * (3 - 2 * yf);
  const h = (ix,iy)=>seededRandom(ix * 127.1 + iy * 311.7 + seed * 74.7) * 2 - 1;
  const a = h(xi,yi);
  const b = h(xi + 1,yi);
  const c = h(xi,yi + 1);
  const d = h(xi + 1,yi + 1);
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
}

function createSeededRng(seed){
  let state = seed >>> 0;
  return ()=>{
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function renderRanking(mode=rankingMode){
  rankingMode = mode;
  const board = document.getElementById("ranking-board");
  if(!board) return;

  const metricKey = mode === "nfe" ? "nfe" : "revenue";
  const rows = getRankingRowsByMonth().sort((a,b)=>b[metricKey]-a[metricKey]).slice(0,10);

  if(!rows.length){
    if(rankingWaterController){
      cancelAnimationFrame(rankingWaterController.frame);
      rankingWaterController = null;
    }
    board.innerHTML = "";
    return;
  }

  const heightValues = rows.map(row=>mode === "nfe" ? row.revenue/Math.max(row.nfe,1) : row.revenue);
  const maxValue = Math.max(...heightValues);

  board.innerHTML = rows.map((row,index)=>{
    const nfeCount = Math.max(row.nfe,1);
    const metricValue = mode === "nfe" ? row.revenue/nfeCount : row.revenue;
    const ratio = metricValue/maxValue;
    const height = Math.round(24 + Math.pow(ratio,.62)*62);
    const averageRevenue = row.revenue/nfeCount;
    const topValue = mode === "nfe" ? fullMoney(averageRevenue) : shortMoney(row.revenue);
    const primaryInside = mode === "nfe" ? `${row.nfe} NFE` : fullMoney(row.revenue);
    const secondaryInside = mode === "nfe" ? fullMoney(row.revenue) : `${row.nfe} NFE`;
    const tertiaryInside = mode === "nfe" ? `Media ${fullMoney(averageRevenue)}` : "Faturamento";
    const labelName = formatRankLabel(row.name);
    const baseValue = mode === "nfe" ? `<div class="rank-base-value">${row.nfe}</div>` : "";
    const detailRows = mode === "nfe"
      ? `<span>${tertiaryInside}</span>`
      : `<span>${secondaryInside}</span>`;

    return `
      <div class="rank-slot" style="--slot-h:${height}%">
        <div class="rank-plot">
          <div class="rank-value">${topValue}</div>
          <div class="rank-column">
            <canvas class="ranking-water-canvas" aria-hidden="true"></canvas>
            <div class="rank-inside">
              <strong>${primaryInside}</strong>
              ${detailRows}
            </div>
            ${baseValue}
          </div>
        </div>
        <div class="rank-label">
          <span class="rank-index">#${index+1}</span>
          <span class="rank-name" title="${row.name}">${labelName}</span>
        </div>
      </div>`;
  }).join("");

  initRankingWater();
}

function createRankingWaterSim(column,canvas,index){
  const ctx = canvas.getContext("2d");
  const plot = column.closest(".rank-plot");
  const valueLabel = plot?.querySelector(".rank-value");
  const pointCount = 96;
  const pos = new Float32Array(pointCount);
  const vel = new Float32Array(pointCount);
  const acc = new Float32Array(pointCount);
  const leftDelta = new Float32Array(pointCount);
  const rightDelta = new Float32Array(pointCount);
  const rand = createSeededRng((index + 1) * 987654321);
  const seed = index * 1337 + 42;
  let logicalWidth = 180;
  let logicalHeight = 124;
  const layers = [
    {sx:.018,st:.34,amp:3.7,to:seededRandom(seed + 1) * 100},
    {sx:.055,st:.66,amp:2.0,to:seededRandom(seed + 2) * 100},
    {sx:.14,st:1.18,amp:.85,to:seededRandom(seed + 3) * 100},
    {sx:.30,st:2.2,amp:.34,to:seededRandom(seed + 4) * 100},
    {sx:.60,st:3.6,amp:.16,to:seededRandom(seed + 5) * 100}
  ];
  let width = logicalWidth;
  let height = logicalHeight;
  let dpr = 1;
  let labelSurfaceY = null;
  let nextDisturbance = performance.now() + rand() * 760 + 260;

  function resize(){
    const nextDpr = Math.min((window.devicePixelRatio || 1) * 2,3);
    logicalWidth = Math.max(24,Math.round(column.clientWidth || column.getBoundingClientRect().width));
    logicalHeight = Math.max(44,Math.round(column.clientHeight || column.getBoundingClientRect().height));
    const pixelWidth = Math.round(logicalWidth * nextDpr);
    const pixelHeight = Math.round(logicalHeight * nextDpr);
    if(canvas.width === pixelWidth && canvas.height === pixelHeight) return;

    width = logicalWidth;
    height = logicalHeight;
    dpr = nextDpr;
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    draw();
  }

  function disturb(now){
    if(now < nextDisturbance) return;
    const ripples = rand() > .76 ? 2 : 1;
    for(let ripple=0;ripple<ripples;ripple++){
      const center = Math.floor(rand()*pointCount);
      const force = (rand()-.5)*6.0;
      const radius = Math.floor(rand()*8)+5;
      for(let offset=-radius;offset<=radius;offset++){
        const j = center+offset;
        if(j<0 || j>=pointCount) continue;
        const envelope = Math.exp(-(offset*offset)/(radius*radius*.9));
        vel[j] += force*envelope;
      }
    }
    nextDisturbance = now + rand()*760 + 260;
  }

  function step(now){
    resize();
    const t = now*.001;
    const spring = .023;
    const damping = .94;
    const spread = .132;
    const iterations = 9;
    const heightScale = Math.max(.46,Math.min(.86,height/112));

    for(let j=0;j<pointCount;j++){
      let target = 0;
      layers.forEach(layer=>{
        target += layer.amp*heightScale*smoothNoise2D(j*layer.sx+layer.to,t*layer.st+layer.to*.3,seed);
      });
      acc[j] = -spring*(pos[j]-target);
    }

    for(let j=0;j<pointCount;j++){
      vel[j] = vel[j]*damping + acc[j];
      pos[j] += vel[j];
    }

    for(let pass=0;pass<iterations;pass++){
      leftDelta.fill(0);
      rightDelta.fill(0);
      for(let j=0;j<pointCount;j++){
        if(j>0){
          leftDelta[j] = spread*(pos[j]-pos[j-1]);
          vel[j-1] += leftDelta[j];
        }
        if(j<pointCount-1){
          rightDelta[j] = spread*(pos[j]-pos[j+1]);
          vel[j+1] += rightDelta[j];
        }
      }
      for(let j=0;j<pointCount;j++){
        if(j>0) pos[j-1] += leftDelta[j];
        if(j<pointCount-1) pos[j+1] += rightDelta[j];
      }
    }

    disturb(now);
    draw();
  }

  function draw(){
    const restY = Math.max(9,Math.min(17,height*.18));
    ctx.clearRect(0,0,width,height);

    const points = [];
    for(let j=0;j<pointCount;j++){
      points.push({
        x:(j/(pointCount-1))*width,
        y:Math.max(3,Math.min(height-8,restY+pos[j]))
      });
    }

    const gradient = ctx.createLinearGradient(0,0,0,height);
    gradient.addColorStop(0,"rgba(3,59,179,.9)");
    gradient.addColorStop(.52,"rgba(0,51,109,.82)");
    gradient.addColorStop(1,"rgba(0,38,88,.78)");

    ctx.beginPath();
    ctx.moveTo(points[0].x,points[0].y);
    for(let j=1;j<pointCount-1;j++){
      const midX = (points[j].x+points[j+1].x)*.5;
      const midY = (points[j].y+points[j+1].y)*.5;
      ctx.quadraticCurveTo(points[j].x,points[j].y,midX,midY);
    }
    ctx.lineTo(points[pointCount-1].x,points[pointCount-1].y);
    ctx.lineTo(width,height);
    ctx.lineTo(0,height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.moveTo(points[0].x,points[0].y);
    for(let j=1;j<pointCount-1;j++){
      const midX = (points[j].x+points[j+1].x)*.5;
      const midY = (points[j].y+points[j+1].y)*.5;
      ctx.quadraticCurveTo(points[j].x,points[j].y,midX,midY);
    }
    ctx.lineTo(points[pointCount-1].x,points[pointCount-1].y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(147,197,253,.56)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    for(let j=3;j<pointCount-3;j+=6){
      const slope = pos[j+2] - pos[j-2];
      if(slope > -.55) continue;
      const alpha = Math.min(.28,Math.abs(slope)*.06);
      const radius = Math.min(6,2 + Math.abs(slope)*.18);
      const glow = ctx.createRadialGradient(points[j].x,points[j].y,0,points[j].x,points[j].y,radius*2.8);
      glow.addColorStop(0,`rgba(255,255,255,${alpha.toFixed(2)})`);
      glow.addColorStop(1,"rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(points[j].x,points[j].y,radius*2.8,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
    syncValueLabel(points[Math.floor(pointCount/2)].y);
  }

  resize();
  return {resize,step};

  function syncValueLabel(surfaceY){
    if(!plot || !valueLabel || !height) return;
    labelSurfaceY = labelSurfaceY === null ? surfaceY : labelSurfaceY + (surfaceY - labelSurfaceY) * .18;

    const plotRect = plot.getBoundingClientRect();
    const columnRect = column.getBoundingClientRect();
    const valueHeight = valueLabel.offsetHeight || 13;
    const surfaceCss = (labelSurfaceY/height) * columnRect.height;
    const top = (columnRect.top - plotRect.top) + surfaceCss - 10 - valueHeight;
    plot.style.setProperty("--rank-value-top",`${top.toFixed(2)}px`);
  }
}

function initRankingWater(){
  if(rankingWaterController){
    cancelAnimationFrame(rankingWaterController.frame);
  }

  const simulations = [...document.querySelectorAll(".rank-column")].map((column,index)=>{
    const canvas = column.querySelector(".ranking-water-canvas");
    return createRankingWaterSim(column,canvas,index);
  });

  function animate(now){
    simulations.forEach(sim=>sim.step(now));
    rankingWaterController.frame = requestAnimationFrame(animate);
  }

  rankingWaterController = {
    frame:requestAnimationFrame(animate),
    simulations
  };
}

function bindRankingTabs(){
  document.querySelectorAll("[data-ranking]").forEach(button=>{
    button.addEventListener("click",()=>{
      if(button.classList.contains("active") || button.dataset.ranking === rankingMode) return;
      document.querySelectorAll("[data-ranking]").forEach(item=>item.classList.remove("active"));
      button.classList.add("active");
      renderRanking(button.dataset.ranking);
    });
  });
}

function bindRankingMonthFilter(){
  const filter = document.getElementById("ranking-filter-month");
  if(!filter) return;

  filter.addEventListener("change",()=>renderRanking(rankingMode));
}

function renderNewClients(){
  const grid = document.getElementById("new-clients-grid");
  if(!grid) return;

  const sorted = [...newClientsData].sort((a,b)=>b.v-a.v);
  const rankMap = {};
  sorted.forEach((item,index)=>{
    rankMap[item.m] = index + 1;
  });

  const max = Math.max(...newClientsData.map(item=>item.v));
  const min = Math.min(...newClientsData.map(item=>item.v));
  const hasAnyValue = newClientsData.some(item=>item.v > 0);

  grid.innerHTML = newClientsData.map(item=>{
    const state = hasAnyValue ? `${item.v === max ? " is-max" : ""}${item.v === min ? " is-min" : ""}` : "";
    return `
      <div class="new-client-month${state}">
        <strong>${item.m}</strong>
        <span class="ncm-val">${item.v}</span>
        <span class="ncm-rank">#${rankMap[item.m]} de 12</span>
      </div>`;
  }).join("");

  requestAnimationFrame(renderNewClientsShine);
}

function renderNewClientsShine(){
  const grid = document.getElementById("new-clients-grid");
  if(!grid) return;

  grid.querySelectorAll(".ncm-shine").forEach(shine=>shine.remove());

  const gridRect = grid.getBoundingClientRect();
  if(!gridRect.width || !gridRect.height) return;

  const tiles = [...grid.querySelectorAll(".new-client-month")];
  const firstTile = tiles[0]?.getBoundingClientRect();
  const shineWidth = Math.max(440,(firstTile?.width || gridRect.width / 4) * 2.85 + 120);
  const shineStart = -shineWidth - 80;
  const shineEnd = gridRect.width + 80;
  const skewOffsetRatio = Math.tan(-13 * Math.PI / 180);

  tiles.forEach(month=>{
    const isMax = month.classList.contains("is-max");
    const isMin = month.classList.contains("is-min");
    if(!isMax && !isMin) return;

    const rect = month.getBoundingClientRect();
    const x = rect.left - gridRect.left;
    const y = rect.top - gridRect.top;
    const skewOffset = skewOffsetRatio * y;
    const color = isMax
      ? "250,204,21"
      : "248,113,113";
    const shine = document.createElement("span");
    shine.className = "ncm-shine";
    shine.style.setProperty("--shine-width",`${shineWidth.toFixed(2)}px`);
    shine.style.setProperty("--shine-start",`${(shineStart - x + skewOffset).toFixed(2)}px`);
    shine.style.setProperty("--shine-end",`${(shineEnd - x + skewOffset).toFixed(2)}px`);
    shine.style.setProperty("--shine-rgb",color);
    month.appendChild(shine);
  });
}

function replaceArray(target,items){
  target.splice(0,target.length,...items);
}

async function hydrateClientesFromSupabase(){
  const api = window.CaioSupabase;
  if(!api?.get) return;

  const currentYear = api.currentYear();
  const [principalRows,clientesRows,secundarioRows] = await Promise.all([
    (api.getAll || api.get)(api.tables.principal,"select=*"),
    (api.getAll || api.get)(api.tables.clientes,"select=*"),
    (api.getAll || api.get)(api.tables.secundario,"select=*")
  ]);

  const principal = principalRows
    .map(api.normalizePrincipal)
    .filter(row=>row.date && row.date.getFullYear() === currentYear);
  salesPrincipalRows = principal;

  if(principal.length){
    const ranking = new Map();
    principal.forEach(row=>{
      const key = row.clientId || row.clientName;
      if(!key) return;
      if(!ranking.has(key)) ranking.set(key,{name:row.clientName || key,revenue:0,nfeSet:new Set()});
      const item = ranking.get(key);
      item.revenue += row.revenue;
      if(row.nfe) item.nfeSet.add(row.nfe);
    });
    replaceArray(rankingData,[...ranking.values()].map(item=>({
      name:item.name,
      revenue:item.revenue,
      nfe:item.nfeSet.size || 1
    })));
  }else{
    replaceArray(rankingData,[]);
  }

  const clients = clientesRows.map(api.normalizeCliente).filter(row=>row.date && row.date.getFullYear() === currentYear);
  const monthLabels = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
  if(clients.length){
    const counts = Array(12).fill(0);
    clients.forEach(client=>{ counts[client.date.getMonth()] += 1; });
    replaceArray(newClientsData,monthLabels.map((m,index)=>({
      m,
      v:counts[index]
    })));
  }else{
    replaceArray(newClientsData,monthLabels.map(m=>({m,v:0})));
  }

  const principalByNfe = new Map(principal.map(row=>[row.nfe,row]));
  const secundario = secundarioRows
    .map(api.normalizeSecundario)
    .filter(row=>row.date && row.date.getFullYear() === currentYear);
  salesSecundarioRows = secundario.map((item,index)=>({
    date:item.date,
    data:item.data,
    nfe:item.nfe || "",
    clientId:item.clientId || "",
    clientName:item.clientName || "",
    productCode:item.productCode || productCodeData[index % productCodeData.length] || "",
    product:item.product || "",
    quantity:Number(item.quantity || 0),
    unitValue:Number(item.unitValue || 0),
    total:Number(item.total || 0)
  }));

  salesProductsByNfe = new Map();
  salesSecundarioRows.forEach((item,index)=>{
    const key = item.nfe || `sem-nfe-${index}`;
    if(!salesProductsByNfe.has(key)) salesProductsByNfe.set(key,[]);
    salesProductsByNfe.get(key).push({
      productCode:item.productCode || productCodeData[index % productCodeData.length] || "",
      product:item.product || "",
      quantity:item.quantity || 1,
      unitValue:item.unitValue || 0,
      total:item.total || (item.quantity || 1) * (item.unitValue || 0)
    });
  });

  const secondarySales = new Map();
  secundario.forEach((item,index)=>{
    const key = item.nfe || `sem-nfe-${index}`;
    const nota = principalByNfe.get(item.nfe);
    if(!secondarySales.has(key)){
      secondarySales.set(key,{
        date:item.data || nota?.data || "",
        clientId:item.clientId || nota?.clientId || "",
        clientName:item.clientName || nota?.clientName || "Cliente sem nome",
        city:"Maringa",
        product:"Produtos da nota",
        productQty:0,
        productValue:0,
        revenue:0,
        nfe:item.nfe || nota?.nfe || "",
        activeOffer:nota?.activeOffer || false,
        productCode:""
      });
    }
    const sale = secondarySales.get(key);
    sale.productQty += item.quantity || 1;
    sale.productValue = Math.max(sale.productValue,item.unitValue || 0);
    sale.revenue += item.total || (item.quantity || 1) * (item.unitValue || 0);
  });

  if(principal.length){
    const secondaryKeys = new Set(secondarySales.keys());
    const principalSales = principal.map((item,index)=>{
      const products = salesProductsByNfe.get(item.nfe) || [];
      const productQty = products.reduce((sum,product)=>sum + (Number(product.quantity) || 0),0);
      const maxUnitValue = products.reduce((max,product)=>Math.max(max,Number(product.unitValue) || 0),0);
      secondaryKeys.delete(item.nfe);
      return {
        date:item.data,
        clientId:item.clientId,
        clientName:item.clientName || "Cliente sem nome",
        city:"Maringa",
        product:products[0]?.product || "Nota fiscal consolidada",
        productQty:productQty || 1,
        productValue:maxUnitValue || item.revenue,
        revenue:item.revenue,
        nfe:item.nfe,
        activeOffer:item.activeOffer,
        productCode:products[0]?.productCode || productCodeData[index % productCodeData.length] || ""
      };
    });
    replaceArray(salesData,[
      ...principalSales,
      ...[...secondaryKeys].map(key=>secondarySales.get(key)).filter(Boolean)
    ]);
  }else if(secundario.length){
    replaceArray(salesData,[...secondarySales.values()]);
  }else{
    replaceArray(salesData,[]);
  }

  renderRanking(rankingMode);
  renderNewClients();
  renderSalesDashboard();
}

document.addEventListener("DOMContentLoaded",()=>{
  bindRankingTabs();
  bindRankingMonthFilter();
  bindSalesFilters();
  bindSalesPanelHoverState();
  bindSalesProductPopup();
  hydrateClientesFromSupabase();
  window.CaioSupabase?.registerAutoRefresh?.(hydrateClientesFromSupabase,{interval:12000});
  window.addEventListener("resize",()=>{
    rankingWaterController?.simulations?.forEach(sim=>sim.resize());
    renderNewClientsShine();
    scheduleSalesVirtualRender();
  });
});
