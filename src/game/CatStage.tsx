import type { CatState } from './useCat';
import { ACTIONS } from './cat';
import { animeCatSvg, EXPR_BY_ACTION } from './animeCat';
import './cat.css';

const HEART_POS = [90, 210, 340, 470, 590, 720, 850, 950];
const FLOATERS = ['❤️', '💗', '💕', '❤️', '💖'];

/**
 * Sân khấu Bug Nghe Lời: căn phòng vẽ bằng CSS/SVG, giữa phòng là BUG THẬT
 * (bản vẽ SVG trong src/game/animeCat.ts). Người xem gõ lệnh, Bug làm động tác tương ứng.
 */
export function CatStage({ game }: { game: CatState }) {
  const v = game.view;
  const action = v?.action ?? 'idle';
  const likePct = v ? Math.min(100, ((v.likeTotal % v.likeGoal) / v.likeGoal) * 100) : 0;

  return (
    <div className="relative h-[1920px] w-[1080px] overflow-hidden" style={{ background: 'linear-gradient(180deg, #fff3da 0%, #ffe3ba 55%, #f7cf9d 61.5%, #b57e42 62%, #9a652c 100%)' }}>
      {/* vân sàn gỗ */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] opacity-25" style={{ background: 'repeating-linear-gradient(180deg, transparent 0 52px, rgba(60,32,8,.6) 52px 56px)' }} />
      {/* ván chân tường */}
      <div className="absolute inset-x-0 top-[1172px] h-[18px] bg-[#8a5a2b]" />

      {/* cửa sổ bên trái */}
      <div className="absolute left-[54px] top-[300px] h-[400px] w-[310px]">
        <div className="absolute inset-0 overflow-hidden rounded-2xl ring-[10px] ring-[#a9743f]" style={{ background: 'linear-gradient(180deg, #aee3ff 0%, #d8f3ff 70%, #fef9c3 100%)' }}>
          <div className="absolute left-[26px] top-[22px] text-[64px]">☀️</div>
          <div className="absolute right-[30px] top-[70px] h-[34px] w-[120px] rounded-full bg-white/90" />
          <div className="absolute right-[64px] top-[52px] h-[44px] w-[76px] rounded-full bg-white/90" />
          <div className="absolute left-[36px] top-[190px] h-[30px] w-[104px] rounded-full bg-white/80" />
          <div className="absolute inset-y-0 left-1/2 w-[8px] bg-[#a9743f]" />
          <div className="absolute inset-x-0 top-1/2 h-[8px] bg-[#a9743f]" />
          <div className="absolute bottom-[16px] left-[24px] text-[40px]">🌷</div>
          <div className="absolute bottom-[16px] right-[24px] text-[40px]">🌻</div>
        </div>
        <div className="absolute -left-[14px] -top-[16px] h-[440px] w-[52px] rounded-b-3xl bg-[#f472b6]" />
        <div className="absolute -right-[14px] -top-[16px] h-[440px] w-[52px] rounded-b-3xl bg-[#f472b6]" />
      </div>

      {/* tranh treo tường */}
      <div className="absolute left-[86px] top-[790px] flex gap-5">
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-[#fff8ea] text-[58px] ring-8 ring-[#a9743f]">🐾</div>
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-[#fff8ea] text-[58px] ring-8 ring-[#a9743f]">🐟</div>
      </div>

      {/* đèn treo + quầng sáng ấm */}
      <div className="absolute left-1/2 top-0 h-[560px] w-[700px] -translate-x-1/2 rounded-full opacity-50" style={{ background: 'radial-gradient(closest-side, #ffedb5, transparent)' }} />
      <div className="absolute left-1/2 top-0 h-[170px] w-[6px] -translate-x-1/2 bg-[#7c4f24]" />
      <div className="absolute left-1/2 top-[164px] -translate-x-1/2 text-[86px]">💡</div>

      {/* bảng tên phòng */}
      <div className="absolute inset-x-0 top-[36px] text-center">
        <div className="mx-auto w-fit rounded-full px-10 py-2.5 shadow-lg ring-4 ring-white/70" style={{ background: 'linear-gradient(180deg, #fb9ec7, #f472b6)' }}>
          <span className="font-['Dancing_Script'] text-[74px] leading-none text-white" style={{ textShadow: '0 3px 0 rgba(160,40,90,.4)' }}>
            {game.channelName}
          </span>
        </div>
        <div className="mt-2.5 text-[27px] font-bold uppercase tracking-[0.22em] text-[#9a4a12]">🐱 Gõ lệnh gì, Bug làm nấy 🐱</div>
      </div>

      {/* thông báo quà */}
      {game.lastGift && Date.now() - game.lastGift.at < 6000 && (
        <div key={game.lastGift.at} className="cat-toast absolute inset-x-[130px] top-[238px] z-40 rounded-2xl bg-[#7c3aed]/90 px-6 py-3 text-center text-[29px] font-semibold text-white ring-2 ring-amber-200/60">
          🎁 {game.lastGift.nickname} vừa tặng {game.lastGift.giftName}
          {game.lastGift.repeatCount > 1 ? ` ×${game.lastGift.repeatCount}` : ''}
        </div>
      )}

      {/* bảng lệnh bên phải: lệnh đang làm sẽ sáng lên */}
      <div className="absolute right-[44px] top-[300px] w-[296px] rounded-3xl bg-[#173d2e]/92 p-4 shadow-xl ring-4 ring-[#a9743f]">
        <div className="mb-2 text-center text-[27px] font-extrabold text-[#ffd84a]">📋 Bảng lệnh</div>
        <div className="space-y-1.5">
          {ACTIONS.map((a) => (
            <div key={a.key} className={`flex items-center gap-2.5 rounded-xl px-3 py-1.5 ${action === a.key ? 'cat-pop bg-emerald-500/85 ring-2 ring-emerald-200' : 'bg-white/8'}`}>
              <span className="text-[26px]">{a.emoji}</span>
              <span className="text-[25px] font-bold text-white">{a.label}</span>
              {action === a.key && <span className="ml-auto text-[22px] text-white">▶ đang làm</span>}
            </div>
          ))}
        </div>
        <div className="mt-2.5 text-center text-[21px] leading-snug text-white/65">Gõ đúng chữ lệnh vào bình luận là Bug làm theo</div>
      </div>

      {/* cây cào móng trang trí bên phải */}
      <div className="absolute bottom-[330px] right-[64px] w-[150px]">
        <div className="mx-auto h-[26px] w-[150px] rounded-xl bg-[#c98d54] ring-4 ring-[#8a5a2b]" />
        <div className="mx-auto h-[210px] w-[34px] bg-[#d9a05f] ring-4 ring-[#8a5a2b]" style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 12px, rgba(122,72,20,.35) 12px 15px)' }} />
        <div className="mx-auto h-[26px] w-[130px] rounded-xl bg-[#c98d54] ring-4 ring-[#8a5a2b]" />
      </div>
      {/* chậu cây bên trái */}
      <div className="absolute bottom-[318px] left-[60px] text-center">
        <div className="text-[92px] leading-none">🪴</div>
      </div>

      {/* thảm */}
      <div className="absolute left-1/2 top-[1470px] h-[240px] w-[920px] -translate-x-1/2 rounded-[50%]" style={{ background: 'radial-gradient(closest-side, #fda4af 0%, #fb7185 62%, #e11d48 100%)', opacity: 0.92 }} />
      <div className="absolute left-1/2 top-[1510px] h-[160px] w-[700px] -translate-x-1/2 rounded-[50%] bg-[#fff1f2]/50" />

      {/* bát hạt */}
      <div className="absolute left-[806px] top-[1560px] z-20 text-center">
        <div className="text-[96px] leading-none drop-shadow">🥣</div>
        <div className="mx-auto -mt-3 w-fit rounded-full bg-black/40 px-3 py-0.5 text-[21px] font-bold text-white">bát hạt</div>
      </div>

      {/* mưa tim khi đủ 100 tim */}
      {v?.hearts &&
        HEART_POS.map((x, i) => (
          <span key={i} className="cat-rain absolute top-[-40px] z-30 text-[54px]" style={{ left: `${x}px`, animationDelay: `${(i % 4) * 0.55}s` }}>
            {FLOATERS[i % FLOATERS.length]}
          </span>
        ))}

      {!v && <div className="absolute inset-0 flex items-center justify-center text-[34px] font-semibold text-[#9a4a12]">Đang gọi Bug ra…</div>}

      {v && (
        <>
          {/* bong bóng thoại */}
          <div className="cat-pop absolute left-1/2 top-[906px] z-30 w-fit max-w-[880px] -translate-x-1/2" key={`${v.action}-${v.byName}`}>
            <div className="flex items-center gap-3 rounded-[26px] bg-white px-6 py-3 shadow-xl ring-2 ring-[#f472b6]/50">
              {v.byAvatar ? <img src={v.byAvatar} alt="" className="h-[52px] w-[52px] rounded-full" /> : null}
              <span className="whitespace-nowrap text-[31px] font-bold text-[#7c2d4e]">
                {action === 'idle' ? '💤 Bug đang nằm nghỉ, chờ lệnh của cả nhà…' : `${v.emoji} Bug đang ${v.label}${v.byName ? ` theo lệnh của ${v.byName}` : ''}`}
              </span>
            </div>
            <div className="mx-auto h-0 w-0 border-x-[16px] border-t-[18px] border-x-transparent border-t-white" />
            {action !== 'idle' && (
              <div className="mx-auto mt-1 h-[10px] w-[380px] overflow-hidden rounded-full bg-black/25">
                <div className="h-full bg-[#f472b6]" style={{ width: `${Math.round(v.progress * 100)}%` }} />
              </div>
            )}
          </div>

          {/* hiệu ứng theo động tác */}
          <div className="absolute left-1/2 top-[1010px] z-20 h-[680px] w-[900px] -translate-x-1/2">
            {action === 'ngu' && (
              <>
                <span className="cat-zzz absolute right-[190px] top-[10px] text-[64px] font-extrabold text-[#38bdf8]">Z</span>
                <span className="cat-zzz absolute right-[140px] top-[40px] text-[46px] font-extrabold text-[#38bdf8]" style={{ animationDelay: '0.9s' }}>Z</span>
                <span className="cat-zzz absolute right-[230px] top-[50px] text-[34px] font-extrabold text-[#38bdf8]" style={{ animationDelay: '1.8s' }}>Z</span>
              </>
            )}
            {action === 'keu' && <div className="cat-pop absolute right-[120px] top-[6px] rounded-2xl bg-white px-4 py-1.5 text-[36px] font-extrabold text-[#db2777] shadow-lg">Meow~ ♪</div>}
            {action === 'gian' && <div className="cat-pop absolute right-[130px] top-[0px] text-[76px]">💢</div>}
            {action === 'thuong' &&
              FLOATERS.map((h, i) => (
                <span key={i} className="cat-float absolute text-[52px]" style={{ left: `${250 + i * 95}px`, top: `${30 + (i % 3) * 36}px`, animationDelay: `${i * 0.4}s` }}>
                  {h}
                </span>
              ))}
            {action === 'duoi' && <div className="cat-fly absolute left-[430px] top-[26px] text-[62px]">🦋</div>}
            {action === 'chay' && (
              <>
                <div className="absolute left-[40px] top-[300px] h-[10px] w-[150px] rounded bg-white/50" />
                <div className="absolute left-[90px] top-[350px] h-[10px] w-[110px] rounded bg-white/40" />
                <div className="absolute right-[40px] top-[320px] h-[10px] w-[130px] rounded bg-white/50" />
              </>
            )}
          </div>

          {/* BUG ANIME: vẽ bằng SVG, đổi biểu cảm theo hành động */}
          <div className="absolute left-1/2 top-[1030px] z-10 w-[660px] -translate-x-1/2">
            <div className={action === 'idle' ? 'cat-idle' : `cat-${action}`}>
              <div className="w-full drop-shadow-[0_18px_22px_rgba(90,40,0,0.35)] [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: animeCatSvg(EXPR_BY_ACTION[action] ?? 'normal') }} />
            </div>
          </div>

          {/* hàng chờ lệnh */}
          {v.queue.length > 0 && (
            <div className="absolute left-[44px] top-[1330px] z-30 max-w-[300px]">
              <div className="mb-1.5 text-[23px] font-extrabold text-[#7c2d12]">⏳ Lệnh đang chờ</div>
              <div className="space-y-1.5">
                {v.queue.slice(0, 3).map((q, i) => (
                  <div key={i} className="cat-pop w-fit rounded-full bg-white/90 px-3.5 py-1 text-[22px] font-bold text-[#7c2d4e] shadow">
                    {q.emoji} {q.label} · {q.nickname}
                  </div>
                ))}
                {v.queue.length > 3 && <div className="text-[21px] font-semibold text-[#7c2d12]">+{v.queue.length - 3} lệnh nữa…</div>}
              </div>
            </div>
          )}

          {/* chân trang: tim + bạn thân của Bug */}
          <div className="absolute inset-x-[40px] bottom-[30px] z-30 rounded-3xl bg-black/45 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <span className="whitespace-nowrap text-[25px] font-bold text-white">❤️ {v.likeTotal % v.likeGoal}/{v.likeGoal} tim → mưa tim</span>
              <div className="h-[14px] flex-1 overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-[#fb7185]" style={{ width: `${likePct}%` }} />
              </div>
              <span className="whitespace-nowrap text-[24px] text-white/85">Bug đã làm {v.totalActions} lệnh</span>
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              <span className="whitespace-nowrap text-[25px] font-extrabold text-[#ffd84a]">🏆 Bạn thân của Bug:</span>
              {v.top.length === 0 && <span className="text-[24px] text-white/75">chưa có ai, gõ lệnh đầu tiên để lên bảng nhé</span>}
              {v.top.slice(0, 4).map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 rounded-full bg-white/12 py-1 pl-1.5 pr-3.5 ring-1 ring-white/15">
                  {t.avatar ? <img src={t.avatar} alt="" className="h-[38px] w-[38px] rounded-full" /> : <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#db2777] text-[19px] font-bold text-white">{t.nickname.slice(0, 1)}</span>}
                  <span className="max-w-[190px] truncate text-[23px] font-semibold text-white">{t.nickname}</span>
                  <span className="text-[22px] font-extrabold text-[#ffd84a]">{t.count} lệnh</span>
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
