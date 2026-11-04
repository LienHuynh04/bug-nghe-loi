// Kiểm tra lõi Bug Nghe Lời: npx tsx src/game/cat.check.ts
// Nhận diện lệnh (có dấu/không dấu), xếp hàng, chống spam, đếm lệnh khi BẮT ĐẦU làm, mốc tim.
import assert from 'node:assert/strict';
import { CatRoom, findAction, plain } from './cat';
import { GAME } from './config';

assert.equal(plain('Nhảy lên Bug ơi!'), 'nhay len bug oi');
assert.equal(findAction('nhảy')?.key, 'nhay');
assert.equal(findAction('NHAY')?.key, 'nhay');
assert.equal(findAction('bug ơi đi ngủ đi')?.key, 'ngu');
assert.equal(findAction('ăn hạt nè')?.key, 'an');
assert.equal(findAction('đuổi bướm đi Bug')?.key, 'duoi');
assert.equal(findAction('thương thương')?.key, 'thuong');
assert.equal(findAction('hôm nay trời đẹp quá'), null);
assert.equal(findAction('nhaynhay lien tuc'), null, 'từ dính liền không phải lệnh thì không nhận');
assert.equal(findAction('nhảy nhót cả ngày')?.key, 'nhay', 'câu có chứa đúng từ lệnh thì vẫn nhận');

const who = (i: number) => ({ username: `u${i}`, nickname: `Bạn ${i}`, spoken: `Bạn ${i}`, avatar: '' });
const chat = (r: CatRoom, i: number, comment: string, now: number) => r.chat({ ...who(i), comment, createTime: now, safe: true }, now);
let t = 1_000_000;

{
  const r = new CatRoom(t);
  const open = r.newSession(t);
  assert.ok(open.length === 2 && open.every((l) => l.main), 'mở phòng có 2 câu chính');

  // lệnh đầu tiên làm ngay, đếm ngay khi bắt đầu
  const lines = chat(r, 1, 'nhảy', t);
  assert.ok(lines.some((l) => l.main), 'lệnh đầu có câu dẫn chính');
  assert.equal(r.view(t).action, 'nhay');
  assert.equal(r.view(t).byName, 'Bạn 1');
  assert.equal(r.view(t).top[0]?.count, 1, 'đếm lệnh khi bắt đầu làm');

  // lệnh thứ hai từ bạn khác: xếp hàng, chưa đếm
  chat(r, 2, 'ngủ', t + 100);
  assert.equal(r.view(t + 100).queue.length, 1);
  assert.equal(r.view(t + 100).top.find((x) => x.nickname === 'Bạn 2'), undefined, 'chưa tới lượt thì chưa đếm');

  // chính bạn 1 gõ lại ngay: dính cooldown 6 giây
  chat(r, 1, 'chạy', t + 500);
  assert.equal(r.view(t + 500).queue.length, 1, 'cooldown chặn lệnh liên tiếp của cùng một bạn');

  // hết động tác nhảy thì tự chuyển sang lệnh ngủ trong hàng chờ
  const dur = 3600;
  r.tick(t + dur + 1);
  assert.equal(r.view(t + dur + 1).action, 'ngu');
  assert.equal(r.view(t + dur + 1).top.find((x) => x.nickname === 'Bạn 2')?.count, 1);
  assert.equal(r.view(t + dur + 1).totalActions, 2);

  // hết ngủ, không còn hàng chờ: về nằm nghỉ
  r.tick(t + dur + 7000 + 2);
  assert.equal(r.view(t).action, 'idle');

  // 30 giây không ai ra lệnh: Bug tự chơi (không tính vào bảng bạn thân)
  const idleLines = r.tick(t + dur + 7000 + 2 + GAME.idleAfterMs + 1);
  assert.ok(idleLines.some((l) => l.main && l.text.includes('tự')), 'rảnh quá thì Bug tự chơi');
  assert.equal(r.view(t).totalActions, 2, 'tự chơi không tính điểm');

  // tim: chưa đủ 100 thì không mưa tim, đủ thì có hiệu ứng + câu chính
  assert.deepEqual(r.like(60, t), []);
  assert.equal(r.view(t).hearts, false);
  const rain = r.like(45, t);
  assert.ok(rain.some((l) => l.main), 'đủ 100 tim có câu chính');
  assert.equal(r.view(t).hearts, true);

  // hàng chờ đầy: báo bận, không nhận thêm
  const r2 = new CatRoom(t);
  r2.newSession(t);
  chat(r2, 1, 'chạy', t);
  for (let i = 2; i <= 2 + GAME.queueMax; i++) chat(r2, i, 'kêu', t + i);
  assert.equal(r2.view(t).queue.length, GAME.queueMax);
  const busy = chat(r2, 99, 'lăn', t + 50);
  assert.ok(busy.length === 1 && !busy[0].main, 'hàng đầy thì báo chờ bằng câu phụ');
  assert.equal(r2.view(t).queue.length, GAME.queueMax);
}

console.log('cat.check: tất cả đều đúng');
