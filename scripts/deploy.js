async function main() {
  const StrawberryTraceability = await ethers.getContractFactory("StrawberryTraceability");
  const contract = await StrawberryTraceability.deploy();
  await contract.waitForDeployment();

  console.log("✅ Contract deployed at:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});