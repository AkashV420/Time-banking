pragma solidity ^0.5.0;

import "./LSTimeToken.sol";
import "./HSTimeToken.sol";

contract TokenFarm {
    string public name = "Time Bank Token Stake";
    address public owner;
    LSTimeToken public lsToken;
    HSTimeToken public hsToken;
    uint public swap_ratio =2; 

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(LSTimeToken _lsToken, HSTimeToken _hsToken) public {
        lsToken = _lsToken;
        hsToken = _hsToken;
        owner = msg.sender;
    }

    function swapForLST(uint _amount) public {

        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Trasnfer HST tokens to contract 
        hsToken.transferFrom(msg.sender, address(this), _amount);
        
        // check for lsToken availability
        
        //Swap for LST.. i.e Transfer LS Tokens to sender
        lsToken.transfer(msg.sender, _amount*swap_ratio);

    }

    function swapForHST(uint _amount) public {

        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Trasnfer LST tokens to contract 
        lsToken.transferFrom(msg.sender, address(this), _amount);
        
        // check for hsToken availability

        //Swap for HST.. i.e Transfer HS Tokens to sender
        hsToken.transfer(msg.sender, _amount/swap_ratio);

    }
    function stakeTokens(uint _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Trasnfer High Skilled tokens to this contract for staking
        hsToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer High Skilled tokens to sender for unstaking
        hsToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }

    // Issuing Tokens
    function issueTokens() public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // Issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                lsToken.transfer(recipient, balance);
            }
        }
    }
}
