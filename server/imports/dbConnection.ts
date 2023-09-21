import { MongoClient, Db } from "mongodb";
import url from "url";

// Create cached connection variable
let cachedDb: Db;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
const getDatabaseConnection = async (): Promise<Db> => {
  if (cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI;
  // console.log('connectionUri', uri)

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri);

  // console.log('here')

  // Select the database through the connection,
  // using the database path of the connection string
  // const db = await client.db('union-platform');
  const db = await client.db(url.parse(uri).pathname.substr(1));
  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
};
export default getDatabaseConnection;
