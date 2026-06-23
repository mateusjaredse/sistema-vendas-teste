const BRL = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});

const productSalesData = [
  {date:"2026-01-08",product:"Manta asfaltica premium",productCode:"3172755",productQty:74,productValue:2460.20},
  {date:"2026-01-19",product:"Gordura proteica industrial",productCode:"1441237",productQty:96,productValue:3018.90},
  {date:"2026-02-06",product:"Aditivo mineral concentrado",productCode:"2684392",productQty:88,productValue:1798.50},
  {date:"2026-02-18",product:"Composto premium unidade",productCode:"1352803",productQty:22,productValue:14720.00},
  {date:"2026-03-03",product:"Farinha tecnica especial",productCode:"1111497",productQty:126,productValue:2135.80},
  {date:"2026-03-12",product:"Base emulsiva azul",productCode:"2086028",productQty:69,productValue:2884.40},
  {date:"2026-04-04",product:"Conjunto estrutural reforcado",productCode:"1529441",productQty:54,productValue:3310.75},
  {date:"2026-04-15",product:"Polimero alto rendimento",productCode:"1725887",productQty:83,productValue:2418.10},
  {date:"2026-04-29",product:"Kit acabamento industrial",productCode:"1764363",productQty:106,productValue:1395.45},

  {date:"2026-05-08",product:"Manta asfaltica premium",productCode:"3172755",productQty:84,productValue:2520.60},
  {date:"2026-05-19",product:"Gordura proteica industrial",productCode:"1441237",productQty:112,productValue:3120.40},
  {date:"2026-05-06",product:"Aditivo mineral concentrado",productCode:"2684392",productQty:96,productValue:1840.25},
  {date:"2026-05-18",product:"Composto premium unidade",productCode:"1352803",productQty:10,productValue:18476.00},
  {date:"2026-05-03",product:"Farinha tecnica especial",productCode:"1111497",productQty:138,productValue:2135.80},
  {date:"2026-05-12",product:"Base emulsiva azul",productCode:"2086028",productQty:75,productValue:2970.30},
  {date:"2026-05-22",product:"Resina industrial flex",productCode:"1472718",productQty:122,productValue:1688.90},
  {date:"2026-05-04",product:"Conjunto estrutural reforcado",productCode:"1529441",productQty:64,productValue:3310.75},
  {date:"2026-05-15",product:"Polimero alto rendimento",productCode:"1725887",productQty:92,productValue:2418.10},
  {date:"2026-05-29",product:"Kit acabamento industrial",productCode:"1764363",productQty:118,productValue:1395.45},

  {date:"2026-06-03",product:"Manta asfaltica premium",productCode:"3172755",productQty:130,productValue:2580.00},
  {date:"2026-06-07",product:"Gordura proteica industrial",productCode:"1441237",productQty:88,productValue:1925.40},
  {date:"2026-06-11",product:"Aditivo mineral concentrado",productCode:"2684392",productQty:145,productValue:2210.15},
  {date:"2026-06-17",product:"Composto premium unidade",productCode:"1352803",productQty:156,productValue:1188.35},
  {date:"2026-06-25",product:"Farinha tecnica especial",productCode:"1111497",productQty:104,productValue:2076.90},
  {date:"2026-06-09",product:"Base emulsiva azul",productCode:"2086028",productQty:92,productValue:1710.25},
  {date:"2026-06-21",product:"Resina industrial flex",productCode:"1472718",productQty:16,productValue:880.00},
  {date:"2026-06-05",product:"Conjunto estrutural reforcado",productCode:"1529441",productQty:76,productValue:3260.10},
  {date:"2026-06-18",product:"Polimero alto rendimento",productCode:"1725887",productQty:121,productValue:2950.80},
  {date:"2026-06-02",product:"Kit acabamento industrial",productCode:"1764363",productQty:144,productValue:1422.60},
  {date:"2026-06-28",product:"Novo Item Catalogo",productCode:"9999999",productQty:50,productValue:1000.00}
];

let rankingMode = "faturamento";
let variationMode = "faturamento";
let rankingWaterController = null;

function escapeHtml(value){
  return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

function saleRevenue(item){
  return item.productQty * item.productValue;
}

function fullMoney(value){
  return `R$ ${value.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
}

function shortMoney(value){
  if(value >= 1000000) return `R$ ${(value/1000000).toFixed(1).replace(".",",")}M`;
  if(value >= 1000) return `R$ ${Math.round(value/1000)}k`;
  return BRL.format(value);
}

function shortName(name,max=28){
  return name.length > max ? `${name.slice(0,max).trimEnd()}...` : name;
}

function pctLabel(pct){
  if(isNeutralVariation(pct)) return "0,00%";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2).replace(".",",")}%`;
}

function isNeutralVariation(pct){
  return Math.abs(Number(pct) || 0) < .05;
}

function variationToneClass(item){
  if(isNeutralVariation(item.pct)) return "var-flat";
  return item.pct > 0 ? "var-up" : "var-down";
}

function formatRankLabel(name){
  const maxVisibleChars = 52;
  if(name.length <= maxVisibleChars) return name;
  return `${name.slice(0,maxVisibleChars).trimEnd()} ...`;
}

function buildMonthlyProductTotals(){
  const totals = new Map();

  productSalesData.forEach(item=>{
    const month = item.date.slice(0,7);
    const code = item.productCode;

    if(!totals.has(code)){
      totals.set(code,{code,name:item.product,months:new Map()});
    }

    const entry = totals.get(code);
    const current = entry.months.get(month) || {revenue:0,quantity:0};
    current.revenue += saleRevenue(item);
    current.quantity += item.productQty;
    entry.months.set(month,current);
  });

  return totals;
}

function getLastTwoMonths(){
  const now = new Date();
  const currMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const prevDate = new Date(now.getFullYear(),now.getMonth()-1,1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth()+1).padStart(2,"0")}`;
  return [prevMonth,currMonth];
}

function getProductVariations(mode=variationMode){
  const totals = buildMonthlyProductTotals();
  const [prevMonth,currMonth] = getLastTwoMonths();
  if(!prevMonth || !currMonth) return [];

  const variations = [];
  totals.forEach(entry=>{
    const prevData = entry.months.get(prevMonth) || {revenue:0,quantity:0};
    const currData = entry.months.get(currMonth) || {revenue:0,quantity:0};
    const prev = mode === "quantidade" ? prevData.quantity : prevData.revenue;
    const curr = mode === "quantidade" ? currData.quantity : currData.revenue;
    if(prev <= 0 || curr <= 0) return;

    const pct = ((curr - prev) / prev) * 100;
    variations.push({...entry,prev,curr,pct,mode});
  });

  return variations.sort((a,b)=>b.pct - a.pct);
}

function formatVariationTitle(item){
  const prev = item.mode === "quantidade"
    ? `${item.prev.toLocaleString("pt-BR")} un.`
    : fullMoney(item.prev);
  const curr = item.mode === "quantidade"
    ? `${item.curr.toLocaleString("pt-BR")} un.`
    : fullMoney(item.curr);
  return `${item.name} (${item.code}) | Anterior: ${prev} | Atual: ${curr}`;
}

function getTickerVariationOrder(variations){
  const bySold = [...variations].sort((a,b)=>{
    const soldDiff = Number(b.curr || 0) - Number(a.curr || 0);
    if(soldDiff) return soldDiff;
    return Math.abs(b.pct) - Math.abs(a.pct);
  });

  const ordered = [];
  let left = 0;
  let right = bySold.length - 1;

  while(left <= right){
    ordered.push(bySold[left++]);
    if(left <= right) ordered.push(bySold[right--]);
  }

  return ordered;
}

function renderVariationCard(mode=variationMode){
  variationMode = mode;
  const variations = getProductVariations(mode);
  const positives = variations.filter(item=>item.pct >= 0).slice(0,5);
  const negatives = variations.filter(item=>item.pct < 0).sort((a,b)=>a.pct - b.pct).slice(0,5);
  const upList = document.getElementById("var-up-list");
  const downList = document.getElementById("var-down-list");
  const ticker = document.getElementById("var-ticker");

  if(upList){
    upList.innerHTML = positives.map(item=>`
      <div class="var-row">
        <span class="var-name" title="${escapeHtml(formatVariationTitle(item))}">
          <i class="var-arrow ${variationToneClass(item)}"></i>${escapeHtml(shortName(item.name))}
        </span>
        <span class="var-pct ${variationToneClass(item)}">${pctLabel(item.pct)}</span>
      </div>
    `).join("");
  }

  if(downList){
    downList.innerHTML = negatives.map(item=>`
      <div class="var-row">
        <span class="var-name" title="${escapeHtml(formatVariationTitle(item))}">
          <i class="var-arrow ${variationToneClass(item)}"></i>${escapeHtml(shortName(item.name))}
        </span>
        <span class="var-pct ${variationToneClass(item)}">${pctLabel(item.pct)}</span>
      </div>
    `).join("");
  }

  if(ticker){
    const items = getTickerVariationOrder(variations).map(item=>{
      const cls = variationToneClass(item);
      return `<span class="ticker-item ${cls}" title="${escapeHtml(formatVariationTitle(item))}"><i class="var-arrow ${cls}"></i>${escapeHtml(item.name)} ${pctLabel(item.pct)}</span>`;
    });
    ticker.innerHTML = [...items,...items].join("");
    startTickerAnimation(ticker);
  }
}

function bindVariationTabs(){
  document.querySelectorAll("[data-variation]").forEach(button=>{
    button.addEventListener("click",()=>{
      if(button.classList.contains("active") || button.dataset.variation === variationMode) return;
      document.querySelectorAll("[data-variation]").forEach(item=>item.classList.remove("active"));
      button.classList.add("active");
      renderVariationCard(button.dataset.variation);
    });
  });
}

function startTickerAnimation(track){
  if(track._tickerFrame) cancelAnimationFrame(track._tickerFrame);
  let x = Number.isFinite(track._tickerX) ? track._tickerX : 0;
  const speed = .62;

  function step(){
    x -= speed;
    const half = track.scrollWidth / 2;
    if(half > 0){
      while(x <= -half) x += half;
      while(x > 0) x -= half;
    }
    track._tickerX = x;
    track.style.transform = `translateX(${x}px)`;
    track._tickerFrame = requestAnimationFrame(step);
  }

  track._tickerFrame = requestAnimationFrame(step);
}

function getProductRankingRowsByMonth(){
  const month = document.getElementById("ranking-filter-month")?.value || "";
  const rows = month ? productSalesData.filter(item=>item.date.slice(5,7) === month) : productSalesData;
  const grouped = new Map();

  rows.forEach(item=>{
    const key = item.productCode;
    if(!grouped.has(key)){
      grouped.set(key,{code:item.productCode,name:item.product,revenue:0,quantity:0});
    }

    const product = grouped.get(key);
    product.revenue += saleRevenue(item);
    product.quantity += item.productQty;
  });

  return [...grouped.values()].map(item=>({
    ...item,
    averageValue:item.quantity ? item.revenue / item.quantity : 0
  }));
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

  const metricKey = mode === "quantidade" ? "quantity" : "revenue";
  const rows = getProductRankingRowsByMonth().sort((a,b)=>b[metricKey]-a[metricKey]).slice(0,10);

  if(!rows.length){
    if(rankingWaterController){
      cancelAnimationFrame(rankingWaterController.frame);
      rankingWaterController = null;
    }
    board.innerHTML = "";
    return;
  }

  const heightValues = rows.map(row=>mode === "quantidade" ? row.quantity : row.revenue);
  const maxValue = Math.max(...heightValues);

  board.innerHTML = rows.map((row,index)=>{
    const metricValue = mode === "quantidade" ? row.quantity : row.revenue;
    const ratio = metricValue/maxValue;
    const height = Math.round(24 + Math.pow(ratio,.62)*62);
    const topValue = mode === "quantidade" ? fullMoney(row.averageValue) : shortMoney(row.revenue);
    const primaryInside = mode === "quantidade" ? `${row.quantity.toLocaleString("pt-BR")} UN` : fullMoney(row.revenue);
    const secondaryInside = mode === "quantidade" ? `Valor ${fullMoney(row.averageValue)}` : `${row.quantity.toLocaleString("pt-BR")} UN`;
    const tertiaryInside = mode === "quantidade" ? `Fat. ${fullMoney(row.revenue)}` : `Valor ${fullMoney(row.averageValue)}`;
    const labelName = formatRankLabel(row.name);

    return `
      <div class="rank-slot" style="--slot-h:${height}%">
        <div class="rank-plot">
          <div class="rank-value">${topValue}</div>
          <div class="rank-column">
            <canvas class="ranking-water-canvas" aria-hidden="true"></canvas>
            <div class="rank-inside">
              <strong>${primaryInside}</strong>
              <span>${secondaryInside}</span>
              <span>${tertiaryInside}</span>
            </div>
            <div class="rank-base-value">${row.quantity.toLocaleString("pt-BR")}</div>
          </div>
        </div>
        <div class="rank-label">
          <span class="rank-index">#${index + 1}</span>
          <span class="rank-name" title="${escapeHtml(row.name)}">${escapeHtml(labelName)}</span>
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

function replaceArray(target,items){
  target.splice(0,target.length,...items);
}

async function hydrateProdutosFromSupabase(){
  const api = window.CaioSupabase;
  if(!api?.get) return;

  const currentYear = api.currentYear();
  const rows = (await (api.getAll || api.get)(api.tables.secundario,"select=*"))
    .map(api.normalizeSecundario)
    .filter(row=>row.date && row.date.getFullYear() === currentYear);

  replaceArray(productSalesData,rows.map(row=>({
    date:row.data,
    product:row.product || "Produto importado",
    productCode:row.productCode || "SEM CODIGO",
    productQty:row.quantity || 1,
    productValue:row.unitValue || row.total || 0
  })));

  renderVariationCard(variationMode);
  renderRanking(rankingMode);
}

document.addEventListener("DOMContentLoaded",()=>{
  bindVariationTabs();
  bindRankingTabs();
  bindRankingMonthFilter();
  hydrateProdutosFromSupabase();
  window.CaioSupabase?.registerAutoRefresh?.(hydrateProdutosFromSupabase,{interval:12000});
  window.addEventListener("resize",()=>{
    rankingWaterController?.simulations?.forEach(sim=>sim.resize());
  });
});
