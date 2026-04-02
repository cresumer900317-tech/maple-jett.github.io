# GUILD_HOMEPAGE 2차 안전 교체본 적용 방법

적용 대상 경로
- 프론트: `C:\Users\codes\OneDrive\Desktop\HP_Project\Guild_HOMEPAGE`
- Python: `C:\Users\codes\OneDrive\Desktop\HP_Project\Guild_Project`

## 이번 교체 파일
- `members.html`
- `weekly.html`
- `assets/js/members.js`
- `assets/js/weekly.js`

## 적용 순서
1. `Guild_HOMEPAGE` 폴더 백업
2. 이 압축을 해제
3. 압축 내부의 파일을 `Guild_HOMEPAGE`에 같은 경로로 덮어쓰기
4. `Guild_Project\collector` 에서 `python main.py` 실행
5. 아래 JSON 4개가 `Guild_HOMEPAGE\data\` 안에 있는지 확인
   - `home-summary.json`
   - `members.json`
   - `ranking.json`
   - `weekly.json`
6. `members.html`, `weekly.html` 열어서 정상 표시 확인

## 이번 단계에서 삭제하지 말 것
아직 삭제하지 마세요.
- `assets/js/data.js`
- 루트 `data.js`

다른 페이지가 아직 기존 구조를 참조할 수 있습니다.
