// COMPILER BLOCK -->
import { DEBUG } from "./config.js";
// <-- COMPILER BLOCK
import { is_string } from "./common.js";
import { IndexOptions } from "./type.js";

/**
 * @enum {Object}
 * @const
 */

const presets = {

    "memory": {
        resolution: 1
    },

    "performance": {
        resolution: 6,
        fastupdate: true,
        context: {
            depth: 1,
            resolution: 3
        }
    },

    "match": {
        tokenize: "forward"
    },

    "score": {
        resolution: 9,
        context: {
            depth: 2,
            resolution: 9
        }
    }
};

/**
 *
 * @param {!IndexOptions|string} options
 * @return {IndexOptions}
 */

export default function apply_preset(options){

    const preset = is_string(options)
        ? options
        : options["preset"];

    if(preset){
        if(DEBUG && !presets[preset]){
            console.warn("Preset not found: " + preset);
        }
        options = Object.assign({}, presets[preset], /** @type {Object} */ (options));
    }

    return options;
}