/**
 * 북마크 페이지
 * 사용자가 북마크한 꿈 목록을 표시
 */
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookmarkedDreamsList } from '@/components/bookmark';
import { Bookmark } from 'lucide-react';

export const metadata: Metadata = {
  title: '북마크 | DreamScope',
  description: '북마크한 꿈 해석들을 모아서 볼 수 있습니다.',
  keywords: '꿈 북마크, 꿈 해석 북마크, 저장된 꿈',
  openGraph: {
    title: '북마크 | DreamScope',
    description: '북마크한 꿈 해석들을 모아서 볼 수 있습니다.',
    type: 'website',
  },
};

export default function BookmarksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bookmark className="h-8 w-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold">북마크</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            북마크한 꿈 해석들을 모아서 볼 수 있습니다.
          </p>
        </div>

        {/* 북마크 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bookmark className="h-5 w-5 mr-2" />
              북마크한 꿈 목록
            </CardTitle>
            <CardDescription>
              관심 있는 꿈 해석을 북마크하여 언제든지 다시 볼 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookmarkedDreamsList />
          </CardContent>
        </Card>

        {/* 북마크 사용법 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>북마크 사용법</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">💡 북마크 추가하기</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 꿈 해석 페이지에서 북마크 아이콘을 클릭</li>
                  <li>• 꿈 사전 목록에서 북마크 버튼 사용</li>
                  <li>• 관심 있는 꿈을 쉽게 저장할 수 있습니다</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📱 북마크 관리하기</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 북마크 페이지에서 목록 확인</li>
                  <li>• 북마크 아이콘을 다시 클릭하여 제거</li>
                  <li>• 브라우저 로컬 저장소에 안전하게 저장</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
