import { 
    Box,
    Button,
    Snackbar,
    TextField,
    Avatar
} from '@mui/material'
import { useCallback, useEffect } from 'react'
import { addNewPrize } from 'api'
import { DataGrid } from '@mui/x-data-grid'
import { useAuthState } from 'auth'
import { getPrizesGeneratedByUser, savePrizesToMemory } from 'db';
import { useState } from 'react'
import {storage} from 'storage'
import {uploadBytes, ref,getDownloadURL} from 'firebase/storage'
//const amountOptions = Array.from({length:10}, (v,k)=>k+1); 

const columns = [
    {field: 'image', headerName: 'Image', width: 150,
        renderCell: (params) => {
            return (
                <>
                    <Avatar src={params.value} />
                </>
            );
        }
    },
    { field: 'name', headerName: 'Item', width: 170 },
    { field: 'description', headerName: 'Description', width: 170 },
    { field: 'createdAt', headerName: 'Date added', width: 220, type: "dateTime",
    valueGetter: ({value}) => value && (new Date(value.seconds*1000)) },
    { field: 'quantity', headerName: 'Quantity', type: 'number', editable: true, width: 90}
];
export const Inventory = () => {
    const { user } = useAuthState();
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false); // snackbar state 
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        getPrizesGeneratedByUser(user) 
            .then((prizeData) => {
                setRows(prizeData) 
            })
        ;
    }, [rows, user]);

    
    const imageUpload = useCallback((event) => {
        const image = event.target.files[0];
        setSelectedImage(image);
    }, [selectedImage]);


    const handleClose = (event, reason) => { // snackbar close
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const sendNewPrizeRequest = useCallback(async e => {
        e.preventDefault();
        const { name, description, quantity } = e.target.elements;
        
        // Upload image
        const imageRef = ref(storage, selectedImage.name);
        await uploadBytes(imageRef, selectedImage);
        const url = await getDownloadURL(imageRef);

        // TODO: make sure user is passing a valid integer value
        
        addNewPrize(name.value, description.value, quantity.value, url)
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
                alert(`${code}: ${message}`);
            });
    }, [selectedImage]);


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
                    
                    <input
                        type="file"
                        name="myImage"
                        onChange={imageUpload}
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