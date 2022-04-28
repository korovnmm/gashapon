/**
 * @jest-environment node
 */
import { generateTickets, call } from 'api'
import {
    createUserWithEmailAndPassword,
    getAuth
} from 'auth'
import {
    cache,
    getTicketByCode,
    getPrizeByCode,
    getTicketsByPrefix,
    getUserShopTag,
    getTicketsGeneratedByUser,
    getPrizeInfo,
    getPrizeMetaData,
    saveTicketsToMemory,
    savePrizesToMemory,
    getPrizesGeneratedByUser,
    clearCachedData
} from 'db';

// Setup
let auth = getAuth();
let exampleUserEmail = "db@example.com";
let examplePassword = "DBpassword123";
let dummyTicketData = [
    {
        code: "db-XYZ123",
        createdAt: { seconds: 0, nanoseconds: 0 },
        email: "email@example.com",
        memo: "memo",
        orderID: "ABC123",
        prizeID: "123ABC",
        status: null
    },
];
let dummyPrizeData = {
    createdAt: { seconds: 0, nanoseconds: 0 },
    creatorUserID: "",
    description: "a description",
    image: "example.com/example.png",
    lastModified: { seconds: 1, nanoseconds: 1 },
    name: "prize name",
    quantity: 99
}
beforeAll(() => {
    return createUserWithEmailAndPassword(auth, exampleUserEmail, examplePassword)
        .then(() => {
            return call("userLoggedIn")
                .then((json) => {
                    expect(json.data.result).toMatch("created");
                    dummyPrizeData["creatorUserID"] = auth.currentUser.uid;
                    return;
                });
        });
});
afterAll(async () => {
    await auth.currentUser.delete();
});



// --- Tests ---

// Deleting
test("clearCachedData", async () => {
    saveTicketsToMemory(dummyTicketData);
    savePrizesToMemory(dummyPrizeData);
    
    const tickets = cache.ticketData;
    const prizes = cache.prizeData;
    expect(tickets.length).toBe(1);
    expect(prizes.length).toBe(1);

    clearCachedData();

    const tickets2 = await getTicketsGeneratedByUser(auth.currentUser);
    const prizes2 = await getPrizesGeneratedByUser(auth.currentUser);
    expect(tickets2.length).toBe(0);
    expect(prizes2.length).toBe(0);
});

test("deletePrize", () => {
    return;
});



// Saving
test("saveTicketsToMemory", async () => {
    const result = saveTicketsToMemory(dummyTicketData);
    expect(result).toMatchObject(dummyTicketData);
    expect(result.length).toBe(1);

    const result2 = await getTicketsGeneratedByUser(auth.currentUser);
    expect(result2).toMatchObject(dummyTicketData);
    expect(result2[0].id).toBeDefined();
    expect(result2.length).toBe(1);
});

test("savePrizesToMemory", async () => {
    const result = savePrizesToMemory(dummyPrizeData);
    expect(result).toMatchObject([dummyPrizeData]);
    expect(result.length).toBe(1);

    const result2 = cache.prizeData;
    expect(result2).toMatchObject([dummyPrizeData]);
    expect(result2[0].id).toBeDefined();
    expect(result2.length).toBe(1);
});



// Getters
test("getTicketByCode", async () => {
    /*const result = await getTicketByCode("");
    expect(result).toMatchObject({ 
        name: "NotImplementedError", 
        message: "function not implemented yet!" 
    });*/
    return;
});

test("getPrizesByCode", async () => {
    /*const result = await getPrizeByCode("");
    expect(result).toMatchObject({
        name: "NotImplementedError",
        message: "function not implemented yet!"
    });*/
    return;
});

test("getTicketsByPrefix", async () => {
    return; 
    /* TODO: need to implement async locks for this to work
    const noTickets = await getTicketsByPrefix("db");
    console.info(noTickets);
    expect(noTickets.length).toBe(0);

    await generateTickets(exampleUserEmail, "memo text", 3);
    const result = await getTicketsByPrefix("db");
    console.info(result);
    for (let ticket of result) {
        expect(ticket.code.substring(0,3)).toMatch("db-");
        expect(ticket.memo.toMatch("memo text"));
    }
    expect(result.length).toBe(3);
    */
});

test("getUserShopTag", async () => {
    const shopTag = await getUserShopTag(auth.currentUser);
    expect(shopTag).toMatch("db");
});

test("getTicketsGeneratedByUser", () => {
    return;
});

test("getPrizesGeneratedByUser", () => {
    return;
});

test("getPrizeInfo", async () => {
    const prizeData = {
        description: "It's awesome!!!",
        image: "assume we have uploaded an image earlier, its url goes here",
        name: "Awesome Prize #1",
        quantity: 5
    };

    const prizeID = await call("addNewPrize", prizeData)
        .then((result) => {
            return result.data.id;
        });

    let infoData = await getPrizeInfo(prizeID);
    expect(infoData).toMatchObject({
        name: prizeData.name,
        description: prizeData.description,
        image: prizeData.image,
        lastModified: expect.any(Object)
    });
    expect(Object.keys(infoData).length).toBe(4);
});


test("getPrizeMetaData", async () => {
    const prizeData = {
        description: "It's awesome!!!",
        image: "assume we have uploaded an image earlier, its url goes here",
        name: "Awesome Prize #2",
        quantity: 10
    };

    const prizeID = await call("addNewPrize", prizeData)
        .then((result) => {
            return result.data.id;
        });

    let prizeMetaData = await getPrizeMetaData(prizeID);
    expect(prizeMetaData).toMatchObject({
        createdAt: expect.any(Object),
        creatorUserID: auth.currentUser.uid,
        quantity: prizeData.quantity
    });
    expect(Object.keys(prizeMetaData).length).toBe(3);
});

