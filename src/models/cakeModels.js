import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const ObjectId = Schema.ObjectId;

const cakeModels = new Schema({
    id:{type:ObjectId},
    image :{type : String,required: true},
    name:{type : String,required: true},
    describe : {type:String,required: true},
    price :{type:Number,required: true},
    category:{type:String,required: true},
    size:[{
        image:{type:String,required: true},
        price:{type : Number,required: true},
        size:{type:String,required: true}
    }],
    code:{type:String,required: true}
});

const MyModel = model('cake', cakeModels);

export default MyModel;
