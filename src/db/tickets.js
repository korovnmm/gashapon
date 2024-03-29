import { db } from '../firebase'
import {
    collection,
    doc,
    getDoc, 
    getDocs,
    query,
    where,
} from 'firebase/firestore'

import{cache, cacheAsArray, getUserShopTag} from "db"

/**
 * Saves ticket data to memory so that it can be accessed without reading from the database.
 * @param {*} data ticket data to cache
 * @returns an array of currently cached ticket data
 */
export function saveTicketsToMemory(data) {
    return cacheAsArray("ticketData", data);
}


/**
 * Retrieves JSON object info of a single ticket from the database
 * @param {string} code a ticket's play code (must exist on the database first)
 * @returns {Promise<any>} JSON data for the ticket
 */
export const getTicketByCode = async (code) => {
    let result;
    const ticketRef = doc(db, "ticket-info", code);
    const snap = await getDoc(ticketRef); // waits for the returned promise to resolve

    if (snap.exists()) {
        result = snap.data();
    }

    return result;
}


/**
 * Queries the database for all tickets containing a specific prefix.
 * @param {*} prefix the prefix to query for
 * @returns an array list of tickets with the matching prefix, array is empty if no results were found
 */
export const getTicketsByPrefix = async (prefix) => {
    var len = prefix.length;
    var head = prefix.slice(0, len - 1);
    var tail = prefix.slice(len - 1, len);

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

        snap.forEach((doc) => {
            var d = doc.data();
            d.id = data.length + 1;
            d.code = doc.id;
            data.push(d);
        });

        saveTicketsToMemory(data);
    }
    return data;
}


/**
 * Takes an auth context user object and returns a list of tickets generated by that user.
 * @param {*} user the auth context user (provided by the auth module when the user signs in) 
 * @returns an array list of tickets generated by that user
 */
export const getTicketsGeneratedByUser = async (user) => {
    var prefix = await getUserShopTag(user.uid);
    return getTicketsByPrefix(prefix);
}

