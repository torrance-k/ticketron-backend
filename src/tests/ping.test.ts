import request from 'supertest'
import express from 'express'

const app = express()

app.get('/ping', (req, res) => {
    res.json({message: 'pong'})
})

describe('Ping route', () => {
    it('should respond with pong', async () => {
        const res = await request(app).get('/ping')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: 'pong' })
    })
})