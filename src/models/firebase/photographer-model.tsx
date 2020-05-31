import DeviceModel from "./device-model";

export default class PhotographerModel {
  firstName: string;
  lastName: string;
  birthDate: Date;
  phone: string;
  cpf: string;
  zipCode: string;
  street: string;
  number: number;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  country: string;
  email: string;
  photo: string;
  document: string;
  active: boolean;
  permission: boolean;
  createdAt: Date;
  devices?: DeviceModel[];
  photographerId: string;
  portfolioImages: string[];
  currentMoney: number;
  ratingCount: number;
  ratingSum: number;
}