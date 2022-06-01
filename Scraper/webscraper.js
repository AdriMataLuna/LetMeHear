const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const { MongoClient } = require("mongodb");                                                                                                                                       
const url = "mongodb+srv://admin:1234@cluster0.6kdhs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
var creationDate = new Date('2022-05-31T23:00:00');

async function scraper(){
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const response = await page.goto('https://www.elportaldemusica.es/site/more-listened?singles-page=2');
    const body = await response.text();
    const { window: { document } } = new jsdom.JSDOM(body);
    await client.connect();
    const db = client.db("letmehear");
	  const col = db.collection("dailysongs");
    var elements = document.querySelectorAll('.single-entry p');
  
    for(i = 1; i<elements.length; i += 3){
      j = i +1
      var cadena = "https://www.youtube.com/results?search_query="+elements[i].textContent+" "+elements[j].textContent;
      var urlYouTube = cadena.replace(/ /g,"+");
      song = {
        "data": creationDate,
        "name": elements[i].textContent,
        "author": elements[j].textContent,
        "url": urlYouTube,
      }
      
      if( (await col.countDocuments({ name: elements[i].textContent,author: elements[j].textContent  })) > 0 ){
        
        console.log('YA EXISTE LA CANCION:'+elements[i].textContent+'del autor'+elements[j].textContent);

        
        
      }else{
        if((await col.countDocuments({ data: creationDate  })) < 9){
       
          await col.insertOne(song);
          console.log('se ha hecho insert del tema:'+elements[i].textContent+' del autor '+elements[j].textContent);
      }else{

        while((await col.countDocuments({ data: creationDate  })) == 9){
          creationDate = addDaysToDate(creationDate, 1);
        }
        var cadena = "https://www.youtube.com/results?search_query="+elements[i].textContent+" "+elements[j].textContent;
        var urlYouTube = cadena.replace(/ /g,"+");
        song = {
          "data": creationDate,
          "name": elements[i].textContent,
          "author": elements[j].textContent,
          "url": urlYouTube,
        }
          await col.insertOne(song);
          console.log('se ha hecho insert del tema:'+elements[i].textContent+' del autor '+elements[j].textContent);
      }
      }
    }
    await browser.close();

  }catch (error){
    console.error(error);

  }
  await client.close();
  

}

scraper();

/* setInterval(scraper(),432000000); */
/* 432 000 000 ms = 5dias */

function addDaysToDate(date, days){
  var res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}