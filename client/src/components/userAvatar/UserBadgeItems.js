import { Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'

const UserBadgeItems = ({ user, handleFunction }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            color="white"
            bg="purple"
            cursor={"pointer"}

        >
            {user.name}
            <CloseIcon pl={1}
                onClick={() => handleFunction()} />
        </Box>
    )
}

export default UserBadgeItems