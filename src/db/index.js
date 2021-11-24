import { db } from '../firebase'
import {
    collection, 
    doc, 
    getDoc,
    getDocs,
    query,
    where 
} from 'firebase/firestore'
//import { useCollectionData } from 'react-firebase-hooks/firestore'

var cache = {
    shopTag: null,
    ticketData: [],
    uid: null
}

export function clearCachedData() {
    cache = {};
}

export function saveTicketsToMemory(data) {
    if (cache.ticketData) {
        for (let i = 0; i < data.length; i++) {
            data[i].id = cache.ticketData.length+1;
            cache.ticketData = Array.prototype.concat(cache.ticketData,data[i]);
        }
    } else {
        cache.ticketData = [data];
    }
    return cache.ticketData;
}



/**
 * Retrieves JSON object info of a single ticket from the database
 * @param {string} code a ticket's play code (must exist on the database first)
 * @returns {Promise<any>} JSON data for the ticket
 */
export const getTicketByCode = async (code) => {
    throw { name: "NotImplementedError", message: "function not implemented yet!" };
}

export const getTicketsByPrefix = async (prefix) => {
    var len = prefix.length;
    var head = prefix.slice(0, len-1);
    var tail = prefix.slice(len-1, len);

    var start = prefix;
    var stop = head + String.fromCharCode(tail.charCodeAt(0) + 1);

    const ticketsRef = collection(db, "ticket-info");
    const q = query(ticketsRef,
            where("__name__", '>=', start),
            where("__name__", '<', stop));
    
    // Retrieve data snapshot, first from cache, then from server
    var data = [];
    if (cache.ticketData && cache.ticketData.length > 0) {
        data = cache.ticketData;
    } else {
        const snap = await getDocs(q);

        snap.forEach( (doc) => {
            var d = doc.data();
            d.id = data.length+1;
            d.code = doc.id;
            data.push(d);
        });

        cache.ticketData = data;
    }
    return data;
}

export const getUserShopTag = async (uid) => {
    var tag;
    if (cache.shopTag) {
        tag = cache.shopTag
    } else {
        var ref = doc(db, "users", uid);
        var snapshot = await getDoc(ref);

        if (snapshot.exists()) {
            tag = snapshot.data().shopTag;
            cache.shopTag = tag;
        } else {
            alert("No shop tag set!");
            tag = null;
        }
    }    

    return tag;
}

export const getTicketsGeneratedByUser = async (user) => {
    var prefix = await getUserShopTag(user.uid);
    return getTicketsByPrefix(prefix);
}