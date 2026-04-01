# 친구패밀리 홈페이지 포털 개편본

이번 버전은 첫 화면이 비어 보이지 않도록 MGF.GG 스타일의 **고밀도 게임 포털 UI** 방향으로 재구성한 웹 완성본입니다.

## 이번 개편 핵심
- 홈 화면을 소개형에서 **랭킹 허브형 포털**로 재구성
- 전체 전투력 TOP 10과 주간 전투력 상승 TOP 10을 홈에 배치
- 길드별 요약을 긴 카드 목록이 아니라 **전술 보드형 타일**로 변경
- 공지/꿀팁을 홈에서 바로 볼 수 있도록 축약 노출
- 전체 랭킹/인원·성장/공지/팁 페이지를 같은 톤으로 통일
- 검색, 순위 탐색, 모달 상세보기를 유지
- 누락되어 있던 `renderBoardList()`를 공통 스크립트에 추가해 공지/팁 페이지가 정상 렌더링되도록 정리

## 폴더 구조
- `index.html` : 홈
- `ranking.html` : 전체 랭킹
- `members.html` : 인원 디렉토리 + 주간 성장 통합
- `notice.html` : 공지 게시판
- `tips.html` : 꿀팁 게시판
- `assets/css/style.css` : 전체 스타일
- `assets/js/common.js` : 공통 셸, API, 유틸
- `assets/js/home.js` : 홈 렌더링
- `assets/js/ranking.js` : 랭킹 페이지
- `assets/js/members.js` : 인원·성장 페이지
- `assets/js/notice.js` : 공지 페이지
- `assets/js/tips.js` : 꿀팁 페이지

## 실제 적용 순서
1. 압축을 해제합니다.
2. 기존 `guild-homepage` 폴더 백업본을 하나 만들어 둡니다.
3. 압축 해제한 파일로 기존 프로젝트 파일을 **전체 덮어쓰기** 합니다.
4. VS Code에서 `index.html`과 `assets/css/style.css`가 정상 교체됐는지 확인합니다.
5. 로컬 미리보기 또는 GitHub Pages에서 화면을 확인합니다.
6. 이상 없으면 아래 Git 명령으로 반영합니다.

## Git 반영 순서
```bash
git add .
git commit -m "홈페이지 포털 UI 전면 개편"
git push
```

## 데이터 연결 기준
이 프로젝트는 `assets/js/common.js` 안의 Apps Script Web App 주소를 사용합니다.

현재 설정 위치:
- `assets/js/common.js`
- `const API_URL = "..."`

Apps Script를 새로 배포했다면 **이 주소만 교체**하면 됩니다.

## 참고
- 이번 묶음은 **웹 UI 개편본**입니다.
- Apps Script 통파일은 이번 압축에 포함하지 않았습니다.
- 다음 단계에서는 이 UI에 맞춰 필요한 경우 Apps Script 응답 구조 보강이나 홈 위젯 추가를 이어서 진행하면 됩니다.
