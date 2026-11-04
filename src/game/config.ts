// Hằng số của game Bug Nghe Lời: người xem gõ lệnh, mèo Bug (ảnh thật của kênh) làm theo
export const GAME = {
  defaultChannelName: 'Bug Nghe Lời',
  queueMax: 6, // tối đa số lệnh đang chờ
  cooldownMs: 6_000, // mỗi bạn phải chờ 6 giây giữa hai lần ra lệnh được nhận
  idleAfterMs: 30_000, // 30 giây không ai ra lệnh thì Bug tự chơi một động tác
  likeGoal: 100, // đủ 100 tim thì mưa tim quanh Bug
  chatterMaxWaitMs: 60_000,
  giftLineMaxWaitMs: 30_000,
  giftThanksCooldownMs: 30_000,
  bigGiftCoins: 50,
};
