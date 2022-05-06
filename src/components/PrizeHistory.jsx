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
import Slider from "react-slick";
import SliderArrow from "./SliderArrow";

const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 4,
    nextArrow: <SliderArrow />,
    prevArrow: <SliderArrow />,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 6,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        }
    ]
};


/**
 * @param {string} email 
 * @returns a list of tickets containing the matching email field
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
        ticketData.docID = doc.id;
        redeemedTickets.push(ticketData);
    }
    return redeemedTickets;
}

export function PrizeHistoryCarousel(props) {
    const [prizeList, setPrizeList] = useState([]);
    const prize = useContext(PrizeContext);

    useEffect(() => {
        async function fetchData(){
            const ticketList = await getTicketsByEmail(prize.ticket.email);
            let prizeList = [];
            for (let ticket of ticketList){
                let prizeInfo = await getPrizeInfo(ticket.prizeID);
                prizeInfo.ticketURL = ticket.docID.replace('-', '/');
                prizeList.push(prizeInfo);
            }
            setPrizeList(prizeList);
        }
        if (prize.ticket.email)
            fetchData();
    }, [prize.ticket.email]); // gets<div className="star-container"> called everytime variable updates, else once.
    
    return (
        <center id="prizehistory-box" className="carousel">
           
            <div className="slider-container">
                <Slider {...sliderSettings}>
                    {prizeList.map((prize) => (
                        <div className="carousel-item" key={prize.ticketURL}>
                            <Link to={`/redeem/${prize.ticketURL}`}>
                                <img
                                    width = "100"
                                    height = "100"
                                    objectfit = 'cover'
                                    src={prize.image}
                                    srcSet={prize.image}
                                    alt={prize.name}
                                    loading="lazy" />
                            </Link>
                            <p style={{margin: "0"}}>
                                {prize.name}
                            </p>
                            
                        </div>

                    ))}
                </Slider>
                </div>
        </center>
    );
}