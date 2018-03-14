class AssemblingLine{
    constructor(rules, capacity = 256) {
        this.designs = {
            L: [],
            S: []
        };
        this.floralStorage = {
            L: new Map(),
            S: new Map(),
        };
        this.floralStorageCapacity = capacity;
        this.flowersInStorage = 0;
        for (let i = 0; i < rules.length; i++) {
                let curDesign = this.parseDesignInput(rules[i]);
                this.designs[curDesign.size].push(curDesign);
        }
    }

    get getDesigns() {
        return this.designs
    }

    tryArrangeBouquet(design, size){
        const flowersStorageCopy = new Map(this.floralStorage[size]);
        const bouquetOutput = [design.name, design.size];

        let totalFlowers = design.amountOfFlowersTotal;
        for (let k of design.flowers.keys()) {
            let flowersNeed = design.flowers.get(k);
            let flowersHave = flowersStorageCopy.get(k) || 0;

            if (flowersHave < flowersNeed) {
                return false;
            }
            else {
                totalFlowers -= flowersNeed;
                flowersStorageCopy.set(k, flowersHave - flowersNeed);
                bouquetOutput.push(flowersNeed);
                bouquetOutput.push(k);
            }
        }

        // Here we have all mandatory flowers
        // Now we need to check if we need more wildcard flowers
        if (totalFlowers > 0) {
            for (let k of flowersStorageCopy.keys()) {
                let flowersHave = flowersStorageCopy.get(k);

                if (flowersHave > 0) {
                    if (flowersHave >= totalFlowers) {
                        flowersStorageCopy.set(k, flowersHave - totalFlowers );
                        bouquetOutput.push(totalFlowers);
                        totalFlowers = 0;
                        bouquetOutput.push(k);
                        break;
                    }
                    else {
                        flowersStorageCopy.set(k, 0);
                        bouquetOutput.push(flowersHave);
                        bouquetOutput.push(k);
                        totalFlowers -= flowersHave;
                    }
                }
            }
        }

        if (totalFlowers > 0) {
            return false;
        }
        else {
            this.floralStorage[size] = flowersStorageCopy;
            return bouquetOutput.join("");
        }

        /*
        let isArrangementPossible = true;
        design.flowers.forEach((value, key,)=>{
            console.log(value, key,);
            bouquetOutput.push(value);
            bouquetOutput.push(key);

            const flowerFromStorage = flowersStorageCopy.get(key);
            if(flowerFromStorage && flowerFromStorage == value){
                flowersStorageCopy.delete(key);
            } else if(flowerFromStorage && flowerFromStorage > value){
                flowersStorageCopy.set(key, flowerFromStorage - value);
            } else {
                isArrangementPossible = false;
            }
        });

        if(isArrangementPossible && design.amountOfUnspecifiedFlowers === 0){
            this.floralStorage = flowersStorageCopy;

        }*/

    }

    parseFlowerInput(flower){
        //parse input
        const flowerDetails = flower.split("");
        const flowerName = flowerDetails[0];
        const flowerSize = flowerDetails[1].toUpperCase();

        const placeInStorage = this.floralStorage[flowerSize];


        if (!placeInStorage) {
            console.error(`Unknown type: ${flowerSize}`)
            return
        }

        if(placeInStorage.has(flowerName)){
            placeInStorage.set(flowerName, placeInStorage.get(flowerName) + 1);
        } else{
            placeInStorage.set(flowerName, 1);
        }

        return {
            flowerName,
            flowerSize
        }
    }

    parseDesignInput(rule){
        const designDetails = rule.split("");
        const { endOfFlowersTypes, amountOfFlowersTotal} = this.parseAmountOfFlowersInDesign(designDetails);
        const { flowers, amountOfSpecifiedFlowers } = this.parseFlowerTypesInDesign(designDetails, endOfFlowersTypes);

        const design = {
            rule: rule,
            name: designDetails[0],
            size: designDetails[1],
            flowers: flowers,
            amountOfFlowersTotal: amountOfFlowersTotal,
            amountOfSpecifiedFlowers: amountOfSpecifiedFlowers,
            amountOfUnspecifiedFlowers: amountOfFlowersTotal - amountOfSpecifiedFlowers,
        };

        return design;
    }

    parseAmountOfFlowersInDesign(designDetails){
        let amountOfFlowersTotal = designDetails[designDetails.length -1];
        let endOfFlowersTypes = null;

        for(let i = designDetails.length -2; i > 1; i-- ){
            if (this.checkIfValusIsNumber(designDetails[i])) {
                // Is a number
                amountOfFlowersTotal = designDetails[i] + amountOfFlowersTotal;
            } else {
                amountOfFlowersTotal = Number.parseInt(amountOfFlowersTotal);
                endOfFlowersTypes = i;
                break;
            }
        }

        return {
            endOfFlowersTypes,
            amountOfFlowersTotal
        }
    }

    parseFlowerTypesInDesign(designDetails, endOfFlowersTypes){
        const flowers = new Map();
        let amountOfSpecifiedFlowers = 0;

        let dPrevInput = designDetails[2];
        for(let i = 3; i <= endOfFlowersTypes; i++){
            let dCurInput = designDetails[i];

            let dPrevIsNumber = this.checkIfValusIsNumber(dPrevInput);
            let dCurIsNumber = this.checkIfValusIsNumber(dCurInput);

            if(dPrevIsNumber && dCurIsNumber){
                dPrevInput = dPrevInput + dCurInput;
            } else if(dPrevIsNumber && !dCurIsNumber){
                //we have a amount and the type
                let amount = Number.parseInt(dPrevInput);
                flowers.set(dCurInput, amount);
                amountOfSpecifiedFlowers += amount;
                i++;
                dPrevInput = designDetails[i];
            }

        }

        return {flowers, amountOfSpecifiedFlowers };
    }

    checkIfValusIsNumber(value){
        return !isNaN(parseInt(value, 10));
    }

    assemble(flower){
        this.flowersInStorage++;

        const { flowerSize }= this.parseFlowerInput(flower);

        const designsSet = this.designs[flowerSize];
        for (let i = 0; i < designsSet.length; i++) {
            let design = designsSet[i];
            let arrangement = this.tryArrangeBouquet(design, flowerSize);

            if (arrangement) {
                this.flowersInStorage = this.flowersInStorage - design.size;
                return arrangement
            }
        }

        if(this.flowersInStorage > this.floralStorageCapacity){
            return new Error('Maximum of floral storage capacity is reached');
        } else{
            return false;
        }
    }
}

module.exports = AssemblingLine;