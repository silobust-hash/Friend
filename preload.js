const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // 직원 관련
  getEmployees: () => ipcRenderer.invoke('get-employees'),
  sendMessage: (employeeId, message) => ipcRenderer.invoke('send-message', { employeeId, message }),
  setStatus: (employeeId, status, statusLabel) => ipcRenderer.invoke('set-status', { employeeId, status, statusLabel }),
  
  // API 키
  setApiKey: (apiKey) => ipcRenderer.invoke('set-api-key', apiKey),
  checkApiKey: () => ipcRenderer.invoke('check-api-key'),
  
  // 설정 관련
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConnectionMode: (mode) => ipcRenderer.invoke('set-connection-mode', mode),
  setEmployeeClawdbot: (employeeId, clawdbotConfig) => 
    ipcRenderer.invoke('set-employee-clawdbot', { employeeId, clawdbotConfig }),
  testClawdbot: (url, token) => ipcRenderer.invoke('test-clawdbot', { url, token }),
  
  // 회의실
  sendMeetingMessage: (message, attachments) => 
    ipcRenderer.invoke('send-meeting-message', { message, attachments }),
  getMeetingConfig: () => ipcRenderer.invoke('get-meeting-config'),
  setMeetingConfig: (config) => ipcRenderer.invoke('set-meeting-config', config),
  
  // 윈도우 제어
  hideApp: () => ipcRenderer.send('hide-app'),
  showApp: () => ipcRenderer.send('show-app'),
  openDashboard: (employeeId) => ipcRenderer.send('open-dashboard', employeeId),
  closeDashboard: () => ipcRenderer.send('close-dashboard'),
  openMeeting: () => ipcRenderer.send('open-meeting'),
  closeMeeting: () => ipcRenderer.send('close-meeting'),
  openSettings: () => ipcRenderer.send('open-settings'),
  
  // 이벤트 리스너
  onSwitchEmployee: (callback) => ipcRenderer.on('switch-employee', (_e, id) => callback(id)),
  onStatusUpdated: (callback) => ipcRenderer.on('status-updated', (_e, data) => callback(data))
});
