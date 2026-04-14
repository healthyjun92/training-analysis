import { store } from '../data/store.js';

class LogActivityForm extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    const form = this.querySelector('#training-form');
    const typeSelect = this.querySelector('#type');

    typeSelect.addEventListener('change', () => this.updateFields(typeSelect.value));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const activity = Object.fromEntries(formData.entries());
      
      store.addActivity(activity);
      form.reset();
      this.updateFields('run'); // reset to default
      window.dispatchEvent(new CustomEvent('activity-added'));
      alert('훈련이 기록되었습니다!');
    });
  }

  updateFields(type) {
    const distLabel = this.querySelector('#dist-label');
    const extraFields = this.querySelector('#extra-fields');
    
    distLabel.textContent = type === 'swim' ? '거리 (m)' : '거리 (km)';
    
    let html = '';
    if (type === 'run') {
      html = `
        <div class="form-group">
          <label for="cadence">케이던스 (spm)</label>
          <input type="number" id="cadence" name="cadence" placeholder="0">
        </div>
      `;
    } else if (type === 'bike') {
      html = `
        <div class="form-group">
          <label for="power">평균 파워 (W)</label>
          <input type="number" id="power" name="power" placeholder="0">
        </div>
        <div class="form-group">
          <label for="cadence">케이던스 (rpm)</label>
          <input type="number" id="cadence" name="cadence" placeholder="0">
        </div>
      `;
    }
    extraFields.innerHTML = html;
  }

  render() {
    this.innerHTML = `
      <form id="training-form">
        <div class="form-group">
          <label for="type">종목</label>
          <select id="type" name="type" required>
            <option value="swim">수영</option>
            <option value="bike">자전거</option>
            <option value="run" selected>달리기</option>
          </select>
        </div>
        <div class="form-group">
          <label for="distance" id="dist-label">거리 (km)</label>
          <input type="number" step="0.01" id="distance" name="distance" placeholder="0.00" required>
        </div>
        <div class="form-group">
          <label for="duration">전체 시간 (분)</label>
          <input type="number" id="duration" name="duration" placeholder="0" required>
        </div>
        <div id="extra-fields">
          <div class="form-group">
            <label for="cadence">케이던스 (spm)</label>
            <input type="number" id="cadence" name="cadence" placeholder="0">
          </div>
        </div>
        <div class="form-group">
          <label for="intensity">강도 (1-10)</label>
          <input type="range" id="intensity" name="intensity" min="1" max="10" value="5">
        </div>
        <div class="form-group">
          <label for="notes">메모</label>
          <input type="text" id="notes" name="notes" placeholder="훈련 내용 요약">
        </div>
        <button type="submit" class="submit-btn">기록하기</button>
      </form>
    `;
  }
}

customElements.define('log-activity-form', LogActivityForm);
