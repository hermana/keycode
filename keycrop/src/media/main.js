
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
}

// Handle button clicks
window.document.getElementById('inventory-button').addEventListener('click',() =>{
  game.div.setAttribute('background', 'inventory');
  document.getElementById("inventory-button").hidden = true;
  document.getElementById("greenhouse-button").hidden = false;
  var greenhouse_plants = document.getElementsByClassName('plant');
  for (var i = 0; i < greenhouse_plants.length; ++i) { 
      greenhouse_plants[i].hidden = true;
  }
  var harvested_plants = document.getElementsByClassName('harvested-plant');
  for (var i = 0; i < harvested_plants.length; ++i) { 
      harvested_plants[i].hidden = false;
  }
})

window.document.getElementById('greenhouse-button').addEventListener('click',() =>{
  game.div.setAttribute('background', 'dirt');
  document.getElementById("inventory-button").hidden = false;
  document.getElementById("greenhouse-button").hidden = true;
  var greenhouse_plants = document.getElementsByClassName('plant');
  for (var i = 0; i < greenhouse_plants.length; ++i) { 
      greenhouse_plants[i].hidden = false;
  }
  var harvested_plants = document.getElementsByClassName('harvested-plant');
  for (var i = 0; i < harvested_plants.length; ++i) { 
      harvested_plants[i].hidden = true;
  }
})

//Messages from VSCode
window.addEventListener('message', event => {
  const message = event.data; 
  switch (message.action) {
    case 'background':
      game.div.setAttribute('background', message.value);
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
          console.log('ADD NEW LETTUCE TO PLANT ARRAY');
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
            if(plant.species == 'bean'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'chili':
          game.plants.forEach(plant => {
            if(plant.species == 'chili'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'broccoli':
          game.plants.forEach(plant => {
            if(plant.species == 'broccoli'){
              plant.grow();
            }
          })
          checkAcheivements();
          break;
        case 'lettuce':
          game.plants.forEach(plant => {
            if(plant.species == 'lettuce'){
              plant.grow();
            }
          })
          checkAcheivements();
          break;
        case 'tomato':
            game.plants.forEach(plant => {
              if(plant.species == 'tomato'){
                plant.grow();
              }
            })
          checkAcheivements();
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
  })
  console.log('the length of the list');
  console.log(levelOneChecklist); 
  if(LEVEL_ONE.length == levelOneChecklist){
    vscode.postMessage({type: 'level_one'});
  }
}

//TODO: do I need a resize at all
function onResize() {
  game.width = window.innerWidth;
  game.height = window.innerHeight;
}




function update() {
  if (game.width != window.innerWidth || game.height != window.innerHeight) onResize()
  game.frames++
}


//Start loop
const timer = setInterval(update, 1000 / game.fps)

//Tell vscode game loaded
//TODO: type or action here?
vscode.postMessage({ type: 'init' })
