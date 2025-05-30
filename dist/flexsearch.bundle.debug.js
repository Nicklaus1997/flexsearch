/**!
 * FlexSearch.js v0.8.158 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function _f(self){'use strict';if(typeof module!=='undefined')self=module;else if(typeof process !== 'undefined')self=process;self._factory=_f;
var u;
function z(a, b, c) {
  const d = typeof c, e = typeof a;
  if ("undefined" !== d) {
    if ("undefined" !== e) {
      if (c) {
        if ("function" === e && d === e) {
          return function(h) {
            return a(c(h));
          };
        }
        b = a.constructor;
        if (b === c.constructor) {
          if (b === Array) {
            return c.concat(a);
          }
          if (b === Map) {
            var f = new Map(c);
            for (var g of a) {
              f.set(g[0], g[1]);
            }
            return f;
          }
          if (b === Set) {
            g = new Set(c);
            for (f of a.values()) {
              g.add(f);
            }
            return g;
          }
        }
      }
      return a;
    }
    return c;
  }
  return "undefined" === e ? b : a;
}
function A() {
  return Object.create(null);
}
function D(a) {
  return "string" === typeof a;
}
function aa(a) {
  return "object" === typeof a;
}
function ba(a) {
  const b = [];
  for (const c of a.keys()) {
    b.push(c);
  }
  return b;
}
function ca(a, b) {
  if (D(b)) {
    a = a[b];
  } else {
    for (let c = 0; a && c < b.length; c++) {
      a = a[b[c]];
    }
  }
  return a;
}
function da(a) {
  let b = 0;
  for (let c = 0, d; c < a.length; c++) {
    (d = a[c]) && b < d.length && (b = d.length);
  }
  return b;
}
;const ea = /[^\p{L}\p{N}]+/u, fa = /(\d{3})/g, ha = /(\D)(\d{3})/g, ia = /(\d{3})(\D)/g, ja = /[\u0300-\u036f]/g;
function G(a = {}) {
  if (!this || this.constructor !== G) {
    return new G(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
u = G.prototype;
u.assign = function(a) {
  this.normalize = z(a.normalize, !0, this.normalize);
  let b = a.include, c = b || a.exclude || a.split, d;
  if (c || "" === c) {
    if ("object" === typeof c && c.constructor !== RegExp) {
      let e = "";
      d = !b;
      b || (e += "\\p{Z}");
      c.letter && (e += "\\p{L}");
      c.number && (e += "\\p{N}", d = !!b);
      c.symbol && (e += "\\p{S}");
      c.punctuation && (e += "\\p{P}");
      c.control && (e += "\\p{C}");
      if (c = c.char) {
        e += "object" === typeof c ? c.join("") : c;
      }
      try {
        this.split = new RegExp("[" + (b ? "^" : "") + e + "]+", "u");
      } catch (f) {
        console.error("Your split configuration:", c, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = c, d = !1 === c || 2 > "a1a".split(c).length;
    }
    this.numeric = z(a.numeric, d);
  } else {
    try {
      this.split = z(this.split, ea);
    } catch (e) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = z(a.numeric, z(this.numeric, !0));
  }
  this.prepare = z(a.prepare, null, this.prepare);
  this.finalize = z(a.finalize, null, this.finalize);
  c = a.filter;
  this.filter = "function" === typeof c ? c : z(c && new Set(c), null, this.filter);
  this.dedupe = z(a.dedupe, !0, this.dedupe);
  this.matcher = z((c = a.matcher) && new Map(c), null, this.matcher);
  this.mapper = z((c = a.mapper) && new Map(c), null, this.mapper);
  this.stemmer = z((c = a.stemmer) && new Map(c), null, this.stemmer);
  this.replacer = z(a.replacer, null, this.replacer);
  this.minlength = z(a.minlength, 1, this.minlength);
  this.maxlength = z(a.maxlength, 1024, this.maxlength);
  this.rtl = z(a.rtl, !1, this.rtl);
  if (this.cache = c = z(a.cache, !0, this.cache)) {
    this.H = null, this.S = "number" === typeof c ? c : 2e5, this.B = new Map(), this.G = new Map(), this.L = this.K = 128;
  }
  this.h = "";
  this.M = null;
  this.A = "";
  this.N = null;
  if (this.matcher) {
    for (const e of this.matcher.keys()) {
      this.h += (this.h ? "|" : "") + e;
    }
  }
  if (this.stemmer) {
    for (const e of this.stemmer.keys()) {
      this.A += (this.A ? "|" : "") + e;
    }
  }
  return this;
};
u.addStemmer = function(a, b) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, b);
  this.A += (this.A ? "|" : "") + a;
  this.N = null;
  this.cache && H(this);
  return this;
};
u.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && H(this);
  return this;
};
u.addMapper = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (1 < a.length) {
    return this.addMatcher(a, b);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, b);
  this.cache && H(this);
  return this;
};
u.addMatcher = function(a, b) {
  if ("object" === typeof a) {
    return this.addReplacer(a, b);
  }
  if (2 > a.length && (this.dedupe || this.mapper)) {
    return this.addMapper(a, b);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, b);
  this.h += (this.h ? "|" : "") + a;
  this.M = null;
  this.cache && H(this);
  return this;
};
u.addReplacer = function(a, b) {
  if ("string" === typeof a) {
    return this.addMatcher(a, b);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, b);
  this.cache && H(this);
  return this;
};
u.encode = function(a, b) {
  if (this.cache && a.length <= this.K) {
    if (this.H) {
      if (this.B.has(a)) {
        return this.B.get(a);
      }
    } else {
      this.H = setTimeout(H, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = ja ? a.normalize("NFKD").replace(ja, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(ha, "$1 $2").replace(ia, "$1 $2").replace(fa, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let d = [], e = A(), f, g, h = this.split || "" === this.split ? a.split(this.split) : [a];
  for (let l = 0, m, n; l < h.length; l++) {
    if ((m = n = h[l]) && !(m.length < this.minlength || m.length > this.maxlength)) {
      if (b) {
        if (e[m]) {
          continue;
        }
        e[m] = 1;
      } else {
        if (f === m) {
          continue;
        }
        f = m;
      }
      if (c) {
        d.push(m);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(m) : !this.filter.has(m))) {
          if (this.cache && m.length <= this.L) {
            if (this.H) {
              var k = this.G.get(m);
              if (k || "" === k) {
                k && d.push(k);
                continue;
              }
            } else {
              this.H = setTimeout(H, 50, this);
            }
          }
          if (this.stemmer) {
            this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$"));
            let p;
            for (; p !== m && 2 < m.length;) {
              p = m, m = m.replace(this.N, r => this.stemmer.get(r));
            }
          }
          if (m && (this.mapper || this.dedupe && 1 < m.length)) {
            k = "";
            for (let p = 0, r = "", q, t; p < m.length; p++) {
              q = m.charAt(p), q === r && this.dedupe || ((t = this.mapper && this.mapper.get(q)) || "" === t ? t === r && this.dedupe || !(r = t) || (k += t) : k += r = q);
            }
            m = k;
          }
          this.matcher && 1 < m.length && (this.M || (this.M = new RegExp("(" + this.h + ")", "g")), m = m.replace(this.M, p => this.matcher.get(p)));
          if (m && this.replacer) {
            for (k = 0; m && k < this.replacer.length; k += 2) {
              m = m.replace(this.replacer[k], this.replacer[k + 1]);
            }
          }
          this.cache && n.length <= this.L && (this.G.set(n, m), this.G.size > this.S && (this.G.clear(), this.L = this.L / 1.1 | 0));
          if (m) {
            if (m !== n) {
              if (b) {
                if (e[m]) {
                  continue;
                }
                e[m] = 1;
              } else {
                if (g === m) {
                  continue;
                }
                g = m;
              }
            }
            d.push(m);
          }
        }
      }
    }
  }
  this.finalize && (d = this.finalize(d) || d);
  this.cache && a.length <= this.K && (this.B.set(a, d), this.B.size > this.S && (this.B.clear(), this.K = this.K / 1.1 | 0));
  return d;
};
function H(a) {
  a.H = null;
  a.B.clear();
  a.G.clear();
}
;let I, L;
async function ka(a) {
  a = a.data;
  var b = a.task;
  const c = a.id;
  let d = a.args;
  switch(b) {
    case "init":
      L = a.options || {};
      (b = a.factory) ? (Function("return " + b)()(self), I = new self.FlexSearch.Index(L), delete self.FlexSearch) : I = new N(L);
      postMessage({id:c});
      break;
    default:
      let e;
      if ("export" === b) {
        if (!L.export || "function" !== typeof L.export) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "export".');
        }
        d[1] ? (d[0] = L.export, d[2] = 0, d[3] = 1) : d = null;
      }
      if ("import" === b) {
        if (!L.import || "function" !== typeof L.import) {
          throw Error('Either no extern configuration provided for the Worker-Index or no method was defined on the config property "import".');
        }
        d[0] && (a = await L.import.call(I, d[0]), I.import(d[0], a));
      } else {
        (e = d && I[b].apply(I, d)) && e.then && (e = await e);
      }
      postMessage("search" === b ? {id:c, msg:e} : {id:c});
  }
}
;function la(a) {
  ma.call(a, "add");
  ma.call(a, "append");
  ma.call(a, "search");
  ma.call(a, "update");
  ma.call(a, "remove");
}
let na, oa, pa;
function qa() {
  na = pa = 0;
}
function ma(a) {
  this[a + "Async"] = function() {
    const b = arguments;
    var c = b[b.length - 1];
    let d;
    "function" === typeof c && (d = c, delete b[b.length - 1]);
    na ? pa || (pa = Date.now() - oa >= this.priority * this.priority * 3) : (na = setTimeout(qa, 0), oa = Date.now());
    if (pa) {
      const f = this;
      return new Promise(g => {
        setTimeout(function() {
          g(f[a + "Async"].apply(f, b));
        }, 0);
      });
    }
    const e = this[a].apply(this, b);
    c = e.then ? e : new Promise(f => f(e));
    d && c.then(d);
    return c;
  };
}
;let O = 0;
function P(a = {}) {
  function b(g) {
    function h(k) {
      k = k.data || k;
      const l = k.id, m = l && e.h[l];
      m && (m(k.msg), delete e.h[l]);
    }
    this.worker = g;
    this.h = A();
    if (this.worker) {
      d ? this.worker.on("message", h) : this.worker.onmessage = h;
      if (a.config) {
        return new Promise(function(k) {
          e.h[++O] = function() {
            k(e);
            1e9 < O && (O = 0);
          };
          e.worker.postMessage({id:O, task:"init", factory:c, options:a});
        });
      }
      this.worker.postMessage({task:"init", factory:c, options:a});
      this.priority = a.priority || 4;
      return this;
    }
  }
  if (!this || this.constructor !== P) {
    return new P(a);
  }
  let c = "undefined" !== typeof self ? self._factory : "undefined" !== typeof window ? window._factory : null;
  c && (c = c.toString());
  const d = "undefined" === typeof window, e = this, f = ra(c, d, a.worker);
  return f.then ? f.then(function(g) {
    return b.call(e, g);
  }) : b.call(this, f);
}
Q("add");
Q("append");
Q("search");
Q("update");
Q("remove");
Q("clear");
Q("export");
Q("import");
la(P.prototype);
function Q(a) {
  P.prototype[a] = function() {
    const b = this, c = [].slice.call(arguments);
    var d = c[c.length - 1];
    let e;
    "function" === typeof d && (e = d, c.pop());
    d = new Promise(function(f) {
      "export" === a && "function" === typeof c[0] && (c[0] = null);
      b.h[++O] = f;
      b.worker.postMessage({task:a, id:O, args:c});
    });
    return e ? (d.then(e), this) : d;
  };
}
function ra(a, b, c) {
  return b ? "undefined" !== typeof module ? new(require("worker_threads")["Worker"])(__dirname+"/node/node.js") : import("worker_threads").then(function(worker){return new worker["Worker"]((1,eval)("import.meta.dirname")+"/node/node.mjs")}) : a ? new window.Worker(URL.createObjectURL(new Blob(["onmessage=" + ka.toString()], {type:"text/javascript"}))) : new window.Worker("string" === typeof c ? c : (0,eval)("import.meta.url").replace("/worker.js", "/worker/worker.js").replace("flexsearch.bundle.module.min.js", 
  "module/worker/worker.js"), {type:"module"});
}
;function sa(a, b = 0) {
  let c = [], d = [];
  b && (b = 250000 / b * 5000 | 0);
  for (const e of a.entries()) {
    d.push(e), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function ta(a, b) {
  b || (b = new Map());
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b.set(d[0], d[1]);
  }
  return b;
}
function ua(a, b = 0) {
  let c = [], d = [];
  b && (b = 250000 / b * 1000 | 0);
  for (const e of a.entries()) {
    d.push([e[0], sa(e[1])[0]]), d.length === b && (c.push(d), d = []);
  }
  d.length && c.push(d);
  return c;
}
function va(a, b) {
  b || (b = new Map());
  for (let c = 0, d, e; c < a.length; c++) {
    d = a[c], e = b.get(d[0]), b.set(d[0], ta(d[1], e));
  }
  return b;
}
function wa(a) {
  let b = [], c = [];
  for (const d of a.keys()) {
    c.push(d), 250000 === c.length && (b.push(c), c = []);
  }
  c.length && b.push(c);
  return b;
}
function xa(a, b) {
  b || (b = new Set());
  for (let c = 0; c < a.length; c++) {
    b.add(a[c]);
  }
  return b;
}
function ya(a, b, c, d, e, f, g = 0) {
  const h = d && d.constructor === Array;
  var k = h ? d.shift() : d;
  if (!k) {
    return this.export(a, b, e, f + 1);
  }
  if ((k = a((b ? b + "." : "") + (g + 1) + "." + c, JSON.stringify(k))) && k.then) {
    const l = this;
    return k.then(function() {
      return ya.call(l, a, b, c, h ? d : null, e, f, g + 1);
    });
  }
  return ya.call(this, a, b, c, h ? d : null, e, f, g + 1);
}
function za(a, b) {
  let c = "";
  for (const d of a.entries()) {
    a = d[0];
    const e = d[1];
    let f = "";
    for (let g = 0, h; g < e.length; g++) {
      h = e[g] || [""];
      let k = "";
      for (let l = 0; l < h.length; l++) {
        k += (k ? "," : "") + ("string" === b ? '"' + h[l] + '"' : h[l]);
      }
      k = "[" + k + "]";
      f += (f ? "," : "") + k;
    }
    f = '["' + a + '",[' + f + "]]";
    c += (c ? "," : "") + f;
  }
  return c;
}
;function Aa(a, b, c, d) {
  let e = [];
  for (let f = 0, g; f < a.index.length; f++) {
    if (g = a.index[f], b >= g.length) {
      b -= g.length;
    } else {
      b = g[d ? "splice" : "slice"](b, c);
      const h = b.length;
      if (h && (e = e.length ? e.concat(b) : b, c -= h, d && (a.length -= h), !c)) {
        break;
      }
      b = 0;
    }
  }
  return e;
}
function R(a) {
  if (!this || this.constructor !== R) {
    return new R(a);
  }
  this.index = a ? [a] : [];
  this.length = a ? a.length : 0;
  const b = this;
  return new Proxy([], {get(c, d) {
    if ("length" === d) {
      return b.length;
    }
    if ("push" === d) {
      return function(e) {
        b.index[b.index.length - 1].push(e);
        b.length++;
      };
    }
    if ("pop" === d) {
      return function() {
        if (b.length) {
          return b.length--, b.index[b.index.length - 1].pop();
        }
      };
    }
    if ("indexOf" === d) {
      return function(e) {
        let f = 0;
        for (let g = 0, h, k; g < b.index.length; g++) {
          h = b.index[g];
          k = h.indexOf(e);
          if (0 <= k) {
            return f + k;
          }
          f += h.length;
        }
        return -1;
      };
    }
    if ("includes" === d) {
      return function(e) {
        for (let f = 0; f < b.index.length; f++) {
          if (b.index[f].includes(e)) {
            return !0;
          }
        }
        return !1;
      };
    }
    if ("slice" === d) {
      return function(e, f) {
        return Aa(b, e || 0, f || b.length, !1);
      };
    }
    if ("splice" === d) {
      return function(e, f) {
        return Aa(b, e || 0, f || b.length, !0);
      };
    }
    if ("constructor" === d) {
      return Array;
    }
    if ("symbol" !== typeof d) {
      return (c = b.index[d / 2 ** 31 | 0]) && c[d];
    }
  }, set(c, d, e) {
    c = d / 2 ** 31 | 0;
    (b.index[c] || (b.index[c] = []))[d] = e;
    b.length++;
    return !0;
  }});
}
R.prototype.clear = function() {
  this.index.length = 0;
};
R.prototype.destroy = function() {
  this.proxy = this.index = null;
};
R.prototype.push = function() {
};
function S(a = 8) {
  if (!this || this.constructor !== S) {
    return new S(a);
  }
  this.index = A();
  this.h = [];
  this.size = 0;
  32 < a ? (this.B = Ba, this.A = BigInt(a)) : (this.B = Ca, this.A = a);
}
S.prototype.get = function(a) {
  const b = this.index[this.B(a)];
  return b && b.get(a);
};
S.prototype.set = function(a, b) {
  var c = this.B(a);
  let d = this.index[c];
  d ? (c = d.size, d.set(a, b), (c -= d.size) && this.size++) : (this.index[c] = d = new Map([[a, b]]), this.h.push(d), this.size++);
};
function T(a = 8) {
  if (!this || this.constructor !== T) {
    return new T(a);
  }
  this.index = A();
  this.h = [];
  this.size = 0;
  32 < a ? (this.B = Ba, this.A = BigInt(a)) : (this.B = Ca, this.A = a);
}
T.prototype.add = function(a) {
  var b = this.B(a);
  let c = this.index[b];
  c ? (b = c.size, c.add(a), (b -= c.size) && this.size++) : (this.index[b] = c = new Set([a]), this.h.push(c), this.size++);
};
u = S.prototype;
u.has = T.prototype.has = function(a) {
  const b = this.index[this.B(a)];
  return b && b.has(a);
};
u.delete = T.prototype.delete = function(a) {
  const b = this.index[this.B(a)];
  b && b.delete(a) && this.size--;
};
u.clear = T.prototype.clear = function() {
  this.index = A();
  this.h = [];
  this.size = 0;
};
u.values = T.prototype.values = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].values()) {
      yield b;
    }
  }
};
u.keys = T.prototype.keys = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].keys()) {
      yield b;
    }
  }
};
u.entries = T.prototype.entries = function*() {
  for (let a = 0; a < this.h.length; a++) {
    for (let b of this.h[a].entries()) {
      yield b;
    }
  }
};
function Ca(a) {
  let b = 2 ** this.A - 1;
  if ("number" == typeof a) {
    return a & b;
  }
  let c = 0, d = this.A + 1;
  for (let e = 0; e < a.length; e++) {
    c = (c * d ^ a.charCodeAt(e)) & b;
  }
  return 32 === this.A ? c + 2 ** 31 : c;
}
function Ba(a) {
  let b = BigInt(2) ** this.A - BigInt(1);
  var c = typeof a;
  if ("bigint" === c) {
    return a & b;
  }
  if ("number" === c) {
    return BigInt(a) & b;
  }
  c = BigInt(0);
  let d = this.A + BigInt(1);
  for (let e = 0; e < a.length; e++) {
    c = (c * d ^ BigInt(a.charCodeAt(e))) & b;
  }
  return c;
}
;U.prototype.add = function(a, b, c) {
  aa(a) && (b = a, a = ca(b, this.key));
  if (b && (a || 0 === a)) {
    if (!c && this.reg.has(a)) {
      return this.update(a, b);
    }
    for (let h = 0, k; h < this.field.length; h++) {
      k = this.F[h];
      var d = this.index.get(this.field[h]);
      if ("function" === typeof k) {
        var e = k(b);
        e && d.add(a, e, !1, !0);
      } else {
        if (e = k.I, !e || e(b)) {
          k.constructor === String ? k = ["" + k] : D(k) && (k = [k]), Da(b, k, this.J, 0, d, a, k[0], c);
        }
      }
    }
    if (this.tag) {
      for (d = 0; d < this.D.length; d++) {
        var f = this.D[d], g = this.R[d];
        e = this.tag.get(g);
        let h = A();
        if ("function" === typeof f) {
          if (f = f(b), !f) {
            continue;
          }
        } else {
          const k = f.I;
          if (k && !k(b)) {
            continue;
          }
          f.constructor === String && (f = "" + f);
          f = ca(b, f);
        }
        if (e && f) {
          D(f) && (f = [f]);
          for (let k = 0, l, m; k < f.length; k++) {
            if (l = f[k], !h[l] && (h[l] = 1, (g = e.get(l)) ? m = g : e.set(l, m = []), !c || !m.includes(a))) {
              if (m.length === 2 ** 31 - 1) {
                g = new R(m);
                if (this.fastupdate) {
                  for (let n of this.reg.values()) {
                    n.includes(m) && (n[n.indexOf(m)] = g);
                  }
                }
                e.set(l, m = g);
              }
              m.push(a);
              this.fastupdate && ((g = this.reg.get(a)) ? g.push(m) : this.reg.set(a, [m]));
            }
          }
        } else {
          e || console.warn("Tag '" + g + "' was not found");
        }
      }
    }
    if (this.store && (!c || !this.store.has(a))) {
      let h;
      if (this.C) {
        h = A();
        for (let k = 0, l; k < this.C.length; k++) {
          l = this.C[k];
          if ((c = l.I) && !c(b)) {
            continue;
          }
          let m;
          if ("function" === typeof l) {
            m = l(b);
            if (!m) {
              continue;
            }
            l = [l.V];
          } else if (D(l) || l.constructor === String) {
            h[l] = b[l];
            continue;
          }
          Ea(b, h, l, 0, l[0], m);
        }
      }
      this.store.set(a, h || b);
    }
    this.worker && (this.fastupdate || this.reg.add(a));
  }
  return this;
};
function Ea(a, b, c, d, e, f) {
  a = a[e];
  if (d === c.length - 1) {
    b[e] = f || a;
  } else if (a) {
    if (a.constructor === Array) {
      for (b = b[e] = Array(a.length), e = 0; e < a.length; e++) {
        Ea(a, b, c, d, e);
      }
    } else {
      b = b[e] || (b[e] = A()), e = c[++d], Ea(a, b, c, d, e);
    }
  }
}
function Da(a, b, c, d, e, f, g, h) {
  if (a = a[g]) {
    if (d === b.length - 1) {
      if (a.constructor === Array) {
        if (c[d]) {
          for (b = 0; b < a.length; b++) {
            e.add(f, a[b], !0, !0);
          }
          return;
        }
        a = a.join(" ");
      }
      e.add(f, a, h, !0);
    } else {
      if (a.constructor === Array) {
        for (g = 0; g < a.length; g++) {
          Da(a, b, c, d, e, f, g, h);
        }
      } else {
        g = b[++d], Da(a, b, c, d, e, f, g, h);
      }
    }
  } else {
    e.db && e.remove(f);
  }
}
;function Fa(a, b, c, d, e, f, g) {
  const h = a.length;
  let k = [], l, m;
  l = A();
  for (let n = 0, p, r, q, t; n < b; n++) {
    for (let v = 0; v < h; v++) {
      if (q = a[v], n < q.length && (p = q[n])) {
        for (let w = 0; w < p.length; w++) {
          r = p[w];
          (m = l[r]) ? l[r]++ : (m = 0, l[r] = 1);
          t = k[m] || (k[m] = []);
          if (!g) {
            let x = n + (v || !e ? 0 : f || 0);
            t = t[x] || (t[x] = []);
          }
          t.push(r);
          if (g && c && m === h - 1 && t.length - d === c) {
            return d ? t.slice(d) : t;
          }
        }
      }
    }
  }
  if (a = k.length) {
    if (e) {
      k = 1 < k.length ? Ga(k, c, d, g, f) : (k = k[0]).length > c || d ? k.slice(d, c + d) : k;
    } else {
      if (a < h) {
        return [];
      }
      k = k[a - 1];
      if (c || d) {
        if (g) {
          if (k.length > c || d) {
            k = k.slice(d, c + d);
          }
        } else {
          e = [];
          for (let n = 0, p; n < k.length; n++) {
            if (p = k[n], p.length > d) {
              d -= p.length;
            } else {
              if (p.length > c || d) {
                p = p.slice(d, c + d), c -= p.length, d && (d -= p.length);
              }
              e.push(p);
              if (!c) {
                break;
              }
            }
          }
          k = 1 < e.length ? [].concat.apply([], e) : e[0];
        }
      }
    }
  }
  return k;
}
function Ga(a, b, c, d, e) {
  const f = [], g = A();
  let h;
  var k = a.length;
  let l;
  if (d) {
    for (e = k - 1; 0 <= e; e--) {
      if (l = (d = a[e]) && d.length) {
        for (k = 0; k < l; k++) {
          if (h = d[k], !g[h]) {
            if (g[h] = 1, c) {
              c--;
            } else {
              if (f.push(h), f.length === b) {
                return f;
              }
            }
          }
        }
      }
    }
  } else {
    for (let m = k - 1, n, p = 0; 0 <= m; m--) {
      n = a[m];
      for (let r = 0; r < n.length; r++) {
        if (l = (d = n[r]) && d.length) {
          for (let q = 0; q < l; q++) {
            if (h = d[q], !g[h]) {
              if (g[h] = 1, c) {
                c--;
              } else {
                let t = (r + (m < k - 1 ? e || 0 : 0)) / (m + 1) | 0;
                (f[t] || (f[t] = [])).push(h);
                if (++p === b) {
                  return f;
                }
              }
            }
          }
        }
      }
    }
  }
  return f;
}
function Ha(a, b, c) {
  const d = A(), e = [];
  for (let f = 0, g; f < b.length; f++) {
    g = b[f];
    for (let h = 0; h < g.length; h++) {
      d[g[h]] = 1;
    }
  }
  if (c) {
    for (let f = 0, g; f < a.length; f++) {
      g = a[f], d[g] && (e.push(g), d[g] = 0);
    }
  } else {
    for (let f = 0, g, h; f < a.result.length; f++) {
      for (g = a.result[f], b = 0; b < g.length; b++) {
        h = g[b], d[h] && ((e[f] || (e[f] = [])).push(h), d[h] = 0);
      }
    }
  }
  return e;
}
;function Ia(a, b, c, d) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = c || a.length > b ? b ? a.slice(c, c + b) : a.slice(c) : a, d ? V.call(this, a) : a;
  }
  let e = [];
  for (let f = 0, g, h; f < a.length; f++) {
    if ((g = a[f]) && (h = g.length)) {
      if (c) {
        if (c >= h) {
          c -= h;
          continue;
        }
        c < h && (g = b ? g.slice(c, c + b) : g.slice(c), h = g.length, c = 0);
      }
      h > b && (g = g.slice(0, b), h = b);
      if (!e.length && h >= b) {
        return d ? V.call(this, g) : g;
      }
      e.push(g);
      b -= h;
      if (!b) {
        break;
      }
    }
  }
  e = 1 < e.length ? [].concat.apply([], e) : e[0];
  return d ? V.call(this, e) : e;
}
;function Ja(a, b, c) {
  var d = c[0];
  if (d.then) {
    return Promise.all(c).then(function(m) {
      return a[b].apply(a, m);
    });
  }
  if (d[0] && d[0].index) {
    return a[b].apply(a, d);
  }
  d = [];
  let e = [], f = 0, g = 0, h, k, l;
  for (let m = 0, n; m < c.length; m++) {
    if (n = c[m]) {
      let p;
      if (n.constructor === W) {
        p = n.result;
      } else if (n.constructor === Array) {
        p = n;
      } else {
        if (f = n.limit || 0, g = n.offset || 0, l = n.suggest, k = n.resolve, h = n.enrich && k, n.index) {
          n.resolve = !1, n.enrich = !1, p = n.index.search(n).result, n.resolve = k, n.enrich = h;
        } else if (n.and) {
          p = a.and(n.and);
        } else if (n.or) {
          p = a.or(n.or);
        } else if (n.xor) {
          p = a.xor(n.xor);
        } else if (n.not) {
          p = a.not(n.not);
        } else {
          continue;
        }
      }
      if (p.then) {
        e.push(p);
      } else if (p.length) {
        d[m] = p;
      } else if (!l && ("and" === b || "xor" === b)) {
        d = [];
        break;
      }
    }
  }
  return {O:d, P:e, limit:f, offset:g, enrich:h, resolve:k, suggest:l};
}
;W.prototype.or = function() {
  const {O:a, P:b, limit:c, offset:d, enrich:e, resolve:f} = Ja(this, "or", arguments);
  return Ka.call(this, a, b, c, d, e, f);
};
function Ka(a, b, c, d, e, f) {
  if (b.length) {
    const g = this;
    return Promise.all(b).then(function(h) {
      a = [];
      for (let k = 0, l; k < h.length; k++) {
        (l = h[k]).length && (a[k] = l);
      }
      return Ka.call(g, a, [], c, d, e, f);
    });
  }
  a.length && (this.result.length && a.push(this.result), 2 > a.length ? this.result = a[0] : (this.result = Ga(a, c, d, !1, this.h), d = 0));
  return f ? this.resolve(c, d, e) : this;
}
;W.prototype.and = function() {
  let a = this.result.length, b, c, d, e;
  if (!a) {
    const f = arguments[0];
    f && (a = !!f.suggest, e = f.resolve, b = f.limit, c = f.offset, d = f.enrich && e);
  }
  if (a) {
    const {O:f, P:g, limit:h, offset:k, enrich:l, resolve:m, suggest:n} = Ja(this, "and", arguments);
    return La.call(this, f, g, h, k, l, m, n);
  }
  return e ? this.resolve(b, c, d) : this;
};
function La(a, b, c, d, e, f, g) {
  if (b.length) {
    const h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return La.call(h, a, [], c, d, e, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      if (b = da(a)) {
        return this.result = Fa(a, b, c, d, g, this.h, f), f ? e ? V.call(this.index, this.result) : this.result : this;
      }
      this.result = [];
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, d, e) : this;
}
;W.prototype.xor = function() {
  const {O:a, P:b, limit:c, offset:d, enrich:e, resolve:f, suggest:g} = Ja(this, "xor", arguments);
  return Ma.call(this, a, b, c, d, e, f, g);
};
function Ma(a, b, c, d, e, f, g) {
  if (b.length) {
    const h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Ma.call(h, a, [], c, d, e, f, g);
    });
  }
  if (a.length) {
    if (this.result.length && a.unshift(this.result), 2 > a.length) {
      this.result = a[0];
    } else {
      return this.result = Na.call(this, a, c, d, f, this.h), f ? e ? V.call(this.index, this.result) : this.result : this;
    }
  } else {
    g || (this.result = a);
  }
  return f ? this.resolve(c, d, e) : this;
}
function Na(a, b, c, d, e) {
  const f = [], g = A();
  let h = 0;
  for (let k = 0, l; k < a.length; k++) {
    if (l = a[k]) {
      h < l.length && (h = l.length);
      for (let m = 0, n; m < l.length; m++) {
        if (n = l[m]) {
          for (let p = 0, r; p < n.length; p++) {
            r = n[p], g[r] = g[r] ? 2 : 1;
          }
        }
      }
    }
  }
  for (let k = 0, l, m = 0; k < h; k++) {
    for (let n = 0, p; n < a.length; n++) {
      if (p = a[n]) {
        if (l = p[k]) {
          for (let r = 0, q; r < l.length; r++) {
            if (q = l[r], 1 === g[q]) {
              if (c) {
                c--;
              } else {
                if (d) {
                  if (f.push(q), f.length === b) {
                    return f;
                  }
                } else {
                  const t = k + (n ? e : 0);
                  f[t] || (f[t] = []);
                  f[t].push(q);
                  if (++m === b) {
                    return f;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return f;
}
;W.prototype.not = function() {
  const {O:a, P:b, limit:c, offset:d, enrich:e, resolve:f, suggest:g} = Ja(this, "not", arguments);
  return Oa.call(this, a, b, c, d, e, f, g);
};
function Oa(a, b, c, d, e, f, g) {
  if (b.length) {
    const h = this;
    return Promise.all(b).then(function(k) {
      a = [];
      for (let l = 0, m; l < k.length; l++) {
        (m = k[l]).length && (a[l] = m);
      }
      return Oa.call(h, a, [], c, d, e, f, g);
    });
  }
  if (a.length && this.result.length) {
    this.result = Pa.call(this, a, c, d, f);
  } else if (f) {
    return this.resolve(c, d, e);
  }
  return f ? e ? V.call(this.index, this.result) : this.result : this;
}
function Pa(a, b, c, d) {
  const e = [];
  a = new Set(a.flat().flat());
  for (let f = 0, g, h = 0; f < this.result.length; f++) {
    if (g = this.result[f]) {
      for (let k = 0, l; k < g.length; k++) {
        if (l = g[k], !a.has(l)) {
          if (c) {
            c--;
          } else {
            if (d) {
              if (e.push(l), e.length === b) {
                return e;
              }
            } else {
              if (e[f] || (e[f] = []), e[f].push(l), ++h === b) {
                return e;
              }
            }
          }
        }
      }
    }
  }
  return e;
}
;function W(a) {
  if (!this || this.constructor !== W) {
    return new W(a);
  }
  if (a && a.index) {
    return a.resolve = !1, this.index = a.index, this.h = a.boost || 0, this.result = a.index.search(a).result, this;
  }
  this.index = null;
  this.result = a || [];
  this.h = 0;
}
W.prototype.limit = function(a) {
  if (this.result.length) {
    const b = [];
    for (let c = 0, d; c < this.result.length; c++) {
      if (d = this.result[c]) {
        if (d.length <= a) {
          if (b[c] = d, a -= d.length, !a) {
            break;
          }
        } else {
          b[c] = d.slice(0, a);
          break;
        }
      }
    }
    this.result = b;
  }
  return this;
};
W.prototype.offset = function(a) {
  if (this.result.length) {
    const b = [];
    for (let c = 0, d; c < this.result.length; c++) {
      if (d = this.result[c]) {
        d.length <= a ? a -= d.length : (b[c] = d.slice(a), a = 0);
      }
    }
    this.result = b;
  }
  return this;
};
W.prototype.boost = function(a) {
  this.h += a;
  return this;
};
W.prototype.resolve = function(a, b, c) {
  const d = this.result, e = this.index;
  this.result = this.index = null;
  return d.length ? ("object" === typeof a && (c = a.enrich, b = a.offset, a = a.limit), Ia.call(e, d, a || 100, b, c)) : d;
};
A();
U.prototype.search = function(a, b, c, d) {
  c || (!b && aa(a) ? (c = a, a = "") : aa(b) && (c = b, b = 0));
  let e = [];
  var f = [];
  let g;
  var h;
  let k;
  let l, m;
  let n = 0;
  var p = !0;
  let r;
  if (c) {
    c.constructor === Array && (c = {index:c});
    a = c.query || a;
    g = c.pluck;
    k = c.merge;
    l = g || c.field || (l = c.index) && (l.index ? null : l);
    m = this.tag && c.tag;
    var q = c.suggest;
    p = !1 !== c.resolve;
    if (!p && !g) {
      if (l = l || this.field) {
        D(l) ? g = l : (l.constructor === Array && 1 === l.length && (l = l[0]), g = l.field || l.index);
      }
      if (!g) {
        throw Error("Apply resolver on document search requires either the option 'pluck' to be set or just select a single field name in your query.");
      }
    }
    this.store && c.enrich && !p && console.warn("Enrich results can only be done on a final resolver task or when calling .resolve({ enrich: true })");
    r = (h = this.store && c.enrich && p) && c.highlight;
    b = c.limit || b;
    var t = c.offset || 0;
    b || (b = 100);
    if (m && (!this.db || !d)) {
      m.constructor !== Array && (m = [m]);
      var v = [];
      for (let B = 0, y; B < m.length; B++) {
        y = m[B];
        if (D(y)) {
          throw Error("A tag option can't be a string, instead it needs a { field: tag } format.");
        }
        if (y.field && y.tag) {
          var w = y.tag;
          if (w.constructor === Array) {
            for (var x = 0; x < w.length; x++) {
              v.push(y.field, w[x]);
            }
          } else {
            v.push(y.field, w);
          }
        } else {
          w = Object.keys(y);
          for (let C = 0, M, E; C < w.length; C++) {
            if (M = w[C], E = y[M], E.constructor === Array) {
              for (x = 0; x < E.length; x++) {
                v.push(M, E[x]);
              }
            } else {
              v.push(M, E);
            }
          }
        }
      }
      if (!v.length) {
        throw Error("Your tag definition within the search options is probably wrong. No valid tags found.");
      }
      m = v;
      if (!a) {
        p = [];
        if (v.length) {
          for (f = 0; f < v.length; f += 2) {
            if (this.db) {
              q = this.index.get(v[f]);
              if (!q) {
                console.warn("Tag '" + v[f] + ":" + v[f + 1] + "' will be skipped because there is no field '" + v[f] + "'.");
                continue;
              }
              p.push(q = q.db.tag(v[f + 1], b, t, h));
            } else {
              q = Qa.call(this, v[f], v[f + 1], b, t, h);
            }
            e.push({field:v[f], tag:v[f + 1], result:q});
          }
        }
        return p.length ? Promise.all(p).then(function(B) {
          for (let y = 0; y < B.length; y++) {
            e[y].result = B[y];
          }
          return e;
        }) : e;
      }
    }
    l && l.constructor !== Array && (l = [l]);
  }
  l || (l = this.field);
  v = !d && (this.worker || this.db) && [];
  let F;
  for (let B = 0, y, C, M; B < l.length; B++) {
    C = l[B];
    if (this.db && this.tag && !this.F[B]) {
      continue;
    }
    let E;
    D(C) || (E = C, C = E.field, a = E.query || a, b = E.limit || b, t = E.offset || t, q = E.suggest || q, h = this.store && (E.enrich || h));
    if (d) {
      y = d[B];
    } else {
      if (w = E || c, x = this.index.get(C), m && (this.db && (w.tag = m, F = x.db.support_tag_search, w.field = l), F || (w.enrich = !1)), v) {
        v[B] = x.search(a, b, w);
        w && h && (w.enrich = h);
        continue;
      } else {
        y = x.search(a, b, w), w && h && (w.enrich = h);
      }
    }
    M = y && (p ? y.length : y.result.length);
    if (m && M) {
      w = [];
      x = 0;
      if (this.db && d) {
        if (!F) {
          for (let J = l.length; J < d.length; J++) {
            let K = d[J];
            if (K && K.length) {
              x++, w.push(K);
            } else if (!q) {
              return p ? e : new W(e);
            }
          }
        }
      } else {
        for (let J = 0, K, rb; J < m.length; J += 2) {
          K = this.tag.get(m[J]);
          if (!K) {
            if (console.warn("Tag '" + m[J] + ":" + m[J + 1] + "' will be skipped because there is no field '" + m[J] + "'."), q) {
              continue;
            } else {
              return p ? e : new W(e);
            }
          }
          if (rb = (K = K && K.get(m[J + 1])) && K.length) {
            x++, w.push(K);
          } else if (!q) {
            return p ? e : new W(e);
          }
        }
      }
      if (x) {
        y = Ha(y, w, p);
        M = y.length;
        if (!M && !q) {
          return p ? y : new W(y);
        }
        x--;
      }
    }
    if (M) {
      f[n] = C, e.push(y), n++;
    } else if (1 === l.length) {
      return p ? e : new W(e);
    }
  }
  if (v) {
    if (this.db && m && m.length && !F) {
      for (h = 0; h < m.length; h += 2) {
        f = this.index.get(m[h]);
        if (!f) {
          if (console.warn("Tag '" + m[h] + ":" + m[h + 1] + "' was not found because there is no field '" + m[h] + "'."), q) {
            continue;
          } else {
            return p ? e : new W(e);
          }
        }
        v.push(f.db.tag(m[h + 1], b, t, !1));
      }
    }
    const B = this;
    return Promise.all(v).then(function(y) {
      return y.length ? B.search(a, b, c, y) : y;
    });
  }
  if (!n) {
    return p ? e : new W(e);
  }
  if (g && (!h || !this.store)) {
    return e[0];
  }
  v = [];
  for (t = 0; t < f.length; t++) {
    q = e[t];
    h && q.length && "undefined" === typeof q[0].doc && (this.db ? v.push(q = this.index.get(this.field[0]).db.enrich(q)) : q = V.call(this, q));
    if (g) {
      return p ? r ? Ra(a, q, this.index, g, r) : q : new W(q);
    }
    e[t] = {field:f[t], result:q};
  }
  if (h && this.db && v.length) {
    const B = this;
    return Promise.all(v).then(function(y) {
      for (let C = 0; C < y.length; C++) {
        e[C].result = y[C];
      }
      return k ? Sa(e) : r ? Ra(a, e, B.index, g, r) : e;
    });
  }
  return k ? Sa(e) : r ? Ra(a, e, this.index, g, r) : e;
};
function Ra(a, b, c, d, e) {
  let f, g;
  for (let k = 0, l, m, n; k < b.length; k++) {
    let p;
    if (d) {
      p = b, n = d;
    } else {
      var h = b[k];
      n = h.field;
      if (!n) {
        continue;
      }
      p = h.result;
    }
    m = c.get(n);
    l = m.encoder;
    h = m.tokenize;
    l !== f && (f = l, g = f.encode(a));
    for (let r = 0; r < p.length; r++) {
      let q = "", t = ca(p[r].doc, n).split(/\s+/);
      for (let v = 0, w, x; v < t.length; v++) {
        w = t[v];
        x = l.encode(w);
        x = 1 < x.length ? x.join(" ") : x[0];
        let F;
        if (x && w) {
          for (let B = 0, y; B < g.length; B++) {
            if (y = g[B], "strict" === h) {
              if (x === y) {
                q += (q ? " " : "") + e.replace("$1", w);
                F = !0;
                break;
              }
            } else {
              const C = x.indexOf(y);
              if (-1 < C) {
                q += (q ? " " : "") + w.substring(0, C) + e.replace("$1", w.substring(C, C + y.length)) + w.substring(C + y.length);
                F = !0;
                break;
              }
            }
          }
        }
        F || (q += (q ? " " : "") + t[v]);
      }
      p[r].highlight = q;
    }
    if (d) {
      break;
    }
  }
  return b;
}
function Sa(a) {
  const b = [], c = A();
  for (let d = 0, e, f; d < a.length; d++) {
    e = a[d];
    f = e.result;
    for (let g = 0, h, k, l; g < f.length; g++) {
      k = f[g], "object" !== typeof k && (k = {id:k}), h = k.id, (l = c[h]) ? l.push(e.field) : (k.field = c[h] = [e.field], b.push(k));
    }
  }
  return b;
}
function Qa(a, b, c, d, e) {
  let f = this.tag.get(a);
  if (!f) {
    return console.warn("Tag '" + a + "' was not found"), [];
  }
  if ((a = (f = f && f.get(b)) && f.length - d) && 0 < a) {
    if (a > c || d) {
      f = f.slice(d, d + c);
    }
    e && (f = V.call(this, f));
    return f;
  }
}
function V(a) {
  if (!this || !this.store) {
    return a;
  }
  const b = Array(a.length);
  for (let c = 0, d; c < a.length; c++) {
    d = a[c], b[c] = {id:d, doc:this.store.get(d)};
  }
  return b;
}
;function U(a) {
  if (!this || this.constructor !== U) {
    return new U(a);
  }
  const b = a.document || a.doc || a;
  let c, d;
  this.F = [];
  this.field = [];
  this.J = [];
  this.key = (c = b.key || b.id) && Ta(c, this.J) || "id";
  (d = a.keystore || 0) && (this.keystore = d);
  this.fastupdate = !!a.fastupdate;
  this.reg = !this.fastupdate || a.worker || a.db ? d ? new T(d) : new Set() : d ? new S(d) : new Map();
  this.C = (c = b.store || null) && c && !0 !== c && [];
  this.store = c && (d ? new S(d) : new Map());
  this.cache = (c = a.cache || null) && new X(c);
  a.cache = !1;
  this.worker = a.worker || !1;
  this.priority = a.priority || 4;
  this.index = Ua.call(this, a, b);
  this.tag = null;
  if (c = b.tag) {
    if ("string" === typeof c && (c = [c]), c.length) {
      this.tag = new Map();
      this.D = [];
      this.R = [];
      for (let e = 0, f, g; e < c.length; e++) {
        f = c[e];
        g = f.field || f;
        if (!g) {
          throw Error("The tag field from the document descriptor is undefined.");
        }
        f.custom ? this.D[e] = f.custom : (this.D[e] = Ta(g, this.J), f.filter && ("string" === typeof this.D[e] && (this.D[e] = new String(this.D[e])), this.D[e].I = f.filter));
        this.R[e] = g;
        this.tag.set(g, new Map());
      }
    }
  }
  if (this.worker) {
    this.fastupdate = !1;
    const e = [];
    for (const f of this.index.values()) {
      f.then && e.push(f);
    }
    if (e.length) {
      const f = this;
      return Promise.all(e).then(function(g) {
        const h = new Map();
        let k = 0;
        for (const m of f.index.entries()) {
          const n = m[0];
          var l = m[1];
          if (l.then) {
            l = e[k].encoder || {};
            let p = h.get(l);
            p || (p = l.encode ? l : new G(l), h.set(l, p));
            l = g[k];
            l.encoder = p;
            f.index.set(n, l);
            k++;
          }
        }
        return f;
      });
    }
  } else {
    a.db && (this.fastupdate = !1, this.mount(a.db));
  }
}
u = U.prototype;
u.mount = function(a) {
  if (this.worker) {
    throw Error("You can't use Worker-Indexes on a persistent model. That would be useless, since each of the persistent model acts like Worker-Index by default (Master/Slave).");
  }
  let b = this.field;
  if (this.tag) {
    for (let f = 0, g; f < this.R.length; f++) {
      g = this.R[f];
      var c = void 0;
      this.index.set(g, c = new N({}, this.reg));
      b === this.field && (b = b.slice(0));
      b.push(g);
      c.tag = this.tag.get(g);
    }
  }
  c = [];
  const d = {db:a.db, type:a.type, fastupdate:a.fastupdate};
  for (let f = 0, g, h; f < b.length; f++) {
    d.field = h = b[f];
    g = this.index.get(h);
    const k = new a.constructor(a.id, d);
    k.id = a.id;
    c[f] = k.mount(g);
    g.document = !0;
    f ? g.bypass = !0 : g.store = this.store;
  }
  const e = this;
  return this.db = Promise.all(c).then(function() {
    e.db = !0;
  });
};
u.commit = async function(a, b) {
  const c = [];
  for (const d of this.index.values()) {
    c.push(d.commit(a, b));
  }
  await Promise.all(c);
  this.reg.clear();
};
u.destroy = function() {
  const a = [];
  for (const b of this.index.values()) {
    a.push(b.destroy());
  }
  return Promise.all(a);
};
function Ua(a, b) {
  const c = new Map();
  let d = b.index || b.field || b;
  D(d) && (d = [d]);
  for (let e = 0, f, g; e < d.length; e++) {
    f = d[e];
    D(f) || (g = f, f = f.field);
    g = aa(g) ? Object.assign({}, a, g) : a;
    if (this.worker) {
      const h = new P(g);
      h.encoder = g.encoder;
      c.set(f, h);
    }
    this.worker || c.set(f, new N(g, this.reg));
    g.custom ? this.F[e] = g.custom : (this.F[e] = Ta(f, this.J), g.filter && ("string" === typeof this.F[e] && (this.F[e] = new String(this.F[e])), this.F[e].I = g.filter));
    this.field[e] = f;
  }
  if (this.C) {
    a = b.store;
    D(a) && (a = [a]);
    for (let e = 0, f, g; e < a.length; e++) {
      f = a[e], g = f.field || f, f.custom ? (this.C[e] = f.custom, f.custom.V = g) : (this.C[e] = Ta(g, this.J), f.filter && ("string" === typeof this.C[e] && (this.C[e] = new String(this.C[e])), this.C[e].I = f.filter));
    }
  }
  return c;
}
function Ta(a, b) {
  const c = a.split(":");
  let d = 0;
  for (let e = 0; e < c.length; e++) {
    a = c[e], "]" === a[a.length - 1] && (a = a.substring(0, a.length - 2)) && (b[d] = !0), a && (c[d++] = a);
  }
  d < c.length && (c.length = d);
  return 1 < d ? c : c[0];
}
u.append = function(a, b) {
  return this.add(a, b, !0);
};
u.update = function(a, b) {
  return this.remove(a).add(a, b);
};
u.remove = function(a) {
  aa(a) && (a = ca(a, this.key));
  for (var b of this.index.values()) {
    b.remove(a, !0);
  }
  if (this.reg.has(a)) {
    if (this.tag && !this.fastupdate) {
      for (let c of this.tag.values()) {
        for (let d of c) {
          b = d[0];
          const e = d[1], f = e.indexOf(a);
          -1 < f && (1 < e.length ? e.splice(f, 1) : c.delete(b));
        }
      }
    }
    this.store && this.store.delete(a);
    this.reg.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
u.clear = function() {
  const a = [];
  for (const b of this.index.values()) {
    const c = b.clear();
    c.then && a.push(c);
  }
  if (this.tag) {
    for (const b of this.tag.values()) {
      b.clear();
    }
  }
  this.store && this.store.clear();
  this.cache && this.cache.clear();
  return a.length ? Promise.all(a) : this;
};
u.contain = function(a) {
  return this.db ? this.index.get(this.field[0]).db.has(a) : this.reg.has(a);
};
u.cleanup = function() {
  for (const a of this.index.values()) {
    a.cleanup();
  }
  return this;
};
u.get = function(a) {
  return this.db ? this.index.get(this.field[0]).db.enrich(a).then(function(b) {
    return b[0] && b[0].doc || null;
  }) : this.store.get(a) || null;
};
u.set = function(a, b) {
  "object" === typeof a && (b = a, a = ca(b, this.key));
  this.store.set(a, b);
  return this;
};
u.searchCache = Va;
u.export = function(a, b, c = 0, d = 0) {
  if (c < this.field.length) {
    const g = this.field[c];
    if ((b = this.index.get(g).export(a, g, c, d = 1)) && b.then) {
      const h = this;
      return b.then(function() {
        return h.export(a, g, c + 1);
      });
    }
    return this.export(a, g, c + 1);
  }
  let e, f;
  switch(d) {
    case 0:
      e = "reg";
      f = wa(this.reg);
      b = null;
      break;
    case 1:
      e = "tag";
      f = this.tag && ua(this.tag, this.reg.size);
      b = null;
      break;
    case 2:
      e = "doc";
      f = this.store && sa(this.store);
      b = null;
      break;
    default:
      return;
  }
  return ya.call(this, a, b, e, f, c, d);
};
u.import = function(a, b) {
  var c = a.split(".");
  "json" === c[c.length - 1] && c.pop();
  const d = 2 < c.length ? c[0] : "";
  c = 2 < c.length ? c[2] : c[1];
  if (this.worker && d) {
    return this.index.get(d).import(a);
  }
  if (b) {
    "string" === typeof b && (b = JSON.parse(b));
    if (d) {
      return this.index.get(d).import(c, b);
    }
    switch(c) {
      case "reg":
        this.fastupdate = !1;
        this.reg = xa(b, this.reg);
        for (let e = 0, f; e < this.field.length; e++) {
          f = this.index.get(this.field[e]), f.fastupdate = !1, f.reg = this.reg;
        }
        if (this.worker) {
          b = [];
          for (const e of this.index.values()) {
            b.push(e.import(a));
          }
          return Promise.all(b);
        }
        break;
      case "tag":
        this.tag = va(b, this.tag);
        break;
      case "doc":
        this.store = ta(b, this.store);
    }
  }
};
la(U.prototype);
function Va(a, b, c) {
  const d = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  this.cache || (this.cache = new X());
  let e = this.cache.get(d);
  if (!e) {
    e = this.search(a, b, c);
    if (e.then) {
      const f = this;
      e.then(function(g) {
        f.cache.set(d, g);
        return g;
      });
    }
    this.cache.set(d, e);
  }
  return e;
}
function X(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
X.prototype.set = function(a, b) {
  this.cache.set(this.h = a, b);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
X.prototype.get = function(a) {
  const b = this.cache.get(a);
  b && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, b));
  return b;
};
X.prototype.remove = function(a) {
  for (const b of this.cache) {
    const c = b[0];
    b[1].includes(a) && this.cache.delete(c);
  }
};
X.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const Wa = {normalize:!1, numeric:!1, dedupe:!1};
const Xa = {};
const Ya = new Map([["b", "p"], ["v", "f"], ["w", "f"], ["z", "s"], ["x", "s"], ["d", "t"], ["n", "m"], ["c", "k"], ["g", "k"], ["j", "k"], ["q", "k"], ["i", "e"], ["y", "e"], ["u", "o"]]);
const Za = new Map([["ae", "a"], ["oe", "o"], ["sh", "s"], ["kh", "k"], ["th", "t"], ["ph", "f"], ["pf", "f"]]), $a = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"];
const ab = {a:"", e:"", i:"", o:"", u:"", y:"", b:1, f:1, p:1, v:1, c:2, g:2, j:2, k:2, q:2, s:2, x:2, z:2, "\u00df":2, d:3, t:3, l:4, m:5, n:5, r:6};
var bb = {Exact:Wa, Default:Xa, Normalize:Xa, LatinBalance:{mapper:Ya}, LatinAdvanced:{mapper:Ya, matcher:Za, replacer:$a}, LatinExtra:{mapper:Ya, replacer:$a.concat([/(?!^)[aeo]/g, ""]), matcher:Za}, LatinSoundex:{dedupe:!1, include:{letter:!0}, finalize:function(a) {
  for (let c = 0; c < a.length; c++) {
    var b = a[c];
    let d = b.charAt(0), e = ab[d];
    for (let f = 1, g; f < b.length && (g = b.charAt(f), "h" === g || "w" === g || !(g = ab[g]) || g === e || (d += g, e = g, 4 !== d.length)); f++) {
    }
    a[c] = d;
  }
}}, CJK:{split:""}, LatinExact:Wa, LatinDefault:Xa, LatinSimple:Xa};
N.prototype.remove = function(a, b) {
  const c = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (c) {
    if (this.fastupdate) {
      for (let d = 0, e; d < c.length; d++) {
        if (e = c[d]) {
          if (2 > e.length) {
            e.pop();
          } else {
            const f = e.indexOf(a);
            f === c.length - 1 ? e.pop() : e.splice(f, 1);
          }
        }
      }
    } else {
      cb(this.map, a), this.depth && cb(this.ctx, a);
    }
    b || this.reg.delete(a);
  }
  this.db && (this.commit_task.push({del:a}), this.T && db(this));
  this.cache && this.cache.remove(a);
  return this;
};
function cb(a, b) {
  let c = 0;
  var d = "undefined" === typeof b;
  if (a.constructor === Array) {
    for (let e = 0, f, g; e < a.length; e++) {
      if ((f = a[e]) && f.length) {
        if (d) {
          c++;
        } else {
          if (g = f.indexOf(b), 0 <= g) {
            1 < f.length ? (f.splice(g, 1), c++) : delete a[e];
            break;
          } else {
            c++;
          }
        }
      }
    }
  } else {
    for (let e of a.entries()) {
      d = e[0];
      const f = cb(e[1], b);
      f ? c += f : a.delete(d);
    }
  }
  return c;
}
;const eb = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
N.prototype.add = function(a, b, c, d) {
  if (b && (a || 0 === a)) {
    if (!d && !c && this.reg.has(a)) {
      return this.update(a, b);
    }
    d = this.depth;
    b = this.encoder.encode(b, !d);
    const l = b.length;
    if (l) {
      const m = A(), n = A(), p = this.resolution;
      for (let r = 0; r < l; r++) {
        let q = b[this.rtl ? l - 1 - r : r];
        var e = q.length;
        if (e && (d || !n[q])) {
          var f = this.score ? this.score(b, q, r, null, 0) : fb(p, l, r), g = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (let t = 0, v; t < e; t++) {
                  for (f = e; f > t; f--) {
                    g = q.substring(t, f);
                    v = this.rtl ? e - 1 - t : t;
                    var h = this.score ? this.score(b, q, r, g, v) : fb(p, l, r, e, v);
                    gb(this, n, g, h, a, c);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  g = q[this.rtl ? e - 1 - h : h] + g;
                  var k = this.score ? this.score(b, q, r, g, h) : fb(p, l, r, e, h);
                  gb(this, n, g, k, a, c);
                }
                g = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  g += q[this.rtl ? e - 1 - h : h], gb(this, n, g, f, a, c);
                }
                break;
              }
            default:
              if (gb(this, n, q, f, a, c), d && 1 < l && r < l - 1) {
                for (e = A(), g = this.U, f = q, h = Math.min(d + 1, this.rtl ? r + 1 : l - r), e[f] = 1, k = 1; k < h; k++) {
                  if ((q = b[this.rtl ? l - 1 - r - k : r + k]) && !e[q]) {
                    e[q] = 1;
                    const t = this.score ? this.score(b, f, r, q, k - 1) : fb(g + (l / 2 > g ? 0 : 1), l, r, h - 1, k - 1), v = this.bidirectional && q > f;
                    gb(this, m, v ? f : q, t, a, c, v ? q : f);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.reg.add(a);
    } else {
      b = "";
    }
  }
  this.db && (b || this.commit_task.push({del:a}), this.T && db(this));
  return this;
};
function gb(a, b, c, d, e, f, g) {
  let h = g ? a.ctx : a.map, k;
  if (!b[c] || g && !(k = b[c])[g]) {
    if (g ? (b = k || (b[c] = A()), b[g] = 1, (k = h.get(g)) ? h = k : h.set(g, h = new Map())) : b[c] = 1, (k = h.get(c)) ? h = k : h.set(c, h = k = []), h = h[d] || (h[d] = []), !f || !h.includes(e)) {
      if (h.length === 2 ** 31 - 1) {
        b = new R(h);
        if (a.fastupdate) {
          for (let l of a.reg.values()) {
            l.includes(h) && (l[l.indexOf(h)] = b);
          }
        }
        k[d] = h = b;
      }
      h.push(e);
      a.fastupdate && ((d = a.reg.get(e)) ? d.push(h) : a.reg.set(e, [h]));
    }
  }
}
function fb(a, b, c, d, e) {
  return c && 1 < a ? b + (d || 0) <= a ? c + (e || 0) : (a - 1) / (b + (d || 0)) * (c + (e || 0)) + 1 | 0 : 0;
}
;N.prototype.search = function(a, b, c) {
  c || (b || "object" !== typeof a ? "object" === typeof b && (c = b, b = 0) : (c = a, a = ""));
  let d = [], e, f, g, h = 0, k, l, m, n, p;
  c ? (a = c.query || a, b = c.limit || b, h = c.offset || 0, f = c.context, g = c.suggest, p = (k = !1 !== c.resolve) && c.enrich, m = c.boost, n = c.resolution, l = this.db && c.tag) : k = this.resolve;
  f = this.depth && !1 !== f;
  let r = this.encoder.encode(a, !f);
  e = r.length;
  b = b || (k ? 100 : 0);
  if (1 === e) {
    return hb.call(this, r[0], "", b, h, k, p, l);
  }
  if (2 === e && f && !g) {
    return hb.call(this, r[1], r[0], b, h, k, p, l);
  }
  let q = A(), t = 0, v;
  f && (v = r[0], t = 1);
  n || 0 === n || (n = v ? this.U : this.resolution);
  if (this.db) {
    if (this.db.search && (a = this.db.search(this, r, b, h, g, k, p, l), !1 !== a)) {
      return a;
    }
    const w = this;
    return async function() {
      for (let x, F; t < e; t++) {
        if ((F = r[t]) && !q[F]) {
          q[F] = 1;
          x = await ib(w, F, v, 0, 0, !1, !1);
          if (x = jb(x, d, g, n)) {
            d = x;
            break;
          }
          v && (g && x && d.length || (v = F));
        }
        g && v && t === e - 1 && !d.length && (n = w.resolution, v = "", t = -1, q = A());
      }
      return kb(d, n, b, h, g, m, k);
    }();
  }
  for (let w, x; t < e; t++) {
    if ((x = r[t]) && !q[x]) {
      q[x] = 1;
      w = ib(this, x, v, 0, 0, !1, !1);
      if (w = jb(w, d, g, n)) {
        d = w;
        break;
      }
      v && (g && w && d.length || (v = x));
    }
    g && v && t === e - 1 && !d.length && (n = this.resolution, v = "", t = -1, q = A());
  }
  return kb(d, n, b, h, g, m, k);
};
function kb(a, b, c, d, e, f, g) {
  let h = a.length, k = a;
  if (1 < h) {
    k = Fa(a, b, c, d, e, f, g);
  } else if (1 === h) {
    return g ? Ia.call(null, a[0], c, d) : new W(a[0]);
  }
  return g ? k : new W(k);
}
function hb(a, b, c, d, e, f, g) {
  a = ib(this, a, b, c, d, e, f, g);
  return this.db ? a.then(function(h) {
    return e ? h || [] : new W(h);
  }) : a && a.length ? e ? Ia.call(this, a, c, d) : new W(a) : e ? [] : new W();
}
function jb(a, b, c, d) {
  let e = [];
  if (a && a.length) {
    if (a.length <= d) {
      b.push(a);
      return;
    }
    for (let f = 0, g; f < d; f++) {
      if (g = a[f]) {
        e[f] = g;
      }
    }
    if (e.length) {
      b.push(e);
      return;
    }
  }
  if (!c) {
    return e;
  }
}
function ib(a, b, c, d, e, f, g, h) {
  let k;
  c && (k = a.bidirectional && b > c) && (k = c, c = b, b = k);
  if (a.db) {
    return a.db.get(b, c, d, e, f, g, h);
  }
  a = c ? (a = a.ctx.get(c)) && a.get(b) : a.map.get(b);
  return a;
}
;function N(a, b) {
  if (!this || this.constructor !== N) {
    return new N(a);
  }
  if (a) {
    var c = D(a) ? a : a.preset;
    c && (eb[c] || console.warn("Preset not found: " + c), a = Object.assign({}, eb[c], a));
  } else {
    a = {};
  }
  c = a.context;
  const d = !0 === c ? {depth:1} : c || {}, e = D(a.encoder) ? bb[a.encoder] : a.encode || a.encoder || {};
  this.encoder = e.encode ? e : "object" === typeof e ? new G(e) : {encode:e};
  this.resolution = a.resolution || 9;
  this.tokenize = c = (c = a.tokenize) && "default" !== c && "exact" !== c && c || "strict";
  this.depth = "strict" === c && d.depth || 0;
  this.bidirectional = !1 !== d.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  d && d.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  (c = a.keystore || 0) && (this.keystore = c);
  this.map = c ? new S(c) : new Map();
  this.ctx = c ? new S(c) : new Map();
  this.reg = b || (this.fastupdate ? c ? new S(c) : new Map() : c ? new T(c) : new Set());
  this.U = d.resolution || 3;
  this.rtl = e.rtl || a.rtl || !1;
  this.cache = (c = a.cache || null) && new X(c);
  this.resolve = !1 !== a.resolve;
  if (c = a.db) {
    this.db = this.mount(c);
  }
  this.T = !1 !== a.commit;
  this.commit_task = [];
  this.commit_timer = null;
  this.priority = a.priority || 4;
}
u = N.prototype;
u.mount = function(a) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return a.mount(this);
};
u.commit = function(a, b) {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.commit(this, a, b);
};
u.destroy = function() {
  this.commit_timer && (clearTimeout(this.commit_timer), this.commit_timer = null);
  return this.db.destroy();
};
function db(a) {
  a.commit_timer || (a.commit_timer = setTimeout(function() {
    a.commit_timer = null;
    a.db.commit(a, void 0, void 0);
  }, 1));
}
u.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  this.cache && this.cache.clear();
  this.db && (this.commit_timer && clearTimeout(this.commit_timer), this.commit_timer = null, this.commit_task = [{clear:!0}]);
  return this;
};
u.append = function(a, b) {
  return this.add(a, b, !0);
};
u.contain = function(a) {
  return this.db ? this.db.has(a) : this.reg.has(a);
};
u.update = function(a, b) {
  const c = this, d = this.remove(a);
  return d && d.then ? d.then(() => c.add(a, b)) : this.add(a, b);
};
u.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  cb(this.map);
  this.depth && cb(this.ctx);
  return this;
};
u.searchCache = Va;
u.export = function(a, b, c = 0, d = 0) {
  let e, f;
  switch(d) {
    case 0:
      e = "reg";
      f = wa(this.reg);
      break;
    case 1:
      e = "cfg";
      f = null;
      break;
    case 2:
      e = "map";
      f = sa(this.map, this.reg.size);
      break;
    case 3:
      e = "ctx";
      f = ua(this.ctx, this.reg.size);
      break;
    default:
      return;
  }
  return ya.call(this, a, b, e, f, c, d);
};
u.import = function(a, b) {
  if (b) {
    switch("string" === typeof b && (b = JSON.parse(b)), a = a.split("."), "json" === a[a.length - 1] && a.pop(), 3 === a.length && a.shift(), a = 1 < a.length ? a[1] : a[0], a) {
      case "reg":
        this.fastupdate = !1;
        this.reg = xa(b, this.reg);
        break;
      case "map":
        this.map = ta(b, this.map);
        break;
      case "ctx":
        this.ctx = va(b, this.ctx);
    }
  }
};
u.serialize = function(a = !0) {
  let b = "", c = "", d = "";
  if (this.reg.size) {
    let f;
    for (var e of this.reg.keys()) {
      f || (f = typeof e), b += (b ? "," : "") + ("string" === f ? '"' + e + '"' : e);
    }
    b = "index.reg=new Set([" + b + "]);";
    c = za(this.map, f);
    c = "index.map=new Map([" + c + "]);";
    for (const g of this.ctx.entries()) {
      e = g[0];
      let h = za(g[1], f);
      h = "new Map([" + h + "])";
      h = '["' + e + '",' + h + "]";
      d += (d ? "," : "") + h;
    }
    d = "index.ctx=new Map([" + d + "]);";
  }
  return a ? "function inject(index){" + b + c + d + "}" : b + c + d;
};
la(N.prototype);
const lb = "undefined" !== typeof window && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), mb = ["map", "ctx", "tag", "reg", "cfg"], Y = A();
function nb(a, b = {}) {
  if (!this || this.constructor !== nb) {
    return new nb(a, b);
  }
  "object" === typeof a && (b = a, a = a.name);
  a || console.info("Default storage space was used, because a name was not passed.");
  this.id = "flexsearch" + (a ? ":" + a.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "");
  this.field = b.field ? b.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "";
  this.type = b.type;
  this.fastupdate = this.support_tag_search = !1;
  this.db = null;
  this.h = {};
}
u = nb.prototype;
u.mount = function(a) {
  if (a.index) {
    return a.mount(this);
  }
  a.db = this;
  return this.open();
};
u.open = function() {
  if (this.db) {
    return this.db;
  }
  let a = this;
  navigator.storage && navigator.storage.persist();
  Y[a.id] || (Y[a.id] = []);
  Y[a.id].push(a.field);
  const b = lb.open(a.id, 1);
  b.onupgradeneeded = function() {
    const c = a.db = this.result;
    for (let d = 0, e; d < mb.length; d++) {
      e = mb[d];
      for (let f = 0, g; f < Y[a.id].length; f++) {
        g = Y[a.id][f], c.objectStoreNames.contains(e + ("reg" !== e ? g ? ":" + g : "" : "")) || c.createObjectStore(e + ("reg" !== e ? g ? ":" + g : "" : ""));
      }
    }
  };
  return a.db = Z(b, function(c) {
    a.db = c;
    a.db.onversionchange = function() {
      a.close();
    };
  });
};
u.close = function() {
  this.db && this.db.close();
  this.db = null;
};
u.destroy = function() {
  const a = lb.deleteDatabase(this.id);
  return Z(a);
};
u.clear = function() {
  const a = [];
  for (let c = 0, d; c < mb.length; c++) {
    d = mb[c];
    for (let e = 0, f; e < Y[this.id].length; e++) {
      f = Y[this.id][e], a.push(d + ("reg" !== d ? f ? ":" + f : "" : ""));
    }
  }
  const b = this.db.transaction(a, "readwrite");
  for (let c = 0; c < a.length; c++) {
    b.objectStore(a[c]).clear();
  }
  return Z(b);
};
u.get = function(a, b, c = 0, d = 0, e = !0, f = !1) {
  a = this.db.transaction((b ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly").objectStore((b ? "ctx" : "map") + (this.field ? ":" + this.field : "")).get(b ? b + ":" + a : a);
  const g = this;
  return Z(a).then(function(h) {
    let k = [];
    if (!h || !h.length) {
      return k;
    }
    if (e) {
      if (!c && !d && 1 === h.length) {
        return h[0];
      }
      for (let l = 0, m; l < h.length; l++) {
        if ((m = h[l]) && m.length) {
          if (d >= m.length) {
            d -= m.length;
            continue;
          }
          const n = c ? d + Math.min(m.length - d, c) : m.length;
          for (let p = d; p < n; p++) {
            k.push(m[p]);
          }
          d = 0;
          if (k.length === c) {
            break;
          }
        }
      }
      return f ? g.enrich(k) : k;
    }
    return h;
  });
};
u.tag = function(a, b = 0, c = 0, d = !1) {
  a = this.db.transaction("tag" + (this.field ? ":" + this.field : ""), "readonly").objectStore("tag" + (this.field ? ":" + this.field : "")).get(a);
  const e = this;
  return Z(a).then(function(f) {
    if (!f || !f.length || c >= f.length) {
      return [];
    }
    if (!b && !c) {
      return f;
    }
    f = f.slice(c, c + b);
    return d ? e.enrich(f) : f;
  });
};
u.enrich = function(a) {
  "object" !== typeof a && (a = [a]);
  const b = this.db.transaction("reg", "readonly").objectStore("reg"), c = [];
  for (let d = 0; d < a.length; d++) {
    c[d] = Z(b.get(a[d]));
  }
  return Promise.all(c).then(function(d) {
    for (let e = 0; e < d.length; e++) {
      d[e] = {id:a[e], doc:d[e] ? JSON.parse(d[e]) : null};
    }
    return d;
  });
};
u.has = function(a) {
  a = this.db.transaction("reg", "readonly").objectStore("reg").getKey(a);
  return Z(a).then(function(b) {
    return !!b;
  });
};
u.search = null;
u.info = function() {
};
u.transaction = function(a, b, c) {
  a += "reg" !== a ? this.field ? ":" + this.field : "" : "";
  let d = this.h[a + ":" + b];
  if (d) {
    return c.call(this, d);
  }
  let e = this.db.transaction(a, b);
  this.h[a + ":" + b] = d = e.objectStore(a);
  const f = c.call(this, d);
  this.h[a + ":" + b] = null;
  return Z(e).finally(function() {
    e = d = null;
    return f;
  });
};
u.commit = async function(a, b, c) {
  if (b) {
    await this.clear(), a.commit_task = [];
  } else {
    let d = a.commit_task;
    a.commit_task = [];
    for (let e = 0, f; e < d.length; e++) {
      if (f = d[e], f.clear) {
        await this.clear();
        b = !0;
        break;
      } else {
        d[e] = f.del;
      }
    }
    b || (c || (d = d.concat(ba(a.reg))), d.length && await this.remove(d));
  }
  a.reg.size && (await this.transaction("map", "readwrite", function(d) {
    for (const e of a.map) {
      const f = e[0], g = e[1];
      g.length && (b ? d.put(g, f) : d.get(f).onsuccess = function() {
        let h = this.result;
        var k;
        if (h && h.length) {
          const l = Math.max(h.length, g.length);
          for (let m = 0, n, p; m < l; m++) {
            if ((p = g[m]) && p.length) {
              if ((n = h[m]) && n.length) {
                for (k = 0; k < p.length; k++) {
                  n.push(p[k]);
                }
              } else {
                h[m] = p;
              }
              k = 1;
            }
          }
        } else {
          h = g, k = 1;
        }
        k && d.put(h, f);
      });
    }
  }), await this.transaction("ctx", "readwrite", function(d) {
    for (const e of a.ctx) {
      const f = e[0], g = e[1];
      for (const h of g) {
        const k = h[0], l = h[1];
        l.length && (b ? d.put(l, f + ":" + k) : d.get(f + ":" + k).onsuccess = function() {
          let m = this.result;
          var n;
          if (m && m.length) {
            const p = Math.max(m.length, l.length);
            for (let r = 0, q, t; r < p; r++) {
              if ((t = l[r]) && t.length) {
                if ((q = m[r]) && q.length) {
                  for (n = 0; n < t.length; n++) {
                    q.push(t[n]);
                  }
                } else {
                  m[r] = t;
                }
                n = 1;
              }
            }
          } else {
            m = l, n = 1;
          }
          n && d.put(m, f + ":" + k);
        });
      }
    }
  }), a.store ? await this.transaction("reg", "readwrite", function(d) {
    for (const e of a.store) {
      const f = e[0], g = e[1];
      d.put("object" === typeof g ? JSON.stringify(g) : 1, f);
    }
  }) : a.bypass || await this.transaction("reg", "readwrite", function(d) {
    for (const e of a.reg.keys()) {
      d.put(1, e);
    }
  }), a.tag && await this.transaction("tag", "readwrite", function(d) {
    for (const e of a.tag) {
      const f = e[0], g = e[1];
      g.length && (d.get(f).onsuccess = function() {
        let h = this.result;
        h = h && h.length ? h.concat(g) : g;
        d.put(h, f);
      });
    }
  }), a.map.clear(), a.ctx.clear(), a.tag && a.tag.clear(), a.store && a.store.clear(), a.document || a.reg.clear());
};
function ob(a, b, c) {
  const d = a.value;
  let e, f = 0;
  for (let g = 0, h; g < d.length; g++) {
    if (h = c ? d : d[g]) {
      for (let k = 0, l, m; k < b.length; k++) {
        if (m = b[k], l = h.indexOf(m), 0 <= l) {
          if (e = 1, 1 < h.length) {
            h.splice(l, 1);
          } else {
            d[g] = [];
            break;
          }
        }
      }
      f += h.length;
    }
    if (c) {
      break;
    }
  }
  f ? e && a.update(d) : a.delete();
  a.continue();
}
u.remove = function(a) {
  "object" !== typeof a && (a = [a]);
  return Promise.all([this.transaction("map", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && ob(c, a);
    };
  }), this.transaction("ctx", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && ob(c, a);
    };
  }), this.transaction("tag", "readwrite", function(b) {
    b.openCursor().onsuccess = function() {
      const c = this.result;
      c && ob(c, a, !0);
    };
  }), this.transaction("reg", "readwrite", function(b) {
    for (let c = 0; c < a.length; c++) {
      b.delete(a[c]);
    }
  })]);
};
function Z(a, b) {
  return new Promise((c, d) => {
    a.onsuccess = a.oncomplete = function() {
      b && b(this.result);
      b = null;
      c(this.result);
    };
    a.onerror = a.onblocked = d;
    a = null;
  });
}
;const pb = {Index:N, Charset:bb, Encoder:G, Document:U, Worker:P, Resolver:W, IndexedDB:nb, Language:{}}, qb = "undefined" !== typeof self ? self : "undefined" !== typeof global ? global : self;
let sb;
(sb = qb.define) && sb.amd ? sb([], function() {
  return pb;
}) : "object" === typeof qb.exports ? qb.exports = pb : qb.FlexSearch = pb;
}(this||self));
