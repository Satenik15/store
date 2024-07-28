import { IProfile } from "./profile.interface";

export interface IProduct {
    cost: number;
    description: string;
    id: number;
    name: string;
    profile: IProfile;
    sku: string;
}