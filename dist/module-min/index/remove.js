import{is_array}from"../common.js";import Index,{autoCommit}from"../index.js";Index.prototype.remove=function(a,b){const c=this.reg.size&&(this.fastupdate?this.reg.get(a):this.reg.has(a));if(c){if(this.fastupdate){for(let b,d=0;d<c.length;d++)if(!(b=c[d]));else if(2>b.length)b.pop();else{const d=b.indexOf(a);d===c.length-1?b.pop():b.splice(d,1)}}else remove_index(this.map,a),this.depth&&remove_index(this.ctx,a);b||this.reg.delete(a)}return this.db&&(this.commit_task.push({del:a}),this.commit_auto&&autoCommit(this)),this.cache&&this.cache.remove(a),this};function remove_index(a,b){let c=0;if(is_array(a)){for(let d,e,f=0;f<a.length;f++)if((d=a[f])&&d.length)if(e=d.indexOf(b),0<=e){1<d.length?(d.splice(e,1),c++):delete a[f];break}else c++;}else for(let d of a.entries()){const e=d[0],f=d[1],g=remove_index(f,b);g?c+=g:a.delete(e)}return c}