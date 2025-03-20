import { Encoder } from "flexsearch/esm";
import { promises as fs } from "fs";

(async function(){
    await fs.mkdir("./export/").catch(e => {});
}());

export default {
    tokenize: "forward",
    encoder: new Encoder({
        normalize: function(str){
            return str.toLowerCase();
        }
    }),
    export: async function(key, data){

        await fs.writeFile("./export/" + key, data, "utf8");
    },
    import: async function(index){

        let files = await fs.readdir("./export/");
        files = await Promise.all(files);

        for(let i = 0; i < files.length; i++){
            const data = await fs.readFile("./export/" + files[i], "utf8");
            index.import(files[i], data);
        }
    }
};