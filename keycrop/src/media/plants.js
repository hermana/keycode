class Plant{

    #init = false;
    #type = '';
    get type() { return this.#type; }
    #html_element;
    get html_element() { return this.#html_element; } 
    #num_hotkey_uses =0;

    constructor() {
    }
  
    //Init
    init(type) {
      //Already initialized
      if (this.#init) return;
  
      //No type
      if (type == '') return;
      this.#type = type;
  
      //Create plant element
      const element = document.createElement('div');
      //const element = document.createElement('img');
      // element.src = "./plants/size_16/basil_small.png"
      //element.src = "plants/size_16/basil_small.pngs"
      game.div.appendChild(element);
      this.#html_element = element;
  
      //Add classes & move to random point
      element.classList.add('plant');
      element.classList.add(this.type);
      element.classList.add('small')
  
      //Add plant to game plants list
      game.plants.push(this);
    }
  
    grow() {
        this.#num_hotkey_uses+=1;
        //FIXME: abstract the levels somewhere + I shouldnt remove the class every time
        if(this.#num_hotkey_uses>8){
          this.#html_element.classList.remove("medium");
          this.#html_element.classList.add("large");
        }else if(this.#num_hotkey_uses>2){
          this.#html_element.classList.remove("small");
          this.#html_element.classList.add("medium");
        }
    }

  }


class Basil extends Plant { 
    constructor() {
      super();
      this.init('basil');
    }
}