"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterResolver = void 0;
const Characters_1 = require("../entities/Characters");
const type_graphql_1 = require("type-graphql");
const CharacterInput_1 = require("./input/CharacterInput");
const pino = require("pino");
const logger = pino({
    prettyPrint: { colorize: true },
    level: process.env.LOG_LEVEL || "info",
}, process.stderr);
let CharacterResolver = class CharacterResolver {
    characters() {
        return Characters_1.Character.find();
    }
    character(name) {
        return Characters_1.Character.findOne({ where: { name } });
    }
    createOrUpdateCharacter(characterData) {
        return __awaiter(this, void 0, void 0, function* () {
            const charEntity = yield Characters_1.Character.findOne({
                where: { name: characterData.name },
            });
            if (!charEntity) {
                logger.info(`Creating Character ${JSON.stringify(characterData, null, 2)}`);
                return yield Characters_1.Character.create(Object.assign({}, characterData)).save();
            }
            logger.info(`Updating Character ${JSON.stringify(characterData, null, 2)}`);
            yield Characters_1.Character.update({ id: charEntity.id }, Object.assign({}, characterData));
            return yield Characters_1.Character.findOne({
                where: { name: characterData.name },
            });
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Characters_1.Character]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "characters", null);
__decorate([
    type_graphql_1.Query(() => Characters_1.Character, { nullable: true }),
    __param(0, type_graphql_1.Arg("name", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "character", null);
__decorate([
    type_graphql_1.Mutation(() => Characters_1.Character, { nullable: true }),
    __param(0, type_graphql_1.Arg("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CharacterInput_1.CharacterInput]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "createOrUpdateCharacter", null);
CharacterResolver = __decorate([
    type_graphql_1.Resolver(() => Characters_1.Character)
], CharacterResolver);
exports.CharacterResolver = CharacterResolver;
//# sourceMappingURL=characters.js.map