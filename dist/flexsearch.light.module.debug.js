/**!
 * FlexSearch.js v0.8.157 (Bundle/Debug)
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/flexsearch
 */
var r;
function u(a, c, b) {
  const f = typeof b, d = typeof a;
  if ("undefined" !== f) {
    if ("undefined" !== d) {
      if (b) {
        if ("function" === d && f === d) {
          return function(k) {
            return a(b(k));
          };
        }
        c = a.constructor;
        if (c === b.constructor) {
          if (c === Array) {
            return b.concat(a);
          }
          if (c === Map) {
            var g = new Map(b);
            for (var e of a) {
              g.set(e[0], e[1]);
            }
            return g;
          }
          if (c === Set) {
            e = new Set(b);
            for (g of a.values()) {
              e.add(g);
            }
            return e;
          }
        }
      }
      return a;
    }
    return b;
  }
  return "undefined" === d ? c : a;
}
function w() {
  return Object.create(null);
}
;const A = /[^\p{L}\p{N}]+/u, B = /(\d{3})/g, C = /(\D)(\d{3})/g, D = /(\d{3})(\D)/g, E = /[\u0300-\u036f]/g;
function F(a = {}) {
  if (!this || this.constructor !== F) {
    return new F(...arguments);
  }
  if (arguments.length) {
    for (a = 0; a < arguments.length; a++) {
      this.assign(arguments[a]);
    }
  } else {
    this.assign(a);
  }
}
r = F.prototype;
r.assign = function(a) {
  this.normalize = u(a.normalize, !0, this.normalize);
  let c = a.include, b = c || a.exclude || a.split, f;
  if (b || "" === b) {
    if ("object" === typeof b && b.constructor !== RegExp) {
      let d = "";
      f = !c;
      c || (d += "\\p{Z}");
      b.letter && (d += "\\p{L}");
      b.number && (d += "\\p{N}", f = !!c);
      b.symbol && (d += "\\p{S}");
      b.punctuation && (d += "\\p{P}");
      b.control && (d += "\\p{C}");
      if (b = b.char) {
        d += "object" === typeof b ? b.join("") : b;
      }
      try {
        this.split = new RegExp("[" + (c ? "^" : "") + d + "]+", "u");
      } catch (g) {
        console.error("Your split configuration:", b, "is not supported on this platform. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
      }
    } else {
      this.split = b, f = !1 === b || 2 > "a1a".split(b).length;
    }
    this.numeric = u(a.numeric, f);
  } else {
    try {
      this.split = u(this.split, A);
    } catch (d) {
      console.warn("This platform does not support unicode regex. It falls back to using simple whitespace splitter instead: /s+/."), this.split = /\s+/;
    }
    this.numeric = u(a.numeric, u(this.numeric, !0));
  }
  this.prepare = u(a.prepare, null, this.prepare);
  this.finalize = u(a.finalize, null, this.finalize);
  b = a.filter;
  this.filter = "function" === typeof b ? b : u(b && new Set(b), null, this.filter);
  this.dedupe = u(a.dedupe, !0, this.dedupe);
  this.matcher = u((b = a.matcher) && new Map(b), null, this.matcher);
  this.mapper = u((b = a.mapper) && new Map(b), null, this.mapper);
  this.stemmer = u((b = a.stemmer) && new Map(b), null, this.stemmer);
  this.replacer = u(a.replacer, null, this.replacer);
  this.minlength = u(a.minlength, 1, this.minlength);
  this.maxlength = u(a.maxlength, 1024, this.maxlength);
  this.rtl = u(a.rtl, !1, this.rtl);
  if (this.cache = b = u(a.cache, !0, this.cache)) {
    this.l = null, this.A = "number" === typeof b ? b : 2e5, this.i = new Map(), this.j = new Map(), this.o = this.m = 128;
  }
  this.g = "";
  this.s = null;
  this.h = "";
  this.u = null;
  if (this.matcher) {
    for (const d of this.matcher.keys()) {
      this.g += (this.g ? "|" : "") + d;
    }
  }
  if (this.stemmer) {
    for (const d of this.stemmer.keys()) {
      this.h += (this.h ? "|" : "") + d;
    }
  }
  return this;
};
r.addStemmer = function(a, c) {
  this.stemmer || (this.stemmer = new Map());
  this.stemmer.set(a, c);
  this.h += (this.h ? "|" : "") + a;
  this.u = null;
  this.cache && G(this);
  return this;
};
r.addFilter = function(a) {
  "function" === typeof a ? this.filter = a : (this.filter || (this.filter = new Set()), this.filter.add(a));
  this.cache && G(this);
  return this;
};
r.addMapper = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (1 < a.length) {
    return this.addMatcher(a, c);
  }
  this.mapper || (this.mapper = new Map());
  this.mapper.set(a, c);
  this.cache && G(this);
  return this;
};
r.addMatcher = function(a, c) {
  if ("object" === typeof a) {
    return this.addReplacer(a, c);
  }
  if (2 > a.length && (this.dedupe || this.mapper)) {
    return this.addMapper(a, c);
  }
  this.matcher || (this.matcher = new Map());
  this.matcher.set(a, c);
  this.g += (this.g ? "|" : "") + a;
  this.s = null;
  this.cache && G(this);
  return this;
};
r.addReplacer = function(a, c) {
  if ("string" === typeof a) {
    return this.addMatcher(a, c);
  }
  this.replacer || (this.replacer = []);
  this.replacer.push(a, c);
  this.cache && G(this);
  return this;
};
r.encode = function(a, c) {
  if (this.cache && a.length <= this.m) {
    if (this.l) {
      if (this.i.has(a)) {
        return this.i.get(a);
      }
    } else {
      this.l = setTimeout(G, 50, this);
    }
  }
  this.normalize && ("function" === typeof this.normalize ? a = this.normalize(a) : a = E ? a.normalize("NFKD").replace(E, "").toLowerCase() : a.toLowerCase());
  this.prepare && (a = this.prepare(a));
  this.numeric && 3 < a.length && (a = a.replace(C, "$1 $2").replace(D, "$1 $2").replace(B, "$1 "));
  const b = !(this.dedupe || this.mapper || this.filter || this.matcher || this.stemmer || this.replacer);
  let f = [], d = w(), g = this.split || "" === this.split ? a.split(this.split) : [a];
  for (let k = 0, h, l; k < g.length; k++) {
    if ((h = l = g[k]) && !(h.length < this.minlength || h.length > this.maxlength || c && d[h])) {
      if (b) {
        c && (d[h] = 1), f.push(h);
      } else {
        if (!this.filter || ("function" === typeof this.filter ? this.filter(h) : !this.filter.has(h))) {
          if (this.cache && h.length <= this.o) {
            if (this.l) {
              var e = this.j.get(h);
              if (e || "" === e) {
                e && f.push(e);
                continue;
              }
            } else {
              this.l = setTimeout(G, 50, this);
            }
          }
          this.stemmer && 2 < h.length && (this.u || (this.u = new RegExp("(?!^)(" + this.h + ")$")), h = h.replace(this.u, n => this.stemmer.get(n)));
          if (h && (this.mapper || this.dedupe && 1 < h.length)) {
            e = "";
            for (let n = 0, v = "", x, p; n < h.length; n++) {
              x = h.charAt(n), x === v && this.dedupe || ((p = this.mapper && this.mapper.get(x)) || "" === p ? p === v && this.dedupe || !(v = p) || (e += p) : e += v = x);
            }
            h = e;
          }
          this.matcher && 1 < h.length && (this.s || (this.s = new RegExp("(" + this.g + ")", "g")), h = h.replace(this.s, n => this.matcher.get(n)));
          if (h && this.replacer) {
            for (e = 0; h && e < this.replacer.length; e += 2) {
              h = h.replace(this.replacer[e], this.replacer[e + 1]);
            }
          }
          this.cache && l.length <= this.o && (this.j.set(l, h), this.j.size > this.A && (this.j.clear(), this.o = this.o / 1.1 | 0));
          !h || c && d[h] || (c && (d[h] = 1), f.push(h));
        }
      }
    }
  }
  this.finalize && (f = this.finalize(f) || f);
  this.cache && a.length <= this.m && (this.i.set(a, f), this.i.size > this.A && (this.i.clear(), this.m = this.m / 1.1 | 0));
  return f;
};
function G(a) {
  a.l = null;
  a.i.clear();
  a.j.clear();
}
;function H(a, c, b) {
  if (!a.length) {
    return a;
  }
  if (1 === a.length) {
    return a = a[0], a = b || a.length > c ? c ? a.slice(b, b + c) : a.slice(b) : a;
  }
  let f = [];
  for (let d = 0, g, e; d < a.length; d++) {
    if ((g = a[d]) && (e = g.length)) {
      if (b) {
        if (b >= e) {
          b -= e;
          continue;
        }
        b < e && (g = c ? g.slice(b, b + c) : g.slice(b), e = g.length, b = 0);
      }
      e > c && (g = g.slice(0, c), e = c);
      if (!f.length && e >= c) {
        return g;
      }
      f.push(g);
      c -= e;
      if (!c) {
        break;
      }
    }
  }
  return f = 1 < f.length ? [].concat.apply([], f) : f[0];
}
;w();
I.prototype.remove = function(a, c) {
  const b = this.reg.size && (this.fastupdate ? this.reg.get(a) : this.reg.has(a));
  if (b) {
    if (this.fastupdate) {
      for (let f = 0, d; f < b.length; f++) {
        if (d = b[f]) {
          if (2 > d.length) {
            d.pop();
          } else {
            const g = d.indexOf(a);
            g === b.length - 1 ? d.pop() : d.splice(g, 1);
          }
        }
      }
    } else {
      J(this.map, a), this.depth && J(this.ctx, a);
    }
    c || this.reg.delete(a);
  }
  return this;
};
function J(a, c) {
  let b = 0;
  var f = "undefined" === typeof c;
  if (a.constructor === Array) {
    for (let d = 0, g, e; d < a.length; d++) {
      if ((g = a[d]) && g.length) {
        if (f) {
          b++;
        } else {
          if (e = g.indexOf(c), 0 <= e) {
            1 < g.length ? (g.splice(e, 1), b++) : delete a[d];
            break;
          } else {
            b++;
          }
        }
      }
    }
  } else {
    for (let d of a.entries()) {
      f = d[0];
      const g = J(d[1], c);
      g ? b += g : a.delete(f);
    }
  }
  return b;
}
;const K = {memory:{resolution:1}, performance:{resolution:3, fastupdate:!0, context:{depth:1, resolution:1}}, match:{tokenize:"forward"}, score:{resolution:9, context:{depth:2, resolution:3}}};
I.prototype.add = function(a, c, b, f) {
  if (c && (a || 0 === a)) {
    if (!f && !b && this.reg.has(a)) {
      return this.update(a, c);
    }
    f = this.depth;
    c = this.encoder.encode(c, !f);
    const l = c.length;
    if (l) {
      const n = w(), v = w(), x = this.resolution;
      for (let p = 0; p < l; p++) {
        let m = c[this.rtl ? l - 1 - p : p];
        var d = m.length;
        if (d && (f || !v[m])) {
          var g = this.score ? this.score(c, m, p, null, 0) : L(x, l, p), e = "";
          switch(this.tokenize) {
            case "full":
              if (2 < d) {
                for (let q = 0, t; q < d; q++) {
                  for (g = d; g > q; g--) {
                    e = m.substring(q, g);
                    t = this.rtl ? d - 1 - q : q;
                    var k = this.score ? this.score(c, m, p, e, t) : L(x, l, p, d, t);
                    M(this, v, e, k, a, b);
                  }
                }
                break;
              }
            case "bidirectional":
            case "reverse":
              if (1 < d) {
                for (k = d - 1; 0 < k; k--) {
                  e = m[this.rtl ? d - 1 - k : k] + e;
                  var h = this.score ? this.score(c, m, p, e, k) : L(x, l, p, d, k);
                  M(this, v, e, h, a, b);
                }
                e = "";
              }
            case "forward":
              if (1 < d) {
                for (k = 0; k < d; k++) {
                  e += m[this.rtl ? d - 1 - k : k], M(this, v, e, g, a, b);
                }
                break;
              }
            default:
              if (M(this, v, m, g, a, b), f && 1 < l && p < l - 1) {
                for (d = w(), e = this.v, g = m, k = Math.min(f + 1, this.rtl ? p + 1 : l - p), d[g] = 1, h = 1; h < k; h++) {
                  if ((m = c[this.rtl ? l - 1 - p - h : p + h]) && !d[m]) {
                    d[m] = 1;
                    const q = this.score ? this.score(c, g, p, m, h - 1) : L(e + (l / 2 > e ? 0 : 1), l, p, k - 1, h - 1), t = this.bidirectional && m > g;
                    M(this, n, t ? g : m, q, a, b, t ? m : g);
                  }
                }
              }
          }
        }
      }
      this.fastupdate || this.reg.add(a);
    }
  }
  return this;
};
function M(a, c, b, f, d, g, e) {
  let k = e ? a.ctx : a.map, h;
  if (!c[b] || e && !(h = c[b])[e]) {
    e ? (c = h || (c[b] = w()), c[e] = 1, (h = k.get(e)) ? k = h : k.set(e, k = new Map())) : c[b] = 1, (h = k.get(b)) ? k = h : k.set(b, k = []), k = k[f] || (k[f] = []), g && k.includes(d) || (k.push(d), a.fastupdate && ((c = a.reg.get(d)) ? c.push(k) : a.reg.set(d, [k])));
  }
}
function L(a, c, b, f, d) {
  return b && 1 < a ? c + (f || 0) <= a ? b + (d || 0) : (a - 1) / (c + (f || 0)) * (b + (d || 0)) + 1 | 0 : 0;
}
;I.prototype.search = function(a, c, b) {
  b || (c || "object" !== typeof a ? "object" === typeof c && (b = c, c = 0) : (b = a, a = ""));
  var f = [], d = 0;
  if (b) {
    a = b.query || a;
    c = b.limit || c;
    d = b.offset || 0;
    var g = b.context;
    var e = b.suggest;
    var k = !0;
    var h = b.resolution;
  } else {
    k = !0;
  }
  g = this.depth && !1 !== g;
  a = this.encoder.encode(a, !g);
  b = a.length;
  c = c || (k ? 100 : 0);
  if (1 === b) {
    return e = d, (d = N(this, a[0], "")) && d.length ? H.call(this, d, c, e) : [];
  }
  if (2 === b && g && !e) {
    return e = d, (d = N(this, a[1], a[0])) && d.length ? H.call(this, d, c, e) : [];
  }
  k = w();
  var l = 0;
  if (g) {
    var n = a[0];
    l = 1;
  }
  h || 0 === h || (h = n ? this.v : this.resolution);
  for (let m, q; l < b; l++) {
    if ((q = a[l]) && !k[q]) {
      k[q] = 1;
      m = N(this, q, n);
      a: {
        g = m;
        var v = f, x = e, p = h;
        let t = [];
        if (g && g.length) {
          if (g.length <= p) {
            v.push(g);
            m = void 0;
            break a;
          }
          for (let y = 0, z; y < p; y++) {
            if (z = g[y]) {
              t[y] = z;
            }
          }
          if (t.length) {
            v.push(t);
            m = void 0;
            break a;
          }
        }
        m = x ? void 0 : t;
      }
      if (m) {
        f = m;
        break;
      }
      n && (e && m && f.length || (n = q));
    }
    e && n && l === b - 1 && !f.length && (h = this.resolution, n = "", l = -1, k = w());
  }
  a: {
    a = f;
    f = a.length;
    n = a;
    if (1 < f) {
      b: {
        f = e;
        n = a.length;
        e = [];
        b = w();
        for (let m = 0, q, t, y, z; m < h; m++) {
          for (l = 0; l < n; l++) {
            if (y = a[l], m < y.length && (q = y[m])) {
              for (g = 0; g < q.length; g++) {
                if (t = q[g], (k = b[t]) ? b[t]++ : (k = 0, b[t] = 1), z = e[k] || (e[k] = []), z.push(t), c && k === n - 1 && z.length - d === c) {
                  n = d ? z.slice(d) : z;
                  break b;
                }
              }
            }
          }
        }
        if (a = e.length) {
          if (f) {
            if (1 < e.length) {
              c: {
                for (a = [], h = w(), f = e.length, k = f - 1; 0 <= k; k--) {
                  if (b = (f = e[k]) && f.length) {
                    for (l = 0; l < b; l++) {
                      if (n = f[l], !h[n]) {
                        if (h[n] = 1, d) {
                          d--;
                        } else {
                          if (a.push(n), a.length === c) {
                            break c;
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              a = (e = e[0]).length > c || d ? e.slice(d, c + d) : e;
            }
            e = a;
          } else {
            if (a < n) {
              n = [];
              break b;
            }
            e = e[a - 1];
            if (c || d) {
              if (e.length > c || d) {
                e = e.slice(d, c + d);
              }
            }
          }
        }
        n = e;
      }
    } else if (1 === f) {
      c = H.call(null, a[0], c, d);
      break a;
    }
    c = n;
  }
  return c;
};
function N(a, c, b) {
  let f;
  b && (f = a.bidirectional && c > b) && (f = b, b = c, c = f);
  a = b ? (a = a.ctx.get(b)) && a.get(c) : a.map.get(c);
  return a;
}
;function I(a, c) {
  if (!this || this.constructor !== I) {
    return new I(a);
  }
  if (a) {
    var b = "string" === typeof a ? a : a.preset;
    b && (K[b] || console.warn("Preset not found: " + b), a = Object.assign({}, K[b], a));
  } else {
    a = {};
  }
  b = a.context;
  const f = !0 === b ? {depth:1} : b || {}, d = a.encode || a.encoder || {};
  this.encoder = d.encode ? d : "object" === typeof d ? new F(d) : {encode:d};
  this.resolution = a.resolution || 9;
  this.tokenize = b = (b = a.tokenize) && "default" !== b && "exact" !== b && b || "strict";
  this.depth = "strict" === b && f.depth || 0;
  this.bidirectional = !1 !== f.bidirectional;
  this.fastupdate = !!a.fastupdate;
  this.score = a.score || null;
  f && f.depth && "strict" !== this.tokenize && console.warn('Context-Search could not applied, because it is just supported when using the tokenizer "strict".');
  this.map = new Map();
  this.ctx = new Map();
  this.reg = c || (this.fastupdate ? new Map() : new Set());
  this.v = f.resolution || 3;
  this.rtl = d.rtl || a.rtl || !1;
}
r = I.prototype;
r.clear = function() {
  this.map.clear();
  this.ctx.clear();
  this.reg.clear();
  return this;
};
r.append = function(a, c) {
  return this.add(a, c, !0);
};
r.contain = function(a) {
  return this.reg.has(a);
};
r.update = function(a, c) {
  const b = this, f = this.remove(a);
  return f && f.then ? f.then(() => b.add(a, c)) : this.add(a, c);
};
r.cleanup = function() {
  if (!this.fastupdate) {
    return console.info('Cleanup the index isn\'t required when not using "fastupdate".'), this;
  }
  J(this.map);
  this.depth && J(this.ctx);
  return this;
};
w();
export default {Index:I, Charset:null, Encoder:F, Document:null, Worker:null, Resolver:null, IndexedDB:null, Language:{}};

export const Index=I;export const  Charset=null;export const  Encoder=F;export const  Document=null;export const  Worker=null;export const  Resolver=null;export const  IndexedDB=null;export const  Language={};