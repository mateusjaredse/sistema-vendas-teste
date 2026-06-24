(function(){
            window.addEventListener('message',function(event){
              const data=event.data;
              if(!data||data.type!=='painel-geral-layout')return;
              if(typeof data.template==='string'&&data.template.includes('minmax')){
                document.documentElement.style.setProperty('--pg-grid-template',data.template);
              }
            });

            if(window.parent&&window.parent!==window){
              window.parent.postMessage({type:'painel-geral-ready'},'*');
            }

            const days=[];
            const wrap=document.getElementById('ra-tl-dots');
            if(wrap) wrap.innerHTML='';
            days.forEach((item,i)=>{
              if(i>0){const l=document.createElement('div');l.className='ra-tl-line';wrap.appendChild(l);}
              const dot=document.createElement('div');dot.className='ra-tl-dot '+item.s;dot.setAttribute('data-date',item.d);wrap.appendChild(dot);
            });
          })();
          const raTabData={
            dia:{faturado:'0,00',projecao:'R$ 0,00',metaLabel:'Meta R$ 0,00',label:'Previsão do dia · projeção',pct:'0% previsto',surplus:'R$ 0,00',fill:0,status:'blue'},
            semana:{faturado:'0,00',projecao:'R$ 0,00',metaLabel:'Meta R$ 0,00',label:'Previsão da semana · projeção',pct:'0% previsto',surplus:'R$ 0,00',fill:0,status:'blue'},
            quinzena:{faturado:'0,00',projecao:'R$ 0,00',metaLabel:'Meta R$ 0,00',label:'Previsão da quinzena · projeção',pct:'0% previsto',surplus:'R$ 0,00',fill:0,status:'blue'},
            mes:{faturado:'0,00',projecao:'R$ 0,00',metaLabel:'Meta R$ 0,00',label:'Previsão do mês · projeção',pct:'0% previsto',surplus:'R$ 0,00',fill:0,status:'blue'},
          };
          const statusColor={green:'#10b981',blue:'#4c92f8',yellow:'#f59e0b',red:'#f14b4b'};
          const statusGlow={green:'16,185,129',blue:'76,146,248',yellow:'245,158,11',red:'239,68,68'};
          function raSwitchTab(el,key){
            document.querySelectorAll('.ra-tab').forEach(t=>t.classList.remove('active'));
            if(el) el.classList.add('active');
            const d=raTabData[key];
            const col=statusColor[d.status];
            document.getElementById('ra-val-num').textContent=d.faturado;
            document.getElementById('ra-val-num').style.color=col;
            document.getElementById('ra-prefix').style.color=col;
            document.getElementById('ra-meta-line').childNodes[0].textContent=d.label+' ';
            document.getElementById('ra-proj-val').textContent=d.projecao;
            document.getElementById('ra-proj-val').style.color='#8892a4';
            document.getElementById('ra-meta-label').textContent=d.metaLabel;
            document.getElementById('ra-prog-pct').textContent=d.pct;
            document.getElementById('ra-prog-surplus').textContent=d.surplus;
            const fill=document.getElementById('ra-prog-fill');
            const pct=document.getElementById('ra-prog-pct');
            fill.style.width=d.fill+'%';
            fill.style.setProperty('--ra-glow-rgb',statusGlow[d.status] || statusGlow.blue);
            fill.className='ra-progress-fill ra-fill-'+d.status+(d.fill<=0?' is-empty':'');
            pct.className='ra-prog-pct ra-pct-'+d.status;
          }
          raSwitchTab(document.querySelector('.ra-tab'), 'dia');

          (function(){
            const metaClientTabs={
              'tres-dias':{rows:[]},
              quinzena:{rows:[]},
              'um-mes':{rows:[]},
              'tres-meses':{rows:[]},
              ilimitado:{rows:[]}
            };

            const metaClientColumnStorageKey='painel.metaClientColumnsDraft.v3';
            const metaClientColumnMinWidth=12;
            const metaClientColumnMaxWidth=520;
            const metaClientColumnDefaults=[
              {key:'cliente',label:'CLIENTE',width:82},
              {key:'nome',label:'NOME',width:156},
              {key:'dias',label:'CONTAGEM',width:90}
            ];
            const metaClientColumnMap=new Map(metaClientColumnDefaults.map(column=>[column.key,column]));
            let currentMetaClientTab='tres-dias';
            let metaClientColumnLayout=loadMetaClientColumnLayout();

            function metaEscape(value){
              return String(value).replace(/[&<>"']/g,function(char){
                return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];
              });
            }

            function normalizeMetaClientColumnLayout(layout){
              const fallback=metaClientColumnDefaults.map(column=>({key:column.key,width:column.width}));
              if(!Array.isArray(layout)) return fallback;

              const used=new Set();
              const normalized=layout
                .filter(item=>item && metaClientColumnMap.has(item.key) && !used.has(item.key))
                .map(item=>{
                  used.add(item.key);
                  const base=metaClientColumnMap.get(item.key);
                  return {
                    key:item.key,
                    width:Math.max(metaClientColumnMinWidth,Math.min(metaClientColumnMaxWidth,Number(item.width) || base.width))
                  };
                });

              metaClientColumnDefaults.forEach(column=>{
                if(!used.has(column.key)) normalized.push({key:column.key,width:column.width});
              });

              return normalized;
            }

            function loadMetaClientColumnLayout(){
              try{
                return normalizeMetaClientColumnLayout(JSON.parse(localStorage.getItem(metaClientColumnStorageKey)));
              }catch{
                return normalizeMetaClientColumnLayout(null);
              }
            }

            function saveMetaClientColumnLayout(){
              try{
                localStorage.setItem(metaClientColumnStorageKey,JSON.stringify(metaClientColumnLayout));
              }catch{
                // O arquivo local pode bloquear localStorage em modos mais restritos do navegador.
              }
            }

            function getMetaClientColumns(){
              return metaClientColumnLayout.map(item=>({
                ...metaClientColumnMap.get(item.key),
                width:item.width
              }));
            }

            function fitMetaClientColumnsToWrap(columns){
              const wrap=document.querySelector('.meta-client-table-wrap');
              const available=Math.floor(wrap?.clientWidth || 0);
              if(!available) return columns;

              const total=columns.reduce((sum,column)=>sum+column.width,0);
              if(total>=available) return columns;

              const fillColumn=columns.find(column=>column.key==='nome') || columns[columns.length-1];
              return columns.map(column=>column.key===fillColumn.key
                ? {...column,width:column.width+(available-total)}
                : column
              );
            }

            function renderMetaClientColumnStructure(columns=getMetaClientColumns()){
              const colgroup=document.getElementById('meta-client-cols');
              const head=document.getElementById('meta-client-head');
              const table=colgroup?.closest('table');
              if(!colgroup || !head || !table) return;

              columns=fitMetaClientColumnsToWrap(columns);
              colgroup.innerHTML=columns.map(column=>`<col data-col-key="${column.key}" style="width:${column.width}px">`).join('');
              table.style.setProperty('--meta-client-table-width',columns.reduce((sum,column)=>sum+column.width,0)+'px');
              head.innerHTML=`
                <tr>
                  ${columns.map(column=>`
                    <th data-col-key="${column.key}">
                      <span class="meta-client-th-inner">${column.label}</span>
                    </th>
                  `).join('')}
                </tr>`;
            }

            function applyMetaClientColumnWidths(){
              const colgroup=document.getElementById('meta-client-cols');
              const table=colgroup?.closest('table');
              if(!colgroup || !table) return;

              const columns=fitMetaClientColumnsToWrap(getMetaClientColumns());
              columns.forEach(column=>{
                const col=colgroup.querySelector(`[data-col-key="${column.key}"]`);
                if(col) col.style.width=column.width+'px';
              });
              table.style.setProperty('--meta-client-table-width',columns.reduce((sum,column)=>sum+column.width,0)+'px');
            }

            function moveMetaClientColumn(fromKey,toKey){
              if(!fromKey || !toKey || fromKey===toKey) return;

              const fromIndex=metaClientColumnLayout.findIndex(column=>column.key===fromKey);
              const toIndex=metaClientColumnLayout.findIndex(column=>column.key===toKey);
              if(fromIndex<0 || toIndex<0) return;

              const moved=metaClientColumnLayout.splice(fromIndex,1)[0];
              metaClientColumnLayout.splice(toIndex,0,moved);
              saveMetaClientColumnLayout();
              renderMetaClientTab(currentMetaClientTab,false);
            }

            function startMetaClientColumnResize(event,key){
              event.preventDefault();
              event.stopPropagation();

              const layout=metaClientColumnLayout.find(column=>column.key===key);
              const base=metaClientColumnMap.get(key);
              if(!layout || !base) return;

              const startX=event.clientX;
              const startWidth=layout.width;

              const onMove=moveEvent=>{
                const nextWidth=Math.max(metaClientColumnMinWidth,Math.min(metaClientColumnMaxWidth,startWidth+moveEvent.clientX-startX));
                layout.width=Math.round(nextWidth);
                applyMetaClientColumnWidths();
              };

              const onUp=()=>{
                saveMetaClientColumnLayout();
                document.removeEventListener('pointermove',onMove);
                document.removeEventListener('pointerup',onUp);
              };

              document.addEventListener('pointermove',onMove);
              document.addEventListener('pointerup',onUp,{once:true});
            }

            function bindMetaClientColumnAdjustments(head){
              let dragKey=null;

              head.querySelectorAll('th[data-col-key]').forEach(th=>{
                th.addEventListener('dragstart',event=>{
                  if(event.target.closest('.meta-client-resize-handle')){
                    event.preventDefault();
                    return;
                  }
                  dragKey=th.dataset.colKey;
                  th.classList.add('is-dragging');
                  event.dataTransfer.effectAllowed='move';
                  event.dataTransfer.setData('text/plain',dragKey);
                });

                th.addEventListener('dragend',()=>{
                  dragKey=null;
                  head.querySelectorAll('th').forEach(item=>item.classList.remove('is-dragging','is-drop-target'));
                });

                th.addEventListener('dragover',event=>{
                  event.preventDefault();
                  th.classList.add('is-drop-target');
                });

                th.addEventListener('dragleave',()=>{
                  th.classList.remove('is-drop-target');
                });

                th.addEventListener('drop',event=>{
                  event.preventDefault();
                  th.classList.remove('is-drop-target');
                  moveMetaClientColumn(dragKey || event.dataTransfer.getData('text/plain'),th.dataset.colKey);
                });
              });

              head.querySelectorAll('.meta-client-resize-handle').forEach(handle=>{
                handle.addEventListener('pointerdown',event=>{
                  startMetaClientColumnResize(event,handle.dataset.resizeKey);
                });
              });
            }

            function renderMetaClientCell(row,column){
              let value='';
              let title='';

              switch(column.key){
                case 'cliente':
                  value=row.cliente;
                  break;
                case 'nome':
                  value=row.nome;
                  title=row.nome;
                  break;
                case 'dias':
                  value=row.dias;
                  break;
              }

              return `<td data-col-key="${column.key}"${title ? ` title="${metaEscape(title)}"` : ''}>${metaEscape(value)}</td>`;
            }

            function renderMetaClientTab(key,resetScroll=true){
              currentMetaClientTab=key;
              const data=metaClientTabs[key] || metaClientTabs['tres-dias'];
              const tbody=document.getElementById('meta-client-tbody');
              const scrollWrap=tbody?.closest('.meta-client-table-wrap');
              if(!tbody) return;
              const columns=getMetaClientColumns();
              renderMetaClientColumnStructure(columns);
              const rows=key === 'tres-dias'
                ? data.rows
                : [...data.rows].sort((a,b)=>a.dias-b.dias);

              tbody.innerHTML=rows.map(row=>`
                <tr>
                  ${columns.map(column=>renderMetaClientCell(row,column)).join('')}
                </tr>
              `).join('');
              if(scrollWrap && resetScroll) scrollWrap.scrollTop=0;
            }

            window.updatePainelInatividade=function(sourceRows){
              const buckets={
                'tres-dias':[],
                quinzena:[],
                'um-mes':[],
                'tres-meses':[],
                ilimitado:[]
              };

              (sourceRows || []).forEach(row=>{
                const dias=Math.max(0,Math.round(Number(row.days ?? row.contagem_dias ?? row.dias ?? 0)));
                if(dias < 1) return;
                const item={
                  cliente:String(row.clientId ?? row.codigo_cliente ?? row.cliente ?? ''),
                  nome:String(row.clientName ?? row.nome_cliente ?? row.nome ?? ''),
                  dias
                };
                if(dias <= 3) buckets['tres-dias'].push(item);
                else if(dias <= 15) buckets.quinzena.push(item);
                else if(dias <= 30) buckets['um-mes'].push(item);
                else if(dias <= 90) buckets['tres-meses'].push(item);
                else buckets.ilimitado.push(item);
              });

              Object.keys(metaClientTabs).forEach(key=>{
                metaClientTabs[key].rows=buckets[key] || [];
              });
              renderMetaClientTab(currentMetaClientTab,false);
            };

            document.querySelectorAll('[data-meta-range]').forEach(button=>{
              button.addEventListener('click',function(){
                if(this.classList.contains('active')) return;
                document.querySelectorAll('[data-meta-range]').forEach(item=>item.classList.remove('active'));
                this.classList.add('active');
                renderMetaClientTab(this.dataset.metaRange,true);
              });
            });

            renderMetaClientTab('tres-dias');
            window.addEventListener('resize',applyMetaClientColumnWidths);
          })();

/* --- inline script block --- */

// ── ESTADO INICIAL VAZIO ───────────────────────────────────────────
let META_DIARIA = 0;
let META_REAL   = 0;

const DADOS = [];
let HOLIDAY_SET = new Set();
let relatorioTabelaSignature = "";

function fmt(n){return Number(n).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});}

// ── PROGRESSO DA META MENSAL ────────────────────────────────────────
let FAT_MENSAL   = 0;
let META_MENSAL  = 0;
let PREVISAO     = 0;
let MEDIA_DIA    = 0;

function renderProgresso(){
  const V = FAT_MENSAL;
  const M = META_MENSAL;

  // Algoritmo dinâmico
  let barPct, metaPct;
  if(M <= 0){
    barPct = 0;
    metaPct = 0;
  } else if(V < M){
    metaPct = 80;
    barPct  = (V / M) * 80;
  } else {
    barPct  = 100;
    metaPct = V > 0 ? (M / V) * 100 : 0;
  }

  const pct = M > 0 ? (V / M) * 100 : 0;
  const resta = M - V;

  // Atualizar elementos
  document.getElementById("prog-pct-val").textContent =
    pct.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}) + "%";

  document.getElementById("prog-fat-val").textContent = "R$ " + fmt(V);
  document.getElementById("prog-meta-lbl").textContent = "Meta: R$ " + fmt(M);

  const progressFill = document.getElementById("prog-bar-fill");
  progressFill.style.width = barPct.toFixed(2) + "%";
  progressFill.classList.toggle("is-empty",barPct <= 0);
  document.getElementById("prog-meta-line").style.left = metaPct.toFixed(2) + "%";

  document.getElementById("prog-resta").textContent = "R$ " + fmt(Math.abs(resta));


}

// ── RENDERIZAR TABELA ───────────────────────────────────────────────
function getRelatorioTabelaSignature(){
  return JSON.stringify(DADOS.map(item=>({
    data:item.data,
    fat:Number(item.fat || 0),
    metaFicticia:Number(item.metaFicticia || 0),
    metaReal:Number(item.metaReal || 0),
    nfs:(item.nfs || []).map(nf=>[nf.nf,nf.cli,Number(nf.val || 0),Boolean(nf.oferta)])
  })));
}

function renderTabela(){
  const container = document.getElementById("tbl-body");
  if(!container) return;
  const nextSignature = getRelatorioTabelaSignature();
  if(nextSignature === relatorioTabelaSignature) return;
  relatorioTabelaSignature = nextSignature;
  container.innerHTML = "";

  [...DADOS.entries()].reverse().forEach(([i,d])=>{
    const metaFicticiaDia = Number.isFinite(d.metaFicticia) ? d.metaFicticia : META_DIARIA;
    const metaRealDia = Number.isFinite(d.metaReal) ? d.metaReal : META_REAL;
    const res = d.fat - metaFicticiaDia;
    const resReal = d.fat - metaRealDia;
    const pos = res >= 0;
    const posReal = resReal >= 0;

    // pct preenchimento barras (cap em 130%)
    // Algoritmo de barra dinâmica
    // Meta Fictícia
    let barFict, metaFict;
    if(metaFicticiaDia <= 0){
      metaFict = 0;
      barFict = 0;
    }else if(d.fat < metaFicticiaDia){
      metaFict = 80;
      barFict  = (d.fat / metaFicticiaDia) * 80;
    } else {
      barFict  = 100;
      metaFict = d.fat > 0 ? (metaFicticiaDia / d.fat) * 100 : 0;
    }
    // Meta Real
    let barReal, metaReal;
    if(metaRealDia <= 0){
      metaReal = 0;
      barReal = 0;
    }else if(d.fat < metaRealDia){
      metaReal = 80;
      barReal  = (d.fat / metaRealDia) * 80;
    } else {
      barReal  = 100;
      metaReal = d.fat > 0 ? (metaRealDia / d.fat) * 100 : 0;
    }

    const div = document.createElement("div");
    div.className = "trow";
    div.innerHTML = `
      <div class="trow-main">
        <span class="td-data">${d.data}</span>
        <span class="td-res ${posReal?"pos":"neg"}">R$ ${fmt(d.fat)}</span>
        <span class="td-fat">R$ ${fmt(metaRealDia)}</span>
        <button class="trow-btn" onclick="abrirPop(event,${i})" title="Ver faturamentos">⊞</button>
      </div>
      <div class="trow-bars">
        <!-- Barra fictícia -->
        <div class="bar-group">
          <div class="bar-header">
            <span class="bar-lbl">Meta Fictícia</span>
            <span class="bar-vals">${pos?"Sobra":"Falta"}: R$ ${fmt(Math.abs(res))}</span>
          </div>
          <div class="bar-bg">
            <div class="bar-fill ${pos?"pos":"neg"}" style="width:${barFict.toFixed(1)}%"></div>
            <div class="bar-meta-line" style="left:${metaFict.toFixed(1)}%"></div>
          </div>
          <div class="bar-pct">${(metaFicticiaDia>0?d.fat/metaFicticiaDia*100:0).toFixed(1)}% da meta fictícia</div>
        </div>
        <!-- Barra real -->
        <div class="bar-group">
          <div class="bar-header">
            <span class="bar-lbl">Meta Real</span>
            <span class="bar-vals">${posReal?"Sobra":"Falta"}: R$ ${fmt(Math.abs(resReal))}</span>
          </div>
          <div class="bar-bg">
            <div class="bar-fill ${posReal?"pos":"neg"}" style="width:${barReal.toFixed(1)}%"></div>
            <div class="bar-meta-line" style="left:${metaReal.toFixed(1)}%"></div>
          </div>
          <div class="bar-pct">${(metaRealDia>0?d.fat/metaRealDia*100:0).toFixed(1)}% da meta real</div>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

// ── DADOS MOCK de produto para o popover ───────────────────────────
const PROD_MOCK=[
  {nome:"ANEL DE VEDACAO",   cod:"1528991",qtd:3, pu:160.00,  oferta:false},
  {nome:"FILTRO DE OLEO",    cod:"2031044",qtd:1, pu:850.00,  oferta:false},
  {nome:"CORREIA DENTADA",   cod:"3047821",qtd:2, pu:420.50,  oferta:false},
  {nome:"ROLAMENTO 6205",    cod:"4102390",qtd:4, pu:95.75,   oferta:false},
  {nome:"BOMBA DAGUA",       cod:"5200871",qtd:1, pu:1240.00, oferta:false},
];
// ── POPOVER ─────────────────────────────────────────────────────────
function abrirPop(e, idx){
  e.stopPropagation();
  const d = DADOS[idx];
  document.getElementById("pop-title-txt").textContent = `Faturamentos · ${d.data}`;
  const tbody = document.getElementById("pop-tbody");
  if(!d.nfs.length){
    tbody.innerHTML = `<tr><td colspan="7" class="pop-empty">Nenhum faturamento registrado</td></tr>`;
  } else {
    tbody.innerHTML = d.nfs.map((n,i)=>{
      const p = PROD_MOCK[i % PROD_MOCK.length];
      const total = p.qtd * p.pu;
      const oferta = Boolean(n.oferta);
      return `<tr>
        <td class="pop-td-nfe">${n.nf}</td>
        <td><div class="pop-td-cli-name">${n.cli}</div><div class="pop-td-cli-sub">${i+1}</div></td>
        <td><div class="pop-td-prod-name">${p.nome}</div><div class="pop-td-prod-code">${p.cod}</div></td>
        <td class="pop-td-qtd">${p.qtd}</td>
        <td class="pop-td-preco">R$ ${fmt(p.pu)}</td>
        <td class="pop-td-total">R$ ${fmt(total)}</td>
        <td class="pop-td-oferta"><span class="${oferta?'pop-badge-sim':'pop-badge-nao'}">${oferta?'Sim':'Não'}</span></td>
      </tr>`;
    }).join("");
  }
  const box = document.getElementById("pop-box");
  const rect = e.target.getBoundingClientRect();
  const cardRect = document.querySelector(".tbl-card")?.getBoundingClientRect();
  const topLimit = cardRect ? cardRect.top + 12 : 8;
  const bottomLimit = cardRect ? cardRect.bottom - 12 : window.innerHeight - 8;
  // posiciona perto do botão mas garante que não saia do card de relatório
  const desiredTop = rect.bottom + 6;
  const top = Math.max(topLimit,Math.min(desiredTop,bottomLimit - 160));
  const maxBoxHeight = Math.max(160,bottomLimit - top);
  const titleHeight = 38;
  box.style.setProperty("--pop-box-max",`${maxBoxHeight}px`);
  box.style.setProperty("--pop-scroll-max",`${Math.max(96,maxBoxHeight-titleHeight)}px`);
  const boxWidth = Math.min(800,window.innerWidth - 16);
  const left = Math.max(8,Math.min(rect.right - boxWidth,window.innerWidth - boxWidth - 8));
  box.style.top  = top+"px";
  box.style.left = left+"px";
  box.style.transform = "";
  document.getElementById("pop-overlay").classList.add("open");
}
function fecharPop(e){
  if(!e || e.target === document.getElementById("pop-overlay"))
    document.getElementById("pop-overlay").classList.remove("open");
}

renderProgresso();
renderTabela();

function dateKey(date){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function brasiliaToday(){
  const parts = new Intl.DateTimeFormat('en-CA',{
    timeZone:'America/Sao_Paulo',
    year:'numeric',
    month:'2-digit',
    day:'2-digit'
  }).formatToParts(new Date()).reduce((acc,part)=>{
    if(part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  },{});
  return new Date(Number(parts.year),Number(parts.month)-1,Number(parts.day));
}

function brasiliaNowParts(){
  return new Intl.DateTimeFormat('en-CA',{
    timeZone:'America/Sao_Paulo',
    year:'numeric',
    month:'2-digit',
    day:'2-digit',
    hour:'2-digit',
    minute:'2-digit',
    hour12:false
  }).formatToParts(new Date()).reduce((acc,part)=>{
    if(part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  },{});
}

function brasiliaNow(){
  const parts = brasiliaNowParts();
  return new Date(
    Number(parts.year),
    Number(parts.month)-1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute)
  );
}

function businessDayDatesInMonth(year,monthIndex,holidaySet=HOLIDAY_SET){
  const lastDay = new Date(year,monthIndex+1,0).getDate();
  const dates = [];
  for(let day=1;day<=lastDay;day+=1){
    const date = new Date(year,monthIndex,day);
    const weekDay = date.getDay();
    if(weekDay !== 0 && weekDay !== 6 && !holidaySet.has(dateKey(date))) dates.push(date);
  }
  return dates;
}

function businessDaysInMonth(year,monthIndex,holidaySet=HOLIDAY_SET){
  return Math.max(businessDayDatesInMonth(year,monthIndex,holidaySet).length,1);
}

function businessDaysInRange(start,end,holidaySet=HOLIDAY_SET){
  let total = 0;
  const cursor = new Date(start.getFullYear(),start.getMonth(),start.getDate());
  const final = new Date(end.getFullYear(),end.getMonth(),end.getDate());
  while(cursor <= final){
    const weekDay = cursor.getDay();
    if(weekDay !== 0 && weekDay !== 6 && !holidaySet.has(dateKey(cursor))) total += 1;
    cursor.setDate(cursor.getDate()+1);
  }
  return Math.max(total,1);
}

function sumRowsBetween(rows,start,end){
  return rows.reduce((sum,row)=>{
    if(row.date && row.date >= start && row.date <= end) return sum + row.revenue;
    return sum;
  },0);
}

function sumMetaBetween(rows,start,end,key){
  return rows.reduce((sum,row)=>{
    if(row.date && row.date >= start && row.date <= end) return sum + (row[key] || 0);
    return sum;
  },0);
}

function workdayElapsedRatio(date){
  const now = brasiliaNow();
  if(dateKey(date) !== dateKey(now)) return 1;
  const minutes = now.getHours()*60 + now.getMinutes();
  const windows = [
    [8*60,11*60+30],
    [13*60+30,18*60]
  ];
  const total = windows.reduce((sum,[start,end])=>sum + end - start,0);
  const elapsed = windows.reduce((sum,[start,end])=>{
    if(minutes <= start) return sum;
    if(minutes >= end) return sum + end - start;
    return sum + minutes - start;
  },0);
  return total ? Math.max(0,Math.min(1,elapsed/total)) : 0;
}

function rhythmStatus(projected,meta){
  if(meta <= 0 || projected <= 0) return 'blue';
  const ratio = projected / meta;
  if(ratio >= .9) return 'green';
  if(ratio >= .84) return 'blue';
  if(ratio >= .8) return 'yellow';
  return 'red';
}

function setRaData(key,{actual,projected,meta,label}){
  const diff = projected - meta;
  const pct = meta > 0 ? projected / meta * 100 : 0;
  raTabData[key]={
    faturado:fmt(actual),
    projecao:'R$ ' + fmt(projected),
    metaLabel:'Meta R$ ' + fmt(meta),
    label,
    pct:`${Math.max(0,pct).toFixed(0)}% previsto`,
    surplus:`${diff >= 0 ? 'Sobra' : 'Falta'} R$ ${fmt(Math.abs(diff))}`,
    fill:Math.max(0,Math.min(100,pct)),
    status:rhythmStatus(projected,meta)
  };
}

function renderRaDots(metaRealRows,year,monthIndex){
  const wrap=document.getElementById('ra-tl-dots');
  if(!wrap) return;
  wrap.innerHTML='';
  const today = brasiliaToday();
  const todayIso = dateKey(today);
  const metaByDate = new Map((metaRealRows || []).map(row=>[row.data,row]));
  const todayTone = raTabData.dia?.status || 'blue';
  const days = businessDayDatesInMonth(year,monthIndex);
  days.forEach((date,i)=>{
    if(i>0){
      const line=document.createElement('div');
      line.className='ra-tl-line';
      wrap.appendChild(line);
    }
    const key = dateKey(date);
    const meta = metaByDate.get(key);
    const dot=document.createElement('div');
    let statusClass = 'future';
    if(key < todayIso) statusClass = meta?.status ? 'pos' : 'neg';
    if(key === todayIso) statusClass = `today today-${todayTone}`;
    dot.className='ra-tl-dot ' + statusClass;
    dot.setAttribute('data-date',`${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}`);
    wrap.appendChild(dot);
  });
}

function updateRhythmCard(rows,metaRealRows,year,monthIndex){
  const today = brasiliaToday();
  const currentDayStart = new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const currentDayEnd = new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,59,999);
  const monthStart = new Date(year,monthIndex,1);
  const monthEnd = new Date(year,monthIndex+1,0,23,59,59,999);
  const dayRows = rows.filter(row=>row.date && row.date >= currentDayStart && row.date <= currentDayEnd);
  const todayMeta = metaRealRows.find(row=>row.data === `${year}-${String(monthIndex+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`);
  const dayActual = dayRows.reduce((sum,row)=>sum+row.revenue,0);
  const dayRatio = workdayElapsedRatio(currentDayStart);
  const dayProjected = dayRatio > 0 ? dayActual / dayRatio : dayActual;

  const weekStart = new Date(currentDayStart);
  weekStart.setDate(currentDayStart.getDate() - ((currentDayStart.getDay()+6)%7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate()+6);
  const safeWeekStart = weekStart < monthStart ? monthStart : weekStart;
  const safeWeekEnd = weekEnd > monthEnd ? monthEnd : weekEnd;
  const weekActual = sumRowsBetween(rows,safeWeekStart,safeWeekEnd);
  const weekElapsed = businessDaysInRange(safeWeekStart,currentDayStart);
  const weekTotal = businessDaysInRange(safeWeekStart,safeWeekEnd);
  const weekProjected = weekElapsed ? weekActual / weekElapsed * weekTotal : weekActual;
  const weekMeta = sumMetaBetween(metaRealRows,safeWeekStart,safeWeekEnd,'metaRealDia') || META_DIARIA * weekTotal;

  const quinStart = new Date(year,monthIndex,today.getDate() <= 15 ? 1 : 16);
  const quinEnd = new Date(year,monthIndex,today.getDate() <= 15 ? 15 : new Date(year,monthIndex+1,0).getDate(),23,59,59,999);
  const quinActual = sumRowsBetween(rows,quinStart,quinEnd);
  const quinElapsed = businessDaysInRange(quinStart,currentDayStart < quinStart ? quinStart : currentDayStart);
  const quinTotal = businessDaysInRange(quinStart,quinEnd);
  const quinProjected = quinElapsed ? quinActual / quinElapsed * quinTotal : quinActual;
  const quinMeta = sumMetaBetween(metaRealRows,quinStart,quinEnd,'metaRealDia') || META_DIARIA * quinTotal;

  const monthElapsed = businessDaysInRange(monthStart,currentDayStart < monthStart ? monthStart : currentDayStart);
  const monthTotal = businessDaysInMonth(year,monthIndex);
  const monthProjected = monthElapsed ? FAT_MENSAL / monthElapsed * monthTotal : FAT_MENSAL;

  setRaData('dia',{actual:dayActual,projected:dayProjected,meta:todayMeta?.metaRealDia || META_REAL,label:'Previsão do dia · projeção'});
  setRaData('semana',{actual:weekActual,projected:weekProjected,meta:weekMeta,label:'Previsão da semana · projeção'});
  setRaData('quinzena',{actual:quinActual,projected:quinProjected,meta:quinMeta,label:'Previsão da quinzena · projeção'});
  setRaData('mes',{actual:FAT_MENSAL,projected:monthProjected,meta:META_MENSAL,label:'Previsão do mês · projeção'});

  renderRaDots(metaRealRows,year,monthIndex);
  const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const header = document.querySelector('.ra-tl-header');
  if(header) header.textContent = `Dias úteis — ${monthNames[monthIndex]}`;
  const activeKey = document.querySelector('.ra-tab.active')?.textContent?.trim().toLowerCase().replace('ê','e') || 'dia';
  const keyMap = {dia:'dia',semana:'semana',quinzena:'quinzena',mes:'mes'};
  raSwitchTab(document.querySelector('.ra-tab.active'),keyMap[activeKey] || 'dia');
}

function updateHeroCards(rows,allRows,inatividadeRows,metaRealRows,monthIndex,secundarioRows=[]){
  const summarySource = secundarioRows.length ? secundarioRows : rows;
  const nfeSet = new Set(summarySource.map(row=>row.nfe).filter(Boolean));
  const clientSet = new Set(summarySource.map(row=>row.clientId || row.clientName).filter(Boolean));
  document.querySelectorAll('.hero-summary-card').forEach(card=>{
    const nums = card.querySelectorAll('.hero-static-num');
    if(nums[0]) nums[0].textContent = summarySource.length;
    if(nums[1]) nums[1].textContent = nfeSet.size;
    if(nums[2]) nums[2].textContent = clientSet.size;
  });

  const todayIso = dateKey(brasiliaToday());
  const todayRows = rows.filter(row=>row.data === todayIso);
  const monthTicket = nfeSet.size ? FAT_MENSAL / nfeSet.size : 0;
  const todayNfeSet = new Set(todayRows.map(row=>row.nfe).filter(Boolean));
  const todayRevenue = todayRows.reduce((sum,row)=>sum+row.revenue,0);
  const dayTicket = todayNfeSet.size ? todayRevenue / todayNfeSet.size : 0;
  document.querySelectorAll('.hero-ticket-card').forEach(card=>{
    const vals = card.querySelectorAll('.hero-ticket-val');
    const trends = card.querySelectorAll('.hero-ticket-trend');
    if(vals[0]) vals[0].textContent = 'R$ ' + fmt(monthTicket);
    if(vals[1]) vals[1].textContent = 'R$ ' + fmt(dayTicket);
    trends.forEach(item=>{ item.textContent='0,0%'; item.classList.remove('up','down'); item.classList.add('up'); });
  });

  const totalOffer = rows.length;
  const simRows = rows.filter(row=>row.activeOffer);
  const naoRows = rows.filter(row=>!row.activeOffer);
  const simRevenue = simRows.reduce((sum,row)=>sum+row.revenue,0);
  const naoRevenue = naoRows.reduce((sum,row)=>sum+row.revenue,0);
  const simPct = totalOffer ? Math.round(simRows.length/totalOffer*100) : 0;
  const naoPct = totalOffer ? 100 - simPct : 0;
  document.querySelectorAll('[data-card-id="oferta"]').forEach(card=>{
    const svgTexts = card.querySelectorAll('svg text');
    if(svgTexts[1]) svgTexts[1].textContent = totalOffer;
    const arcs = card.querySelectorAll('svg circle[stroke-width="9"]');
    const circumference = 138.23;
    if(arcs[1]) arcs[1].setAttribute('stroke-dasharray',`${(naoPct/100*circumference).toFixed(2)} ${circumference}`);
    if(arcs[2]){
      arcs[2].setAttribute('stroke-dasharray',`${(simPct/100*circumference).toFixed(2)} ${circumference}`);
      arcs[2].setAttribute('stroke-dashoffset',`-${(naoPct/100*circumference).toFixed(2)}`);
    }
    const strongValues = [...card.querySelectorAll('span')].filter(span=>span.style.fontSize === '16px');
    const pctValues = [...card.querySelectorAll('span')].filter(span=>span.style.fontSize === '9px' && span.style.fontWeight === '700');
    const moneyValues = [...card.querySelectorAll('span')].filter(span=>span.textContent.trim().startsWith('R$'));
    if(strongValues[0]) strongValues[0].textContent = simRows.length;
    if(strongValues[1]) strongValues[1].textContent = naoRows.length;
    if(pctValues[0]) pctValues[0].textContent = `${simPct}%`;
    if(pctValues[1]) pctValues[1].textContent = `${naoPct}%`;
    if(moneyValues[0]) moneyValues[0].textContent = 'R$ ' + fmt(simRevenue);
    if(moneyValues[1]) moneyValues[1].textContent = 'R$ ' + fmt(naoRevenue);
  });

  const activeClients = inatividadeRows.filter(row=>row.days <= 30).length;
  const inactiveClients = inatividadeRows.filter(row=>row.days > 30).length;
  document.querySelectorAll('[data-card-id="status-clientes"]').forEach(card=>{
    const vals = card.querySelectorAll('.hf-val.big');
    if(vals[0]) vals[0].textContent = activeClients;
    if(vals[1]) vals[1].textContent = inactiveClients;
  });

  const today = brasiliaToday();
  const totalBusiness = businessDaysInMonth(today.getFullYear(),monthIndex);
  const remainingBusiness = businessDayDatesInMonth(today.getFullYear(),monthIndex)
    .filter(date=>date.getMonth() === today.getMonth() && dateKey(date) >= dateKey(today))
    .length;
  document.querySelectorAll('[data-card-id="dias"]').forEach(card=>{
    const vals = card.querySelectorAll('.hf-val.big');
    if(vals[0]) vals[0].textContent = totalBusiness;
    if(vals[1]) vals[1].textContent = Math.max(remainingBusiness,0);
  });
  window.syncPainelHeroTemplates?.();
}

function setTodayLiveState(holidaySet=HOLIDAY_SET){
  const now = brasiliaNow();
  const minutes = now.getHours()*60 + now.getMinutes();
  const isWorkDay = now.getDay() !== 0 && now.getDay() !== 6 && !holidaySet.has(dateKey(now));
  const isWorkHour = (minutes >= 8*60 && minutes <= 11*60+30) || (minutes >= 13*60+30 && minutes <= 18*60);
  document.querySelector(".today-card")?.classList.toggle("is-offline",!(isWorkDay && isWorkHour));
}

function updateTodayCard(dayData,rows){
  if(!dayData) return;
  const label = document.querySelector(".hs-hoje .hs-lbl.green");
  const value = document.querySelector(".hs-hoje .hf-val.big.green");
  const metaFict = document.querySelector(".hs-hoje .hf-val.red");
  const metaReal = document.querySelector(".hs-hoje .falta-real-val");
  if(label) label.innerHTML = `<div class="hs-dot dot-green"></div>Hoje · ${dayData.data}`;
  if(value) value.textContent = "R$ " + fmt(dayData.fat);
  if(metaFict) metaFict.textContent = "-R$ " + fmt(Number.isFinite(dayData.metaFicticia) ? dayData.metaFicticia : META_DIARIA);
  if(metaReal) metaReal.textContent = "-R$ " + fmt(Number.isFinite(dayData.metaReal) ? dayData.metaReal : META_REAL);

  const byTurn = rows.reduce((acc,row)=>{
    const hour = Number(String(row.horario || "00:00").slice(0,2));
    if(hour < 12) acc.mat += row.revenue;
    else acc.vesp += row.revenue;
    return acc;
  },{mat:0,vesp:0});
  const total = Math.max(byTurn.mat + byTurn.vesp,1);
  const matPct = byTurn.mat / total * 100;
  const vespPct = byTurn.vesp / total * 100;
  const matVal = document.getElementById("turno-mat-val");
  const matBar = document.getElementById("turno-mat-bar");
  const matPctEl = document.getElementById("turno-mat-pct");
  const vespVal = document.getElementById("turno-vesp-val");
  const vespBar = document.getElementById("turno-vesp-bar");
  const vespPctEl = document.getElementById("turno-vesp-pct");
  if(matVal) matVal.textContent = "R$ " + fmt(byTurn.mat);
  if(matBar) matBar.style.width = matPct.toFixed(1) + "%";
  if(matPctEl) matPctEl.textContent = matPct.toFixed(1).replace(".",",") + "% do dia";
  if(vespVal) vespVal.textContent = "R$ " + fmt(byTurn.vesp);
  if(vespBar) vespBar.style.width = vespPct.toFixed(1) + "%";
  if(vespPctEl) vespPctEl.textContent = vespPct.toFixed(1).replace(".",",") + "% da tarde";
}

async function hydratePainelGeralFromSupabase(){
  const api = window.CaioSupabase;
  if(!api?.get) return;

  const today = api.brasiliaToday?.() || brasiliaToday();
  const currentYear = today.getFullYear();
  const [principalRows,secundarioRows,metaRows,metaRealRows,inatividadeRows,feriadosRows] = await Promise.all([
    (api.getAll || api.get)(api.tables.principal,"select=*"),
    (api.getAll || api.get)(api.tables.secundario,"select=*"),
    (api.getAll || api.get)(api.tables.metas,"select=*"),
    (api.getAll || api.get)(api.tables.metasReais,"select=*"),
    (api.getAll || api.get)(api.tables.inatividade,"select=*"),
    (api.getAll || api.get)(api.tables.feriados,"select=*")
  ]);
  const allRows = principalRows.map(api.normalizePrincipal).filter(row=>row.date);
  const allSecundarioRows = secundarioRows.map(api.normalizeSecundario).filter(row=>row.date);
  const yearRows = allRows.filter(row=>row.date.getFullYear() === currentYear);
  const yearSecundarioRows = allSecundarioRows.filter(row=>row.date.getFullYear() === currentYear);
  const allMetaReal = metaRealRows.map(api.normalizeMetaReal).filter(row=>row.date).sort((a,b)=>a.date-b.date);
  const inatividade = inatividadeRows.map(api.normalizeInatividade).filter(row=>row.clientId || row.clientName);
  HOLIDAY_SET = new Set(feriadosRows.map(api.normalizeFeriado).filter(row=>row.date).map(row=>row.data));
  setTodayLiveState(HOLIDAY_SET);

  let monthIndex = today.getMonth();
  const rows = yearRows.filter(row=>row.date.getMonth() === monthIndex);
  const monthSecundarioRows = yearSecundarioRows.filter(row=>row.date.getMonth() === monthIndex);
  const monthMetaReal = allMetaReal.filter(row=>row.date.getFullYear() === currentYear && row.date.getMonth() === monthIndex);
  const metaByDate = new Map(monthMetaReal.map(row=>[row.data,row]));

  const meta = metaRows
    .map(api.normalizeMeta)
    .find(item=>item.year === currentYear && item.monthIndex === monthIndex);
  META_MENSAL = meta?.value || 0;
  META_DIARIA = monthMetaReal[0]?.metaFicticiaDia || META_MENSAL / businessDaysInMonth(currentYear,monthIndex);
  const todayMetaRow = monthMetaReal.find(row=>row.data === dateKey(today));
  const latestMeta = monthMetaReal[monthMetaReal.length-1];
  META_REAL = todayMetaRow?.metaRealDia || latestMeta?.metaRealDia || META_DIARIA;

  const grouped = new Map();
  rows.forEach(row=>{
    const key = api.dateISO(row.date);
    if(!grouped.has(key)){
      grouped.set(key,{date:row.date,data:`${String(row.date.getDate()).padStart(2,"0")}/${String(row.date.getMonth()+1).padStart(2,"0")}`,fat:0,nfs:[],rows:[]});
    }
    const item = grouped.get(key);
    item.fat += row.revenue;
    item.rows.push(row);
    item.nfs.push({nf:row.nfe,cli:row.clientName || row.clientId,val:row.revenue,oferta:row.activeOffer});
  });

  monthMetaReal.forEach(metaDay=>{
    const key = metaDay.data;
    if(!grouped.has(key)){
      grouped.set(key,{
        date:metaDay.date,
        data:`${String(metaDay.date.getDate()).padStart(2,"0")}/${String(metaDay.date.getMonth()+1).padStart(2,"0")}`,
        fat:0,
        nfs:[],
        rows:[]
      });
    }
  });

  if(today.getFullYear() === currentYear && today.getMonth() === monthIndex){
    const todayKey = dateKey(today);
    if(!grouped.has(todayKey)){
      grouped.set(todayKey,{
        date:today,
        data:`${String(today.getDate()).padStart(2,"0")}/${String(today.getMonth()+1).padStart(2,"0")}`,
        fat:0,
        nfs:[],
        rows:[]
      });
    }
  }

  const days = [...grouped.values()].sort((a,b)=>a.date-b.date);
  DADOS.splice(0,DADOS.length,...days.map(day=>{
    const metaDay = metaByDate.get(api.dateISO(day.date));
    return {
      data:day.data,
      fat:day.fat,
      nfs:day.nfs,
      metaFicticia:metaDay?.metaFicticiaDia ?? META_DIARIA,
      metaReal:metaDay?.metaRealDia ?? META_REAL
    };
  }));
  FAT_MENSAL = rows.reduce((sum,row)=>sum+row.revenue,0);
  MEDIA_DIA = FAT_MENSAL / Math.max(days.length,1);
  PREVISAO = FAT_MENSAL;

  const monthLabel = document.querySelector(".hs-fat-mes-nome");
  const yearLabel = document.querySelector(".hs-fat-mes-ano");
  const monthNames = ["JANEIRO","FEVEREIRO","MARCO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"];
  if(monthLabel) monthLabel.textContent = monthNames[monthIndex];
  if(yearLabel) yearLabel.textContent = String(currentYear);

  renderProgresso();
  renderTabela();
  const todayKey = dateKey(today);
  const todayData = grouped.get(todayKey) || days[days.length-1];
  updateTodayCard(todayData || {data:"",fat:0,rows:[]},todayData?.rows || []);
  updateRhythmCard(rows,monthMetaReal,currentYear,monthIndex);
  updateHeroCards(rows,allRows,inatividade,monthMetaReal,monthIndex,monthSecundarioRows);
  window.updatePainelInatividade?.(inatividade);
}

setTodayLiveState();
hydratePainelGeralFromSupabase();
window.CaioSupabase?.registerAutoRefresh?.(hydratePainelGeralFromSupabase,{interval:7000});
window.setInterval(()=>setTodayLiveState(HOLIDAY_SET),10000);

/* --- inline script block --- */

document.addEventListener("DOMContentLoaded",()=>{
  const slots = [...document.querySelectorAll(".hero-scan-slot")];
  const templateBox = document.getElementById("hero-card-templates");
  if(slots.length !== 3 || !templateBox) return;

  const templates = {};
  function captureTemplates(){
    [...templateBox.children].forEach(card=>{ templates[card.dataset.cardId] = card.outerHTML; });
  }
  captureTemplates();
  const cardIds = Object.keys(templates);
  let visible = ["resumo","oferta","ticket"];
  let step = 0;

  const view = (cardId,state) => `<div class="hero-card-view hero-card-${state}">${templates[cardId]}</div>`;

  function renderSlots(){
    slots.forEach((slot,i)=>{ slot.innerHTML = view(visible[i], "current"); });
  }

  window.syncPainelHeroTemplates=function(){
    captureTemplates();
    slots.forEach((slot,i)=>{
      const currentCard = slot.querySelector(".hero-card-current .hero-bottom-cell");
      const cardId = currentCard?.dataset.cardId || visible[i];
      if(!cardId || !templates[cardId]) return;
      visible[i] = cardId;
      slot.innerHTML = view(cardId,"current");
    });
  };

  function chooseNext(index){
    const visibleNow = new Set(visible);
    let choices = cardIds.filter(id => !visibleNow.has(id));
    if(!choices.length) choices = cardIds.filter(id => id !== visible[index]);
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function swapSlot(index){
    const slot = slots[index];
    const oldLayer = slot.querySelector(".hero-card-current");
    if(!slot || !oldLayer) return;

    const nextId = chooseNext(index);
    oldLayer.classList.remove("hero-card-current");
    oldLayer.classList.add("hero-card-old");
    slot.insertAdjacentHTML("beforeend", view(nextId, "new"));

    window.setTimeout(()=>{
      visible[index] = nextId;
      slot.innerHTML = view(nextId, "current");
    },640);
  }

  renderSlots();
  window.setInterval(()=>{
    swapSlot(step % slots.length);
    step += 1;
  },2600);
});
