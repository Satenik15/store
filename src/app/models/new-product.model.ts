import { IProfile } from "./profile.interface";

export interface INewProduct {
    cost: number;
    description: string;
    name: string;
    profile: IProfile;
    sku: string;
}