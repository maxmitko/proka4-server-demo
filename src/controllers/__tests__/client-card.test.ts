import fetch from 'node-fetch'

const HOST = 'http://localhost:3000'
const PATH = '/client-card'
const RESPONCE_SHAPE = {
    id: expect.any(Number),
    count: expect.any(Number),
    price: expect.any(Number),
    debt: expect.any(Number),
    remainder: expect.any(Number),
    isActive: expect.any(Number),
    purchaseTime: expect.any(String),
}
let ID_BUFFER: number

describe(`GET ${PATH}`, () => {

    test('check response without id', async () => {
        const response = await fetch(`${HOST + PATH}`)

        expect(response.headers.get("content-type")).toMatch(/json/)
        expect(response.status).toBe(200)

        const responseData = await response.json()

        expect(responseData[0]).toEqual(expect.objectContaining(RESPONCE_SHAPE))

    })

    test('check response with id number 4', async () => {
        const response = await fetch(`${HOST + PATH}/4`)

        expect(response.headers.get("content-type")).toMatch(/json/)
        expect(response.status).toBe(200)

        const responseData = await response.json()

        expect(responseData).toEqual(expect.objectContaining(RESPONCE_SHAPE))
    })
})

describe(`POST ${PATH}`, () => {
    test('check /find with relations', async () => {

        const responceShape = {
            ...RESPONCE_SHAPE,
            service: expect.any(Object),
            user: expect.any(Object),
        }

        const data = {
            "relations": [
                "service",
                "user"
            ],
            "where": {
                "id": 4
            },
            "order": {
                "id": "ASC"
            }
        }

        const response = await fetch(`${HOST + PATH}/find`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        expect(response.headers.get("content-type")).toMatch(/json/)
        expect(response.status).toBe(200)

        const responseData = await response.json()

        expect(responseData[0]).toEqual(expect.objectContaining(responceShape))
    })

    test('create new item', async () => {

        const data = {
            "count": 5,
            "price": 750,
            "service": 5
        }

        const responseCreate = await fetch(`${HOST + PATH}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        expect(responseCreate.headers.get("content-type")).toMatch(/json/)
        expect(responseCreate.status).toBe(200)

        const responseData = await responseCreate.json()
        ID_BUFFER = responseData.id

        expect(responseData).toEqual(expect.objectContaining({
            id: expect.any(Number),
        }))
    })
})

describe(`PATCH/DELETE ${PATH}`, () => {

    test('update new item', async () => {
        const updateData = {
            "id": ID_BUFFER,
            "count": 5,
            "price": 750,
            "service": 5
        }

        const responseUpdate = await fetch(`${HOST + PATH}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        })

        expect(responseUpdate.status).toBe(200)
    })

    test('delete new item', async () => {

        const responseRemove = await fetch(`${HOST + PATH}/${ID_BUFFER}`, {
            method: "DELETE",
        })

        const deleteData = await responseRemove.json()
        expect(deleteData.raw.affectedRows).toBe(1)
    })
})