"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRideDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ride_dto_1 = require("./create-ride.dto");
class UpdateRideDto extends (0, swagger_1.PartialType)(create_ride_dto_1.CreateRideDto) {
}
exports.UpdateRideDto = UpdateRideDto;
//# sourceMappingURL=update-ride.dto.js.map