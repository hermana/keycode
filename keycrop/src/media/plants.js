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
      this.#size = 'small';
  
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
        //FIXME: abstract the levels somewhere + I shouldnt remove the class every time
        if(this.#num_hotkey_uses>8){
          this.#size = "large";
          this.#html_element.classList.remove("medium");
          this.#html_element.classList.add(this.#size);
        }else if(this.#num_hotkey_uses>2){
          this.#size = "medium";
          this.#html_element.classList.remove("small");
          this.#html_element.classList.add(this.#size);
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