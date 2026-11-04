// Lõi game Bug Nghe Lời (thuần logic, kiểm thử bằng đồng hồ giả ở cat.check.ts).
// Người xem gõ lệnh trong bình luận (NHẢY, CHẠY, NGỦ, ĂN, KÊU, LĂN, ĐUỔI, GIẬN, THƯƠNG),
// mèo Bug làm đúng động tác đó trên sân khấu. Lệnh bận thì xếp hàng; tính "số lệnh đã làm"
// cho từng bạn để lên bảng Bạn Thân Của Bug. Tim đủ mốc thì mưa tim. Quà chỉ được cảm ơn.
import { GAME } from './config';

export interface Say {
  text: string;
  main?: boolean;
  priority?: boolean;
  ttl?: number;
}
export interface PersonIn {
  username: string;
  nickname: string;
  spoken: string;
  avatar: string;
}
export interface ChatIn extends PersonIn {
  comment: string;
  createTime?: number;
  safe?: boolean;
}

/** Bỏ dấu tiếng Việt để so lệnh: "nhảy" = "nhay" = "NHẢY" */
export const plain = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export interface ActionDef {
  key: string;
  label: string;
  emoji: string;
  cmds: string[];
  durMs: number;
  /** câu giới thiệu khi bắt đầu làm động tác, {name} = tên người ra lệnh */
  intros: string[];
}

export const ACTIONS: ActionDef[] = [
  { key: 'nhay', label: 'NHẢY', emoji: '🦘', cmds: ['nhay', 'jump'], durMs: 3600, intros: ['{name} muốn xem Bug nhảy à, nhảy lên nào Bug ơi!', 'Bug nhảy cho {name} xem đây, cao chưa nè!'] },
  { key: 'chay', label: 'CHẠY', emoji: '🏃', cmds: ['chay', 'run'], durMs: 4200, intros: ['Bug chạy vòng quanh phòng theo lệnh của {name} đây, nhanh chưa!', '{name} ra lệnh chạy, Bug chạy ngay đây!'] },
  { key: 'ngu', label: 'NGỦ', emoji: '😴', cmds: ['ngu', 'sleep'], durMs: 7000, intros: ['{name} bảo Bug đi ngủ. Bug nằm xuống ngủ một giấc đây, khò khò.', 'Ngủ thôi Bug ơi, {name} ru Bug ngủ nè.'] },
  { key: 'an', label: 'ĂN HẠT', emoji: '🍽️', cmds: ['an', 'hat', 'eat'], durMs: 5000, intros: ['{name} cho Bug ăn hạt à. Bug ăn ngon lành đây, nhóp nhép nhóp nhép.', 'Tới giờ ăn rồi, Bug cảm ơn {name} nhé!'] },
  { key: 'keu', label: 'KÊU MEOW', emoji: '🐱', cmds: ['keu', 'meow'], durMs: 3200, intros: ['{name} muốn nghe Bug kêu. Meow, meow, Bug kêu rồi đó!', 'Bug cất tiếng kêu cho {name} nghe nè: meow!'] },
  { key: 'lan', label: 'LĂN', emoji: '🌀', cmds: ['lan', 'roll'], durMs: 3800, intros: ['{name} bảo Bug lăn một vòng. Bug lăn qua lăn lại đây, đáng yêu chưa!', 'Lăn nào Bug ơi, lăn cho {name} xem nè!'] },
  { key: 'duoi', label: 'ĐUỔI BƯỚM', emoji: '🦋', cmds: ['duoi', 'buom', 'butterfly'], durMs: 5200, intros: ['Có con bướm bay vào phòng kìa. Bug đuổi theo lệnh của {name} đây, bắt hụt rồi, dễ thương quá!', '{name} ơi nhìn Bug rình bắt bướm nè!'] },
  { key: 'gian', label: 'GIẬN', emoji: '💢', cmds: ['gian', 'doi', 'angry'], durMs: 3400, intros: ['{name} chọc Bug giận rồi. Nhìn mặt Bug hờn chưa nè, đúng mặt nghiêm thương hiệu!', 'Bug dỗi rồi đó {name} ơi, phải dỗ bằng lệnh thương mới hết giận.'] },
  { key: 'thuong', label: 'THƯƠNG', emoji: '❤️', cmds: ['thuong', 'yeu', 'love'], durMs: 4000, intros: ['{name} thương Bug quá nè. Bug cũng thương {name} nhiều lắm!', 'Nhận được tình thương của {name}, Bug vui quá rung cả râu!'] },
];

const BY_CMD = new Map<string, ActionDef>();
for (const a of ACTIONS) for (const c of a.cmds) BY_CMD.set(c, a);

/** Tìm lệnh trong một bình luận: khớp theo từng từ đã bỏ dấu */
export function findAction(comment: string): ActionDef | null {
  for (const tok of plain(comment).split(' ')) {
    const a = BY_CMD.get(tok);
    if (a) return a;
  }
  return null;
}

interface Current {
  def: ActionDef;
  by: PersonIn | null; // null = Bug tự chơi lúc rảnh
  startedAt: number;
  endsAt: number;
}
interface Queued {
  def: ActionDef;
  by: PersonIn;
}
interface Fan {
  nickname: string;
  avatar: string;
  count: number;
}

export interface CatView {
  action: string; // key của ACTIONS hoặc 'idle'
  label: string;
  emoji: string;
  byName: string;
  byAvatar: string;
  progress: number; // 0..1 của động tác hiện tại
  queue: { label: string; emoji: string; nickname: string }[];
  top: { nickname: string; avatar: string; count: number }[];
  totalActions: number;
  hearts: boolean;
  likeTotal: number;
  likeGoal: number;
}

export class CatRoom {
  private current: Current | null = null;
  private queue: Queued[] = [];
  private fans = new Map<string, Fan>();
  private lastCmdAt = new Map<string, number>();
  private idleAt: number;
  private likeCount = 0;
  private heartsUntil = 0;
  private totalActions = 0;

  constructor(now: number, private rand: () => number = Math.random) {
    this.idleAt = now + GAME.idleAfterMs;
  }

  private start(def: ActionDef, by: PersonIn | null, now: number): Say[] {
    this.current = { def, by, startedAt: now, endsAt: now + def.durMs };
    this.idleAt = now + def.durMs + GAME.idleAfterMs;
    if (by) {
      const f = this.fans.get(by.username) ?? { nickname: by.nickname, avatar: by.avatar, count: 0 };
      f.count++;
      f.nickname = by.nickname;
      f.avatar = by.avatar;
      this.fans.set(by.username, f);
      this.totalActions++;
    }
    const tpl = def.intros[Math.floor(this.rand() * def.intros.length)];
    const text = by ? tpl.replace('{name}', by.spoken) : `Chưa ai ra lệnh, Bug tự ${def.label.toLowerCase()} một chút cho vui nè.`;
    return [{ text: `F: ${text}`, main: true }];
  }

  newSession(now: number): Say[] {
    this.current = null;
    this.queue = [];
    this.idleAt = now + GAME.idleAfterMs;
    return [
      { text: 'F: Chào cả nhà đến với phòng của Bug. Bug là mèo thật của kênh đó, ảnh trên sân khấu là Bug ngoài đời luôn.', main: true },
      { text: 'F: Cả nhà gõ lệnh cho Bug làm theo nhé: gõ NHẢY là Bug nhảy, gõ NGỦ là Bug đi ngủ, còn nhiều lệnh nữa ghi trên bảng lệnh góc phải. Lệnh nào đông thì Bug làm lần lượt, không sót bạn nào đâu.', main: true },
    ];
  }

  chat(e: ChatIn, now: number): Say[] {
    if (e.safe === false) return [];
    const def = findAction(e.comment);
    if (!def) return [];
    const last = this.lastCmdAt.get(e.username) ?? -Infinity;
    if (now - last < GAME.cooldownMs) return [];
    this.lastCmdAt.set(e.username, now);
    const person: PersonIn = { username: e.username, nickname: e.nickname, spoken: e.spoken, avatar: e.avatar };
    if (!this.current) return this.start(def, person, now);
    if (this.queue.length >= GAME.queueMax) {
      return [{ text: `F: Bug đang bận làm mấy lệnh trước rồi, ${e.spoken} chờ một chút rồi gõ lại nhé.`, ttl: 20_000 }];
    }
    this.queue.push({ def, by: person });
    return [{ text: `F: Đã ghi lệnh ${def.label.toLowerCase()} của ${e.spoken}, Bug làm xong việc này là tới lượt liền.`, ttl: 30_000 }];
  }

  tick(now: number): Say[] {
    if (this.current && now >= this.current.endsAt) {
      this.current = null;
      const next = this.queue.shift();
      if (next) return this.start(next.def, next.by, now);
    }
    if (!this.current && now >= this.idleAt) {
      const pool = ACTIONS.filter((a) => ['keu', 'lan', 'thuong', 'nhay'].includes(a.key));
      return this.start(pool[Math.floor(this.rand() * pool.length)], null, now);
    }
    return [];
  }

  like(count: number, now: number): Say[] {
    const before = Math.floor(this.likeCount / GAME.likeGoal);
    this.likeCount += Math.max(0, count);
    const after = Math.floor(this.likeCount / GAME.likeGoal);
    if (after > before) {
      this.heartsUntil = now + 6000;
      return [{ text: 'F: Đủ một trăm tim rồi, mưa tim xuống cho Bug đây. Bug cảm ơn cả nhà nhiều lắm!', main: true }];
    }
    return [];
  }

  follow(p: PersonIn): Say[] {
    return [{ text: `F: Chào mừng bạn mới ${p.spoken} ghé phòng. Gõ một lệnh bất kỳ trên bảng lệnh là Bug làm theo cho bạn xem liền.` }];
  }

  thank(p: PersonIn, giftName: string): Say[] {
    return [{ text: `F: Ôi, ${p.spoken} tặng ${giftName} cho Bug. Bug cúi đầu cảm ơn bạn nhiều nhé!`, priority: true }];
  }

  /** Trang điều khiển bấm Qua động tác: kết thúc sớm động tác hiện tại */
  skip(now: number): Say[] {
    if (!this.current) return [];
    this.current = null;
    const next = this.queue.shift();
    return next ? this.start(next.def, next.by, now) : [];
  }

  view(now: number): CatView {
    const c = this.current;
    return {
      action: c?.def.key ?? 'idle',
      label: c?.def.label ?? 'NẰM NGHỈ',
      emoji: c?.def.emoji ?? '💤',
      byName: c?.by?.nickname ?? '',
      byAvatar: c?.by?.avatar ?? '',
      progress: c ? Math.min(1, Math.max(0, (now - c.startedAt) / (c.endsAt - c.startedAt))) : 0,
      queue: this.queue.map((q) => ({ label: q.def.label, emoji: q.def.emoji, nickname: q.by.nickname })),
      top: [...this.fans.values()].sort((a, b) => b.count - a.count).slice(0, 6).map((f) => ({ ...f })),
      totalActions: this.totalActions,
      hearts: now < this.heartsUntil,
      likeTotal: this.likeCount,
      likeGoal: GAME.likeGoal,
    };
  }
}
