const truffleAssertions = require('truffle-assertions');
const ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});

            // TODO: mint multiple tokens
            for (let i = 0; i < 3; i++) {
                this.contract.mint(account_two, i);
            }

            for (let i = 3; i < 7; i++) {
                this.contract.mint(account_one, i);
            }
        });

        it('should return total supply', async function () { 
            let result = await this.contract.totalSupply();
            assert.equal(result.toNumber(), 7, "Total supply is incorrect");
        });

        it('should get token balance', async function () { 
            let result = await this.contract.balanceOf(account_two);
            assert.equal(result.toNumber(), 3, "balance of acct1 is incorrect");
            result = await this.contract.balanceOf(account_one);
            assert.equal(result.toNumber(), 4, "balance of acct2 is incorrect");
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenID = 5;
            let baseURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
            let result = await this.contract.tokenURI(tokenID);
            assert.equal(result, baseURI+tokenID, "The token uri is incorrect");
        });

        it('should transfer token from one owner to another', async function () {
            let tokenID = 6;
            await this.contract.transferFrom(account_one, account_two, tokenID);
            let result = await this.contract.ownerOf(tokenID);
            assert.equal(result, account_two, "The account owner is incorrect");
        });
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        });

        it('should fail when minting when address is not contract owner', async function () { 
            await truffleAssertions.reverts(
                this.contract.mint(account_two, 7, { from: account_two }),
                "Only the owner can call this function"
            );
        });

        it('should return contract owner', async function () { 
            let result = await this.contract.getOwner();
            assert.equal(result, account_one, "The contract owner is incorrect");
        });
    });
    
});