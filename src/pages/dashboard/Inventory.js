import { DataGrid } from '@mui/x-data-grid'
import { 
    Box,
    Button,
    Snackbar,
    TextField,
    Avatar
} from '@mui/material'
import { 
    useCallback, 
    useEffect,
    useState
} from 'react'

import { addNewPrize } from 'api'
import { useAuthState } from 'auth'
import {
    getPrizesGeneratedByUser,
    savePrizesToMemory,
    deletePrize
} from 'db'
import { 
    uploadImage
} from 'storage'


const columns = [
    {field: 'image', headerName: 'Image', width: 150,
        renderCell: (params) => {
            return (<Avatar src={params.value}/>);
        }
    },
    { field: 'name', headerName: 'Item', width: 170 },
    { field: 'description', headerName: 'Description', width: 170 },
    { field: 'createdAt', headerName: 'Date added', width: 220, type: "dateTime",
        valueGetter: ({value}) => value && (new Date(value.seconds*1000)) },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 90}
];

export const Inventory = () => {
    const { user } = useAuthState();
    const [rows, setRows] = useState([]);
    const [prizeData, setPrizeData] = useState([]);
    const [open, setOpen] = useState(false); // snackbar state 
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([])
   
    useEffect(() => {
        async function fetchData() {
            const prizes = await getPrizesGeneratedByUser(user);
            setPrizeData(prizes);
        }
        fetchData();
    }, [user]);

    useEffect(() => {
        setRows(prizeData);
    }, [prizeData]);
    

    const imageUpload = useCallback((event) => {
        const image = event.target.files[0];
        if (image.type !== "image/png" && image.type !== "image/jpeg") {
            alert("Invalid file type! Must be png or jpeg.")
            return;
        }
        setSelectedImage(image);
    }, []);


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
        const url = await uploadImage(selectedImage);
        if (!url) { // if url is null
            alert("Failed to upload image!");
            return;
        }
          
        // TODO: make sure user is passing a valid integer value
        
        addNewPrize(name.value, description.value, quantity.value, url)
            .then((result) => {
                result = result.data;
                const fullPrizeData = {
                    docId: result.id,
                    name: result.prizeInfoData.name,
                    description: result.prizeInfoData.description,
                    image: result.prizeInfoData.image,
                    quantity: result.prizeMetaData.quantity,
                    createdAt: result.prizeMetaData.createdAt
                }                
                setPrizeData(savePrizesToMemory([fullPrizeData]));
                setOpen(true);
            })
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                alert(`${code}: ${message}`);
            });
    }, [selectedImage]);


    const onDeleteClick = useCallback(async (e) => {
        let numDeleted = 0;
        for(let i = 0; i < selectedRows.length; i++) {
            const row = selectedRows[i] - numDeleted - 1; // index 0 refers to row 1 in the DataGrid
            const id = rows[row].docId;
            
            if (await deletePrize(id))
                numDeleted++;
            else
                console.error("Failed to delete prize with ID: ", id);
        }
        setRows(rows.filter(index => !selectedRows.includes(index)));
    }, [rows, selectedRows]);


    // HTML
    return (
        <>
            <div className="prizes-header"></div>
            <div className="prizes-body">
                <DataGrid
                    autoHeight={true}
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    onSelectionModelChange={(ids) => {setSelectedRows(ids)}}
                />
            </div>
            
            <Box component="form" className="prizes-footer" onSubmit={sendNewPrizeRequest}>
                <Button variant="contained" color="primary" onClick={onDeleteClick} startIcon={<div/>}>Delete</Button>
                <input
                    accept="image/*"
                    type="file"
                    name="myImage"
                    onChange={imageUpload}
                    required
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