// COMPILER BLOCK -->
import { DEBUG } from "../../config.js";
// <-- COMPILER BLOCK
import { ClickHouse } from "clickhouse";
import StorageInterface from "../interface.js";
import Document from "../../document.js";
import { concat, toArray } from "../../common.js";
const defaults = {
    host: "http://localhost",
    port: "8123",
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    trimQuery: false,
    usePost: false,
    format: "json",
    raw: false,
    config: {
        output_format_json_quote_64bit_integers: 0,
        enable_http_compression: 0,
        database: "default"
    }
};

const VERSION = 1;
const fields = ["map", "ctx", "tag", "reg", "cfg"];
const types = {
    "text": "String",
    "char": "String",
    "varchar": "String",
    "string": "String",
    "number": "Int32",
    "numeric": "Int32",
    "integer": "Int32",
    "smallint": "Int16",
    "tinyint": "Int8",
    "mediumint": "Int32",
    "int": "Int32",
    "int8": "Int8",
    "uint8": "UInt8",
    "int16": "Int16",
    "uint16": "UInt16",
    "int32": "Int32",
    "uint32": "UInt32",
    "int64": "Int64",
    "uint64": "UInt64",
    "bigint": "Int64"
};

function sanitize(str) {
    return str.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

let DB;

/**
 * @constructor
 * @implements StorageInterface
 */

export default function ClickhouseDB(name, config = {}){
    if(!(this instanceof ClickhouseDB)){
        return new ClickhouseDB(name, config);
    }
    if(typeof name === "object"){
        name = name.name;
        config = name;
    }
    if(!name){
        console.info("Default storage space was used, because a name was not passed.");
    }
    //field = "Test-456";
    this.id = "flexsearch" + (name ? "_" + sanitize(name) : "");
    this.field = config.field ? "_" + sanitize(config.field) : "";
    // Clickhouse does not support ALTER TABLE to upgrade
    // the type of the ID when it is a part of the merge key
    this.type = config.type ? types[config.type.toLowerCase()] : "String";
    if(!this.type) throw new Error("Unknown type of ID '" + config.type + "'");
    //this.trx = false;
    this.support_tag_search = true;
    this.db = DB || (DB = config.db || null);
    Object.assign(defaults, config);
    config.database && (defaults.config.database = config.database);
    this.db && delete defaults.db;
};

ClickhouseDB.prototype.mount = function(flexsearch){
    if(flexsearch instanceof Document){
        return flexsearch.mount(this);
    }
    defaults.resolution = Math.max(flexsearch.resolution, flexsearch.resolution_ctx);
    flexsearch.db = this;
    return this.open();
};

ClickhouseDB.prototype.open = async function(){

    if(!this.db) {
        this.db = DB || (
            DB = new ClickHouse(defaults)
        );
    }

    const exists = await this.db.query(`
        SELECT 1 FROM system.databases WHERE name = '${this.id}';
    `).toPromise();

    if(!exists || !exists.length){
        await this.db.query(`
            CREATE DATABASE IF NOT EXISTS ${this.id};
        `).toPromise();
    }

    for(let i = 0; i < fields.length; i++){
        switch(fields[i]){
            case "map":
                await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.map${this.field}(
                        key String,
                        res ${defaults.resolution <= 255 ? "UInt8" : "UInt16"},
                        id  ${this.type}
                    )
                    ENGINE = MergeTree
                    /*PRIMARY KEY (key)*/
                    ORDER BY (key, id);
                `, { params: { name: this.id + ".map" + this.field }}).toPromise();
                break;

            case "ctx":
                await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.ctx${this.field}(
                        ctx String,
                        key String,
                        res ${defaults.resolution <= 255 ? "UInt8" : "UInt16"},
                        id  ${this.type}
                    )
                    ENGINE = MergeTree
                    /*PRIMARY KEY (ctx, key)*/
                    ORDER BY (ctx, key, id);
                `).toPromise();
                break;

            case "tag":
                await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.tag${this.field}(
                        tag String,
                        id  ${this.type}
                    )
                    ENGINE = MergeTree
                    /*PRIMARY KEY (ctx, key)*/
                    ORDER BY (tag, id);
                `).toPromise();
                break;

            case "reg":
                await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.reg(
                        id  ${this.type},
                        doc Nullable(String)
                    )
                    ENGINE = MergeTree
                    ORDER BY (id);
                `).toPromise();
                break;

            case "cfg":
                await this.db.query(`
                    CREATE TABLE IF NOT EXISTS ${this.id}.cfg${this.field}(
                        cfg String
                    ) 
                    ENGINE = TinyLog;
                `).toPromise();
                break;
        }
    }

    return this.db;
};

ClickhouseDB.prototype.close = function(){
    this.db.close();
    this.db = null;
    return this;
};

ClickhouseDB.prototype.destroy = async function(){
    await Promise.all([
        this.db.query(`DROP TABLE ${this.id}.map${this.field};`).toPromise(),
        this.db.query(`DROP TABLE ${this.id}.ctx${this.field};`).toPromise(),
        this.db.query(`DROP TABLE ${this.id}.tag${this.field};`).toPromise(),
        this.db.query(`DROP TABLE ${this.id}.cfg${this.field};`).toPromise(),
        this.db.query(`DROP TABLE ${this.id}.reg;`).toPromise()
    ]);
    this.close();
};

ClickhouseDB.prototype.clear = function(){
    return Promise.all([
        this.db.query(`TRUNCATE TABLE ${this.id}.map${this.field};`).toPromise(),
        this.db.query(`TRUNCATE TABLE ${this.id}.ctx${this.field};`).toPromise(),
        this.db.query(`TRUNCATE TABLE ${this.id}.tag${this.field};`).toPromise(),
        this.db.query(`TRUNCATE TABLE ${this.id}.cfg${this.field};`).toPromise(),
        this.db.query(`TRUNCATE TABLE ${this.id}.reg;`).toPromise()
    ]);
};

function create_result(rows, resolve, enrich){
    if(resolve){
        for(let i = 0; i < rows.length; i++){
            if(enrich){
                if(rows[i].doc){
                    rows[i].doc = JSON.parse(rows[i].doc);
                }
            }
            else{
                rows[i] = rows[i].id;
            }
        }
        return rows;
    }
    else{
        const arr = [];
        for(let i = 0, row; i < rows.length; i++){
            row = rows[i];
            arr[row.res] || (arr[row.res] = []);
            arr[row.res].push(enrich
                ? row
                : row.id
            );
        }
        return arr;
    }
}

ClickhouseDB.prototype.get = function(key, ctx, limit = 0, offset = 0, resolve = true, enrich = false, tags){
    let rows;
    let stmt = '';
    let params = ctx ? { ctx, key } : { key };
    let table = this.id + (ctx ? ".ctx" : ".map") + this.field;
    if(tags){
        for(let i = 0, count = 1; i < tags.length; i+=2){
            stmt += ` AND ${ table }.id IN (SELECT id FROM ${ this.id }.tag_${ sanitize(tags[i]) } WHERE tag = {tag${ count }:String})`;
            params["tag" + count] = tags[i + 1];
            count++;
        }
    }
    if(ctx){
        rows = this.db.query(`
            SELECT ${ table }.id
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM ${ table }
            ${ enrich ? `
                LEFT OUTER JOIN ${ this.id }.reg ON ${ this.id }.reg.id = ${ table }.id
            ` : "" }
            WHERE ctx = {ctx:String} AND key = {key:String} 
            ORDER BY res
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }`,
            { params }
        ).toPromise();
    }
    else{
        rows = this.db.query(`
            SELECT ${ table }.id
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM ${ table }
            ${ enrich ? `
                LEFT OUTER JOIN ${ this.id }.reg ON ${ this.id }.reg.id = ${ table }.id
            ` : "" }
            WHERE key = {key:String}
            ORDER BY res
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }`,
            { params }
        ).toPromise();
    }
    return rows.then(function(rows){
        return create_result(rows, resolve, enrich);
    });
};

ClickhouseDB.prototype.tag = function(tag, limit = 0, offset = 0, enrich = false){
    const table = this.id + ".tag" + this.field;
    const promise = this.db.query(`
        SELECT ${ table }.id
               ${ enrich ? ", doc" : "" }
        FROM ${ table } 
        ${ enrich ? `
            LEFT OUTER JOIN ${ this.id }.reg ON ${ this.id }.reg.id = ${ table }.id
        ` : "" }
        WHERE tag = {tag:String}
        ${ limit ? "LIMIT " + limit : "" } 
        ${ offset ? "OFFSET " + offset : "" }`,
        { params: { tag } }
    ).toPromise();
    enrich || promise.then(function(rows){
        return create_result(rows, true, false);
    });
    return promise;
}

ClickhouseDB.prototype.enrich = async function(ids){
    let MAXIMUM_QUERY_VARS = 1e5;
    let result = [];
    if(typeof ids !== "object"){
        ids = [ids];
    }
    for(let count = 0; count < ids.length;){
        const chunk = ids.length - count > MAXIMUM_QUERY_VARS
            ? ids.slice(count, count + MAXIMUM_QUERY_VARS)
            : count ? ids.slice(count) : ids;
        count += chunk.length;
        let params = {};
        let stmt = "";
        for(let i = 0; i < chunk.length; i++){
            stmt += (stmt ? "," : "") + "{id" + (i + 1) + ":String}";
            params["id" + (i + 1)] = chunk[i];
        }
        const res = await this.db.query(`
            SELECT id, doc 
            FROM ${ this.id }.reg
            WHERE id IN (${ stmt })`,
            { params }
        ).toPromise();
        if(res && res.length){
            for(let i = 0, doc; i < res.length; i++){
                if((doc = res[i].doc)){
                    res[i].doc = JSON.parse(doc);
                }
            }
            result.push(res);
        }
    }
    return result.length === 1
        ? result[0]
        : result.length > 1
            ? concat(result)
            : result;
}

ClickhouseDB.prototype.has = function(id){
    return this.db.query(`
        SELECT EXISTS(
            SELECT 1
            FROM ${this.id}.reg
            WHERE id = {id:${this.type /*=== "number" ? "Int32" : "String"*/}}
            LIMIT 1
        )`,
        { params: { id }}
    ).toPromise();
};

ClickhouseDB.prototype.search = function(flexsearch, query, limit = 100, offset = 0, suggest = false, resolve = true, enrich = true, tags){
    let rows;
    if(query.length > 1 && flexsearch.depth){

        let where = "";
        let params = {};
        let keyword = query[0];
        let term;

        for(let i = 1; i < query.length; i++){
            term = query[i];
            const swap = flexsearch.bidirectional && (term > keyword);
            where += (where ? " OR " : "") + `(ctx = {ctx${ i }:String} AND key = {key${ i }:String})`
            params["ctx" + i] = swap ? term : keyword;
            params["key" + i] = swap ? keyword : term;
            keyword = term;
        }

        if(tags){
            where = "(" + where + ")";
            for(let i = 0, count = 1; i < tags.length; i+=2){
                where += ` AND id IN (SELECT id FROM ${ this.id }.tag_${ sanitize(tags[i]) } WHERE tag = {tag${ count }:String})`;
                params["tag" + count] = tags[i + 1];
                count++;
            }
        }

        rows = this.db.query(`
            SELECT r.id
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM (
                SELECT id, count(*) as count,
                       ${ suggest ? "SUM" : "MIN" }(res) as res
                FROM ${ this.id }.ctx${ this.field }
                WHERE ${ where }
                GROUP BY id
            ) as r
            ${ enrich ? `
                LEFT OUTER JOIN ${ this.id }.reg ON ${ this.id }.reg.id = r.id
            ` : "" }
            ${ suggest ? "" : "WHERE count = " + (query.length - 1) }
            ORDER BY ${ suggest ? "count DESC, res" : "res" }
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }
        `, { params }).toPromise();

        // for(let i = 1; i < query.length; i++){
        //     where += (where ? " UNION ALL " : "") + `
        //         SELECT id, res
        //         FROM ${this.id}.ctx${this.field}
        //         WHERE ctx = {ctx${i}:String} AND key = {key${i}:String}
        //     `;
        //     term = query[i];
        //     const swap = flexsearch.bidirectional && (term > keyword);
        //     params["ctx" + i] = swap ? term : keyword;
        //     params["key" + i] = swap ? keyword : term;
        //     keyword = term;
        // }
        //
        // rows = await this.db.query(`
        //     SELECT id, res
        //     FROM (
        //         SELECT id, ${suggest ? "SUM" : "MIN"}(res) as res, count(*) as count
        //         FROM (${where}) as t
        //         GROUP BY id
        //         ORDER BY ${suggest ? "count DESC, res" : "res"}
        //         LIMIT ${limit}
        //         OFFSET ${offset}
        //     ) as r
        //     ${suggest ? "" : "WHERE count = " + (query.length - 1)}
        // `, { params }).toPromise();
    }
    else{

        let where = "";
        let params = {};

        for(let i = 0; i < query.length; i++){
            where += (where ? "," : "") + `{key${i}:String}`;
            params["key" + i] = query[i];
        }
        where = "key " + (query.length > 1 ? "IN (" + where + ")" : "= " + where );

        if(tags){
            where = "(" + where + ")";
            for(let i = 0, count = 1; i < tags.length; i+=2){
                where += ` AND id IN (SELECT id FROM ${ this.id }.tag_${ sanitize(tags[i]) } WHERE tag = {tag${ count }:String})`;
                params["tag" + count] = tags[i + 1];
                count++;
            }
        }

        rows = this.db.query(`
            SELECT r.id
                   ${ resolve ? "" : ", res" }
                   ${ enrich ? ", doc" : "" }
            FROM (
                SELECT id, count(*) as count,
                       ${ suggest ? "SUM" : "MIN" }(res) as res
                FROM ${ this.id }.map${ this.field }
                WHERE ${ where }
                GROUP BY id
            ) as r
            ${ enrich ? `
                LEFT OUTER JOIN ${ this.id }.reg ON ${ this.id }.reg.id = r.id
            ` : "" }            
            ${ suggest ? "" : "WHERE count = " + query.length }
            ORDER BY ${ suggest ? "count DESC, res" : "res" }
            ${ limit ? "LIMIT " + limit : "" }
            ${ offset ? "OFFSET " + offset : "" }
        `, { params }).toPromise();

        // for(let i = 0; i < query.length; i++){
        //     params["key" + i] = query[i];
        //     where += (where ? " UNION ALL " : "") + `
        //         SELECT id, res
        //         FROM ${ this.id }.map${ this.field }
        //         WHERE key = {key${i}:String}
        //     `;
        // }
        // rows = await this.db.query(`
        //     SELECT id, res
        //     FROM (
        //         SELECT id, ${suggest ? "SUM" : "MIN"}(res) as res, count(*) as count
        //         FROM (${where}) as t
        //         GROUP BY id
        //         ORDER BY ${suggest ? "count DESC, res" : "res"}
        //         LIMIT ${limit}
        //         OFFSET ${offset}
        //     ) as r
        //     ${ suggest ? "" : "WHERE count = " + query.length }
        // `, { params }).toPromise();
    }
    return rows.then(function(rows){
        return create_result(rows, resolve, enrich);
    });
}

ClickhouseDB.prototype.info = function(){
    // todo
};

ClickhouseDB.prototype.transaction = function(task){

    // not supported
    return task.call(this);
};

ClickhouseDB.prototype.commit = async function(flexsearch, _replace, _append){

    // process cleanup tasks
    if(_replace){
        await this.clear();
        // there are just removals in the task queue
        flexsearch.commit_task = [];
    }
    else{
        let tasks = flexsearch.commit_task;
        flexsearch.commit_task = [];
        for(let i = 0, task; i < tasks.length; i++){
            task = tasks[i];
            // there are just removals in the task queue
            if(task.clear){
                await this.clear();
                _replace = true;
                break;
            }
            else{
                tasks[i] = task.del;
            }
        }
        if(!_replace){
            if(!_append){
                tasks = tasks.concat(toArray(flexsearch.reg));
            }
            tasks.length && await this.remove(tasks);
        }
    }
    if(!flexsearch.reg.size){
        return;
    }

    if(flexsearch.map.size){
        let data = [];
        for(const item of flexsearch.map){
            const key = item[0];
            const arr = item[1];
            for(let i = 0, ids; i < arr.length; i++){
                if((ids = arr[i]) && ids.length){
                    //this.type || (this.type = typeof ids[0]);
                    for(let j = 0; j < ids.length; j++){
                        data.push({
                            key: key,
                            res: i,
                            id: /*this.type === "number"
                            ? parseInt(ids[j], 10)
                            :*/ ids[j]
                        });
                    }
                }
            }
        }
        if(data.length){
            await this.db.insert(
                `INSERT INTO ${ this.id }.map${ this.field } (key, res, id)`, data
            ).toPromise();
        }
    }

    if(flexsearch.ctx.size){
        let data = [];
        for(const ctx of flexsearch.ctx){
            const ctx_key = ctx[0];
            const ctx_value = ctx[1];
            for(const item of ctx_value){
                const key = item[0];
                const arr = item[1];
                for(let i = 0, ids; i < arr.length; i++){
                    if((ids = arr[i]) && ids.length){
                        for(let j = 0; j < ids.length; j++){
                            data.push({
                                ctx: ctx_key,
                                key: key,
                                res: i,
                                id: /*this.type === "number"
                                ? parseInt(ids[j], 10)
                                :*/ ids[j]
                            });
                        }
                    }
                }
            }
        }
        if(data.length){
            await this.db.insert(
                `INSERT INTO ${ this.id }.ctx${ this.field } (ctx, key, res, id)`, data
            ).toPromise();
        }
    }

    if(flexsearch.tag){
        let data = [];
        for(const item of flexsearch.tag){
            const tag = item[0];
            const ids = item[1];
            if(!ids.length) continue;
            for(let j = 0; j < ids.length; j++){
                data.push({ tag, id: ids[j] });
            }
        }
        if(data.length){
            await this.db.insert(
                `INSERT INTO ${this.id}.tag${ this.field } (tag, id)`, data
            ).toPromise();
        }
    }

    if(flexsearch.store){
        let data = [];
        for(const item of flexsearch.store.entries()){
            const id = item[0];
            const doc = item[1];
            data.push({ id, doc: doc && JSON.stringify(doc) });
        }
        if(data.length){
            await this.db.insert(
                `INSERT INTO ${this.id}.reg (id, doc)`, data
            ).toPromise();
        }
    }
    else if(!flexsearch.bypass){
        let data = toArray(flexsearch.reg);
        for(let i = 0; i < data.length; i++){
            data[i] = { id: data[i] };
        }
        if(data.length){
            await this.db.insert(
                `INSERT INTO ${this.id}.reg (id)`, data
            ).toPromise();
        }
    }

    // TODO
    // await this.db.insert(`INSERT INTO ${this.id}.cfg${this.field} (cfg)`, [{
    //     cfg: JSON.stringify({
    //         "encode": typeof flexsearch.encode === "string" ? flexsearch.encode : "",
    //         "charset": typeof flexsearch.charset === "string" ? flexsearch.charset : "",
    //         "tokenize": flexsearch.tokenize,
    //         "resolution": flexsearch.resolution,
    //         "minlength": flexsearch.minlength,
    //         "optimize": flexsearch.optimize,
    //         "fastupdate": flexsearch.fastupdate,
    //         "encoder": flexsearch.encoder,
    //         "context": {
    //             "depth": flexsearch.depth,
    //             "bidirectional": flexsearch.bidirectional,
    //             "resolution": flexsearch.resolution_ctx
    //         }
    //     })
    // }]).toPromise();

    flexsearch.map.clear();
    flexsearch.ctx.clear();
    flexsearch.tag &&
    flexsearch.tag.clear();
    flexsearch.store &&
    flexsearch.store.clear();
    flexsearch.document ||
    flexsearch.reg.clear();

    await Promise.all([
        this.db.query(`OPTIMIZE TABLE ${this.id}.map${this.field} FINAL`).toPromise(),
        this.db.query(`OPTIMIZE TABLE ${this.id}.ctx${this.field} FINAL`).toPromise(),
        this.db.query(`OPTIMIZE TABLE ${this.id}.tag${this.field} FINAL`).toPromise(),
        this.db.query(`OPTIMIZE TABLE ${this.id}.reg FINAL`).toPromise()
    ]);
};

ClickhouseDB.prototype.remove = async function(ids){

    if(typeof ids !== "object"){
        ids = [ids];
    }

    while(ids.length){

        let chunk = ids.slice(0, 1e5);
        ids = ids.slice(1e5);
        chunk = this.type === "String"
            ? "'" + chunk.join("','") + "'"
            : chunk.join(",");

        await Promise.all([
            this.db.query(`
                ALTER TABLE ${this.id}.map${this.field} 
                DELETE WHERE id IN (${chunk}) 
                SETTINGS mutations_sync = 1;`
            ).toPromise(),

            this.db.query(`
                ALTER TABLE ${this.id}.ctx${this.field}
                DELETE WHERE id IN (${chunk})
                SETTINGS mutations_sync = 1;`
            ).toPromise(),

            this.db.query(`
                ALTER TABLE ${this.id}.tag${this.field}
                DELETE WHERE id IN (${chunk})
                SETTINGS mutations_sync = 1;`
            ).toPromise(),

            this.db.query(`
                ALTER TABLE ${this.id}.reg
                DELETE WHERE id IN (${chunk})
                SETTINGS mutations_sync = 1;`
            ).toPromise()
        ]);
    }
};
