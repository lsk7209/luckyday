# 꿈 해몽 시드 데이터 일괄 적용 스크립트 (PowerShell)
# Cloudflare D1 데이터베이스에 모든 시드 파일을 순서대로 적용합니다.

$ErrorActionPreference = "Stop"

Write-Host "🌙 꿈 해몽 데이터베이스 시드 데이터 적용 시작..." -ForegroundColor Cyan
Write-Host ""

$DB_NAME = "luckyday-db"
$LOCAL_FLAG = ""

# 로컬 모드 확인
if ($args[0] -eq "--local" -or $args[0] -eq "-l") {
    $LOCAL_FLAG = "--local"
    Write-Host "📱 로컬 모드로 실행됩니다" -ForegroundColor Yellow
} else {
    Write-Host "☁️  원격 모드로 실행됩니다 (프로덕션 데이터베이스)" -ForegroundColor Yellow
    $confirm = Read-Host "계속하시겠습니까? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "취소되었습니다." -ForegroundColor Red
        exit 0
    }
}

Write-Host ""
Write-Host "📋 적용 순서:" -ForegroundColor Cyan
Write-Host "  1. 스키마 생성"
Write-Host "  2. 기본 데이터 (10개)"
Write-Host "  3. 확장 데이터 (25개)"
Write-Host "  4. 완전 확장 데이터 (115개)"
Write-Host "  5. 바이럴 확장 데이터"
Write-Host "  6. 바이럴 울트라 데이터"
Write-Host ""

# 함수: SQL 파일 실행
function Apply-Sql {
    param(
        [string]$File,
        [string]$Description
    )
    
    if (-not (Test-Path $File)) {
        Write-Host "❌ 파일을 찾을 수 없습니다: $File" -ForegroundColor Red
        return $false
    }
    
    Write-Host "⏳ $Description 적용 중..." -ForegroundColor Yellow
    
    $command = "npx wrangler d1 execute `"$DB_NAME`""
    if ($LOCAL_FLAG) {
        $command += " $LOCAL_FLAG"
    }
    $command += " --file=`"$File`""
    
    try {
        Invoke-Expression $command
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $Description 완료" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Description 실패" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $Description 실패: $_" -ForegroundColor Red
        return $false
    }
}

# 1. 스키마 생성
Apply-Sql "cloudflare-workers/dream-schema.sql" "스키마 생성"

# 2. 기본 데이터
Apply-Sql "cloudflare-workers/dream-seed.sql" "기본 데이터 (10개)"

# 3. 확장 데이터
Apply-Sql "cloudflare-workers/dream-seed-full.sql" "확장 데이터 (25개)"

# 4. 완전 확장 데이터
Apply-Sql "cloudflare-workers/dream-seed-extended-complete.sql" "완전 확장 데이터 (115개)"

# 5. 바이럴 확장 데이터
Apply-Sql "cloudflare-workers/dream-seed-viral-enriched.sql" "바이럴 확장 데이터"

# 6. 바이럴 울트라 데이터
Apply-Sql "cloudflare-workers/dream-seed-viral-ultra.sql" "바이럴 울트라 데이터"

Write-Host ""
Write-Host "🎉 모든 시드 데이터 적용 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 데이터 확인:" -ForegroundColor Cyan

$countCommand = "npx wrangler d1 execute `"$DB_NAME`""
if ($LOCAL_FLAG) {
    $countCommand += " $LOCAL_FLAG"
}
$countCommand += " --command=`"SELECT COUNT(*) as total FROM dream_symbol`""

Invoke-Expression $countCommand

Write-Host ""
Write-Host "✨ 완료! 이제 웹사이트에서 꿈 해몽 데이터를 확인할 수 있습니다." -ForegroundColor Green

