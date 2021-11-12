import React from "react";

import { 
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Stack
} from '@mui/material'
import { Link } from 'react-router-dom'

import { RedeemScreen } from './RedeemScreen'

const home = [
    {
        name: "RedeemScreen",
        id: "redeemScreen",
        component: RedeemScreen
    }
]

export const Home = () => {
    
    return (
        <>
        
    <Container maxWidth="lg"
        >
    <div>
    <Box component="center" 
    sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >               
                    <Typography variant="h2" component="h2" > Welcome!</Typography>
                    <Typography variant="body" component="body" align="center"> Please Enter Play Code</Typography>
                    <TextField id="storeName" type="storeName" label="Store Name" autoComplete="off"/>  
                    <TextField id="digitKey" type="digitKey" label="Digit Key" autoComplete="off" />
                    <Stack spacing={2} direction="column">
                    <Link to ="/RedeemScreen">
                    <Button variant="outlined" color ="secondary" type="submit" >Enter</Button>
                    </Link>
                    <Typography variant="overline" component="overline" align="center"> (No account needed to play)</Typography>
                    
                    </Stack>
                </Box>
                </div>
    </Container>
        </>
    );
}

