import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const ObjectId = Schema.ObjectId;

const cakeModels = new Schema({
    id:{type:ObjectId},
    name:{type:String},
    size:[{
        image:{type:String},
        price:{type : Number},
        size:{type:String}
    }],
    describe : {type:String},
    category: { type: String},
    code:{type:String}
});

const MyModel = model('cake', cakeModels);

export default MyModel;
