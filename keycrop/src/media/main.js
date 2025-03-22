
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
})

//Messages from VSCode
window.addEventListener('message', event => {
  const message = event.data; 
  switch (message.action) {
    case 'background':
      console.log("we are switching the background");
      game.div.setAttribute('background', message.value);
      break;
    case 'add':
      switch (message.species) {
        case 'basil':
          game.plants.push(new Basil());
          break;
        case 'daisy':
          game.plants.push(new Daisy());
          break;
      }
      break;
    case 'grow':
      switch(message.species) {
        case 'basil':
          game.plants.forEach(plant => {
            if(plant.species == 'basil'){
              plant.grow();
            }
          });
          break;
          case 'daisy':
            game.plants.forEach(plant => {
              if(plant.species == 'daisy'){
                plant.grow();
              }
            });
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
