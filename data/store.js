import { initialActivities } from './initialData.js';

export class TrainingStore {
  constructor() {
    this.activities = this._loadFromStorage();
  }

  _loadFromStorage() {
    // Using a new key 'tri-activities-v2' to force refresh with CSV data
    const data = localStorage.getItem('tri-activities-v2');
    const activities = data ? JSON.parse(data) : [];
    if (activities.length === 0) {
      return this._seedData();
    }
    return activities;
  }

  _seedData() {
    localStorage.setItem('tri-activities-v2', JSON.stringify(initialActivities));
    return initialActivities;
  }

  _saveToStorage() {
    localStorage.setItem('tri-activities-v2', JSON.stringify(this.activities));
  }

  addActivity(activity) {
    const newActivity = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...activity
    };
    this.activities.unshift(newActivity);
    this._saveToStorage();
    return newActivity;
  }

  getActivities() {
    return this.activities;
  }

  getTotals(type = 'month', year = 'all', month = 'all', week = 'all') {
    const filtered = this.activities.filter(a => {
      const d = new Date(a.date);
      const yMatch = year === 'all' || d.getFullYear().toString() === year;
      const mMatch = month === 'all' || d.getMonth().toString() === month;
      
      let wMatch = true;
      if (type === 'week' && week !== 'all') {
        const weekInfo = this._getWeekNumber(d);
        wMatch = weekInfo.toString() === week;
      }
      
      if (type === 'year') return yMatch;
      if (type === 'month') return yMatch && mMatch;
      if (type === 'week') return yMatch && mMatch && wMatch;
      return true;
    });

    return filtered.reduce((acc, curr) => {
      const type = curr.type;
      acc[type].dist += parseFloat(curr.distance || 0);
      acc[type].time += parseFloat(curr.duration || 0);
      return acc;
    }, {
      swim: { dist: 0, time: 0 },
      bike: { dist: 0, time: 0 },
      run: { dist: 0, time: 0 }
    });
  }

  _getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }

  getYears() {
    const years = [...new Set(this.activities.map(a => new Date(a.date).getFullYear().toString()))];
    return years.sort((a, b) => b - a);
  }

  getWeeksOfMonth(year, month) {
    const weeks = new Set();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, parseInt(month) + 1, 0);
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      weeks.add(this._getWeekNumber(new Date(d)));
    }
    return [...weeks].sort((a, b) => a - b);
  }

  getFilteredChartData(type, year, month, week) {
    const labels = [];
    const swimData = [];
    const bikeData = [];
    const runData = [];

    if (type === 'year') {
      for (let i = 0; i < 12; i++) {
        labels.push(`${i + 1}월`);
        const monthlyActivities = this.activities.filter(a => {
          const d = new Date(a.date);
          return d.getFullYear().toString() === year && d.getMonth() === i;
        });
        swimData.push(monthlyActivities.filter(a => a.type === 'swim').reduce((sum, a) => sum + parseFloat(a.duration), 0));
        bikeData.push(monthlyActivities.filter(a => a.type === 'bike').reduce((sum, a) => sum + parseFloat(a.duration), 0));
        runData.push(monthlyActivities.filter(a => a.type === 'run').reduce((sum, a) => sum + parseFloat(a.duration), 0));
      }
    } else if (type === 'month') {
      const lastDay = new Date(year, parseInt(month) + 1, 0).getDate();
      for (let i = 1; i <= lastDay; i++) {
        labels.push(`${i}일`);
        const dailyActivities = this.activities.filter(a => {
          const d = new Date(a.date);
          return d.getFullYear().toString() === year && d.getMonth().toString() === month && d.getDate() === i;
        });
        swimData.push(dailyActivities.filter(a => a.type === 'swim').reduce((sum, a) => sum + parseFloat(a.duration), 0));
        bikeData.push(dailyActivities.filter(a => a.type === 'bike').reduce((sum, a) => sum + parseFloat(a.duration), 0));
        runData.push(dailyActivities.filter(a => a.type === 'run').reduce((sum, a) => sum + parseFloat(a.duration), 0));
      }
    } else if (type === 'week') {
      const days = ['월', '화', '수', '목', '금', '토', '일'];
      labels.push(...days);
      
      // Get dates for that specific week of that year/month
      // This is slightly complex, let's simplify by finding activities that match year, month, and week number
      for (let i = 1; i <= 7; i++) {
        const dailyActivities = this.activities.filter(a => {
          const d = new Date(a.date);
          const day = d.getDay() || 7; // 1-7 (Mon-Sun)
          return d.getFullYear().toString() === year && 
                 this._getWeekNumber(d).toString() === week &&
                 day === i;
        });
        swimData.push(dailyActivities.filter(a => a.type === 'swim').reduce((sum, a) => sum + parseFloat(a.duration), 0));
        bikeData.push(dailyActivities.filter(a => a.type === 'bike').reduce((sum, a) => sum + parseFloat(a.duration), 0));
        runData.push(dailyActivities.filter(a => a.type === 'run').reduce((sum, a) => sum + parseFloat(a.duration), 0));
      }
    }

    return { labels, swimData, bikeData, runData };
  }

  // Alias for backward compatibility if needed, though we should update main.js
  getWeeklyData() {
    // Default to current week or something sensible if called without params
    const now = new Date();
    return this.getFilteredChartData('week', now.getFullYear().toString(), now.getMonth().toString(), this._getWeekNumber(now).toString());
  }
}

export const store = new TrainingStore();
