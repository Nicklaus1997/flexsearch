import{IndexOptions,ContextOptions}from"./type.js";import Encoder from"./encoder.js";import Cache,{searchCache}from"./cache.js";import Charset from"./charset.js";import{KeystoreMap,KeystoreSet}from"./keystore.js";import{is_array,is_string}from"./common.js";import{exportIndex,importIndex,serialize}from"./serialize.js";import default_encoder from"./charset/latin/default.js";import apply_preset from"./preset.js";import apply_async from"./async.js";import tick from"./profiler.js";import"./index/add.js";import"./index/search.js";import"./index/remove.js";export default function Index(a,b){if(!this)return new Index(a);!1,a=a?apply_preset(a):{};const c=a.context||{},d=a.encode||a.encoder||default_encoder;this.encoder=d.encode?d:"object"==typeof d?new Encoder(d):{encode:d},this.compress=a.compress||a.compression||!1;let e;this.resolution=a.resolution||9,this.tokenize=e=a.tokenize||"strict",this.depth="strict"===e&&c.depth||0,this.bidirectional=!1!==c.bidirectional,this.fastupdate=!!a.fastupdate,this.score=a.score||null,e=a.keystore||0,e&&(this.keystore=e),this.map=e&&!0?new KeystoreMap(e):new Map,this.ctx=e&&!0?new KeystoreMap(e):new Map,this.reg=b||(this.fastupdate?e&&!0?new KeystoreMap(e):new Map:e&&!0?new KeystoreSet(e):new Set),this.resolution_ctx=c.resolution||1,this.rtl=d.rtl||a.rtl||!1,this.cache=(e=a.cache||null)&&new Cache(e),this.resolve=!1!==a.resolve,(e=a.db)&&(this.db=e.mount(this)),this.commit_auto=!1!==a.commit,this.commit_task=[],this.commit_timer=null}Index.prototype.mount=function(a){return this.commit_timer&&(clearTimeout(this.commit_timer),this.commit_timer=null),a.mount(this)},Index.prototype.commit=function(a,b){return this.commit_timer&&(clearTimeout(this.commit_timer),this.commit_timer=null),this.db.commit(this,a,b)};export function autoCommit(a,b,c){a.commit_timer||(a.commit_timer=setTimeout(function(){a.commit_timer=null,a.db.commit(a,b,c)},0))}Index.prototype.clear=function(){return this.map.clear(),this.ctx.clear(),this.reg.clear(),this.cache&&this.cache.clear(),this.db&&(this.commit_timer&&clearTimeout(this.commit_timer),this.commit_timer=null,this.commit_task=[{clear:!0}]),this},Index.prototype.append=function(a,b){return this.add(a,b,!0)},Index.prototype.contain=function(a){return this.db?this.db.has(a):this.reg.has(a)},Index.prototype.update=function(a,b){if(this.async){const c=this,d=this.remove(a);return d.then?d.then(()=>c.add(a,b)):this.add(a,b)}return this.remove(a).add(a,b)};function cleanup_index(a){let b=0;if(is_array(a))for(let c,d=0;d<a.length;d++)(c=a[d])&&(b+=c.length);else for(const c of a){const d=c[0],e=c[1],f=cleanup_index(e);f?b+=f:a.delete(d)}return b}Index.prototype.cleanup=function(){return this.fastupdate?(cleanup_index(this.map),this.depth&&cleanup_index(this.ctx),this):(!1,this)},Index.prototype.searchCache=searchCache,Index.prototype.export=exportIndex,Index.prototype.import=importIndex,Index.prototype.serialize=serialize,apply_async(Index.prototype);