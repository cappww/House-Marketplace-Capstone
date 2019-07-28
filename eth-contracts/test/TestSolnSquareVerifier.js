// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const truffleAssertions = require('truffle-assertions');

contract('TestSolnSquareVerifier', accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];

    beforeEach(async() => {
        this.contract = await SolnSquareVerifier.new({from: account_one});
        
    });

    it('Test if a new solution can be added for contract', async() => {
        let index = 0;
        let inputs = [1,1];
        await this.contract.addSolution(index, account_one, inputs);

        let solutions = await this.contract.getSolutions.call();
        assert.equal(solutions[0].toNumber(), index, "addSolution does not work");
    });

    it('Test if an ERC721 token can be minted for contract', async () => {
        let proof = require('../../zokrates/code/square/proof.json');

        let index = 1;
        let result = await this.contract.mint(
            account_two,
            index,
            proof.proof.a,
            proof.proof.b,
            proof.proof.c,
            proof.inputs,
            { from: account_one }
        );

        truffleAssertions.eventEmitted(result, 'SolutionAdded', async (ev) => {
            return ev.index.toNumber() === index;
        });
    });
});