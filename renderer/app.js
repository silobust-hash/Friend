// ─── State ───
let employees = [];
let currentTarget = 'all';
let isLoading = false;

// ─── 초기화 ───
async function init() {
  // API 키 확인
  const { hasKey } = await api.checkApiKey();
  if (!hasKey) {
    document.getElementById('api-modal').style.display = 'flex';
  }

  // API 키 설정 핸들러
  document.getElementById('api-key-submit').addEventListener('click', async () => {
    const key = document.getElementById('api-key-input').value.trim();
    if (key) {
      const { success } = await api.setApiKey(key);
      if (success) {
        document.getElementById('api-modal').style.display = 'none';
      }
    }
  });

  // 직원 로드
  employees = await api.getEmployees();
  renderDesks();
  renderEmployeeGrid();
  renderChatTabs();
  renderTargetOptions();
  startClock();

  // 이벤트
  document.getElementById('send-btn').addEventListener('click', sendMessage);
  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // textarea 자동 높이
  document.getElementById('chat-input').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
}

// ─── 시계 ───
function startClock() {
  const el = document.getElementById('clock');
  function update() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
}

// ─── 사무실 씬 데스크 렌더링 ───
function renderDesks() {
  const container = document.getElementById('desks-container');
  container.innerHTML = employees.map(emp => `
    <div class="desk" data-id="${emp.id}">
      <div class="desk-avatar ${emp.status}" style="background: ${emp.color}22; border: 2px solid ${emp.color}">
        ${emp.emoji}
      </div>
      <div class="desk-status ${emp.status}">${getStatusLabel(emp.status)}</div>
      <div class="desk-table"><div class="desk-laptop"></div></div>
      <div class="desk-name">${emp.name}</div>
    </div>
  `).join('');
}

// ─── 직원 카드 그리드 ───
function renderEmployeeGrid() {
  const grid = document.getElementById('employee-grid');
  grid.innerHTML = employees.map(emp => `
    <div class="emp-card" data-id="${emp.id}" onclick="openChat('${emp.id}')">
      <div class="emp-card-header">
        <div class="emp-card-avatar" style="background: ${emp.color}22; border: 2px solid ${emp.color}">
          ${emp.emoji}
        </div>
        <div class="emp-card-info">
          <h3>${emp.name}</h3>
          <span>${emp.role}</span>
        </div>
      </div>
      <div class="emp-card-status">
        <div class="status-badge ${emp.status}">
          <span class="status-dot ${emp.status}"></span>
          ${getStatusLabel(emp.status)}
        </div>
        <div class="status-dropdown">
          <button class="status-toggle" onclick="event.stopPropagation(); toggleStatusMenu('${emp.id}')">변경</button>
          <div class="status-menu" id="menu-${emp.id}">
            <button onclick="event.stopPropagation(); changeStatus('${emp.id}', 'working')">업무중</button>
            <button onclick="event.stopPropagation(); changeStatus('${emp.id}', 'resting')">휴식중</button>
            <button onclick="event.stopPropagation(); changeStatus('${emp.id}', 'vacation')">휴가</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── 채팅 탭 ───
function renderChatTabs() {
  const tabs = document.querySelector('.chat-tabs');
  tabs.innerHTML = `
    <button class="tab active" data-target="all" onclick="switchTab('all')">전체</button>
    ${employees.map(emp =>
      `<button class="tab" data-target="${emp.id}" onclick="switchTab('${emp.id}')">${emp.emoji} ${emp.name}</button>`
    ).join('')}
  `;
}

function renderTargetOptions() {
  const select = document.getElementById('chat-target');
  select.innerHTML = `
    <option value="all">전체</option>
    ${employees.map(emp => `<option value="${emp.id}">${emp.emoji} ${emp.name}</option>`).join('')}
  `;
}

function switchTab(target) {
  currentTarget = target;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[data-target="${target}"]`).classList.add('active');
  document.getElementById('chat-target').value = target;
}

// ─── 상태 관리 ───
function getStatusLabel(status) {
  return { working: '업무중', resting: '휴식중', vacation: '휴가' }[status] || status;
}

function toggleStatusMenu(empId) {
  // 다른 메뉴 닫기
  document.querySelectorAll('.status-menu').forEach(m => m.classList.remove('show'));
  const menu = document.getElementById(`menu-${empId}`);
  menu.classList.toggle('show');
}

async function changeStatus(empId, status) {
  await api.setStatus(empId, status);
  // 로컬 상태 업데이트
  const emp = employees.find(e => e.id === empId);
  if (emp) emp.status = status;
  renderDesks();
  renderEmployeeGrid();
  // 메뉴 닫기
  document.querySelectorAll('.status-menu').forEach(m => m.classList.remove('show'));
}

// 메뉴 바깥 클릭 시 닫기
document.addEventListener('click', () => {
  document.querySelectorAll('.status-menu').forEach(m => m.classList.remove('show'));
});

// ─── 채팅 ───
function openChat(empId) {
  switchTab(empId);
  document.getElementById('chat-input').focus();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || isLoading) return;

  const target = document.getElementById('chat-target').value;
  isLoading = true;
  document.getElementById('send-btn').disabled = true;

  // 사용자 메시지 표시
  addMessage({ sender: 'user', senderName: '박실로 대표', emoji: '👨‍💼', text, color: '#6c5ce7' });
  input.value = '';
  input.style.height = 'auto';

  // 대상 직원 결정
  const targets = target === 'all'
    ? employees.filter(e => e.status !== 'vacation')
    : [employees.find(e => e.id === target)].filter(Boolean);

  // 각 직원에게 병렬로 메시지 전송
  const promises = targets.map(async (emp) => {
    // 타이핑 표시
    const typingId = addTyping(emp);

    const result = await api.sendMessage(emp.id, text);
    removeTyping(typingId);

    if (result.error) {
      addMessage({
        sender: emp.id, senderName: emp.name, emoji: emp.emoji,
        text: `[오류] ${result.error}`, color: emp.color, isError: true
      });
    } else {
      addMessage({
        sender: emp.id, senderName: emp.name, emoji: emp.emoji,
        text: result.reply, color: emp.color
      });
    }
  });

  await Promise.all(promises);
  isLoading = false;
  document.getElementById('send-btn').disabled = false;
}

function addMessage({ sender, senderName, emoji, text, color, isError }) {
  const container = document.getElementById('chat-messages');
  // 웰컴 메시지 제거
  const welcome = container.querySelector('.welcome-msg');
  if (welcome) welcome.remove();

  const isUser = sender === 'user';
  const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : 'bot'}`;
  div.innerHTML = `
    <div class="msg-avatar" style="background: ${color}22; border: 2px solid ${color}">${emoji}</div>
    <div class="msg-body" ${isError ? 'style="border-color: var(--vacation)"' : ''}>
      ${!isUser ? `<div class="msg-sender" style="color: ${color}">${senderName}</div>` : ''}
      <div class="msg-text">${escapeHtml(text)}</div>
      <div class="msg-time">${time}</div>
    </div>
  `;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addTyping(emp) {
  const container = document.getElementById('chat-messages');
  const id = `typing-${emp.id}-${Date.now()}`;
  const div = document.createElement('div');
  div.className = 'message bot';
  div.id = id;
  div.innerHTML = `
    <div class="msg-avatar" style="background: ${emp.color}22; border: 2px solid ${emp.color}">${emp.emoji}</div>
    <div class="msg-body">
      <div class="msg-sender" style="color: ${emp.color}">${emp.name}</div>
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ─── 시작 ───
document.addEventListener('DOMContentLoaded', init);
