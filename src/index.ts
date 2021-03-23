import express, {Application, Request, Response} from 'express'
import dotenv from 'dotenv';
import connectDB from '../src/db/connection'
import path from 'path'
import bodyParser from 'body-parser';
import cors from 'cors'

import apiV1 from './routes/v1'

dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT:string = process.env.PORT!;
const app:Application = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

__dirname
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'views/index.html')))

apiV1(app);

app.use((req:Request, res:Response) => {
    res.status(404).send("NOT FOUND");
});

connectDB().then((connected:boolean)=>{
    if(connected){
        app.listen(PORT, () => {
            console.log('running on ' + PORT);
        });
    }else{
        console.log(' erro coneect DB ')
    }
})
