/* Stockfish.js 19 (GPLv3) powers bot levels 8-10 in standard chess. Other cases use bot.js. */
let sfP=null,sfQ=Promise.resolve();
function sfInit(){return sfP||(sfP=new Promise((res,rej)=>{let w;try{w=new Worker('stockfish-19-lite-single.js')}catch(e){return rej(e)}
const to=setTimeout(()=>rej('timeout'),20000);w.onerror=e=>rej(e);
w.onmessage=e=>{const l=String(e.data);if(l==='uciok')w.postMessage('isready');else if(l==='readyok'){clearTimeout(to);res(w)}};w.postMessage('uci')}).catch(e=>{sfP=null;throw e}))}
function toFen(s){let r='';for(let y=0;y<8;y++){let e=0;for(let x=0;x<8;x++){const p=s.b[y*8+x];if(p){if(e){r+=e;e=0}r+=p}else e++}if(e)r+=e;if(y<7)r+='/'}
const c=(s.c.K?'K':'')+(s.c.Q?'Q':'')+(s.c.k?'k':'')+(s.c.q?'q':''),ep=s.ep>=0?'abcdefgh'[s.ep&7]+(8-(s.ep>>3)):'-';return`${r} ${s.t} ${c||'-'} ${ep} 0 1`}
const sfOK=s=>s.b.filter(p=>p==='K').length===1&&s.b.filter(p=>p==='k').length===1&&!s.b.some(p=>p==='m'||p==='g');
function sfRun(s,lv){return sfInit().then(w=>new Promise((res,rej)=>{const to=setTimeout(()=>rej('timeout'),15000);
w.onmessage=e=>{const l=String(e.data);if(!l.startsWith('bestmove'))return;clearTimeout(to);const u=l.split(' ')[1]||'',f=(8-u[1])*8+u.charCodeAt(0)-97,t=(8-u[3])*8+u.charCodeAt(2)-97,
m=legal(s).find(x=>x.f===f&&x.t===t&&(x.pr||undefined)===u[4]);m?res(m):rej('no match')};
w.postMessage('setoption name UCI_LimitStrength value '+(lv<10));w.postMessage('setoption name UCI_Elo value '+(lv===8?2200:2800));
w.postMessage('position fen '+toFen(s));w.postMessage('go movetime '+({8:600,9:1000,10:2500}[lv]))}))}
function sfThink(s,lv){const p=sfQ.catch(()=>0).then(()=>sfRun(s,lv));sfQ=p.catch(()=>0);return p}
function maybeBot(){const lv=bots[S.t];if(!lv||over)return;const g=gid,s=S,t0=Date.now(),wait=opt.delay?Math.max(lv<=5?1000+Math.random()*1000:lv<=7?600:0,bots.w&&bots.b?500:0):0;
$('st').textContent='Bot is thinking…';
const fin=m=>setTimeout(()=>{if(g!==gid||over)return;m&&doMove(m)},Math.max(0,t0+wait-Date.now()));
if(lv>=8&&sfOK(s))sfThink(s,lv).then(fin).catch(()=>fin(think(s,7)));
else setTimeout(()=>{if(g!==gid||over)return;fin(think(s,Math.min(lv,7)))},60)}
