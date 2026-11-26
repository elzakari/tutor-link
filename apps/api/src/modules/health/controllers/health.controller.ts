import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "@tutor-link/contracts";
import { HealthService } from "../health.service";

@Controller("health")
// TODO(S1-05): mark @Public() once the deny-by-default permission guard
// lands — this route must stay reachable with no session.
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): HealthResponse {
    return this.healthService.check();
  }
}
