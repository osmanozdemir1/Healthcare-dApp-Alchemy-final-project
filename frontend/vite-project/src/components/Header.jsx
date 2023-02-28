import { Box, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"

export function Header(){
    return(
        <Box bgGradient="linear(to-r, blue.600, blue.200)" width="700px" height="120px">
            <Text fontSize="32"> Welcome to Alchemy University Training and Research Hospital </Text>
            <Breadcrumb fontSize={16} alignItems="center" display="flex" textAlign="center" justifyContent="center" separator="|">
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Give Consent</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/check">Check Consent</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </Box>
    )
}