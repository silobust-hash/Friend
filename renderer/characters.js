// ─── 정장 입은 전문직 캐릭터 SVG ───
// 공통 파일로 widget.html, dashboard.html 에서 공유

function createCharSVG(id) {
  const chars = {
    // 김 변호사 — 네이비 정장, 짧은 머리, 안경, 진지한 표정
    kim: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skin-k" cx="50%" cy="35%"><stop offset="0%" stop-color="#FFE0BD"/><stop offset="100%" stop-color="#F5C89A"/></radialGradient>
        <linearGradient id="suit-k" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2744"/><stop offset="100%" stop-color="#0f1a2e"/></linearGradient>
      </defs>
      <g class="char-body" transform="translate(0,20)">
        <!-- 몸 (정장) -->
        <path d="M35 78 Q32 76 28 82 L22 110 Q20 118 30 118 L90 118 Q100 118 98 110 L92 82 Q88 76 85 78 L75 82 Q60 90 45 82 Z" fill="url(#suit-k)"/>
        <!-- 셔츠 칼라 -->
        <path d="M48 78 L60 88 L72 78" fill="none" stroke="#fff" stroke-width="2.5"/>
        <!-- 넥타이 -->
        <path d="M60 84 L56 105 L60 110 L64 105 Z" fill="#C0392B"/>
        <circle cx="60" cy="84" r="2.5" fill="#922B21"/>
        <!-- 흔드는 손 -->
        <g class="char-hand">
          <path d="M95 75 Q100 70 102 62 Q104 56 100 54 Q96 52 94 58 Q92 54 88 56 Q86 58 88 64 L85 72 Z" fill="#F5C89A"/>
          <path d="M88 72 L85 78" stroke="#1a2744" stroke-width="4" stroke-linecap="round"/>
        </g>
        <!-- 머리 -->
        <circle cx="60" cy="48" r="30" fill="url(#skin-k)"/>
        <!-- 헤어 -->
        <path d="M30 42 Q32 18 60 14 Q88 18 90 42 Q86 36 78 34 Q72 20 60 18 Q48 20 42 34 Q34 36 30 42Z" fill="#1a1a2e"/>
        <!-- 안경 -->
        <rect x="42" y="41" width="14" height="11" rx="5" fill="none" stroke="#333" stroke-width="1.8"/>
        <rect x="64" y="41" width="14" height="11" rx="5" fill="none" stroke="#333" stroke-width="1.8"/>
        <line x1="56" y1="46" x2="64" y2="46" stroke="#333" stroke-width="1.5"/>
        <!-- 눈 -->
        <g class="char-eyes">
          <ellipse cx="49" cy="46" rx="3" ry="3.5" fill="#1a1a2e"/>
          <ellipse cx="71" cy="46" rx="3" ry="3.5" fill="#1a1a2e"/>
          <circle cx="50" cy="45" r="1.2" fill="#fff"/>
          <circle cx="72" cy="45" r="1.2" fill="#fff"/>
        </g>
        <!-- 입 -->
        <path class="char-mouth" d="M53 60 Q60 63 67 60" stroke="#C0846A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <!-- 호버 시 웃는 입 -->
        <path class="char-mouth-smile" d="M50 58 Q60 68 70 58" stroke="#C0846A" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- 귀 -->
        <ellipse cx="30" cy="48" rx="4" ry="6" fill="#F5C89A"/>
        <ellipse cx="90" cy="48" rx="4" ry="6" fill="#F5C89A"/>
      </g>
    </svg>`,

    // 박 노무사 — 보라 정장, 여성, 숏컷, 부드러운 미소
    park: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skin-p" cx="50%" cy="35%"><stop offset="0%" stop-color="#FFECD2"/><stop offset="100%" stop-color="#F5D0A9"/></radialGradient>
        <linearGradient id="suit-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6C3483"/><stop offset="100%" stop-color="#4A235A"/></linearGradient>
      </defs>
      <g class="char-body" transform="translate(0,20)">
        <!-- 몸 (정장) -->
        <path d="M35 78 Q32 76 28 82 L22 110 Q20 118 30 118 L90 118 Q100 118 98 110 L92 82 Q88 76 85 78 L75 82 Q60 90 45 82 Z" fill="url(#suit-p)"/>
        <!-- 블라우스 -->
        <path d="M48 78 L60 86 L72 78" fill="none" stroke="#E8DAEF" stroke-width="2.5"/>
        <!-- 브로치 -->
        <circle cx="60" cy="86" r="3" fill="#F1C40F" stroke="#E67E22" stroke-width="0.5"/>
        <!-- 흔드는 손 -->
        <g class="char-hand">
          <path d="M95 75 Q100 70 102 62 Q104 56 100 54 Q96 52 94 58 Q92 54 88 56 Q86 58 88 64 L85 72 Z" fill="#F5D0A9"/>
          <path d="M88 72 L85 78" stroke="#6C3483" stroke-width="4" stroke-linecap="round"/>
        </g>
        <!-- 머리 -->
        <circle cx="60" cy="48" r="30" fill="url(#skin-p)"/>
        <!-- 헤어 — 숏보브 -->
        <path d="M26 45 Q28 12 60 10 Q92 12 94 45 Q92 40 86 36 Q80 16 60 14 Q40 16 34 36 Q28 40 26 45Z" fill="#2C1810"/>
        <path d="M26 45 Q25 58 30 65" stroke="#2C1810" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M94 45 Q95 58 90 65" stroke="#2C1810" stroke-width="8" fill="none" stroke-linecap="round"/>
        <!-- 눈 -->
        <g class="char-eyes">
          <ellipse cx="48" cy="46" rx="3.5" ry="4" fill="#2C1810"/>
          <ellipse cx="72" cy="46" rx="3.5" ry="4" fill="#2C1810"/>
          <circle cx="49" cy="45" r="1.5" fill="#fff"/>
          <circle cx="73" cy="45" r="1.5" fill="#fff"/>
        </g>
        <!-- 속눈썹 -->
        <path d="M43 42 L45 40" stroke="#2C1810" stroke-width="1" stroke-linecap="round"/>
        <path d="M67 42 L69 40" stroke="#2C1810" stroke-width="1" stroke-linecap="round"/>
        <!-- 볼터치 -->
        <ellipse cx="40" cy="54" rx="5" ry="3" fill="rgba(231,76,60,0.12)"/>
        <ellipse cx="80" cy="54" rx="5" ry="3" fill="rgba(231,76,60,0.12)"/>
        <!-- 입 -->
        <path class="char-mouth" d="M52 60 Q60 66 68 60" stroke="#D35400" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path class="char-mouth-smile" d="M49 58 Q60 70 71 58" stroke="#D35400" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- 귀 -->
        <ellipse cx="30" cy="48" rx="3" ry="5" fill="#F5D0A9"/>
        <ellipse cx="90" cy="48" rx="3" ry="5" fill="#F5D0A9"/>
        <!-- 귀걸이 -->
        <circle cx="30" cy="55" r="2" fill="#F1C40F"/>
        <circle cx="90" cy="55" r="2" fill="#F1C40F"/>
      </g>
    </svg>`,

    // 오 산업안전지도사 — 안전모+정장, 단단한 체격, 헬멧
    oh: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skin-o" cx="50%" cy="35%"><stop offset="0%" stop-color="#FFD5B5"/><stop offset="100%" stop-color="#E8B88A"/></radialGradient>
        <linearGradient id="suit-o" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7D6608"/><stop offset="100%" stop-color="#5D4E06"/></linearGradient>
      </defs>
      <g class="char-body" transform="translate(0,20)">
        <!-- 몸 (좀 더 넓은 어깨) -->
        <path d="M32 78 Q28 76 24 82 L18 110 Q16 118 28 118 L92 118 Q104 118 102 110 L96 82 Q92 76 88 78 L76 82 Q60 90 44 82 Z" fill="url(#suit-o)"/>
        <!-- 셔츠 -->
        <path d="M46 78 L60 88 L74 78" fill="none" stroke="#fff" stroke-width="2.5"/>
        <!-- 넥타이 -->
        <path d="M60 85 L57 102 L60 106 L63 102 Z" fill="#E67E22"/>
        <!-- 흔드는 손 -->
        <g class="char-hand">
          <path d="M98 73 Q103 68 105 60 Q107 54 103 52 Q99 50 97 56 Q95 52 91 54 Q89 56 91 62 L88 70 Z" fill="#E8B88A"/>
          <path d="M91 70 L88 78" stroke="#7D6608" stroke-width="5" stroke-linecap="round"/>
        </g>
        <!-- 머리 -->
        <circle cx="60" cy="50" r="28" fill="url(#skin-o)"/>
        <!-- 헤어 (짧은 크루컷) -->
        <path d="M32 44 Q36 22 60 18 Q84 22 88 44 Q84 38 76 36 Q70 24 60 22 Q50 24 44 36 Q36 38 32 44Z" fill="#3E2723"/>
        <!-- 안전모 -->
        <path d="M28 38 Q30 16 60 12 Q90 16 92 38 L88 40 Q86 22 60 18 Q34 22 32 40 Z" fill="#F39C12"/>
        <rect x="28" y="36" width="64" height="6" rx="3" fill="#E67E22"/>
        <!-- 눈 -->
        <g class="char-eyes">
          <ellipse cx="48" cy="48" rx="3.5" ry="3" fill="#3E2723"/>
          <ellipse cx="72" cy="48" rx="3.5" ry="3" fill="#3E2723"/>
          <circle cx="49" cy="47" r="1.2" fill="#fff"/>
          <circle cx="73" cy="47" r="1.2" fill="#fff"/>
        </g>
        <!-- 눈썹 (진한) -->
        <path d="M42 42 Q48 39 54 42" stroke="#3E2723" stroke-width="2" fill="none"/>
        <path d="M66 42 Q72 39 78 42" stroke="#3E2723" stroke-width="2" fill="none"/>
        <!-- 입 -->
        <path class="char-mouth" d="M53 62 L67 62" stroke="#8D6E63" stroke-width="2" stroke-linecap="round"/>
        <path class="char-mouth-smile" d="M51 60 Q60 68 69 60" stroke="#8D6E63" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- 귀 -->
        <ellipse cx="32" cy="50" rx="4" ry="6" fill="#E8B88A"/>
        <ellipse cx="88" cy="50" rx="4" ry="6" fill="#E8B88A"/>
      </g>
    </svg>`,

    // 이 디자이너 — 세련된 블랙 재킷, 여성, 긴 웨이브 머리, 빨간 립
    lee: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skin-l" cx="50%" cy="35%"><stop offset="0%" stop-color="#FFF0E0"/><stop offset="100%" stop-color="#FFD8B8"/></radialGradient>
        <linearGradient id="suit-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#0d0d0d"/></linearGradient>
      </defs>
      <g class="char-body" transform="translate(0,20)">
        <!-- 몸 (블랙 재킷) -->
        <path d="M35 78 Q32 76 28 82 L22 110 Q20 118 30 118 L90 118 Q100 118 98 110 L92 82 Q88 76 85 78 L75 82 Q60 90 45 82 Z" fill="url(#suit-l)"/>
        <!-- 이너 -->
        <path d="M48 78 L60 87 L72 78" fill="none" stroke="#E74C3C" stroke-width="2"/>
        <!-- 목걸이 -->
        <path d="M50 76 Q60 80 70 76" fill="none" stroke="#F1C40F" stroke-width="1"/>
        <circle cx="60" cy="80" r="2" fill="#F1C40F"/>
        <!-- 흔드는 손 -->
        <g class="char-hand">
          <path d="M95 75 Q100 70 102 62 Q104 56 100 54 Q96 52 94 58 Q92 54 88 56 Q86 58 88 64 L85 72 Z" fill="#FFD8B8"/>
          <path d="M88 72 L85 78" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
        </g>
        <!-- 머리 -->
        <circle cx="60" cy="48" r="30" fill="url(#skin-l)"/>
        <!-- 긴 웨이브 헤어 -->
        <path d="M24 44 Q26 10 60 8 Q94 10 96 44 Q94 38 88 34 Q82 14 60 12 Q38 14 32 34 Q26 38 24 44Z" fill="#1a0a0a"/>
        <path d="M24 44 Q22 68 28 82 Q30 86 32 82 Q28 68 30 50" fill="#1a0a0a"/>
        <path d="M96 44 Q98 68 92 82 Q90 86 88 82 Q92 68 90 50" fill="#1a0a0a"/>
        <!-- 웨이브 디테일 -->
        <path d="M26 55 Q24 65 28 75" stroke="#2a1515" stroke-width="2" fill="none"/>
        <path d="M94 55 Q96 65 92 75" stroke="#2a1515" stroke-width="2" fill="none"/>
        <!-- 눈 (큰 눈) -->
        <g class="char-eyes">
          <ellipse cx="48" cy="46" rx="4" ry="5" fill="#1a0a0a"/>
          <ellipse cx="72" cy="46" rx="4" ry="5" fill="#1a0a0a"/>
          <circle cx="49" cy="44.5" r="1.8" fill="#fff"/>
          <circle cx="73" cy="44.5" r="1.8" fill="#fff"/>
        </g>
        <!-- 속눈썹 -->
        <path d="M42 41 L44 38" stroke="#1a0a0a" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M46 40 L47 37" stroke="#1a0a0a" stroke-width="1" stroke-linecap="round"/>
        <path d="M66 41 L68 38" stroke="#1a0a0a" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M70 40 L71 37" stroke="#1a0a0a" stroke-width="1" stroke-linecap="round"/>
        <!-- 볼터치 -->
        <ellipse cx="39" cy="54" rx="5" ry="3.5" fill="rgba(231,76,60,0.15)"/>
        <ellipse cx="81" cy="54" rx="5" ry="3.5" fill="rgba(231,76,60,0.15)"/>
        <!-- 빨간 립 -->
        <path class="char-mouth" d="M52 60 Q60 67 68 60" stroke="#E74C3C" stroke-width="2.5" fill="rgba(231,76,60,0.3)" stroke-linecap="round"/>
        <path class="char-mouth-smile" d="M49 58 Q60 70 71 58" stroke="#E74C3C" stroke-width="2.5" fill="rgba(231,76,60,0.4)" stroke-linecap="round"/>
        <!-- 귀 -->
        <ellipse cx="30" cy="48" rx="3" ry="5" fill="#FFD8B8"/>
        <ellipse cx="90" cy="48" rx="3" ry="5" fill="#FFD8B8"/>
        <!-- 귀걸이 -->
        <circle cx="30" cy="55" r="2.5" fill="#E74C3C"/>
        <circle cx="90" cy="55" r="2.5" fill="#E74C3C"/>
      </g>
    </svg>`,

    // 정 세무사 — 그레이 정장, 남성, 깔끔한 올백, 차분한 인상
    jung: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="skin-j" cx="50%" cy="35%"><stop offset="0%" stop-color="#FFE0C0"/><stop offset="100%" stop-color="#F0C8A0"/></radialGradient>
        <linearGradient id="suit-j" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a4a5a"/><stop offset="100%" stop-color="#2d2d3a"/></linearGradient>
      </defs>
      <g class="char-body" transform="translate(0,20)">
        <!-- 몸 (그레이 정장) -->
        <path d="M35 78 Q32 76 28 82 L22 110 Q20 118 30 118 L90 118 Q100 118 98 110 L92 82 Q88 76 85 78 L75 82 Q60 90 45 82 Z" fill="url(#suit-j)"/>
        <!-- 셔츠 -->
        <path d="M48 78 L60 88 L72 78" fill="none" stroke="#ECF0F1" stroke-width="2.5"/>
        <!-- 넥타이 -->
        <path d="M60 84 L56 105 L60 110 L64 105 Z" fill="#27AE60"/>
        <circle cx="60" cy="84" r="2" fill="#1E8449"/>
        <!-- 포켓치프 -->
        <path d="M36 88 Q38 84 40 88" fill="#27AE60"/>
        <!-- 흔드는 손 -->
        <g class="char-hand">
          <path d="M95 75 Q100 70 102 62 Q104 56 100 54 Q96 52 94 58 Q92 54 88 56 Q86 58 88 64 L85 72 Z" fill="#F0C8A0"/>
          <path d="M88 72 L85 78" stroke="#4a4a5a" stroke-width="4" stroke-linecap="round"/>
        </g>
        <!-- 머리 -->
        <circle cx="60" cy="48" r="30" fill="url(#skin-j)"/>
        <!-- 올백 헤어 -->
        <path d="M30 40 Q34 16 60 12 Q86 16 90 40 Q86 34 78 30 Q70 18 60 16 Q50 18 42 30 Q34 34 30 40Z" fill="#2C3E50"/>
        <path d="M30 40 Q32 36 36 34" stroke="#34495E" stroke-width="1.5" fill="none"/>
        <path d="M90 40 Q88 36 84 34" stroke="#34495E" stroke-width="1.5" fill="none"/>
        <!-- 눈 -->
        <g class="char-eyes">
          <ellipse cx="48" cy="46" rx="3" ry="3.5" fill="#2C3E50"/>
          <ellipse cx="72" cy="46" rx="3" ry="3.5" fill="#2C3E50"/>
          <circle cx="49" cy="45" r="1.3" fill="#fff"/>
          <circle cx="73" cy="45" r="1.3" fill="#fff"/>
        </g>
        <!-- 눈썹 -->
        <path d="M42 40 Q48 38 54 40" stroke="#2C3E50" stroke-width="1.8" fill="none"/>
        <path d="M66 40 Q72 38 78 40" stroke="#2C3E50" stroke-width="1.8" fill="none"/>
        <!-- 입 -->
        <path class="char-mouth" d="M53 60 Q60 64 67 60" stroke="#B07850" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path class="char-mouth-smile" d="M50 58 Q60 68 70 58" stroke="#B07850" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- 귀 -->
        <ellipse cx="30" cy="48" rx="4" ry="6" fill="#F0C8A0"/>
        <ellipse cx="90" cy="48" rx="4" ry="6" fill="#F0C8A0"/>
      </g>
    </svg>`
  };
  return chars[id] || chars.kim;
}

// Node.js 환경 지원
if (typeof module !== 'undefined') module.exports = { createCharSVG };
