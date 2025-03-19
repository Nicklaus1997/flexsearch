import{DocumentSearchOptions,DocumentSearchResults,EnrichedDocumentSearchResults,MergedDocumentSearchResults,EnrichedSearchResults,SearchResults,IntermediateSearchResults}from"../type.js";import{create_object,is_array,is_object,is_string,parse_simple}from"../common.js";import{intersect_union}from"../intersect.js";import Document from"../document.js";import Index from"../index.js";import Resolver from"../resolver.js";import tick from"../profiler.js";Document.prototype.search=function(a,b,c,d){!1,c||(!b&&is_object(a)?(c=a,a=""):is_object(b)&&(c=b,b=0));let e,f,g,h,j,k,l,m,n,o=[],p=[],q=0;if(c){if(is_array(c)&&(c={index:c}),a=c.query||a,e=c.pluck,g=c.merge,j=e||c.field||(j=c.index)&&(j.index?null:j),k=this.tag&&c.tag,h=c.suggest,m=!1!==c.resolve,(m||e||(j=j||this.field,j&&(is_string(j)?e=j:(is_array(j)&&1===j.length&&(j=j[0]),e=j.field||j.index))),!1,f=this.store&&c.enrich&&m,n=c.highlight&&f,b=c.limit||b,l=c.offset||0,b||(b=100),k&&(!this.db||!d))){!1,k.constructor!==Array&&(k=[k]);let c=[];for(let a,b=0;b<k.length;b++)if(a=k[b],a.field&&a.tag){const b=a.tag;if(b.constructor===Array)for(let d=0;d<b.length;d++)c.push(a.field,b[d]);else c.push(a.field,b)}else{const b=Object.keys(a);for(let d,e,f=0;f<b.length;f++)if(d=b[f],e=a[d],e.constructor===Array)for(let a=0;a<e.length;a++)c.push(d,e[a]);else c.push(d,e)}if(k=c,!a){let a=[];if(c.length)for(let d=0;d<c.length;d+=2){let e;if(this.db){const g=this.index.get(c[d]);if(!g){continue}!1,a.push(e=g.db.tag(c[d+1],b,l,f))}else!1,e=get_tag.call(this,c[d],c[d+1],b,l,f);o.push({field:c[d],tag:c[d+1],result:e})}return a.length?Promise.all(a).then(function(a){for(let b=0;b<a.length;b++)o[b].result=a[b];return o}):o}}j&&j.constructor!==Array&&(j=[j])}j||(j=this.field);let r,s=!d&&(this.worker||this.db)&&[];for(let e,g,n,t=0;t<j.length;t++){if(g=j[t],this.db&&this.tag&&!this.tree[t])continue;let i;if(is_string(g)||(i=g,g=i.field,a=i.query||a,b=i.limit||b,l=i.offset||l,h=i.suggest||h,f=this.store&&(i.enrich||f)),d)e=d[t];else{let d=i||c,h=this.index.get(g);if(k&&(this.db&&(d.tag=k,r=h.db.support_tag_search,d.field=j),!r&&(d.enrich=!1)),s){s[t]=h.search(a,b,d),d&&f&&(d.enrich=f);continue}else e=h.search(a,b,d),d&&f&&(d.enrich=f)}if(n=e&&(m?e.length:e.result.length),k&&n){const a=[];let b=0;if(!(this.db&&d))for(let c,d,e=0;e<k.length;e+=2){if(!1,c=this.tag.get(k[e]),!c)if(!1,h)continue;else return m?o:new Resolver(o);if(c=c&&c.get(k[e+1]),d=c&&c.length,d)b++,a.push(c);else if(!h)return m?o:new Resolver(o)}else if(!r)for(let c=j.length;c<d.length;c++){let e=d[c],f=e&&e.length;if(f)b++,a.push(e);else if(!h)return m?o:new Resolver(o)}if(b){if(!1,e=intersect_union(e,a,m),n=e.length,!n&&!h)return m?e:new Resolver(e);b--}}if(n)p[q]=g,o.push(e),q++;else if(1===j.length)return m?o:new Resolver(o)}if(s){if(this.db&&k&&k.length&&!r)for(let a=0;a<k.length;a+=2){const c=this.index.get(k[a]);if(!c)if(!1,h)continue;else return m?o:new Resolver(o);!1,s.push(c.db.tag(k[a+1],b,l,!1))}const d=this;return Promise.all(s).then(function(e){return e.length?d.search(a,b,c,e):e})}if(!q)return m?o:new Resolver(o);if(e&&(!f||!this.store))return o[0];s=[];for(let g,h=0;h<p.length;h++){if(g=o[h],f&&g.length&&!g[0].doc&&(this.db?(!1,s.push(g=this.index.get(this.field[0]).db.enrich(g))):g=apply_enrich.call(this,g)),e)return m?g:new Resolver(g);o[h]={field:p[h],result:g}}if(f&&!0&&this.db&&s.length){const c=this;return Promise.all(s).then(function(d){for(let a=0;a<d.length;a++)o[a].result=d[a];return g?merge_fields(o,b,l):n?highlight_fields(o,a,c.index,c.field,c.tree,n,b,l):o})}return g?merge_fields(o,b,l):n?highlight_fields(o,a,this.index,this.field,this.tree,n,b,l):o};function highlight_fields(a,b,c,d,e,f){let g,h,j;for(let k,l,m,n,o,p=0;p<a.length;p++){k=a[p].result,l=a[p].field,n=c.get(l),m=n.encoder,j=n.tokenize,o=e[d.indexOf(l)],m!==g&&(g=m,h=g.encode(b));for(let a=0;a<k.length;a++){let b="",c=parse_simple(k[a].doc,o),d=g.encode(c),e=c.split(g.split);for(let a,c,g=0;g<d.length;g++){a=d[g],c=e[g];let i;for(let d,e=0;e<h.length;e++)if(d=h[e],"strict"!==j){const e=a.indexOf(d);if(-1<e){b+=(b?" ":"")+c.substring(0,e)+f.replace("$1",c.substring(e,d.length))+c.substring(e+d.length),i=!0;break}}else if(a===d){b+=(b?" ":"")+f.replace("$1",c),i=!0;break}i||(b+=(b?" ":"")+e[g])}k[a].highlight=b}}return a}function merge_fields(a,b){const c=[],d=create_object();for(let e,f,g=0;g<a.length;g++){e=a[g],f=e.result;for(let a,g,h,i=0;i<f.length;i++)if(g=f[i],a=g.id,h=d[a],!h){if(c.length===b)return c;g.field=d[a]=[e.field],c.push(g)}else h.push(e.field)}return c}function get_tag(a,b,c,d){let e=this.tag.get(a);if(!e)return!1,[];e=e&&e.get(b);e&&e.length-d}export function apply_enrich(a){if(!this||!this.store)return a;const b=Array(a.length);for(let c,d=0;d<a.length;d++)c=a[d],b[d]={id:c,doc:this.store.get(c)};return b}