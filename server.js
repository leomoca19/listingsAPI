/********************************************************************************
* BTI425 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Leonardo de la Mora Caceres Student ID: 152877205 Date: Jan-15-2025
*
* Published URL: https://listings-api-eight.vercel.app
*
********************************************************************************/

const express = require('express')
const cors = require('cors')
const config = require('dotenv').config()  
const path = require('path')
const ListingsDB = require('./modules/listingsDB.js')
const db = new ListingsDB()

const HTTP_PORT = 8080;

const app = express()

app.use(cors())
app.use(express.json())

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`)
    })
}).catch((err)=>{
    console.log(err)
})

app.get('/', (req, res) =>{
    res.send({message: "API Listening"})
})

app.post('/api/listings', async (req, res) => {
    
    try {
        const newListing = await db.addNewListing(req.body)
        res.status(200).json(newListing)
    } catch (err) {
        console.log(err)
        res.json(500)
    }

})
        
app.get('/api/listings', async (req, res) => {

    try {
        const page = parseInt(req.query.page)
        const perPage = parseInt(req.query.perPage)
        const name = req.query.name || null

        res.status(200).json(await db.getAllListings(page, perPage, name))
    } catch (err) { 
        console.log(err)
        res.status(500)
    }

})

app.get('/api/listings/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const listing = await db.getListingById(id)

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found'})
        }

        res.status(200).json(listing)
    } catch (err) { 
        console.log(err)
        res.status(500)
    }
})

app.put('/api/listing/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const updatedListing = await db.updateListingById(data, id)

        if (!updatedListing) {
            return res.status(404).json({ error: 'Listing not found' })
        }

        res.status(200).json(listing)
    } catch (err) { 
        console.log(err)
        res.status(500)
    }

})

app.delete('/api/listings/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const deletedListing = await db.deleteListingById(id)

        if (!deletedListing) {
            return res.status(404).json({ error: 'Listing not found'})
        }
        
        res.status(200).json({
            message: 'successful delete', 
            data: deletedListing
        })
    } catch (err) { 
        console.log(err)
        res.status(500)
    }
})
