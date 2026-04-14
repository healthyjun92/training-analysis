export class TrainingStore {
  constructor() {
    this.activities = this._loadFromStorage();
  }

  _loadFromStorage() {
    const data = localStorage.getItem('tri-activities');
    const activities = data ? JSON.parse(data) : [];
    if (activities.length === 0) {
      return this._seedData();
    }
    return activities;
  }

  _seedData() {
    const seed = [
      { id: 1, type: 'run', distance: 10, duration: 50, notes: '조깅 10k', cadence: 175, date: new Date(Date.now() - 86400000 * 1).toISOString() },
      { id: 2, type: 'bike', distance: 40, duration: 80, notes: '평지 라이딩', power: 180, cadence: 90, date: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 3, type: 'swim', distance: 1500, duration: 30, notes: '드릴 위주', date: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 4, type: 'run', distance: 5, duration: 22, notes: '인터벌 훈련', cadence: 182, date: new Date(Date.now() - 86400000 * 4).toISOString() },
    ];
    localStorage.setItem('tri-activities', JSON.stringify(seed));
    return seed;
  }

  _saveToStorage() {
    localStorage.setItem('tri-activities', JSON.stringify(this.activities));
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

  getTotals() {
    return this.activities.reduce((acc, curr) => {
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

  getWeeklyData() {
    const labels = [];
    const swimData = [];
    const bikeData = [];
    const runData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('ko-KR', { weekday: 'short' }));

      const dayActivities = this.activities.filter(a => a.date.startsWith(dateStr));
      
      swimData.push(dayActivities.filter(a => a.type === 'swim').reduce((sum, a) => sum + parseFloat(a.duration), 0));
      bikeData.push(dayActivities.filter(a => a.type === 'bike').reduce((sum, a) => sum + parseFloat(a.duration), 0));
      runData.push(dayActivities.filter(a => a.type === 'run').reduce((sum, a) => sum + parseFloat(a.duration), 0));
    }

    return { labels, swimData, bikeData, runData };
  }
}

export const store = new TrainingStore();
