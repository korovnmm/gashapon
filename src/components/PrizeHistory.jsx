import { Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState, } from "react";
import { PrizeContext } from "pages/home/RedeemScreen";
import { db } from '../firebase'
import {
    collection, 
    getDocs,
    query,
    where,
} from 'firebase/firestore'
import { getPrizeInfo } from "db";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
//getticketsbyemail
//similar to get tickets by user
/**
 * @param {*} user 
 * @returns a list of prizes (info and metadata together) created by the given user
 */
const getTicketsByEmail = async (email) => {
    const ticketRef = collection(db, "ticket-info");
    const q = query(ticketRef,
        where("email", '==', email));
    
    const snap = await getDocs(q); // returns a promise

    const redeemedTickets = [];
    
    for (let i = 0; i < snap.size; i++) {
        const doc = snap.docs[i];
        let ticketData = doc.data();
        ticketData.id = i + 1;
        redeemedTickets.push(ticketData);

    }
    return redeemedTickets;
}
//prizeList[i].image set it as a state, 
//state for rendering, 

export function PrizeHistoryCarousel(props) {
    const [prizeList, setPrizeList] = useState([]);
    const [ticketList, setTicketList] = useState([]);
    const prize = useContext(PrizeContext);

    useEffect(() => {
        async function fetchData(){
            const ticketList = await getTicketsByEmail(prize.ticket.email);
            let prizeList = [];
            for (let ticket of ticketList){
                prizeList.push(await getPrizeInfo(ticket.prizeID));
            }
            setPrizeList(prizeList);
            setTicketList(ticketList);
        }
        fetchData();
    }, [prize.ticket.email,prize.ticket]);//gets called everytime variable updates, else once.
    
    return (
            <Box height = "20%" width = "80%" position="absolute" bottom="100px" 
            sx={{ borderRadius: "2%", backgroundColor: "white"}}>
                <Container maxWidth="sm">
                
                <ImageList cols={prizeList.length}>
                    {prizeList.map((prize) => (
                        
                        <ImageListItem key={prize.img} >
                            <Link to= "/reedem">
                            <img
                                width = "100"
                                height = "100"
                                objectFit = 'cover'
                                src={prize.image}
                                srcSet={prize.image}
                                alt={prize.name}
                                loading="lazy"
                                style ={{borderRadius: "5%"}}
                            />
                            </Link>

                        <ImageListItemBar
                                title={prize.name}
                                subtitle={<span>{prize.description}</span>}
                                position="below"
                                
                        
                        />
                        </ImageListItem>
                    ))}

                </ImageList>
                </Container>
            </Box>
    );
}