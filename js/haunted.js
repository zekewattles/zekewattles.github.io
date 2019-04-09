

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

/*
  88  88    db    88   88 88b 88 888888 888888 8888b.
  88  88   dPYb   88   88 88Yb88   88   88__    8I  Yb
  888888  dP__Yb  Y8   8P 88 Y88   88   88""    8I  dY
  88  88 dP""""Yb `YbodP' 88  Y8   88   888888 8888Y"
*/

function randomi (min, max) {
  return Math.random() * (max - min) + min
}
function randomiz (p) {
  return (Math.random() * 100 >= (p || 50)) ? false : true
}
function getRandom(a) {
  return a[Math.floor(Math.random()*a.length)]
}
function calculcenterx () {
  return getRandom(fuckingPixels)[0];
}
function calculcentery () {
  return getRandom(fuckingPixels)[1];
}
function calculcenter() {
  var rrr = getRandom(fuckingPixels);
  return {x:rrr[0],y:rrr[1]};
}
var sssssss = -2.7;
function speed () {
  return (sssssss * Math.random());
}

var
  c2 = document.getElementById('c')
  ,width = c2.offsetWidth
  ,height = c2.offsetHeight
  ,ctx = c2.getContext('2d')
;
c2.width = width;
c2.height = height;

var PIX = true;

var BAC = '#c3ff00';
var FIL = '#000';
var WEB = '#000';

ctx.imageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;
ctx.strokeStyle = FIL;
ctx.lineWidth = 1;
var boids = [];
var points = [];
var totalBoids = 7;
var pointCount = 0;

var img = new Image();
    img.src = 'img/logo.png';

var fuckingPixels = [];
img.onload = function(){

  var buf = document.createElement('canvas'), a, x, y, h, w, i, bbb;
  buf.width = w = img.width;
  buf.height = h = img.height;
  bbb = buf.getContext('2d');
  bbb.drawImage(img,0,0,w,h);

  var R = 5;
  var d = bbb.getImageData( 0, 0, w, h ).data;

  var cx = ~~((width/2)-(w/2));
  var cy = ~~((height/2)-(h/2));
  ctx.drawImage(img,cx,cy,w,h);

  for ( x=0; x<=w; x=x+R ) {
    for ( y=0; y<=h; y=y+R ) {
      i = (y*w + x)*4, r=d[i], g=d[i+1], b=d[i+2], a=d[i+3];
      if (r==0 && g==0 && b==0 && a>200) {
        var X = x+cx,
            Y = y+cy,
            W = 1,
            H = 1;
        fuckingPixels.push([X,Y]);
        points.push([X+0.5,Y+0.5]);
      }
    }
  }
  init()
}

function init () {
  document.body.className = '';
  for (var i = 0; i < totalBoids; i++) {
    var CC = calculcenter();
    boids.push({
      x: CC.x,
      y: CC.y,
      v: {
        x: 0,//Math.random() * 2 - 1,
        y: 0//Math.random() * 2 - 1
      }
    });
  }
  update2();
}

function calculateDistance (v1, v2) {
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
function checkWallCollisions (index) {
  if (boids[index].x > width || boids[index].x < 0 ||
      boids[index].y > height || boids[index].y < 0) {
    var CC = calculcenter();
    boids[index].x = CC.x;
    boids[index].y = CC.y;
  }
}
function addForce (index, force) {
  boids[index].v.x += force.x;
  boids[index].v.y += force.y;
  magnitude = calculateDistance({x: 0,y: 0}, {
    x: boids[index].v.x,
    y: boids[index].v.y
  });
  boids[index].v.x = (boids[index].v.x / magnitude);// * 1.5;
  boids[index].v.y = boids[index].v.y / magnitude;
}
//This should be in multiple functions, but this will
//save tons of looping - Gross!
function applyForces (index) {
  percievedCenter = {x: 0,y: 0};
  flockCenter = {x: 0,y: 0};
  percievedVelocity = {x: 0,y: 0};
  count = 0;

  for (var i = boids.length - 1; i >= 0; i--) {
    if (i != index) {
      var B = boids[i];
      //Allignment
      dist = calculateDistance(boids[index], B);
      if (dist > 50 && dist < 900) {
        count++;
        //Alignment
        percievedCenter.x += B.x;
        percievedCenter.y += B.y;
        //Cohesion
        percievedVelocity.x += B.v.x;
        percievedVelocity.y += B.v.y;
        //Seperation
        if (calculateDistance(B, boids[index]) < 10) {
          flockCenter.x -= (B.x - boids[index].x);
          flockCenter.y -= (B.y - boids[index].y);
        }
      }
    }
  }

  if (count > 0) {
    var CC = calculcenter();
    percievedCenter.x = percievedCenter.x / count;
    percievedCenter.y = percievedCenter.y / count;

    percievedCenter.x = ((((percievedCenter.x - boids[index].x) * Math.random()) * count) / (CC.x / count)) * percievedCenter.y;
    percievedCenter.y = ((((percievedCenter.y - boids[index].y) * Math.random()) * count) / (CC.y / count)) * percievedCenter.y;

    percievedVelocity.x = percievedVelocity.x / count;
    percievedVelocity.y = percievedVelocity.y / count;
    flockCenter.x /= count + Math.random();
    flockCenter.y /= count + Math.random();
  }
  addForce(index, percievedCenter);
  addForce(index, percievedVelocity);
  addForce(index, flockCenter);
}

var cnt = 0;


function update2 (dt) {

  var DDD = PIX ? 30 : 70;

  while (points[pointCount]) {
    ctx.beginPath();

    var l = points.length - 1;
    for (var j = l; j >= 0; j--) {
      cnt++;
      dx = points[j][0] - points[pointCount][0];
      dy = points[j][1] - points[pointCount][1];
      d = dx * dx + dy * dy;
      if (!PIX) {ctx.lineWidth = 0.4};
      if (d < DDD*Math.random()) {
        ctx.beginPath();

        ctx.moveTo(points[pointCount][0], points[pointCount][1]);
        ctx.lineTo(points[j][0], points[j][1])
        ctx.stroke();
      }
    }
    pointCount++;
  }

  if(!points[pointCount]) {
    //console.log('ok');
    launchAnim();
  }


}

var isDark = true;
var itGrow = 0;
var accFini = false;
function update (dt) {

  ctx.beginPath();
  //document.getElementById('cnt').innerHTML = points.length;
  //document.getElementById('cnt').innerHTML = ddddd;

  var bl = boids.length;
  var bl2 = bl/2;

  //console.log(bl);
  itGrow += 0.001;

  for (var i = bl - 1; i >= 0; i--) {
    var d, dx, dy, j;

    var ddd = 90 + itGrow*2;//70 + itGrow;//randomiz(10) ? randomiz(5) ? 200 : 50 : 70;
    var spd = speed() - itGrow/100;//*3;//*Math.random(); ///1*Math.random();
    if (i>bl2) {
      ddd = 30 + itGrow;//25 + itGrow/2;//randomiz(10) ? 30 : 30;
      //spd = spd/1*Math.random();
    }
    if (!PIX) {ctx.lineWidth = 1};
    //Draw boid
    //document.getElementById('cnt').innerHTML = ' : ' + spd;
    //if (fuckingPixels.length-1>=cnt) {
      ctx.moveTo(boids[i].x, boids[i].y);


      boids[i].x += boids[i].v.x * spd;
      boids[i].y += boids[i].v.y * spd;
      applyForces(i);
      boids[i].x = ~~(boids[i].x)+0.5;
      boids[i].y = ~~(boids[i].y)+0.5;
      ctx.lineTo(boids[i].x, boids[i].y);
      ctx.stroke();

      points.push([boids[i].x, boids[i].y]);
    //}

    var l = points.length - 1;
    for (var j = l; j >= 0; j-=5) {
      cnt++;
      if (!points[pointCount]) continue;
      dx = points[j][0] - points[pointCount][0];
      dy = points[j][1] - points[pointCount][1];
      d = dx * dx + dy * dy;
      if (!PIX) {ctx.lineWidth = 0.3};
      if (d < ddd) {
        ctx.beginPath();
        //ctx.moveTo(~~(points[pointCount][0])+0.5, ~~(points[pointCount][1])+0.5);
        //ctx.lineTo(~~(points[j][0])+0.5, ~~(points[j][1])+0.5)
        ctx.moveTo(points[pointCount][0], points[pointCount][1]);
        ctx.lineTo(points[j][0], points[j][1])
        ctx.stroke();
      }
    }

    //if (fuckingPixels.length-1>=cnt) pointCount++;
    pointCount++;
    //document.getElementById('cnt').innerHTML = ' : ' + itGrow/2;

    if (!accFini) {
      if (itGrow/2>2) accFini = true;
      if(randomiz(2-itGrow/2)){
        var CC = calculcenter();
        boids[i].x = CC.x;
        boids[i].y = CC.y;
      } else {
        checkWallCollisions(i);
      }
    } else {
      checkWallCollisions(i);
    }
    //fuckingPixels.push([boids[i].x, boids[i].y]);
  }
}

var gameloop = (function () {
  'use strict';
  var reqAnimFrame = function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
  return function (callback) {
    var lastUpdate = +new Date();
    (function loop() {
      callback(((+new Date()) - lastUpdate) / 1000);
      reqAnimFrame(loop);
      lastUpdate = +new Date();
    }());
  };
}());

function launchAnim(arg) {
  gameloop(function(dt) {
    update(dt);
  });
  /*document.onmousemove = function(evt) {
    update();
  }*/
}

