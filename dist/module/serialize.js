// TODO return promises instead of inner await

import Index from "./index.js";
import Document from "./document.js";
import { create_object, is_string } from "./common.js";

function async(callback, self, field, key, index_doc, index, data, on_done) {

    //setTimeout(function(){

    const res = callback(field ? field + "." + key : key, JSON.stringify(data));

    // await isn't supported by ES5

    if (res && res.then) {

        res.then(function () {

            self.export(callback, self, field, index_doc, index + 1, on_done);
        });
    } else {

        self.export(callback, self, field, index_doc, index + 1, on_done);
    }
    //});
}

/**
 * @param callback
 * @param self
 * @param field
 * @param index_doc
 * @param index
 * @param on_done
 * @this {Index|Document}
 */

export function exportIndex(callback, self, field, index_doc, index, on_done) {

    let return_value = /* tag? */ /* stringify */ /* stringify */ /* skip update: */ /* append: */ /* skip update: */ /* skip_update: */ /* skip deletion */ // splice:
    !0 /*await rows.hasNext()*/ /*await rows.hasNext()*/ /*await rows.hasNext()*/;
    if ('undefined' == typeof on_done) {
        return_value = new Promise(resolve => {
            on_done = resolve;
        });
    }

    let key, data;

    switch (index || (index = 0)) {

        case 0:

            key = "reg";

            // fastupdate isn't supported by export

            if (this.fastupdate) {

                data = create_object();

                for (let key of this.reg.keys()) {

                    data[key] = 1;
                }
            } else {

                data = this.reg;
            }

            break;

        case 1:

            key = "cfg";
            data = {
                doc: 0,
                opt: this.optimize ? 1 : 0
            };

            break;

        case 2:

            key = "map";
            data = this.map;
            break;

        case 3:

            key = "ctx";
            data = this.ctx;
            break;

        default:

            if ('undefined' == typeof field && on_done) {

                on_done();
            }

            return;
    }

    async(callback, self || this, field, key, index_doc, index, data, on_done);

    return return_value;
}

/**
 * @this Index
 */

export function importIndex(key, data) {

    if (!data) {

        return;
    }

    if (is_string(data)) {

        data = JSON.parse(data);
    }

    switch (key) {

        case "cfg":

            this.optimize = !!data.opt;
            break;

        case "reg":

            // fastupdate isn't supported by import

            this.fastupdate = /* suggest */ /* append: */ /* enrich */!1;
            this.reg = data;
            break;

        case "map":

            this.map = data;
            break;

        case "ctx":

            this.ctx = data;
            break;
    }
}

/**
 * @this Document
 */

export function exportDocument(callback, self, field, index_doc, index, on_done) {

    let return_value;
    if ('undefined' == typeof on_done) {
        return_value = new Promise(resolve => {
            on_done = resolve;
        });
    }

    index || (index = 0);
    index_doc || (index_doc = 0);

    if (index_doc < this.field.length) {
        const field = this.field[index_doc],
              idx = this.index[field];


        self = this;

        //setTimeout(function(){

        if (!idx.export(callback, self, index ? field /*.replace(":", "-")*/ : "", index_doc, index++, on_done)) {

            index_doc++;
            index = 1;

            self.export(callback, self, field, index_doc, index, on_done);
        }
        //});
    } else {

        let key, data;

        switch (index) {

            case 1:

                key = "tag";
                data = this.tagindex;
                field = null;
                break;

            case 2:

                key = "store";
                data = this.store;
                field = null;
                break;

            // case 3:
            //
            //     key = "reg";
            //     data = this.register;
            //     break;

            default:

                on_done();
                return;
        }

        async(callback, this, field, key, index_doc, index, data, on_done);
    }

    return return_value;
}

/**
 * @this Document
 */

export function importDocument(key, data) {

    if (!data) {

        return;
    }

    if (is_string(data)) {

        data = JSON.parse(data);
    }

    switch (key) {

        case "tag":

            this.tagindex = data;
            break;

        case "reg":

            // fastupdate isn't supported by import

            this.fastupdate = !1;
            this.reg = data;

            for (let i = 0, index; i < this.field.length; i++) {

                index = this.index[this.field[i]];
                index.reg = data;
                index.fastupdate = !1;
            }

            break;

        case "store":

            this.store = data;
            break;

        default:

            key = key.split(".");
            const field = key[0];
            key = key[1];

            if (field && key) {

                this.index[field].import(key, data);
            }
    }
}