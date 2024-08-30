import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import Listing from '../models/listing.js';
import sampleListings from '../init/data.js';


main()
.then(()=>{console.log('app connected')})
.catch((err)=>{console.log(err)})


async function main() {
    await mongoose.connect('mongodb+srv://samyak-baid:0NaLn9BuumDiU59R@cluster46575.pqnobu8.mongodb.net/');}


const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log('data intialized ')

}
initDB();