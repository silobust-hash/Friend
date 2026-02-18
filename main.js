const { app, BrowserWindow, Tray, ipcMain, nativeImage, screen, Menu, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

const API_KEY = process.env.ANTHROPIC_API_KEY || '';
const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');

let widgetWindow = null;   // 하단 떠다니는 캐릭터 위젯
let dashWindow = null;     // 대시보드/채팅 창
let meetingWindow = null;  // 회의실 창
let tray = null;
let anthropic = null;

// ─── 설정 ───
let config = {
  connectionMode: 'api',  // 'api' | 'clawdbot'
  anthropicApiKey: '',
  employees: {},  // 캐릭터별 clawdbot 설정
  meeting: {
    rules: '',  // 회의 규칙/지침
    responseOrder: ['kim', 'park', 'oh', 'jung', 'lee'],  // 응답 순서
    maxResponders: 3,  // 최대 응답자 수
    autoSelectByKeyword: true  // 키워드 기반 자동 선택
  }
};

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      config = { ...config, ...JSON.parse(data) };
    }
  } catch (e) { console.error('Config load error:', e); }
}

function saveConfig() {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (e) { console.error('Config save error:', e); }
}

// ─── AI 직원 ───
const employees = {
  kim: {
    id: 'kim', name: '김 변호사', role: '법률 자문',
    avatar: 'kim', color: '#2C3E50', status: 'working',
    statusLabel: '업무 중',
    systemPrompt: `당신은 김 변호사, 한동노무법인의 법률 자문 변호사입니다.
노동법 소송, 부당해고 구제, 노동위원회 대리에 전문성이 있습니다.
차분하고 논리적이며 법적 근거를 명확히 제시합니다. 존댓말을 씁니다.
짧고 핵심적으로 답변합니다.`,
    conversationHistory: [],
    // Clawdbot 설정 (선택사항)
    clawdbot: null  // { url: 'http://localhost:3001', token: '...', sessionKey: '...' }
  },
  park: {
    id: 'park', name: '박 노무사', role: '인사노무 컨설팅',
    avatar: 'park', color: '#8E44AD', status: 'working',
    statusLabel: '업무 중',
    systemPrompt: `당신은 박 노무사, 한동노무법인의 인사노무 컨설팅 담당 공인노무사입니다.
취업규칙, 인사제도 설계, 근로계약서 검토에 전문성이 있습니다.
실무 경험이 풍부하고 현실적인 해결책을 제시합니다. 해요체를 씁니다.`,
    conversationHistory: [],
    clawdbot: null
  },
  oh: {
    id: 'oh', name: '오 지도사', role: '산업안전 지도사',
    avatar: 'oh', color: '#E67E22', status: 'working',
    statusLabel: '업무 중',
    systemPrompt: `당신은 오 산업안전지도사, 한동노무법인의 산업안전보건 전문가입니다.
산업안전보건법, 안전보건관리체계, 위험성평가, 중대재해처벌법에 전문성이 있습니다.
안전을 최우선으로 생각하며 체계적으로 설명합니다. 합쇼체를 씁니다.`,
    conversationHistory: [],
    clawdbot: null
  },
  lee: {
    id: 'lee', name: '이 디자이너', role: '브랜드 디자인',
    avatar: 'lee', color: '#E74C3C', status: 'resting',
    statusLabel: '휴식중',
    systemPrompt: `당신은 이 디자이너, 한동노무법인의 브랜드 디자인 담당입니다.
프레젠테이션, 마케팅 콘텐츠, SNS 디자인, 브랜딩에 전문성이 있습니다.
트렌디하고 감각적인 MZ세대 스타일입니다. 반말을 씁니다. 아이디어가 넘칩니다.`,
    conversationHistory: [],
    clawdbot: null
  },
  jung: {
    id: 'jung', name: '정 세무사', role: '세무/회계',
    avatar: 'jung', color: '#27AE60', status: 'working',
    statusLabel: '업무 중',
    systemPrompt: `당신은 정 세무사, 한동노무법인의 세무 회계 전문가입니다.
4대보험, 원천징수, 급여 정산, 퇴직금 산정, 세무 신고에 전문성이 있습니다.
정확한 숫자와 계산에 강하며 실무적으로 답변합니다. 존댓말을 씁니다.`,
    conversationHistory: [],
    clawdbot: null
  }
};

// ─── Anthropic (API 모드) ───
function initAnthropic(apiKey) {
  if (apiKey) { 
    anthropic = new Anthropic({ apiKey }); 
    config.anthropicApiKey = apiKey;
    saveConfig();
    return true; 
  }
  return false;
}

async function sendViaApi(emp, message) {
  if (!anthropic) return { error: 'API 키를 먼저 설정해주세요.' };

  emp.conversationHistory.push({ role: 'user', content: message });
  if (emp.conversationHistory.length > 20) emp.conversationHistory = emp.conversationHistory.slice(-20);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: emp.systemPrompt,
      messages: emp.conversationHistory
    });
    const reply = response.content[0].text;
    emp.conversationHistory.push({ role: 'assistant', content: reply });
    return { reply, employeeId: emp.id };
  } catch (err) {
    return { error: `${emp.name} 응답 실패: ${err.message}` };
  }
}

// ─── Clawdbot (Gateway 모드) ───
async function sendViaClawdbot(emp, message) {
  const clawdbotConfig = emp.clawdbot || config.employees[emp.id]?.clawdbot;
  
  if (!clawdbotConfig || !clawdbotConfig.url) {
    return { error: `${emp.name}의 Clawdbot이 설정되지 않았습니다.` };
  }

  const { url, token, sessionKey } = clawdbotConfig;
  
  try {
    // Clawdbot Gateway API 호출
    const endpoint = `${url}/api/sessions/send`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        sessionKey: sessionKey || `employee-${emp.id}`,
        message: message,
        waitForReply: true,
        timeoutSeconds: 60
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.reply || data.message || data.content || JSON.stringify(data);
    
    // 히스토리에도 저장 (로컬 백업)
    emp.conversationHistory.push({ role: 'user', content: message });
    emp.conversationHistory.push({ role: 'assistant', content: reply });
    if (emp.conversationHistory.length > 20) emp.conversationHistory = emp.conversationHistory.slice(-20);

    return { reply, employeeId: emp.id, via: 'clawdbot' };
  } catch (err) {
    return { error: `${emp.name} (Clawdbot) 응답 실패: ${err.message}` };
  }
}

// ─── 메시지 전송 (모드에 따라 분기) ───
async function sendToEmployee(employeeId, message) {
  const emp = employees[employeeId];
  if (!emp) return { error: '직원을 찾을 수 없습니다.' };
  if (emp.status === 'vacation') return { error: `${emp.name}은(는) 현재 휴가중입니다.` };

  // 캐릭터별 Clawdbot 설정이 있으면 Clawdbot 사용
  const hasClawdbot = emp.clawdbot || config.employees[emp.id]?.clawdbot;
  
  if (hasClawdbot) {
    return await sendViaClawdbot(emp, message);
  } else if (config.connectionMode === 'clawdbot') {
    return { error: `${emp.name}의 Clawdbot이 설정되지 않았습니다. 설정에서 연결해주세요.` };
  } else {
    return await sendViaApi(emp, message);
  }
}

// ─── 하단 위젯 윈도우 (투명, 항상 위) ───
function createWidgetWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;
  const widgetW = 720;
  const widgetH = 230;

  widgetWindow = new BrowserWindow({
    width: widgetW,
    height: widgetH,
    x: Math.round((width - widgetW) / 2),
    y: height - widgetH - 10,
    frame: false,
    transparent: true,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  widgetWindow.loadFile('renderer/widget.html');
  widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // 마우스 관통 (캐릭터 바깥 영역)
  widgetWindow.setIgnoreMouseEvents(false);

  widgetWindow.on('closed', () => { widgetWindow = null; });
}

// ─── 대시보드 윈도우 ───
function createDashWindow(employeeId) {
  if (dashWindow) {
    dashWindow.focus();
    dashWindow.webContents.send('switch-employee', employeeId);
    return;
  }

  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  dashWindow = new BrowserWindow({
    width: 480,
    height: 650,
    x: width - 500,
    y: height - 700,
    frame: false,
    transparent: true,
    hasShadow: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  dashWindow.loadFile('renderer/dashboard.html');

  dashWindow.webContents.on('did-finish-load', () => {
    if (employeeId) {
      dashWindow.webContents.send('switch-employee', employeeId);
    }
  });

  dashWindow.on('closed', () => { dashWindow = null; });
}

// ─── 회의실 윈도우 ───
function createMeetingWindow() {
  if (meetingWindow) {
    meetingWindow.focus();
    return;
  }

  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  meetingWindow = new BrowserWindow({
    width: 550,
    height: 700,
    x: Math.round((width - 550) / 2),
    y: Math.round((height - 700) / 2),
    frame: false,
    transparent: true,
    hasShadow: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  meetingWindow.loadFile('renderer/meeting.html');
  meetingWindow.on('closed', () => { meetingWindow = null; });
}

// ─── 회의실 메시지 (모든 캐릭터에게 전송) ───
async function sendMeetingMessage(message, attachments = []) {
  const responses = [];
  const meetingConfig = config.meeting || {};
  const availableEmployees = Object.values(employees).filter(e => e.status !== 'vacation');
  
  // 메시지 내용을 분석해서 관련 캐릭터 우선순위 결정
  const keywords = {
    kim: ['법', '소송', '판례', '해고', '노동위', '구제', '법률', '변호사'],
    park: ['인사', '취업규칙', '근로계약', '인사제도', '노무', '컨설팅'],
    oh: ['안전', '산재', '중대재해', '위험', '보건', '산업안전'],
    lee: ['디자인', '마케팅', 'SNS', '브랜딩', '프레젠테이션', 'PPT'],
    jung: ['세금', '세무', '4대보험', '급여', '원천징수', '퇴직금', '정산']
  };
  
  let respondingEmployees;
  
  if (meetingConfig.autoSelectByKeyword !== false) {
    // 관련도 점수 계산
    const scores = {};
    availableEmployees.forEach(emp => {
      scores[emp.id] = 0;
      const empKeywords = keywords[emp.id] || [];
      empKeywords.forEach(kw => {
        if (message.includes(kw)) scores[emp.id] += 10;
      });
      scores[emp.id] += Math.random() * 3;
    });
    
    // 점수순 정렬
    const sortedEmployees = availableEmployees.sort((a, b) => scores[b.id] - scores[a.id]);
    const maxResp = meetingConfig.maxResponders || 3;
    respondingEmployees = sortedEmployees.slice(0, maxResp);
  } else {
    // 지정된 순서대로
    const order = meetingConfig.responseOrder || ['kim', 'park', 'oh', 'jung', 'lee'];
    respondingEmployees = order
      .map(id => availableEmployees.find(e => e.id === id))
      .filter(Boolean)
      .slice(0, meetingConfig.maxResponders || 3);
  }
  
  // 회의 규칙이 있으면 컨텍스트에 추가
  const rules = meetingConfig.rules || '';
  const rulesContext = rules ? `\n\n[회의 규칙]\n${rules}\n` : '';
  
  // 첨부파일 컨텍스트
  let attachmentContext = '';
  if (attachments && attachments.length > 0) {
    attachmentContext = '\n\n[첨부파일]\n' + attachments.map(a => {
      if (a.type === 'text') return `[텍스트] ${a.content}`;
      if (a.type === 'image') return `[이미지] ${a.name}: ${a.description || '(이미지 첨부됨)'}`;
      return `[파일] ${a.name}`;
    }).join('\n');
  }
  
  // 각 캐릭터에게 회의 컨텍스트로 메시지 전송
  for (const emp of respondingEmployees) {
    const meetingContext = `[회의실] 대표님이 전체 회의에서 말씀하셨습니다. 다른 동료들도 듣고 있습니다. 간결하게 답변하세요.${rulesContext}${attachmentContext}\n\n대표님: ${message}`;
    
    const result = await sendToEmployee(emp.id, meetingContext);
    responses.push({
      employeeId: emp.id,
      name: emp.name,
      ...result
    });
  }
  
  return { responses };
}

// ─── 설정 윈도우 ───
let settingsWindow = null;

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 600,
    height: 700,
    frame: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  settingsWindow.loadFile('renderer/settings.html');
  settingsWindow.on('closed', () => { settingsWindow = null; });
}

// ─── 앱 전체 보이기/숨기기 ───
let appVisible = true;
let restoreWindow = null;

function hideApp() {
  [widgetWindow, dashWindow, meetingWindow, settingsWindow].forEach(w => { if (w) w.hide(); });
  appVisible = false;
  updateTrayMenu();
  createRestoreWindow();
}

function showApp() {
  if (restoreWindow) { restoreWindow.close(); restoreWindow = null; }
  if (!widgetWindow) createWidgetWindow();
  else widgetWindow.show();
  appVisible = true;
  updateTrayMenu();
}

function toggleAppVisibility() {
  if (appVisible) hideApp();
  else showApp();
}

function createRestoreWindow() {
  if (restoreWindow) return;
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  restoreWindow = new BrowserWindow({
    width: 52, height: 52,
    x: width - 70, y: height - 70,
    frame: false, transparent: true, hasShadow: false,
    alwaysOnTop: true, skipTaskbar: true, resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false
    }
  });

  restoreWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;}
html,body{background:transparent;overflow:hidden;height:100%;}
.btn{
  width:48px;height:48px;border-radius:50%;border:none;cursor:pointer;
  background:rgba(108,92,231,0.9);color:#fff;font-size:22px;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 16px rgba(0,0,0,0.4);transition:all 0.2s;
  -webkit-app-region:no-drag;
}
.btn:hover{transform:scale(1.15);background:rgba(108,92,231,1);box-shadow:0 6px 24px rgba(108,92,231,0.5);}
</style></head><body>
<button class="btn" onclick="window.api.showApp()" title="팀원 보이기">👥</button>
</body></html>
  `)}`);

  restoreWindow.setVisibleOnAllWorkspaces(true);
  restoreWindow.on('closed', () => { restoreWindow = null; });
}

// ─── 트레이 ───
function createTray() {
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAADlJREFUOI1jYBhsgJGBgYGBgYGR4f///wyMDAwMjEDMBMRMQMzEwMDAxEA7wDgKBqMBGAYDL8YAAAA/JgR1Se0WRAAAAABJRU5ErkJggg=='
  );
  tray = new Tray(icon);
  tray.setToolTip('AI Office - 동료들');
  updateTrayMenu();
  tray.on('click', () => toggleAppVisibility());
}

function updateTrayMenu() {
  if (!tray) return;
  const statusIcon = { working: '🟢', resting: '🟡', vacation: '🔴' };
  const modeLabel = config.connectionMode === 'clawdbot' ? '🤖 Clawdbot' : '🔌 API';
  
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: `모드: ${modeLabel}`, enabled: false },
    { type: 'separator' },
    { label: appVisible ? '🙈 앱 숨기기 (⌘⇧H)' : '👀 앱 보이기 (⌘⇧H)', click: () => toggleAppVisibility() },
    { label: '위젯 보기', click: () => widgetWindow?.show() },
    { label: '대시보드 열기', click: () => createDashWindow() },
    { label: '🏢 회의실', click: () => createMeetingWindow() },
    { label: '⚙️ 설정', click: () => createSettingsWindow() },
    { type: 'separator' },
    ...Object.values(employees).map(emp => {
      const hasClawdbot = emp.clawdbot || config.employees[emp.id]?.clawdbot;
      const connIcon = hasClawdbot ? '🤖' : '🔌';
      return {
        label: `${statusIcon[emp.status]} ${connIcon} ${emp.name} — ${emp.statusLabel}`,
        click: () => createDashWindow(emp.id)
      };
    }),
    { type: 'separator' },
    { label: '종료', click: () => app.quit() }
  ]));
}

// ─── IPC ───
function setupIPC() {
  // 직원 목록
  ipcMain.handle('get-employees', () =>
    Object.values(employees).map(e => {
      const hasClawdbot = e.clawdbot || config.employees[e.id]?.clawdbot;
      return {
        id: e.id, name: e.name, role: e.role, avatar: e.avatar,
        color: e.color, status: e.status, statusLabel: e.statusLabel,
        connectionType: hasClawdbot ? 'clawdbot' : 'api'
      };
    })
  );

  // 메시지 전송
  ipcMain.handle('send-message', async (_e, { employeeId, message }) =>
    await sendToEmployee(employeeId, message)
  );

  // 상태 변경
  ipcMain.handle('set-status', (_e, { employeeId, status, statusLabel }) => {
    if (employees[employeeId]) {
      employees[employeeId].status = status;
      employees[employeeId].statusLabel = statusLabel || status;
      updateTrayMenu();
      if (widgetWindow) widgetWindow.webContents.send('status-updated', { employeeId, status, statusLabel });
      return { success: true };
    }
    return { error: 'Not found' };
  });

  // API 키 설정
  ipcMain.handle('set-api-key', (_e, apiKey) => ({ success: initAnthropic(apiKey) }));
  ipcMain.handle('check-api-key', () => ({ hasKey: !!anthropic }));

  // ─── 설정 관련 IPC ───
  ipcMain.handle('get-config', () => ({
    connectionMode: config.connectionMode,
    hasApiKey: !!anthropic,
    employees: Object.fromEntries(
      Object.keys(employees).map(id => [
        id,
        {
          name: employees[id].name,
          clawdbot: config.employees[id]?.clawdbot || null
        }
      ])
    )
  }));

  ipcMain.handle('set-connection-mode', (_e, mode) => {
    config.connectionMode = mode;
    saveConfig();
    updateTrayMenu();
    return { success: true };
  });

  ipcMain.handle('set-employee-clawdbot', (_e, { employeeId, clawdbotConfig }) => {
    if (!config.employees[employeeId]) {
      config.employees[employeeId] = {};
    }
    config.employees[employeeId].clawdbot = clawdbotConfig;
    
    // employees 객체에도 반영
    if (employees[employeeId]) {
      employees[employeeId].clawdbot = clawdbotConfig;
    }
    
    saveConfig();
    updateTrayMenu();
    return { success: true };
  });

  ipcMain.handle('test-clawdbot', async (_e, { url, token }) => {
    try {
      const response = await fetch(`${url}/api/health`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        return { success: true, message: '연결 성공!' };
      }
      return { success: false, message: `HTTP ${response.status}` };
    } catch (err) {
      return { success: false, message: err.message };
    }
  });

  // 회의실
  ipcMain.handle('send-meeting-message', async (_e, { message, attachments }) => 
    await sendMeetingMessage(message, attachments)
  );
  
  ipcMain.handle('get-meeting-config', () => config.meeting || {});
  
  ipcMain.handle('set-meeting-config', (_e, meetingConfig) => {
    config.meeting = { ...config.meeting, ...meetingConfig };
    saveConfig();
    return { success: true };
  });

  // 윈도우 제어
  ipcMain.on('open-dashboard', (_e, employeeId) => createDashWindow(employeeId));
  ipcMain.on('close-dashboard', () => { if (dashWindow) dashWindow.close(); });
  ipcMain.on('open-meeting', () => createMeetingWindow());
  ipcMain.on('close-meeting', () => { if (meetingWindow) meetingWindow.close(); });
  ipcMain.on('open-settings', () => createSettingsWindow());
  ipcMain.on('hide-app', () => hideApp());
  ipcMain.on('show-app', () => showApp());
  ipcMain.on('widget-toggle', () => {
    if (widgetWindow?.isVisible()) widgetWindow.hide();
    else widgetWindow?.show();
  });
}

// ─── App Lifecycle ───
app.whenReady().then(() => {
  loadConfig();
  setupIPC();
  createTray();
  createWidgetWindow();
  
  // 글로벌 단축키: Cmd+Shift+H (macOS) / Ctrl+Shift+H (Windows/Linux)
  globalShortcut.register('CommandOrControl+Shift+H', () => toggleAppVisibility());

  // API 키 복원
  if (config.anthropicApiKey) {
    initAnthropic(config.anthropicApiKey);
  } else if (API_KEY) {
    initAnthropic(API_KEY);
  }
  
  // 저장된 Clawdbot 설정 복원
  Object.keys(config.employees).forEach(id => {
    if (employees[id] && config.employees[id].clawdbot) {
      employees[id].clawdbot = config.employees[id].clawdbot;
    }
  });
});

app.on('will-quit', () => { globalShortcut.unregisterAll(); });
app.on('window-all-closed', (e) => { /* 트레이에 남아있음 */ });
app.on('activate', () => { if (!widgetWindow) createWidgetWindow(); });
