import { IProfile } from "./profile.interface";

export interface IEditProduct {
    cost: number;
    description: string;
    name: string;
    profile: IProfile;
}