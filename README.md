# 🏢 동료들 (AI Office)

한동노무법인의 AI 팀원들이 화면에 상주하며 업무를 지원하는 데스크톱 앱

![Electron](https://img.shields.io/badge/Electron-191970?style=flat&logo=electron&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-AI-orange)

## 👥 AI 캐릭터

| 이름 | 역할 | 전문 분야 |
|------|------|----------|
| 김 변호사 | 법률 자문 | 노동법 소송, 부당해고 구제 |
| 박 노무사 | 인사노무 컨설팅 | 취업규칙, 인사제도 |
| 오 지도사 | 산업안전 | 산안법, 중대재해법 |
| 이 디자이너 | 브랜드 디자인 | PPT, SNS, 마케팅 |
| 정 세무사 | 세무/회계 | 4대보험, 급여정산 |

## ✨ 주요 기능

- **1:1 채팅** - 각 캐릭터와 개별 대화
- **회의실** - 전체 캐릭터 토론 (키워드 기반 자동 응답)
- **파일 업로드** - 이미지, 문서, 텍스트 첨부
- **Clawdbot 연결** - 캐릭터별 Gateway 연결 가능

## 🚀 설치 및 실행

```bash
# 의존성 설치
npm install

# 실행
npm start
```

## ⚙️ 설정

### API 모드 (기본)
- Claude API 직접 호출
- `ANTHROPIC_API_KEY` 환경변수 또는 설정에서 입력

### Clawdbot 모드
- Clawdbot Gateway 연결
- 캐릭터별 개별 Gateway URL 설정 가능

## 📁 구조

```
동료들/
├── main.js           # Electron 메인
├── preload.js        # IPC 브릿지
├── package.json
├── SPEC.md           # 상세 명세서
└── renderer/
    ├── widget.html      # 하단 위젯
    ├── dashboard.html   # 채팅/페르소나
    ├── meeting.html     # 회의실
    └── settings.html    # 설정
```

## 📝 라이선스

Private - 한동노무법인 내부용

---

Made with ❤️ by 강철중
