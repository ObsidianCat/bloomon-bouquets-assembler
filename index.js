const AssemblingLine = require('./assembling-line');
const FACILITY_STORAGE_CAPACITY = require('./constants').FACILITY_STORAGE_CAPACITY;
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin

});


let acceptDesigns = true;
let designs = [];
let assemblingLine;
rl.on('line', (line) => {
    if (line.trim() === "") {
       acceptDesigns = false;
       assemblingLine = new AssemblingLine(designs, FACILITY_STORAGE_CAPACITY);
       return;
    }

    if (acceptDesigns) {
       designs.push(line.trim());
    }
    else {
        let assemble = assemblingLine.assemble(line.trim());
        if (assemble) {
            console.log(assemble);
        }
    }
});