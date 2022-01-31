pragma solidity ^0.5.16;

import "./SEther.sol";

/**
 * @title Safelend's Maximillion Contract
 * @author Safelend
 */
contract Maximillion {
    /**
     * @notice The default cEther market to repay in
     */
    SEther public cEther;

    /**
     * @notice Construct a Maximillion to repay max in a SEther market
     */
    constructor(SEther sEther_) public {
        cEther = sEther_;
    }

    /**
     * @notice msg.sender sends Ether to repay an account's borrow in the cEther market
     * @dev The provided Ether is applied towards the borrow balance, any excess is refunded
     * @param borrower The address of the borrower account to repay on behalf of
     */
    function repayBehalf(address borrower) public payable {
        repayBehalfExplicit(borrower, cEther);
    }

    /**
     * @notice msg.sender sends Ether to repay an account's borrow in a cEther market
     * @dev The provided Ether is applied towards the borrow balance, any excess is refunded
     * @param borrower The address of the borrower account to repay on behalf of
     * @param sEther_ The address of the cEther contract to repay in
     */
    function repayBehalfExplicit(address borrower, SEther sEther_) public payable {
        uint received = msg.value;
        uint borrows = sEther_.borrowBalanceCurrent(borrower);
        if (received > borrows) {
            sEther_.repayBorrowBehalf.value(borrows)(borrower);
            msg.sender.transfer(received - borrows);
        } else {
            sEther_.repayBorrowBehalf.value(received)(borrower);
        }
    }
}
