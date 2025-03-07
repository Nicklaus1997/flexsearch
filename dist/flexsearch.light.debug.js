/**!
 * FlexSearch.js v0.8.0 (Light/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
(function(self){'use strict';
var t;
function u(a, c, b) {
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
function v() {
  return Object.create(null);
}
function w(a, c) {
  return c.length - a.length;
}
;const y = /[^\p{L}\p{N}]+/u, z = /(\d{3})/g, A = /(\D)(\d{3})/g, B = /(\d{3})(\D)/g, C = "".normalize && /[\u0300-\u036f]/g;
function D(a = {}) {
  if (!(this instanceof D)) {
    return new D(...arguments);
  }
  for (a = 0; a < arguments.length; a++) {
    this.assign(arguments[a]);
  }
}
D.prototype.assign = function(a) {
  this.normalize = u(a.normalize, !0, this.normalize);
  let c = a.N, b = c || a.O || a.split;
  if ("object" === typeof b) {
    let d = !c, e = "";
    a.N || (e += "\\p{Z}");
    b.P && (e += "\\p{L}");
    b.R && (e += "\\p{N}", d = !!c);
    b.T && (e += "\\p{S}");
    b.S && (e += "\\p{P}");
    b.control && (e += "\\p{C}");
    if (b = b.char) {
      e += "object" === typeof b ? b.join("") : b;
    }
    this.split = new RegExp("[" + (c ? "^" : "") + e + "]+", "u");
    this.numeric = d;
  } else {
    this.split = u(b, y, this.split), this.numeric = u(this.numeric, !0);
  }
  this.H = u(a.H, null, this.H);
  this.D = u(a.D, null, this.D);
  this.rtl = a.rtl || !1;
  this.l = u(a.l, !0, this.l);
  this.filter = u((b = a.filter) && new Set(b), null, this.filter);
  this.m = u((b = a.m) && new Map(b), null, this.m);
  this.v = u((b = a.v) && new Map(b), null, this.v);
  this.s = u((b = a.s) && new Map(b), null, this.s);
  this.o = u(a.o, null, this.o);
  this.G = u(a.G, 1, this.G);
  this.K = u(a.K, 0, this.K);
  if (this.cache = b = u(a.cache, !0, this.cache)) {
    this.C = null, this.L = "number" === typeof b ? b : 2e5, this.u = new Map(), this.A = new Map(), this.h = this.g = 128;
  }
  this.i = "";
  this.I = null;
  this.F = "";
  this.J = null;
  if (this.m) {
    for (const d of this.m.keys()) {
      this.i += (this.i ? "|" : "") + d;
    }
  }
  if (this.s) {
    for (const d of this.s.keys()) {
      this.F += (this.F ? "|" : "") + d;
    }
  }
  return this;
};
D.prototype.encode = function(a) {
  if (this.cache && a.length <= this.g) {
    if (this.C) {
      if (this.u.has(a)) {
        return this.u.get(a);
      }
    } else {
      this.C = setTimeout(E, 0, this);
    }
  }
  this.normalize && (a = "function" === typeof this.normalize ? this.normalize(a) : C ? a.normalize("NFKD").replace(C, "").toLowerCase() : a.toLowerCase());
  this.H && (a = this.H(a));
  this.numeric && 3 < a.length && (a = a.replace(A, "$1 $2").replace(B, "$1 $2").replace(z, "$1 "));
  const c = !(this.l || this.v || this.filter || this.m || this.s || this.o);
  let b = [], d = this.split || "" === this.split ? a.split(this.split) : a;
  for (let g = 0, f, h; g < d.length; g++) {
    if (!(f = h = d[g])) {
      continue;
    }
    if (f.length < this.G) {
      continue;
    }
    if (c) {
      b.push(f);
      continue;
    }
    if (this.filter && this.filter.has(f)) {
      continue;
    }
    if (this.cache && f.length <= this.h) {
      if (this.C) {
        var e = this.A.get(f);
        if (e || "" === e) {
          e && b.push(e);
          continue;
        }
      } else {
        this.C = setTimeout(E, 0, this);
      }
    }
    let l;
    this.s && 2 < f.length && (this.J || (this.J = new RegExp("(?!^)(" + this.F + ")$")), f = f.replace(this.J, r => this.s.get(r)), l = 1);
    this.m && 1 < f.length && (this.I || (this.I = new RegExp("(" + this.i + ")", "g")), f = f.replace(this.I, r => this.m.get(r)), l = 1);
    f && l && (f.length < this.G || this.filter && this.filter.has(f)) && (f = "");
    if (f && (this.v || this.l && 1 < f.length)) {
      e = "";
      for (let r = 0, k = "", p, q; r < f.length; r++) {
        p = f.charAt(r), p === k && this.l || ((q = this.v && this.v.get(p)) || "" === q ? q === k && this.l || !(k = q) || (e += q) : e += k = p);
      }
      f = e;
    }
    if (f && this.o) {
      for (e = 0; f && e < this.o.length; e += 2) {
        f = f.replace(this.o[e], this.o[e + 1]);
      }
    }
    this.cache && h.length <= this.h && (this.A.set(h, f), this.A.size > this.L && (this.A.clear(), this.h = this.h / 1.1 | 0));
    f && b.push(f);
  }
  this.D && (b = this.D(b) || b);
  this.cache && a.length <= this.g && (this.u.set(a, b), this.u.size > this.L && (this.u.clear(), this.g = this.g / 1.1 | 0));
  return b;
};
function E(a) {
  a.C = null;
  a.u.clear();
  a.A.clear();
}
;function F(a) {
  this.limit = a && !0 !== a ? a : 1000;
  this.cache = new Map();
  this.g = "";
}
F.prototype.set = function(a, c) {
  this.cache.has(a) || (this.cache.set(this.g = a, c), this.limit && this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value));
};
F.prototype.get = function(a) {
  const c = this.cache.get(a);
  c && this.limit && this.g !== a && (this.cache.delete(a), this.cache.set(this.g = a, c));
  return c;
};
F.prototype.remove = function(a) {
  for (const c of this.cache) {
    const b = c[0];
    c[1].includes(a) && this.cache.delete(b);
  }
};
F.prototype.clear = function() {
  this.cache.clear();
  this.g = "";
};
function G(a = 8) {
  if (!(this instanceof G)) {
    return new G(a);
  }
  this.index = v();
  this.i = [];
  this.size = 0;
  32 < a ? (this.g = H, this.h = BigInt(a)) : (this.g = I, this.h = a);
}
G.prototype.get = function(a) {
  const c = this.index[this.g(a)];
  return c && c.get(a);
};
G.prototype.set = function(a, c) {
  var b = this.g(a);
  let d = this.index[b];
  d ? (b = d.size, d.set(a, c), (b -= d.size) && this.size++) : (this.index[b] = d = new Map([[a, c]]), this.i.push(d));
};
function J(a = 8) {
  if (!(this instanceof J)) {
    return new J(a);
  }
  this.index = v();
  this.g = [];
  32 < a ? (this.i = H, this.h = BigInt(a)) : (this.i = I, this.h = a);
}
J.prototype.add = function(a) {
  var c = this.i(a);
  let b = this.index[c];
  b ? (c = b.size, b.add(a), (c -= b.size) && this.size++) : (this.index[c] = b = new Set([a]), this.g.push(b));
};
t = G.prototype;
t.has = J.prototype.has = function(a) {
  const c = this.index[this.i(a)];
  return c && c.has(a);
};
t.delete = J.prototype.delete = function(a) {
  const c = this.index[this.i(a)];
  c && c.delete(a) && this.size--;
};
t.clear = J.prototype.clear = function() {
  this.index = v();
  this.g = [];
  this.size = 0;
};
t.values = J.prototype.values = function*() {
  for (let a = 0; a < this.g.length; a++) {
    for (let c of this.g[a].values()) {
      yield c;
    }
  }
};
t.keys = J.prototype.keys = function*() {
  for (let a = 0; a < this.g.length; a++) {
    for (let c of this.g[a].keys()) {
      yield c;
    }
  }
};
t.entries = J.prototype.entries = function*() {
  for (let a = 0; a < this.g.length; a++) {
    for (let c of this.g[a].entries()) {
      yield c;
    }
  }
};
function I(a) {
  let c = 2 ** this.h - 1;
  if ("number" == typeof a) {
    return a & c;
  }
  let b = 0, d = this.h + 1;
  for (let e = 0; e < a.length; e++) {
    b = (b * d ^ a.charCodeAt(e)) & c;
  }
  return 32 === this.h ? b + 2 ** 31 : b;
}
function H(a) {
  let c = BigInt(2) ** this.h - BigInt(1);
  var b = typeof a;
  if ("bigint" === b) {
    return a & c;
  }
  if ("number" === b) {
    return BigInt(a) & c;
  }
  b = BigInt(0);
  let d = this.h + BigInt(1);
  for (let e = 0; e < a.length; e++) {
    b = (b * d ^ BigInt(a.charCodeAt(e))) & c;
  }
  return b;
}
;const K = v(), L = v();
var aa = {normalize:function(a) {
  return a.toLowerCase();
}, l:!1};
const M = {memory:{resolution:1}, performance:{resolution:6, fastupdate:!0, context:{depth:1, resolution:3}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:9}}};
v();
N.prototype.add = function(a, c, b, d) {
  if (c && (a || 0 === a)) {
    if (!d && !b && this.j.has(a)) {
      return this.update(a, c);
    }
    c = this.encoder.encode(c);
    if (d = c.length) {
      const r = v(), k = v(), p = this.depth, q = this.resolution;
      for (let m = 0; m < d; m++) {
        let n = c[this.rtl ? d - 1 - m : m];
        var e = n.length;
        if (e && (p || !k[n])) {
          var g = this.score ? this.score(c, n, m, null, 0) : O(q, d, m), f = "";
          switch(this.tokenize) {
            case "full":
              if (2 < e) {
                for (g = 0; g < e; g++) {
                  for (var h = e; h > g; h--) {
                    f = n.substring(g, h);
                    var l = this.score ? this.score(c, n, m, f, g) : O(q, d, m, e, g);
                    P(this, k, f, l, a, b);
                  }
                }
                break;
              }
            case "reverse":
              if (1 < e) {
                for (h = e - 1; 0 < h; h--) {
                  f = n[h] + f, l = this.score ? this.score(c, n, m, f, h) : O(q, d, m, e, h), P(this, k, f, l, a, b);
                }
                f = "";
              }
            case "forward":
              if (1 < e) {
                for (h = 0; h < e; h++) {
                  f += n[h], P(this, k, f, g, a, b);
                }
                break;
              }
            default:
              if (P(this, k, n, g, a, b), p && 1 < d && m < d - 1) {
                for (e = v(), f = this.M, g = n, h = Math.min(p + 1, d - m), e[g] = 1, l = 1; l < h; l++) {
                  if ((n = c[this.rtl ? d - 1 - m - l : m + l]) && !e[n]) {
                    e[n] = 1;
                    const x = this.score ? this.score(c, g, m, n, l) : O(f + (d / 2 > f ? 0 : 1), d, m, h - 1, l - 1), R = this.bidirectional && n > g;
                    P(this, r, R ? g : n, x, a, b, R ? n : g);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.j.add(a);
    }
  }
  return this;
};
function P(a, c, b, d, e, g, f) {
  let h = f ? a.B : a.map, l;
  c[b] && f && (l = c[b])[f] || (f ? (c = l || (c[b] = v()), c[f] = 1, (l = h.get(f)) ? h = l : h.set(f, h = new Map())) : c[b] = 1, (l = h.get(b)) ? h = l : h.set(b, h = []), h = h[d] || (h[d] = []), g && h.includes(e) || (h.push(e), a.fastupdate && ((c = a.j.get(e)) ? c.push(h) : a.j.set(e, [h]))));
}
function O(a, c, b, d, e) {
  return b && 1 < a ? c + (d || 0) <= a ? b + (e || 0) : (a - 1) / (c + (d || 0)) * (b + (e || 0)) + 1 | 0 : 0;
}
;function Q(a, c, b) {
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
;function ba(a, c, b, d) {
  var e = a.length;
  let g = [], f = 0, h, l, r;
  d && (d = []);
  for (let k = e - 1, p; 0 <= k; k--) {
    r = a[k];
    e = v();
    p = !h;
    for (let q = 0, m; q < r.length; q++) {
      if ((m = r[q]) && m.length) {
        for (let n = 0, x; n < m.length; n++) {
          if (x = m[n], h) {
            if (h[x]) {
              if (!k) {
                if (b) {
                  b--;
                } else {
                  if (g[f++] = x, f === c) {
                    return g;
                  }
                }
              }
              if (k || d) {
                e[x] = 1;
              }
              p = !0;
            }
            d && !l[x] && (l[x] = 1, (d[q] || (d[q] = [])).push(x));
          } else {
            e[x] = 1;
          }
        }
      }
    }
    if (d) {
      h || (l = e);
    } else if (!p) {
      return [];
    }
    h = e;
  }
  if (d) {
    for (let k = d.length - 1, p, q; 0 <= k; k--) {
      p = d[k];
      q = p.length;
      for (let m = 0, n; m < q; m++) {
        if (n = p[m], !h[n]) {
          if (b) {
            b--;
          } else {
            if (g[f++] = n, f === c) {
              return g;
            }
          }
          h[n] = 1;
        }
      }
    }
  }
  return g;
}
;N.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  let d = [];
  let e, g = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    g = b.offset || 0;
    var f = b.context;
    e = b.suggest;
  }
  a = this.encoder.encode(a);
  b = a.length;
  c || (c = 100);
  if (1 === b) {
    return S.call(this, a[0], "", c, g);
  }
  f = this.depth && !1 !== f;
  if (2 === b && f && !e) {
    return S.call(this, a[0], a[1], c, g);
  }
  let h = 0, l = 0;
  if (1 < b) {
    var r = v();
    const p = [];
    for (let q = 0, m; q < b; q++) {
      if ((m = a[q]) && !r[m]) {
        if (e || T(this, m)) {
          p.push(m), r[m] = 1;
        } else {
          return d;
        }
        const n = m.length;
        h = Math.max(h, n);
        l = l ? Math.min(l, n) : n;
      }
    }
    a = p;
    b = a.length;
  }
  if (!b) {
    return d;
  }
  r = 0;
  let k;
  if (1 === b) {
    return S.call(this, a[0], "", c, g);
  }
  if (2 === b && f && !e) {
    return S.call(this, a[0], a[1], c, g);
  }
  1 < b && (f ? (k = a[0], r = 1) : 9 < h && 3 < h / l && a.sort(w));
  for (let p, q; r < b; r++) {
    q = a[r];
    k ? (p = T(this, q, k), p = U(p, d, e, this.M, c, g, 2 === b), e && !1 === p && d.length || (k = q)) : (p = T(this, q), p = U(p, d, e, this.resolution, c, g, 1 === b));
    if (p) {
      return p;
    }
    if (e && r === b - 1) {
      f = d.length;
      if (!f) {
        if (k) {
          k = "";
          r = -1;
          continue;
        }
        return d;
      }
      if (1 === f) {
        return Q(d[0], c, g);
      }
    }
  }
  return ba(d, c, g, e);
};
function S(a, c, b, d) {
  return (a = T(this, a, c)) && a.length ? Q(a, b, d) : [];
}
function U(a, c, b, d, e, g, f) {
  let h = [];
  if (a) {
    d = Math.min(a.length, d);
    for (let l = 0, r = 0, k; l < d; l++) {
      if (k = a[l]) {
        if (g && k && f && (k.length <= g ? (g -= k.length, k = null) : (k = k.slice(g), g = 0)), k && (h[l] = k, f && (r += k.length, r >= e))) {
          break;
        }
      }
    }
    if (h.length) {
      if (f) {
        return Q(h, e, 0);
      }
      c.push(h);
      return;
    }
  }
  return !b && h;
}
function T(a, c, b) {
  let d;
  b && (d = a.bidirectional && c > b);
  a = b ? (a = a.B.get(d ? c : b)) && a.get(d ? b : c) : a.map.get(c);
  return a;
}
;N.prototype.remove = function(a, c) {
  const b = this.j.size && (this.fastupdate ? this.j.get(a) : this.j.has(a));
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
      V(this.map, a), this.depth && V(this.B, a);
    }
    c || this.j.delete(a);
  }
  this.cache && this.cache.remove(a);
  return this;
};
function V(a, c) {
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
      const e = d[0], g = V(d[1], c);
      g ? b += g : a.delete(e);
    }
  }
  return b;
}
;function N(a, c) {
  if (!(this instanceof N)) {
    return new N(a);
  }
  if (a) {
    var b = "string" === typeof a ? a : a.preset;
    b && (M[b] || console.warn("Preset not found: " + b), a = Object.assign({}, M[b], a));
  } else {
    a = {};
  }
  b = a.context || {};
  const d = a.encode || a.encoder || aa;
  this.encoder = d.encode ? d : "object" === typeof d ? new D(d) : {encode:d};
  let e;
  this.resolution = a.resolution || 9;
  this.tokenize = e = a.tokenize || "strict";
  this.depth = "strict" === e && b.depth || 0;
  this.bidirectional = !1 !== b.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  this.map = (e = !1, new Map());
  this.B = e ? new G(e) : new Map();
  this.j = c || (this.fastupdate ? e ? new G(e) : new Map() : e ? new J(e) : new Set());
  this.M = b.resolution || 1;
  this.rtl = d.rtl || a.rtl || !1;
  this.cache = (e = a.cache || null) && new F(e);
}
t = N.prototype;
t.clear = function() {
  this.map.clear();
  this.B.clear();
  this.j.clear();
  this.cache && this.cache.clear();
  return this;
};
t.append = function(a, c) {
  return this.add(a, c, !0);
};
t.contain = function(a) {
  return this.j.has(a);
};
t.update = function(a, c) {
  if (this.async) {
    const b = this, d = this.remove(a);
    return d.then ? d.then(() => b.add(a, c)) : this.add(a, c);
  }
  return this.remove(a).add(a, c);
};
function W(a) {
  let c = 0;
  if (a.constructor === Array) {
    for (let b = 0, d; b < a.length; b++) {
      (d = a[b]) && (c += d.length);
    }
  } else {
    for (const b of a) {
      const d = b[0], e = W(b[1]);
      e ? c += e : a.delete(d);
    }
  }
  return c;
}
t.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  W(this.map);
  this.depth && W(this.B);
  return this;
};
t.searchCache = function(a, c, b) {
  a = ("object" === typeof a ? "" + a.query : a).toLowerCase();
  let d = this.cache.get(a);
  if (!d) {
    d = this.search(a, c, b);
    if (d instanceof Promise) {
      const e = this;
      d.then(function(g) {
        e.cache.set(a, g);
      });
    }
    this.cache.set(a, d);
  }
  return d;
};
const X = {Index:N, Encoder:D, Charset:L, Language:K, Document:null, Worker:null, Resolver:null, IndexedDB:null}, Y = self;
let Z;
(Z = Y.define) && Z.amd ? Z([], function() {
  return X;
}) : "object" === typeof Y.exports ? Y.exports = X : Y.FlexSearch = X;
}(this));
