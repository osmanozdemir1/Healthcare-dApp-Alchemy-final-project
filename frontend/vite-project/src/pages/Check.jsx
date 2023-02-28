import { Header } from "../components/Header"
import { Alert, AlertDescription, AlertIcon, Box, Image, Flex, Text, Heading, Button, Input, SimpleGrid} from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Footer } from "../components/Footer"
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useState } from "react";
import { ethers } from "ethers";

export function Check(){
   const [allTokens, setAllTokens] = useState();
   const [hasQueried, setHasQueried] = useState(false);

   // Create Alchemy config and use Alchemy-SDK 
    const config = {
        apiKey: import.meta.env.VITE_API_KEY,
        network: Network.ETH_GOERLI,
      };
    const alchemy = new Alchemy(config);

    // Function to get NFTs for a given address
    async function getContractTokens(address) {
        const data = await alchemy.nft.getNftsForOwner(address);
        console.log("data: ", data);

        let tokenMetadatas = [];

        for (let i = 0; i < data.ownedNfts.length; i++){
            const tokenData = await alchemy.nft.getNftMetadata(
                data.ownedNfts[i].contract.address,
                data.ownedNfts[i].tokenId
            );
            tokenMetadatas.push(tokenData);
        }
        setAllTokens(tokenMetadatas);
    }

    console.log("alltokens: ", allTokens);
    

    // Function to get the contract's all tokens. (Contract is actually the vault of the hospital).
    async function checkAll() {
        const hospitalVault = document.getElementById("vault").value;
        const isAddress = ethers.utils.isAddress(hospitalVault);
        // Check if the address is valid.
        if(!isAddress){
            alert("Please type a valid hospital contract address!");
        } else {
            // Call the getContractTokens function described previously
            await getContractTokens(hospitalVault);
            setHasQueried(true);
        }
    }

    // All tokens are owned by the contract (aka. hospital vault).
    // This is the function to get tokens that created by specific address (aka. the patient). 
    async function checkPatient() {
        const hospitalVault = document.getElementById("vault").value;
        const patientWallet = document.getElementById("patient").value;
        const isVault = ethers.utils.isAddress(hospitalVault);
        const isWallet = ethers.utils.isAddress(patientWallet);
        // Check if contract adress or patient adress are valid.
        if(!isVault || !isWallet) {
            alert("Please type valid addresses for both of the hospital and patient!");
        } else {
            // Get the contract's tokens.
            await getContractTokens(hospitalVault)
            // Search the patient id and user input in the token attributes.
            // If the patient id and the input is the same, update patientTokens.
            let patientTokens = [];
            for (let i = 0; i < allTokens.length; i++){
                for(let j = 0; j < allTokens[i].rawMetadata.attributes.length; j++){
                    if(allTokens[i].rawMetadata.attributes[j].trait_type == "Patient Id" && allTokens[i].rawMetadata.attributes[j].value.toLowerCase() == patientWallet.toLowerCase()) {
                        patientTokens.push(allTokens[i]);
                        console.log("equal");
                    }
                }
            }
            
            setAllTokens(patientTokens);
            setHasQueried(true);
            console.log("ptokens: ", patientTokens);
        }
    }


    return(
        <Box fontFamily="monospace">
            <Box mt={5}>
                <Header />
            </Box>
            <Box m={5}>
                <Heading fontFamily="monospace" size="md">CHECK CONSENT</Heading>
            </Box>
            <Box m={2} display="flex" justifyContent="center">
                <Input id="vault" width={400} placeholder="Hospital's contract address"></Input>
                <Button onClick={checkAll} width={220} ml={2}>Check all consents</Button>
            </Box>
            <Box m={2} display="flex" justifyContent="center">
                <Input id="patient" width={400} placeholder="Patient's wallet address"></Input>
                <Button onClick={checkPatient} width={220} ml={2}>Check patient consents</Button>
            </Box>
            <Box mt={10}>
                <Heading fontFamily="monospace" fontSize={14}> Proof of Consent NFTs </Heading>
                <Box>
                    {!hasQueried ? (
                        <Text>Please make a query. It might take a few seconds...</Text>
                    ) : (
                        <Box>
                            {!allTokens ? (
                                <Alert status='info'>
                                    <AlertIcon />
                                    <AlertDescription>
                                    NFTs are loading...
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Box>
                                    {allTokens.length == 0 ? (
                                        <Alert status='warning'>
                                            <AlertIcon />
                                            <AlertDescription>
                                            This contract / account doesn't have any consent NFTs!
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <SimpleGrid justifyContent="center" columns={3} spacing={12}>
                                            {allTokens.map((e, i) => {
                                                return (
                                                    <Flex
                                                        flexDir={'column'}
                                                        color="black"
                                                        w={'22vw'}
                                                        key={e.id}
                                                    >
                                                        <Box>
                                                            <b>Name:</b> {allTokens[i].title}
                                                        </Box>
                                                        <Box ml={2} textAlign="left">
                                                            <b>Surgery: </b> {allTokens[i].rawMetadata.attributes[0].value}
                                                        </Box>
                                                        <Image src={allTokens[i].rawMetadata.image} />
                                                        <a target="_blank" href={`https://testnets.opensea.io/assets/goerli/0x9b462b6415d150f723a4db45840c4fccfa6f912d/${allTokens[i].tokenId}`}><ExternalLinkIcon />Check on Opensea</a>
                                                    </Flex>
                                                )
                                            })}
                                        </SimpleGrid>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
            <Footer />
        </Box>
    )
}