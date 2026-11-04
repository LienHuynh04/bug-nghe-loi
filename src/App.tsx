import { IS_STAGE } from './live/page';
import { StageFrame } from './live/StageFrame';
import { Dashboard } from './live/Dashboard';
import { useCat } from './game/useCat';
import { CatStage } from './game/CatStage';
import { CatControls } from './game/CatControls';

export default function App() {
  const game = useCat();

  // Trang cho TikTok LIVE Studio: chỉ có màn hình phòng tarot
  if (IS_STAGE) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <StageFrame>
          <CatStage game={game} />
        </StageFrame>
      </div>
    );
  }

  // Trang điều khiển: xem trước = ảnh chụp từ trang stage, im lặng
  return (
    <Dashboard
      status={game.status}
      channelName={game.channelName}
      preview={
        <StageFrame maxHeight={window.innerHeight - 40}>
          <CatStage game={game} />
        </StageFrame>
      }
      extra={<CatControls view={game.view} stageCount={game.stageCount} />}
    />
  );
}
