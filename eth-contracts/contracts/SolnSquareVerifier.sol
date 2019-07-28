pragma solidity >=0.4.21 <0.6.0;

import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>



// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {
    Verifier public verifier;
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint index;
        address to;
        bool isVerified;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint index, address to);

    constructor() public {
        verifier = new Verifier();
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint index, address to, uint[2] memory inputs) public {
        Solution memory sol = Solution(index, to, true);
        solutions.push(sol);
        uniqueSolutions[keccak256(abi.encodePacked(inputs))] = sol;
        emit SolutionAdded(index, to);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(
        address to,
        uint index,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory inputs
    ) public onlyOwner returns(bool) {
        if(verifier.verifyTx(a, b, c, inputs)) {
            if(!uniqueSolutions[keccak256(abi.encodePacked(inputs))].isVerified) {
                super.mint(to, index);
                addSolution(index, to, inputs);
                return true;
            }
            else return false;
        }
        else return false;
    }

    function getSolutions() public view returns(uint[] memory) {
        uint[] memory sols = new uint[](solutions.length);
        for(uint i = 0; i<solutions.length; i++){
            sols[i] = solutions[i].index;
        }
        return sols;
    }

}

