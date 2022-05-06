import { 
    DataGrid, 
    GridToolbarContainer, 
    GridToolbarDensitySelector, 
    GridToolbarFilterButton 
} from '@mui/x-data-grid'
import { 
    Backdrop,
    Box,
    Snackbar,
    //TextField,
    Avatar
} from '@mui/material'
import { 
    useCallback, 
    useEffect,
    useState
} from 'react'

import { addNewPrize } from 'api'
import { useAuthState } from 'auth'
import { TextButton, TextField, SolidButton, OutlinedButton } from 'components'
import {
    getPrizesGeneratedByUser,
    deletePrize
} from 'db'
import { uploadImage } from 'storage'


const columns = [
    {field: 'image', headerName: 'Image', width: 150, sortable: false, filterable: false,
        renderCell: (params) => {
            return (<Avatar className="inventory-image" src={params.value}/>);
        }
    },
    { field: 'name', headerName: 'Item Name', width: 700,
        renderCell: (params) => {
            return(<div className="item-name-cell">{params.value}</div>)
        }
    },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 150,
        renderCell: (params) => {
            return (<div className="item-quantity-cell">{params.value}</div>)
        }
    },
    {
        field: 'docID', headerName: '', width: 100, sortable: false, filterable: false,
        renderCell: (params) => {
            return (<TextButton size="large">EDIT</TextButton>)
        }
    }
];

function InventoryToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton/>
        </GridToolbarContainer>
    );
}

export const Inventory = () => {
    const { user } = useAuthState();
    const [rows, setRows] = useState([]);
    const [prizeData, setPrizeData] = useState([]);
    const [open, setOpen] = useState(false); // snackbar state 
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([])
    const [prizeEditor, showPrizeEditor] = useState(false);
   
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
        
        await addNewPrize(name.value, description.value, quantity.value, url)
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                alert(`${code}: ${message}`);
            });
        
        setPrizeData(await getPrizesGeneratedByUser(user));
        setOpen(true);
        showPrizeEditor(false);
    }, [selectedImage, user]);


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
        setPrizeData(await getPrizesGeneratedByUser(user));
    }, [rows, selectedRows, user]);

    const openPrizeEditor = useCallback((e) => {
        showPrizeEditor(true);
    }, []);

    const closePrizeEditor = useCallback((e) => {
        showPrizeEditor(false);
    }, []);

    // HTML
    return (
        <>
            <div id="inventory-header">
                <TextButton onClick={openPrizeEditor}>+ Add New Prize</TextButton>
                {false && <SolidButton onClick={onDeleteClick}>Delete</SolidButton>}
            </div>

            <div id="inventory-body">
                <DataGrid
                    className="inventory-data-table"
                    disableColumnMenu
                    disableSelectionOnClick
                    hideFooterPagination
                    autoHeight={false}
                    rowHeight={120}
                    rows={rows}
                    columns={columns}
                    pageSize={99}
                    rowsPerPageOptions={[10]}
                    //checkboxSelection
                    onSelectionModelChange={(ids) => {setSelectedRows(ids)}}
                    components={{Footer: InventoryToolbar}}
                />
            </div>
            
            <div id="inventory-footer"></div>
            
            <Backdrop open={prizeEditor}>
                <Box className="prize-editor-box" component="form" onSubmit={sendNewPrizeRequest}>
                    <div className="prize-editor-content">
                        <input
                            className="image-upload"
                            accept="image/*"
                            type="file"
                            name="myImage"
                            onChange={imageUpload}
                            required
                        />

                        <TextField required id="name" type="name" label="Prize Name" />
                        <TextField id="description" type="text" label="Prize Description" />
                        <TextField required id="quantity" type="quantity" label="Initial Quantity" />

                        <div id="prize-editor-footer">
                            <OutlinedButton type="reset" onClick={closePrizeEditor}>Cancel</OutlinedButton>
                            <SolidButton type="submit">Submit</SolidButton>
                        </div>
                    </div>
                </Box>
            </Backdrop>

            <Snackbar message="Prize successfully generated" open={open} autoHideDuration={6000} onClose={handleClose}/>
        </>
    );
}