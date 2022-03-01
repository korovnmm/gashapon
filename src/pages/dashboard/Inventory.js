import { 
    Box,
    Button,
    Snackbar,
    TextField,
} from '@mui/material'
import { useCallback, useEffect } from 'react'
import {firebaseApp} from 'firebase'
import { getStorage, ref, uploadBytes } from "firebase/storage";

import { DataGrid } from '@mui/x-data-grid'
import { generatePrizes } from 'api'
import { useAuthState } from 'auth'
import { getPrizesGeneratedByUser, savePrizesToMemory } from 'db';
import { useState } from 'react'

//const amountOptions = Array.from({length:10}, (v,k)=>k+1); 

const columns = [
    { field: 'name', headerName: 'Item', width: 170 },
    { field: 'prizeID', headerName: 'Item ID Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 170 },
    { field: 'createdAt', headerName: 'Date added', width: 220, type: "dateTime",
    valueGetter: ({value}) => value && (new Date(value.seconds*1000)) },
    { field: 'quantity', headerName: 'Quantity', width: 90},
    //{ field: 'image', headerName: 'Quantity', width: 90} take in var image that correlates w the product in the image ID

];


export const Inventory = () => {
    const { user } = useAuthState();
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false); // snackbar state 
    
    useEffect(() => {
        getPrizesGeneratedByUser(user) 
            .then((prizeData) => {
                setRows(prizeData)
            });
    }, [rows, user]);

    const handleClose = (event, reason) => { // snackbar close
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const sendGeneratePrizesRequest = useCallback(async e => {
        e.preventDefault();
        
        const { name, description, quantity } = e.target.elements;
        generatePrizes(name.value, description.value, quantity.value)
            .then((result) => {
                const data = result.data;
                const prizes = []
                for(const [key, value] of Object.entries(data)){
                    value.code = key;
                    prizes.push(value);
                }
                setRows(savePrizesToMemory(prizes));
                setOpen(true);
            })
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                const details = error.details;
                alert(`${code}: ${message}`);
            });
    }, []);
    
    //grabs our firebase storage
    const storage = getStorage(firebaseApp);

    //on upload of image, handle the file and upload it to the firebase storag using uploadbytes
    const fileselectorHandler = (e) =>{
            
            const file = e.target.files[0]
            const storageRef = ref(storage)
            const imageRef = ref(storage,file.name)
            const imageName = imageRef.name;

            uploadBytes(imageRef, file).then((snapshot) => {
                console.log('Uploaded file!');

              });

            // const storageRef = app.storage().ref();
            // const imageRef = storageRef.child(file.name);
        // imageRef.getDownloadURL().then(function(url){
                
            //     document.querySelector('img').src = url;
                
            //   }).catch(function(error) {
            //     console.error(error);
            //   });
            
        //  storageRef.child(imageRef).getDownloadURL().then(function(url) {
        //      var test = url;
        //      alert(url);
        //      document.querySelector('img').src = test;

        //  }).catch(function(error) {

        //  });
        }
            
   

 
    return (
        <>
        
            <div class="prizes-header"></div>
            <div class="prizes-body">
                <DataGrid
                    autoHeight={true}
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                />
                

            </div>
            
            <Box component="form" class="prizes-footer" onSubmit={sendGeneratePrizesRequest}>
                <form>
                <input type="file" onChange ={fileselectorHandler}/>
                            
                <TextField required id="name" type="name" label="Prize Name" />
                <TextField id="description" type="text" label="Prize Description" />
                <TextField required id="quantity" type="quantity" label="Quantity" />
                
                <Button  variant="contained" type="submit">Add Prize!</Button>
                </form>

            </Box>
            <Snackbar message="Prize successfully generated" open={open} autoHideDuration={6000} onClose={handleClose}/>
        </>
    );
}