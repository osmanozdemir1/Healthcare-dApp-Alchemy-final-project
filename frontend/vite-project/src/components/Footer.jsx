import { Box, Text } from "@chakra-ui/react"

export function Footer(){
    return(
        <Box mt={50} bgGradient="linear(to-l, blue.600, blue.200)" width="700px" height="20px" alignItems="center" display="flex" textAlign="center" justifyContent="center">
            <Text fontSize="12"> Created by Osman ♥</Text>
        </Box>
    )
}