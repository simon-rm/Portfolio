var rotatingCursor = (function () {
  /* Local Variables */
  const INTERVAL_POSITION = 5;
  const INTERVAL_ROTATION = 100;
  let lastCursorPos = { x: -999, y: -999 };
  let currentCursorPos = { x: -999, y: -999 };
  let lastCursorAngle = 0,
    cursorAngle = 0;
  let cursorEl,
    cursorImageEl,
    halfRocketWidth = 0; // <— NEW

  /* Local Functions */

  // Set position & rotation every tick
  function setCurrentCursorProps() {
    // Shift so that the rocket’s tip (top-centre) lands exactly on the cursor
    cursorEl.style.transform = `translate(${currentCursorPos.x - halfRocketWidth}px, ${
      currentCursorPos.y
    }px)`;

    // Keep rotation direction smooth
    while (Math.abs(lastCursorAngle - cursorAngle) > 180) {
      if (cursorAngle > lastCursorAngle) cursorAngle -= 360;
      else cursorAngle += 360;
    }
    cursorImageEl.style.transform = `rotate(${cursorAngle - 90}deg)`;
  }

  function updateCursor() {
    window.addEventListener("mousemove", (e) => {
      currentCursorPos = { x: e.clientX, y: e.clientY };
    });

    setInterval(setCurrentCursorProps, INTERVAL_POSITION);

    setInterval(() => {
      const dx = lastCursorPos.x - currentCursorPos.x;
      const dy = lastCursorPos.y - currentCursorPos.y;
      if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;

      cursorAngle = Math.atan2(dy, dx) * (180 / Math.PI);

      setCurrentCursorProps();

      lastCursorPos = currentCursorPos;
      lastCursorAngle = cursorAngle;
    }, INTERVAL_ROTATION);
  }

  /* Public Functions */

  return {
    initialize: () => {
      cursorEl = document.querySelector("#cursor");
      cursorImageEl = cursorEl.querySelector("*");

      // Make the rocket rotate around its nose (top-centre)
      cursorImageEl.style.transformOrigin = "50% 0%";
      // Cache half the rocket’s width so we only compute it once
      halfRocketWidth = cursorImageEl.getBoundingClientRect().width / 2;

      updateCursor();
    },
  };
})();

document.addEventListener("DOMContentLoaded", rotatingCursor.initialize);


//////////////////// TRAIL

var c = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

window.onresize = function () {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

dots = []; emitRate = 9; minRad = 1; maxRad = 2; color = "white"; opc = 0.6; sha = 2; lifeTime = 30; tn = 0; roc = 1; speed = 1;

var controls = new function() {
  this.emitRate = emitRate;
  this.spread = speed;
  this.radiusMin = minRad;
  this.radiusMax = maxRad;
  this.color = "";
  this.opacity = opc;
  this.glow = sha;
  this.onChange_redraw = false;
  this.randomColor = false;
  this.lifeTime = lifeTime;
  this.circleShape = true;
  
  this.redraw = function() {
    emitRate = controls.emitRate;
    speed = controls.spread;
    minRad = controls.radiusMin;
    maxRad = controls.radiusMax;
    lifeTime = controls.lifeTime;
    color = controls.color;
    opc = controls.opacity;
    sha = controls.glow;
    if (controls.onChange_redraw) {
      dots.splice(0, dots.length);
    }
    if (controls.circleShape) {
      roc = 1;
    } else {
      roc = 0;
    }
    if(controls.randomColor){
      color = "";
    }
  }
}

prevx = ctx.canvas.width/2 -250;
prevy = ctx.canvas.height/8;
increase = Math.PI * 2 / 40;
counter = 0;
controls.color = "orange";
controls.randomColor = false;

function emitDots(mx, my){
  for(i=0; i<emitRate; i++){
    rxv = Math.random() * 2 - 1;
    ryv = Math.random() * 2 - 1;
    if(color == ""){
      col = "hsl("+Math.random() * 360+",65%,65%)";
    } else {
      col = color;
    }
    rad = Math.random() * (maxRad-minRad) + minRad;
    dots.push({x:mx,y:my,xv:rxv, yv:ryv, col:col, rad:rad});
  }
}

function animDots(){
  for(i=0; i<dots.length; i++){
    dots[i].x += dots[i].xv * speed;
    dots[i].y += dots[i].yv * speed;
    
    ctx.beginPath();
    ctx.fillStyle = dots[i].col;
    ctx.globalAlpha = opc;
    ctx.shadowColor = dots[i].col;
    ctx.shadowBlur = sha;
    if(roc == 0){
      ctx.rect(dots[i].x, dots[i].y, dots[i].rad, dots[i].rad);
    } else {
      ctx.arc(dots[i].x, dots[i].y, dots[i].rad, 0, 2*Math.PI);
    }
    ctx.fill();
    ctx.closePath();
  }
}

function cleanUp(){
  if(dots.length > 1){
    dots.splice(0, Math.ceil(dots.length/lifeTime));
  }
}

function getFPS(){
  tl = tn;
  tn = Date.now();
  td = tn - tl;
  fps = Math.round(1000/td);
  fps >= 58 ? fps = 60 : fps;
  fpse = document.getElementById("fps");
  fpse.innerHTML = "FPS: "+fps;
  fpse.style="color:hsl("+(fps*2)+",100%,50%)";
}

function loop(){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  document.onmousemove = function(e){
    mx = e.clientX;
    my = e.clientY;
    emitDots(mx, my);
  }
  document.ontouchmove = function(e){
    mx = e.changedTouches[0].pageX;
    my = e.changedTouches[0].pageY;
    emitDots(mx, my);
  }
  animDots();
  cleanUp();
}
loop();
setInterval(loop, 16.67);