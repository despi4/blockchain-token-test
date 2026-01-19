# Token Contract Testing — PART 5

This project contains professional-grade unit tests for a token smart contract using **Hardhat**, **Mocha**, and **Chai**. The goal of this lab is to validate the correctness, safety, and gas efficiency of the token contract implementation.

---

## Project Structure

```
contracts/
  LabToken.sol

test/
  token.part5.test.js

hardhat.config.js
package.json
README.md
```

---

## Features Implemented

This project fulfills all requirements of **PART 5 — Token Contract Tests**:

### Required Test Coverage

* ✅ Basic balance checks
* ✅ Transfer tests
* ✅ Failing transfer tests
* ✅ Edge case: transferring to yourself
* ✅ Gas estimation tests
* ✅ Event emission tests
* ✅ Storage verification
* ✅ Negative tests (reverts, invalid parameters)

### Advanced Requirement

* ✅ Solidity `console.log` usage via `hardhat/console.sol` to visualize state evolution during tests

---

## Technologies Used

* **Solidity** — Smart contract language
* **Hardhat** — Development framework
* **Mocha** — Test runner
* **Chai** — Assertion library
* **Ethers.js** — Blockchain interaction
* **hardhat-gas-reporter** — Gas usage reporting
* **dotenv** — Environment variable management

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

## Running Tests

To run all tests with gas reporting enabled:

```bash
npx hardhat test
```

---

## Example Output

When running the tests, you will see:

* Detailed test results
* Solidity `console.log` output showing state evolution
* Gas usage statistics per contract method

Example:

```
10 passing (344ms)

| Contracts / Methods | Min | Max | Avg | #calls |
|---------------------|-----|-----|-----|--------|
| LabToken.transfer  | ... | ... | ... | 12     |
```

---

## Solidity Debug Logging

This project uses Hardhat’s Solidity debugging feature:

```solidity
import "hardhat/console.sol";
```

Example logs inside `transfer()`:

```solidity
console.log("balance_before:", _balances[msg.sender]);
console.log("balance_after:", _balances[msg.sender]);
```

These logs appear in the terminal during test execution and help visualize state changes.

---

## Notes

* The `node_modules` folder should **NOT** be submitted.
* This project is designed for **local testing only**.
* Solidity console logs are for development and debugging purposes.

---

## Author

Student Lab Assignment — PART 5
Token Contract Testing with Hardhat