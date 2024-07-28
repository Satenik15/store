import { DialogModeType } from "./dialog-mode.type";
import { IProduct } from "./product.interface";

export interface IDialogData extends Partial<IProduct> {
    mode: DialogModeType;
}