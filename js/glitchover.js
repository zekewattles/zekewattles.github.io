!function(global) { 'use strict';

    var symbols = "👾 💩 ☂ ☔ ✈ ☀ ☼ ☁ ⚡ ⌁ ☇ ☈ ❄ ❅ ❆ ☃ ☉ ☄ ★ ☆ ☽ ☾ ⌛ ⌚ ⌂ ✆ ☎ ☏ ✉ ☑ ✓ ✔ ⎷ ⍻ ✖ ✗ ✘ ☒ ✕ ☓ ☕ ♿ ✌ ☚ ☛ ☜ ☝ ☞ ☟ ☹ ☺ ☻ ☯ ⚘ ☮ ⚰ ⚱ ⚠ ☠ ☢ ⚔ ⚓ ⎈ ⚒ ⚑ ⚐ ☡ ❂ ⚕ ⚖ ⚗ ✇ ☣ ⚙ ☤ ⚚ ⚛ ⚜ ☥ ✝ ☦ ☧ ☨ ☩ † ☪ ☫ ☬ ☭ ✁ ✂ ✃ ✄ ✍ ✎ ✏ ✐  ✑ ✒ ✙ ✚ ✜ ✛ ♰ ♱ ✞ ✟ ✠ ✡ ☸ ✢ ✣ ✤ ✥ ✦ ✧ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ✲ ✱ ✳ ✴ ✵ ✶ ✷ ✸ ✹ ✺ ✻ ✼ ✽ ✾ ❀ ✿ ❁ ❃ ❇ ❈ ❉ ❊ ❋ ⁕ ☘ ❦ ❧ ☙ ❢ ❣ ♀ ♂ ⚢ ⚣ ⚤ ⚦ ⚧ ⚨ ⚩ ☿ ♁ ⚯ ♛ ♕ ♚ ♔ ♜ ♖ ♝ ♗ ♞ ♘ ♟ ♙ ☗ ☖ ♠ ♣ ♦ ♥ ❤ ❥ ♡ ♢ ♤ ♧ ⚀ ⚁ ⚂ ⚃ ⚄ ⚅ ⚇ ⚆ ⚈ ⚉ ♨ ♩ ♪ ♫ ♬ ♭ ♮ ♯  ⌨ ⏏ ⎗ ⎘ ⎙ ⎚ ⌥ ⎇ ⌘ ⌦ ⌫ ⌧ ♲ ♳ ♴ ♵ ♶ ♷ ♸ ♹ ♺ ♻ ♼ ♽ ⁌ ⁍ ⎌ ⌇ ⌲ ⍝ ⍟ ⍣ ⍤ ⍥ ⍨ ⍩ ⎋ ♃ ♄ ♅ ♆ ♇ ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ⏚ ⏛".split(' ');

    function replaceAt(str, i, ch) {
      return str.substr(0, i) + ch + str.substr(i+ch.length);
    }

    var glitching = false;

    function startGlitch(el, text) {
      var timerID;
      function ggg() {
        var s = text;
        for (var i = 0, l = s.length; i < l; i++) {
          if (s.charAt(i) !== ' ' && Math.random() > .5) s = replaceAt(s, i, symbols[Math.floor(Math.random() * symbols.length)])
        }
        el.textContent = s;
        timerID = setTimeout(function() {
          if (glitching) ggg()
        }, 50)
      }
      if (glitching) ggg()
      setTimeout(function() {
        stopGlitch(el, timerID, text)
      }, 200);
      return timerID
    }
    function stopGlitch(el, timerID, text) {
      clearTimeout(timerID);
      el.textContent = text;
    }

    function _glitchover(el) {
      var timerID;
      var text = el.textContent;


      var instance = {
        start: function() {
          glitching = true;
          timerID = startGlitch(this, text);
        }
        ,stop: function() {
          glitching = false;
          stopGlitch(this, timerID, text)
        }
      }

      el.onmousemove = instance.start
      el.onmouseout = instance.stop;

      return instance;
    }

    global.$glitchover = _glitchover;
  }(this);