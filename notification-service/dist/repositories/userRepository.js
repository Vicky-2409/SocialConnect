"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userCollection_1 = __importDefault(require("../models/userCollection"));
const constants_1 = require("../utils/constants");
class UserRepository {
    addUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof userData._id === "string") {
                    userData._id = new mongoose_1.Types.ObjectId(userData._id);
                }
                yield userCollection_1.default.create(userData);
                return constants_1.MESSAGES.USER_ADDED_SUCCESS;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let _id;
                if (typeof userId === "string") {
                    _id = new mongoose_1.Types.ObjectId(userId);
                }
                else {
                    _id = userId;
                }
                const userData = yield userCollection_1.default.findOne(_id);
                if (!userData)
                    throw new Error(constants_1.MESSAGES.USER_NOT_FOUND);
                return userData;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    updateUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = new mongoose_1.Types.ObjectId(userData._id);
                const user = yield userCollection_1.default.findOne({ _id });
                if (!user) {
                    throw new Error(constants_1.MESSAGES.USER_NOT_FOUND); // Use constant message
                }
                const updatedUser = Object.assign(Object.assign({}, user._doc), userData);
                yield userCollection_1.default.findOneAndUpdate({ _id }, { $set: updatedUser });
                return constants_1.MESSAGES.USER_UPDATED_SUCCESS;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = UserRepository;
