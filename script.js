// 테스트용 데이터 (나중에 JSON으로 교체 예정)
const data = [
  { name: "Jett", guild: "친구들", level: 250, power: 9000 },
  { name: "Alpha", guild: "친구둘", level: 240, power: 8000 },
  { name: "Beta", guild: "친구삼", level: 230, power: 7000 }
];

// ===== 대시보드 계산 =====
const total = data.length;
const avgPower = (data.reduce((a, b) => a + b.power, 0) / total).toFixed(0);
const avgLevel = (data.reduce((a, b) => a + b.level, 0) / total).toFixed(1);

document.getElementById("total-count").innerText = total;
document.getElementById("avg-power").innerText = avgPower;
document.getElementById("avg-level").innerText = avgLevel;

// ===== 랭킹 정렬 =====
data.sort((a, b) => b.power - a.power);

const tbody = document.getElementById("ranking-body");

data.forEach((user, index) => {
  const row = `
    <tr>
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.guild}</td>
      <td>${user.level}</td>
      <td>${user.power}</td>
    </tr>
  `;
  tbody.innerHTML += row;
});