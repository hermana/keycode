const vscode = acquireVsCodeApi();

const game = {
  //Div of the greenhouse
  div: document.getElementById('keycrop'),

  //Window
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 2,
  //Frames & framerate
  frames: 0,  //Frames since game start
  fps: 30,
  
  //List with all the plants
  plants: []
};

// Handle button clicks
window.document.getElementById('inventory-button').addEventListener('click',() =>{
  game.div.setAttribute('background', 'inventory');
  document.getElementById("generator-instructions").hidden=true;
  document.getElementById("inventory-button").classList.add('selected');
  document.getElementById("greenhouse-button").classList.remove('selected');
  document.getElementById("generator-button").classList.remove('selected');
  var greenhouse_plants = document.getElementsByClassName('plant');
  for (var i = 0; i < greenhouse_plants.length; ++i) { 
      greenhouse_plants[i].hidden = true;
  }
  var harvested_plants = document.getElementsByClassName('harvested-plant');
  for (var i = 0; i < harvested_plants.length; ++i) { 
      harvested_plants[i].hidden = false;
  }
});

window.document.getElementById('greenhouse-button').addEventListener('click',() =>{
  game.div.setAttribute('background', 'dirt');
  document.getElementById("generator-instructions").hidden=true;
  document.getElementById("greenhouse-button").classList.add('selected');
  document.getElementById("inventory-button").classList.remove('selected');
  document.getElementById("generator-button").classList.remove('selected');
  var greenhouse_plants = document.getElementsByClassName('plant');
  for (var i = 0; i < greenhouse_plants.length; ++i) { 
      greenhouse_plants[i].hidden = false;
  }
  var harvested_plants = document.getElementsByClassName('harvested-plant');
  for (var i = 0; i < harvested_plants.length; ++i) { 
      harvested_plants[i].hidden = true;
  }
});

window.document.getElementById('generator-button').addEventListener('click',() =>{
  game.div.setAttribute('background', 'inventory');
  document.getElementById("generator-instructions").hidden=false;
  document.getElementById("generator-button").classList.add('selected');
  document.getElementById("greenhouse-button").classList.remove('selected');
  document.getElementById("inventory-button").classList.remove('selected');
  var greenhouse_plants = document.getElementsByClassName('plant');
  for (var i = 0; i < greenhouse_plants.length; ++i) { 
      greenhouse_plants[i].hidden = true;
  }
  var harvested_plants = document.getElementsByClassName('harvested-plant');
  for (var i = 0; i < harvested_plants.length; ++i) { 
      harvested_plants[i].hidden = true;
  }
});

//Messages from VSCode
window.addEventListener('message', event => {
  const message = event.data; 
  switch (message.action) {
    case 'key-tracking-mode':
      hideGameElements();
      break;
    case 'background':
      game.div.setAttribute('background', message.value);
      if(message.value === 'blackout'){
        hideGameElements();
      }
      break;
    case 'add':
      switch (message.species) {
        case 'bean':
          game.plants.push(new Bean());
          break;
        case 'chili':
          game.plants.push(new Chili());
          break;
        case 'broccoli':
          game.plants.push(new Broccoli());
          break;
        case 'lettuce':
          game.plants.push(new Lettuce());
          break;
        case 'tomato':
          game.plants.push(new Tomato());
          break;
      }
      break;
    case 'grow':
      switch(message.species) {
        case 'bean':
          game.plants.forEach(plant => {
            if(plant.species === 'bean'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'chili':
          game.plants.forEach(plant => {
            if(plant.species === 'chili'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'broccoli':
          game.plants.forEach(plant => {
            if(plant.species === 'broccoli'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'lettuce':
          game.plants.forEach(plant => {
            if(plant.species === 'lettuce'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'tomato':
            game.plants.forEach(plant => {
              if(plant.species === 'tomato'){
                plant.grow();
              }
            });
          checkAcheivements();
          break;
      }
      break;
    case 'save_plants':
      plantsString = getPlantsString();
      vscode.postMessage({ type: 'save_plants', content: plantsString });
      break;
    case 'load':
      switch(message.species){
        case 'bean':
          let bean = new Bean();
          bean.setSize(message.size);
          bean.setIsHarvested(message.harvested);
          bean.setHotKeyUses(message.hotkey_uses);
          game.plants.push(bean);
          break;
        case 'chili':
          let chili = new Chili();
          chili.setSize(message.size);
          chili.setIsHarvested(message.harvested);
          chili.setHotKeyUses(message.hotkey_uses);
          game.plants.push(chili);
          break;
        case 'broccoli':
          let broccoli = new Broccoli();
          broccoli.setSize(message.size);
          broccoli.setIsHarvested(message.harvested);
          broccoli.setHotKeyUses(message.hotkey_uses);
          game.plants.push(broccoli);
          break;
        case 'lettuce':
          let lettuce = new Lettuce();
          lettuce.setSize(message.size);
          lettuce.setIsHarvested(message.harvested);
          lettuce.setHotKeyUses(message.hotkey_uses);
          game.plants.push(lettuce);
          break;
        case 'tomato':
          let tomato = new Tomato();
          tomato.setSize(message.size);
          tomato.setIsHarvested(message.harvested);
          tomato.setHotKeyUses(message.hotkey_uses);
          game.plants.push(tomato);
          break;
      }
      break;
    //Update scale - take this out?
    case 'scale':
      switch (message.value.toLowerCase()) {
        case 'small':
          game.scale = 1;
          break;
        case 'medium':
        default:
          game.scale = 2;
          break;
        case 'big':
          game.scale = 3;
          break;
      }
      document.body.style.setProperty('--scale', game.scale);
      onResize();
      break;
  }
});


function checkAcheivements(){
  //check that there is one of each of the "level one"
  let levelOneChecklist = 0;
  //FIXME: I'm not sure why there were duplicates in the list. 
  currentPlants = [...new Set(game.plants)];
  currentPlants.forEach(plant => {
    if(plant.html_element.classList.contains('harvested-plant')){
        if(LEVEL_ONE.includes(plant.species)){
          levelOneChecklist+=1;
        }
    }          
  }); 
  if(LEVEL_ONE.length === levelOneChecklist){
    vscode.postMessage({type: 'level_one'});
  }
}

function hideGameElements(){
  document.getElementById("generator-button").hidden=true;
  document.getElementById("greenhouse-button").hidden=true;
  document.getElementById("inventory-button").hidden=true;
}

//TODO: do I need a resize at all
function onResize() {
  game.width = window.innerWidth;
  game.height = window.innerHeight;
}


function getPlantsString(){
  var plantsString = [];
  //FIXME: why do I have to do this? I'm double adding plants somewhere
  currentPlants = [...new Set(game.plants)];
  if(currentPlants.length>0){
  currentPlants.forEach(plant => {
    let harvested = plant.html_element.classList.contains('harvested-plant');
    let plantString = {
      'species': plant.species,
      'size': plant.size,
      'harvested': harvested, 
      'hotkey_uses': plant.num_hotkey_uses,
      'num_mashes': plant.num_mashes
    };
    plantsString.push(plantString);
  });
}
  return plantsString;
}


function update() {
  if (game.width !== window.innerWidth || game.height !== window.innerHeight) {
    onResize();
  }
  game.frames++;
}


//Start loop
const timer = setInterval(update, 1000 / game.fps);

//Tell vscode game loaded
//TODO: type or action here?
vscode.postMessage({ type: 'init' });
