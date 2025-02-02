var buttonInputs = document.querySelectorAll('input[type="button"]');
var url = "https://mcqsmart.com/HSC/Science/index-App-HSC-Chemistry-Two.php";
var phys2url = "https://mcqsmart.com/HSC/Science/index-App-HSC-Physics-Two.php";
var chapter = 0;

var chInfo = localStorage.getItem("ch_info");
if (chInfo == null) chInfo = "chem2 0";
var sub = chInfo.split(" ")[0];
var chp = parseInt(chInfo.split(" ")[1]);
chapter = chp;

if (sub == "phy1") {
  url = "https://mcqsmart.com/HSC/Science/index-App-HSC-Physics-One.php";
}
if (sub == "phy2") {
  url = "https://mcqsmart.com/HSC/Science/index-App-HSC-Physics-Two.php";
}
if (sub == "chem1") {
  url = "https://mcqsmart.com/HSC/Science/index-App-HSC-Chemistry-One.php";
}
if (sub == "chem2") {
  url = "https://mcqsmart.com/HSC/Science/index-App-HSC-Chemistry-Two.php";
}

var t = 3000;
var vbr = 50;
window.timer = null;

document.body.insertAdjacentElement(
  "afterbegin",
  new DOMParser().parseFromString(
    "<div style='position:fixed;bottom:0px;width:100%;'>" +
      "<input id='ch' style='width:100%;background-color:grey;padding:10px;text-align: center;display: inline;float:right;' type='text' oninput='setLocalStorage(this.value)'>" +
      "<div id='nextt' style='background-color:blue;padding:10px;text-align: center;display: inline;float:right;width:50%' onclick='nextt()'> Next </div>" +
      "<div id='infoo' style='width:50%;background-color:orange;padding:10px;text-align: center;display: inline;float:right;' onclick='toggleTimer()'> Pause </div>" +
      "</div>",
    "text/html"
  ).documentElement
);

document.getElementById("ch").value = chInfo;

window.setLocalStorage = function (e) {
  localStorage.setItem("ch_info", "" + e);
};
window.nextt = function () {
  clickButton1();
  window.toggleTimer();
};
window.toggleTimer = function () {
  window.navigator.vibrate(vbr);
  if (window.timer.getId()) {
    document.getElementById("infoo").textContent = "Resume";
    document.getElementById("infoo").style.backgroundColor = "gray";
    window.timer.pause();
  } else {
    document.getElementById("infoo").textContent = "Pause";
    document.getElementById("infoo").style.backgroundColor = "orange";
    window.timer.resume();
  }
};

if (window.location.href == url) {
  buttonInputs[chapter].click();
}
if (window.location.href == "https://mcqsmart.com/App5S1LS.php") {
  document.getElementById("button1").click();
}
if (window.location.href == "https://mcqsmart.com/AppViewPlayJS.php") {
  clickButton1();
}
if (window.location.href == "https://mcqsmart.com/AppViewScoreJS.php") {
  window.location.href = url;
}

function clickButton1() {
  window.navigator.vibrate(vbr);
  if (window.timer) window.timer.clear();
  document.getElementById("button1").click();
  window.timer = new Timer(function () {
    clickButton1();
    return;
  }, t);
}
function Timer(callback, delay) {
  var timerId,
    start,
    remaining = delay;
  this.getId = function () {
    return timerId;
  };
  this.pause = function () {
    window.clearTimeout(timerId);
    timerId = null;
    remaining -= Date.now() - start;
  };

  this.resume = function () {
    if (timerId) {
      return;
    }

    start = Date.now();
    timerId = window.setTimeout(callback, remaining);
  };

  this.next = function () {
    window.navigator.vibrate(vbr);

    clickButton1();
    this.pause();
  };

  this.clear = function () {
    window.clearTimeout(timerId);
    timerId = null;
  };

  this.resume();
}

setInterval(() => {}, 100);
