# Guild_HOMEPAGE 1차 안전 교체본

## 적용 대상 경로
- 프론트엔드: `C:\Users\codes\OneDrive\Desktop\HP_Project\Guild_HOMEPAGE`
- Python 프로젝트: `C:\Users\codes\OneDrive\Desktop\HP_Project\Guild_Project`

## 이번 교체 범위
- `index.html`
- `ranking.html`
- `assets/js/home.js`
- `assets/js/ranking.js`

이번 단계는 홈과 랭킹만 Local JSON 기반으로 교체합니다.
다른 페이지는 건드리지 않습니다.

## 적용 순서
1. `Guild_HOMEPAGE` 폴더를 통째로 백업합니다.
2. 이 압축 파일 안의 내용을 `Guild_HOMEPAGE` 폴더에 같은 경로로 덮어씁니다.
3. `Guild_Project\collector` 폴더로 이동합니다.
4. 아래 명령어를 실행합니다.
   ```bash
   python main.py
   ```
5. 생성된 아래 JSON 4개를 확인합니다.
   - `home-summary.json`
   - `members.json`
   - `ranking.json`
   - `weekly.json`
6. 위 JSON 파일 4개를 `Guild_HOMEPAGE\data\` 폴더에 복사합니다.
   - `Guild_HOMEPAGE`에 `data` 폴더가 없으면 새로 만듭니다.
7. 브라우저에서 `index.html`, `ranking.html`을 확인합니다.

## 삭제하지 말 것
이번 1차 적용에서는 아래 파일들을 바로 삭제하지 않습니다.
- `assets/js/common.js`
- `assets/css/style.css`
- 기존 다른 페이지 관련 JS 파일
- `data.js`

이유: 다른 페이지가 아직 기존 구조를 참조할 수 있어서 1차에서는 안전하게 유지합니다.

## 꼭 확인할 점
- `home.js`는 `./data/home-summary.json`을 읽습니다.
- `ranking.js`는 `./data/ranking.json`을 읽습니다.
- 따라서 `Guild_HOMEPAGE` 루트 바로 아래에 `data` 폴더가 있어야 합니다.

## 추천 다음 단계
1. 홈/랭킹 정상 동작 확인
2. 그다음 `members.html`, `weekly.html`도 같은 방식으로 교체
3. 마지막에 사용하지 않는 `data.js`와 Apps Script 의존 제거
