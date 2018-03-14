const AssemblingLine = require('./assembling-line');
const bouquetsRulesInput = ['AL10r5t8d30', 'BS1r2t5'];

test('calling assembly method of assembling line should return assembled bouquet or false', () => {
    const assemblingLine = new AssemblingLine(bouquetsRulesInput);
    let flower = assemblingLine.assemble('rS');
    expect(flower).toEqual(false);
    flower = assemblingLine.assemble('tS');
    expect(flower).toEqual(false);
    flower = assemblingLine.assemble('tS');
    expect(flower).toEqual(false);
    flower = assemblingLine.assemble('sS');
    expect(flower).toEqual(false);
    flower = assemblingLine.assemble('sS');
    expect(flower).toEqual("BS1r2t2s");
    flower = assemblingLine.assemble('sS');
    expect(flower).toEqual(false);
});

describe('bouquets rules inputs are correctly parsed into designs', () => {
    const assemblingLine = new AssemblingLine(bouquetsRulesInput);
    const designs = assemblingLine.getDesigns;

    test('Small design', () => {
        expect(designs["S"].length).toBeGreaterThan(0);
        expect(designs["S"][0]).toEqual(expect.objectContaining({
            name: "B",
            size: "S",
            flowers: expect.anything(),
            amountOfFlowersTotal: 5,
            amountOfUnspecifiedFlowers: 2,
            amountOfSpecifiedFlowers: 3,
        }));
    })

    test('Large design', () => {
        expect(designs["L"].length).toBeGreaterThan(0);
        expect(designs["L"][0]).toEqual(expect.objectContaining({
            name: "A",
            size: "L",
            flowers: expect.anything(),
            amountOfFlowersTotal: 30,
            amountOfUnspecifiedFlowers: 7,
            amountOfSpecifiedFlowers: 23,
        }));
    })


});
