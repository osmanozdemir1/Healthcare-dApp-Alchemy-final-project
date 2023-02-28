import { Box, Stack, Heading, Tag, Button, Select, RadioGroup, Radio, Alert, AlertIcon, Input, AlertTitle, AlertDescription, Text } from "@chakra-ui/react";
import { Header } from "../components/Header"
import { useState } from "react";
import { create } from 'ipfs-http-client';
import { ethers } from "ethers";
import ProofOfConsent from "../../../../artifacts/contracts/ProofOfConsent.sol/ProofOfConsent";
import { Footer } from "../components/Footer";


const provider = new ethers.providers.Web3Provider(window.ethereum);
const alchemyProvider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_JSON_RPC)

// Create an instance of the ProofOfConsent Contract
const contractAddress = "0x9B462b6415D150f723a4Db45840c4FCcfA6F912d";
const instance = new ethers.Contract(contractAddress, ProofOfConsent.abi, alchemyProvider);
console.log("contract address: ", instance.address);


export function Home(){
    const [account, setAccount] = useState();
    const [signer, setSigner] = useState();
    const [doYou, setDoYou] = useState();
    const [didInform, setDidInform] = useState();
    const [didComp, setDidComp] = useState();
    const [surgery, setSurgery] = useState("");
    const [surgeryDate, setSurgeryDate] = useState();
    const [surgeryTimestamp, setSurgeryTimestamp] = useState();
    const [final, setFinal] = useState("");

    async function connectWallet() {
        if(!window.ethereum){
          alert("MetaMask is not installed!")
        } 
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        setSigner(provider.getSigner())
      }

    const changeSurgery = (e) => setSurgery(e.target.value);

    function changeDate() {
        let date = document.getElementById("surgeryDate");
        setSurgeryDate(date.value);
        setSurgeryTimestamp(date.valueAsNumber);
    }

    async function mintProof() {
        if (!surgery || surgery == null || !surgeryDate) {
            alert("You need to select surgery and surgery date!");
            return;
        }

        if (!account) {
            alert("You have to connect your wallet!");
            return;
        }

        // Create an object that includes the user inputs 
        let metadataObject = {
            description: "This is the proof of consent for the surgery detailed in the attributes section below.",
            external_url: "https://osmanozdemir.hashnode.dev/",
            image: "https://ipfs.filebase.io/ipfs/QmYdgGnNEqvnTmHRpUQXmWndSEHhxSu4pPyrQSTjKch3eU",
            name: "Proof of Consent",
            attributes: [
                {
                    trait_type: "Surgery Name",
                    value: surgery
                },
                {
                    trait_type: "Surgery Date",
                    value: surgeryDate
                },
                {
                    display_type: "date",
                    trait_type: "Surgery Date",
                    value: surgeryTimestamp
                },
                {
                    trait_type: "Patient Id",
                    value: account
                }
            ]
        }

        // Convert that object to JSON string which will be the token metadata.
        const metadata = JSON.stringify(metadataObject);
        console.log("metadata: ", metadata);
       
        // Create IPFS node and upload the metadata to IPFS.
        // auth is created with infura project id and key.
        const auth = import.meta.env.VITE_AUTH;
        const ipfs = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: auth,
            },
        });

        // Upload the metadata to the IPFS and get the "cid"
        const { cid } = await ipfs.add(metadata);
        console.log("cid: ", cid.toString());

        // Assign cid to tokenURI
        const uri = "ipfs://" + cid.toString();

        // Call the addSurgery function in the contract and then mint the token.
        // Token will be minted to the contract's own address.
        // The contract is also hospital's vault.
        const tx = await instance.connect(signer).addSurgery(surgery, surgeryTimestamp, contractAddress, uri);
        const txreceipt = await tx.wait();
        console.log("receipt: ", txreceipt);
    }

    console.log("surgery: ", surgery);
    console.log("date: ", surgeryDate);
    console.log("timestamp: ", surgeryTimestamp);

    // Give an information to the user when the transaction is completed.
    instance.on('SurgeryAdded', () => {
        setFinal("✓ Your proof of consent NFT has been minted");
    })

    return (
        <Box fontFamily="monospace">
            <Stack align="end" padding={2}>
                {!account ? (
                <Button variant="outline" onClick={connectWallet} size="sm" colorScheme="teal">
                    Connect Wallet
                </Button>) : (
                <Tag size="sm" colorScheme="teal">
                    Connected
                </Tag>
                )}
            </Stack>
            <Header/>
            <Box m={5}>
                <Heading fontFamily="monospace" size="md">GIVE CONSENT</Heading>
            </Box>
            <Box fontFamily="monospace" padding="0 2rem">
                <Text fontSize={14}>Do you know your surgery?</Text>
                <RadioGroup m={1} onChange={setDoYou}>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                </RadioGroup>
                <Box>
                    {!doYou ? (
                        <h1></h1>
                    ) : (
                        <Box>
                        {doYou == "no" ? (
                            <Alert status="error" alignItems="center" textAlign="center" justifyContent="center">
                                <AlertIcon />
                                You should ask your doctor about your surgery!
                            </Alert>
                        ) : (
                            <Box>
                                <Select value={surgery} onChange={changeSurgery} placeholder="Select your surgery" size="sm" variant="flushed" isRequired>
                                <option value="Cystoscopy">Cystoscopy</option>
                                <option value="Ureterorenoscopy">Ureterorenoscopy</option>
                                <option value="Endoscopic Ureterolithotripsy">Endoscopic Ureterolithotripsy</option>
                                <option value="Percutaneous Nephrolithotomy">Percutaneous Nephrolithotomy</option>
                                <option value="Radical Nephrectomy">Radical Nephrectomy</option>
                                <option value="Partial Nephrectomy">Partial Nephrectomy</option>
                                <option value="Radical Prostatectomy">Radical Prostatectomy</option>
                                <option value="Radical Cystectomy">Radical Cystectomy</option>
                                <option value="Transuretral Resection of Bladder Tumor">Transuretral Resection of Bladder Tumor</option>
                                <option value="Transuretral Resection of Prostate">Transuretral Resection of Prostate</option>
                                <option value="Hydrocelectomy">Hydrocelectomy</option>
                                <option value="Varicocelectomy">Varicocelectomy</option>
                                <option value="Orchiectomy">Orchiectomy</option>
                                <option value="Orchidopexy">Orchidopexy</option>
                                <option value="Penile Curvature Surgery">Penile Curvature Surgery</option>
                                <option value="Penile Prothesis Implantation">Penile Prothesis Implantation</option>
                                <option value="Intravesical Botox Injection">Intravesical Botox Injection</option>
                                <option value="Transobturator Tape Surgery">Transobturator Tape Surgery</option>
                                </Select>
                                <Box fontSize={14} textAlign="left" mt={5}>
                                    <label>Your surgery date: </label> <Input width="100" id="surgeryDate" size="sm" type="date" onChange={changeDate}/>
                                </Box>
                                <Box mt={5}>
                                    <Text fontSize={14}>Did your doctor inform you about your surgery?</Text>
                                    <RadioGroup m={1} onChange={setDidInform}>
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </RadioGroup>
                                    <Box>
                                        {!didInform ? (
                                            <h1></h1>
                                        ) : (
                                            <Box>
                                                {didInform == "no" ? (
                                                <Alert status="error" alignItems="center" textAlign="center" justifyContent="center">
                                                    <AlertIcon />
                                                    You have to ask your doctor about your surgery!
                                                </Alert>
                                            ) : (
                                                <Box mt={5}>
                                                    <Text fontSize={14} fontFamily="monospace">Did your doctor inform you about complications?</Text>
                                                    <RadioGroup m={1} onChange={setDidComp}>
                                                        <Radio value="yes">Yes</Radio>
                                                        <Radio value="no">No</Radio>
                                                    </RadioGroup>
                                                    <Box>
                                                        {!didComp ? (
                                                            <h1></h1>
                                                        ) : (
                                                            <Box>
                                                                {didComp == "no" ? (
                                                                    <Alert status="error" alignItems="center" textAlign="center" justifyContent="center">
                                                                        <AlertIcon />
                                                                        You have to ask your doctor about possible complications!
                                                                    </Alert>
                                                                ) : (
                                                                    <Box>
                                                                        <Alert status="success" alignItems="center" textAlign="center" justifyContent="center">
                                                                            <AlertIcon />
                                                                            You can give consent now!
                                                                        </Alert>
                                                                        <Button onClick={mintProof} colorScheme="telegram" variant="solid" mt={30}> Mint Proof of Consent </Button>
                                                                        <Alert mt={1} status="warning" alignItems="center" textAlign="center" justifyContent="center" fontSize="9" height="20px">
                                                                            <AlertIcon boxSize="3"/>
                                                                            <AlertDescription>This is not the original consent form. This is only the proof that you and your doctor have communicated.</AlertDescription>
                                                                        </Alert>
                                                                        <Box textColor="green.700" mt={3} id="minted">
                                                                            {final}
                                                                        </Box>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                        </Box>
                    )}
                </Box>
            </Box>
            <Footer/>
        </Box>
    )
}
