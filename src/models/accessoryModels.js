import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const ObjectId = Schema.ObjectId;

const accessoryModels = new Schema({
    id:{type:ObjectId},
    image:{type : String,required: true},
    name:{type:String,required: true},
    price:{type:Number,required: true},
    code:{type:String,required: true}
});

const MyModel = model('accessory', accessoryModels);

export default MyModel;
