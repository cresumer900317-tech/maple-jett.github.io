const data = [
  { name:"Jett", guild:"친구들", level:250, power:9000, popularity:500 },
  { name:"Alpha", guild:"친구둘", level:240, power:8000, popularity:400 },
  { name:"Beta", guild:"친구삼", level:230, power:7000, popularity:300 }
];

function render(){
  document.getElementById("total-count").innerText = data.length;

  document.getElementById("avg-power").innerText =
    (data.reduce((a,b)=>a+b.power,0)/data.length).toFixed(0);

  document.getElementById("avg-level").innerText =
    (data.reduce((a,b)=>a+b.level,0)/data.length).toFixed(1);

  renderRanking(data);
}

function renderRanking(list){
  let html="";
  list.forEach((d,i)=>{
    html+=`
      <tr>
        <td>${i+1}</td>
        <td>${d.name}</td>
        <td>${d.guild}</td>
        <td>${d.level}</td>
        <td>${d.power}</td>
      </tr>`;
  });
  document.getElementById("ranking-body").innerHTML=html;
}

function sortRanking(type){
  const sorted=[...data].sort((a,b)=>b[type]-a[type]);
  renderRanking(sorted);
}

render();