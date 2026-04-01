# 친구패밀리 홈페이지 최종 교체본

## 적용 순서
1. 이 압축을 해제합니다.
2. 내부 `guild-homepage` 폴더의 파일을 기존 프로젝트에 **그대로 전체 덮어쓰기** 합니다.
3. `assets/js/common.js` 안의 `API_URL` 이 현재 Apps Script 웹앱 `/exec` 주소인지 확인합니다.
4. 브라우저에서 강력 새로고침을 합니다.
   - Windows: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

## 이번 수정 핵심
- 기존 폴더 구조 유지
- 캐릭터 이미지 영역 확대
- 이름 세로 깨짐 방지
- 길드 색상 대비 강화
- PC에서는 표 가독성 강화
- 모바일에서는 카드/헤더/여백 축소 및 과한 공백 정리
- 공지/꿀팁 게시판 렌더 함수 보완
- 프론트 캐시 버전 갱신

## Git 반영
```bash
git status
git add .
git commit -m "UI 가독성 개선 및 반응형 재정비"
git push
```
