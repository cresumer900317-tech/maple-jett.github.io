# 친구패밀리 홈페이지 교체본

## 포함 파일
- index.html
- ranking.html
- members.html
- weekly.html
- notice.html
- tips.html
- assets/css/style.css
- assets/js/common.js
- assets/js/home.js
- assets/js/ranking.js
- assets/js/members.js
- assets/js/weekly.js
- assets/js/notice.js
- assets/js/tips.js

## 적용 순서
1. 이 ZIP을 압축 해제합니다.
2. 내부 `guild-homepage` 폴더의 파일을 기존 프로젝트 폴더에 그대로 덮어씁니다.
3. VS Code에서 Live Server 또는 정적 호스팅으로 페이지를 확인합니다.
4. 홈, 랭킹, 인원·성장, 주간 TOP, 공지, 꿀팁 페이지가 정상 동작하는지 확인합니다.
5. 이상 없으면 아래 Git 명령으로 반영합니다.

## Apps Script 연결
이미 아래 Web App URL이 코드에 반영되어 있습니다.
- `https://script.google.com/macros/s/AKfycbzBH8keceX7BW4AzWNJ1Kw2pOJs0T8Copyd1T42H4BzpmUaCWJdVmEyT4CwL7gNDYRXKA/exec`

## Git 반영 순서
```bash
git status
git add .
git commit -m "홈페이지 전체 교체본 적용"
git push
```

## 참고
- favicon 파일은 포함하지 않았습니다. 브라우저 콘솔의 favicon 404는 치명적인 오류가 아닙니다.
- 공지/꿀팁 시트에 데이터가 없으면 빈 상태 메시지가 보입니다.
