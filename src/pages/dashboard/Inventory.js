import { 
    Box,
    Button,
    Snackbar,
    TextField,
} from '@mui/material'
import { useCallback, useEffect } from 'react'
import { addNewPrize } from 'api'
import { DataGrid } from '@mui/x-data-grid'
import { useAuthState } from 'auth'
import { getPrizesGeneratedByUser, savePrizesToMemory } from 'db';
import { useState } from 'react'
import {storage} from 'storage'
import {uploadBytes, ref,getDownloadURL } from 'firebase/storage'
//const amountOptions = Array.from({length:10}, (v,k)=>k+1); 

const columns = [
    { field: 'name', headerName: 'Item', width: 170 },
    { field: 'prizeID', headerName: 'Item ID Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 170 },
    { field: 'createdAt', headerName: 'Date added', width: 220, type: "dateTime",
    valueGetter: ({value}) => value && (new Date(value.seconds*1000)) },
    { field: 'quantity', headerName: 'Quantity', type: 'number', editable: true, width: 90},
    {  field: 'image',
        headerName: 'Image',
        width: 150,
        renderCell: (params) => <img src={params.value} />}
];

export const Inventory = () => {
    const { user } = useAuthState();
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false); // snackbar state 
 
    useEffect(() => {
        getPrizesGeneratedByUser(user) 
            .then((prizeData) => {
                setRows(prizeData)
                
            })
        ;
    }, [rows, user]);

    const [selectedImage, setSelectedImage] = useState(null);
    // const imageUpload = (event) =>{
    //     console.log(event.target.files[0]);
    //     const image = event.target.files[0];
    //     const imageRef = ref(storage,image.name)
    //     uploadBytes(imageRef, image).then((snapshot) => {
    //         console.log('Uploaded file!');
        
    //       });
    //     return imageRef
    //     }


    const handleClose = (event, reason) => { // snackbar close
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    

    const sendNewPrizeRequest = useCallback(async e => {
        e.preventDefault();
        
        const url = getDownloadURL(imageRef);

        const { name, description, quantity } = e.target.elements;
        addNewPrize(name.value, description.value, quantity.value,)
            .then((result) => {
                const data = result.data;
                const prizes = []
                for(const [key, value] of Object.entries(data)){
                    value.code = key;
                    prizes.push(value);
                    prizes.push(url);
                }
                setRows(savePrizesToMemory(prizes));
        
                setOpen(true);
            })
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                alert(`${code}: ${message}`);
            });
    }, []);


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
                />
            </div>
            <Box component="form" class="prizes-footer" onSubmit={sendNewPrizeRequest}>
                    {selectedImage && (
                        <div>
                        <img alt="not found" width={"250px"} src={URL.createObjectURL(selectedImage)} />
                        <br />
                        <button onClick={()=>setSelectedImage(null)}>Remove</button>
                        </div>
                    )}
                    <input
                        type="file"
                        name="myImage"
                        onChange={(event) => {
                            const image = event.target.files[0];
                            const imageRef = ref(storage,image.name)
                            console.log(event.target.files[0]);
                            setSelectedImage(event.target.files[0]);
                            uploadBytes(imageRef, image).then((snapshot) => {
                            console.log('Uploaded file!');
                        });
        }}
      />

                <TextField required id="name" type="name" label="Prize Name" />
                <TextField id="description" type="text" label="Prize Description" />
                <TextField required id="quantity" type="quantity" label="Quantity" />

                <Button  variant="contained" type="submit">Add Prize!</Button>
            </Box>
            <Snackbar message="Prize successfully generated" open={open} autoHideDuration={6000} onClose={handleClose}/>
        </>
    );
    }