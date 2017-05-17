define('Utils', ['./Utils/Classify', './Utils/GetMeta', './Utils/isSignal'], function(classify, getMeta, isSignal){

  // POLYFILLS
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {

        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If len is 0, return false.
        if (len === 0) {
          return false;
        }

        // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)
        var n = fromIndex | 0;

        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }

        // 7. Repeat, while k < len
        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          // c. Increase k by 1.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          }
          k++;
        }

        // 8. Return false
        return false;
      }
    });
  }





  // ADD / REMOVE / HAS CLASS ========================================================
  Node.prototype.hasClass = function (className) {
      if (this.classList) {
          return this.classList.contains(className);
      } else {
          return (-1 < this.className.indexOf(className));
      }
  };

  Node.prototype.addClass = function (className) {
      if (this.classList) {
          this.classList.add(className);
      } else if (!this.hasClass(className)) {
          var classes = this.className.split(" ");
          classes.push(className);
          this.className = classes.join(" ");
      }
      return this;
  };

  Node.prototype.removeClass = function (className) {
      if (this.classList) {
          this.classList.remove(className);
      } else {
          var classes = this.className.split(" ");
          classes.splice(classes.indexOf(className), 1);
          this.className = classes.join(" ");
      }
      return this;
  };

  String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
  }

  function extend(obj, props) {
      for(var prop in props) {
          if(props.hasOwnProperty(prop)) {
              obj[prop] = props[prop];
          }
      }
  }

  function remap(x, in_min , in_max , out_min , out_max ) {
    if (x < in_min) { x = in_min }
    if (x > in_max) { x = in_max }
      return ( x - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
  }

  function iterate(obj, func) {
    for (var key in obj) {
      if ( obj.hasOwnProperty(key) ) {
        func(key, obj[key])
      }
    }
  }

  function getWindowSize() {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {width: x, height: y}
  }


  function downloadTextFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function nodeFromString( html ) {
    var tempContainer = document.createElement('div')
    tempContainer.innerHTML = html

    return tempContainer.firstElementChild
  }

  var utils = {
    extend: extend,
    remap: remap,
    iterate: iterate,
    classify: classify,
    getMeta: getMeta,
    isSignal: isSignal,
    getWindowSize: getWindowSize,
    downloadTextFile: downloadTextFile,
    nodeFromString: nodeFromString
  }

  window.utils = utils
  module.exports = utils

})
