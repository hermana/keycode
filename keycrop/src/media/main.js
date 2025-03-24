
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
})

window.document.getElementById('greenhouse-button').addEventListener('click',() =>{
  game.div.setAttribute('background', 'dirt');
  document.getElementById("inventory-button").hidden = false;
  document.getElementById("greenhouse-button").hidden = true;
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
          game.plants.push(new Lettuce());
          break;
        case 'tomato':
          game.plants.push(new Tomato());
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
          break;
        case 'chili':
            game.plants.forEach(plant => {
              if(plant.species == 'chili'){
                plant.grow();
              }
            });
          break;
        case 'broccoli':
          game.plants.forEach(plant => {
            if(plant.species == 'broccoli'){
              plant.grow();
            }
          })
        case 'lettuce':
          game.plants.forEach(plant => {
            if(plant.species == 'lettuce'){
              plant.grow();
            }
          })
          break;
        case 'tomato':
            game.plants.forEach(plant => {
              if(plant.species == 'tomato'){
                plant.grow();
              }
            })
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




//Resize window
function onResize() {
  //Update game window size
  game.width = window.innerWidth;
  game.height = window.innerHeight;

  //will need to update all the plants
  //game.plants.forEach((plant) => plant.moveTo(plant.pos))
}




function update() {
  //Window size changed
  if (game.width != window.innerWidth || game.height != window.innerHeight) onResize()

  //Next frame
  game.frames++

  //Update plants
  //game.plants.forEach((plant) => plant.update())
}


//Start loop
const timer = setInterval(update, 1000 / game.fps)

//Tell vscode game loaded
//TODO: type or action here?
vscode.postMessage({ type: 'init' })
