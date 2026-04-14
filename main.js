import { store } from './data/store.js';
import './components/LogActivityForm.js';
import './components/AIAssistant.js';

class App {
  constructor() {
    this.chart = null;
    this.init();
  }

  init() {
    this.setupNavigation();
    this.updateDashboard();
    this.renderHistory();
    this.initChart();

    window.addEventListener('activity-added', () => {
      this.updateDashboard();
      this.renderHistory();
      this.updateChart();
    });
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const viewId = btn.getAttribute('data-view');
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        views.forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
        if (viewId === 'dashboard') this.updateChart();
      });
    });
  }

  updateDashboard() {
    const totals = store.getTotals();
    document.getElementById('swim-total-dist').textContent = totals.swim.dist.toLocaleString();
    document.getElementById('swim-total-time').textContent = totals.swim.time.toLocaleString();
    document.getElementById('bike-total-dist').textContent = totals.bike.dist.toLocaleString();
    document.getElementById('bike-total-time').textContent = totals.bike.time.toLocaleString();
    document.getElementById('run-total-dist').textContent = totals.run.dist.toLocaleString();
    document.getElementById('run-total-time').textContent = totals.run.time.toLocaleString();
  }

  calculatePace(type, dist, time) {
    if (!dist || !time || dist == 0) return '-';
    if (type === 'run') {
      const paceMin = Math.floor(time / dist);
      const paceSec = Math.round((time / dist - paceMin) * 60);
      return `${paceMin}:${paceSec.toString().padStart(2, '0')}/km`;
    } else if (type === 'bike') {
      return `${(dist / (time / 60)).toFixed(1)} km/h`;
    } else if (type === 'swim') {
      const pacePer100 = (time * 60) / (dist / 100);
      const min = Math.floor(pacePer100 / 60);
      const sec = Math.round(pacePer100 % 60);
      return `${min}:${sec.toString().padStart(2, '0')}/100m`;
    }
    return '-';
  }

  renderHistory() {
    const list = document.getElementById('activity-list');
    const activities = store.getActivities();
    
    list.innerHTML = activities.map(a => {
      const pace = this.calculatePace(a.type, a.distance, a.duration);
      let extraInfo = '';
      if (a.type === 'run' && a.cadence) extraInfo = ` • ${a.cadence} spm`;
      if (a.type === 'bike') {
        if (a.power) extraInfo += ` • ${a.power} W`;
        if (a.cadence) extraInfo += ` • ${a.cadence} rpm`;
      }

      return `
        <div class="activity-item ${a.type}">
          <div class="activity-info">
            <h4>${this.getDisciplineLabel(a.type)}</h4>
            <p>${new Date(a.date).toLocaleDateString('ko-KR')} • ${a.notes || '기록 없음'}</p>
            <p style="font-size: 0.8rem; color: var(--color-text-dim); margin-top: 4px;">
               ${pace}${extraInfo}
            </p>
          </div>
          <div class="activity-metrics">
            <div>${a.distance} ${a.type === 'swim' ? 'm' : 'km'}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-dim)">${a.duration}분</div>
          </div>
        </div>
      `;
    }).join('');
  }

  getDisciplineLabel(type) {
    const labels = { swim: '수영 🏊‍♂️', bike: '자전거 🚴‍♂️', run: '달리기 🏃‍♂️' };
    return labels[type] || type;
  }

  initChart() {
    const ctx = document.getElementById('volumeChart').getContext('2d');
    const data = store.getWeeklyData();
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          { label: '수영', data: data.swimData, backgroundColor: 'rgba(105, 175, 230, 0.6)' },
          { label: '자전거', data: data.bikeData, backgroundColor: 'rgba(230, 126, 34, 0.6)' },
          { label: '달리기', data: data.runData, backgroundColor: 'rgba(46, 204, 113, 0.6)' }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { color: '#ecf0f1' } } },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: '#95a5a6' } },
          y: { stacked: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#95a5a6' } }
        }
      }
    });
  }

  updateChart() {
    const data = store.getWeeklyData();
    this.chart.data.labels = data.labels;
    this.chart.data.datasets[0].data = data.swimData;
    this.chart.data.datasets[1].data = data.bikeData;
    this.chart.data.datasets[2].data = data.runData;
    this.chart.update();
  }
}

new App();
