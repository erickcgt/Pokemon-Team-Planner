//!!!!!--------------GLOBAL VARIABLES----------------!!!!!!//
var partyCount=1; //value of next available partySlot
var listener = [false, false, false, false, false, false]; //array to track state of eventListeners (to prevent duplicates)
//!!!!!-------------DROPDOWNS----------!!!!!!!!//
var dropdown = document.getElementsByClassName("dropdown"); //array of all dropdowns
var dropdownRow = document.getElementsByClassName("dropdownRow"); //array of all dropdownContent
var dropdownButton = document.getElementsByClassName("dropdownButton");
var dropdownLinks = document.getElementsByClassName('col').childNodes;
var loaded = false;





for(var i=0; i<dropdown.length; i++){ //ASSIGN EVENT LISTENERS TO EVERY DROPDOWN
  dropdown[i].addEventListener("mouseover",  function(){
    for(var j=0; j<dropdownRow.length; j++){ //when mouse enters EventListener, display dropdownContent of each dropdown
      var col2;
      if(Array.prototype.indexOf.call(dropdown, this)==j){ //find dropdown associated with button
        col2 = $(this).find("div").filter(function(){ //find 2nd column, if any
          if(this.id==="Two"){
            return true;
          }
        });
        //DISPLAYING DROPDOWNS
        dropdownRow[j].style.display = "table-row"; //display dropdown
        if(col2.text()){ //display 2nd column, if any
          dropdownRow[j+1].style.display = "table-row";
          col2.css({left: $(dropdown[j]).width()});
          $(dropdownRow[j+1]).width($(dropdown[j]).width());
          col2 = undefined;
        }
      }
    }
  });
  dropdown[i].addEventListener("mouseout",  function(){
    for(var j=0; j<dropdownRow.length; j++){ //when mouse exits EventListener, stop displaying dropdownContent of each dropdown
      if(Array.prototype.indexOf.call(dropdown, this)==j){
        dropdownRow[j].style.display = "none";
        dropdownRow[j+1].style.display = "none";
      }
    }
  });
  //color coding dropdowns
  $(dropdownRow[1]).css({"background": "linear-gradient(to bottom, #bab1a6, #bab1a6 11%, #c22938 11%, #c22938 22%, #b995db 22%, #b995db 33%, #b647ed 33%, #b647ed 44%, #c9b965 44%, #c9b965 55%, #ad814b 55%, #ad814b 66%, #a7c263 66%, #a7c263 77%, #8167ab 77%, #8167ab 88%, #b6b7cf 88%, #b6b7cf 100%)"});
  $(dropdownRow[2]).css({"background": "linear-gradient(to bottom, #e88c4f, #e88c4f 11%, #60c6e6 11%, #60c6e6 22%, #85c965 22%, #85c965 33%, #dbd960 33%, #dbd960 44%, #de71ba 44%, #de71ba 55%, #c6f2f7 55%, #c6f2f7 66%, #908ae6 66%, #908ae6 77%, #594b49 77%, #594b49 88%, #dbb4c1 88%, #dbb4c1 100%)"});
}
//!!!!!!!!!---------------POKEMON LIST-----------------!!!!!!!
getData();
//grabbing pokemon data
async function getData(){ //API CALLING FOR TYPE PROPERTIES
  //populating table of pokemon
  var listLength = 649; //649
  for(var i=1; i<=listLength; i++){
    //adding circle
    var cell = document.createElement("div");
    var pokemonSlot = document.createElement("div");
    var grid = document.getElementById("grid");
    cell.className = "cell";
    cell.id = i;
    pokemonSlot.className = "pokemonSlot";
    pokemonSlot.id = 'pokemonSlot' + i;
    cell.appendChild(pokemonSlot);
    //adding cell to table
    grid.appendChild(cell);
  }
  let proxyURL = 'https://cors-anywhere.herokuapp.com/'; //to avoid CORS errors
  let apiURL = 'pogoapi.net/api/v1/pokemon_types.json';
  var pokemon = await fetch(proxyURL + apiURL, {
    headers: {
    'Content-Type': 'application/json'
    }
  }
  ).then(response=>response.json()); //locally caching to reduce latency
  for(var i=1; i<pokemon.length; i++){
    let form = pokemon[i].form;
    if(form==='Normal'|| //ignore forms (unless Pokemon inherently only comes in non-Normal forms)
      form==='Plant'||
      form==='West_sea'||
      form==='Overcast'||
      form==='Origin'||
      form==='Sky'||
      form==='Winter'||
      form==='Incarnate'||
      form==='Ordinary'||
      form==='Aria'||
      form==='Blue_striped'||
      form==='Standard'){
      var id = pokemon[i].pokemon_id;
      var type1 = pokemon[i].type[0];
      var type2 = pokemon[i].type[1];
      var name = pokemon[i].pokemon_name.split(' ').join('').toLowerCase();
      var capitalName = pokemon[i].pokemon_name.split(' ').join('');
      //assign tooltip with name
      //adding tooltip with name
      var tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      tooltip.textContent = capitalName;
      document.getElementById(id).appendChild(tooltip);
      //assign color by type
      var pokeSlot = document.getElementById('pokemonSlot' + id);
      pokeSlot.parentElement.classList.add(type1); //adding type to class for easy future reference
      pokeSlot.parentElement.classList.add(type2); //adding type to class for easy future reference
      pokeSlot.parentElement.classList.add(findRegion(id)); //adding region to class for easy future reference
      pokeSlot.parentElement.classList.add(name); //adding name to class for easy future reference
      pokeSlot.parentElement.removeEventListener('click', function(){editImage(this.id);});
      pokeSlot.parentElement.addEventListener('click', function(){editImage(this.id);});
      pokeSlot.parentElement.onmouseover="";
      let color1=matchColor(type1), color2=matchColor(type2);
      if(color2==='none'){
        color2=color1;
      }
      pokeSlot.style.backgroundImage = 'url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png' + '"), linear-gradient(135deg, ' + color1 + ', ' + color1 + ' 40%,' + color2 + ' 60%, '+color2+')';
    }
    //stop at pokemon #649 (last pokemon Unova region)
    if(id===649){
      loaded = true;
      break;}
    }
  return Promise;
}
//returns corresponding color from type parameter
function matchColor(type){
  if(type==='Normal'){return '#bab1a6';}
  if(type==='Fighting'){return '#c22938';}
  if(type==='Flying'){return '#b995db';}
  if(type==='Poison'){return '#b647ed';}
  if(type==='Ground'){return '#c9b965';}
  if(type==='Rock'){return '#ad814b';}
  if(type==='Bug'){return '#a7c263';}
  if(type==='Ghost'){return '#8167ab';}
  if(type==='Steel'){return '#b6b7cf';}
  if(type==='Fire'){return '#e88c4f';}
  if(type==='Water'){return '#60c6e6';}
  if(type==='Grass'){return '#85c965';}
  if(type==='Electric'){return '#dbd960';}
  if(type==='Psychic'){return '#de71ba';}
  if(type==='Ice'){return '#c6f2f7';}
  if(type==='Dragon'){return '#908ae6';}
  if(type==='Dark'){return '#594b49';}
  if(type==='Fairy'){return '#dbb4c1';}
  if(!type){return 'none';}
}
//!!!!!!!!!----------------FILTERS-----------------!!!!!!!!!//
//filter function (triggered by OnClick event on <a> tags)
async function filterByType(type){
  var pokemon = document.getElementById('grid').children;
  $(pokemon).remove(); //clear list to have empty grid
  await getData(); //repopulate list (and wait until process is done)
  //filter
  for(var i=0; i<pokemon.length; i++){
    if(!pokemon[i].classList.contains(type)){
      $(pokemon[i]).remove();
      i--;
    }
  }
}
//filter function (triggered by OnClick event on <a> tags)
async function filterByRegion(region){
  var pokemon = document.getElementById('grid').children;
  $(pokemon).remove(); //clear list to have empty grid
  await getData(); //repopulate list (and wait until process is done)
  //filter
  for(var i=0; i<pokemon.length; i++){
    if(!pokemon[i].classList.contains(region)){
      $(pokemon[i]).remove();
      i--;
    }
  }
}
//returns region of pokemon from id parameter
function findRegion(id){
  if(id<=151){return 'Kanto';}
  if(id<=251){return 'Johto';}
  if(id<=386){return 'Hoenn';}
  if(id<=493){return 'Sinnoh';}
  if(id<=649){return 'Unova';}
}
//filter function (triggered by keyUp event on <input> tag aka search bar)
async function filterByName(){
  var pokemon = document.getElementById('grid').children;
  $(pokemon).remove(); //clear list to have empty grid
  await getData(); //repopulate list (and wait until process is done)
  var input = document.getElementById('searchInput').value.toLowerCase();
  //filter
  for(var i=0; i<pokemon.length; i++){
    var lastClass = pokemon[i].classList.item(pokemon[i].classList.length-1);
    if(lastClass.indexOf(input)){
      console.log('if statement');
      $(pokemon[i]).remove();
      i--;
    }
  }
}
//!!!!!!!!--------------PARTY-RELATED FUNCTIONS---------------!!!!!!!!!!!!!//
//adding pokemon img to partySlot (returns promise upon loading)
function loadImage(id){
  try{
    return new Promise((resolve, reject) => {
      //if party is full, remove first party member
      if(partyCount===7){
        removeFromParty(1);
      }
      //otherwise, load image and return promise when done
      var img = document.createElement("img");
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', reject);
      img.src = 'images/' + id + '.svg';
      img.classList.add('party' + partyCount);
      img.classList.add('partyImg');
      img.style.display = 'inline-flex';
      var target = document.getElementById('partySlot' + partyCount);
      target.appendChild(img);
      if(listener[partyCount-1]===false){ //to prevent duplicate listeners
        img.parentElement.addEventListener('click', removeFromParty.bind(null, partyCount));//add eventListener for future removal from team
        listener[partyCount-1]=true;
      }
      partyCount++;
    });
  }
  catch(err){
    location.reload();
    return;
  }
}
//resizing and centering image
async function editImage(id){
  if(partyCount>1){
    var lastSlot = document.getElementById('partySlot'+(partyCount-1));
    if(!lastSlot.style.background){
      location.reload();
    }
  }
  try{
    var img = await loadImage(id); //only store image object once it has loaded
    //fitting image to partySlot while preserving aspect ratio
    var targetWidth = 196.4, targetHeight = 122;
    var xyRatio = img.width/img.height;
    if(img.width>=img.height){
      img.width = targetWidth*1.1;
      img.height = img.width*1.1*xyRatio;
    }
    if(img.width<img.height){
      img.height = targetHeight*1.1;
      img.width = img.width*1.1/xyRatio;
    }
    //centering image
    img.style.marginLeft = (targetWidth-img.width)/2 - 20 + 'px';
    img.style.marginTop = (targetHeight-img.height)/2 + 'px';
    //changing gradient to match type property
    var gradient = document.getElementById('pokemonSlot'+id).style.backgroundImage.split('"), ')[1];
    document.getElementById('partySlot'+(partyCount-1)).style.background = gradient;
    //adding tooltip with name
    var tooltip = document.getElementById(id).children[document.getElementById(id).children.length-1].cloneNode(true);
    document.getElementById('partySlot'+(partyCount-1)).appendChild(tooltip);
  }
  catch(err){
    location.reload();
    return;
  }
}
//to allow removal of pokemon from team
function removeFromParty(num){
  try {
    //remove clicked pokemon and tooltip with name
    document.getElementsByClassName('party'+num)[0].remove();
    document.getElementById('partySlot'+num).children[document.getElementById('partySlot'+num).children.length-1].remove();
    //store lastGradient in case it needs to be reapplied to moving pokemon
    var lastGradient = document.getElementById('partySlot'+(partyCount-1)).style.background
    //remove gradient of partySlot
    document.getElementById('partySlot'+(partyCount-1)).style.background = 'linear-gradient(to bottom, #008169, #002e23)';
    partyCount--; //decrease partyCount
    //if removed pokemon was not last on list, move all following elements down
    if(num<partyCount){
      for(var i=num; i<partyCount; i++){
        $('#partySlot'+(i)).append($('#partySlot'+(i+1)+'>img'));
        var temp = document.getElementsByClassName('party'+(i+1))[0].classList;
        temp.remove('party'+(i+1));
        temp.add('party'+(i))
        //move tooltips down
        $(document.getElementById('partySlot'+(i+1)).children[0]).insertAfter(document.getElementsByClassName('party'+(i))[0]);
        //move gradients down
        if(document.getElementById('partySlot'+(i+1)).style.background!='linear-gradient(#00816e, #002e23'){
          document.getElementById('partySlot'+(i)).style.background = document.getElementById('partySlot'+(i+1)).style.background;
        }
        else{
          document.getElementById('partySlot'+(i)).style.background = lastGradient;
        }
      }
    }
  }
  catch(err) {
    location.reload();
    return;
  }

}
