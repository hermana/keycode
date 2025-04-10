NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES = 60000; // 1 minute


class Plant{

    #init = false;
    #species = '';
    get species() { return this.#species; }
    #size = '';
    get size() { return this.#size; }
    #html_element;
    get html_element() { return this.#html_element; } 
    #num_hotkey_uses =0;
    get num_hotkey_uses() {return this.#num_hotkey_uses;}
    #last_key_use = Date.now();
    get last_key_use() {return this.#last_key_use;}
    #num_mashes = 0;
    get num_mashes() {return this.#num_mashes;}

    constructor() {
    }
  
    //Init
    init(species) {
      //Already initialized
      if (this.#init) {
        return;
      }
  
      //TODO: error handling if no type?
      if (species === '') {
        return;
      }
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
        //check for mashing 
        let now = Date.now();
        if(now - this.#last_key_use > NUM_MILLISECONDS_ALLOWED_BETWEEN_KEY_USES){
          this.#num_hotkey_uses+=1;
          this.#last_key_use = now;
          if(this.#num_hotkey_uses>8 && this.#html_element.classList.contains('harvested-plant')){
            vscode.postMessage({ type: 'harvested', text: this.species });
          }
          else if(this.#num_hotkey_uses>8){
            this.#html_element.classList.remove("plant");
            this.#html_element.classList.add("harvested-plant");
            this.#html_element.hidden = true;
            vscode.postMessage({ type: 'harvested', text: this.species });
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
        }else{
          this.#num_mashes +=1;
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
        this.#html_element.hidden = game.div.getAttribute('background') === 'inventory' ? false : true;
      }else{
        this.#html_element.classList.remove("harvested-plant");
        this.#html_element.classList.add('plant');
        this.#html_element.hidden = game.div.getAttribute('background') === 'inventory' ? true : false;
      }
    }

    setHotKeyUses(n){
      this.#num_hotkey_uses=n;
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