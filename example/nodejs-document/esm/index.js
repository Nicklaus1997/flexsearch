import { Document, Charset } from "flexsearch/esm";
import fs from "fs";

const dirname = import.meta.dirname;
// loading test data
const data = JSON.parse(fs.readFileSync(dirname + "/../data.json", "utf8"));

// create the document index
const document = new Document({
    document: {
        id: "tconst",
        store: true,
        index: [{
            field: "primaryTitle",
            tokenize: "forward",
            encoder: Charset.LatinSimple
        },{
            field: "originalTitle",
            tokenize: "forward",
            encoder: Charset.LatinSimple
        }],
        tag: [{
            field: "startYear"
        },{
            field: "genres"
        }]
    }
});

// add test data
for(let i = 0; i < data.length; i++){
    document.add(data[i]);
}

// perform a query
const result = document.search({
    query: "carmencita",
    tag: {
        "startYear": "1894",
        "genres": [
            "Documentary",
            "Short"
        ]
    },
    suggest: true,
    enrich: true,
    merge: true
});

console.log(result);