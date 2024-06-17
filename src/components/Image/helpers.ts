import { IMAGE_TYPE_MAP } from './constants';

export const getImagePath = (id: string) => `/images/${id}.${IMAGE_TYPE_MAP[id]}`;
