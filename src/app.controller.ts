import { Controller, Get } from '@nestjs/common';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';

@Controller()
export class AppController {

  constructor(private administratorService: AdministratorService){}

  @Get()
  getHello(): string {
    return "Hello...";
  }

  @Get("world")
  getWorld(): string {
    return "World...";
  }

  @Get("api/administrator")
  getAllAdministrator(): Promise<Administrator[]>{
    return this.administratorService.getAll();
  }

  @Get("api/administrator/:id")
  getAdministrator(id): Promise<Administrator>{
    return this.administratorService.getById(3);
  }
}
