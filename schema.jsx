import { Schema, arrayOf } from 'normalizr';

export const pi = new Schema('pis');
export const arrayOfPis = arrayOf(pi);
