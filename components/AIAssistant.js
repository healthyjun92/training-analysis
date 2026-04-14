import { store } from '../data/store.js';

class AIAssistant extends HTMLElement {
  constructor() {
    super();
    this.history = [
      { role: 'ai', content: '안녕하세요! 저는 당신의 철인3종 전담 코치입니다. 현재 훈련 데이터를 바탕으로 조언을 드릴 수 있습니다. 궁금한 점이 있으신가요?' }
    ];
    this.render();
  }

  connectedCallback() {
    this.addEventListener('submit', (e) => {
      if (e.target.id === 'ai-form') {
        e.preventDefault();
        const input = this.querySelector('#ai-input');
        const question = input.value.trim();
        if (question) {
          this.addMessage('user', question);
          input.value = '';
          this.generateResponse(question);
        }
      }
    });
  }

  addMessage(role, content) {
    this.history.push({ role, content });
    this.updateMessages();
  }

  async generateResponse(question) {
    this.addMessage('ai', '분석 중입니다...');
    
    // Simulate thinking
    setTimeout(() => {
      const totals = store.getTotals();
      const activities = store.getActivities();
      let response = '';

      if (question.includes('분석') || question.includes('어때')) {
        response = this.getPerformanceAnalysis(totals, activities);
      } else if (question.includes('추천') || question.includes('뭐할까')) {
        response = this.getTrainingRecommendation(totals);
      } else if (question.includes('수영')) {
        response = `현재 수영 누적 거리는 ${totals.swim.dist}m입니다. 철인3종 경기에서 수영은 페이스 유지가 중요합니다. 주 3회 이상의 인터벌 훈련을 권장합니다.`;
      } else if (question.includes('자전거') || question.includes('사이클')) {
        response = `자전거 훈련량이 총 ${totals.bike.time}분입니다. 지구력을 위해 주말에 2시간 이상의 장거리 라이딩(LSD)을 추가해보시는 건 어떨까요?`;
      } else if (question.includes('달리기') || question.includes('런')) {
        response = `달리기는 현재 ${totals.run.dist}km를 소화하셨네요. 관절 부상을 방지하기 위해 강도 높은 훈련 후에는 반드시 리커버리 런을 섞어주세요.`;
      } else {
        response = "명쾌한 답변을 드립니다! 철인3종은 '균형'의 스포츠입니다. 현재 데이터로 볼 때 한 종목에 치우치지 않는 훈련 배분이 필요해 보입니다. 더 구체적인 종목 상담을 원하시면 질문해주세요.";
      }

      this.history.pop(); // Remove "Analyzing..."
      this.addMessage('ai', response);
    }, 1000);
  }

  getPerformanceAnalysis(totals, activities) {
    const mainDiscipline = Object.keys(totals).reduce((a, b) => totals[a].time > totals[b].time ? a : b);
    const disciplineKo = { swim: '수영', bike: '자전거', run: '달리기' };
    
    return `최근 데이터를 분석한 결과, ${disciplineKo[mainDiscipline]} 훈련 비중이 가장 높습니다. 균형 있는 발전을 위해 상대적으로 부족한 종목의 훈련 시간을 15% 정도 늘리는 것을 추천합니다. 특히 최근 훈련 강도가 높은 편이니 충분한 휴식도 잊지 마세요.`;
  }

  getTrainingRecommendation(totals) {
    const leastTrained = Object.keys(totals).reduce((a, b) => totals[a].time < totals[b].time ? a : b);
    const disciplineKo = { swim: '수영', bike: '자전거', run: '달리기' };
    
    return `오늘은 가장 훈련량이 적은 **${disciplineKo[leastTrained]}** 훈련을 추천합니다. 약 45분 정도의 중강도 지속주(Tempo) 훈련이 현재 스케줄에 가장 적합해 보입니다.`;
  }

  updateMessages() {
    const chatBox = this.querySelector('.chat-messages');
    chatBox.innerHTML = this.history.map(msg => `
      <div class="chat-bubble ${msg.role}">
        <div class="bubble-content">${msg.content}</div>
      </div>
    `).join('');
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  render() {
    this.innerHTML = `
      <div class="ai-assistant-wrapper">
        <div class="chat-messages">
          ${this.history.map(msg => `
            <div class="chat-bubble ${msg.role}">
              <div class="bubble-content">${msg.content}</div>
            </div>
          `).join('')}
        </div>
        <form id="ai-form" class="ai-input-area">
          <input type="text" id="ai-input" placeholder="코치에게 질문하기 (예: 내 훈련 어때?, 오늘 뭐할까?)" required>
          <button type="submit"><i data-lucide="send"></i></button>
        </form>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
  }
}

customElements.define('ai-assistant', AIAssistant);
