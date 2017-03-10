(function(name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('NaughtyBits', function() {
  var hardKillWords = []; // will obliterate current word when final character is typed
  var filterWords = []; // will obliterate word once the space is hit, allowing compounds
  var hardKill, soloKill; // Regexes

  var NaughtyBits = function(opts) {
    opts = opts || {};

    this.settings = opts;

    if(opts.hardKill && opts.hardKill.length) {
      hardKillWords = opts.hardKill;
    }
    if(opts.filter && opts.filter.length) {
      filterWords = opts.filter;
    }

    this.buildFilters();
  }


  NaughtyBits.prototype.watch = function(selector) {
    this.inputs = document.querySelectorAll(selector);
    if(this.inputs.length === 0) {
      throw(new Error("No inputs found matching selector:", selector));
    }
    var len = this.inputs.length;
    while(len--) {
      this.inputs[len].addEventListener("input", inputChange);
    }
  }

  NaughtyBits.prototype.stop = function(selector) {
    this.inputs = document.querySelectorAll(selector);
    if(this.inputs.length === 0) {
      throw(new Error("No inputs found matching selector:", selector));
    }
    var len = this.inputs.length;
    while(len--) {
      this.inputs[len].removeEventListener("input", inputChange);
    }
  }

  NaughtyBits.prototype.buildFilters = function() {
    if(hardKillWords.length > 0) {
      hardKill = new RegExp(buildFilter(hardKillWords, this.settings), "i");
    }
    if(filterWords.length > 0) {
      soloKill = new RegExp(buildFilter(filterWords, this.settings, {
        pre: "^",
        post: "$",
      }), "i");
    }

    if(hardKill == undefined && soloKill == undefined) {
      throw(new Error("At least one word list array must be added at instantiation: hardKill, filter"));
    }
  }

  function inputChange(e) {
    // Tasks:
    // [ ] Only check changed words (currently checks all, no word deltas)
    // [x] Kill words that shouldn't EVER be there (imaFUCKuup)
    // [x] Kill solo words (ass vs compass)
    // [ ] Check split words "f u c k" or "f.u.c.k" (based on settings?)

    var words = e.target.value.split(" ");
    var clean = true;

    var len = words.length;
    var checked = false;
    while(len--) {
      var word = words[len];
      if((hardKill && word.match(hardKill)) || (checked && soloKill && word.match(soloKill))) {
        clean = false;
        words.splice(len, 1);
      }
      checked = true;
    }

    if(!clean) {
      e.target.value = words.join(" ");
    }
  }

  function buildFilter(list, settings, opts) {
    opts = opts || {};

    // Tasks:
    // [x] Build list
    // [x] Wrap entries in pre/post tags as needed
    // [ ] Plural words (defined in settings)
    // [ ] 1337 words (defined in settings)

    var comprehensive = [];
    var len = list.length;
    while(len--) {
      comprehensive.push(list[len]);
    }

    var pre = opts.pre || "";
    var post = opts.post || "";
    var div = opts.divider || "|";

    return pre + comprehensive.join(post+div+pre) + post;
  }

  return NaughtyBits;
}));
