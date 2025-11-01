'use client';

/**
 * 언어 선택 컴포넌트
 * 한국어/영어 전환
 */
import { useState, useEffect } from 'react';
import { Languages, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitialLanguage, setLanguage, Language } from '@/lib/i18n';

const languages = [
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
];

export function LanguageSelector({
  variant = 'ghost',
  size = 'icon'
}: {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');

  useEffect(() => {
    setCurrentLanguage(getInitialLanguage());
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setLanguage(language);
    // 페이지 새로고침으로 언어 변경 적용
    window.location.reload();
  };

  const currentLangInfo = languages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-1">
          <Languages className="h-4 w-4" />
          <span className="text-xs">{currentLangInfo?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-base">{language.flag}</span>
            <span>{language.name}</span>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 간단한 언어 토글 (한국어 ↔ 영어)
export function LanguageToggle() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ko');

  useEffect(() => {
    setCurrentLanguage(getInitialLanguage());
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ko' ? 'en' : 'ko';
    setCurrentLanguage(newLanguage);
    setLanguage(newLanguage);
    window.location.reload();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs">
        {currentLanguage === 'ko' ? '🇺🇸 EN' : '🇰🇷 KO'}
      </span>
    </Button>
  );
}
