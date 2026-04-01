# 친구패밀리 홈페이지 최종 교체본

이 폴더는 **기존 구조를 유지한 채 전체 덮어쓰기용** 최종본입니다.

## 포함 구조
- `assets/css/style.css`
- `assets/js/common.js`
- `assets/js/home.js`
- `assets/js/ranking.js`
- `assets/js/members.js`
- `assets/js/weekly.js`
- `index.html`
- `ranking.html`
- `members.html`
- `weekly.html`
- `notice.html`
- `tips.html`

## 적용 순서
1. 기존 `guild-homepage` 폴더를 백업합니다.
2. 이 ZIP을 압축 해제합니다.
3. 내부 `guild-homepage` 폴더의 파일을 **기존 프로젝트에 전체 덮어쓰기** 합니다.
4. `assets/js/common.js` 안의 `API_URL`이 현재 사용 중인 Apps Script `/exec` 주소인지 확인합니다.
5. 브라우저에서 강력 새로고침을 합니다.
   - Windows: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`
6. 이상 없으면 Git에 반영합니다.

## Git 반영 순서
```bash
git status
git add .
git commit -m "홈페이지 최종 교체본 적용"
git push
```

## 이번 최종본 반영 내용
- 홈 화면 과한 카드 구조 축소
- 길드별 요약을 카드형에서 **표형 요약**으로 변경
- 캐릭터 썸네일 확대
- 캐릭터명 줄바꿈/세로 깨짐 방지
- PC 가독성 개선, 모바일 과한 공백 축소
- 길드 배지 색상 대비 강화
- 주간 TOP 페이지 네비게이션 연결

## 참고
- 루트의 `style.css`, `script.js`, `data.js` 파일이 있더라도 실제 페이지는 `assets/` 내부 파일을 기준으로 동작합니다.
- 공지/꿀팁 데이터가 비어 있으면 빈 상태 카드로 표시됩니다.
