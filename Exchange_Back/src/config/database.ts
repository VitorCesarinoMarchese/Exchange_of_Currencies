import {connect} from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const conn = async ()=>{
    const atlas = await connect(process.env.MONGODB as string)
}

export default conn