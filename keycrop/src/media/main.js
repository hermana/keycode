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
        case 'corn':
          game.plants.push(new Corn());
          break;
        case 'strawberry':
          game.plants.push(new Strawberry());
          break;
        case 'mango':
          game.plants.push(new Mango());
          break;
        case 'poppy':
          game.plants.push(new Poppy());
          break;
        case 'sunflower':
          game.plants.push(new Sunflower());
          break;
        case 'snappea':
          game.plants.push(new SnapPea());
          break;
        case 'sphagettifern':
          game.plants.push(new SphagettiFern());
          break;
        case 'okra':
          game.plants.push(new Okra());
          break;
        case 'carrot':
          game.plants.push(new Carrot());
          break;
        case 'canola':
          game.plants.push(new Canola());
          break;
        case 'apple_tree':
          game.plants.push(new AppleTree());
          break;
        case 'cherry_tree':
          game.plants.push(new CherryTree());
          break;
      }
      break;
    case 'grow':
      switch(message.species) {
        case 'corn':
          game.plants.forEach(plant => {
            if(plant.species === 'corn'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'mango':
          game.plants.forEach(plant => {
            if(plant.species === 'mango'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'strawberry':
          game.plants.forEach(plant => {
            if(plant.species === 'strawberry'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'poppy':
          game.plants.forEach(plant => {
            if(plant.species === 'poppy'){
              plant.grow();
            }
          });
          checkAcheivements();
          break;
        case 'sunflower':
            game.plants.forEach(plant => {
              if(plant.species === 'sunflower'){
                plant.grow();
              }
            });
          checkAcheivements();
          break;
        case 'canola':
            game.plants.forEach(plant => {
              if(plant.species === 'canola'){
                plant.grow();
              }
            });
          checkAcheivements();
          break;
        case 'snappea':
            game.plants.forEach(plant => {
              if(plant.species === 'snappea'){
                plant.grow();
              }
            });
          checkAcheivements();
          break;
      case 'okra':
            game.plants.forEach(plant => {
              if(plant.species === 'okra'){
                plant.grow();
              }
            });
          checkAcheivements();
          break;
      case 'carrot':
            game.plants.forEach(plant => {
              if(plant.species === 'carrot'){
                plant.grow();
              }
            });
          checkAcheivements();
          break;
       case 'cherry_tree':
            game.plants.forEach(plant => {
              if(plant.species === 'cherry_tree'){
                plant.grow();
              }
            });
          checkAcheivements();
          break;
       case 'apple_tree':
            game.plants.forEach(plant => {
              if(plant.species === 'apple_tree'){
                plant.grow();
              }
            });
          checkAcheivements();
          break;
        case 'sphagettifern':
            game.plants.forEach(plant => {
              if(plant.species === 'sphagettifern'){
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
        case 'corn':
          let corn = new Corn();
          corn.setSize(message.size);
          corn.setIsHarvested(message.harvested);
          corn.setHotKeyUses(message.hotkey_uses);
          game.plants.push(corn);
          break;
        case 'strawberry':
          let strawberry = new Strawberry();
          strawberry.setSize(message.size);
          strawberry.setIsHarvested(message.harvested);
          strawberry.setHotKeyUses(message.hotkey_uses);
          game.plants.push(strawberry);
          break;
        case 'mango':
          let mango = new Mango();
          mango.setSize(message.size);
          mango.setIsHarvested(message.harvested);
          mango.setHotKeyUses(message.hotkey_uses);
          game.plants.push(mango);
          break;
        case 'poppy':
          let poppy = new Poppy();
          poppy.setSize(message.size);
          poppy.setIsHarvested(message.harvested);
          poppy.setHotKeyUses(message.hotkey_uses);
          game.plants.push(poppy);
          break;
        case 'sunflower':
          let sunflower = new Sunflower();
          sunflower.setSize(message.size);
          sunflower.setIsHarvested(message.harvested);
          sunflower.setHotKeyUses(message.hotkey_uses);
          game.plants.push(sunflower);
          break;
        case 'snappea':
          let snappea = new Snappea();
          snappea.setSize(message.size);
          snappea.setIsHarvested(message.harvested);
          snappea.setHotKeyUses(message.hotkey_uses);
          game.plants.push(snappea);
          break;
        case 'sphagettifern':
          let sphagettifern = new Sphagettifern();
          sphagettifern.setSize(message.size);
          sphagettifern.setIsHarvested(message.harvested);
          sphagettifern.setHotKeyUses(message.hotkey_uses);
          game.plants.push(sphagettifern);
          break;
        case 'canola':
          let canola = new Canola();
          canola.setSize(message.size);
          canola.setIsHarvested(message.harvested);
          canola.setHotKeyUses(message.hotkey_uses);
          game.plants.push(canola);
          break;
        case 'okra':
          let okra = new Okra();
          okra.setSize(message.size);
          okra.setIsHarvested(message.harvested);
          okra.setHotKeyUses(message.hotkey_uses);
          game.plants.push(okra);
          break;
        case 'carrot':
          let carrot = new Carrot();
          carrot.setSize(message.size);
          carrot.setIsHarvested(message.harvested);
          carrot.setHotKeyUses(message.hotkey_uses);
          game.plants.push(carrot);
          break;
        case 'apple_tree':
          let apple_tree = new AppleTree();
          apple_tree.setSize(message.size);
          apple_tree.setIsHarvested(message.harvested);
          apple_tree.setHotKeyUses(message.hotkey_uses);
          game.plants.push(apple_tree);
          break;
        case 'cherry_tree':
          let cherry_tree = new CherryTree();
          cherry_tree.setSize(message.size);
          cherry_tree.setIsHarvested(message.harvested);
          cherry_tree.setHotKeyUses(message.hotkey_uses);
          game.plants.push(cherry_tree);
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





