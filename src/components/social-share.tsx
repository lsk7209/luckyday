'use client';

/**
 * 소셜 공유 컴포넌트
 * 꿈 해석 결과를 다양한 소셜 플랫폼에 공유
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import {
  Share2,
  Twitter,
  Facebook,
  MessageCircle,
  Link as LinkIcon,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialShareProps {
  title: string;
  description: string;
  url: string;
  hashtags?: string[];
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function SocialShare({
  title,
  description,
  url,
  hashtags = ['꿈해몽', 'DreamScope'],
  className,
  size = 'default',
  variant = 'outline'
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // URL 복사 기능
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "링크 복사됨",
        description: "꿈 해석 링크가 클립보드에 복사되었습니다.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // 트위터 공유
  const shareToTwitter = () => {
    const text = `${title}\n\n${description}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags.join(',')}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  // 페이스북 공유
  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=555,height=400');
  };

  // 카카오톡 공유 (웹 공유 API 사용)
  const shareToKakao = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        toast({
          title: "공유 완료",
          description: "카카오톡으로 공유되었습니다.",
        });
      } catch (error) {
        console.log('공유 취소됨');
      }
    } else {
      // Web Share API 미지원 시 클립보드 복사로 대체
      copyToClipboard();
      toast({
        title: "공유 준비됨",
        description: "링크가 복사되었습니다. 카카오톡에서 붙여넣기 해주세요.",
      });
    }
  };

  // 일반 공유 (Web Share API)
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title}\n\n${description}`,
          url,
        });
      } catch (error) {
        console.log('공유 취소됨');
      }
    } else {
      copyToClipboard();
    }
  };

  // URL 공유 (단축 URL 생성)
  const shareAsUrl = () => {
    copyToClipboard();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn("gap-2", className)}>
          <Share2 className="h-4 w-4" />
          공유하기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={shareToTwitter} className="gap-3">
          <Twitter className="h-4 w-4 text-blue-500" />
          트위터
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareToFacebook} className="gap-3">
          <Facebook className="h-4 w-4 text-blue-600" />
          페이스북
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareToKakao} className="gap-3">
          <MessageCircle className="h-4 w-4 text-yellow-500" />
          카카오톡
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareNative} className="gap-3">
          <Share2 className="h-4 w-4" />
          기타 앱
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareAsUrl} className="gap-3">
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          링크 복사
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 꿈 해석 공유를 위한 특화 컴포넌트
interface DreamShareProps {
  dreamName: string;
  dreamSummary: string;
  dreamSlug: string;
  className?: string;
}

export function DreamShare({ dreamName, dreamSummary, dreamSlug, className }: DreamShareProps) {
  const shareUrl = `${window.location.origin}/dream/${dreamSlug}`;
  const shareTitle = `🌙 ${dreamName} 꿈 해몽 - DreamScope`;
  const shareDescription = `${dreamSummary}\n\nDreamScope AI로 자세한 꿈 해석 확인하기!`;

  return (
    <SocialShare
      title={shareTitle}
      description={shareDescription}
      url={shareUrl}
      hashtags={['꿈해몽', 'DreamScope', dreamName.replace(/\s+/g, '')]}
      className={className}
    />
  );
}

// 공유 버튼 그룹 컴포넌트 (간단 버전)
interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
  compact?: boolean;
  className?: string;
}

export function ShareButtons({ title, description, url, compact = false, className }: ShareButtonsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "링크 복사됨",
        description: "공유 링크가 클립보드에 복사되었습니다.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const shareToTwitter = () => {
    const text = `${title}\n\n${description}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=꿈해몽,DreamScope`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=555,height=400');
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button variant="outline" size="sm" onClick={shareToTwitter}>
          <Twitter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={shareToFacebook}>
          <Facebook className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={copyUrl}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h4 className="font-medium text-sm">공유하기</h4>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={shareToTwitter} className="gap-2">
          <Twitter className="h-4 w-4" />
          트위터
        </Button>
        <Button variant="outline" size="sm" onClick={shareToFacebook} className="gap-2">
          <Facebook className="h-4 w-4" />
          페이스북
        </Button>
        <Button variant="outline" size="sm" onClick={copyUrl} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          링크 복사
        </Button>
      </div>
    </div>
  );
}
