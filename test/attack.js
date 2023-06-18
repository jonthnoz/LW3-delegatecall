const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("delegatecall Attack", function () {
    it("Should change the owner of the Good contract", async function () {
        // Deploy the helper contract
        const Helper = await ethers.getContractFactory("Helper");
        const helperContract = await Helper.deploy();
        await helperContract.waitForDeployment();
        console.log(
            "Helper Contract's Address:",
            await helperContract.getAddress()
        );

        // Deploy the good contract
        const Good = await ethers.getContractFactory("Good");
        const goodContract = await Good.deploy(helperContract.getAddress());
        await goodContract.waitForDeployment();
        console.log(
            "Good Contract's Address:",
            await goodContract.getAddress()
        );

        // Deploy the Attack contract
        const Attack = await ethers.getContractFactory("Attack");
        const attackContract = await Attack.deploy(goodContract.getAddress());
        await attackContract.waitForDeployment();
        console.log(
            "Attack Contract's Address",
            await attackContract.getAddress()
        );

        // Now let's attack the good contract

        // Start the attack
        let tx = await attackContract.attack();
        await tx.wait();

        expect(await goodContract.owner()).to.equal(
            await attackContract.getAddress()
        );
    });
});
