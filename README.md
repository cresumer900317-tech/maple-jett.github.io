# guild-homepage

밝은 톤 포털형 UI 개편본입니다.

## 적용 순서
1. ZIP 압축 해제
2. 기존 `guild-homepage` 폴더에 **전체 덮어쓰기**
3. `assets/js/common.js` 또는 `assets/js/data.js`에 설정된 Apps Script 웹앱 URL 확인
4. 로컬에서 `index.html`부터 점검
5. 이상 없으면 Git 반영

## 현재 구조
- `assets/css/style.css` : 공통 스타일
- `assets/js/common.js` : 공통 셸, API 호출, 공통 렌더 유틸
- `assets/js/home.js` : 홈
- `assets/js/ranking.js` : 랭킹
- `assets/js/members.js` : 인원·성장
- `assets/js/notice.js` : 공지
- `assets/js/tips.js` : 꿀팁
- `assets/js/weekly.js` : 주간성장

## Git 반영
```bash
git status
git add .
git commit -m "밝은 포털형 UI 재정비"
git push
```

## 메모
- 이번 버전은 **기존 폴더 구조를 유지**합니다.
- 공지/꿀팁 보드 렌더 함수 누락도 같이 보완했습니다.
- `weekly.html`은 다시 실제 페이지로 복구했습니다.
