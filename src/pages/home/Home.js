    import React from "react";
    import pinklogo from "../../assets/gashapon_pink.png"
    import greenlogo from "../../assets/gashapon_green.png"


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
    export const Home = () => {
        
        return (
            <>
        <Container maxWidth="lg"
            
            >
            <div>
                
                <Box component="center" 
                sx={{
                    '& > :not(style)': { m: 1, width: '40ch',height: '20ch' }
                    ,
                    
                }}
                noValidate
                autoComplete="off"
                >  
                    <Box component="center" 
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
                        <TextField required id="storeName" type="storeName" label="Store Name" autoComplete="off"/>
                        <TextField required id="digitKey" type="digitKey" label="Digit Key" autoComplete="off" />                
                        <Stack spacing={10} direction="column">
                    
                            <Link to ="/RedeemScreen">
                                <Button variant="outlined" color ="secondary" type="submit" >Enter</Button>
                            </Link>
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
                maxHeight: { xs: 500, md: 250
                },
                maxWidth: { xs: 300, md: 150 },
                }}
            src= {greenlogo}
        />
        
            <Box 
            component="img"
            sx={{
                height: 500,
                width: 300,
                maxHeight: { xs: 500, md: 250
                },
                maxWidth: { xs: 300, md: 150 },
                }}
            src= {pinklogo}
        />
        </Grid>
        </Container>
        
        
            </>
        );
    }

