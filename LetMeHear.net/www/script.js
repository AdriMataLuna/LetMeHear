let zona_contingut = document.getElementById("principal");
let zona_descarrega = document.getElementById("downloads");
let zona_bottom = document.getElementById("bottomNav");
var todayDate = new Date().toISOString().slice(0, 10);
const creation_date = '2022-05-12';

zona_contingut.onload = fill();
/* -----------------------------------DB conection--------------------------------------- */

function getPost(){
  const res = fetch('https://data.mongodb-api.com/app/dailysonglist-lvytl/endpoint/list')
  return res
}

function stringToday(){
var d = ("0" + new Date().getDate()).slice(-2);
var m = ("0"+(new Date().getMonth()+1)).slice(-2);
var y = new Date().getFullYear();
var avui = y+"-"+m+"-"+d+"T21:00:00Z";
return avui;
}


/* -----------------------------------Body Creation--------------------------------------- */


function fill() {
  

  getPost().then(post => post.json()).then(postFormat => 
    postFormat.map(post => {
    
        if(post.data == stringToday()){
            
          let r1 = Math.random()*(256);
          let g1 = Math.random()*(256);
          let b1 = Math.random()*(256);
          
          let r2 = Math.random()*(256);
          let g2 = Math.random()*(256);
          let b2 = Math.random()*(256);
        
          zona_contingut.innerHTML += `
            <div class="item" style="background: linear-gradient(70deg,rgb(`+r1+`,`+g1+`,`+b1+`),rgb(`+r2+`,`+g2+`,`+b2+`));"
            onclick="window.location='`+post.url+`';">
                <h2>`+post.name+`</h2>
                <h4>`+post.author+`</h4>
            </div>`;
        }
    }))
}
