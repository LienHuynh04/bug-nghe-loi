import { useState } from 'react';
import { emitTest, sendControl } from '../live/page';
import { ACTIONS } from './cat';
import type { StageView } from './useCat';

// Nút riêng của game Bug Nghe Lời ở trang điều khiển + giả lập người xem để thử khi chưa live
const NAMES = ['Lan Anh', 'Minh Tuấn', 'Bé Na', 'Hoàng Long', 'Thu Trang', 'Quốc Bảo'];
const fake = (i: number) => ({ username: `khach${i}`, nickname: NAMES[i % NAMES.length], avatar: '' });

export function CatControls({ view, stageCount = 0 }: { view: StageView | null; stageCount?: number }) {
  const [n, setN] = useState(0);
  const next = () => {
    const i = n;
    setN(n + 1);
    return fake(i);
  };

  return (
    <div className="space-y-3">
      {stageCount > 1 && <div className="rounded-lg bg-red-600 p-2 text-white">Đang mở {stageCount} trang stage, sẽ có 2 giọng. Đóng bớt đi.</div>}
      {view && (
        <div className="rounded-lg bg-slate-800 p-3 text-sm leading-6">
          <div>
            Bug đang: <b className="text-amber-300">{view.label}</b>
            {view.byName && (
              <>
                {' '}theo lệnh của <b>{view.byName}</b>
              </>
            )}{' '}
            · Lệnh chờ: <b>{view.queue.length}</b> · Tổng lệnh đã làm: <b>{view.totalActions}</b> · Tim: <b>{view.likeTotal}</b>
          </div>
          {view.top[0] && (
            <div>
              Bạn thân nhất: <b className="text-amber-300">{view.top[0].nickname}</b> ({view.top[0].count} lệnh)
            </div>
          )}
        </div>
      )}
      <div>
        <div className="mb-1.5 text-sm font-semibold text-slate-300">Ra lệnh thử cho Bug (mỗi nút = 1 bạn xem gõ lệnh):</div>
        <div className="flex flex-wrap gap-2">
          {ACTIONS.map((a) => (
            <Btn key={a.key} onClick={() => emitTest('chat', { ...next(), comment: a.cmds[0] })}>
              {a.emoji} {a.label}
            </Btn>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => sendControl('custom', 'skip')} disabled={!view || view.action === 'idle'}>
          ⏭ Qua động tác
        </Btn>
        <Btn
          onClick={() => {
            const seq = ['nhay', 'an', 'keu', 'thuong'];
            seq.forEach((cmd, i) => setTimeout(() => emitTest('chat', { ...fake(n + i), comment: cmd }), i * 700));
            setN(n + seq.length);
          }}
        >
          👥 4 bạn ra lệnh liên tiếp
        </Btn>
        <Btn onClick={() => emitTest('like', { ...fake(2), likeCount: 100, totalLikes: 100 })}>❤️ Đủ 100 tim</Btn>
        <Btn onClick={() => emitTest('gift', { ...fake(3), giftName: 'Hoa hồng', giftId: 1, diamondCount: 1, repeatCount: 1 })}>🌹 Tặng hoa</Btn>
        <Btn onClick={() => emitTest('follow', fake(4))}>➕ Follow</Btn>
      </div>
      <p className="text-xs text-slate-500">
        Lưu ý: ảnh Bug là file <b>public/assets/cat.png</b> (đã tách nền từ ảnh bạn gửi). Nếu sân khấu hiện emoji 🐱 thay vì ảnh Bug thì là file ảnh chưa có trên máy — kiểm tra lại thư mục public/assets. Muốn nghe giọng dẫn, mở thêm trang stage (link ở thẻ Kết nối).
      </p>
    </div>
  );
}

function Btn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-600 disabled:opacity-40">
      {children}
    </button>
  );
}
