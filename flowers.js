const Q = new URLSearchParams(location.search);
const MESSAGE = Q.get("msg") || "for you ♥";
const CREDIT = Q.get("credit") ?? "@_noobachu on tiktok!";
const SPIN_SPEED = 0.6, TILT = 0.30, CAM_DIST = 4.0, NUM_HEARTS = 18, PIVOT_Y = 0.2;
const WHITE=[244,248,251,254,255,231], PINK=[125,162,168,205,211,218,225], RED=[52,88,124,160,196,203],
PURPLE=[54,91,97,134,140,183], YELLOW=[136,178,214,220,226,229], ORANGE=[130,166,202,208,214,216],
GOLD=[94,136,178,214,220], DARK=[52,58,94,130,136], GREENS=[22,28,28,34,35,71,77,114],
PAPER=[101,144,187,223,230,231], RIBBON=[88,125,161,197,204,211], HEART_COLORS=[161,197,204,205,211,218],
MSG_COLORS=[161,168,205,211,218,225,218,211,205,168];
const SHADE=".:-=+*%@", PETAL="+*#%";
const L0=[-0.45,0.6,0.66], Ln=Math.hypot(...L0), [LX,LY,LZ]=L0.map(v=>v/Ln);
const DISC=[[WHITE,GOLD,13],[PINK,GOLD,8],[RED,DARK,6],[PURPLE,GOLD,7],[YELLOW,DARK,12],[ORANGE,DARK,9]];
const TULIP=[RED,PINK,YELLOW];

function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd=mulberry32(21), U=(a,b)=>a+(b-a)*rnd();
const norm=v=>{const m=Math.hypot(...v)||1;return[v[0]/m,v[1]/m,v[2]/m]};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const add=(p,d,k)=>[p[0]+d[0]*k,p[1]+d[1]*k,p[2]+d[2]*k];

function xterm(n){
  if(n>=232){const g=8+10*(n-232);return`rgb(${g},${g},${g})`}
  if(n>=16){n-=16;const l=[0,95,135,175,215,255];return`rgb(${l[Math.floor(n/36)]},${l[Math.floor(n/6)%6]},${l[n%6]})`}
  return"#ccc";
}
const CSS=[];for(let i=0;i<256;i++)CSS.push(xterm(i));

function buildScene(){
  const pts=[], neck=[0,-0.12,0], C=[0,0.12,0], D=0.64, N=10, golden=Math.PI*(3-Math.sqrt(5)), heads=[];
  for(let i=0;i<N;i++){
    const el=(88-60*Math.sqrt(i/(N-1)))*Math.PI/180, az=i*golden;
    const d=[Math.cos(el)*Math.cos(az),Math.sin(el),Math.cos(el)*Math.sin(az)];
    heads.push([add(C,d,D*U(0.92,1.05)),norm(d)]);
  }
  const tulipSlots=[3,8], flowers=[]; let discI=0;
  heads.forEach(([pos,axis],idx)=>{
    const base=add(pos,axis,-0.03);
    for(let j=0;j<70;j++){const t=j/69;
      pts.push([base[0]+(neck[0]-base[0])*t,base[1]+(neck[1]-base[1])*t,base[2]+(neck[2]-base[2])*t,axis[0],0,axis[2],GREENS,-0.15,true,null]);}
    if(tulipSlots.includes(idx)){
      const nT=tulipSlots.filter(k=>k<idx).length;
      flowers.push([pos,"tulip",TULIP[nT%3],null,0,0.11,U(0,6.28)]);
    }else{
      const [pe,ce,np]=DISC[discI++%DISC.length];
      flowers.push([pos,"disc",pe,ce,np,U(0.12,0.14),U(0,6.28)]);
    }
  });
  for(let i=0;i<8;i++){
    const a=(i+0.4)/8*2*Math.PI,c=Math.cos(a),s=Math.sin(a),base=[0.26*c,0.30,0.26*s],d=norm([c,0.15,s]),side=[-s,0,c],n=norm(cross(side,d)),L=0.30,W=0.07;
    for(let ti=0;ti<32;ti++){const t=ti/31;
      for(let wi=-5;wi<=5;wi++){const w=wi/5,curl=0.025*w*w,sw=W*Math.sin(Math.PI*t)*w;
        pts.push([base[0]+d[0]*L*t+side[0]*sw+n[0]*curl,base[1]+d[1]*L*t-0.10*t*t+n[1]*curl,base[2]+d[2]*L*t+side[2]*sw+n[2]*curl,n[0],n[1],n[2],GREENS,wi===0?-0.25:0,true,null]);}}
  }
  const y0=-0.20,y1=0.30,r0=0.06,r1=0.36,k=(r1-r0)/(y1-y0),rings=50;
  for(let i=0;i<rings;i++){
    const t=i/(rings-1),r=r0+(r1-r0)*t,count=Math.max(8,Math.floor(170*r));
    for(let j=0;j<count;j++){
      const ph=(j+rnd())/count*2*Math.PI,c=Math.cos(ph),s=Math.sin(ph);
      let y=y0+(y1-y0)*t; if(t>0.9)y+=0.03*Math.sin(9*ph);
      const fold=0.3*(Math.abs(Math.sin(5*ph))-0.6),nn=norm([c,-k,s]);
      pts.push([r*c,y,r*s,nn[0],nn[1],nn[2],PAPER,fold,false,null]);
    }
  }
  for(let i=0;i<7;i++){
    const a=i/7*2*Math.PI,sx=0.025*Math.cos(a),sz=0.025*Math.sin(a);
    for(let j=0;j<40;j++){const t=j/39;
      pts.push([sx*(1+1.2*t),-0.20-0.30*t,sz*(1+1.2*t),Math.cos(a),0,Math.sin(a),GREENS,-0.1,true,null]);}
  }
  const by=-0.12,br=r0+k*(by-y0)+0.01;
  for(let j=0;j<90;j++){const ph=j/90*2*Math.PI;
    for(const dy of[-0.012,0,0.012])pts.push([br*Math.cos(ph),by+dy,br*Math.sin(ph),Math.cos(ph),0,Math.sin(ph),RIBBON,0,false,null]);}
  const knot=[0,by,br+0.01];
  for(const side of[-1,1]){
    for(let j=0;j<70;j++){const a=j/70*2*Math.PI,lx=side*(0.07+0.07*Math.cos(a)),ly=0.04*Math.sin(a)+0.02*(0.07+0.07*Math.cos(a))/0.14;
      for(const f of[1,0.7])pts.push([knot[0]+lx*f,knot[1]+ly*f,knot[2]+0.01,side*0.3,0.2,0.93,RIBBON,0.1,true,null]);}
    for(let j=0;j<30;j++){const t=j/29;
      pts.push([knot[0]+side*0.06*t,knot[1]-0.15*t,knot[2]+0.015,side*0.2,0,0.98,RIBBON,-0.05+0.05*Math.sin(t*9),true,null]);}
  }
  for(const dx of[-0.01,0,0.01])pts.push([dx,by,knot[2]+0.02,0,0,1,RIBBON,0.2,true,"@"]);
  const babies=[];
  for(let i=0;i<90;i++){const a=rnd()*2*Math.PI,el=U(0.3,1.4),rr=U(0.40,0.58);
    babies.push([rr*Math.cos(a)*Math.cos(el),C[1]+rr*Math.sin(el),rr*Math.sin(a)*Math.cos(el),U(0,6.28)]);}
  const sparkles=[];
  for(let i=0;i<30;i++){const a=rnd()*2*Math.PI,rr=U(0.75,0.95);
    sparkles.push([rr*Math.cos(a),U(-0.3,1.0),rr*Math.sin(a),U(0,6.28),U(1.5,4.0)]);}
  return{pts,flowers,babies,sparkles};
}

const clamp01=b=>Math.min(0.999,Math.max(0,b));
const pick=(s,b)=>s[Math.floor(b*s.length)];

function render(scene,t,cols,rows,hearts){
  const{pts,flowers,babies,sparkles}=scene;
  const chars=new Array(cols*rows).fill(" "),colors=new Array(cols*rows).fill(0),zbuf=new Array(cols*rows).fill(-1e9);
  const viewRows=rows-2, scale=Math.max(1,Math.min((viewRows-2)/1.45,(cols-2)/2.7)), sxs=scale*2, cx=cols/2, cy=1+0.78*scale;
  const ang=t*SPIN_SPEED,ca=Math.cos(ang),sa=Math.sin(ang),ct=Math.cos(TILT),st=Math.sin(TILT);
  const proj=(x,y,z)=>{const xr=x*ca-z*sa,zr=x*sa+z*ca,yp=y-PIVOT_Y,yt=yp*ct-zr*st,zt=yp*st+zr*ct,f=CAM_DIST/(CAM_DIST-zt);
    return[cx+xr*f*sxs,cy-yt*f*scale,zt,f]};
  const plot=(col,row,z,ch,color)=>{
    if(row>=0&&row<viewRows&&col>=0&&col<cols){const i=row*cols+col;if(z>zbuf[i]){zbuf[i]=z;chars[i]=ch;colors[i]=color}}};

  for(const[x,y,,phase,color]of hearts){
    let col=Math.trunc((x+0.015*Math.sin(t*1.2+phase))*cols);col=((col%cols)+cols)%cols;
    plot(col,Math.trunc(y*viewRows),-50,"♥",color);
  }
  for(const[x,y,z,nx,ny,nz,pal,tone,two,ov]of pts){
    const p=proj(x,y,z),col=Math.trunc(p[0]),row=Math.trunc(p[1]);
    const nxr=nx*ca-nz*sa,nzr=nx*sa+nz*ca,nyt=ny*ct-nzr*st,nzt=ny*st+nzr*ct;
    let dot=nxr*LX+nyt*LY+nzt*LZ; if(two&&dot<0)dot=-dot*0.55;
    const b=clamp01(0.25+0.75*Math.max(0,dot)+tone);
    plot(col,row,p[2],ov||pick(SHADE,b),pick(pal,b));
  }
  for(const[pos,kind,pal,cpal,nPet,R,seed]of flowers){
    const[fx,fy,zt,f]=proj(...pos),rx=R*f*sxs,ry=R*f*scale;
    const dim=-0.4*(1-Math.min(1,Math.max(0,(zt+0.6)/1.2))),rot=seed+ang*0.7;
    for(let row=Math.trunc(fy-ry)-1;row<Math.trunc(fy+ry)+2;row++){
      const dy=(row+0.5-fy)/ry;
      for(let col=Math.trunc(fx-rx)-1;col<Math.trunc(fx+rx)+2;col++){
        const dx=(col+0.5-fx)/rx;
        if(kind==="disc"){
          const s=Math.hypot(dx,dy); if(s>1)continue;
          if(s<0.3){const b=clamp01(0.55-0.35*dx-0.35*dy+dim);plot(col,row,zt+0.06,s<0.17?"@":"o",pick(cpal,b));continue}
          const ph=Math.atan2(dy,dx),reach=0.32+0.68*Math.pow(Math.abs(Math.cos(nPet*(ph+rot)/2)),0.7);
          if(s>reach)continue;
          const edge=s>reach-0.14?-0.22:0,b=clamp01(0.62-0.22*dx-0.28*dy+0.12*s+edge+dim);
          plot(col,row,zt+0.04*(1-s),pick(PETAL,b),pick(pal,b));
        }else{
          const v=(1-dy)/2; if(v<0||v>1)continue;
          const hw=0.62*Math.sin(Math.PI*0.5*Math.min(1,v*1.5+0.05)); if(hw<=0||Math.abs(dx)>hw)continue;
          const xn=dx/hw; if(v>0.72+0.28*Math.pow(Math.cos(1.5*Math.PI*xn),2))continue;
          const seam=Math.abs(Math.abs(xn)-0.33)<0.12&&v>0.3?-0.25:0,b=clamp01(0.55-0.3*xn+0.1*v+seam+dim);
          plot(col,row,zt+0.03,pick(PETAL,b),pick(pal,b));
        }
      }
    }
  }
  for(const[x,y,z,phase]of babies){
    const p=proj(x,y,z),star=Math.sin(t*2+phase)>0.6;
    plot(Math.trunc(p[0]),Math.trunc(p[1]),p[2]+0.02,star?"*":"·",star?231:255);
  }
  for(const[x,y,z,phase,speed]of sparkles){
    const p=proj(x,y,z),tw=Math.sin(t*speed+phase),c=Math.trunc(p[0]),r=Math.trunc(p[1]);
    if(tw>0.85)plot(c,r,p[2],"*",231);else if(tw>0.4)plot(c,r,p[2],"+",225);else if(tw>0)plot(c,r,p[2],"·",218);
  }
  const msg=[...MESSAGE],shift=Math.trunc(t*6),ms=Math.max(0,Math.floor((cols-msg.length)/2));
  msg.forEach((ch,i)=>{if(ms+i<cols){const k=(rows-2)*cols+ms+i;chars[k]=ch;colors[k]=MSG_COLORS[(i+shift)%MSG_COLORS.length]}});
  const hint=[...CREDIT],hs=Math.max(0,Math.floor((cols-hint.length)/2));
  hint.forEach((ch,i)=>{if(hs+i<cols){const k=(rows-1)*cols+hs+i;chars[k]=ch;colors[k]=238}});
  return{chars,colors};
}

const cv=document.getElementById("c"),ctx=cv.getContext("2d");
let cols,rows,cw,ch,font;
function resize(){
  const dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;
  cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const fs=Math.min(18,Math.max(9,W/60));
  cw=fs*0.6;ch=fs*1.2;cols=Math.max(20,Math.floor(W/cw));rows=Math.max(12,Math.floor(H/ch));
  font=`${fs}px ui-monospace,Menlo,Consolas,"DejaVu Sans Mono",monospace`;
}
addEventListener("resize",resize);resize();

const scene=buildScene();let hearts=[],last=performance.now();const t0=last;
function frame(now){
  const dt=(now-last)/1000;last=now;
  while(hearts.length<NUM_HEARTS)hearts.push([Math.random(),1+Math.random(),0.03+Math.random()*0.05,Math.random()*6.28,HEART_COLORS[Math.floor(Math.random()*HEART_COLORS.length)]]);
  for(const h of hearts){h[1]-=h[2]*dt;if(h[1]<0){h[0]=Math.random();h[1]=1;h[4]=HEART_COLORS[Math.floor(Math.random()*HEART_COLORS.length)]}}
  const{chars,colors}=render(scene,(now-t0)/1000,cols,rows,hearts);
  ctx.clearRect(0,0,cv.clientWidth,cv.clientHeight);
  ctx.font=font;ctx.textAlign="center";ctx.textBaseline="middle";
  let cur=-1;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const i=r*cols+c,g=chars[i]; if(g===" ")continue;
    if(colors[i]!==cur){cur=colors[i];ctx.fillStyle=CSS[cur]}
    ctx.fillText(g,c*cw+cw/2,r*ch+ch/2);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
