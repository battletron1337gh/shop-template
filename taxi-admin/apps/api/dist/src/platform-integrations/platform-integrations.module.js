"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformIntegrationsModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const platform_integrations_service_1 = require("./platform-integrations.service");
const platform_integrations_controller_1 = require("./platform-integrations.controller");
const uber_service_1 = require("./services/uber.service");
const bolt_service_1 = require("./services/bolt.service");
const queue_module_1 = require("../queue/queue.module");
let PlatformIntegrationsModule = class PlatformIntegrationsModule {
};
exports.PlatformIntegrationsModule = PlatformIntegrationsModule;
exports.PlatformIntegrationsModule = PlatformIntegrationsModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, queue_module_1.QueueModule],
        providers: [platform_integrations_service_1.PlatformIntegrationsService, uber_service_1.UberService, bolt_service_1.BoltService],
        controllers: [platform_integrations_controller_1.PlatformIntegrationsController],
        exports: [platform_integrations_service_1.PlatformIntegrationsService],
    })
], PlatformIntegrationsModule);
//# sourceMappingURL=platform-integrations.module.js.map