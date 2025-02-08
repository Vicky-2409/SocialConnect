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
const postsCollection_1 = __importDefault(require("../models/postsCollection"));
const constants_1 = require("../utils/constants");
class PostRepository {
    addPost(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield postsCollection_1.default.create(postData);
            }
            catch (error) {
                throw new Error(constants_1.MESSAGES.POST_CREATION_ERROR);
            }
        });
    }
}
exports.default = PostRepository;
;
