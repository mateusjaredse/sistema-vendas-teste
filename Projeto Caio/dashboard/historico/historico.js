const ANOS = ['2023', '2024', '2025', '2026'];
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES_COMPLETOS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const COLORS = {
  '2023': { line: '#052e60', fill: 'rgba(5,46,96,.46)' },
  '2024': { line: '#0e4b93', fill: 'rgba(14,75,147,.42)' },
  '2025': { line: '#1d6ef5', fill: 'rgba(29,110,245,.38)' },
  '2026': { line: '#60a5fa', fill: 'rgba(96,165,250,.36)' }
};
const FATURAMENTO_COLORS = ['#092c66', '#1390ad', '#11a27b', '#3d0a5d'];

const DETAIL_COLORS = ['#12ac9d', '#1157a8'];
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const fatMensal = {
  '2023': [612, 565, 704, 648, 691, 676, 742, 718, 664, 756, 733, 812],
  '2024': [635, 742, 688, 835, 705, 872, 758, 925, 774, 948, 815, 990],
  '2025': [710, 684, 812, 768, 860, 804, 918, 872, 970, 895, 1018, 962],
  '2026': [690, 745, 860, 730, 950, null, null, null, null, null, null, null]
};

const metaMensal = {
  '2023': [60, 57, 70, 66, 68, 69, 73, 72, 67, 75, 76, 80],
  '2024': [64, 61, 70, 72, 73, 77, 78, 80, 78, 84, 83, 88],
  '2025': [72, 70, 81, 79, 82, 84, 90, 89, 92, 91, 97, 103],
  '2026': [86, 88, 85, 92, 90, null, null, null, null, null, null, null]
};

const conversaoMensal = {
  '2023': Array(12).fill(null),
  '2024': Array(12).fill(null),
  '2025': Array(12).fill(null),
  '2026': Array(12).fill(null)
};

const compareData = {
  'Jan/24': { tkt: 240, cli: 32, nfe: 58 },
  'Fev/24': { tkt: 228, cli: 28, nfe: 51 },
  'Mar/24': { tkt: 255, cli: 35, nfe: 62 },
  'Jan/25': { tkt: 260, cli: 36, nfe: 65 },
  'Fev/25': { tkt: 248, cli: 32, nfe: 58 },
  'Mar/25': { tkt: 272, cli: 39, nfe: 72 },
  'Jan/26': { tkt: 278, cli: 41, nfe: 76 },
  'Fev/26': { tkt: 265, cli: 38, nfe: 69 },
  'Mar/26': { tkt: 288, cli: 44, nfe: 81 }
};

let chartFaturamento;
let chartConversao;
let chartDetalhado;
let chartProjecao;
let faturamentoMode = 'meses';
let conversaoMode = 'meses';
let projecaoMode = 'meses';
let conversionWaterController = null;
let conversaoSelectedMonthIndex = null;
let selectedItems = defaultDetailPeriods();
let pickerStage = 'year';
let pickerYear = '';
let summaryExpanded = false;
let summaryExpandTimer = 0;
let hasProjectionData = false;
let historicoDataSignature = '';
let historicoInitialRenderDone = false;

function hexToRgba(hex, alpha) {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
}

function fullMoney(value) {
  return BRL.format(value);
}

function compactMoney(value) {
  if (value >= 1000000) {
    const result = value / 1000000;
    return `R$ ${result.toFixed(result >= 10 ? 0 : 1).replace('.', ',')} mi`;
  }
  if (value >= 1000) {
    const result = value / 1000;
    return `R$ ${result.toFixed(result >= 10 ? 0 : 1).replace('.', ',')}k`;
  }
  return BRL.format(value);
}

function percent(value, total) {
  if (!total) return '-';
  return `${((value / total) * 100).toFixed(1).replace('.', ',')}%`;
}

function niceAxisMax(value) {
  const safeValue = Math.max(1, value || 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(safeValue)));
  const normalized = safeValue / magnitude;
  const step = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((item) => normalized <= item) || 10;
  return step * magnitude;
}

function axisMoney(value) {
  if (value === 0) return 'R$ 0';
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(value % 1000000 ? 1 : 0).replace('.', ',')} mi`;
  return `R$ ${Math.round(value / 1000)}k`;
}

function buildSmoothPath(points) {
  return points.map((point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const cx = (previous.x + point.x) / 2;
    return `C ${cx} ${previous.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
  }).join(' ');
}

const areaPlugin = {
  id: 'detailArea',
  beforeDatasetsDraw(chart) {
    if (!chart.options.plugins.detailArea?.enabled) return;
    const { ctx, chartArea } = chart;
    const datasets = chart.data.datasets;
    if (datasets.length < 2) return;

    const metaA = chart.getDatasetMeta(0);
    const metaB = chart.getDatasetMeta(1);
    const dataA = datasets[0].data;
    const dataB = datasets[1].data;

    function finite(value) {
      return value !== null && Number.isFinite(value);
    }

    function cubic(a, b, c, d, t) {
      const inv = 1 - t;
      return inv * inv * inv * a + 3 * inv * inv * t * b + 3 * inv * t * t * c + t * t * t * d;
    }

    function pointAt(points, index, t) {
      const start = points[index];
      const end = points[index + 1];
      const c1x = Number.isFinite(start.cp2x) ? start.cp2x : start.x;
      const c1y = Number.isFinite(start.cp2y) ? start.cp2y : start.y;
      const c2x = Number.isFinite(end.cp1x) ? end.cp1x : end.x;
      const c2y = Number.isFinite(end.cp1y) ? end.cp1y : end.y;
      return {
        x: cubic(start.x, c1x, c2x, end.x, t),
        y: cubic(start.y, c1y, c2y, end.y, t)
      };
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    ctx.clip();

    for (let index = 0; index < dataA.length - 1; index += 1) {
      if (!finite(dataA[index]) || !finite(dataA[index + 1]) || !finite(dataB[index]) || !finite(dataB[index + 1])) continue;
      const steps = 18;
      for (let step = 0; step < steps; step += 1) {
        const t0 = step / steps;
        const t1 = (step + 1) / steps;
        const a0 = pointAt(metaA.data, index, t0);
        const a1 = pointAt(metaA.data, index, t1);
        const b0 = pointAt(metaB.data, index, t0);
        const b1 = pointAt(metaB.data, index, t1);
        const aMid = (a0.y + a1.y) / 2;
        const bMid = (b0.y + b1.y) / 2;
        const topIndex = aMid <= bMid ? 0 : 1;
        const top0 = topIndex === 0 ? a0 : b0;
        const top1 = topIndex === 0 ? a1 : b1;
        const bottom0 = topIndex === 0 ? b0 : a0;
        const bottom1 = topIndex === 0 ? b1 : a1;

        ctx.beginPath();
        ctx.moveTo(top0.x, top0.y);
        ctx.lineTo(top1.x, top1.y);
        ctx.lineTo(bottom1.x, bottom1.y);
        ctx.lineTo(bottom0.x, bottom0.y);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(DETAIL_COLORS[topIndex], .3);
        ctx.fill();
      }
    }
    ctx.restore();
  }
};

const detailLineOffsetPlugin = {
  id: 'detailLineOffset',
  beforeDatasetsDraw(chart) {
    const offsets = chart.options.plugins.detailLineOffset?.offsets || [];
    if (!offsets.some(Boolean)) return;

    chart.$detailLineOriginalY = offsets.map((offset, datasetIndex) => {
      if (!offset) return null;
      const points = chart.getDatasetMeta(datasetIndex).data;
      const originalY = points.map((point) => ({
        y: point.y,
        cp1y: point.cp1y,
        cp2y: point.cp2y
      }));
      points.forEach((point) => {
        ['y', 'cp1y', 'cp2y'].forEach((prop) => {
          if (Number.isFinite(point[prop])) point[prop] += offset;
        });
      });
      return originalY;
    });
  },
  afterDraw(chart) {
    const originalY = chart.$detailLineOriginalY;
    if (!originalY) return;

    originalY.forEach((positions, datasetIndex) => {
      if (!positions) return;
      const points = chart.getDatasetMeta(datasetIndex).data;
      positions.forEach((values, pointIndex) => {
        if (!points[pointIndex]) return;
        ['y', 'cp1y', 'cp2y'].forEach((prop) => {
          points[pointIndex][prop] = values[prop];
        });
      });
    });
    chart.$detailLineOriginalY = null;
  }
};

const selectedPointPulsePlugin = {
  id: 'selectedPointPulse',
  afterDatasetsDraw(chart) {
    if (!chart.options.plugins.selectedPointPulse?.enabled) return;
    const elapsed = performance.now() % 950;
    const wave = (Math.sin((elapsed / 950) * Math.PI * 2) + 1) / 2;
    const alpha = wave * .92;
    const { ctx } = chart;

    ctx.save();
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      const color = dataset.borderColor || '#3b82f6';
      meta.data.forEach((point, pointIndex) => {
        const pointRadius = Array.isArray(dataset.pointRadius) ? dataset.pointRadius[pointIndex] : dataset.pointRadius;
        if (!pointRadius) return;
        ctx.beginPath();
        ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, alpha);
        ctx.fill();
      });
    });
    ctx.restore();
  },
  afterRender(chart) {
    if (!chart.options.plugins.selectedPointPulse?.enabled) return;
    if (chart.$selectedPointPulseFrame) return;
    chart.$selectedPointPulseFrame = true;
    window.requestAnimationFrame(() => {
      chart.$selectedPointPulseFrame = false;
      chart.draw();
    });
  },
  afterDraw(chart) {
    if (!chart.options.plugins.selectedPointPulse?.enabled) return;
    if (chart.$selectedPointPulseFrame) return;
    chart.$selectedPointPulseFrame = true;
    window.requestAnimationFrame(() => {
      chart.$selectedPointPulseFrame = false;
      chart.draw();
    });
  }
};

Chart.register(detailLineOffsetPlugin, selectedPointPulsePlugin, areaPlugin);

function chartOptions(formatter, options = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 350 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      detailArea: { enabled: options.area === true },
      detailLineOffset: { offsets: options.lineOffsets || [] },
      selectedPointPulse: { enabled: options.pulsePoints === true }
    },
    scales: {
      x: {
        grid: { display: false, drawTicks: false },
        border: { display: false },
        ticks: { color: '#a8b2c4', font: { size: 11, family: 'DM Sans', weight: '700' }, maxRotation: 0, autoSkip: options.autoSkipX === false ? false : true }
      },
      y: {
        display: options.hideY !== true,
        beginAtZero: options.beginAtZero === true,
        min: options.beginAtZero === true ? 0 : undefined,
        grid: { display: false, drawTicks: false },
        border: { display: false },
        ticks: {
          color: '#8892a4',
          font: { size: 9, family: 'DM Sans' },
          callback: (value) => formatter(value),
          maxTicksLimit: options.yTicks || 4,
          count: options.yTicks || 4
        }
      }
    }
  };
}

function getValid(values) {
  return values.filter((value) => value !== null && Number.isFinite(value));
}

function yearsWithData() {
  return Object.keys(fatMensal).filter((ano) => getValid(fatMensal[ano] || []).length);
}

function recentYears(limit = 4) {
  return yearsWithData()
    .sort((a, b) => Number(b) - Number(a))
    .slice(0, limit);
}

function faturamentoColor(index) {
  const color = FATURAMENTO_COLORS[index % FATURAMENTO_COLORS.length];
  return { line: color, fill: hexToRgba(color, index === 0 ? .58 : .5) };
}

function hasMonthData(year, monthIndex) {
  const value = fatMensal[year]?.[monthIndex];
  return value !== null && Number.isFinite(value);
}

function availableMonthsForYear(year) {
  return MESES
    .map((month, index) => ({ month, index }))
    .filter(({ index }) => hasMonthData(year, index));
}

function defaultDetailPeriods() {
  const today = new Date();
  const currentYear = fatMensal[String(today.getFullYear())]
    ? String(today.getFullYear())
    : recentYears(1)[0];
  if (!currentYear) return [];

  const currentMonthIndex = fatMensal[String(today.getFullYear())]
    ? today.getMonth()
    : (fatMensal[currentYear] || [])
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => value !== null && Number.isFinite(value))
      .pop()?.index;

  if (currentMonthIndex === undefined) return [];

  let previousYear = Number(currentYear);
  let previousMonthIndex = currentMonthIndex - 1;
  if (previousMonthIndex < 0) {
    previousMonthIndex = 11;
    previousYear -= 1;
  }

  return [
    `${MESES[previousMonthIndex]}/${String(previousYear).slice(-2)}`,
    `${MESES[currentMonthIndex]}/${currentYear.slice(-2)}`
  ];
}

function makeLegend(id, items) {
  const holder = document.getElementById(id);
  holder.innerHTML = items.map((item) => (
    `<div class="legend-item"><div class="legend-dot" style="background:${item.color}"></div>${item.label}</div>`
  )).join('');
}

function setToggle(button) {
  button.closest('.toggle-group').querySelectorAll('button').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
}

function barDataset(label, data, color, fill) {
  return {
    label,
    data,
    backgroundColor: fill,
    borderColor: color,
    borderWidth: 1,
    borderRadius: 3,
    borderSkipped: false,
    barPercentage: .68,
    categoryPercentage: .76
  };
}

function lineDataset(label, data, color, options = {}) {
  const pointRadius = data.map((_, index) => (options.selectedMonthIndex === index ? 3.6 : 0));
  const pointHoverRadius = data.map((_, index) => (options.selectedMonthIndex === index ? 4.8 : 0));
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: options.fillArea ? hexToRgba(color, .3) : 'transparent',
    borderWidth: 2.2,
    pointBackgroundColor: options.hidePoints ? 'rgba(0,0,0,0)' : color,
    pointBorderColor: options.hidePoints ? 'rgba(0,0,0,0)' : color,
    pointBorderWidth: options.hidePoints ? pointRadius.map(() => 0) : 1,
    pointRadius: options.hidePoints ? pointRadius : 3.4,
    pointHoverRadius: options.hidePoints ? pointHoverRadius : 4.8,
    pointHitRadius: options.hidePoints ? pointRadius.map((radius) => (radius ? 8 : 0)) : 8,
    tension: .35,
    fill: options.fillArea ? 'origin' : false,
    spanGaps: false
  };
}

function renderFaturamento() {
  if (chartFaturamento) chartFaturamento.destroy();
  const ctx = document.getElementById('chartFaturamento').getContext('2d');
  let labels;
  let datasets;
  let visibleYears;

  if (faturamentoMode === 'anos') {
    visibleYears = yearsWithData().sort((a, b) => Number(a) - Number(b));
    labels = visibleYears;
    const values = visibleYears.map((ano) => +(getValid(fatMensal[ano]).reduce((sum, value) => sum + value, 0) / 1000).toFixed(2));
    datasets = [barDataset('Faturamento', values, '#3b82f6', 'rgba(59,130,246,.34)')];
    datasets[0].backgroundColor = visibleYears.map((_, index) => faturamentoColor(index).fill);
    datasets[0].borderColor = visibleYears.map((_, index) => faturamentoColor(index).line);
  } else {
    labels = MESES;
    visibleYears = recentYears(4);
    datasets = visibleYears.map((ano, index) => {
      const color = faturamentoColor(index);
      return barDataset(ano, fatMensal[ano], color.line, color.fill);
    });
  }

  chartFaturamento = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: chartOptions((value) => `R$${value}M`, { hideY: true, autoSkipX: false })
  });
  const legendYears = faturamentoMode === 'anos' ? yearsWithData().sort((a, b) => Number(a) - Number(b)) : recentYears(4);
  makeLegend('leg-faturamento', legendYears.map((ano, index) => ({ label: ano, color: faturamentoColor(index).line })));
  bindFaturamentoHover(visibleYears);
}

function bindFaturamentoHover(visibleYears) {
  const canvas = document.getElementById('chartFaturamento');
  const wrap = canvas.closest('.chart-wrap');
  const card = canvas.closest('.card-faturamento');
  let tooltip = wrap.querySelector('.faturamento-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'faturamento-tooltip';
    wrap.appendChild(tooltip);
  }
  let yearPanel = card.querySelector('.faturamento-year-panel');
  if (!yearPanel) {
    yearPanel = document.createElement('div');
    yearPanel.className = 'faturamento-year-panel';
    card.appendChild(yearPanel);
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  function resizeFaturamentoChart() {
    window.requestAnimationFrame(() => {
      chartFaturamento?.resize();
      chartFaturamento?.update('none');
    });
    window.setTimeout(() => {
      chartFaturamento?.resize();
      chartFaturamento?.update('none');
    }, 320);
  }

  function hideYearPanel() {
    card.classList.remove('faturamento-year-focus');
    yearPanel.classList.remove('visible');
    if (faturamentoMode === 'anos' && chartFaturamento?.data?.datasets?.[0]) {
      chartFaturamento.data.datasets[0].barPercentage = .68;
      chartFaturamento.data.datasets[0].categoryPercentage = .76;
      chartFaturamento.update();
      resizeFaturamentoChart();
    }
  }

  function showYearPanel() {
    if (faturamentoMode !== 'anos') return;
    if (yearPanel.classList.contains('visible')) return;
    card.classList.add('faturamento-year-focus');
    if (chartFaturamento?.data?.datasets?.[0]) {
      chartFaturamento.data.datasets[0].barPercentage = .92;
      chartFaturamento.data.datasets[0].categoryPercentage = .94;
      chartFaturamento.update();
      resizeFaturamentoChart();
    }
    const rows = visibleYears.map((ano, index) => {
      const fatValue = getValid(fatMensal[ano] || []).reduce((sum, value) => sum + value * 1000, 0);
      const metaValue = getValid(metaMensal[ano] || []).reduce((sum, value) => sum + value * 10000, 0);
      const done = fatValue >= metaValue;
      const color = faturamentoColor(index).line;
      return `
        <div class="fat-tip-row">
          <span class="fat-tip-year" style="color:${color}">${ano}</span>
          <span>${BRL.format(fatValue)}</span>
          <span>${BRL.format(metaValue)}</span>
          <span>${percent(fatValue, metaValue)}</span>
          <span><span class="status-icon ${done ? 'ok' : 'bad'}">${done ? '\u2713' : '\u00d7'}</span></span>
        </div>`;
    }).join('');

    yearPanel.innerHTML = `
      <div class="fat-tip-title">ANOS</div>
      <div class="fat-tip-head">
        <span>Ano</span>
        <span>Faturamento</span>
        <span>Meta</span>
        <span>Alcance</span>
        <span>OK</span>
      </div>
      ${rows}`;
    yearPanel.classList.add('visible');
  }

  if (faturamentoMode !== 'anos') hideYearPanel();

  function monthIndexFromBarGap(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const chartArea = chartFaturamento.chartArea;
    if (!chartArea || y < chartArea.top || y > chartArea.bottom) return -1;

    for (let monthIndex = 0; monthIndex < MESES.length; monthIndex += 1) {
      const bars = chartFaturamento.data.datasets
        .map((_, datasetIndex) => chartFaturamento.getDatasetMeta(datasetIndex).data[monthIndex])
        .filter((bar) => bar && Number.isFinite(bar.x) && Number.isFinite(bar.width))
        .map((bar) => ({
          left: bar.x - bar.width / 2,
          right: bar.x + bar.width / 2,
          top: Math.min(bar.y, bar.base),
          bottom: Math.max(bar.y, bar.base)
        }))
        .sort((a, b) => a.left - b.left);

      for (let index = 0; index < bars.length - 1; index += 1) {
        const current = bars[index];
        const next = bars[index + 1];
        const insideHorizontalGap = x > current.right && x < next.left;
        const insideVerticalBand = y >= Math.min(current.top, next.top) && y <= Math.max(current.bottom, next.bottom);
        if (insideHorizontalGap && insideVerticalBand) return monthIndex;
      }
    }

    return -1;
  }

  canvas.onmouseleave = hideTooltip;
  card.onmouseenter = () => {
    hideTooltip();
    showYearPanel();
  };
  card.onmousemove = () => {
    if (faturamentoMode === 'anos') {
      hideTooltip();
      showYearPanel();
    }
  };
  card.onmouseleave = () => {
    hideTooltip();
    hideYearPanel();
  };
  canvas.onmousemove = (event) => {
    if (faturamentoMode !== 'meses' || !chartFaturamento) {
      hideTooltip();
      return;
    }

    const items = chartFaturamento.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
    const monthIndex = items.length ? items[0].index : monthIndexFromBarGap(event);
    if (monthIndex < 0) {
      hideTooltip();
      return;
    }

    const monthName = MESES_COMPLETOS[monthIndex].toUpperCase();
    const rows = visibleYears.map((ano, index) => {
      const fat = fatMensal[ano]?.[monthIndex];
      const meta = metaMensal[ano]?.[monthIndex];
      const color = faturamentoColor(index).line;
      const hasData = fat !== null && Number.isFinite(fat) && meta !== null && Number.isFinite(meta);
      const fatValue = hasData ? fat * 1000 : 0;
      const metaValue = hasData ? meta * 10000 : 0;
      const done = hasData && fatValue >= metaValue;
      return `
        <div class="fat-tip-row">
          <span class="fat-tip-year" style="color:${color}">${ano}</span>
          <span>${hasData ? BRL.format(fatValue) : '-'}</span>
          <span>${hasData ? BRL.format(metaValue) : '-'}</span>
          <span>${hasData ? percent(fatValue, metaValue) : '-'}</span>
          <span><span class="status-icon ${done ? 'ok' : 'bad'}">${done ? '\u2713' : '\u00d7'}</span></span>
        </div>`;
    }).join('');

    tooltip.innerHTML = `
      <div class="fat-tip-title">${monthName}</div>
      <div class="fat-tip-head">
        <span>Ano</span>
        <span>Faturamento</span>
        <span>Meta</span>
        <span>Alcance</span>
        <span>OK</span>
      </div>
      ${rows}`;

    const wrapBox = wrap.getBoundingClientRect();
    const tipWidth = 390;
    const tipHeight = 178;
    let left = event.clientX - wrapBox.left + 16;
    let top = event.clientY - wrapBox.top - 18;
    if (left + tipWidth > wrapBox.width - 8) left = event.clientX - wrapBox.left - tipWidth - 16;
    if (left < 8) left = 8;
    if (top + tipHeight > wrapBox.height - 8) top = wrapBox.height - tipHeight - 8;
    if (top < 8) top = 8;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add('visible');
  };
}

function renderConversao() {
  if (chartConversao) chartConversao.destroy();
  const ctx = document.getElementById('chartConversao').getContext('2d');
  let labels;
  let datasets;

  if (conversaoMode === 'anos') {
    labels = ANOS;
    const values = ANOS.map((ano) => {
      const valid = getValid(conversaoMensal[ano]);
      return +(valid.reduce((sum, value) => sum + value, 0) / valid.length).toFixed(1);
    });
    datasets = [barDataset('Conversão', values, '#60a5fa', 'rgba(96,165,250,.35)')];
    datasets[0].backgroundColor = ANOS.map((ano) => COLORS[ano].fill);
    datasets[0].borderColor = ANOS.map((ano) => COLORS[ano].line);
  } else {
    labels = MESES;
    datasets = ANOS.map((ano) => lineDataset(ano, conversaoMensal[ano], COLORS[ano].line));
  }

  chartConversao = new Chart(ctx, {
    type: conversaoMode === 'anos' ? 'bar' : 'line',
    data: { labels, datasets },
    options: chartOptions((value) => `${value}%`, { yTicks: 4 })
  });
  makeLegend('leg-conversao', ANOS.map((ano) => ({ label: ano, color: COLORS[ano].line })));
}

function conversionYearsWithData() {
  return Object.keys(conversaoMensal).filter((ano) => getValid(conversaoMensal[ano] || []).length);
}

function ringSVG(value, color, size = 42) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  const radius = size === 42 ? 16 : 21;
  const stroke = size === 42 ? 5 : 6;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;
  const label = Number.isFinite(value) ? `${Math.round(value)}%` : '--';
  return `
    <svg class="conversion-ring-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="rgba(59,130,246,.1)" stroke-width="${stroke}"/>
      <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${color}" stroke-width="${stroke}"
        stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
        transform="rotate(-90 ${center} ${center})"/>
      <text x="${center}" y="${center + 4}" text-anchor="middle" fill="${color}" font-size="${size === 42 ? 8.5 : 11}" font-weight="700" font-family="DM Sans, sans-serif">${label}</text>
    </svg>`;
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 43758.5453123;
  return x - Math.floor(x);
}

function smoothNoise2D(x, y, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const sx = xf * xf * (3 - 2 * xf);
  const sy = yf * yf * (3 - 2 * yf);
  const h = (ix, iy) => seededRandom(ix * 127.1 + iy * 311.7 + seed * 74.7) * 2 - 1;
  const a = h(xi, yi);
  const b = h(xi + 1, yi);
  const c = h(xi, yi + 1);
  const d = h(xi + 1, yi + 1);
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
}

function createSeededRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createConversionWaterSim(stage, canvas, index) {
  const ctx = canvas.getContext('2d');
  const pointCount = 96;
  const pos = new Float32Array(pointCount);
  const vel = new Float32Array(pointCount);
  const acc = new Float32Array(pointCount);
  const leftDelta = new Float32Array(pointCount);
  const rightDelta = new Float32Array(pointCount);
  const seed = index * 1337 + 42;
  const rand = createSeededRng((index + 1) * 987654321);
  const layers = [
    { sx: .016, st: .18, amp: 3.1, to: seededRandom(seed + 1) * 100 },
    { sx: .046, st: .31, amp: 1.65, to: seededRandom(seed + 2) * 100 },
    { sx: .12, st: .58, amp: .68, to: seededRandom(seed + 3) * 100 },
    { sx: .26, st: .95, amp: .28, to: seededRandom(seed + 4) * 100 },
    { sx: .52, st: 1.5, amp: .12, to: seededRandom(seed + 5) * 100 }
  ];
  let width = 180;
  let height = 56;
  let dpr = 1;
  let nextDisturbance = performance.now() + rand() * 1100 + 760;

  function resize() {
    const rect = stage.getBoundingClientRect();
    const nextWidth = Math.max(80, Math.round(rect.width));
    const nextHeight = Math.max(36, Math.round(rect.height));
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
    if (width === nextWidth && height === nextHeight && dpr === nextDpr) return;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function disturb(now) {
    if (now < nextDisturbance) return;
    const ripples = rand() > .84 ? 2 : 1;
    for (let ripple = 0; ripple < ripples; ripple += 1) {
      const center = Math.floor(rand() * pointCount);
      const force = (rand() - .5) * 3.2;
      const radius = Math.floor(rand() * 9) + 8;
      for (let offset = -radius; offset <= radius; offset += 1) {
        const j = center + offset;
        if (j < 0 || j >= pointCount) continue;
        const envelope = Math.exp(-(offset * offset) / (radius * radius * .9));
        vel[j] += force * envelope;
      }
    }
    nextDisturbance = now + rand() * 1200 + 680;
  }

  function draw(now) {
    resize();
    const t = now * .001;
    const spring = .018;
    const damping = .966;
    const spread = .118;
    const iterations = 12;
    const heightScale = Math.max(.46, Math.min(.86, height / 112));

    for (let j = 0; j < pointCount; j += 1) {
      let target = 0;
      layers.forEach((layer) => {
        target += layer.amp * heightScale * smoothNoise2D(j * layer.sx + layer.to, t * layer.st + layer.to * .3, seed);
      });
      acc[j] = -spring * (pos[j] - target);
    }

    for (let j = 0; j < pointCount; j += 1) {
      vel[j] = vel[j] * damping + acc[j];
      pos[j] += vel[j];
    }

    for (let pass = 0; pass < iterations; pass += 1) {
      leftDelta.fill(0);
      rightDelta.fill(0);
      for (let j = 0; j < pointCount; j += 1) {
        if (j > 0) {
          leftDelta[j] = spread * (pos[j] - pos[j - 1]);
          vel[j - 1] += leftDelta[j];
        }
        if (j < pointCount - 1) {
          rightDelta[j] = spread * (pos[j] - pos[j + 1]);
          vel[j + 1] += rightDelta[j];
        }
      }
      for (let j = 0; j < pointCount; j += 1) {
        if (j > 0) pos[j - 1] += leftDelta[j];
        if (j < pointCount - 1) pos[j + 1] += rightDelta[j];
      }
    }

    disturb(now);
    ctx.clearRect(0, 0, width, height);
    const restY = Math.max(8, Math.min(16, height * .18));
    const points = [];
    for (let j = 0; j < pointCount; j += 1) {
      points.push({
        x: (j / (pointCount - 1)) * width,
        y: Math.max(3, Math.min(height - 8, restY + pos[j]))
      });
    }

    const base = stage.dataset.color || '#092c66';
    const accent = stage.dataset.accent || '#1390ad';
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${accent}e6`);
    gradient.addColorStop(.52, `${base}d1`);
    gradient.addColorStop(1, `${base}c7`);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let j = 1; j < pointCount - 1; j += 1) {
      const midX = (points[j].x + points[j + 1].x) * .5;
      const midY = (points[j].y + points[j + 1].y) * .5;
      ctx.quadraticCurveTo(points[j].x, points[j].y, midX, midY);
    }
    ctx.lineTo(points[pointCount - 1].x, points[pointCount - 1].y);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let j = 1; j < pointCount - 1; j += 1) {
      const midX = (points[j].x + points[j + 1].x) * .5;
      const midY = (points[j].y + points[j + 1].y) * .5;
      ctx.quadraticCurveTo(points[j].x, points[j].y, midX, midY);
    }
    ctx.lineTo(points[pointCount - 1].x, points[pointCount - 1].y);
    ctx.strokeStyle = 'rgba(147,197,253,.32)';
    ctx.lineWidth = 1.25;
    ctx.stroke();
    ctx.restore();
  }

  return { step: draw };
}

function initConversionWater() {
  if (conversionWaterController) cancelAnimationFrame(conversionWaterController.frame);
  const stages = [...document.querySelectorAll('.conversion-stage')];
  const simulations = stages.map((stage, index) => createConversionWaterSim(stage, stage.querySelector('.conversion-stage-water'), index));
  function animate(now) {
    simulations.forEach((sim) => sim.step(now));
    conversionWaterController.frame = requestAnimationFrame(animate);
  }
  conversionWaterController = { frame: requestAnimationFrame(animate) };
}

function renderConversao() {
  if (chartConversao) {
    chartConversao.destroy();
    chartConversao = null;
  }

  const holder = document.getElementById('conversionRingList');
  if (!holder) return;

  const years = conversionYearsWithData().sort((a, b) => Number(a) - Number(b));
  const latestYear = [...years].sort((a, b) => Number(b) - Number(a))[0];

  let nfePct;
  let label;
  if (conversaoMode === 'anos') {
    const valid = getValid(conversaoMensal[latestYear] || []);
    nfePct = valid.length ? +(valid.reduce((sum, item) => sum + item, 0) / valid.length).toFixed(1) : 0;
    label = latestYear || '-';
  } else {
    const latestMonthIndex = [...(conversaoMensal[latestYear] || [])]
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => value !== null && Number.isFinite(value))
      .pop()?.index ?? 0;
    nfePct = conversaoMensal[latestYear]?.[latestMonthIndex] || 0;
    label = `${MESES[latestMonthIndex]}/${String(latestYear || '').slice(-2)}`;
  }

  const quotedPct = Math.min(94, Math.max(nfePct + 24, Math.round(nfePct * 1.42)));
  const stages = [
    { name: 'Conversados', pct: 100, width: 92, level: 1, color: '#092c66' },
    { name: 'Orçaram', pct: quotedPct, width: Math.max(58, quotedPct * .82), level: 2, color: '#1390ad' },
    { name: 'Geraram NFE', pct: nfePct, width: Math.max(42, nfePct * 1.05), level: 3, color: '#11a27b' }
  ];

  holder.className = 'conversion-pyramid';
  holder.innerHTML = `
    ${stages.map((stage) => `
      <div class="conversion-stage" data-level="${stage.level}" style="--w:${stage.width}%;--drop:${stage.color}">
        <div class="conversion-stage-content">
          <span class="conversion-stage-name">${stage.name}</span>
          <span class="conversion-stage-pct">${Math.round(stage.pct)}%</span>
        </div>
      </div>
    `).join('')}
    <span class="conversion-drop d1" style="--drop:${stages[0].color}"></span>
    <span class="conversion-drop d2" style="--drop:${stages[1].color}"></span>
    <span class="conversion-drop d3" style="--drop:${stages[2].color}"></span>
    <div class="conversion-floor"></div>
    <div class="conversion-floor-label">Perdidas · ${label}</div>
  `;
}

function renderConversao() {
  if (chartConversao) {
    chartConversao.destroy();
    chartConversao = null;
  }

  const holder = document.getElementById('conversionRingList');
  if (!holder) return;

  const years = conversionYearsWithData().sort((a, b) => Number(a) - Number(b));
  const latestYear = [...years].sort((a, b) => Number(b) - Number(a))[0];

  let nfePct;
  let label;
  if (conversaoMode === 'anos') {
    const valid = getValid(conversaoMensal[latestYear] || []);
    nfePct = valid.length ? +(valid.reduce((sum, item) => sum + item, 0) / valid.length).toFixed(1) : 0;
    label = latestYear || '-';
  } else {
    const latestMonthIndex = [...(conversaoMensal[latestYear] || [])]
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => value !== null && Number.isFinite(value))
      .pop()?.index ?? 0;
    nfePct = conversaoMensal[latestYear]?.[latestMonthIndex] || 0;
    label = `${MESES[latestMonthIndex]}/${String(latestYear || '').slice(-2)}`;
  }

  const quotedPct = Math.min(94, Math.max(nfePct + 24, Math.round(nfePct * 1.42)));
  const stages = [
    { name: 'Conversados', pct: 100, width: 92, level: 1, color: '#3d0a5d', accent: '#4912b1', dropX: 47 },
    { name: 'Orçaram', pct: quotedPct, width: 74, level: 2, color: '#092c66', accent: '#1390ad', dropX: 54 },
    { name: 'Geraram NFE', pct: nfePct, width: 56, level: 3, color: '#1390ad', accent: '#11a27b', dropX: 50 }
  ];

  holder.className = 'conversion-pyramid';
  holder.innerHTML = `
    ${stages.map((stage) => `
      <div class="conversion-level" style="--drop-x:${stage.dropX}%">
        <div class="conversion-stage" data-level="${stage.level}" data-color="${stage.color}" data-accent="${stage.accent}" style="--w:${stage.width}%;--stage:${stage.color};--drop:${stage.color}">
          <canvas class="conversion-stage-water" aria-hidden="true"></canvas>
          <div class="conversion-stage-content">
            <span class="conversion-stage-name">${stage.name}</span>
            <span class="conversion-stage-pct">${Math.round(stage.pct)}%</span>
          </div>
        </div>
        <span class="conversion-drop d${stage.level}" style="--drop:${stage.level === 3 ? stage.accent : stage.color}"></span>
      </div>
    `).join('')}
    <div class="conversion-floor"></div>
    <div class="conversion-floor-label">Perdidas · ${label}</div>
  `;
  initConversionWater();
}

function renderConversao() {
  if (chartConversao) {
    chartConversao.destroy();
    chartConversao = null;
  }

  const holder = document.getElementById('conversionRingList');
  if (!holder) return;

  const years = conversionYearsWithData().sort((a, b) => Number(a) - Number(b));
  const latestYear = [...years].sort((a, b) => Number(b) - Number(a))[0];
  const currentCalendarYear = String(new Date().getFullYear());
  const activeYear = conversaoMensal[currentCalendarYear] ? currentCalendarYear : latestYear;
  const yearValues = conversaoMensal[activeYear] || [];
  const latestMonthWithData = yearValues.reduce((last, value, index) => (
    value !== null && Number.isFinite(value) ? index : last
  ), 0);

  if (conversaoSelectedMonthIndex === null || conversaoSelectedMonthIndex < 0 || conversaoSelectedMonthIndex > 11) {
    conversaoSelectedMonthIndex = latestMonthWithData;
  }

  const validYearValues = getValid(yearValues);
  const hasConversionData = conversaoMode === 'anos'
    ? validYearValues.length > 0
    : Number.isFinite(yearValues[conversaoSelectedMonthIndex]);
  const nfePct = hasConversionData
    ? (conversaoMode === 'anos'
      ? +(validYearValues.reduce((sum, value) => sum + value, 0) / validYearValues.length).toFixed(1)
      : yearValues[conversaoSelectedMonthIndex])
    : 0;
  const quotedPct = hasConversionData ? Math.min(94, Math.max(nfePct + 24, Math.round(nfePct * 1.42))) : 0;
  const lossPct = hasConversionData ? Math.max(0, Math.round(100 - nfePct)) : 0;
  const baseClients = hasConversionData
    ? (conversaoMode === 'anos'
      ? Math.round(2780 + (Number(activeYear || 0) - 2023) * 235)
      : Math.round(540 + conversaoSelectedMonthIndex * 18 + nfePct * 3))
    : 0;
  const quotedClients = Math.round(baseClients * (quotedPct / 100));
  const nfeClients = Math.round(baseClients * (nfePct / 100));
  const lostSales = Math.max(0, baseClients - nfeClients);
  const conversionRate = baseClients ? (nfeClients / baseClients) * 100 : 0;
  const conversionRateRounded = Math.round(conversionRate * 10) / 10;
  const conversionRateLabel = Number.isInteger(conversionRateRounded)
    ? `${conversionRateRounded}%`
    : `${conversionRateRounded.toFixed(1).replace('.', ',')}%`;
  const stages = [
    { name: 'Conversados', pct: hasConversionData ? 100 : 0, value: baseClients, color: '#420c99' },
    { name: 'Orçaram', pct: quotedPct, value: quotedClients, color: '#2c0b99' },
    { name: 'Geraram NFE', pct: nfePct, value: nfeClients, color: '#0a8699' },
    { name: 'Vendas Perdidas', pct: lossPct, value: lostSales, color: '#0a997d' }
  ];
  const funnelWidth = 210;
  const funnelHeight = 214;
  const layerGap = 10;
  const layerHeight = (funnelHeight - layerGap * (stages.length - 1)) / stages.length;
  const funnelSvg = stages.map((stage, index) => {
    const layerDirection = Math.random() > .5 ? 1 : -1;
    const layerSway = 2.8 + Math.random() * 4.2;
    const layerStart = (-layerDirection * layerSway).toFixed(1);
    const layerEnd = (layerDirection * layerSway).toFixed(1);
    const layerDuration = (4.8 + Math.random() * 2.7).toFixed(2);
    const layerDelay = (-Math.random() * 4.4).toFixed(2);
    const hoverLayerY = ((index - (stages.length - 1) / 2) * 6.5).toFixed(1);
    const minWidthRatio = .14;
    const taperRatio = 1 - minWidthRatio;
    const topWidth = (1 - index / stages.length) * funnelWidth * taperRatio + funnelWidth * minWidthRatio;
    const bottomWidth = (1 - (index + 1) / stages.length) * funnelWidth * taperRatio + funnelWidth * minWidthRatio;
    const y = index * (layerHeight + layerGap);
    const xTop = (funnelWidth - topWidth) / 2;
    const xBottom = (funnelWidth - bottomWidth) / 2;
    return `
      <g class="conversion-funnel-hover-layer" style="--hover-layer-y:${hoverLayerY}px">
        <g class="conversion-funnel-layer" style="--layer-start:${layerStart}px;--layer-end:${layerEnd}px;--layer-duration:${layerDuration}s;--layer-delay:${layerDelay}s">
          <polygon points="${xTop},${y} ${xTop + topWidth},${y} ${xBottom + bottomWidth},${y + layerHeight} ${xBottom},${y + layerHeight}"
            fill="${stage.color}" opacity="${(.94 - index * .06).toFixed(2)}"></polygon>
          <text x="${funnelWidth / 2}" y="${y + layerHeight / 2}" text-anchor="middle" class="conversion-funnel-value">${stage.value.toLocaleString('pt-BR')}</text>
          <text x="${funnelWidth / 2}" y="${y + layerHeight / 2 + 15}" text-anchor="middle" class="conversion-funnel-pct">${stage.pct.toFixed(1).replace('.', ',')}%</text>
        </g>
      </g>
    `;
  }).join('');

  holder.className = `conversion-pyramid ${conversaoMode === 'anos' ? 'year-mode' : 'month-mode'}`;
  holder.innerHTML = `
    <div class="conversion-months" aria-label="Selecionar mês da conversão">
      ${MESES.map((month, index) => `
        <button type="button" class="${index === conversaoSelectedMonthIndex ? 'active' : ''}${Number.isFinite(yearValues[index]) ? '' : ' is-empty'}" data-conversion-month="${index}">
          ${month}
        </button>
      `).join('')}
    </div>
    <div class="conversion-visual">
      <div class="conversion-funnel-wrap">
        <div class="conversion-funnel-legend">
          ${stages.map((stage, index) => `
            <div class="conversion-funnel-item" style="--legend-hover-x:202px;--legend-hover-y:${(index * (layerHeight + layerGap - 25) - 62 + ((index - (stages.length - 1) / 2) * 6.5)).toFixed(1)}px">
              <span class="conversion-funnel-dot" style="background:${stage.color}"></span>
              <span class="conversion-funnel-name">${stage.name}</span>
              <strong>${stage.value.toLocaleString('pt-BR')}</strong>
              <em>${stage.pct.toFixed(1).replace('.', ',')}%</em>
            </div>
          `).join('')}
        </div>
        <svg class="conversion-funnel-svg" width="${funnelWidth}" height="${funnelHeight}" viewBox="0 0 ${funnelWidth} ${funnelHeight}" aria-hidden="true">
          ${funnelSvg}
        </svg>
        <div class="conversion-rate-panel">
          <span>Conversão</span>
          <strong>${conversionRateLabel}</strong>
        </div>
      </div>
    </div>
  `;
  if (conversionWaterController) {
    cancelAnimationFrame(conversionWaterController.frame);
    conversionWaterController = null;
  }
  bindConversionFunnelHover(holder);
}

function bindConversionFunnelHover(holder) {
  const wrap = holder?.querySelector('.conversion-funnel-wrap');
  const svg = wrap?.querySelector('.conversion-funnel-svg');
  if (!wrap || !svg) return;

  svg.addEventListener('pointerenter', () => {
    wrap.classList.add('is-graph-hover');
  });
  svg.addEventListener('pointerleave', () => {
    wrap.classList.remove('is-graph-hover');
  });
}

function periodToYearMonth(period) {
  const month = period.slice(0, 3);
  const year = `20${period.slice(-2)}`;
  return { month, year, monthIndex: MESES.indexOf(month) };
}

function renderPickerMenu() {
  const menu = document.getElementById('comparePickerMenu');
  const button = document.getElementById('comparePickerButton');
  if (pickerStage === 'year') {
    const years = yearsWithData().sort((a, b) => Number(b) - Number(a));
    menu.innerHTML = (years.length ? years : ANOS)
      .map((ano) => `<button type="button" data-picker-year="${ano}">${ano}</button>`)
      .join('');
    button.textContent = 'Selecionar ano';
    return;
  }
  const availableMonths = availableMonthsForYear(pickerYear);
  menu.innerHTML = availableMonths.length
    ? availableMonths.map(({ month }) => `<button type="button" data-picker-month="${month}">${month} ${pickerYear}</button>`).join('')
    : '<button type="button" disabled>Nenhum mês</button>';
  button.textContent = 'Selecionar mês';
}

function openPicker() {
  renderPickerMenu();
  document.getElementById('comparePicker').classList.add('open');
}

function closePicker() {
  document.getElementById('comparePicker').classList.remove('open');
}

function resetPicker() {
  pickerStage = 'year';
  pickerYear = '';
  renderPickerMenu();
}

function addSelectedPeriod(period) {
  const existingIndex = selectedItems.indexOf(period);
  if (existingIndex > -1) selectedItems.splice(existingIndex, 1);
  if (selectedItems.length >= 2) selectedItems.shift();
  selectedItems.push(period);
  renderSelectedPeriods();
  renderDetalhado();
}

function renderSelectedPeriods() {
  document.getElementById('selectedPeriods').innerHTML = selectedItems.map((period) => `
    <div class="selected-period">
      ${period}
      <button type="button" data-remove-period="${period}" aria-label="Remover ${period}">×</button>
    </div>
  `).join('');
}

function getCompareSeries(period) {
  const { year } = periodToYearMonth(period);
  return fatMensal[year] || [];
}

function metaForMonth(year, monthIndex) {
  return metaMensal[year]?.[monthIndex] ?? 0;
}

function monthData(period) {
  const { year, monthIndex } = periodToYearMonth(period);
  const fat = fatMensal[year]?.[monthIndex] || 0;
  const meta = metaForMonth(year, monthIndex);
  const base = compareData[period] || {};
  const fatValue = fat * 1000;
  const metaValue = meta * 10000;
  const clientCount = base.cli || Math.round(30 + monthIndex * 2 + (Number(year) - 2023) * 3);
  return {
    fat: fatValue,
    meta: metaValue,
    done: fatValue >= metaValue,
    tkt: (base.tkt || Math.round(235 + monthIndex * 5 + (Number(year) - 2023) * 8)) * 10,
    cli: clientCount,
    new: Math.max(4, Math.round(clientCount * .28 + monthIndex)),
    lost: Math.max(1, Math.round(18 - clientCount * .12 + monthIndex * .7)),
    nfe: base.nfe || Math.round(52 + monthIndex * 3 + (Number(year) - 2023) * 6)
  };
}

function updateInfoPanel(a, b) {
  const da = monthData(a);
  const db = monthData(b);
  const leftHead = document.getElementById('ih1');
  const rightHead = document.getElementById('ih2');
  leftHead.textContent = a;
  rightHead.textContent = b;
  leftHead.style.color = DETAIL_COLORS[0];
  rightHead.style.color = DETAIL_COLORS[1];

  function paintPair(key, va, vb, fmt) {
    const left = document.getElementById(`iv-${key}1`);
    const right = document.getElementById(`iv-${key}2`);
    left.textContent = fmt(va);
    right.textContent = fmt(vb);
    left.style.color = DETAIL_COLORS[0];
    right.style.color = DETAIL_COLORS[1];
  }

  function paintDone(key, valueA, valueB) {
    const left = document.getElementById(`iv-${key}1`);
    const right = document.getElementById(`iv-${key}2`);
    left.innerHTML = `<span class="status-icon ${valueA ? 'ok' : 'bad'}">${valueA ? '✓' : '×'}</span>`;
    right.innerHTML = `<span class="status-icon ${valueB ? 'ok' : 'bad'}">${valueB ? '✓' : '×'}</span>`;
    left.querySelector('.status-icon').textContent = valueA ? '\u2713' : '\u00d7';
    right.querySelector('.status-icon').textContent = valueB ? '\u2713' : '\u00d7';
    left.style.color = '';
    right.style.color = '';
  }

  const moneyFormatter = summaryExpanded ? fullMoney : compactMoney;

  paintPair('fat', da.fat, db.fat, moneyFormatter);
  paintPair('meta', da.meta, db.meta, moneyFormatter);
  paintDone('done', da.done, db.done);
  paintPair('tkt', da.tkt, db.tkt, moneyFormatter);
  paintPair('cli', da.cli, db.cli, (value) => value);
  paintPair('new', da.new, db.new, (value) => value);
  paintPair('lost', da.lost, db.lost, (value) => value);
  paintPair('nfe', da.nfe, db.nfe, (value) => value);
}

function clearInfoPanelValues() {
  const leftHead = document.getElementById('ih1');
  const rightHead = document.getElementById('ih2');
  if (leftHead) {
    leftHead.textContent = '-';
    leftHead.style.color = '';
  }
  if (rightHead) {
    rightHead.textContent = '-';
    rightHead.style.color = '';
  }

  ['fat', 'meta', 'done', 'tkt', 'cli', 'new', 'lost', 'nfe'].forEach((key) => {
    [1, 2].forEach((index) => {
      const field = document.getElementById(`iv-${key}${index}`);
      if (!field) return;
      field.textContent = '0';
      field.style.color = '';
    });
  });
}

function renderDetalhado() {
  if (chartDetalhado) chartDetalhado.destroy();
  if (selectedItems.length < 2) {
    makeLegend('leg-detalhado', []);
    clearInfoPanelValues();
    return;
  }

  const ctx = document.getElementById('chartDetalhado').getContext('2d');
  const [a, b] = selectedItems;
  const periodA = periodToYearMonth(a);
  const periodB = periodToYearMonth(b);
  const sameYear = periodA.year === periodB.year;
  chartDetalhado = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MESES,
      datasets: [
        lineDataset(a, getCompareSeries(a), DETAIL_COLORS[0], { hidePoints: true, selectedMonthIndex: periodA.monthIndex }),
        lineDataset(b, getCompareSeries(b), DETAIL_COLORS[1], { hidePoints: true, selectedMonthIndex: periodB.monthIndex })
      ]
    },
    options: chartOptions((value) => `R$${value}M`, {
      yTicks: 4,
      beginAtZero: true,
      hideY: true,
      area: true,
      lineOffsets: sameYear ? [0, 17] : [],
      pulsePoints: true
    })
  });
  makeLegend('leg-detalhado', [
    { label: a, color: DETAIL_COLORS[0] },
    { label: b, color: DETAIL_COLORS[1] }
  ]);
  updateInfoPanel(a, b);
}

function average(values) {
  const valid = values.filter((value) => value !== null && Number.isFinite(value) && value > 0);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function projectionReferenceYears(year) {
  return yearsWithData()
    .filter((item) => Number(item) < Number(year))
    .sort((a, b) => Number(b) - Number(a))
    .slice(0, 3);
}

function projectedMonthValue(year, monthIndex, realValues) {
  const referenceYears = projectionReferenceYears(year);
  const sameMonthHistory = referenceYears
    .map((item) => fatMensal[item]?.[monthIndex])
    .filter((value) => value !== null && Number.isFinite(value))
    .map((value) => value * 1000);
  const currentIndexes = realValues
    .map((value, index) => ({ value, index }))
    .filter(({ value }) => value !== null && Number.isFinite(value) && value > 0)
    .map(({ index }) => index);
  const currentYtd = currentIndexes.reduce((sum, index) => sum + (realValues[index] || 0), 0);
  const historicalYtd = referenceYears.map((item) => (
    currentIndexes.reduce((sum, index) => {
      const value = fatMensal[item]?.[index];
      return sum + (value !== null && Number.isFinite(value) ? value * 1000 : 0);
    }, 0)
  ));
  const ytdBase = average(historicalYtd);
  const rhythmRatio = ytdBase > 0 && currentYtd > 0 ? currentYtd / ytdBase : 1;
  const sameMonthBase = average(sameMonthHistory);
  const recentAverage = average(realValues.filter((value) => value !== null).slice(-3));

  if (sameMonthBase && recentAverage) return sameMonthBase * rhythmRatio * .72 + recentAverage * .28;
  if (sameMonthBase) return sameMonthBase * rhythmRatio;
  return recentAverage || 0;
}

function renderProjecao() {
  if (chartProjecao) {
    chartProjecao.destroy();
    chartProjecao = null;
  }

  const holder = document.getElementById('projection-flow-chart');
  if (!holder) return;
  if (!hasProjectionData) {
    holder.innerHTML = '';
    return;
  }

  const latestYear = recentYears(1)[0] || String(new Date().getFullYear());
  const latestValues = fatMensal[latestYear] || [];
  const latestGoals = metaMensal[latestYear] || [];
  const realMonthIndexes = latestValues
    .map((value,index)=>({value,index}))
    .filter(({value})=>value !== null && Number.isFinite(value))
    .map(({index})=>index);
  const lastRealMonthIndex = realMonthIndexes.length ? realMonthIndexes[realMonthIndexes.length-1] : 0;

  let labels;
  let values;
  let goals;
  let lastRealIndex;

  if(projecaoMode === 'anos'){
    const years = yearsWithData().sort((a,b)=>Number(a)-Number(b));
    const currentYear = years[years.length-1] || latestYear;
    const currentSeries = (fatMensal[currentYear] || []).map(value=>value !== null && Number.isFinite(value) ? value*1000 : null);
    const projectedSeries = currentSeries.map((value,index)=>value !== null ? value : projectedMonthValue(currentYear,index,currentSeries));
    const currentProjection = projectedSeries.reduce((sum,value)=>sum+(value || 0),0);
    const nextProjection = Array.from({length:12},(_,index)=>projectedMonthValue(String(Number(currentYear)+1),index,projectedSeries)).reduce((sum,value)=>sum+(value || 0),0) || currentProjection * 1.04;
    const currentMeta = getValid(metaMensal[currentYear] || []).reduce((sum,value)=>sum+value*10000,0);
    labels = [currentYear,String(Number(currentYear)+1)];
    values = [currentProjection,nextProjection];
    goals = [currentMeta || currentProjection*1.04,nextProjection*1.03];
    lastRealIndex = 0;
  }else{
    labels = MESES;
    const realValues = latestValues.map(value=>value !== null && Number.isFinite(value) ? value*1000 : null);
    values = realValues.map((value,index)=>{
      if(value !== null) return value;
      const goal = latestGoals[index] !== null && Number.isFinite(latestGoals[index]) ? latestGoals[index]*10000 : 0;
      return projectedMonthValue(latestYear,index,realValues) || goal || 0;
    });
    goals = latestGoals.map((value,index)=>{
      if(value !== null && Number.isFinite(value)) return value*10000;
      return values[index] ? values[index]*1.04 : 0;
    });
    lastRealIndex = lastRealMonthIndex;
  }

  const x = 56;
  const y = 18;
  const w = 652;
  const h = 202;
  const max = niceAxisMax(Math.max(...values) * 1.12);
  const step = labels.length > 1 ? w / (labels.length - 1) : w;
  const points = values.map((value, index) => ({
    x: x + step * index,
    y: y + h - (value / max) * h,
    value,
    goal: goals[index],
    label: labels[index],
    index
  }));
  const lastRealX = points[lastRealIndex].x;
  const line = buildSmoothPath(points);
  const tracerLine = `M ${x - 84} ${points[0].y} L ${points[0].x} ${points[0].y} ${line.replace(/^M [^C]+ /, '')}`;
  const area = `${line} L ${points[points.length - 1].x} ${y + h} L ${x} ${y + h} Z`;
  const ticks = [0, .25, .5, .75, 1];
  const grid = ticks.map((tick) => {
    const gy = y + h - h * tick;
    return `<line class="chart-grid" x1="${x}" y1="${gy}" x2="${x + w}" y2="${gy}"/>`;
  }).join('');
  const yValues = ticks.map((tick) => {
    const gy = y + h - h * tick;
    return `<text class="chart-y-value" x="${x - 10}" y="${gy - 6}" text-anchor="end">${axisMoney(max * tick)}</text>`;
  }).join('');
  const xLabels = points.map((point) => (
    `<text class="chart-axis" x="${point.x}" y="${y + h + 30}" text-anchor="middle">${point.label}</text>`
  )).join('');
  const circles = points.map((point, pointIndex) => {
    if (point.index <= lastRealIndex) return '';
    const trendClass = point.value >= point.goal ? 'met' : 'missed';
    return `<circle class="projection-point ${trendClass} future" data-index="${pointIndex}" cx="${point.x}" cy="${point.y}" r="3.4"/>`;
  }).join('');

  holder.innerHTML = `
    <svg viewBox="0 0 720 260" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="projectionAreaBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(3,59,179,.18)"/>
          <stop offset=".72" stop-color="rgba(59,130,246,.06)"/>
          <stop offset="1" stop-color="rgba(59,130,246,0)"/>
        </linearGradient>
        <clipPath id="projectionPlotClip">
          <rect x="${x}" y="${y - 12}" width="${w}" height="${h + 28}"></rect>
        </clipPath>
        <clipPath id="projectionRealClip">
          <rect x="${x}" y="${y - 12}" width="${Math.max(0, lastRealX - x + 1)}" height="${h + 28}"></rect>
        </clipPath>
        <clipPath id="projectionFutureClip">
          <rect x="${lastRealX}" y="${y - 12}" width="${x + w - lastRealX}" height="${h + 28}"></rect>
        </clipPath>
      </defs>
      ${grid}
      <line class="chart-y-rule" x1="${x}" y1="${y}" x2="${x}" y2="${y + h}"/>
      ${yValues}
      <path class="projection-area" clip-path="url(#projectionRealClip)" d="${area}"/>
      <path class="projection-area projection-future" clip-path="url(#projectionFutureClip)" d="${area}"/>
      <path class="projection-line-flow" pathLength="1000" clip-path="url(#projectionRealClip)" d="${tracerLine}"/>
      <path class="projection-line-flow projection-future" pathLength="1000" clip-path="url(#projectionFutureClip)" d="${tracerLine}"/>
      <path class="projection-line-tracer" pathLength="1000" clip-path="url(#projectionRealClip)" d="${tracerLine}"/>
      <path class="projection-line-tracer projection-future" pathLength="1000" clip-path="url(#projectionFutureClip)" d="${tracerLine}"/>
      ${circles}
      ${xLabels}
      <g class="projection-tooltip" id="projection-tooltip">
        <rect width="214" height="80"></rect>
        <text class="tip-title" x="12" y="18" id="projection-tip-title"></text>
        <text class="tip-value" x="12" y="39" id="projection-tip-value"></text>
        <text class="tip-note" x="12" y="57" id="projection-tip-note"></text>
        <circle class="tip-status-bg" cx="194" cy="57" r="9"></circle>
        <text class="tip-status" x="194" y="57" text-anchor="middle" dominant-baseline="central" id="projection-tip-status"></text>
      </g>
    </svg>`;
  bindProjectionHover(points.filter((point) => point.index > lastRealIndex));
}

function bindProjectionHover(points) {
  const svg = document.querySelector('#projection-flow-chart svg');
  const tooltip = document.getElementById('projection-tooltip');
  const tipTitle = document.getElementById('projection-tip-title');
  const tipValue = document.getElementById('projection-tip-value');
  const tipNote = document.getElementById('projection-tip-note');
  const tipStatus = document.getElementById('projection-tip-status');
  const tipStatusBg = tooltip.querySelector('.tip-status-bg');
  const pointEls = [...svg.querySelectorAll('.projection-point')];
  const threshold = 36;

  function clearHover() {
    pointEls.forEach((point) => point.style.removeProperty('opacity'));
    tooltip.style.opacity = 0;
  }

  svg.addEventListener('mousemove', (event) => {
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const cursor = svg.createSVGPoint();
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    const pos = cursor.matrixTransform(matrix.inverse());
    let nearest = null;
    let nearestDist = Infinity;

    points.forEach((point) => {
      const dist = Math.hypot(pos.x - point.x, pos.y - point.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = point;
      }
    });

    clearHover();
    if (!nearest || nearestDist > threshold) return;

    const strength = nearestDist <= 3 ? 1 : Math.max(0, Math.min(1, 1 - nearestDist / threshold));
    const activePoint = pointEls.find((point) => Number(point.dataset.index) === nearest.index);
    if (activePoint) activePoint.style.setProperty('opacity', strength.toFixed(2), 'important');

    const completed = nearest.value >= nearest.goal;
    tipTitle.textContent = `Projeção · ${nearest.label}`;
    tipValue.textContent = `Faturamento ${BRL.format(nearest.value)}`;
    tipNote.textContent = `Meta ${BRL.format(nearest.goal)}`;
    tipStatus.textContent = completed ? '\u2713' : '\u00d7';
    tipStatusBg.classList.toggle('ok', completed);
    tipStatusBg.classList.toggle('bad', !completed);

    const tipWidth = 214;
    const tipHeight = 80;
    let tipX = nearest.x + 14;
    let tipY = nearest.y - 88;
    if (tipX + tipWidth > 704) tipX = nearest.x - tipWidth - 14;
    if (tipY < 8) tipY = nearest.y + 18;
    if (tipY + tipHeight > 250) tipY = 250 - tipHeight;
    tooltip.setAttribute('transform', `translate(${tipX} ${tipY})`);
    tooltip.style.opacity = strength.toFixed(2);
  });

  svg.addEventListener('mouseleave', clearHover);
  svg.addEventListener('pointerleave', clearHover);
}

function bindEvents() {
  document.querySelectorAll('[data-chart-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      setToggle(button);
      const mode = button.dataset.mode;
      if (button.dataset.chartMode === 'faturamento') {
        faturamentoMode = mode;
        renderFaturamento();
      }
      if (button.dataset.chartMode === 'conversao') {
        conversaoMode = mode;
        renderConversao();
      }
      if (button.dataset.chartMode === 'projecao') {
        projecaoMode = mode;
        renderProjecao();
      }
    });
  });

  document.getElementById('conversionRingList')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-conversion-month]');
    if (!button) return;
    conversaoSelectedMonthIndex = Number(button.dataset.conversionMonth);
    conversaoMode = 'meses';
    document.querySelectorAll('[data-chart-mode="conversao"]').forEach((item) => {
      item.classList.toggle('active', item.dataset.mode === 'meses');
    });
    renderConversao();
  });

  const picker = document.getElementById('comparePicker');
  document.getElementById('comparePickerButton').addEventListener('click', () => {
    if (picker.classList.contains('open')) closePicker();
    else openPicker();
  });

  document.getElementById('comparePickerMenu').addEventListener('click', (event) => {
    event.stopPropagation();
    const yearButton = event.target.closest('[data-picker-year]');
    const monthButton = event.target.closest('[data-picker-month]');
    if (yearButton) {
      pickerYear = yearButton.dataset.pickerYear;
      pickerStage = 'month';
      renderPickerMenu();
      picker.classList.add('open');
      return;
    }
    if (monthButton) {
      addSelectedPeriod(`${monthButton.dataset.pickerMonth}/${pickerYear.slice(-2)}`);
      closePicker();
      resetPicker();
    }
  });

  document.getElementById('selectedPeriods').addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-period]');
    if (!button) return;
    selectedItems = selectedItems.filter((period) => period !== button.dataset.removePeriod);
    renderSelectedPeriods();
    renderDetalhado();
  });

  const detailedCard = document.querySelector('.card-detalhado');
  const compareLayout = document.querySelector('.compare-layout');
  detailedCard.addEventListener('mouseenter', () => {
    window.clearTimeout(summaryExpandTimer);
    compareLayout.classList.add('summary-expanded');
    summaryExpandTimer = window.setTimeout(() => {
      summaryExpanded = true;
      compareLayout.classList.add('summary-values-expanded');
      if (selectedItems.length >= 2) updateInfoPanel(selectedItems[0], selectedItems[1]);
    }, 90);
  });
  detailedCard.addEventListener('mouseleave', () => {
    window.clearTimeout(summaryExpandTimer);
    summaryExpanded = false;
    compareLayout.classList.remove('summary-values-expanded');
    if (selectedItems.length >= 2) updateInfoPanel(selectedItems[0], selectedItems[1]);
    compareLayout.classList.remove('summary-expanded');
  });

  document.addEventListener('click', (event) => {
    if (!picker.contains(event.target)) {
      closePicker();
      resetPicker();
    }
  });
}

function resetObject(target){
  Object.keys(target).forEach(key=>delete target[key]);
}

function ensureYearColor(year,index){
  if(COLORS[year]) return;
  const line = FATURAMENTO_COLORS[index % FATURAMENTO_COLORS.length];
  COLORS[year] = {line,fill:hexToRgba(line,.38)};
}

async function hydrateHistoricoFromSupabase(){
  const api = window.CaioSupabase;
  if(!api?.get) return;

  const [principalRows,metaRows,conversaoRows] = await Promise.all([
    (api.getAll || api.get)(api.tables.principal,"select=*"),
    (api.getAll || api.get)(api.tables.metas,"select=*"),
    (api.getAll || api.get)(api.tables.conversao,"select=*")
  ]);

  const principal = principalRows.map(api.normalizePrincipal).filter(row=>row.date);
  const metas = metaRows.map(api.normalizeMeta).filter(row=>Number.isFinite(row.year) && row.monthIndex >= 0);
  const conversoes = conversaoRows.map(api.normalizeConversao).filter(row=>row.date);
  hasProjectionData = principal.some(row=>row.revenue > 0);

  const years = new Set();
  principal.forEach(row=>years.add(String(row.date.getFullYear())));
  metas.forEach(row=>years.add(String(row.year)));
  conversoes.forEach(row=>years.add(String(row.date.getFullYear())));
  if(!years.size) years.add(String(api.currentYear()));
  const orderedYears = [...years].sort((a,b)=>Number(a)-Number(b));
  ANOS.splice(0,ANOS.length,...orderedYears);
  ANOS.forEach((year,index)=>ensureYearColor(year,index));

  resetObject(fatMensal);
  resetObject(compareData);
  orderedYears.forEach(year=>{ fatMensal[year] = Array(12).fill(null); });
  if(principal.length){
    const grouped = new Map();
    principal.forEach(row=>{
      const year = String(row.date.getFullYear());
      const month = row.date.getMonth();
      const key = `${year}-${month}`;
      if(!grouped.has(key)){
        grouped.set(key,{year,month,revenue:0,nfeSet:new Set(),clients:new Set(),count:0});
      }
      const item = grouped.get(key);
      item.revenue += row.revenue;
      item.count += 1;
      if(row.nfe) item.nfeSet.add(row.nfe);
      if(row.clientId || row.clientName) item.clients.add(row.clientId || row.clientName);
    });
    grouped.forEach(item=>{
      fatMensal[item.year][item.month] = +(item.revenue/1000).toFixed(2);
      const period = `${MESES[item.month]}/${item.year.slice(-2)}`;
      compareData[period] = {
        tkt:item.count ? Math.round((item.revenue/item.count)/10) : 0,
        cli:item.clients.size,
        nfe:item.nfeSet.size
      };
    });
  }

  resetObject(metaMensal);
  orderedYears.forEach(year=>{ metaMensal[year] = Array(12).fill(null); });
  if(metas.length){
    metas.forEach(meta=>{
      const year = String(meta.year);
      if(!metaMensal[year]) metaMensal[year] = Array(12).fill(null);
      metaMensal[year][meta.monthIndex] = +(meta.value/10000).toFixed(2);
    });
  }

  resetObject(conversaoMensal);
  orderedYears.forEach(year=>{ conversaoMensal[year] = Array(12).fill(null); });
  if(conversoes.length){
    const grouped = new Map();
    conversoes.forEach(row=>{
      const year = String(row.date.getFullYear());
      const month = row.date.getMonth();
      const key = `${year}-${month}`;
      if(!grouped.has(key)) grouped.set(key,{year,month,conversados:0,geraramNfe:0});
      const item = grouped.get(key);
      item.conversados += row.conversados;
      item.geraramNfe += row.geraramNfe;
    });
    grouped.forEach(item=>{
      if(!conversaoMensal[item.year]) conversaoMensal[item.year] = Array(12).fill(null);
      conversaoMensal[item.year][item.month] = item.conversados
        ? +(item.geraramNfe/item.conversados*100).toFixed(1)
        : 0;
    });
  }

  const nextSignature = JSON.stringify({
    anos:ANOS,
    fat:fatMensal,
    meta:metaMensal,
    conversao:conversaoMensal
  });
  if(historicoInitialRenderDone && nextSignature === historicoDataSignature) return;
  historicoDataSignature = nextSignature;

  if(!historicoInitialRenderDone || selectedItems.length < 2){
    selectedItems = defaultDetailPeriods();
  }
  renderSelectedPeriods();
  renderFaturamento();
  renderConversao();
  renderDetalhado();
  renderProjecao();
  historicoInitialRenderDone = true;
}

function init() {
  bindEvents();
  hydrateHistoricoFromSupabase();
  window.CaioSupabase?.registerAutoRefresh?.(hydrateHistoricoFromSupabase,{interval:18000});
}

init();
