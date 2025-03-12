class Plant{

    //Pet info
    #init = false;
    #type = '';
    get type() { return this.#type; }
    // #pos = new Vec2();
    // get pos() { return this.#pos; }
    #html_element;
    get html_element() { return this.#html_element; } 
    
    constructor() {
       // this.#pos = position;
    }
  
    //Init
    init(type) {
      //Already initialized
      if (this.#init) return;
  
      //No type
      if (type == '') return;
      this.#type = type;
  
      //Create plant element
      console.log("CREATE THE DIV")
      const element = document.createElement('div');
      game.div.appendChild(element);
      this.#html_element = element;
  
      //Add classes & move to random point
      element.classList.add('plant');
      element.classList.add(this.type);
  
      //Add plant to game plants list
      game.plants.push(this);
    }
  
    update() {
        //TODO
    }

  }


class Basil extends Plant { 
    constructor() {
      super();
      this.init('basil');
    }
}