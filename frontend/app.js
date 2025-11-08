// ===== CONFIGURATION =====
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
  [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "producer",
          "type": "string"
        }
      ],
      "name": "ProductCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "participant",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "eventType",
          "type": "string"
        }
      ],
      "name": "ProductUpdated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "origin",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "date",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "producer",
          "type": "string"
        }
      ],
      "name": "createProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "productId",
          "type": "string"
        }
      ],
      "name": "getHistory",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "participant",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "eventType",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "date",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct StrawberryTraceability.Event[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "productId",
          "type": "string"
        }
      ],
      "name": "getProducer",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "participant",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "eventType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "date",
          "type": "string"
        }
      ],
      "name": "updateProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
];

// ---------- CONNECT TO CONTRACT ----------
async function getContract() {
  if (!window.ethereum) {
    alert("❌ MetaMask not detected. Please install it to use this DApp.");
    throw new Error("MetaMask not found");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  // ethers v6 syntax:
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Optional: verify correct network (Hardhat localhost)
  const network = await provider.getNetwork();
  if (network.chainId !== 31337) {
    alert("⚠️ Please switch MetaMask to the Hardhat network (chainId 31337)");
  }

  return new ethers.Contract(contractAddress, contractABI, signer);
}

// ---------- CREATE PRODUCT ----------
async function createProduct() {
  const id = document.getElementById("pid").value.trim();
  const name = document.getElementById("pname").value.trim();
  const origin = document.getElementById("porigin").value.trim();
  const date = document.getElementById("pdate").value.trim();
  const producer = document.getElementById("pproducer").value.trim();

  if (!id || !name || !origin || !date || !producer) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  const contract = await getContract();
  const tx = await contract.createProduct(id, name, origin, date, producer);
  await tx.wait();

  alert("✅ Product added successfully!");
  QRCode.toCanvas(document.getElementById("qrcode"), id);
}

// ---------- UPDATE PRODUCT ----------
async function updateProduct() {
  const id = document.getElementById("upid").value.trim();
  const participant = document.getElementById("uparticipant").value.trim();
  const event = document.getElementById("uevent").value.trim();
  const date = document.getElementById("udate").value.trim();

  if (!id || !participant || !event || !date) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  const contract = await getContract();
  const tx = await contract.updateProduct(id, participant, event, date);
  await tx.wait();

  alert("✅ Product updated successfully!");
}

// ---------- GET PRODUCT HISTORY ----------
async function getHistory() {
  const id = document.getElementById("gid").value.trim();
  if (!id) {
    alert("⚠️ Enter a product ID first.");
    return;
  }

  const contract = await getContract();
  const history = await contract.getHistory(id);

  let text = "";
  history.forEach((h) => {
    text += `${h.participant} → ${h.eventType} on ${h.date}\n`;
  });

  document.getElementById("output").textContent =
    text || "No history found for this ID.";
}