import { create_object } from "./common.js";

/**
 * @param bitlength
 * @constructor
 */

export function KeystoreObj(bitlength = 8) {

    if (!this) {
        return new KeystoreObj(bitlength);
    }

    this.index = create_object();
    this.keys = [];

    if (32 < bitlength) {
        this.crc = lcg64;
        this.bit = BigInt(bitlength);
    } else {
        this.crc = lcg;
        this.bit = bitlength;
    }

    return (/*this.proxy =*/new Proxy(this, {
            get(target, key) {
                const address = target.crc(key),
                      obj = target.index[address];

                return obj && obj[key];
            },
            set(target, key, value) {
                const address = target.crc(key);
                let obj = target.index[address];
                if (!obj) {
                    target.index[address] = obj = create_object();
                    target.keys.push(address);
                }
                obj[key] = value;
                return (/* tag? */ /* stringify */ /* stringify */ /* skip update: */ /* append: */ /* skip update: */ /* skip_update: */ /* skip deletion */
                    // splice:
                    !0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/
                );
            },
            delete(target, key) {
                const address = target.crc(key),
                      obj = target.index[address];

                obj && delete obj[key];
                return !0;
            }
        })
    );
}

KeystoreObj.prototype.clear = function () {
    this.index = create_object();
    this.keys = [];
};

// KeystoreObj.prototype.destroy = function(){
//     this.index = null;
//     this.keys = null;
//     this.proxy = null;
// };

function _slice(self, start, end, splice) {
    let arr = [];
    for (let i = 0, index; i < self.index.length; i++) {
        index = self.index[i];
        if (start >= index.length) {
            start -= index.length;
        } else {
            const tmp = index[splice ? "splice" : "slice"](start, end),
                  length = tmp.length;

            if (length) {
                arr = arr.length ? arr.concat(tmp) : tmp;
                end -= length;
                if (splice) self.length -= length;
                if (!end) break;
            }
            start = 0;
        }
    }
    return arr;
}

/**
 * @param arr
 * @constructor
 */

export function KeystoreArray(arr) {

    if (!this) {
        return new KeystoreArray(arr);
    }

    this.index = arr ? [arr] : [];
    this.length = arr ? arr.length : 0;
    const self = this;

    return (/*this.proxy =*/new Proxy([], {
            get(target, key) {
                if ("length" === key) {
                    return self.length;
                }
                if ("push" === key) {
                    return function (value) {
                        self.index[self.index.length - 1].push(value);
                        self.length++;
                    };
                }
                if ("pop" === key) {
                    return function () {
                        if (self.length) {
                            self.length--;
                            return self.index[self.index.length - 1].pop();
                        }
                    };
                }
                if ("indexOf" === key) {
                    return function (key) {
                        let index = 0;
                        for (let i = 0, arr, tmp; i < self.index.length; i++) {
                            arr = self.index[i];
                            //if(!arr.includes(key)) continue;
                            tmp = arr.indexOf(key);
                            if (0 <= tmp) return index + tmp;
                            index += arr.length;
                        }
                        return -1;
                    };
                }
                if ("includes" === key) {
                    return function (key) {
                        for (let i = 0; i < self.index.length; i++) {
                            if (self.index[i].includes(key)) {
                                return !0;
                            }
                        }
                        return (/* suggest */ /* append: */ /* enrich */!1
                        );
                    };
                }
                if ("slice" === key) {
                    return function (start, end) {
                        return _slice(self, start || 0, end || self.length, !1);
                    };
                }
                if ("splice" === key) {
                    return function (start, end) {
                        return _slice(self, start || 0, end || self.length, !0);
                    };
                }
                if ("constructor" === key) {
                    return Array;
                }
                if ("symbol" == typeof key /*|| isNaN(key)*/) {
                        // not supported
                        return;
                    }
                const arr = self.index[0 | key / 2147483648];

                return arr && arr[key];
            },
            set(target, key, value) {
                const index = 0 | key / 2147483648,
                      arr = self.index[index] || (self.index[index] = []);

                arr[key] = value;
                self.length++;
                return !0;
            }
        })
    );
}

KeystoreArray.prototype.clear = function () {
    this.index.length = 0;
};

KeystoreArray.prototype.destroy = function () {
    this.index = null;
    this.proxy = null;
};

KeystoreArray.prototype.push = function () {};

/**
 * @param bitlength
 * @constructor
 */

export function KeystoreMap(bitlength = 8) {

    if (!this) {
        return new KeystoreMap(bitlength);
    }

    this.index = create_object();
    this.refs = [];
    this.size = 0;

    if (32 < bitlength) {
        this.crc = lcg64;
        this.bit = BigInt(bitlength);
    } else {
        this.crc = lcg;
        this.bit = bitlength;
    }
}

KeystoreMap.prototype.get = function (key) {
    const address = this.crc(key),
          map = this.index[address];

    return map && map.get(key);
};

KeystoreMap.prototype.set = function (key, value) {
    const address = this.crc(key);
    let map = this.index[address];
    if (map) {
        let size = map.size;
        map.set(key, value);
        size -= map.size;
        size && this.size++;
    } else {
        this.index[address] = map = new Map([[key, value]]);
        this.refs.push(map);
    }
};

/**
 * @param bitlength
 * @constructor
 */

export function KeystoreSet(bitlength = 8) {

    if (!this) {
        return new KeystoreSet(bitlength);
    }

    // using plain Object with numeric key access
    // just for max performance
    this.index = create_object();
    this.refs = [];

    if (32 < bitlength) {
        this.crc = lcg64;
        this.bit = BigInt(bitlength);
    } else {
        this.crc = lcg;
        this.bit = bitlength;
    }
}

KeystoreSet.prototype.add = function (key) {
    const address = this.crc(key);
    let set = this.index[address];
    if (set) {
        let size = set.size;
        set.add(key);
        size -= set.size;
        size && this.size++;
    } else {
        this.index[address] = set = new Set([key]);
        this.refs.push(set);
    }
};

KeystoreMap.prototype.has = KeystoreSet.prototype.has = function (key) {
    const address = this.crc(key),
          map_or_set = this.index[address];

    return map_or_set && map_or_set.has(key);
};

/*
KeystoreMap.prototype.size =
KeystoreSet.prototype.size = function(){
    let size = 0;
    const values = Object.values(this.index);
    for(let i = 0; i < values.length; i++){
        size += values[i].size;
    }
    return size;
};
*/

KeystoreMap.prototype.delete = KeystoreSet.prototype.delete = function (key) {
    const address = this.crc(key),
          map_or_set = this.index[address];

    // set && (set.size === 1
    //     ? this.index.delete(address)
    //     : set.delete(key));
    map_or_set && map_or_set.delete(key) && this.size--;
};

KeystoreMap.prototype.clear = KeystoreSet.prototype.clear = function () {
    this.index = create_object();
    this.refs = [];
    this.size = 0;
};

// KeystoreMap.prototype.destroy =
// KeystoreSet.prototype.destroy = function(){
//     this.index = null;
//     this.refs = null;
//     this.proxy = null;
// };

KeystoreMap.prototype.values = KeystoreSet.prototype.values = function* () {
    // alternatively iterate through this.keys[]
    //const refs = Object.values(this.index);
    for (let i = 0; i < this.refs.length; i++) {
        for (let value of this.refs[i].values()) {
            yield value;
        }
    }
};

KeystoreMap.prototype.keys = KeystoreSet.prototype.keys = function* () {
    //const values = Object.values(this.index);
    for (let i = 0; i < this.refs.length; i++) {
        for (let key of this.refs[i].keys()) {
            yield key;
        }
    }
};

KeystoreMap.prototype.entries = KeystoreSet.prototype.entries = function* () {
    //const values = Object.values(this.index);
    for (let i = 0; i < this.refs.length; i++) {
        for (let entry of this.refs[i].entries()) {
            yield entry;
        }
    }
};

/**
 * Linear Congruential Generator (LCG)
 * @param str
 * @this {KeystoreMap|KeystoreSet}
 */

function lcg(str) {
    let range = 2 ** this.bit - 1;
    if ("number" == typeof str) {
        return str & range;
    }
    let crc = 0,
        bit = this.bit + 1;
    for (let i = 0; i < str.length; i++) {
        crc = (crc * bit ^ str.charCodeAt(i)) & range;
    }
    // shift Int32 to UInt32 because negative numbers
    // extremely slows down key lookup
    return 32 === this.bit ? crc + 2147483648 : crc; // & 0xFFFF;
}

/**
 * @param str
 * @this {KeystoreMap|KeystoreSet}
 */

function lcg64(str) {
    let range = BigInt(2) ** /** @type {!BigInt} */this.bit - BigInt(1),
        type = typeof str;

    if ("bigint" == type) {
        return (/** @type {!BigInt} */str & range
        );
    }
    if ("number" == type) {
        return BigInt(str) & range;
    }
    let crc = BigInt(0),
        bit = /** @type {!BigInt} */this.bit + BigInt(1);
    for (let i = 0; i < str.length; i++) {
        crc = (crc * bit ^ BigInt(str.charCodeAt(i))) & range;
    }
    return crc; // & 0xFFFFFFFFFFFFFFFF;
}