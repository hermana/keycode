"use strict";var J=Object.create;var I=Object.defineProperty;var B=Object.getOwnPropertyDescriptor;var z=Object.getOwnPropertyNames;var q=Object.getPrototypeOf,Q=Object.prototype.hasOwnProperty;var X=(i,t)=>{for(var e in t)I(i,e,{get:t[e],enumerable:!0})},W=(i,t,e,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of z(t))!Q.call(i,s)&&s!==e&&I(i,s,{get:()=>t[s],enumerable:!(o=B(t,s))||o.enumerable});return i};var d=(i,t,e)=>(e=i!=null?J(q(i)):{},W(t||!i||!i.__esModule?I(e,"default",{value:i,enumerable:!0}):e,i)),Z=i=>W(I({},"__esModule",{value:!0}),i);var ne={};X(ne,{GreenhouseWebViewProvider:()=>E,InventoryWebViewProvider:()=>M,activate:()=>ie,deactivate:()=>se});module.exports=Z(ne);var n=d(require("vscode")),G=d(require("fs")),A=d(require("path"));var V=d(require("vscode"));var l=[{key:"ctrl+shift+p",category:"Using VSCode",capital_key:"CTRL+SHIFT+P",command:"command_palette",commandId:"keycrop.growCommandPalette",description:"Show command palette",active:!0},{key:"ctrl+shift+k",category:"Editing",capital_key:"CTRL+SHIFT+K",command:"delete_current_line",commandId:"keycrop.growDeleteCurrentLine",description:"Delete current line",active:!1},{key:"ctrl+shift+\\",category:"Navigating Code",capital_key:"CTRL+SHIFT+\\",command:"jump_to_bracket",commandId:"keycrop.growJumpToBracket",description:"Jump to bracket",active:!1},{key:"ctrl+t",category:"Navigating Code",capital_key:"CTRL+T",command:"show_all_symbols",commandId:"keycrop.growShowAllSymbols",description:"Show all symbols",active:!1},{key:"ctrl+shift+o",category:"Navigating Code",capital_key:"CTRL+SHIFT+O",command:"go_to_symbol",commandId:"keycrop.growGoToSymbol",description:"Go to symbol",active:!1},{key:"ctrl+shift+m",category:"Debugging",capital_key:"CTRL+SHIFT+M",command:"view_problems",commandId:"keycrop.growViewProblems",description:"View problems",active:!1},{key:"ctrl+shift+l",category:"Multicursor",capital_key:"CTRL+SHIFT+L",command:"cursor_at_all_occurrences",commandId:"keycrop.growCursorAtAllOccurrences",description:"Add a cursor at all occurrences",active:!1},{key:"ctrl+shift+space",category:"IntelliSense",capital_key:"CTRL+SHIFT+SPACE",command:"trigger_parameter_hints",commandId:"keycrop.growTriggerParameterHints",description:"Trigger parameter hints",active:!0},{key:"ctrl+\\",category:"Using VSCode",capital_key:"CTRL+\\",command:"split_editor",commandId:"keycrop.growSplitEditor",description:"Split editor",active:!0},{key:"ctrl+shift+tab",category:"Using VSCode",capital_key:"CTRL+SHIFT+TAB",command:"open_last_used_editor_in_group",commandId:"keycrop.growOpenLastUsedEditorInGroup",description:"Open last used editor in group",active:!1},{key:"ctrl+`",category:"Terminal",capital_key:"CTRL+`",command:"toggle_terminal",commandId:"keycrop.growToggleTerminal",description:"Toggle terminal",active:!0},{key:"ctrl+shift+`",category:"Terminal",capital_key:"CTRL+SHIFT+`",command:"create_new_terminal",commandId:"keycrop.growCreateNewTerminal",description:"Create new terminal",active:!0},{key:"ctrl+g",category:"Navigating Code",capital_key:"CTRL+G",command:"go_to_line",commandId:"keycrop.growGoToLine",description:"Go to line",active:!0},{key:"ctrl+.",category:"Navigating Code",capital_key:"CTRL+.",command:"quick_fix",commandId:"keycrop.growQuickFix",description:"Quick Fix",active:!1},{key:"ctrl+shift+s",category:"Using VSCode",capital_key:"CTRL+SHIFT+S",command:"save_file_as",commandId:"keycrop.growSaveFileAs",description:"Save File As",active:!1},{key:"alt+up",category:"Editing",capital_key:"ALT+UP",command:"move_line_up",commandId:"keycrop.growMoveLineUp",description:"Move line up",active:!1},{key:"alt+down",category:"Editing",capital_key:"ALT+DOWN",command:"move_line_down",commandId:"keycrop.growMoveLineDown",description:"Move line down",active:!1},{key:"ctrl+l",category:"Editing",capital_key:"CTRL+L",command:"select_line",commandId:"keycrop.growSelectLine",description:"Select line",active:!1},{key:"shift+alt+i",category:"Multicursor",capital_key:"SHIFT+ALT+I",command:"insert_cursor_at_end_of_each_line_selected",commandId:"keycrop.growInsertCursorAtEndOfEachLineSelected",description:"Insert cursor at end of each line selected",active:!1},{key:"ctrl+shift+up",category:"Multicursor",capital_key:"CTRL+SHIFT+UP",command:"add_cursor_above",commandId:"keycrop.growInsertCursorAbove",description:"Add cursor above",active:!1},{key:"ctrl+shift+down",category:"Multicursor",capital_key:"CTRL+SHIFT+DOWN",command:"add_cursor_below",commandId:"keycrop.growInsertCursorBelow",description:"Add cursor below",active:!1},{key:"ctrl+space",category:"IntelliSense",capital_key:"CTRL+SPACE",command:"trigger_suggest",commandId:"keycrop.growTriggerSuggestions",description:"Trigger suggestions",active:!1},{key:"ctrl+k ctrl+i",category:"IntelliSense",capital_key:"CTRL+K CTRL+I",command:"show_hover",commandId:"keycrop.growShowHover",description:"Show hover with function details",active:!1},{key:"ctrl+k v",category:"Markdown",capital_key:"CTRL+K V",command:"open_markdown_side",commandId:"keycrop.growOpenMarkdownSide",description:"Open markdown to the side",active:!0},{key:"ctrl+shift+v",category:"Markdown",capital_key:"CTRL+SHIFT+V",command:"open_markdown_preview",commandId:"keycrop.growOpenMarkdownPreview",description:"Open markdown preview",active:!0},{key:"ctrl+h",category:"Search",capital_key:"CTRL+H",command:"replace",commandId:"keycrop.growReplace",description:"Replace",active:!0},{key:"shift+alt+down",category:"Editing",capital_key:"SHIFT+ALT+DOWN",command:"copy_line_below",commandId:"keycrop.growCopyLineBelow",description:"Copy line below",active:!1},{key:"shift+alt+up",category:"Editing",capital_key:"SHIFT+ALT+UP",command:"copy_line_above",commandId:"keycrop.growCopyLineAbove",description:"Copy line above",active:!1},{key:"ctrl+f",category:"Search",capital_key:"CTRL+F",command:"find",commandId:"keycrop.growFind",description:"Find",active:!0},{key:"shift+alt+right",category:"Editing",capital_key:"SHIFT+ALT+RIGHT",command:"expand_selection",commandId:"keycrop.growExpandSelection",description:"Expand selection",active:!1},{key:"shift+alt+left",category:"Editing",capital_key:"SHIFT+ALT+LEFT",command:"reduce_selection",commandId:"keycrop.growReduceSelection",description:"Reduce selection",active:!1},{key:"ctrl+shift+a",category:"Editing",capital_key:"CTRL+SHIFT+A",command:"toggle_block_comment",commandId:"keycrop.growToggleBlockComment",description:"Toggle block comment",active:!1},{key:"ctrl+c",category:"Editing",capital_key:"CTRL+C",command:"copy",commandId:"keycrop.growCopy",description:"Copy",active:!1},{key:"ctrl+v",category:"Editing",capital_key:"CTRL+V",command:"paste",commandId:"keycrop.growPaste",description:"Paste",active:!1},{key:"ctrl+]",category:"Editing",capital_key:"CTRL+]",command:"indent_line",commandId:"keycrop.growIndentLine",description:"Indent selection",active:!0},{key:"ctrl+[",category:"Editing",capital_key:"CTRL+[",command:"outdent_line",commandId:"keycrop.growOutdentLine",description:"Outdent selection",active:!0}],N=[{name:"Novice",minUses:1,className:"level-novice"},{name:"Apprentice",minUses:15,className:"level-apprentice"},{name:"Journeyman",minUses:30,className:"level-journeyman"},{name:"Expert",minUses:60,className:"level-expert"},{name:"Grandmaster",minUses:120,className:"level-grandmaster"}];var y=class{constructor(t,e){this.context=t;this.onViewEvent=e}view;postMessage(t){this.view?.webview.postMessage(t)}resolveWebviewView(t,e,o){this.view=t,this.onViewEvent?.("opened"),t.onDidChangeVisibility(()=>this.onViewEvent?.(t.visible?"opened":"closed")),t.onDidDispose(()=>this.onViewEvent?.("closed"));let s=t.webview;s.options={enableScripts:!0},s.html=this.getHtmlContent(s),s.onDidReceiveMessage(a=>this.onMessage(a))}};var _=class extends y{constructor(e,o,s){super(e,s);this.getHotkeyCounts=o}static viewType="instructions";onMessage(e){e.type==="init"&&this.postMessage({action:"update_counts",counts:this.getHotkeyCounts()})}getHtmlContent(e){let o=e.asWebviewUri(V.Uri.joinPath(this.context.extensionUri,"dist/media","style.css")),s=l.filter(c=>c.active),r=[...new Set(s.map(c=>c.category))].map(c=>`<button class="category-btn" data-category="${c}">${c}</button>`).join(`
        `),g=s.map(c=>`<tr data-category="${c.category}" data-command="${c.command}"><td>${c.capital_key}</td><td>${c.description}</td><td class="use-count">0</td><td class="level-cell"></td></tr>`).join(`
                `);return`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${o}" rel="stylesheet">
        <title>KeyCrop Instructions</title>
      </head>
      <body>
        <div id="generator-instructions">
          <div class="table-scroll">
            <table class="key-table">
              <thead>
                <tr>
                  <th>Hotkey</th>
                  <th>Description</th>
                  <th>Uses</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                ${g}
              </tbody>
            </table>
          </div>
          <div class="category-btn-row">
            ${r}
          </div>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          const LEVELS = ${JSON.stringify(N)};

          function levelFor(count) {
            let level = null;
            for (const l of LEVELS) {
              if (count >= l.minUses) { level = l; }
            }
            return level;
          }
          vscode.postMessage({ type: 'init' });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.action === 'update_counts') {
              Object.entries(message.counts).forEach(([cmd, count]) => {
                const row = document.querySelector('tr[data-command="' + cmd + '"]');
                if (!row) { return; }
                row.querySelector('.use-count').textContent = String(count);
                const level = levelFor(count);
                const cell = row.querySelector('.level-cell');
                cell.innerHTML = '';
                if (level) {
                  const badge = document.createElement('span');
                  badge.className = 'level-badge ' + level.className;
                  badge.textContent = level.name;
                  cell.appendChild(badge);
                }
              });
            }
          });

          const buttons = document.querySelectorAll('.category-btn');
          const rows = document.querySelectorAll('tbody tr');

          let activeCategory = null;

          buttons.forEach(btn => {
            btn.addEventListener('click', () => {
              const cat = btn.dataset.category;
              if (activeCategory === cat) {
                activeCategory = null;
                buttons.forEach(b => b.classList.remove('selected'));
                rows.forEach(r => r.style.display = '');
              } else {
                activeCategory = cat;
                buttons.forEach(b => b.classList.toggle('selected', b.dataset.category === cat));
                rows.forEach(r => {
                  r.style.display = r.dataset.category === cat ? '' : 'none';
                });
              }
            });
          });
        </script>
      </body>
      </html>
    `}};var v={bean:{price:2,category:"vegetable",description:"A humble unassuming legume."},tomato:{price:2,category:"vegetable",description:"This crop has a wide variety of culinary uses."},broccoli:{price:2,category:"vegetable",description:"Nutritious"},chili:{price:2,category:"vegetable",description:"Spicy and flavorful."},lettuce:{price:2,category:"vegetable",description:"Great in salads"},rhubarb:{price:2,category:"vegetable",description:"The stalks are edible."},ivy:{price:25,category:"decorative",description:"A decorative ground cover."},jacaranda_tree:{price:25,category:"decorative",description:"A tree with purple leaves."},raspberry:{price:4,category:"fruit",description:"A sweet and tart fruit."},strawberry:{price:4,category:"fruit",description:"A sweet and juicy fruit."},watermelon:{price:4,category:"fruit",description:"Great with hotkeys in the summer."},glowberry:{price:50,category:"exotic",description:"Glowberries emit a soft bioluminescent hue."},bulbino:{price:50,category:"exotic",description:"A mysterious plant."},poison_cabbage:{price:50,category:"exotic",description:"Closely related to regular cabbage."},neon_mould:{price:50,category:"exotic",description:"Radioactive mould."}},h=Object.keys(v);function H(i){return i.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}function L(i){let t=v[i];return!t||t.category==="vegetable"}function w(i){return L(i)?0:v[i].price}var p=d(require("fs")),j=d(require("path"));var x=class i{constructor(t){this.filePath=t}plants=[];harvestedCounts=new Map;cookedFoodCounts=new Map;discoveredRecipes=new Set;money=0;get playerMoney(){return this.money}get allPlants(){return this.plants}get harvested(){return this.harvestedCounts}get cooked(){return this.cookedFoodCounts}get discovered(){return this.discoveredRecipes}load(){if(this.plants=[],!!p.existsSync(this.filePath))try{let t=JSON.parse(p.readFileSync(this.filePath,"utf8")),e=t.plants??t;this.harvestedCounts=new Map(Object.entries(t.harvestedCounts??{})),this.cookedFoodCounts=new Map(Object.entries(t.cookedFoodCounts??{})),this.money=t.playerMoney??0,this.discoveredRecipes=new Set([...t.discoveredRecipes??[],...this.cookedFoodCounts.keys()]);let o=new Map;for(let s of e){let a=o.get(s.key);(!a||!s.harvested&&a.harvested)&&o.set(s.key,{key:s.key,species:s.species,size:s.size,harvested:s.harvested,hotkey_uses:s.hotkey_uses})}this.plants=Array.from(o.values())}catch(t){console.error("Saved plants could not be loaded"),console.error(t),this.plants=[]}}save(){p.mkdirSync(j.dirname(this.filePath),{recursive:!0}),p.writeFileSync(this.filePath,JSON.stringify({plants:this.plants,harvestedCounts:Object.fromEntries(this.harvestedCounts),cookedFoodCounts:Object.fromEntries(this.cookedFoodCounts),discoveredRecipes:[...this.discoveredRecipes],playerMoney:this.money}))}growingPlant(t){return this.plants.find(e=>e.key===t&&!e.harvested)}clearKey(t){this.plants=this.plants.filter(e=>e.key!==t)}plant(t,e){this.money-=w(e);let o={key:t,species:e,size:"start",harvested:!1,hotkey_uses:1};return this.plants.push(o),o}updateGrowth(t){for(let e of t){let o=this.plants.find(s=>s.key===e.key);o&&(o.size=e.size,o.hotkey_uses=e.hotkey_uses)}}harvest(t){let e=this.growingPlant(t);if(!e)return;let o=this.harvestedCounts.has(e.species),s=this.harvestedCounts.size;e.harvested=!0,this.harvestedCounts.set(e.species,(this.harvestedCounts.get(e.species)??0)+1);let a=s<h.length&&this.harvestedCounts.size===h.length;return{species:e.species,alreadyOwned:o,completedAllSpecies:a}}sell(t,e,o){this.money+=t,e?i.decrement(this.harvestedCounts,e):o&&i.decrement(this.cookedFoodCounts,o)}cook(t,e){this.cookedFoodCounts.set(t,(this.cookedFoodCounts.get(t)??0)+1);for(let s of e)i.decrement(this.harvestedCounts,s);let o=!this.discoveredRecipes.has(t);return this.discoveredRecipes.add(t),o}static decrement(t,e){let o=t.get(e)??0;o<=1?t.delete(e):t.set(e,o-1)}};var k=d(require("fs"));var P=class i{constructor(t){this.filePath=t;if(k.existsSync(t))try{this.log=JSON.parse(k.readFileSync(t,"utf8"))}catch{this.log=[]}this.useCounts=i.countUses(this.log)}log=[];useCounts={};get counts(){return this.useCounts}record(t,e,o){let s=l.find(a=>a.command===t);this.log.push({hotkey:s?.capital_key??t,species:e,timestamp:new Date().toISOString(),file:o}),k.writeFileSync(this.filePath,JSON.stringify(this.log,null,2)),this.useCounts[t]=(this.useCounts[t]??0)+1}static countUses(t){let e=new Map(l.map(s=>[s.capital_key,s.command])),o={};for(let s of t){let a=e.get(s.hotkey)??s.hotkey;o[a]=(o[a]??0)+1}return o}};var f=d(require("fs")),R=class{constructor(t){this.filePath=t;if(f.existsSync(t))try{this.entries=JSON.parse(f.readFileSync(t,"utf8"))}catch{this.entries=[]}}entries=[];record(t,e){this.entries.push({view:t,event:e,timestamp:new Date().toISOString()}),f.writeFileSync(this.filePath,JSON.stringify(this.entries,null,2))}};var b=0,m,U,C,T,O,S,$=n.workspace.getConfiguration("keycrop"),u=[];function K(){T.postMessage({action:"save_plants"})}function ee(i){if(b!==0){F(i,"None");return}let t=l.find(o=>o.command===i);if(t&&!t.active){F(i,"None");return}let e=m.growingPlant(i);e?(F(i,e.species),T.postMessage({action:"grow",key:e.key}),K()):(F(i,"None"),m.clearKey(i),D(i),u.push(i),Y(i))}function D(i){let t=u.indexOf(i);t!==-1&&u.splice(t,1)}function Y(i){T.postMessage({action:"choose_species",key:i,options:oe(m.playerMoney)})}function te(){for(;u.length>0;){let i=u[u.length-1];if(!m.growingPlant(i)){Y(i);return}u.pop()}}function oe(i){let t=(r,g)=>({species:r,label:H(r),description:v[r]?.description??"",price:v[r]?.price??0,isFree:L(r),locked:g}),e=r=>L(r)||i>=w(r),o=(r,g)=>w(r)-w(g),s=h.filter(e).sort(o),a=h.filter(r=>!e(r)).sort(o);return[...s.map(r=>t(r,!1)),...a.map(r=>t(r,!0))]}function F(i,t){U.record(i,t,n.window.activeTextEditor?.document.fileName??""),O.postMessage({action:"update_counts",counts:{...U.counts}})}function ie(i){let t=i.globalStorageUri.fsPath;G.mkdirSync(t,{recursive:!0}),U=new P(A.join(t,"hotkeys.json")),C=new R(A.join(t,"plugin_data.json")),C.record("vscode","opened"),m=new x(A.join(t,"plants.json")),m.load(),O=new _(i,()=>({...U.counts}),e=>C.record("instructions",e)),i.subscriptions.push(n.window.registerWebviewViewProvider(_.viewType,O)),b===0&&(T=new E(i,m),i.subscriptions.push(n.window.registerWebviewViewProvider(E.viewType,T,{webviewOptions:{retainContextWhenHidden:!0}})),S=new M(i,m),i.subscriptions.push(n.window.registerWebviewViewProvider(M.viewType,S,{webviewOptions:{retainContextWhenHidden:!0}}))),n.workspace.onDidChangeConfiguration(()=>{$=n.workspace.getConfiguration("keycrop")});for(let{command:e,commandId:o}of l)i.subscriptions.push(n.commands.registerCommand(o,()=>ee(e)))}function se(){}var E=class extends y{constructor(e,o){super(e,s=>C.record("greenhouse",s));this.game=o}static viewType="greenhouse";onMessage(e){switch(e.type){case"init":if(b===0){this.game.load(),this.postMessage({action:"background",value:"dirt"});for(let o of this.game.allPlants)this.postMessage({action:"load",key:o.key,species:o.species,size:o.size,harvested:o.harvested,hotkey_uses:o.hotkey_uses})}else this.postMessage({action:"key-tracking-mode"});break;case"save_plants":{this.game.updateGrowth(e.content),this.game.save();break}case"harvested":{let o=this.game.harvest(e.key);o&&(S.postMessage({action:"load_harvested",species:o.species,count:1}),o.alreadyOwned&&n.window.showInformationMessage("Your "+e.text.replace(/_/g," ")+" plant has been harvested!"),o.completedAllSpecies&&(n.window.showInformationMessage("Achievement unlocked: you've grown one of every plant!"),S.postMessage({action:"achievement"})));break}case"select_species":{let{key:o,species:s}=e,a=this.game.playerMoney;this.game.plant(o,s),this.game.playerMoney!==a&&S.postMessage({action:"load_money",amount:this.game.playerMoney}),n.window.showInformationMessage(`A new ${s.replace(/_/g," ")} plant has sprouted in the greenhouse!`),this.postMessage({action:"add",species:s,key:o}),this.game.save(),K(),D(o),te();break}case"locked_species_click":{let o=e.species,s=v[o];s&&n.window.showInformationMessage(`You need $${s.price} to unlock ${H(o)}.`);break}}}getHtmlContent(e){let o=e.asWebviewUri(n.Uri.joinPath(this.context.extensionUri,"dist/media","style.css")),s=e.asWebviewUri(n.Uri.joinPath(this.context.extensionUri,"dist/media","webview.js"));return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${o}" rel="stylesheet">
          <title>KeyCrop</title>
        </head>
        <body>
          <div id="keycrop" background="${b===0?$.get("background"):"blackout"}">
          </div>
          ${b===0?'<div id="fence-strip"></div><div id="decoration-strip"></div>':""}
          <script src="${s}"></script>
        </body>
        </html>
      `}},M=class extends y{constructor(e,o){super(e,s=>C.record("inventory",s));this.game=o}static viewType="inventory";onMessage(e){switch(e.type){case"init":b===0?(this.postMessage({action:"background",value:"inventory"}),this.game.harvested.forEach((o,s)=>{this.postMessage({action:"load_harvested",species:s,count:o})}),this.game.cooked.forEach((o,s)=>{this.postMessage({action:"load_cooked",recipeKey:s,count:o})}),this.postMessage({action:"load_collection",recipeKeys:[...this.game.discovered]}),this.postMessage({action:"load_money",amount:this.game.playerMoney})):this.postMessage({action:"key-tracking-mode"});break;case"sell":{this.game.sell(e.amount??0,e.species,e.recipeKey),this.game.save();break}case"cooked":{this.game.cook(e.recipeKey,e.species)&&this.postMessage({action:"load_collection",recipeKeys:[e.recipeKey]}),this.game.save();break}}}getHtmlContent(e){let o=e.asWebviewUri(n.Uri.joinPath(this.context.extensionUri,"dist/media","style.css")),s=e.asWebviewUri(n.Uri.joinPath(this.context.extensionUri,"dist/media","webview.js")),a=e.asWebviewUri(n.Uri.joinPath(this.context.extensionUri,"dist/media/pot","closed.png")),r=e.asWebviewUri(n.Uri.joinPath(this.context.extensionUri,"dist/media/pot","open.png")),g=e.asWebviewUri(n.Uri.joinPath(this.context.extensionUri,"dist/media/recipes/food"));return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${o}" rel="stylesheet">
          <title>KeyCrop Inventory</title>
        </head>
        <body>
          <div id="empty-inventory-message" class="instructions">You currently don't have anything in your inventory.</div>
          <div id="keycrop">
            <!-- Shelves hidden for now; uncomment to bring them back (renderShelfRow skips when this is missing) -->
            <!-- <div id="shelf-strip"></div> -->
          </div>
          <div id="collection-grid"></div>
          <div id="inventory-bottom-left">
            <div id="money-display">$0</div>
            <button id="collection-btn">Collection</button>
          </div>
          <div id="food-row" hidden></div>
          <div id="inventory-bottom-right" data-food-base="${g}">
            <div id="inventory-pot-wrapper" class="inventory-pot-wrapper">
              <img src="${a}" data-open-src="${a}" data-closed-src="${r}" class="inventory-pot" />
              <span class="inventory-pot-overlay" hidden></span>
            </div>
            <button id="cook-btn" hidden>Cook</button>
            <div id="cook-progress-wrapper" hidden>
              <div id="cook-progress-bar"></div>
            </div>
          </div>
          <script src="${s}"></script>
        </body>
        </html>
      `}};0&&(module.exports={GreenhouseWebViewProvider,InventoryWebViewProvider,activate,deactivate});
