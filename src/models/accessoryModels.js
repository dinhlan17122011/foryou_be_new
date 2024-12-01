import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
const ObjectId = Schema.ObjectId;

const accessoryModels = new Schema({
    id:{type:ObjectId},
    image:{type : String},
    name:{type:String},
    price:{type:Number},
    code:{type:String}
});

const MyModel = model('accessory', accessoryModels);

export default MyModel;
