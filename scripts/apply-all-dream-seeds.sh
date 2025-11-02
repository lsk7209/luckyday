#!/bin/bash
# 꿈 해몽 시드 데이터 일괄 적용 스크립트
# Cloudflare D1 데이터베이스에 모든 시드 파일을 순서대로 적용합니다.

set -e  # 에러 발생 시 중단

echo "🌙 꿈 해몽 데이터베이스 시드 데이터 적용 시작..."
echo ""

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 데이터베이스 이름 (로컬/원격 자동 감지)
DB_NAME="luckyday-db"
LOCAL_FLAG=""

# 로컬 모드 확인
if [ "$1" == "--local" ] || [ "$1" == "-l" ]; then
    LOCAL_FLAG="--local"
    echo -e "${YELLOW}📱 로컬 모드로 실행됩니다${NC}"
else
    echo -e "${YELLOW}☁️  원격 모드로 실행됩니다 (프로덕션 데이터베이스)${NC}"
    read -p "계속하시겠습니까? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "취소되었습니다."
        exit 0
    fi
fi

echo ""
echo "📋 적용 순서:"
echo "  1. 스키마 생성"
echo "  2. 기본 데이터 (10개)"
echo "  3. 확장 데이터 (25개)"
echo "  4. 완전 확장 데이터 (115개)"
echo "  5. 바이럴 확장 데이터"
echo "  6. 바이럴 울트라 데이터"
echo ""

# 함수: SQL 파일 실행
apply_sql() {
    local file=$1
    local description=$2
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ 파일을 찾을 수 없습니다: $file${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}⏳ $description 적용 중...${NC}"
    
    if [ -n "$LOCAL_FLAG" ]; then
        npx wrangler d1 execute "$DB_NAME" $LOCAL_FLAG --file="$file"
    else
        npx wrangler d1 execute "$DB_NAME" --file="$file"
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $description 완료${NC}"
        return 0
    else
        echo -e "${RED}❌ $description 실패${NC}"
        return 1
    fi
}

# 1. 스키마 생성
apply_sql "cloudflare-workers/dream-schema.sql" "스키마 생성"

# 2. 기본 데이터
apply_sql "cloudflare-workers/dream-seed.sql" "기본 데이터 (10개)"

# 3. 확장 데이터
apply_sql "cloudflare-workers/dream-seed-full.sql" "확장 데이터 (25개)"

# 4. 완전 확장 데이터
apply_sql "cloudflare-workers/dream-seed-extended-complete.sql" "완전 확장 데이터 (115개)"

# 5. 바이럴 확장 데이터
apply_sql "cloudflare-workers/dream-seed-viral-enriched.sql" "바이럴 확장 데이터"

# 6. 바이럴 울트라 데이터
apply_sql "cloudflare-workers/dream-seed-viral-ultra.sql" "바이럴 울트라 데이터"

echo ""
echo -e "${GREEN}🎉 모든 시드 데이터 적용 완료!${NC}"
echo ""
echo "📊 데이터 확인:"
if [ -n "$LOCAL_FLAG" ]; then
    npx wrangler d1 execute "$DB_NAME" $LOCAL_FLAG --command="SELECT COUNT(*) as total FROM dream_symbol"
else
    npx wrangler d1 execute "$DB_NAME" --command="SELECT COUNT(*) as total FROM dream_symbol"
fi
echo ""
echo "✨ 완료! 이제 웹사이트에서 꿈 해몽 데이터를 확인할 수 있습니다."

