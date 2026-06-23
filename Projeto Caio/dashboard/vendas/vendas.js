const BRL = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});

const months = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
let ACTIVE_MONTH = "MAI";
let activeMonthIndex = months.indexOf(ACTIVE_MONTH);
let vendasDataSignature = "";
let vendasInitialRenderDone = false;

function isAvailableMonth(index){
  return index <= activeMonthIndex;
}

const flowData = {
  faturamento:{
    current:"R$ 640.000,00",
    target:"R$ 383.211,00",
    delta:"+67,0%",
    tone:"positive",
    labels:months,
    values:[148311,403160,201419,80209,448000,322600,390700,426300,371900,458200,512800,640000],
    goals:[170000,390000,220000,120000,420000,340000,360000,410000,390000,440000,500000,610000],
    unit:"money",
    tooltipTitle:"Faturamento"
  },
  ticket:{
    current:"R$ 789,00",
    target:"R$ 620,00",
    delta:"+27,3%",
    tone:"positive",
    labels:months,
    values:[422,512,468,587,614,598,641,676,632,711,744,789],
    goals:[450,500,490,570,630,620,625,660,650,690,730,760],
    unit:"money",
    tooltipTitle:"Ticket médio"
  }
};

const mixData = {
  clientes:{
    focus:"20,7%",
    focusLabel:"RODOFAIXA no total",
    items:[
      {name:"RODOFAIXA",value:92860,pct:20.7,meta:"36 notas"},
      {name:"RIZZATO",value:78540,pct:17.5,meta:"29 notas"},
      {name:"PETRIS",value:64720,pct:14.4,meta:"22 notas"},
      {name:"DA SILVA AM",value:51390,pct:11.5,meta:"18 notas"}
    ]
  },
  produtos:{
    focus:"214",
    focusLabel:"un. do líder",
    items:[
      {name:"Faixa refletiva premium",value:84620,pct:18.9,meta:"214 un."},
      {name:"Kit sinalização frota",value:69210,pct:15.4,meta:"126 un."},
      {name:"Adesivo técnico azul",value:54400,pct:12.1,meta:"381 un."},
      {name:"Placa personalizada",value:41850,pct:9.3,meta:"74 un."}
    ]
  },
  ofertas:{
    focus:"80%",
    focusLabel:"sem oferta",
    items:[
      {name:"Sem oferta",value:358720,pct:80.1,meta:"1.384 vendas"},
      {name:"Oferta ativa",value:89280,pct:19.9,meta:"345 vendas"},
      {name:"Conversão direta",value:55100,pct:12.3,meta:"142 vendas"},
      {name:"Recorrência",value:34180,pct:7.6,meta:"203 vendas"}
    ]
  }
};

const offerCompositionData = [
  {month:"JAN",firstHalf:0,secondHalf:0},
  {month:"FEV",firstHalf:0,secondHalf:0},
  {month:"MAR",firstHalf:0,secondHalf:0},
  {month:"ABR",firstHalf:0,secondHalf:0},
  {month:"MAI",firstHalf:0,secondHalf:0},
  {month:"JUN",firstHalf:0,secondHalf:0},
  {month:"JUL",firstHalf:0,secondHalf:0},
  {month:"AGO",firstHalf:0,secondHalf:0},
  {month:"SET",firstHalf:0,secondHalf:0},
  {month:"OUT",firstHalf:0,secondHalf:0},
  {month:"NOV",firstHalf:0,secondHalf:0},
  {month:"DEZ",firstHalf:0,secondHalf:0}
];

const offerReportMonths = [
  {month:"JAN",sim:0,nao:0,vSim:0,vNao:0},
  {month:"FEV",sim:0,nao:0,vSim:0,vNao:0},
  {month:"MAR",sim:0,nao:0,vSim:0,vNao:0},
  {month:"ABR",sim:0,nao:0,vSim:0,vNao:0},
  {month:"MAI",sim:0,nao:0,vSim:0,vNao:0},
  {month:"JUN",sim:0,nao:0,vSim:0,vNao:0},
  {month:"JUL",sim:0,nao:0,vSim:0,vNao:0},
  {month:"AGO",sim:0,nao:0,vSim:0,vNao:0},
  {month:"SET",sim:0,nao:0,vSim:0,vNao:0},
  {month:"OUT",sim:0,nao:0,vSim:0,vNao:0},
  {month:"NOV",sim:0,nao:0,vSim:0,vNao:0},
  {month:"DEZ",sim:0,nao:0,vSim:0,vNao:0}
];

const timeSlots = [
  {label:"08:00 - 10:30",value:289,amount:41340.50,h:48},
  {label:"10:30 - 12:00",value:602,amount:79090.00,h:100,best:true},
  {label:"13:15 - 15:00",value:392,amount:52860.40,h:65},
  {label:"15:00 - 18:45",value:175,amount:28640.80,h:29}
];

const dailySalesData = [
  {label:"segunda-feira",value:231},
  {label:"terça-feira",value:113},
  {label:"quarta-feira",value:42},
  {label:"quinta-feira",value:89},
  {label:"sexta-feira",value:2},
  {label:"sábado",value:0},
  {label:"domingo",value:0}
];

let timeWaterController = null;
let offerCompositionWaterController = null;
let timeValuePositionFrame = null;
let hasFlowData = false;

const reportRows = [
  {date:"22/05",name:"Dia atual",count:196,value:120430.50,ticket:614.44,pct:100},
  {date:"19/05",name:"Pico de recompra",count:84,value:59300.00,ticket:705.95,pct:49},
  {date:"11/05",name:"Carteira recorrente",count:77,value:56200.00,ticket:729.87,pct:47},
  {date:"14/05",name:"Pedidos concentrados",count:69,value:48800.00,ticket:707.24,pct:41},
  {date:"18/05",name:"Venda regular",count:63,value:44600.00,ticket:707.94,pct:37},
  {date:"08/05",name:"Apoio de oferta",count:61,value:42440.00,ticket:695.74,pct:35},
  {date:"04/05",name:"Entrada do mês",count:58,value:40873.01,ticket:704.71,pct:34},
  {date:"13/05",name:"Reposição",count:52,value:35120.00,ticket:675.38,pct:29},
  {date:"15/05",name:"Fluxo leve",count:49,value:32100.00,ticket:655.10,pct:27},
  {date:"07/05",name:"Pedido avulso",count:44,value:30966.56,ticket:703.79,pct:26}
];

function defs(){
  return `
    <defs>
      <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(3,59,179,.18)"/>
        <stop offset=".72" stop-color="rgba(59,130,246,.06)"/>
        <stop offset="1" stop-color="rgba(59,130,246,0)"/>
      </linearGradient>
    </defs>`;
}

function niceAxisMax(value){
  const safeValue = Math.max(1,value || 1);
  const magnitude = Math.pow(10,Math.floor(Math.log10(safeValue)));
  const normalized = safeValue/magnitude;
  const steps = [1,1.2,1.5,2,2.5,3,4,5,6,8,10];
  const step = steps.find(item=>normalized <= item) || 10;
  return step*magnitude;
}

function axisMoney(value){
  if(value === 0) return "R$ 0";
  if(value >= 1000000) return `R$ ${(value/1000000).toFixed(value % 1000000 ? 1 : 0).replace(".",",")} mi`;
  if(value >= 1000) return `R$ ${Math.round(value/1000)}k`;
  return BRL.format(value).replace(",00","");
}

function liquidCurve(points){
  if(points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for(let i=1;i<points.length-1;i++){
    const midX = (points[i].x + points[i+1].x) * .5;
    const midY = (points[i].y + points[i+1].y) * .5;
    d += ` Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = points[points.length-1];
  d += ` T ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

function offerLiquidPaths(left,top,width,height,splitY,offsets=[]){
  const count = 9;
  const bottom = top + height;
  const points = Array.from({length:count},(_,index)=>{
    const t = index/(count-1);
    const edgeLock = Math.sin(Math.PI*t);
    const rawOffset = offsets[index] || 0;
    return {
      x:left + width*t,
      y:Math.max(top+7,Math.min(bottom-7,splitY + rawOffset*edgeLock))
    };
  });
  const forward = liquidCurve(points);
  const reverse = liquidCurve([...points].reverse()).replace(/^M [^QTL]+ /,"");
  const first = points[0];
  const last = points[points.length-1];

  return {
    primary:`M ${left} ${top} L ${left+width} ${top} L ${last.x.toFixed(2)} ${last.y.toFixed(2)} ${reverse} L ${first.x.toFixed(2)} ${first.y.toFixed(2)} Z`,
    secondary:`${forward} L ${left+width} ${bottom} L ${left} ${bottom} Z`
  };
}

function renderFlow(key){
  const target = document.getElementById("flow-chart");
  if(!target) return;
  if(!hasFlowData){
    target.innerHTML = "";
    return;
  }

  const d = flowData[key];

  const x=56,y=18,w=652,h=202;
  const availableValues = d.values.filter((_,index)=>isAvailableMonth(index));
  const availableGoals = d.goals.filter((_,index)=>isAvailableMonth(index));
  const max = niceAxisMax(Math.max(...availableValues,...availableGoals)*1.12);
  const step = w/(d.values.length-1);
  const axisPoints = d.values.map((value,i)=>({
    x:x+step*i,
    y:y+h-(value/max)*h,
    value,
    goal:d.goals[i],
    hit:value >= d.goals[i],
    label:d.labels[i]
  }));
  const points = axisPoints.filter((_,index)=>isAvailableMonth(index));
  const line = points.map((p,i)=>{
    if(i===0) return `M ${p.x} ${p.y}`;
    const prev = points[i-1];
    const cx = (prev.x+p.x)/2;
    return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }).join(" ");
  const tracerLine = `M ${x-84} ${points[0].y} L ${points[0].x} ${points[0].y} ${line.replace(/^M [^C]+ /,"")}`;
  const area = `${line} L ${points[points.length-1].x} ${y+h} L ${x} ${y+h} Z`;
  const ticks = [0,.25,.5,.75,1];
  const grid = ticks.map(t=>{
    const gy = y+h-h*t;
    return `<line class="chart-grid" x1="${x}" y1="${gy}" x2="${x+w}" y2="${gy}"/>`;
  }).join("");
  const yValues = ticks.map(t=>{
    const gy = y+h-h*t;
    return `<text class="chart-y-value" x="${x-10}" y="${gy-6}" text-anchor="end">${axisMoney(max*t)}</text>`;
  }).join("");
  const labels = axisPoints.map((p,i)=>{
    return `<text class="chart-axis" x="${p.x}" y="${y+h+30}" text-anchor="middle">${p.label}</text>`;
  }).join("");
  const circles = points.map((p,i)=>{
    return `<circle class="flow-point ${p.hit ? "met" : "missed"}" data-index="${i}" cx="${p.x}" cy="${p.y}" r="3.4"/>`;
  }).join("");

  target.innerHTML = `
    <svg viewBox="0 0 720 260" preserveAspectRatio="xMidYMid meet">
      ${defs()}
      <defs>
        <clipPath id="flowPlotClip">
          <rect x="${x}" y="${y-12}" width="${w}" height="${h+28}"></rect>
        </clipPath>
      </defs>
      ${grid}
      <line class="chart-y-rule" x1="${x}" y1="${y}" x2="${x}" y2="${y+h}"/>
      ${yValues}
      <path class="area-fill" d="${area}"/>
      <path class="line-flow" pathLength="1000" clip-path="url(#flowPlotClip)" d="${tracerLine}"/>
      <path class="line-tracer" pathLength="1000" clip-path="url(#flowPlotClip)" d="${tracerLine}"/>
      ${circles}
      ${labels}
      <g class="flow-tooltip" id="flow-tooltip">
        <rect width="148" height="62"></rect>
        <text class="tip-title" x="12" y="19" id="flow-tip-title"></text>
        <text class="tip-value" x="12" y="39" id="flow-tip-value"></text>
        <text class="tip-note" x="12" y="54" id="flow-tip-note"></text>
      </g>
    </svg>`;
  bindFlowHover(points, d);
}

function bindFlowHover(points, data){
  const svg = document.querySelector("#flow-chart svg");
  const tooltip = document.getElementById("flow-tooltip");
  const tipTitle = document.getElementById("flow-tip-title");
  const tipValue = document.getElementById("flow-tip-value");
  const tipNote = document.getElementById("flow-tip-note");
  const pointEls = [...svg.querySelectorAll(".flow-point")];
  const threshold = 38;

  function clearHover(){
    pointEls.forEach(point=>{
      point.style.removeProperty("opacity");
    });
    tooltip.style.opacity = 0;
  }

  svg.addEventListener("mousemove",(event)=>{
    const matrix = svg.getScreenCTM();
    if(!matrix) return;
    const cursor = svg.createSVGPoint();
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    const pos = cursor.matrixTransform(matrix.inverse());
    let nearest = null;
    let nearestDist = Infinity;

    points.forEach((point,index)=>{
      const dist = Math.hypot(pos.x-point.x,pos.y-point.y);
      if(dist < nearestDist){
        nearestDist = dist;
        nearest = {point,index};
      }
    });

    clearHover();
    if(!nearest || nearestDist > threshold) return;

    const strength = nearestDist <= 3 ? 1 : Math.max(0,Math.min(1,1-nearestDist/threshold));
    const activePoint = pointEls[nearest.index];
    activePoint.style.setProperty("opacity",strength.toFixed(2),"important");

    const value = data.unit === "money" ? BRL.format(nearest.point.value) : nearest.point.value;
    const goal = data.unit === "money" ? BRL.format(nearest.point.goal) : nearest.point.goal;
    tipTitle.textContent = `${data.tooltipTitle} · ${nearest.point.label}`;
    tipValue.textContent = value;
    tipNote.textContent = `Meta ${goal}`;

    const tipWidth = 148;
    const tipHeight = 62;
    let tipX = nearest.point.x + 14;
    let tipY = nearest.point.y - 74;
    if(tipX + tipWidth > 704) tipX = nearest.point.x - tipWidth - 14;
    if(tipY < 8) tipY = nearest.point.y + 18;
    if(tipY + tipHeight > 250) tipY = 250 - tipHeight;
    tooltip.setAttribute("transform",`translate(${tipX} ${tipY})`);
    tooltip.style.opacity = strength.toFixed(2);
  });

  svg.addEventListener("mouseleave",clearHover);
  svg.addEventListener("pointerleave",clearHover);
  document.addEventListener("mousemove",(event)=>{
    if(!svg.contains(event.target)) clearHover();
  });
}

function renderOfferComposition(){
  const target = document.getElementById("offer-composition");
  if(!target) return;

  const data = offerCompositionData.map(item=>({
    ...item,
    total:item.firstHalf + item.secondHalf,
    available:item.firstHalf + item.secondHalf > 0
  }));
  const x=28,y=18,h=112,w=464,barW=24;
  const step = w/(data.length-1);
  const minSegment = 18;

  const clipDefs = data.map((item,index)=>{
    const cx = x+step*index;
    return `<clipPath id="offerClip${index}"><rect x="${cx-barW/2}" y="${y}" width="${barW}" height="${h}" rx="5"/></clipPath>`;
  }).join("");

  const groups = data.map((item,index)=>{
    const cx = x+step*index;
    const delay = `${index*45}ms`;
    const hasData = item.available && item.total > 0;
    const safeTotal = hasData ? item.total : 1;
    const firstPct = hasData ? Math.round((item.firstHalf/safeTotal)*100) : 0;
    const secondPct = hasData ? 100-firstPct : 0;
    const firstLabel = item.available ? `${firstPct}%` : "*";
    const secondLabel = item.available ? `${secondPct}%` : "*";
    const firstH = hasData ? Math.max(minSegment,Math.min(h-minSegment,(item.firstHalf/safeTotal)*h)) : h*.5;
    const secondH = h-firstH;
    const splitY = y+firstH;
    const paths = offerLiquidPaths(cx-barW/2,y,barW,h,splitY);

    return `
      <g class="offer-month-group ${item.available ? "" : "is-future"}" data-index="${index}" data-left="${cx-barW/2}" data-top="${y}" data-width="${barW}" data-height="${h}" data-split="${splitY}" data-seed="${index*311+17}" data-future="${item.available ? "false" : "true"}">
        <g clip-path="url(#offerClip${index})">
          <path class="offer-bar-secondary" d="${paths.secondary}" style="animation-delay:${delay}"/>
          <path class="offer-bar-primary" d="${paths.primary}" style="animation-delay:${delay}"/>
        </g>
        <text class="offer-stack-label primary" x="${cx}" y="${y+firstH/2+3}" text-anchor="middle">${firstLabel}</text>
        <text class="offer-stack-label secondary" x="${cx}" y="${splitY+secondH/2+3}" text-anchor="middle">${secondLabel}</text>
        <text class="offer-axis" x="${cx}" y="154" text-anchor="middle">${item.month}</text>
      </g>`;
  }).join("");

  target.innerHTML = `
    <svg class="offer-chart" viewBox="0 0 520 166" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="offerPrimary" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(59,130,246,.98)"/>
          <stop offset=".55" stop-color="rgba(29,78,216,.88)"/>
          <stop offset="1" stop-color="rgba(3,59,179,.72)"/>
        </linearGradient>
        <linearGradient id="offerSecondary" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(147,197,253,.92)"/>
          <stop offset=".58" stop-color="rgba(96,165,250,.74)"/>
          <stop offset="1" stop-color="rgba(59,130,246,.48)"/>
        </linearGradient>
        ${clipDefs}
      </defs>
      ${groups}
      <g class="offer-tooltip" id="offer-tooltip">
        <rect width="174" height="58"></rect>
        <text class="tip-value" x="12" y="20" id="offer-tip-value"></text>
        <text class="tip-value" x="12" y="36" id="offer-tip-note-a"></text>
        <text class="tip-note tip-total" x="12" y="50" id="offer-tip-note-b"></text>
      </g>
    </svg>`;
  initOfferCompositionLiquid();
  bindOfferHover(data);
}

function initOfferCompositionLiquid(){
  if(offerCompositionWaterController){
    cancelAnimationFrame(offerCompositionWaterController.frame);
  }

  const groups = [...document.querySelectorAll("#offer-composition .offer-month-group")].map(group=>({
    group,
    primary:group.querySelector(".offer-bar-primary"),
    secondary:group.querySelector(".offer-bar-secondary"),
    left:Number(group.dataset.left),
    top:Number(group.dataset.top),
    width:Number(group.dataset.width),
    height:Number(group.dataset.height),
    split:Number(group.dataset.split),
    seed:Number(group.dataset.seed),
    future:group.dataset.future === "true"
  })).filter(config=>!config.future);

  function animate(now){
    const t = now*.001;
    groups.forEach(config=>{
      const count = 9;
      const offsets = [];
      for(let i=0;i<count;i++){
        const x = i/(count-1);
        const base =
          smoothNoise2D(x*1.8+config.seed*.03,t*.48+config.seed*.011,config.seed)*2.8 +
          smoothNoise2D(x*4.2+config.seed*.05,t*.82+config.seed*.017,config.seed+19)*1.25 +
          Math.sin(t*(1.05+seededRandom(config.seed)*.35)+x*5.2+config.seed)*.68;
        offsets.push(base);
      }

      const avg = offsets.reduce((sum,value)=>sum+value,0)/offsets.length;
      const centered = offsets.map(value=>(value-avg)*.68);
      const paths = offerLiquidPaths(config.left,config.top,config.width,config.height,config.split,centered);
      config.primary.setAttribute("d",paths.primary);
      config.secondary.setAttribute("d",paths.secondary);
    });
    offerCompositionWaterController.frame = requestAnimationFrame(animate);
  }

  offerCompositionWaterController = {
    frame:requestAnimationFrame(animate)
  };
}

function bindOfferHover(data){
  const svg = document.querySelector("#offer-composition svg");
  if(!svg) return;
  const groups = [...svg.querySelectorAll(".offer-month-group")];
  const tooltip = document.getElementById("offer-tooltip");
  const value = document.getElementById("offer-tip-value");
  const noteA = document.getElementById("offer-tip-note-a");
  const noteB = document.getElementById("offer-tip-note-b");

  function show(index){
    const item = data[index];
    if(!item.available){
      hide();
      return;
    }
    groups.forEach(group=>group.classList.toggle("is-hovered",Number(group.dataset.index) === index));
    const firstPct = Math.round((item.firstHalf/item.total)*100);
    const secondPct = 100-firstPct;
    value.textContent = `1ª Q ${BRL.format(item.firstHalf)} (${firstPct}%)`;
    noteA.textContent = `2ª Q ${BRL.format(item.secondHalf)} (${secondPct}%)`;
    noteB.textContent = `Total ${BRL.format(item.total)}`;

    const groupBox = groups[index].getBBox();
    const tipWidth = 174;
    const tipHeight = 58;
    let tipX = groupBox.x + groupBox.width + 12;
    let tipY = Math.max(10,groupBox.y + groupBox.height/2 - tipHeight/2);
    if(tipX + tipWidth > 510) tipX = groupBox.x - tipWidth - 12;
    if(tipY + tipHeight > 160) tipY = 160 - tipHeight;
    tooltip.setAttribute("transform",`translate(${tipX} ${tipY})`);
    tooltip.style.opacity = 1;
  }

  function hide(){
    groups.forEach(group=>group.classList.remove("is-hovered"));
    tooltip.style.opacity = 0;
  }

  groups.forEach(group=>{
    group.addEventListener("mouseenter",()=>show(Number(group.dataset.index)));
    group.addEventListener("mouseleave",hide);
  });
  svg.addEventListener("mouseleave",hide);
}

function renderMix(key){
  const d = mixData[key];
  document.getElementById("mix-focus").innerHTML = `
    <div class="mix-focus-value">${d.focus}</div>
    <div class="mix-focus-label">${d.focusLabel}</div>
  `;
  document.getElementById("mix-list").innerHTML = d.items.map(item=>`
    <div class="mix-item">
      <div class="mix-top"><div class="mix-name">${item.name}</div><div class="mix-val">${BRL.format(item.value)}</div></div>
      <div class="mix-bar"><div class="mix-fill" style="width:${item.pct}%"></div></div>
      <div class="mix-meta"><span>${item.pct.toFixed(1).replace(".",",")}% do total</span><span>${item.meta}</span></div>
    </div>
  `).join("");
}

function renderTime(){
  const maxAmount = Math.max(...timeSlots.map(slot=>slot.amount),0);
  document.getElementById("time-board").innerHTML = timeSlots.map(slot=>{
    const height = maxAmount > 0 && slot.amount > 0 ? Math.max(34,Math.round((slot.amount/maxAmount)*100)) : 0;
    return `
    <div class="time-slot ${slot.best ? "best" : ""}">
      <div class="time-value">${BRL.format(slot.amount)}</div>
      <div class="time-plot">
        <div class="time-column" style="--slot-h:${height}%">
          <canvas class="time-water-canvas" aria-hidden="true"></canvas>
          <div class="time-inside">
            <strong>${BRL.format(slot.amount)}</strong>
            <span>${slot.value} vendas</span>
          </div>
      </div>
      </div>
      <div class="time-label">${slot.label}</div>
    </div>
  `}).join("");
  initTimeWater();
  scheduleTimeValuePosition();
}

function renderDailySales(){
  const board = document.getElementById("daily-board");
  if(!board) return;

  const visibleDays = dailySalesData.filter(day=>day.value > 0);
  const hasData = visibleDays.length > 0;
  const rows = hasData
    ? visibleDays
    : dailySalesData.filter(day=>!day.label.includes("sabado") && !day.label.includes("domingo")).map(day=>({
      ...day,
      placeholder:true
    }));
  const maxValue = hasData ? Math.max(...visibleDays.map(day=>day.value)) : 1;

  board.innerHTML = rows.map(day=>{
    const ratio = hasData ? day.value/maxValue : 1;
    const height = hasData ? Math.round(24 + Math.pow(ratio,.62)*76) : 62;
    const value = hasData ? day.value : 0;

    return `
    <div class="time-slot daily-slot ${day.placeholder ? "is-placeholder" : ""}">
      <div class="time-value">${value}</div>
      <div class="time-plot">
        <div class="time-column" style="--slot-h:${height}%">
          <canvas class="time-water-canvas" aria-hidden="true"></canvas>
          <div class="time-inside">
            <strong>${value}</strong>
            <span>vendas</span>
          </div>
        </div>
      </div>
      <div class="time-label">${day.label}</div>
    </div>
  `}).join("");

  initTimeWater();
}

function scheduleTimeValuePosition(){
  if(timeValuePositionFrame) cancelAnimationFrame(timeValuePositionFrame);
  timeValuePositionFrame = requestAnimationFrame(()=>{
    positionTimeValues();
    timeValuePositionFrame = null;
  });
}

function positionTimeValues(){
  const card = document.querySelector(".time-card");
  const board = document.querySelector(".time-board");
  if(!card) return;
  const cardTop = card.getBoundingClientRect().top;
  const firstPlot = document.querySelector(".time-plot");

  if(board && firstPlot){
    const plotBottom = firstPlot.getBoundingClientRect().bottom;
    const plotHeight = Math.max(56,plotBottom - (cardTop + 68));
    board.style.setProperty("--plot-height",`${Math.round(plotHeight)}px`);
    board.classList.add("positioned");
  }

}

function renderReport(sortKey="valor"){
  const rows = [...reportRows].sort((a,b)=>{
    if(sortKey === "pedidos") return b.count-a.count;
    if(sortKey === "ticket") return b.ticket-a.ticket;
    return b.value-a.value;
  });
  document.getElementById("sales-report").innerHTML = rows.map(row=>`
    <div class="report-row">
      <div class="report-date">${row.date}</div>
      <div class="report-main"><strong>${row.name}</strong><span>${row.count} vendas · ticket ${BRL.format(row.ticket)}</span></div>
      <div class="report-money">${BRL.format(row.value)}</div>
      <div class="report-meter">
        <div class="report-bar"><div class="report-fill" style="width:${row.pct}%"></div></div>
        <div class="report-pct">${row.pct}%</div>
      </div>
    </div>
  `).join("");
}

function renderOfferReport(){
  const card = document.querySelector(".report-card");
  const title = card?.querySelector(".card-toolbar h2");
  const grid = document.getElementById("offer-report-grid");
  if(!grid) return;

  if(title) title.textContent = "Oferta Ativa";

  grid.innerHTML = offerReportMonths.map((month,index)=>{
    const available = month.vSim + month.vNao > 0;
    const isPeak = available && month.month === ACTIVE_MONTH;
    const sim = available ? `${month.sim}%` : "*";
    const nao = available ? `${month.nao}%` : "*";
    const simAbbr = available ? shortMoney(month.vSim) : "*";
    const naoAbbr = available ? shortMoney(month.vNao) : "*";
    const simFull = available ? BRL.format(month.vSim) : "*";
    const naoFull = available ? BRL.format(month.vNao) : "*";

    return `
    <div class="offer-report-month ${isPeak ? "peak" : ""} ${available ? "" : "is-future"}" data-index="${index}" data-future="${available ? "false" : "true"}" tabindex="${available ? "0" : "-1"}">
      <div class="offer-report-inline-legend" aria-hidden="true">
        <span><i class="offer-report-dot sim"></i>Sim</span>
        <span><i class="offer-report-dot nao"></i>Nao</span>
      </div>
      <div class="offer-report-month-name" data-month="${month.month}">${month.month}</div>
      <div class="offer-report-sim">${sim}</div>
      <div class="offer-report-nao">${nao}</div>
      <div class="offer-report-divider"></div>
      <div class="offer-report-value sim abbr">${simAbbr}</div>
      <div class="offer-report-value sim full">${simFull}</div>
      <div class="offer-report-value nao abbr">${naoAbbr}</div>
      <div class="offer-report-value nao full">${naoFull}</div>
    </div>
  `}).join("");

  const cells = [...grid.querySelectorAll(".offer-report-month")];

  function activate(cell){
    if(cell.dataset.future === "true"){
      clear();
      return;
    }
    cells.forEach(item=>item.classList.toggle("hovered",item === cell));
    grid.classList.add("has-hover");
  }

  function clear(){
    cells.forEach(item=>item.classList.remove("hovered"));
    grid.classList.remove("has-hover");
  }

  cells.forEach(cell=>{
    cell.addEventListener("mouseenter",()=>activate(cell));
    cell.addEventListener("focus",()=>activate(cell));
    cell.addEventListener("mouseleave",clear);
    cell.addEventListener("blur",clear);
  });
  grid.addEventListener("mouseleave",clear);
}

function shortMoney(value){
  if(value >= 1000000) return `R$ ${(value/1000000).toFixed(1).replace(".",",")}M`;
  if(value >= 1000) return `R$ ${Math.round(value/1000)}k`;
  return BRL.format(value);
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

function createTimeWaterSim(column,canvas,index){
  const ctx = canvas.getContext("2d");
  const slot = column.closest(".time-slot");
  const valueLabel = slot?.querySelector(".time-value");
  const pointCount = 96;
  const pos = new Float32Array(pointCount);
  const vel = new Float32Array(pointCount);
  const acc = new Float32Array(pointCount);
  const leftDelta = new Float32Array(pointCount);
  const rightDelta = new Float32Array(pointCount);
  const rand = createSeededRng((index + 1) * 987654321);
  const seed = index * 1337 + 42;
  const logicalWidth = 180;
  const logicalHeight = 124;
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
  let labelSurfaceY = 17;
  let nextDisturbance = performance.now() + rand() * 760 + 260;

  function resize(){
    const nextDpr = Math.min(window.devicePixelRatio || 1,2);
    const pixelWidth = Math.round(logicalWidth * nextDpr);
    const pixelHeight = Math.round(logicalHeight * nextDpr);

    if(canvas.width === pixelWidth && canvas.height === pixelHeight) return;

    width = logicalWidth;
    height = logicalHeight;
    dpr = nextDpr;
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    draw();
  }

  function disturb(now){
    if(now < nextDisturbance) return;

    const ripples = rand() > .76 ? 2 : 1;
    for(let ripple = 0; ripple < ripples; ripple++){
      const center = Math.floor(rand() * pointCount);
      const force = (rand() - .5) * 6.0;
      const radius = Math.floor(rand() * 8) + 5;

      for(let offset = -radius; offset <= radius; offset++){
        const j = center + offset;
        if(j < 0 || j >= pointCount) continue;
        const envelope = Math.exp(-(offset * offset) / (radius * radius * .9));
        vel[j] += force * envelope;
      }
    }

    nextDisturbance = now + rand() * 760 + 260;
  }

  function step(now){
    const t = now * .001;
    const spring = .023;
    const damping = .94;
    const spread = .132;
    const iterations = 9;
    const heightScale = Math.max(.46,Math.min(.86,height / 112));

    for(let j = 0; j < pointCount; j++){
      let target = 0;
      layers.forEach(layer=>{
        target += layer.amp * heightScale * smoothNoise2D(j * layer.sx + layer.to,t * layer.st + layer.to * .3,seed);
      });
      acc[j] = -spring * (pos[j] - target);
    }

    for(let j = 0; j < pointCount; j++){
      vel[j] = vel[j] * damping + acc[j];
      pos[j] += vel[j];
    }

    for(let pass = 0; pass < iterations; pass++){
      leftDelta.fill(0);
      rightDelta.fill(0);
      for(let j = 0; j < pointCount; j++){
        if(j > 0){
          leftDelta[j] = spread * (pos[j] - pos[j - 1]);
          vel[j - 1] += leftDelta[j];
        }
        if(j < pointCount - 1){
          rightDelta[j] = spread * (pos[j] - pos[j + 1]);
          vel[j + 1] += rightDelta[j];
        }
      }
      for(let j = 0; j < pointCount; j++){
        if(j > 0) pos[j - 1] += leftDelta[j];
        if(j < pointCount - 1) pos[j + 1] += rightDelta[j];
      }
    }

    disturb(now);
    draw();
  }

  function draw(){
    const restY = Math.max(9,Math.min(17,height * .18));
    ctx.clearRect(0,0,width,height);

    const points = [];
    for(let j = 0; j < pointCount; j++){
      points.push({
        x:(j / (pointCount - 1)) * width,
        y:Math.max(3,Math.min(height - 8,restY + pos[j]))
      });
    }

    const gradient = ctx.createLinearGradient(0,0,0,height);
    gradient.addColorStop(0,"rgba(3,59,179,.9)");
    gradient.addColorStop(.52,"rgba(0,51,109,.82)");
    gradient.addColorStop(1,"rgba(0,38,88,.78)");

    ctx.beginPath();
    ctx.moveTo(points[0].x,points[0].y);
    for(let j = 1; j < pointCount - 1; j++){
      const midX = (points[j].x + points[j + 1].x) * .5;
      const midY = (points[j].y + points[j + 1].y) * .5;
      ctx.quadraticCurveTo(points[j].x,points[j].y,midX,midY);
    }
    ctx.lineTo(points[pointCount - 1].x,points[pointCount - 1].y);
    ctx.lineTo(width,height);
    ctx.lineTo(0,height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.moveTo(points[0].x,points[0].y);
    for(let j = 1; j < pointCount - 1; j++){
      const midX = (points[j].x + points[j + 1].x) * .5;
      const midY = (points[j].y + points[j + 1].y) * .5;
      ctx.quadraticCurveTo(points[j].x,points[j].y,midX,midY);
    }
    ctx.lineTo(points[pointCount - 1].x,points[pointCount - 1].y);
    ctx.strokeStyle = "rgba(147,197,253,.32)";
    ctx.lineWidth = 1.25;
    ctx.stroke();

    for(let j = 3; j < pointCount - 3; j += 6){
      const slope = pos[j + 2] - pos[j - 2];
      if(slope > -.55) continue;
      const alpha = Math.min(.28,Math.abs(slope) * .06);
      const radius = Math.min(6,2 + Math.abs(slope) * .18);
      const glow = ctx.createRadialGradient(points[j].x,points[j].y,0,points[j].x,points[j].y,radius * 2.8);
      glow.addColorStop(0,`rgba(255,255,255,${alpha.toFixed(2)})`);
      glow.addColorStop(1,"rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(points[j].x,points[j].y,radius * 2.8,0,Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    syncValueLabel(points[Math.floor(pointCount / 2)].y);
  }

  resize();
  return {resize,step};

  function syncValueLabel(surfaceY){
    if(!slot || !valueLabel) return;
    labelSurfaceY += (surfaceY - labelSurfaceY) * .18;

    const slotRect = slot.getBoundingClientRect();
    const columnRect = column.getBoundingClientRect();
    const valueHeight = valueLabel.offsetHeight || 13;
    const surfaceCss = (labelSurfaceY / height) * columnRect.height;
    const top = (columnRect.top - slotRect.top) + surfaceCss - 10 - valueHeight;
    slot.style.setProperty("--value-top",`${Math.round(top)}px`);
  }
}

function initTimeWater(){
  if(timeWaterController){
    cancelAnimationFrame(timeWaterController.frame);
  }

  const columns = [...document.querySelectorAll(".time-column")];
  const simulations = columns.map((column,index)=>{
    const canvas = column.querySelector(".time-water-canvas");
    return createTimeWaterSim(column,canvas,index);
  });

  function animate(now){
    simulations.forEach(sim=>sim.step(now));
    timeWaterController.frame = requestAnimationFrame(animate);
  }

  timeWaterController = {
    frame:requestAnimationFrame(animate)
  };
}

function bindTabs(){
  document.querySelectorAll("[data-flow]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-flow]").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      renderFlow(btn.dataset.flow);
    });
  });
  document.querySelectorAll("[data-mix]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-mix]").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      renderMix(btn.dataset.mix);
    });
  });
  document.querySelectorAll("[data-report]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-report]").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      renderReport(btn.dataset.report);
    });
  });
}

function setArray(target,items){
  target.splice(0,target.length,...items);
}

function getSaleHour(row){
  const [hour,minute] = String(row.horario || "00:00").split(":").map(Number);
  return (Number.isFinite(hour) ? hour : 0) + (Number.isFinite(minute) ? minute : 0) / 60;
}

function getSlotIndex(row){
  const hour = getSaleHour(row);
  if(hour >= 8 && hour < 10.5) return 0;
  if(hour >= 10.5 && hour < 12) return 1;
  if(hour >= 13.25 && hour < 15) return 2;
  if(hour >= 15 && hour <= 18.75) return 3;
  return -1;
}

function updateFlowSummary(key,latestIndex){
  const data = flowData[key];
  const current = data.values[latestIndex] || 0;
  const target = data.goals[latestIndex] || 0;
  const delta = target ? ((current-target)/target)*100 : 0;
  data.current = BRL.format(current);
  data.target = BRL.format(target);
  data.delta = `${delta >= 0 ? "+" : ""}${delta.toFixed(1).replace(".",",")}%`;
  data.tone = delta >= 0 ? "positive" : "negative";
}

async function hydrateVendasFromSupabase(){
  const api = window.CaioSupabase;
  if(!api?.get) return;

  const currentYear = api.currentYear();
  const [principalRows,metaRows] = await Promise.all([
    (api.getAll || api.get)(api.tables.principal,"select=*"),
    (api.getAll || api.get)(api.tables.metas,"select=*")
  ]);

  const rows = principalRows
    .map(api.normalizePrincipal)
    .filter(row=>row.date && row.date.getFullYear() === currentYear);

  const revenue = Array(12).fill(0);
  const counts = Array(12).fill(0);
  const nfeSets = Array.from({length:12},()=>new Set());
  const firstHalf = Array(12).fill(0);
  const secondHalf = Array(12).fill(0);
  const activeRevenue = Array(12).fill(0);
  const inactiveRevenue = Array(12).fill(0);
  const weekdayCounts = Array(7).fill(0);
  const slotRows = [
    {label:"08:00 - 10:30",value:0,amount:0,h:0},
    {label:"10:30 - 12:00",value:0,amount:0,h:0},
    {label:"13:15 - 15:00",value:0,amount:0,h:0},
    {label:"15:00 - 18:45",value:0,amount:0,h:0}
  ];
  const byDay = new Map();

  rows.forEach(row=>{
    const month = row.date.getMonth();
    const day = row.date.getDate();
    revenue[month] += row.revenue;
    counts[month] += 1;
    if(row.nfe) nfeSets[month].add(row.nfe);
    if(day <= 15) firstHalf[month] += row.revenue;
    else secondHalf[month] += row.revenue;
    if(row.activeOffer) activeRevenue[month] += row.revenue;
    else inactiveRevenue[month] += row.revenue;

    const weekday = row.date.getDay();
    weekdayCounts[weekday] += 1;

    const slot = getSlotIndex(row);
    if(slot >= 0){
      slotRows[slot].value += 1;
      slotRows[slot].amount += row.revenue;
    }

    const key = api.dateISO(row.date);
    const current = byDay.get(key) || {date:row.date,value:0,count:0};
    current.value += row.revenue;
    current.count += 1;
    byDay.set(key,current);
  });

  const goals = Array(12).fill(0);
  metaRows.map(api.normalizeMeta).forEach(meta=>{
    if(meta.year === currentYear && meta.monthIndex >= 0) goals[meta.monthIndex] = meta.value;
  });

  const daySummary = [...byDay.values()]
    .map(item=>({
      date:api.dateISO(item.date),
      value:+item.value.toFixed(2),
      count:item.count
    }))
    .sort((a,b)=>a.date.localeCompare(b.date));
  const nextSignature = JSON.stringify({
    revenue:revenue.map(value=>+value.toFixed(2)),
    counts,
    nfe:nfeSets.map(set=>set.size),
    goals:goals.map(value=>+Number(value || 0).toFixed(2)),
    firstHalf:firstHalf.map(value=>+value.toFixed(2)),
    secondHalf:secondHalf.map(value=>+value.toFixed(2)),
    activeRevenue:activeRevenue.map(value=>+value.toFixed(2)),
    inactiveRevenue:inactiveRevenue.map(value=>+value.toFixed(2)),
    weekdayCounts,
    slots:slotRows.map(slot=>({value:slot.value,amount:+slot.amount.toFixed(2)})),
    days:daySummary
  });
  if(vendasInitialRenderDone && nextSignature === vendasDataSignature) return;
  vendasDataSignature = nextSignature;

  const latestIndex = revenue.reduce((last,value,index)=>value > 0 ? index : last,-1);
  hasFlowData = latestIndex >= 0;
  if(latestIndex >= 0){
    activeMonthIndex = latestIndex;
    ACTIVE_MONTH = months[latestIndex];
  }else{
    activeMonthIndex = new Date().getMonth();
    ACTIVE_MONTH = months[activeMonthIndex];
  }

  flowData.faturamento.values = revenue.map(value=>+value.toFixed(2));
  flowData.faturamento.goals = goals.map((goal,index)=>goal || (revenue[index] ? revenue[index] * 1.08 : 0));
  flowData.ticket.values = revenue.map((value,index)=>{
    const divisor = nfeSets[index].size || counts[index] || 1;
    return value ? +(value/divisor).toFixed(2) : 0;
  });
  flowData.ticket.goals = flowData.ticket.values.map(value=>value ? +(value*1.08).toFixed(2) : 0);
  updateFlowSummary("faturamento",Math.max(latestIndex,0));
  updateFlowSummary("ticket",Math.max(latestIndex,0));

  setArray(offerCompositionData,months.map((month,index)=>{
    const total = firstHalf[index] + secondHalf[index];
    return {
      month,
      firstHalf:total ? firstHalf[index] : 0,
      secondHalf:total ? secondHalf[index] : 0
    };
  }));

  setArray(offerReportMonths,months.map((month,index)=>{
    const simValue = activeRevenue[index];
    const naoValue = inactiveRevenue[index];
    const total = simValue + naoValue;
    const sim = total ? Math.round((simValue/total)*100) : 0;
    return {
      month,
      sim,
      nao:total ? 100-sim : 0,
      vSim:simValue,
      vNao:naoValue,
      peak:index === activeMonthIndex
    };
  }));

  const maxSlot = Math.max(...slotRows.map(slot=>slot.amount),1);
  slotRows.forEach(slot=>{
    slot.h = slot.amount > 0 ? Math.max(20,Math.round((slot.amount/maxSlot)*100)) : 0;
    slot.best = slot.amount > 0 && slot.amount === maxSlot;
  });
  setArray(timeSlots,slotRows);

  const weekdayLabels = ["domingo","segunda-feira","terca-feira","quarta-feira","quinta-feira","sexta-feira","sabado"];
  setArray(dailySalesData,[1,2,3,4,5,6,0].map(index=>({
    label:weekdayLabels[index],
    value:weekdayCounts[index]
  })));

  const report = [...byDay.values()]
    .sort((a,b)=>b.value-a.value)
    .slice(0,10);
  const maxDay = Math.max(...report.map(item=>item.value),1);
  setArray(reportRows,report.map((item,index)=>({
    date:`${String(item.date.getDate()).padStart(2,"0")}/${String(item.date.getMonth()+1).padStart(2,"0")}`,
    name:index === 0 ? "Maior faturamento" : "Venda registrada",
    count:item.count,
    value:item.value,
    ticket:item.value / Math.max(item.count,1),
    pct:Math.round((item.value/maxDay)*100)
  })));

  const flowKey = document.querySelector("#flow-tabs .active")?.dataset.flow || "faturamento";
  renderFlow(flowKey);
  renderOfferComposition();
  renderTime();
  renderDailySales();
  renderOfferReport();
  vendasInitialRenderDone = true;
}

document.addEventListener("DOMContentLoaded",()=>{
  bindTabs();
  hydrateVendasFromSupabase();
  window.CaioSupabase?.registerAutoRefresh?.(hydrateVendasFromSupabase,{interval:12000});
  window.addEventListener("resize",scheduleTimeValuePosition);
  document.fonts?.ready?.then(scheduleTimeValuePosition);
});
