// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vault {
    // Mapping to store Ether balance for each address
    mapping(address => uint256) private balances;

    // Event for logging deposits and withdrawals
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    // Deposit function to add Ether to the vault
    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw function to retrieve Ether
    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Update balance before transferring to prevent re-entrancy
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Withdrawal(msg.sender, _amount);
    }

    // Function to check balance (optional)
    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
