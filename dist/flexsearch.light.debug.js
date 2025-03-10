/**!
 * FlexSearch.js v0.8.0 (Light/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
function t(a, c, b) {
  const d = typeof b, e = typeof a;
  if ("undefined" !== d) {
    if ("undefined" !== e) {
      if (b) {
        if ("function" === e && d === e) {
          return function(h) {
            return a(b(h));
          };
        }
        c = a.constructor;
        if (c === b.constructor) {
          if (c === Array) {
            return b.concat(a);
          }
          if (c === Map) {
            var g = new Map(b);
            for (var f of a) {
              g.set(f[0], f[1]);
            }
            return g;
          }
          if (c === Set) {
            f = new Set(b);
            for (g of a.values()) {
              f.add(g);
            }
            return f;
          }
        }
      }
      return a;
    }
    return b;
  }
  return "undefined" === e ? c : a;
}
function u(a, c) {
  return c.length - a.length;
}
;const v = /[^\p{L}\p{N}]+/u, w = /(\d{3})/g, x = /(\D)(\d{3})/g, y = /(\d{3})(\D)/g, A = "".normalize && /[\u0300-\u036f]/g;
function B(a) {
  if (!this) {
    return new B(...arguments);
  }
  for (let c = 0; c < arguments.length; c++) {
    this.assign(arguments[c]);
  }
}
B.prototype.assign = function(a) {
  this.normalize = t(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split;
  if ("object" === typeof b) {
    let d = !c, e = "";
    a.include || (e += "\\p{Z}");
    b.letter && (e += "\\p{L}");
    b.number && (e += "\\p{N}", d = !!c);
    b.symbol && (e += "\\p{S}");
    b.punctuation && (e += "\\p{P}");
    b.control && (e += "\\p{C}");
    if (b = b.char) {
      e += "object" === typeof b ? b.join("") : b;
    }
    this.split = new RegExp("[" + (c ? "^" : "") + e + "]+", "u");
    this.numeric = d;
  } else {
    this.split = t(b, v, this.split), this.numeric = t(this.numeric, !0);
  }
  this.prepare = t(a.prepare, null, this.prepare);
  this.finalize = t(a.finalize, null, this.finalize);
  this.rtl = a.rtl || !1;
  this.dedupe = t(a.dedupe, !0, this.dedupe);
  this.filter = t((b = a.filter) && new Set(b), null, this.filter);
  this.matcher = t((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = t((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = t((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = t(a.replacer, null, this.replacer);
  this.minlength = t(a.minlength, 1, this.minlength);
  this.maxlength = t(a.maxlength, 0, this.maxlength);
  if (this.cache = b = t(a.cache, !0, this.cache)) {
    this.m = null, this.B = "number" === typeof b ? b : 2e5, this.i = new Map(), this.j = new Map(), this.o = this.h = 128;
  }
  this.s = "";
  this.v = null;
  this.u = "";
  this.A = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.s += (this.s ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.u += (this.u ? "|" : "") + d;
    }
  }
  return this;
};
B.prototype.encode = function(a) {
  if (this.cache && a.length <= this.h) {
    if (this.m) {
      if (this.i.has(a)) {
        return this.i.get(a);
      }
    } else {
      this.m = setTimeout(C, 0, this);
    }
  }
  this.normalize && (a = "function" === typeof this.normalize ? this.normalize(a) : A ? a.normalize("NFKD").replace(A, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(x, "$1 $2").replace(y, "$1 $2").replace(w, "$1 "));
  const c = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let b = [], d = this.split || "" === this.split ? a.split(this.split) : a;
  for (let g = 0, f, h; g < d.length; g++) {
    if (!(f = h = d[g])) {
      continue;
    }
    if (f.length < this.minlength) {
      continue;
    }
    if (c) {
      b.push(f);
      continue;
    }
    if (this.filter && this.filter.has(f)) {
      continue;
    }
    if (this.cache && f.length <= this.o) {
      if (this.m) {
        var e = this.j.get(f);
        if (e || "" === e) {
          e && b.push(e);
          continue;
        }
      } else {
        this.m = setTimeout(C, 0, this);
      }
    }
    let l;
    this.stemmer && 2 < f.length && (this.A || (this.A = new RegExp("(?!^)(" + this.u + ")$")), f = f.replace(this.A, r => this.stemmer.get(r)), l = 1);
    this.matcher && 1 < f.length && (this.v || (this.v = new RegExp("(" + this.s + ")", "g")), f = f.replace(this.v, r => this.matcher.get(r)), l = 1);
    f && l && (f.length < this.minlength || this.filter && this.filter.has(f)) && (f = "");
    if (f && (this.mapper || this.dedupe && 1 < f.length)) {
      e = "";
      for (let r = 0, p = "", n, q; r < f.length; r++) {
        n = f.charAt(r), n === p && this.dedupe || ((q = this.mapper && this.mapper.get(n)) || "" === q ? q === p && this.dedupe || !(p = q) || (e += q) : e += p = n);
      }
      f = e;
    }
    if (f && this.replacer) {
      for (e = 0; f && e < this.replacer.length; e += 2) {
        f = f.replace(this.replacer[e], this.replacer[e + 1]);
      }
    }
    this.cache && h.length <= this.o && (this.j.set(h, f), this.j.size > this.B && (this.j.clear(), this.o = this.o / 1.1 | 0));
    f && b.push(f);
  }
  this.finalize && (b = this.finalize(b) || b);
  this.cache && a.length <= this.h && (this.i.set(a, b), this.i.size > this.B && (this.i.clear(), this.h = this.h / 1.1 | 0));
  return b;
};
function C(a) {
  a.m = null;
  a.i.clear();
  a.j.clear();
}
;function D(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.h = "";
}
D.prototype.set = function(a, c) {
  this.cache.set(this.h = a, c);
  this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value);
};
D.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.h !== a && (this.cache.delete(a), this.cache.set(this.h = a, c));
  return c;
};
D.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
D.prototype.clear = function() {
  this.cache.clear();
  this.h = "";
};
const E = {normalize:function(a) {
  return a.toLowerCase();
}, dedupe:!1};
const F = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
Object.create(null);
G.prototype.add = function(a, c, b, d) {
  if (c && (a || 0 === a)) {
    if (!d && !b && this.g.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (d = c.length) {
      const r = Object.create(null), p = Object.create(null), n = this.depth, q = this.resolution;
      for (let k = 0; k < d; k++) {
        let m = c[this.rtl ? d - 1 - k : k];
        var e = m.length;
        if (e && (n || !p[m])) {
          var g = this.score ? this.score(c, m, k, null, 0) : H(q, d, k), f = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (g = 0; g < e; g++) {
                  for (var h = e; h > g; h--) {
                    f = m.substring(g, h);
                    var l = this.score ? this.score(c, m, k, f, g) : H(q, d, k, e, g);
                    I(this, p, f, l, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  f = m[h] + f, l = this.score ? this.score(c, m, k, f, h) : H(q, d, k, e, h), I(this, p, f, l, a, b);
                }
                f = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  f += m[h], I(this, p, f, g, a, b);
                }
                break;
              }
            default:
              if (I(this, p, m, g, a, b), n && 1 < d && k < d - 1) {
                for (e = Object.create(null), f = this.C, g = m, h = Math.min(n + 1, d - k), e[g] = 1, l = 1; l < h; l++) {
                  if ((m = c[this.rtl ? d - 1 - k - l : k + l]) && !e[m]) {
                    e[m] = 1;
                    const z = this.score ? this.score(c, g, k, m, l) : H(f + (d / 2 > f ? 0 : 1), d, k, h - 1, l - 1), L = this.bidirectional && m > g;
                    I(this, r, L ? g : m, z, a, b, L ? m : g);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.g.add(a);
    }
  }
  return this;
};
function I(a, c, b, d, e, g, f) {
  let h = f ? a.l : a.map, l;
  c[b] && f && (l = c[b])[f] || (f ? (c = l || (c[b] = Object.create(null)), c[f] = 1, (l = h.get(f)) ? h = l : h.set(f, h = new Map())) : c[b] = 1, (l = h.get(b)) ? h = l : h.set(b, h = []), h = h[d] || (h[d] = []), g && h.includes(e) || (h.push(e), a.fastupdate && ((c = a.g.get(e)) ? c.push(h) : a.g.set(e, [h]))));
}
function H(a, c, b, d, e) {
  return b && 1 < a ? c + (d || 0) <= a ? b + (e || 0) : (a - 1) / (c + (d || 0)) * (b + (e || 0)) + 1 | 0 : 0;
}
;function J(a, c, b) {
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a;
  }
  let d = [];
  for (let e = 0, g, f; e < a.length; e++) {
    if ((g = a[e]) && (f = g.length)) {
      if (b) {
        if (b >= f) {
          b -= f;
          continue;
        }
        b < f && (g = c ? g.slice(b, b + c) : g.slice(b), f = g.length, b = 0);
      }
      if (d.length) {
        f > c && (g = g.slice(0, c), f = g.length), d.push(g);
      } else {
        if (f >= c) {
          return f > c && (g = g.slice(0, c)), g;
        }
        d = [g];
      }
      c -= f;
      if (!c) {
        break;
      }
    }
  }
  return d.length ? d = 1 < d.length ? [].concat.apply([], d) : d[0] : d;
}
;G.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  var d = [], e = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    e = b.offset || 0;
    var g = b.context;
    var f = b.suggest;
  }
  a = this.encoder.encode(a);
  b = a.length;
  c || (c = 100);
  if (1 === b) {
    return K.call(this, a[0], "", c, e);
  }
  g = this.depth && !1 !== g;
  if (2 === b && g && !f) {
    return K.call(this, a[0], a[1], c, e);
  }
  var h = 0, l = 0;
  if (1 < b) {
    var r = Object.create(null);
    const n = [];
    for (let q = 0, k; q < b; q++) {
      if ((k = a[q]) && !r[k]) {
        if (f || M(this, k)) {
          n.push(k), r[k] = 1;
        } else {
          return d;
        }
        const m = k.length;
        h = Math.max(h, m);
        l = l ? Math.min(l, m) : m;
      }
    }
    a = n;
    b = a.length;
  }
  if (!b) {
    return d;
  }
  r = 0;
  if (1 === b) {
    return K.call(this, a[0], "", c, e);
  }
  if (2 === b && g && !f) {
    return K.call(this, a[0], a[1], c, e);
  }
  if (1 < b) {
    if (g) {
      var p = a[0];
      r = 1;
    } else {
      9 < h && 3 < h / l && a.sort(u);
    }
  }
  for (let n, q; r < b; r++) {
    q = a[r];
    p ? (n = M(this, q, p), n = N(n, d, f, this.C, c, e, 2 === b), f && !1 === n && d.length || (p = q)) : (n = M(this, q), n = N(n, d, f, this.resolution, c, e, 1 === b));
    if (n) {
      return n;
    }
    if (f && r === b - 1) {
      g = d.length;
      if (!g) {
        if (p) {
          p = "";
          r = -1;
          continue;
        }
        return d;
      }
      if (1 === g) {
        return J(d[0], c, e);
      }
    }
  }
  a: {
    a = d;
    d = this.resolution;
    p = f;
    b = a.length;
    f = [];
    g = Object.create(null);
    for (let n = 0, q, k, m, z; n < d; n++) {
      for (l = 0; l < b; l++) {
        if (m = a[l], n < m.length && (q = m[n])) {
          for (r = 0; r < q.length; r++) {
            k = q[r], (h = g[k]) ? g[k]++ : (h = 0, g[k] = 1), z = f[h] || (f[h] = []), z.push(k);
          }
        }
      }
    }
    if (a = f.length) {
      if (p) {
        d = [];
        for (let n = a - 1, q = 0, k, m; 0 <= n; n--) {
          if (k = f[n], m = k.length, e >= m) {
            e -= m;
          } else {
            if (m + q > c || e) {
              k = k.slice(e, c - q + e), m = k.length;
            }
            d.push(k);
            q += m;
            if (c === q) {
              break;
            }
          }
        }
        f = 1 < d.length ? [].concat.apply([], d) : d[0];
      } else {
        if (a < b) {
          d = [];
          break a;
        }
        f = f[a - 1];
        if (f.length > c || e) {
          f = f.slice(e, c + e);
        }
      }
    }
    d = f;
  }
  return d;
};
function K(a, c, b, d) {
  return (a = M(this, a, c)) && a.length ? J(a, b, d) : [];
}
function N(a, c, b, d, e, g, f) {
  let h = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let l = 0, r = 0, p; l < d; l++) {
      if (p = a[l]) {
        if (g && p && f && (p.length <= g ? (g -= p.length, p = null) : (p = p.slice(g), g = 0)), p && (h[l] = p, f && (r += p.length, r >= e))) {
          break;
        }
      }
    }
    if (h.length) {
      if (f) {
        return J(h, e, 0);
      }
      c.push(h);
      return;
    }
  }
  return !b && h;
}
function M(a, c, b) {
  let d;
  b && (d = a.bidirectional && c > b);
  a = b ? (a = a.l.get(d ? c : b)) && a.get(d ? b : c) : a.map.get(c);
  return a;
}
;G.prototype.remove = function(a, c) {
  const b = this.g.size && (this.fastupdate ? this.g.get(a) : this.g.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let d = 0, e; d < b.length; d++) {
        if (e = b[d]) {
          if (2 > e.length) {
            e.pop();
          } else {
            const g = e.indexOf(a);
            g === b.length - 1 ? e.pop() : e.splice(g, 1);
          }
        }
      }
    } else {
      O(this.map, a), this.depth && O(this.l, a);
    }
    c || this.g.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function O(a, c) {
  let b = 0;
  if (a.constructor === Array) {
    for (let d = 0, e, g; d < a.length; d++) {
      if ((e = a[d]) && e.length) {
        if (g = e.indexOf(c), 0 <= g) {
          1 < e.length ? (e.splice(g, 1), b++) : delete a[d];
          break;
        } else {
          b++;
        }
      }
    }
  } else {
    for (let d of a) {
      const e = d[0], g = O(d[1], c);
      g ? b += g : a.delete(e);
    }
  }
  return b;
}
;function G(a, c) {
  if (!this) {
    return new G(a);
  }
  if (a) {
    var b = "string" === typeof a ? a : a.preset;
    b && (F[b] || console.warn("Preset not found: " + b), a = Object.assign({}, F[b], a));
  } else {
    a = {};
  }
  b = a.context || {};
  const d = a.encode || a.encoder || E;
  this.encoder = d.encode ? d : "object" === typeof d ? new B(d) : {encode:d};
  let e;
  this.resolution = a.resolution || 9;
  this.tokenize = e = a.tokenize || "strict";
  this.depth = "strict" === e && b.depth || 0;
  this.bidirectional = !1 !== b.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  e = !1;
  this.map = new Map();
  this.l = new Map();
  this.g = c || (this.fastupdate ? new Map() : new Set());
  this.C = b.resolution || 1;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (e = a.cache || null) && new D(e);
}
G.prototype.clear = function() {
  this.map.clear();
  this.l.clear();
  this.g.clear();
  this.cache && this.cache.clear();
  return this;
};
G.prototype.append = function(a, c) {
  return this.add(a, c, !0);
};
G.prototype.contain = function(a) {
  return this.g.has(a);
};
G.prototype.update = function(a, c) {
  if (this.async) {
    const b = this, d = this.remove(a);
    return d.then ? d.then(() => b.add(a, c)) : this.add(a, c);
  }
  return this.remove(a).add(a, c);
};
function P(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, d; b < a.length; b++) {
      (d = a[b]) && (c += d.length);
    }
  } else {
    for (const b of a) {
      const d = b[0], e = P(b[1]);
      e ? c += e : a.delete(d);
    }
  }
  return c;
}
G.prototype.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  P(this.map);
  this.depth && P(this.l);
  return this;
};
G.prototype.searchCache = function(a, c, b) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  let d = this.cache.get(a);
  if (!d) {
    d = this.search(a, c, b);
    if (d.then) {
      const e = this;
      d.then(function(g) {
        e.cache.set(a, g);
        return g;
      });
    }
    this.cache.set(a, d);
  }
  return d;
};
const Q = {Index:G, Charset:null, Encoder:B, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}}, R = self;
let S;
(S = R.define) && S.amd ? S([], function() {
  return Q;
}) : "object" === typeof R.exports ? R.exports = Q : R.FlexSearch = Q;
}(this));
