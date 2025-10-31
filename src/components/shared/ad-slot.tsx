/**
 * AdSlot 컴포넌트
 * @description 광고 슬롯 컴포넌트 (AdSense 등)
 */
interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export default function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  className = ''
}: AdSlotProps) {
  return (
    <div className={`ad-slot ${className}`}>
      {/* AdSense 광고 코드 - 실제 구현 시 활성화 */}
      {/*
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
      */}

      {/* 개발용 플레이스홀더 */}
      <div className="bg-muted border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center text-muted-foreground">
        <div className="text-sm font-medium mb-1">광고 슬롯</div>
        <div className="text-xs">AdSense 광고가 표시됩니다</div>
        <div className="text-xs mt-1 opacity-50">Slot: {slot}</div>
      </div>
    </div>
  );
}
