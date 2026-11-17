/* ---------- bot ---------- */
function ev(s){let v=0;const b=s.b;for(let i=0;i<64;i++){const p=b[i];if(!p)continue;const w=isW(p),k=p.toLowerCase(),r=i>>3,f=i&7,c=Math.abs(r-3.5)+Math.abs(f-3.5);let x=VAL[k];
x+=k==='m'?r*12:k==='p'?(w?6-r:r-1)*7+(3.5-Math.abs(f-3.5))*4:k==='k'?(w?r:7-r)*6:(7-c)*(k==='n'?5:k==='q'?1:3);v+=w?x:-x}return s.t==='w'?v:-v}
const osc=(s,m)=>(s.b[m.t]?10*VAL[s.b[m.t].toLowerCase()]-VAL[s.b[m.f].toLowerCase()]/10:m.ep?1000:0)+(m.pr==='q'?800:0),ord=(s,ms)=>ms.sort((a,c)=>osc(s,c)-osc(s,a));
let nodes,endT,stop;
function qs(s,a,bt){if((++nodes&1023)===0&&Date.now()>endT)stop=1;if(stop)return 0;let v=ev(s);if(v>=bt)return bt;if(v>a)a=v;
for(const m of ord(s,legal(s).filter(m=>s.b[m.t]||m.ep||m.x!=null||m.pr==='q'))){v=-qs(mk(s,m),-bt,-a);if(v>=bt)return bt;if(v>a)a=v}return a}
function ng(s,d,a,bt,pl){if(stop)return 0;if(d<=0)return qs(s,a,bt);const ms=legal(s);
if(!ms.length)return(!has(s,s.t==='w')||chk(s.b,s.t==='w'))?-3e4+pl:0;
let best=-1e9;for(const m of ord(s,ms)){const v=-ng(mk(s,m),d-1,-bt,-a,pl+1);if(stop)return 0;if(v>best)best=v;if(v>a)a=v;if(a>=bt)break}return best}
const LV=[0,{d:1,n:400,t:500},{d:1,n:250,t:500},{d:2,n:150,t:800},{d:2,n:70,t:800},{d:3,n:35,t:1000},{d:4,n:12,t:1200},{d:6,n:0,t:1800},{d:8,n:0,t:3000},{d:14,n:0,t:5000}];
function think(s,lv){let ms=legal(s);if(!ms.length)return null;if(lv<2)return ms[Math.random()*ms.length|0];
const C=LV[lv-1];stop=0;nodes=0;endT=Date.now()+C.t;ord(s,ms);let best=ms[0];
for(let d=1;d<=C.d;d++){let bs=-1e9,bm=null;const sc=[];
for(const m of ms){const v=-ng(mk(s,m),d-1,-1e9,C.n?1e9:-bs,1)+(Math.random()-.5)*C.n*2;if(stop)break;sc.push([v,m]);if(v>bs){bs=v;bm=m}}
if(stop)break;best=bm;ms=sc.sort((a,c)=>c[0]-a[0]).map(x=>x[1])}
return best}
