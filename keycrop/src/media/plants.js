
class Plant{

    #init = false;
    #species = '';
    get species() { return this.#species; }
    #size = '';
    get size() { return this.#size; }
    #html_element;
    get html_element() { return this.#html_element; } 
    #num_hotkey_uses =0;

    constructor() {
    }
  
    //Init
    init(species) {
      //Already initialized
      if (this.#init) return;
  
      //No type
      if (species == '') return;
      this.#species = species;
      this.#size = 'start';
  
      //Create plant element
      const element = document.createElement('div');
      game.div.appendChild(element);
      this.#html_element = element;
  
      //Add classes & move to random point
      element.classList.add('plant');
      element.classList.add(this.species);
      element.classList.add(this.size);
  
      //Add plant to game plants list
      game.plants.push(this);
    }
  
    grow() {
        this.#num_hotkey_uses+=1;
        if(this.#num_hotkey_uses>8){
          this.#html_element.classList.remove("plant");
          this.#html_element.classList.add("harvested-plant");
          this.#html_element.hidden = true;
          vscode.postMessage({ type: 'harvested', text: this.species })
        }
        else if(this.#num_hotkey_uses>6){
          this.#size = "large";
          this.#html_element.classList.remove("medium");
          this.#html_element.classList.add(this.#size);
        }
        else if(this.#num_hotkey_uses>4){
          this.#size = "medium";
          this.#html_element.classList.remove("small");
          this.#html_element.classList.add(this.#size);
        }else if(this.#num_hotkey_uses>2){
          this.#size = "small";
          this.#html_element.classList.remove("start");
          this.#html_element.classList.add(this.#size);
        }
    }

    setSize(s){
      this.#size = s; //FIXME: am I really doing anything with this?
      this.#html_element.classList.remove("start");
      this.#html_element.classList.remove("small");
      this.#html_element.classList.remove("medium");
      this.#html_element.classList.remove("large");
      this.#html_element.classList.add(this.#size);
    }

    setIsHarvested(h){
      if(h){
        this.#html_element.classList.remove("plant");
        this.#html_element.classList.add('harvested-plant');
      }else{
        this.#html_element.classList.remove("harvested-plant");
        this.#html_element.classList.add('plant');
      }
    }
    
  }


class Bean extends Plant { 
    constructor() {
      super();
      this.init('bean');
    }
}

class Chili extends Plant { 
  constructor() {
    super();
    this.init('chili');
  }
}

class Broccoli extends Plant {
  constructor(){
    super();
    this.init('broccoli');
  }
}

class Lettuce extends Plant {
  constructor(){
    super();
    this.init('lettuce');
  }
}

class Tomato extends Plant {
  constructor(){
    super();
    this.init('tomato');
  }
}