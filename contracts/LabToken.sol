// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract LabToken {
    string public name = "LabToken";
    string public symbol = "LAB";
    uint8 public decimals = 18;

    uint256 public totalSupply;

    mapping(address => uint256) private _balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply;
        _balances[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        console.log("=== transfer ===");
        console.log("from:", msg.sender);
        console.log("to:", to);
        console.log("amount:", amount);
        console.log("balance_before:", _balances[msg.sender]);

        require(to != address(0), "ZERO_ADDRESS");
        require(amount > 0, "AMOUNT_ZERO");
        require(_balances[msg.sender] >= amount, "INSUFFICIENT_BALANCE");

        // Edge-case: self-transfer allowed (ERC-20 style)
        _balances[msg.sender] -= amount;
        _balances[to] += amount;

        console.log("balance_after:", _balances[msg.sender]);
        emit Transfer(msg.sender, to, amount);
        return true;
    }
}
