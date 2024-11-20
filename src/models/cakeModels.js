import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const ObjectId = Schema.ObjectId;

const cakeModels = new Schema({
    id:{type:ObjectId},
    image :{type : String},
    name:{type : String},
    describe : {type:String},
    price :{type:Number},
    // category:{type:String},
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    size:[{
        image:{type:String},
        price:{type : Number},
        size:{type:String}
    }],
    code:{type:String}
});

const MyModel = model('cake', cakeModels);

export default MyModel;
