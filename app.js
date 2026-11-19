/* ---------- app ---------- */
let S={b:STD.slice(),t:'w',c:cr(STD),ep:-1},H=[],lm=null,sel=-1,tg=[],flip=0,bots={w:0,b:0},clk=null,last=0,flag=0,scr='menu',opt={delay:1,hints:1,snd:1},mode='game',cfg=null,EB,ET='w',pal='P',gid=0,over=0,pend=0,promoMs,cand;
function newGame(c){cfg=c;S={b:c.b.slice(),t:c.t,c:cr(c.b),ep:-1};H=[];lm=null;sel=-1;tg=[];gid++;pend=0;mode='game';flag=0;clk=c.tm?{w:c.tm*60,b:c.tm*60,inc:c.inc}:null;last=Date.now();
const hc=c.col==='r'?'wb'[Math.random()*2|0]:c.col;bots=c.opp==='bot'?{w:hc==='w'?0:c.L,b:hc==='w'?c.L:0}:c.opp==='bb'?{w:c.L,b:c.L2}:{w:0,b:0};flip=bots.w&&!bots.b?1:0;render();maybeBot()}
function editor(){mode='edit';gid++;EB=S.b.slice();ET=S.t;flip=0;render()}
function doMove(m){const cap=S.b[m.t]||m.ep||m.x!=null;if(clk)clk[S.t]+=clk.inc;H.push({s:S,l:lm});S=mk(S,m);lm=[m.f,m.t];sel=-1;tg=[];render();snd(chk(S.b,S.t==='w')?'check':m.pr?'promote':cap?'capture':'move');maybeBot()}
function maybeBot(){if(!bot||over||S.t!==bot)return;const g=gid;$('st').textContent='Bot is thinking…';setTimeout(()=>{if(g!==gid)return;const m=think(S,lvl);if(m)doMove(m)},60)}
function undo(){if(!H.length||pend)return;gid++;let x=H.pop();S=x.s;lm=x.l;if(bot&&S.t===bot&&H.length){x=H.pop();S=x.s;lm=x.l}sel=-1;tg=[];render();maybeBot()}
function tap(i){
if(mode==='edit'){EB[i]=(pal==='x'||EB[i]===pal)?0:pal;render();return}
if(over||pend||bots[S.t])return;const p=S.b[i];
if(sel>=0){const ms=tg.filter(m=>m.t===i);if(ms.length){ms[0].pr?askPromo(ms):doMove(ms[0]);return}}
if(p&&isW(p)===(S.t==='w')){sel=i;tg=legal(S).filter(m=>m.f===i)}else{sel=-1;tg=[]}render()}
function askPromo(ms){pend=1;promoMs=ms;const w=S.t==='w';
$('mb').innerHTML='<b>Promote pawn to</b><div style="display:flex;gap:8px;justify-content:center">'+[...'qrbn'].map(q=>`<button style="font-size:34px" onclick="pick('${q}')"><span class="${w?'pw':'pb'}">${G[q.toUpperCase()]}\uFE0E</span></button>`).join('')+'</div>';$('md').className='on'}
function pick(q){$('md').className='';pend=0;doMove(promoMs.find(m=>m.pr===q))}
function openSetup(b,t){const L=[1,300,600,900,1200,1500,1700,2200,2800,'3000+'];cand={b:b.slice(),t};
$('mb').innerHTML=`<b>Start game${b===STD?'':' – custom board'}</b>
<label>Opponent <select id="o" onchange="$('bo').style.display=this.value=='bot'?'flex':'none'"><option value="bot">Bot</option><option value="p2">Local player</option></select></label>
<div id="bo" style="display:flex;flex-direction:column;gap:10px"><label>Level <select id="lv">${L.map((e,i)=>`<option value="${i+1}"${i==4?' selected':''}>${i+1} (~${e} Elo${i==9?', max':''})${i>6?' · Stockfish':''}</option>`).join('')}</select></label>
<label>You play <select id="cl"><option value="w">White</option><option value="b">Black</option><option value="r">Random</option></select></label></div>
<button class="pri" onclick="go()">Play ▶</button><button onclick="$('md').className=''">Cancel</button>`;$('md').className='on'}
function go(){$('md').className='';newGame({b:cand.b,t:cand.t,opp:$('o').value,L:+$('lv').value,col:$('cl').value})}
function render(){const E=mode==='edit',b=E?EB:S.b;let res={o:0},ckS=[];
if(!E){res=status(S,H);if(flag)res={o:1,t:(flag==='w'?'Black':'White')+' wins on time'};over=res.o;if(res.ck)b.forEach((p,i)=>{if(p===(S.t==='w'?'K':'k'))ckS.push(i)})}
$('st').textContent=E?'Editor: tap a square to place the selected piece':res.o?res.t:(S.t==='w'?'White':'Black')+' to move'+(res.ck?' – check!':'');
let h='';for(let k=0;k<64;k++){const i=flip?63-k:k,p=b[i],r=i>>3,f=i&7;let c='sq '+((r+f)%2?'d':'l');
if(!E){if(i===sel)c+=' sel';if(lm&&(i===lm[0]||i===lm[1]))c+=' lm';if(ckS.includes(i))c+=' ck';const t=tg.find(m=>m.t===i);if(t&&opt.hints)c+=' tg'+(p||t.ep||t.x!=null?' cp':'')}
h+=`<div class="${c}" onclick="tap(${i})">${p?`<span class="${isW(p)?'pw':'pb'}">${G[p.toUpperCase()]}\uFE0E</span>`:''}</div>`}
$('bd').innerHTML=h;showClk();$('ph').innerHTML=`<button onclick="go2('menu')">← Menu</button><b>${E?'Board editor':'Game'}</b>`;
$('pal').innerHTML=E?[...'KQRBNPkqrbnpmg'].map(p=>`<button class="${p===pal?'pri':''}" onclick="pal='${p}';render()"><span class="${isW(p)?'pw':'pb'}">${G[p.toUpperCase()]}\uFE0E</span></button>`).join('')+`<button class="${pal==='x'?'pri':''}" onclick="pal='x';render()">Erase</button>`:'';
$('ctl').innerHTML=E?`<button onclick="ET=ET=='w'?'b':'w';render()">${ET=='w'?'White':'Black'} moves first</button><button onclick="EB.fill(0);render()">Clear</button><button onclick="EB=STD.slice();render()">Standard</button><button onclick="flip^=1;render()">Flip</button><button class="pri" onclick="openSetup(EB,ET)">Play ▶</button>`
:`<button onclick="newGame(cfg)">Restart</button><button onclick="undo()">Undo</button><button onclick="flip^=1;render()">Flip</button>`}
const fmt=x=>{x=Math.max(0,Math.ceil(x));return(x/60|0)+':'+String(x%60).padStart(2,'0')};
function showClk(){$('ck').textContent=clk&&mode==='game'?`White ${fmt(clk.w)}  |  Black ${fmt(clk.b)}`:''}
setInterval(()=>{const n=Date.now();if(clk&&mode==='game'&&(scr==='play'||(cfg&&cfg.online))&&!over){clk[S.t]-=(n-last)/1000;if(clk[S.t]<=0){clk[S.t]=0;flag=S.t;render()}else showClk()}last=n},250);
function maybeBot(){const lv=bots[S.t];if(!lv||over)return;const g=gid,t0=Date.now(),wait=opt.delay?Math.max(lv<=5?1000+Math.random()*1000:lv<=7?600:0,bots.w&&bots.b?500:0):0;$('st').textContent='Bot is thinking…';
setTimeout(()=>{if(g!==gid||over)return;const m=think(S,lv);setTimeout(()=>{if(g!==gid||over)return;m&&doMove(m)},Math.max(0,t0+wait-Date.now()))},60)}
function undo(){if(!H.length||pend||(bots.w&&bots.b))return;gid++;flag=0;let x=H.pop();S=x.s;lm=x.l;if(bots[S.t]&&H.length){x=H.pop();S=x.s;lm=x.l}sel=-1;tg=[];render();maybeBot()}
function opc(){const v=$('o').value;$('r1').style.display=v=='p2'?'none':'';$('r2').style.display=v=='bb'?'':'none';$('r3').style.display=v=='bot'?'':'none';$('r1').firstChild.textContent=v=='bb'?'White bot ':'Bot level '}
function openSetup(b,t){const L=[1,300,600,900,1200,1500,1700,2200,2800,'3000+'],o=L.map((e,i)=>`<option value="${i+1}"${i==4?' selected':''}>${i+1} (~${e} Elo${i==9?', max':''})${i>6?' · Stockfish':''}</option>`).join('');cand={b:b.slice(),t,v:b===STD||b===CVC};
$('mb').innerHTML=`<b>Start game${cand.v?'':' – custom board'}</b>${cand.v?'<label>Mode <select id="vr"><option value="std">Standard chess</option><option value="cvc">Chess vs Checkers</option></select></label>':''}
<label>Opponent <select id="o" onchange="opc()"><option value="bot">Bot</option><option value="p2">Local player</option><option value="bb">Bot vs Bot</option></select></label>
<label id="r1">Bot level <select id="lv">${o}</select></label><label id="r2" style="display:none">Black bot <select id="lv2">${o}</select></label>
<label id="r3">You play <select id="cl"><option value="w">White</option><option value="b">Black</option><option value="r">Random</option></select></label>
<label>Clock <select id="tm"><option value="0,0">Off</option><option value="1,0">1 min</option><option value="3,2">3 min + 2s</option><option value="5,0">5 min</option><option value="10,0">10 min</option></select></label>
<button class="pri" onclick="go()">Play ▶</button><button onclick="$('md').className=''">Cancel</button>`;$('md').className='on'}
function go(){$('md').className='';const[tm,inc]=$('tm').value.split(',').map(Number),v=$('vr');if(v)cand.b=(v.value=='cvc'?CVC:STD).slice();newGame({b:cand.b,t:cand.t,opp:$('o').value,L:+$('lv').value,L2:+$('lv2').value,col:$('cl').value,tm,inc})}
const _n=newGame,_e=editor;newGame=c=>{go2('play');_n(c)};editor=()=>{go2('play');_e()};
function go2(n){scr=n;for(const s of['menu','settings','play'])$(s).style.display=s===n?'':'none';if(n==='menu')$('rs').style.display=cfg?'':'none';if(n==='play')render()}
go2('menu');

const SN={move:.6,capture:.7,check:.8,promote:.7},AU={};
for(const k in SN){AU[k]=new Audio(k+'.mp3');AU[k].preload='auto'}
function snd(k){if(!opt.snd)return;const a=AU[k].cloneNode();a.volume=SN[k];a.play().catch(()=>{})}

/* Pause rule: offline games (vs bot, local, bot vs bot) freeze while you are off the game screen.
   A game whose cfg has online:true (future online mode) keeps running in the background, like chess.com. */
function resume(){go2('play');maybeBot()}
const _g=go2;go2=n=>{if(scr==='play'&&n!=='play'&&mode==='game'&&!(cfg&&cfg.online))gid++;_g(n)};
