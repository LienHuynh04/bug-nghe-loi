// Mèo Bug vẽ kiểu ANIME bằng SVG (file chữ, không cần ảnh) — giữ đúng đặc điểm của Bug:
// lông xám dài, mắt vàng, ngực + chân trắng, vòng cổ hoa xanh. 9 biểu cảm theo hành động.
// Hàm thuần trả về chuỗi SVG để vừa dùng trong React vừa xuất file kiểm tra hình được.

export type CatExpr = 'normal' | 'happy' | 'excited' | 'sleep' | 'content' | 'meow' | 'focused' | 'angry' | 'love';

const INK = '#454b54';

function eyeOpen(cx: number, pupilR = 8, look = 0): string {
  return `
  <ellipse cx="${cx}" cy="178" rx="17" ry="21" fill="#f7bd27" stroke="${INK}" stroke-width="2.5"/>
  <ellipse cx="${cx}" cy="${178 + look}" rx="${pupilR}" ry="${pupilR + 5}" fill="#26221f"/>
  <circle cx="${cx + 5}" cy="${170 + look}" r="4.6" fill="#fff"/>
  <circle cx="${cx - 4}" cy="${184 + look}" r="2.2" fill="#fff" opacity="0.9"/>`;
}

function eyes(e: CatExpr): string {
  const L = 168;
  const R = 272;
  switch (e) {
    case 'happy':
      return `<path d="M${L - 18},184 q18,-24 36,0" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/>
              <path d="M${R - 18},184 q18,-24 36,0" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round"/>`;
    case 'sleep':
      return `<path d="M${L - 18},174 q18,13 36,0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
              <path d="M${R - 18},174 q18,13 36,0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
              <path d="M${L - 14},186 l-6,6 M${R + 14},186 l6,6" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    case 'content':
      return `<path d="M${L - 18},180 q18,-16 36,0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
              <path d="M${R - 18},180 q18,-16 36,0" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
              <path d="M${L - 12},188 q12,7 24,0 M${R - 12},188 q12,7 24,0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/>`;
    case 'excited':
      return `${eyeOpen(L, 9)}${eyeOpen(R, 9)}
              <path d="M96,104 l4.5,11 11,4.5 -11,4.5 -4.5,11 -4.5,-11 -11,-4.5 11,-4.5 Z" fill="#ffd84a"/>
              <path d="M336,88 l3.5,9 9,3.5 -9,3.5 -3.5,9 -3.5,-9 -9,-3.5 9,-3.5 Z" fill="#ffd84a"/>`;
    case 'meow':
      return eyeOpen(L, 7, -4) + eyeOpen(R, 7, -4);
    case 'focused':
      return `<path d="M${L - 20},146 l38,-7 M${R + 20},146 l-38,-7" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>
              <ellipse cx="${L}" cy="180" rx="19" ry="24" fill="#f7bd27" stroke="${INK}" stroke-width="2.5"/>
              <ellipse cx="${R}" cy="180" rx="19" ry="24" fill="#f7bd27" stroke="${INK}" stroke-width="2.5"/>
              <ellipse cx="${L}" cy="180" rx="10" ry="16" fill="#26221f"/><ellipse cx="${R}" cy="180" rx="10" ry="16" fill="#26221f"/>
              <circle cx="${L + 5}" cy="171" r="5" fill="#fff"/><circle cx="${R + 5}" cy="171" r="5" fill="#fff"/>`;
    case 'angry':
      return `<path d="M${L - 21},140 l40,13 M${R + 21},140 l-40,13" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
              <ellipse cx="${L}" cy="182" rx="17" ry="20" fill="#f7bd27" stroke="${INK}" stroke-width="2.5"/>
              <ellipse cx="${R}" cy="182" rx="17" ry="20" fill="#f7bd27" stroke="${INK}" stroke-width="2.5"/>
              <ellipse cx="${L}" cy="186" rx="8" ry="12" fill="#26221f"/><ellipse cx="${R}" cy="186" rx="8" ry="12" fill="#26221f"/>
              <path d="M${L - 19},164 h38 M${R - 19},164 h38" stroke="#8d97a3" stroke-width="11" stroke-linecap="round"/>
              <circle cx="${L + 5}" cy="176" r="4" fill="#fff"/><circle cx="${R + 5}" cy="176" r="4" fill="#fff"/>`;
    case 'love': {
      const heart = (cx: number) =>
        `<path d="M${cx},196 c-26,-16 -30,-30 -15,-38 c9,-5 15,0 15,6 c0,-6 6,-11 15,-6 c15,8 11,22 -15,38 Z" fill="#f4537f" stroke="#d12d5f" stroke-width="2.5"/>`;
      return heart(L) + heart(R);
    }
    default:
      return eyeOpen(L) + eyeOpen(R);
  }
}

function mouth(e: CatExpr): string {
  switch (e) {
    case 'sleep':
      return `<ellipse cx="220" cy="234" rx="5" ry="6.5" fill="#7c4450"/>`;
    case 'meow':
      return `<ellipse cx="220" cy="240" rx="13" ry="16" fill="#7c2d3e"/>
              <ellipse cx="220" cy="247" rx="8" ry="6" fill="#f28ba0"/>`;
    case 'excited':
    case 'love':
      return `<path d="M203,226 q17,20 34,0 q-4,14 -17,14 q-13,0 -17,-14 Z" fill="#7c2d3e"/>
              <path d="M211,236 q9,6 18,0 q-3,7 -9,7 q-6,0 -9,-7 Z" fill="#f28ba0"/>`;
    case 'angry':
      return `<path d="M207,238 q13,-8 26,0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    case 'focused':
      return `<path d="M209,232 h22" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
              <path d="M206,232 l5,9 5,-9 Z" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`;
    case 'content':
      return `<path d="M220,226 q-4,8 -13,5 M220,226 q4,8 13,5" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
              <circle cx="196" cy="240" r="4" fill="#b5762f"/><circle cx="246" cy="243" r="3.4" fill="#b5762f"/>`;
    default: // normal + happy: miệng mèo chữ ω
      return `<path d="M220,226 q-5,9 -15,5 M220,226 q5,9 15,5" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  }
}

export function animeCatSvg(e: CatExpr): string {
  const blush = e === 'love' || e === 'content' || e === 'excited' ? 0.9 : 0.5;
  return `<svg viewBox="0 0 440 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mèo Bug anime">
  <defs>
    <linearGradient id="fur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a7b1bc"/><stop offset="0.55" stop-color="#8d97a3"/><stop offset="1" stop-color="#767f8a"/>
    </linearGradient>
    <linearGradient id="furDark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#98a2ad"/><stop offset="1" stop-color="#6e7782"/>
    </linearGradient>
  </defs>

  <!-- đuôi xù quấn bên phải -->
  <path d="M318,318 q96,6 88,44 q-6,26 -52,20 q-38,-5 -44,-34" fill="none" stroke="url(#furDark)" stroke-width="36" stroke-linecap="round"/>
  <path d="M368,330 q14,4 20,14 M342,318 q10,8 12,20" stroke="#5d656f" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.7"/>

  <!-- thân ngồi -->
  <ellipse cx="220" cy="302" rx="152" ry="86" fill="url(#fur)"/>
  <path d="M96,268 l-14,16 16,6 -12,14 18,4 M344,268 l14,16 -16,6 12,14 -18,4" fill="#8d97a3"/>
  <!-- ngực trắng + viền lông -->
  <path d="M220,238 q10,16 22,8 q-2,18 10,24 q-16,4 -14,18 q-12,-8 -18,-2 q-6,-6 -18,2 q2,-14 -14,-18 q12,-6 10,-24 q12,8 22,-8 Z" fill="#f8f4ec"/>
  <ellipse cx="220" cy="318" rx="66" ry="48" fill="#f8f4ec"/>

  <!-- tai -->
  <path d="M126,88 L152,8 L202,62 Q164,44 126,88 Z" fill="url(#furDark)"/>
  <path d="M314,88 L288,8 L238,62 Q276,44 314,88 Z" fill="url(#furDark)"/>
  <path d="M140,74 L156,30 L186,58 Q162,50 140,74 Z" fill="#f6a8b8"/>
  <path d="M300,74 L284,30 L254,58 Q278,50 300,74 Z" fill="#f6a8b8"/>

  <!-- đầu -->
  <circle cx="220" cy="168" r="120" fill="url(#fur)"/>
  <path d="M104,196 l-18,10 16,10 -14,12 20,4 M336,196 l18,10 -16,10 14,12 -20,4" fill="#8d97a3"/>
  <path d="M196,52 q6,-14 14,-4 q4,-12 12,-6 q8,-8 12,2 q10,-6 12,6" fill="none" stroke="#8d97a3" stroke-width="7" stroke-linecap="round"/>
  <!-- vệt lông trán -->
  <path d="M196,66 q4,12 0,22 M220,60 q2,14 0,26 M244,66 q-4,12 0,22" stroke="#79828d" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.65"/>

  <!-- má hồng -->
  <ellipse cx="126" cy="222" rx="21" ry="11" fill="#f9a8b8" opacity="${blush}"/>
  <ellipse cx="314" cy="222" rx="21" ry="11" fill="#f9a8b8" opacity="${blush}"/>

  ${eyes(e)}

  <!-- mũi + miệng -->
  <path d="M211,212 q9,-6 18,0 q-2,9 -9,11 q-7,-2 -9,-11 Z" fill="#d96a7f"/>
  ${mouth(e)}

  <!-- râu -->
  <g stroke="#eef2f6" stroke-width="3.4" stroke-linecap="round" opacity="0.85">
    <path d="M120,206 q-44,-6 -74,4 M124,224 q-40,4 -68,18 M130,240 q-34,12 -54,30"/>
    <path d="M320,206 q44,-6 74,4 M316,224 q40,4 68,18 M310,240 q34,12 54,30"/>
  </g>

  <!-- vòng cổ hoa xanh (dấu hiệu nhận biết của Bug) -->
  <path d="M148,262 Q220,296 292,262 L292,280 Q220,314 148,280 Z" fill="#7cc4de"/>
  <g>
    <circle cx="220" cy="284" r="8" fill="#ffd84a"/>
    <circle cx="220" cy="268" r="10.5" fill="#a5dcf0"/><circle cx="235" cy="277" r="10.5" fill="#a5dcf0"/>
    <circle cx="231" cy="292" r="10.5" fill="#a5dcf0"/><circle cx="209" cy="292" r="10.5" fill="#a5dcf0"/>
    <circle cx="205" cy="277" r="10.5" fill="#a5dcf0"/>
    <circle cx="220" cy="283" r="6.5" fill="#ffd84a"/>
  </g>

  <!-- hai chân trắng trước -->
  <g>
    <rect x="146" y="336" width="62" height="42" rx="19" fill="#f8f4ec"/>
    <rect x="232" y="336" width="62" height="42" rx="19" fill="#f8f4ec"/>
    <path d="M168,346 v14 M188,346 v14 M254,346 v14 M274,346 v14" stroke="#c9cfd6" stroke-width="4" stroke-linecap="round"/>
  </g>
</svg>`;
}

/** Ánh xạ hành động của game -> biểu cảm */
export const EXPR_BY_ACTION: Record<string, CatExpr> = {
  idle: 'normal',
  nhay: 'excited',
  chay: 'happy',
  ngu: 'sleep',
  an: 'content',
  keu: 'meow',
  lan: 'happy',
  duoi: 'focused',
  gian: 'angry',
  thuong: 'love',
};
