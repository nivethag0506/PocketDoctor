# 🔗 EduAid Smart Contract Documentation

## Overview

EduAid uses two core smart contracts deployed on Ethereum/Polygon:

1. **EduStablecoin** (ERC-20) - Custom token for scholarship funds
2. **EduFundManager** - Core logic for closed-loop spending

---

## 📦 Contract Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    SMART CONTRACT LAYER                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────┐      ┌─────────────────────────────┐ │
│  │   EduStablecoin     │      │      EduFundManager         │ │
│  │   (ERC-20 Token)    │◄────►│    (Core Logic)             │ │
│  ├─────────────────────┤      ├─────────────────────────────┤ │
│  │ • mint()            │      │ • whitelistStudent()        │ │
│  │ • burn()            │      │ • whitelistVendor()         │ │
│  │ • transfer()        │      │ • transfer()                │ │
│  │ • balanceOf()       │      │ • getStudentCategories()    │ │
│  │ • approve()         │      │ • getVendorCategory()       │ │
│  └─────────────────────┘      │ • pause()/unpause()         │ │
│                               │ • getTransactionHistory()   │ │
│                               └─────────────────────────────┘ │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  OpenZeppelin Libraries                  │  │
│  │  • Ownable • ReentrancyGuard • Pausable • ERC20         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 📝 EduStablecoin.sol

### Description

ERC-20 compliant stablecoin used exclusively for scholarship disbursements.

### Contract Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title EduStablecoin
 * @dev ERC-20 token for EduAid scholarship system
 * @notice This token can only be minted by admin and spent at whitelisted vendors
 */
contract EduStablecoin is ERC20, Ownable, Pausable {
    
    // EduFundManager contract address
    address public fundManager;
    
    // Events
    event FundManagerUpdated(address indexed oldManager, address indexed newManager);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    /**
     * @dev Constructor
     * @param name Token name
     * @param symbol Token symbol
     */
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {}
    
    /**
     * @dev Set the EduFundManager contract address
     * @param _fundManager Address of EduFundManager contract
     */
    function setFundManager(address _fundManager) external onlyOwner {
        require(_fundManager != address(0), "Invalid address");
        address oldManager = fundManager;
        fundManager = _fundManager;
        emit FundManagerUpdated(oldManager, _fundManager);
    }
    
    /**
     * @dev Mint tokens to a recipient (admin only)
     * @param to Recipient address
     * @param amount Amount to mint (in wei)
     */
    function mint(address to, uint256 amount) external onlyOwner whenNotPaused {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Burn tokens from an address (admin only)
     * @param from Address to burn from
     * @param amount Amount to burn
     */
    function burn(address from, uint256 amount) external onlyOwner {
        require(from != address(0), "Invalid address");
        require(amount > 0, "Amount must be positive");
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }
    
    /**
     * @dev Override transfer to only allow via FundManager
     */
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        // Allow transfers only via FundManager or from owner
        require(
            msg.sender == fundManager || msg.sender == owner(),
            "Transfers only via FundManager"
        );
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Override transferFrom to only allow via FundManager
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override whenNotPaused returns (bool) {
        require(
            msg.sender == fundManager || msg.sender == owner(),
            "Transfers only via FundManager"
        );
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Pause all token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get token decimals (18 by default)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
```

### Functions

| Function | Access | Description |
|----------|--------|-------------|
| `mint(to, amount)` | Owner | Mint new tokens to recipient |
| `burn(from, amount)` | Owner | Burn tokens from address |
| `transfer(to, amount)` | FundManager | Transfer tokens (restricted) |
| `transferFrom(from, to, amount)` | FundManager | Transfer tokens on behalf |
| `setFundManager(address)` | Owner | Set FundManager contract |
| `pause()` | Owner | Pause all transfers |
| `unpause()` | Owner | Resume transfers |

---

## 📝 EduFundManager.sol

### Description

Core logic contract that enforces closed-loop spending on scholarships.

### Contract Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IEduStablecoin {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title EduFundManager
 * @dev Core logic for EduAid closed-loop spending system
 * @notice Enforces that students can only spend at whitelisted vendors
 */
contract EduFundManager is AccessControl, ReentrancyGuard, Pausable {
    
    // ==================== CONSTANTS ====================
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    // ==================== ENUMS ====================
    
    /**
     * @dev Spending categories for scholarships
     */
    enum Category {
        TUITION,        // 0 - College/University fees
        BOOKS,          // 1 - Books and stationery
        COURSES,        // 2 - Online courses (Udemy, Coursera)
        CERTIFICATION,  // 3 - Exam/certification fees
        HOSTEL,         // 4 - Accommodation
        TRANSPORT,      // 5 - Bus pass, travel
        INTERNET        // 6 - Data/internet recharge
    }
    
    // ==================== STRUCTS ====================
    
    struct Student {
        bool isWhitelisted;
        Category[] approvedCategories;
        uint256 totalDisbursed;
        uint256 totalSpent;
        uint256 whitelistedAt;
    }
    
    struct Vendor {
        bool isWhitelisted;
        Category category;
        string name;
        uint256 whitelistedAt;
        uint256 totalReceived;
    }
    
    struct Transaction {
        address student;
        address vendor;
        uint256 amount;
        Category category;
        uint256 timestamp;
    }
    
    // ==================== STATE VARIABLES ====================
    
    IEduStablecoin public eduToken;
    
    mapping(address => Student) public students;
    mapping(address => Vendor) public vendors;
    
    Transaction[] public transactions;
    mapping(address => uint256[]) public studentTransactions;
    mapping(address => uint256[]) public vendorTransactions;
    
    uint256 public totalFundsDistributed;
    uint256 public totalTransactions;
    
    // ==================== EVENTS ====================
    
    event StudentWhitelisted(address indexed student, Category[] categories, uint256 timestamp);
    event StudentRemoved(address indexed student, uint256 timestamp);
    event VendorWhitelisted(address indexed vendor, Category category, string name, uint256 timestamp);
    event VendorRemoved(address indexed vendor, uint256 timestamp);
    event FundsTransferred(
        address indexed student,
        address indexed vendor,
        uint256 amount,
        Category category,
        uint256 timestamp
    );
    event FundsDisbursed(address indexed student, uint256 amount, uint256 timestamp);
    
    // ==================== CONSTRUCTOR ====================
    
    /**
     * @dev Constructor
     * @param _eduToken Address of EduStablecoin contract
     */
    constructor(address _eduToken) {
        require(_eduToken != address(0), "Invalid token address");
        eduToken = IEduStablecoin(_eduToken);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
    /**
     * @dev Whitelist a student with approved spending categories
     * @param student Student wallet address
     * @param categories Array of approved spending categories
     */
    function whitelistStudent(
        address student,
        Category[] calldata categories
    ) external onlyRole(ADMIN_ROLE) whenNotPaused {
        require(student != address(0), "Invalid address");
        require(categories.length > 0, "At least one category required");
        require(!students[student].isWhitelisted, "Already whitelisted");
        
        students[student] = Student({
            isWhitelisted: true,
            approvedCategories: categories,
            totalDisbursed: 0,
            totalSpent: 0,
            whitelistedAt: block.timestamp
        });
        
        // Store categories
        for (uint i = 0; i < categories.length; i++) {
            students[student].approvedCategories.push(categories[i]);
        }
        
        emit StudentWhitelisted(student, categories, block.timestamp);
    }
    
    /**
     * @dev Remove a student from whitelist
     * @param student Student wallet address
     */
    function removeStudent(address student) external onlyRole(ADMIN_ROLE) {
        require(students[student].isWhitelisted, "Not whitelisted");
        students[student].isWhitelisted = false;
        emit StudentRemoved(student, block.timestamp);
    }
    
    /**
     * @dev Whitelist a vendor with a spending category
     * @param vendor Vendor wallet address
     * @param category Vendor's category
     * @param name Vendor's name
     */
    function whitelistVendor(
        address vendor,
        Category category,
        string calldata name
    ) external onlyRole(ADMIN_ROLE) whenNotPaused {
        require(vendor != address(0), "Invalid address");
        require(bytes(name).length > 0, "Name required");
        require(!vendors[vendor].isWhitelisted, "Already whitelisted");
        
        vendors[vendor] = Vendor({
            isWhitelisted: true,
            category: category,
            name: name,
            whitelistedAt: block.timestamp,
            totalReceived: 0
        });
        
        emit VendorWhitelisted(vendor, category, name, block.timestamp);
    }
    
    /**
     * @dev Remove a vendor from whitelist
     * @param vendor Vendor wallet address
     */
    function removeVendor(address vendor) external onlyRole(ADMIN_ROLE) {
        require(vendors[vendor].isWhitelisted, "Not whitelisted");
        vendors[vendor].isWhitelisted = false;
        emit VendorRemoved(vendor, block.timestamp);
    }
    
    // ==================== CORE TRANSFER FUNCTION ====================
    
    /**
     * @dev Transfer tokens from student to vendor (THE CORE INNOVATION)
     * @param student Student wallet address
     * @param vendor Vendor wallet address
     * @param amount Amount to transfer
     * @notice This function enforces:
     *         1. Student must be whitelisted
     *         2. Vendor must be whitelisted
     *         3. Vendor category must match student's approved categories
     */
    function transfer(
        address student,
        address vendor,
        uint256 amount
    ) external nonReentrant whenNotPaused {
        // Validate student
        require(students[student].isWhitelisted, "Student not whitelisted");
        require(msg.sender == student, "Only student can initiate");
        
        // Validate vendor
        require(vendors[vendor].isWhitelisted, "Vendor not whitelisted");
        
        // Validate category match (THE KEY INNOVATION)
        require(
            _hasCategory(student, vendors[vendor].category),
            "Category not approved for student"
        );
        
        // Validate balance
        require(
            eduToken.balanceOf(student) >= amount,
            "Insufficient balance"
        );
        
        // Execute transfer
        bool success = eduToken.transferFrom(student, vendor, amount);
        require(success, "Transfer failed");
        
        // Update state
        students[student].totalSpent += amount;
        vendors[vendor].totalReceived += amount;
        totalFundsDistributed += amount;
        totalTransactions++;
        
        // Log transaction
        uint256 txIndex = transactions.length;
        transactions.push(Transaction({
            student: student,
            vendor: vendor,
            amount: amount,
            category: vendors[vendor].category,
            timestamp: block.timestamp
        }));
        
        studentTransactions[student].push(txIndex);
        vendorTransactions[vendor].push(txIndex);
        
        emit FundsTransferred(
            student,
            vendor,
            amount,
            vendors[vendor].category,
            block.timestamp
        );
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    /**
     * @dev Check if student has a specific category approved
     */
    function _hasCategory(address student, Category category) internal view returns (bool) {
        Category[] memory categories = students[student].approvedCategories;
        for (uint i = 0; i < categories.length; i++) {
            if (categories[i] == category) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get student's approved categories
     */
    function getStudentCategories(address student) external view returns (Category[] memory) {
        return students[student].approvedCategories;
    }
    
    /**
     * @dev Check if student is whitelisted
     */
    function isStudentWhitelisted(address student) external view returns (bool) {
        return students[student].isWhitelisted;
    }
    
    /**
     * @dev Check if vendor is whitelisted
     */
    function isVendorWhitelisted(address vendor) external view returns (bool) {
        return vendors[vendor].isWhitelisted;
    }
    
    /**
     * @dev Get vendor category
     */
    function getVendorCategory(address vendor) external view returns (Category) {
        return vendors[vendor].category;
    }
    
    /**
     * @dev Get student's transaction history
     */
    function getStudentTransactionHistory(address student) external view returns (Transaction[] memory) {
        uint256[] memory indices = studentTransactions[student];
        Transaction[] memory txs = new Transaction[](indices.length);
        for (uint i = 0; i < indices.length; i++) {
            txs[i] = transactions[indices[i]];
        }
        return txs;
    }
    
    /**
     * @dev Get vendor's transaction history
     */
    function getVendorTransactionHistory(address vendor) external view returns (Transaction[] memory) {
        uint256[] memory indices = vendorTransactions[vendor];
        Transaction[] memory txs = new Transaction[](indices.length);
        for (uint i = 0; i < indices.length; i++) {
            txs[i] = transactions[indices[i]];
        }
        return txs;
    }
    
    /**
     * @dev Get total transactions count
     */
    function getTotalTransactions() external view returns (uint256) {
        return transactions.length;
    }
    
    /**
     * @dev Get transaction by index
     */
    function getTransaction(uint256 index) external view returns (Transaction memory) {
        require(index < transactions.length, "Invalid index");
        return transactions[index];
    }
    
    // ==================== EMERGENCY FUNCTIONS ====================
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
```

### Core Functions

| Function | Access | Description |
|----------|--------|-------------|
| `whitelistStudent(student, categories)` | Admin | Add student with approved categories |
| `removeStudent(student)` | Admin | Remove student from whitelist |
| `whitelistVendor(vendor, category, name)` | Admin | Add vendor with category |
| `removeVendor(vendor)` | Admin | Remove vendor from whitelist |
| `transfer(student, vendor, amount)` | Student | Transfer tokens (validated) |
| `getStudentCategories(student)` | Public | Get student's approved categories |
| `isStudentWhitelisted(student)` | Public | Check student status |
| `isVendorWhitelisted(vendor)` | Public | Check vendor status |

---

## 🔒 Security Features

### Access Control

```solidity
// Role-based access control
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
```

### Reentrancy Protection

```solidity
function transfer(...) external nonReentrant whenNotPaused {
    // Protected from reentrancy attacks
}
```

### Emergency Pause

```solidity
function pause() external onlyRole(ADMIN_ROLE) {
    _pause();  // Stops all transfers
}
```

---

## 📊 Events

| Event | Parameters | When Emitted |
|-------|------------|--------------|
| `StudentWhitelisted` | student, categories, timestamp | Student added |
| `StudentRemoved` | student, timestamp | Student removed |
| `VendorWhitelisted` | vendor, category, name, timestamp | Vendor added |
| `VendorRemoved` | vendor, timestamp | Vendor removed |
| `FundsTransferred` | student, vendor, amount, category, timestamp | Successful transfer |

---

## 🧪 Testing

### Hardhat Tests

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EduFundManager", function () {
    let eduToken, fundManager;
    let admin, student, vendor;

    beforeEach(async function () {
        [admin, student, vendor] = await ethers.getSigners();
        
        // Deploy EduStablecoin
        const EduStablecoin = await ethers.getContractFactory("EduStablecoin");
        eduToken = await EduStablecoin.deploy("EduToken", "EDU");
        
        // Deploy EduFundManager
        const EduFundManager = await ethers.getContractFactory("EduFundManager");
        fundManager = await EduFundManager.deploy(eduToken.address);
        
        // Set fund manager
        await eduToken.setFundManager(fundManager.address);
    });

    it("Should whitelist student with categories", async function () {
        await fundManager.whitelistStudent(student.address, [0, 1]); // TUITION, BOOKS
        expect(await fundManager.isStudentWhitelisted(student.address)).to.be.true;
    });

    it("Should whitelist vendor with category", async function () {
        await fundManager.whitelistVendor(vendor.address, 0, "University");
        expect(await fundManager.isVendorWhitelisted(vendor.address)).to.be.true;
    });

    it("Should allow transfer when category matches", async function () {
        // Setup
        await fundManager.whitelistStudent(student.address, [0]); // TUITION
        await fundManager.whitelistVendor(vendor.address, 0, "University");
        await eduToken.mint(student.address, ethers.utils.parseEther("1000"));
        
        // Transfer
        await fundManager.connect(student).transfer(
            student.address,
            vendor.address,
            ethers.utils.parseEther("100")
        );
        
        expect(await eduToken.balanceOf(vendor.address))
            .to.equal(ethers.utils.parseEther("100"));
    });

    it("Should block transfer when category doesn't match", async function () {
        // Setup student for BOOKS only
        await fundManager.whitelistStudent(student.address, [1]); // BOOKS
        await fundManager.whitelistVendor(vendor.address, 0, "University"); // TUITION
        await eduToken.mint(student.address, ethers.utils.parseEther("1000"));
        
        // Attempt transfer - should fail
        await expect(
            fundManager.connect(student).transfer(
                student.address,
                vendor.address,
                ethers.utils.parseEther("100")
            )
        ).to.be.revertedWith("Category not approved for student");
    });

    it("Should block transfer to non-whitelisted vendor", async function () {
        await fundManager.whitelistStudent(student.address, [0]);
        await eduToken.mint(student.address, ethers.utils.parseEther("1000"));
        
        await expect(
            fundManager.connect(student).transfer(
                student.address,
                vendor.address,
                ethers.utils.parseEther("100")
            )
        ).to.be.revertedWith("Vendor not whitelisted");
    });
});
```

---

## 🚀 Deployment

### Deploy Script

```javascript
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying EduAid contracts...");
    
    // Deploy EduStablecoin
    const EduStablecoin = await ethers.getContractFactory("EduStablecoin");
    const eduToken = await EduStablecoin.deploy("EduAid Token", "EDU");
    await eduToken.deployed();
    console.log("EduStablecoin deployed to:", eduToken.address);
    
    // Deploy EduFundManager
    const EduFundManager = await ethers.getContractFactory("EduFundManager");
    const fundManager = await EduFundManager.deploy(eduToken.address);
    await fundManager.deployed();
    console.log("EduFundManager deployed to:", fundManager.address);
    
    // Link contracts
    await eduToken.setFundManager(fundManager.address);
    console.log("Contracts linked successfully!");
    
    return { eduToken, fundManager };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

### Hardhat Config

```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545"
        },
        mumbai: {
            url: process.env.MUMBAI_RPC_URL,
            accounts: [process.env.PRIVATE_KEY]
        },
        polygon: {
            url: process.env.POLYGON_RPC_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};
```

---

## 📝 Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| `whitelistStudent` | ~100,000 |
| `whitelistVendor` | ~80,000 |
| `transfer` | ~150,000 |
| `mint` | ~60,000 |

---

## 🔗 Contract Addresses

| Network | EduStablecoin | EduFundManager |
|---------|---------------|----------------|
| Localhost | Deploy fresh | Deploy fresh |
| Mumbai Testnet | TBD | TBD |
| Polygon Mainnet | TBD | TBD |
