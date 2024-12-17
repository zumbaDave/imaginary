/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null
}

// cached the db connection
// we are doing this because the connection is serverless meaning it will open and close a connection for every request
// that could be not efficient if it happens too often, so cache the connection
// We do this because of the serverless nature of nextjs
let cached: MongooseConnection = (global as any).mongoose;

if(!cached) {
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export const connectToDatabase = async () => {
    if(cached.conn) {
        return cached.conn;
    }

    if(!MONGODB_URL) {
        throw new Error('Missing MONGODB_URL');
    }

    cached.promise = 
        cached.promise || 
        mongoose.connect(
            MONGODB_URL, 
            { dbName: 'imaginify', bufferCommands: false }
        );

    cached.conn = await cached.promise;

    return cached.conn;
}