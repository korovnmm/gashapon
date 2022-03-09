import { generateTickets, call } from 'api'
import {
    createUserWithEmailAndPassword,
    getAuth
} from 'auth'
import {
    getTicketByCode, // TODO: unit test for this
    getPrizeByCode, // TODO: unit test for this
    getTicketsByPrefix,
    getUserShopTag,
    getTicketsGeneratedByUser,
    getPrizeInfo,
    getPrizeMetaData
} from 'db';

// Setup
let auth = getAuth();
let exampleUserEmail = "db@example.com";
let examplePassword = "DBpassword123";
beforeAll(() => {
    return createUserWithEmailAndPassword(auth, exampleUserEmail, examplePassword)
        .then(() => {
            return call("userLoggedIn")
                .then((json) => {
                    expect(json.data.result).toMatch("created");
                    return;
                });
        });
});
afterAll(() => {
    return auth.currentUser.delete();
});



// --- Tests ---

test("getPrizeInfo", async () => {
    const prizeData = {
        description: "It's awesome!!!",
        image: "assume we have uploaded an image earlier, its url goes here",
        name: "Awesome Prize #1",
        quantity: 5
    };

    let prizeID = await call("addNewPrize", prizeData)
        .then((result) => {
            return result.data[Object.keys(result.data)[0]];
        });

    let infoData = await getPrizeInfo(prizeID);
    expect(infoData).toMatchObject({
        name: prizeData.name,
        description: prizeData.description,
        image: prizeData.image,
        lastModified: expect.any(String)
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

    let prizeID = await call("addNewPrize", prizeData)
        .then((result) => {
            return result.data[Object.keys(result.data)[0]];
        });

    let prizeMetaData = await getPrizeMetaData(prizeID);
    expect(prizeMetaData).toMatchObject({
        createdAt: expect.any(String),
        creatorUserID: auth.currentUser.uid,
        quantity: prizeData.quantity
    });
    expect(Object.keys(prizeMetaData).length).toBe(3);
});