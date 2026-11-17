const $=id=>document.getElementById(id),G={K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞',P:'♟',M:'●',G:'◉'},VAL={p:100,n:320,b:330,r:500,q:900,k:0,m:90,g:260},isW=p=>p===p.toUpperCase();
const D=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],N=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
const parse=f=>{const b=[];for(const c of f)if(c>='1'&&c<='8')for(let i=0;i<+c;i++)b.push(0);else if(c!='/')b.push(c);return b};
const STD=parse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'),CVC=parse('1m1m1m1m/m1m1m1m1/1m1m1m1m/8/8/8/PPPPPPPP/RNBQKBNR');
const TH={'Orange & Blue':['#f6c177','#2f6db5'],Slate:['#e3e9ee','#5d7a93'],Classic:['#f0d9b5','#b58863'],Forest:['#eeeed2','#769656'],Rose:['#f6dfe3','#b5667a'],Midnight:['#8a96ab','#2c3550']};
function setC(a,b){const s=document.documentElement.style;s.setProperty('--lt',a);s.setProperty('--dk',b);$('c1').value=a;$('c2').value=b}
const cr=b=>({K:+(b[60]==='K'&&b[63]==='R'),Q:+(b[60]==='K'&&b[56]==='R'),k:+(b[4]==='k'&&b[7]==='r'),q:+(b[4]==='k'&&b[0]==='r')});
function att(b,sq,w){const r=sq>>3,f=sq&7,g=(a,c)=>a<0||a>7||c<0||c>7?0:b[a*8+c],o=(p,k)=>p&&isW(p)===w&&p.toLowerCase()===k,pd=w?1:-1;
if(o(g(r+pd,f-1),'p')||o(g(r+pd,f+1),'p'))return 1;
if(!w)for(const[a,c]of[[-1,-1],[-1,1],[1,-1],[1,1]]){const p=g(r+a,f+c),x=r-a,y=f-c;if((p==='g'||p==='m')&&x>=0&&x<8&&y>=0&&y<8&&!b[x*8+y])return 1}
for(const[a,c]of N)if(o(g(r+a,f+c),'n'))return 1;
for(const[a,c]of D){if(o(g(r+a,f+c),'k'))return 1;let x=r+a,y=f+c,p;while(!(p=g(x,y))&&x>=0&&x<8&&y>=0&&y<8){x+=a;y+=c}if(p&&(o(p,'q')||o(p,a&&c?'b':'r')))return 1}return 0}
function gen(s){const m=[],b=s.b,w=s.t==='w';
for(let i=0;i<64;i++){const p=b[i];if(!p||isW(p)!==w)continue;const r=i>>3,f=i&7,k=p.toLowerCase(),add=(t,x)=>m.push({f:i,t,...x}),en=t=>b[t]&&isW(b[t])!==w;
if(k==='p'){const d=w?-1:1,n=r+d;if(n<0||n>7)continue;const pu=(t,x)=>{if(n===(w?0:7))for(const q of'qrbn')add(t,{pr:q});else add(t,x)};
if(!b[n*8+f]){pu(n*8+f);if(r===(w?6:1)&&!b[(n+d)*8+f])add((n+d)*8+f,{dp:1})}
for(const x of[-1,1]){const c=f+x,t=n*8+c;if(c<0||c>7)continue;if(en(t))pu(t);else if(t===s.ep)add(t,{ep:1})}}
else if(k==='m'||k==='g'){for(const[a,c]of[[1,-1],[1,1],[-1,-1],[-1,1]]){const x=r+a,y=f+c;if(x<0||x>7||y<0||y>7)continue;const t=x*8+y;if(!b[t]){if(k==='g'||a>0)add(t)}else if(isW(b[t])){const x2=x+a,y2=y+c;if(x2>=0&&x2<8&&y2>=0&&y2<8&&!b[x2*8+y2])add(x2*8+y2,{x:t})}}}
else if(k==='n'||k==='k'){for(const[a,c]of k==='n'?N:D){const x=r+a,y=f+c;if(x<0||x>7||y<0||y>7)continue;const t=x*8+y;if(!b[t]||en(t))add(t)}
if(k==='k'){const h=w?60:4,o=!w;if(i===h&&!att(b,h,o)){
if(s.c[w?'K':'k']&&!b[h+1]&&!b[h+2]&&b[h+3]===(w?'R':'r')&&!att(b,h+1,o)&&!att(b,h+2,o))add(h+2,{cs:'K'});
if(s.c[w?'Q':'q']&&!b[h-1]&&!b[h-2]&&!b[h-3]&&b[h-4]===(w?'R':'r')&&!att(b,h-1,o)&&!att(b,h-2,o))add(h-2,{cs:'Q'})}}}
else for(const[a,c]of D){if(k==='b'&&!(a&&c)||k==='r'&&a&&c)continue;let x=r+a,y=f+c;while(x>=0&&x<8&&y>=0&&y<8){const t=x*8+y;if(!b[t])add(t);else{if(en(t))add(t);break}x+=a;y+=c}}}
return m}
function mk(s,m){const b=s.b.slice(),p=b[m.f],w=s.t==='w';b[m.t]=m.pr?(w?m.pr.toUpperCase():m.pr):p==='m'&&m.t>55?'g':p;b[m.f]=0;if(m.x!=null)b[m.x]=0;
if(m.ep)b[m.t+(w?8:-8)]=0;
if(m.cs==='K'){b[w?61:5]=b[w?63:7];b[w?63:7]=0}else if(m.cs==='Q'){b[w?59:3]=b[w?56:0];b[w?56:0]=0}
const c={...s.c};for(const q of[m.f,m.t]){if(q===60)c.K=c.Q=0;if(q===4)c.k=c.q=0;if(q===63)c.K=0;if(q===56)c.Q=0;if(q===7)c.k=0;if(q===0)c.q=0}
return{b,t:w?'b':'w',c,ep:m.dp?(m.f+m.t)/2:-1}}
const chk=(b,w)=>{for(let i=0;i<64;i++)if(b[i]===(w?'K':'k')&&att(b,i,!w))return 1;return 0};
const legal=s=>gen(s).filter(m=>!chk(mk(s,m).b,s.t==='w'));
const has=(s,w)=>s.b.some(p=>p&&isW(p)===w),key=x=>x.b.join(',')+x.t;
function status(s,h){const w=s.t==='w';
if(!has(s,w))return{o:1,t:(w?'Black':'White')+' wins – no pieces left'};
if(!has(s,!w))return{o:1,t:(w?'White':'Black')+' wins – no pieces left'};
if(!legal(s).length)return chk(s.b,w)?{o:1,t:(w?'Black':'White')+' wins by checkmate'}:{o:1,t:'Draw by stalemate'};
const ps=s.b.filter(Boolean).map(p=>p.toLowerCase()),oth=ps.filter(p=>p!=='k');
if(ps.length-oth.length===2&&oth.length<=1&&oth.every(p=>p==='n'||p==='b'))return{o:1,t:'Draw – not enough material'};
if(h.filter(x=>key(x.s)===key(s)).length>=2)return{o:1,t:'Draw by repetition'};
return{o:0,ck:chk(s.b,w)}}
