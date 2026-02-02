const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://pankajverma141414_db_user:8J1VvYnEKv2vCwGl@myshop.f7on8bx.mongodb.net/';
const dbName = "TodoApp";
export const collectionName = "users";
const client = new MongoClient(url)
export const connection = async ()=>{
    const connect = await client.connect();
    return connect.db(dbName)

}