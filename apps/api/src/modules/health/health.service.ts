import { Injectable } from "@nestjs/common";
import type { HealthResponse } from "@tutor-link/contracts";

@Injectable()
export class HealthService {
  check(): HealthResponse {
    return { status: "ok" };
  }
}
