import { Client, TablesDB, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID

//connection project
const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

//connection Database
const database = new TablesDB(client)

// storing search term into database with counter to idenify which is more searched
export const storingSearchToDataBase = async (searchTerm , movie ) => {
    // check if searchterm exist in database
    try {
        const result =await database.listRows(DATABASE_ID , TABLE_ID ,[
            Query.equal('searchTerm' , searchTerm),
        ])

        //if it does update the count
        if(result.rows.length > 0) {
            const row = result.rows[0];
            await database.updateRow(DATABASE_ID , TABLE_ID , row.$id , {
                count: row.count + 1,
            })
            //if not create new
        } else {
            await database.createRow(DATABASE_ID , TABLE_ID , ID.unique() , {
                searchTerm,
                movie_id : movie.id,
                count:1,
                poster_url : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            })
        }
    } catch (error) {
        console.log(error);
        
    }
}

// fetching trending movies from database
export const fetchingTrendingMovies =async () => {
    try {
        const result =await database.listRows(DATABASE_ID , TABLE_ID , [
            Query.limit(5),
            Query.orderDesc('count'),
        ])
        // console.log(result);
        return result.rows
    } catch (error) {
        console.log(error);
        
    }
}