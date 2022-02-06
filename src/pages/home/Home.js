import React from "react";
import pinklogo from "assets/gashapon_pink.png"
import greenlogo from "assets/gashapon_green.png"
import { useHistory } from 'react-router-dom'
import { getTicketByCode } from 'db'

import { 
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Stack,
    Grid,
} from '@mui/material'  

import { Link } from 'react-router-dom'
import { useCallback } from "react";
      

export const Home = () => {

    const location = useHistory();
    const handleClick = useCallback(async e => {
        e.preventDefault(); // prevents auto-refresh

        const {shopTag, digitKey} = e.target.elements;   
        console.log(shopTag.value, digitKey.value);
        location.push(`/redeem/${shopTag.value}/${digitKey.value}`);
    }, [location]);
    
    return (
        <>
            <Container maxWidth="lg">
            <div>
                <Box component="center"
                    sx={{
                        '& > :not(style)': { m: 1, width: '40ch', height: '20ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >  
                    <Box component="form" onSubmit ={handleClick} 
                        sx={{
                            boxShadow: 3,
                            bgcolor: 'background.paper',
                
                            color: 'black',
                            p: 4,
                            m: 2,
                            borderRadius: 4,
                        }}
                        noValidate
                        autoComplete="off"
                    >   
                        
                        <Typography variant="h2" component="h2" > Welcome!</Typography>
                        <Typography variant="body" component="body" align="center"> Please Enter Play Code</Typography>
                        <TextField required id="shopTag" type="shopTag" label="Shop Tag" autoComplete="off"/>
                        <TextField required id="digitKey" type="digitKey" label="Digit Key" autoComplete="off" />                
                        <Stack spacing={10} direction="column">
                    
                        <Button variant="outlined" color ="secondary" type="submit"  >Enter</Button>
                        <Typography variant="overline" component="overline" align="center"> (No account needed to play)</Typography>
                        
                        </Stack>

                    </Box>
                </Box>
            </div>

            <Grid container justifyContent="space-between"> 
            <Box
                component="img"
                sx={{
                    justifyContent: 'flex-start',
                    height: 500,
                    width: 300,
                    maxHeight: { xs: 500, md: 250 },
                    maxWidth: { xs: 300, md: 150 },
                }}
                src={greenlogo}
            />
        
            <Box 
                component="img"
                sx={{
                    height: 500,
                    width: 300,
                    maxHeight: { xs: 500, md: 250 },
                    maxWidth: { xs: 300, md: 150 },
                }}
                src={pinklogo}
            />
            </Grid>
            </Container>
        </>
    )
}