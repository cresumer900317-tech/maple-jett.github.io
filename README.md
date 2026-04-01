# 친구패밀리 홈페이지 최종본

이 패키지는 현재 사용 중인 폴더 구조를 유지한 상태에서 UI를 전면 정리한 최종본입니다.

## 포함된 구조

```text
assets/
  css/style.css
  js/common.js
  js/data.js
  js/home.js
  js/members.js
  js/notice.js
  js/ranking.js
  js/tips.js
  js/weekly.js
index.html
ranking.html
members.html
notice.html
tips.html
weekly.html
README.md
CNAME
```

## 이번 버전 핵심 변경

- 밝은 톤 기반으로 전체 대비 재정리
- 길드 배지 색상 구분 강화
- 랭킹/인원 표 가독성 개선
- 캐릭터 썸네일 크기 확대
- 캐릭터명 세로 깨짐 방지
- 길드 요약 카드 구분감 강화
- 모바일/중간 해상도 대응 정리
- 캐시 키 갱신으로 이전 잘못된 프론트 캐시 영향 완화

## 적용 순서

1. 기존 `guild-homepage` 폴더를 백업합니다.
2. 이 ZIP의 파일을 기존 `guild-homepage` 폴더에 그대로 덮어씁니다.
3. 홈페이지에서 강력 새로고침을 합니다.
   - Windows: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`
4. 배포 URL을 바꿔야 하면 `assets/js/common.js` 상단의 `API_URL` 값을 수정합니다.
   - 또는 루트 `data.js`에 `window.API_URL = "웹앱URL";` 형태로 넣어도 됩니다.
5. 화면 확인 후 Git 반영을 진행합니다.

## Apps Script 확인

브라우저에서 아래 URL이 JSON으로 열려야 합니다.

```text
https://script.google.com/macros/s/배포ID/exec?mode=home
```

정상이라면 홈페이지 데이터 연결은 된 것입니다.

## Git 반영 순서

```bash
git status
git add .
git commit -m "최종 UI 전면 개편 적용"
git push
```

## 메모

- 루트 `style.css`, `script.js`, `data.js`는 호환성 유지를 위해 남겨두었습니다.
- 실제 동작은 `assets/css/style.css`, `assets/js/*.js` 기준입니다.
