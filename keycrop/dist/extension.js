"use strict";var ie=Object.create;var x=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var ne=Object.getOwnPropertyNames;var ce=Object.getPrototypeOf,ae=Object.prototype.hasOwnProperty;var de=(t,e)=>{for(var a in e)x(t,a,{get:e[a],enumerable:!0})},W=(t,e,a,p)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of ne(e))!ae.call(t,r)&&r!==a&&x(t,r,{get:()=>e[r],enumerable:!(p=re(e,r))||p.enumerable});return t};var M=(t,e,a)=>(a=t!=null?ie(ce(t)):{},W(e||!t||!t.__esModule?x(a,"default",{value:t,enumerable:!0}):a,t)),le=t=>W(x({},"__esModule",{value:!0}),t);var we={};de(we,{GreenhouseWebViewProvider:()=>T,InventoryWebViewProvider:()=>P,activate:()=>ye,deactivate:()=>ue});module.exports=le(we);var o=M(require("vscode")),y=M(require("fs")),A=M(require("path"));var F=M(require("vscode"));var E=[{key:"ctrl+shift+p",category:"Using VSCode",capital_key:"CTRL+SHIFT+P",command:"command_palette",description:"Show command palette"},{key:"ctrl+shift+k",category:"Editing",capital_key:"CTRL+SHIFT+K",command:"delete_current_line",description:"Delete current line"},{key:"ctrl+shift+\\",category:"Navigating Code",capital_key:"CTRL+SHIFT+\\",command:"jump_to_bracket",description:"Jump to bracket"},{key:"ctrl+t",category:"Navigating Code",capital_key:"CTRL+T",command:"show_all_symbols",description:"Show all symbols"},{key:"ctrl+shift+o",category:"Navigating Code",capital_key:"CTRL+SHIFT+O",command:"go_to_symbol",description:"Go to symbol"},{key:"ctrl+shift+m",category:"Debugging",capital_key:"CTRL+SHIFT+M",command:"view_problems",description:"View problems"},{key:"ctrl+shift+l",category:"Multicursor",capital_key:"CTRL+SHIFT+L",command:"cursor_at_all_occurrences",description:"Add a cursor at all occurrences"},{key:"ctrl+shift+space",category:"IntelliSense",capital_key:"CTRL+SHIFT+SPACE",command:"trigger_parameter_hints",description:"Trigger parameter hints"},{key:"ctrl+\\",category:"Using VSCode",capital_key:"CTRL+\\",command:"split_editor",description:"Split editor"},{key:"ctrl+shift+tab",category:"Using VSCode",capital_key:"CTRL+SHIFT+TAB",command:"open_last_used_editor_in_group",description:"Open last used editor in group"},{key:"ctrl+`",category:"Terminal",capital_key:"CTRL+`",command:"toggle_terminal",description:"Toggle terminal"},{key:"ctrl+shift+`",category:"Terminal",capital_key:"CTRL+SHIFT+`",command:"create_new_terminal",description:"Create new terminal"},{key:"ctrl+g",category:"Navigating Code",capital_key:"CTRL+G",command:"go_to_line",description:"Go to line"},{key:"ctrl+.",category:"Navigating Code",capital_key:"CTRL+.",command:"quick_fix",description:"Quick Fix"},{key:"ctrl+shift+s",category:"Using VSCode",capital_key:"CTRL+SHIFT+S",command:"save_file_as",description:"Save File As"},{key:"alt+up",category:"Editing",capital_key:"ALT+UP",command:"move_line_up",description:"Move line up"},{key:"alt+down",category:"Editing",capital_key:"ALT+DOWN",command:"move_line_down",description:"Move line down"},{key:"ctrl+l",category:"Editing",capital_key:"CTRL+L",command:"select_line",description:"Select line"},{key:"shift+alt+i",category:"Multicursor",capital_key:"SHIFT+ALT+I",command:"insert_cursor_at_end_of_each_line_selected",description:"Insert cursor at end of each line selected"},{key:"ctrl+shift+up",category:"Multicursor",capital_key:"CTRL+SHIFT+UP",command:"add_cursor_above",description:"Add cursor above"},{key:"ctrl+shift+down",category:"Multicursor",capital_key:"CTRL+SHIFT+DOWN",command:"add_cursor_below",description:"Add cursor below"},{key:"ctrl+space",category:"IntelliSense",capital_key:"CTRL+SPACE",command:"trigger_suggest",description:"Trigger suggestions"},{key:"ctrl+k ctrl+i",category:"IntelliSense",capital_key:"CTRL+K CTRL+I",command:"show_hover",description:"Show hover with function details"}];var f=class{constructor(e,a){this.context=e;this.getHotkeyCounts=a}static viewType="instructions";_view;postMessage(e){this._view?.webview.postMessage(e)}resolveWebviewView(e,a,p){this._view=e;let r=e.webview;r.options={enableScripts:!0},r.html=this.getHtmlContent(r),r.onDidReceiveMessage(s=>{s.type==="init"&&r.postMessage({action:"update_counts",counts:this.getHotkeyCounts()})})}getHtmlContent(e){let a=e.asWebviewUri(F.Uri.joinPath(this.context.extensionUri,"src/media","style.css")),r=[...new Set(E.map(i=>i.category))].map(i=>`<button class="category-btn" data-category="${i}">${i}</button>`).join(`
        `),s=E.map(i=>`<tr data-category="${i.category}" data-command="${i.command}"><td>${i.capital_key}</td><td>${i.description}</td><td class="use-count">0</td></tr>`).join(`
                `);return`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${a}" rel="stylesheet">
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
                </tr>
              </thead>
              <tbody>
                ${s}
              </tbody>
            </table>
          </div>
          <div class="category-btn-row">
            ${r}
          </div>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          vscode.postMessage({ type: 'init' });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.action === 'update_counts') {
              Object.entries(message.counts).forEach(([cmd, count]) => {
                const row = document.querySelector('tr[data-command="' + cmd + '"]');
                if (row) { row.querySelector('.use-count').textContent = String(count); }
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
    `}};var C={bean:{price:2,category:"vegetable"},tomato:{price:2,category:"vegetable"},broccoli:{price:2,category:"vegetable"},chili:{price:2,category:"vegetable"},lettuce:{price:2,category:"vegetable"},rhubarb:{price:2,category:"vegetable"},ivy:{price:50,category:"decorative"},jacaranda_tree:{price:50,category:"decorative"},raspberry:{price:4,category:"fruit"},strawberry:{price:4,category:"fruit"},watermelon:{price:4,category:"fruit"},glowberry:{price:100,category:"exotic"},bulbino:{price:100,category:"exotic"},poison_cabbage:{price:100,category:"exotic"},neon_mould:{price:100,category:"exotic"}};var c=0,h,L,k,I=o.workspace.getConfiguration("keycrop"),b="",S,$,H=[];function V(){if(y.existsSync(b)||y.mkdirSync(b,{recursive:!0}),y.existsSync(S))try{let t=JSON.parse(y.readFileSync(S,"utf8")),e=t.plants??t,a=t.harvestedCounts??{};m=new Map(Object.entries(a));let p=t.cookedFoodCounts??{};w=new Map(Object.entries(p)),_=t.playerMoney??0;let r=new Map;for(let s of e){let i=r.get(s.key);(!i||!s.harvested&&i.harvested)&&r.set(s.key,{key:s.key,species:s.species,size:s.size,harvested:s.harvested,hotkey_uses:s.hotkey_uses})}v=Array.from(r.values())}catch(t){console.error("Saved plants could not be loaded"),console.error(t),v=new Array}else v=new Array}function U(){y.existsSync(b)||y.mkdirSync(b,{recursive:!0}),y.writeFileSync(S,JSON.stringify({plants:v,harvestedCounts:Object.fromEntries(m),cookedFoodCounts:Object.fromEntries(w),playerMoney:_}))}function pe(){v.forEach(t=>{h.postMessage({action:"load",key:t.key,species:t.species,size:t.size,harvested:t.harvested,hotkey_uses:t.hotkey_uses})})}function ge(){m.forEach((t,e)=>{k.postMessage({action:"load_harvested",species:e,count:t})})}function me(){w.forEach((t,e)=>{k.postMessage({action:"load_cooked",recipeKey:e,count:t})})}function j(){h.postMessage({action:"save_plants"})}var v=new Array,m=new Map,w=new Map,_=0;function D(){let t={};for(let e of v)e.key&&(t[e.key]=(t[e.key]??0)+e.hotkey_uses);return t}var O={bean:"A humble unassuming legume.",tomato:"This crop has a wide variety of culinary uses.",broccoli:"Nutritious",chili:"Spicy and flavorful.",bulbino:"A mysterious plant.",glowberry:"Glowberries emit a soft bioluminescent hue.",ivy:"A decorative ground cover.",jacaranda_tree:"A tree with purple leaves.",lettuce:"Great in salads",neon_mould:"Radioactive mould.",poison_cabbage:"Closely related to regular cabbage.",raspberry:"A sweet and tart fruit.",rhubarb:"The stalks are edible.",strawberry:"A sweet and juicy fruit.",watermelon:"Great with hotkeys in the summer."},R=["bean","tomato","broccoli","chili","bulbino","glowberry","ivy","jacaranda_tree","lettuce","neon_mould","poison_cabbage","raspberry","rhubarb","strawberry","watermelon"];function ve(t){h.postMessage({action:"add",species:t.species,key:t.key})}function d(t){let e=v.find(a=>a.key===t);if(e&&!e.harvested)h.postMessage({action:"grow",species:e.species}),j();else{v=v.filter(n=>n.key!==t);let a=new Set(v.filter(n=>!n.harvested).map(n=>n.species)),p=R.filter(n=>!a.has(n)),r=n=>n.replace(/_/g," ").replace(/\b\w/g,g=>g.toUpperCase()),s=p.filter(n=>{let g=C[n];return!g||g.category==="vegetable"||_>=g.price}),i=p.filter(n=>{let g=C[n];return g&&g.category!=="vegetable"&&_<g.price}),u=[...s.map(n=>({label:r(n),description:O[n],species:n,locked:!1})),...i.length>0?[{label:"Locked",kind:o.QuickPickItemKind.Separator,species:"",locked:!1},...i.map(n=>({label:`$(lock) ${r(n)}`,description:`$${C[n].price} required \xB7 ${O[n]}`,species:n,locked:!0}))]:[]];o.window.showQuickPick(u,{placeHolder:"Choose a species for your new plant"}).then(n=>{if(!n)return;if(n.locked){o.window.showInformationMessage(`You need $${C[n.species].price} to unlock ${r(n.species)}.`);return}let{species:g}=n;o.window.showInformationMessage(`A new ${g.replace(/_/g," ")} plant has sprouted in the greenhouse!`),v.push({key:t,species:g,size:"start",harvested:!1,hotkey_uses:1}),ve({key:t,species:g,size:"start",harvested:!1,hotkey_uses:1}),U(),j()})}}function l(t){H.push({key:t,time:Date.now()}),y.writeFileSync($,JSON.stringify(H))}function ye(t){b=t.globalStorageUri.path.substring(1),S=A.join(b,"plants.json"),$=A.join(b,"keytracking.json"),V(),L=new f(t,D),t.subscriptions.push(o.window.registerWebviewViewProvider(f.viewType,L)),c===0&&(h=new T(t),t.subscriptions.push(o.window.registerWebviewViewProvider(T.viewType,h,{webviewOptions:{retainContextWhenHidden:!0}})),k=new P(t),t.subscriptions.push(o.window.registerWebviewViewProvider(P.viewType,k,{webviewOptions:{retainContextWhenHidden:!0}}))),o.workspace.onDidChangeConfiguration(se=>{I=o.workspace.getConfiguration("keycrop"),se.affectsConfiguration("keycrop-view.scale")&&h.postMessage({action:"scale",value:I.get("scale")})});let e=o.commands.registerCommand("keycrop.growCommandPalette",()=>{c===0?d("command_palette"):l("command_palette")}),a=o.commands.registerCommand("keycrop.growDeleteCurrentLine",()=>{c===0?d("delete_current_line"):l("delete_current_line")}),p=o.commands.registerCommand("keycrop.growJumpToBracket",()=>{c===0?d("jump_to_bracket"):l("jump_to_bracket")}),r=o.commands.registerCommand("keycrop.growShowAllSymbols",()=>{c===0?d("show_all_symbols"):l("show_all_symbols")}),s=o.commands.registerCommand("keycrop.growGoToSymbol",()=>{c===0?d("go_to_symbol"):l("go_to_symbol")}),i=o.commands.registerCommand("keycrop.growViewProblems",()=>{c===0?d("view_problems"):l("view_problems")}),u=o.commands.registerCommand("keycrop.growCursorAtAllOccurrences",()=>{c===0?d("cursor_at_all_occurrences"):l("cursor_at_all_occurrences")}),n=o.commands.registerCommand("keycrop.growTriggerParameterHints",()=>{c===0?d("trigger_parameter_hints"):l("trigger_parameter_hints")}),g=o.commands.registerCommand("keycrop.growSplitEditor",()=>{c===0?d("split_editor"):l("split_editor")}),G=o.commands.registerCommand("keycrop.growOpenLastUsedEditorInGroup",()=>{c===0?d("open_last_used_editor_in_group"):l("open_last_used_editor_in_group")}),N=o.commands.registerCommand("keycrop.growToggleTerminal",()=>{c===0?d("toggle_terminal"):l("toggle_terminal")}),K=o.commands.registerCommand("keycrop.growCreateNewTerminal",()=>{c===0?d("create_new_terminal"):l("create_new_terminal")}),z=o.commands.registerCommand("keycrop.growGoToLine",()=>{c===0?d("go_to_line"):l("go_to_line")}),q=o.commands.registerCommand("keycrop.growQuickFix",()=>{c===0?d("quick_fix"):l("quick_fix")}),J=o.commands.registerCommand("keycrop.growSaveFileAs",()=>{c===0?d("save_file_as"):l("save_file_as")}),Y=o.commands.registerCommand("keycrop.growMoveLineUp",()=>{c===0?d("move_line_up"):l("move_line_up")}),B=o.commands.registerCommand("keycrop.growMoveLineDown",()=>{c===0?d("move_line_down"):l("move_line_down")}),Q=o.commands.registerCommand("keycrop.growSelectLine",()=>{c===0?d("select_line"):l("select_line")}),X=o.commands.registerCommand("keycrop.growInsertCursorAtEndOfEachLineSelected",()=>{c===0?d("insert_cursor_at_end_of_each_line_selected"):l("insert_cursor_at_end_of_each_line_selected")}),Z=o.commands.registerCommand("keycrop.growInsertCursorAbove",()=>{c===0?d("add_cursor_above"):l("add_cursor_above")}),ee=o.commands.registerCommand("keycrop.growInsertCursorBelow",()=>{c===0?d("add_cursor_below"):l("add_cursor_below")}),te=o.commands.registerCommand("keycrop.growTriggerSuggest",()=>{c===0?d("trigger_suggest"):l("trigger_suggest")}),oe=o.commands.registerCommand("keycrop.growShowHover",()=>{c===0?d("show_hover"):l("show_hover")});t.subscriptions.push(e,p,r,s,i,u,n,g,G,N,K,a,z,q,J,Y,B,Q,X,Z,ee,te,oe)}function ue(){}var T=class{constructor(e){this.context=e}static viewType="greenhouse";view;postMessage(e){this.view?.webview.postMessage(e)}resolveWebviewView(e,a,p){this.view=e;let r=e.webview;r.options={enableScripts:!0},r.html=this.getHtmlContent(e.webview),r.onDidReceiveMessage(s=>{switch(s.type){case"error":o.window.showErrorMessage(s.text);break;case"info":o.window.showInformationMessage(s.text);break;case"init":c===0?(V(),r.postMessage({action:"background",value:"dirt"}),pe()):r.postMessage({action:"key-tracking-mode"});break;case"save_plants":{v=s.content.map(i=>({key:i.key,species:i.species,size:i.size,harvested:i.harvested,hotkey_uses:i.hotkey_uses})),y.writeFileSync(S,JSON.stringify({plants:s.content,harvestedCounts:Object.fromEntries(m),cookedFoodCounts:Object.fromEntries(w),playerMoney:_})),L.postMessage({action:"update_counts",counts:D()});break}case"harvested":{let i=v.find(u=>u.species===s.text&&!u.harvested);if(i){let u=m.has(i.species);i.harvested=!0;let n=m.size,g=(m.get(i.species)??0)+1;m.set(i.species,g),k.postMessage({action:"load_harvested",species:i.species,count:1}),u&&o.window.showInformationMessage("Your "+s.text.replace(/_/g," ")+" plant has been harvested!"),n<R.length&&m.size===R.length&&(o.window.showInformationMessage("Achievement unlocked: you've grown one of every plant!"),k.postMessage({action:"achievement"}))}break}}})}getHtmlContent(e){let a=e.asWebviewUri(o.Uri.joinPath(this.context.extensionUri,"src/media","style.css")),p=e.asWebviewUri(o.Uri.joinPath(this.context.extensionUri,"dist/media","webview.js"));return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${a}" rel="stylesheet">
          <title>KeyCrop</title>
        </head>
        <body>
          <div id="keycrop" background="${c===0?I.get("background"):"blackout"}">
          </div>
          <script src="${p}"></script>
        </body>
        </html>
      `}},P=class{constructor(e){this.context=e}static viewType="inventory";view;postMessage(e){this.view?.webview.postMessage(e)}resolveWebviewView(e,a,p){this.view=e;let r=e.webview;r.options={enableScripts:!0},r.html=this.getHtmlContent(e.webview),r.onDidReceiveMessage(s=>{switch(s.type){case"init":c===0?(r.postMessage({action:"background",value:"inventory"}),ge(),me(),r.postMessage({action:"load_money",amount:_})):r.postMessage({action:"key-tracking-mode"});break;case"sell":{if(_+=s.amount??0,s.species){let i=m.get(s.species)??0;i<=1?m.delete(s.species):m.set(s.species,i-1)}else if(s.recipeKey){let i=w.get(s.recipeKey)??0;i<=1?w.delete(s.recipeKey):w.set(s.recipeKey,i-1)}U();break}case"cooked":{let i=w.get(s.recipeKey)??0;w.set(s.recipeKey,i+1);for(let u of s.species){let n=m.get(u)??0;n<=1?m.delete(u):m.set(u,n-1)}U();break}}})}getHtmlContent(e){let a=e.asWebviewUri(o.Uri.joinPath(this.context.extensionUri,"src/media","style.css")),p=e.asWebviewUri(o.Uri.joinPath(this.context.extensionUri,"dist/media","webview.js")),r=e.asWebviewUri(o.Uri.joinPath(this.context.extensionUri,"src/media/recipes","open_pot.png")),s=e.asWebviewUri(o.Uri.joinPath(this.context.extensionUri,"src/media/recipes","closed_pot.png")),i=e.asWebviewUri(o.Uri.joinPath(this.context.extensionUri,"src/media/recipes/food"));return`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${a}" rel="stylesheet">
          <title>KeyCrop Inventory</title>
        </head>
        <body>
          <div id="keycrop">
          </div>
          <div id="money-display">$0</div>
          <div id="empty-inventory-message" class="instructions">You currently don't have anything in your inventory.</div>
          <div id="food-row" hidden></div>
          <div id="inventory-bottom-right" data-food-base="${i}">
            <div id="inventory-pot-wrapper" class="inventory-pot-wrapper">
              <img src="${r}" data-open-src="${r}" data-closed-src="${s}" class="inventory-pot" />
              <span class="inventory-pot-overlay" hidden></span>
            </div>
            <button id="cook-btn" hidden>Cook</button>
            <div id="cook-progress-wrapper" hidden>
              <div id="cook-progress-bar"></div>
            </div>
          </div>
          <script src="${p}"></script>
        </body>
        </html>
      `}};0&&(module.exports={GreenhouseWebViewProvider,InventoryWebViewProvider,activate,deactivate});
