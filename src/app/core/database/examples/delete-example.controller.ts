import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { BaseService } from "../base/base.service";

@Controller("example-delete")
export class DeleteExampleController<T> {
  constructor(private readonly baseService: BaseService<T>) {}

  @Delete(":id")
  async softDelete(@Param("id") id: string) {
    await this.baseService.delete(id);
    return { message: "Entity soft deleted successfully" };
  }

  @Delete(":id/hard")
  async hardDelete(@Param("id") id: string) {
    await this.baseService.hardDelete(id);
    return { message: "Entity hard deleted successfully" };
  }

  @Post(":id/restore")
  async restore(@Param("id") id: string) {
    const restoredEntity = await this.baseService.restore(id);
    return { message: "Entity restored successfully", entity: restoredEntity };
  }

  @Get("all")
  async getAll() {
    return this.baseService.findAll();
  }

  @Get("all-including-deleted")
  async getAllIncludingDeleted() {
    return this.baseService.findAllIncludingDeleted();
  }
}
