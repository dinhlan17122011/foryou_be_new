import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const ObjectId = Schema.ObjectId;

const cakeModels = new Schema({
    image :{type : String},
    namecake:{type : String},
    describe : {type:String},
    price :{type:Number},
    category:{type:String},
    size:[{
        image:{type:String},
        price:{type : Number},
        size:{type:String}
    }],
    code:{type:String}
});

const MyModel = model('cake', cakeModels);

export default MyModel;
