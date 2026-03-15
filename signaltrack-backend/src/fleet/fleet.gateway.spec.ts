import { Test, TestingModule } from '@nestjs/testing';
import { FleetGateway } from './fleet.gateway';
import { FleetService } from './fleet.service';

// ← fără niciun import pentru describe/it/beforeEach/expect

describe('FleetGateway', () => {
  let gateway: FleetGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FleetGateway, { provide: FleetService, useValue: {} }],
    }).compile();

    gateway = module.get<FleetGateway>(FleetGateway);
  });

  it('should be defined', () => {
    // ← fără await, expect e sincron
    expect(gateway).toBeDefined();
  });
});
